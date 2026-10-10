import os
import uuid
import json
from io import BytesIO
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai
from google.genai import types
from gtts import gTTS

load_dotenv()

app = FastAPI(title="Sarkari Saathi Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

# Session management
sessions: Dict[str, Any] = {}

class SchemeRequest(BaseModel):
    session_id: str
    language: str

class AudioRequest(BaseModel):
    text: str
    language: str

GTTS_LANG_MAP = {
    'Hindi': 'hi', 'English': 'en', 'Bhojpuri': 'hi', 'Bengali': 'bn',
    'Tamil': 'ta', 'Telugu': 'te', 'Marathi': 'mr', 'Gujarati': 'gu',
    'Kannada': 'kn', 'Malayalam': 'ml', 'Punjabi': 'pa', 'Urdu': 'ur',
    'Odia': None
}

@app.post("/api/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    language: str = Form(...)
):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    try:
        file_bytes = await file.read()
        detected_mime_type = file.content_type
        if not detected_mime_type:
            detected_mime_type = "application/pdf"
            
        file_part = types.Part.from_bytes(data=file_bytes, mime_type=detected_mime_type)
        
        prompt_text = f"""
        Analyze this document. The user wants the response in {language}.
        Reply ONLY in {language}, using its native script (Devanagari for Hindi/Bhojpuri/Marathi).
        English must be plain and simple. Hindi must be simple everyday Hindi, not formal or Sanskritised.
        {"Bhojpuri must use authentic Bhojpuri language in Devanagari script." if language == "Bhojpuri" else ""}
        Keep numbers, dates, amounts and names exactly as in the document.
        Do NOT invent amounts, dates, deadlines, eligibility criteria, or penalties. If information is not clearly stated in the document, use 'Not found'.
        """
        
        if question:
            prompt_text += f"\nThe user also asks: {question}\n"
            
        prompt_text += f"""
        Return a JSON object with the following structure:
        {{
          "analysis": {{
            "doc_type": "string",
            "issuer": "string",
            "key_fields": [{{"label": "string", "value": "string"}}],
            "amount_due": "string",
            "deadline": "string",
            "penalty": "string",
            "required_actions": ["string"],
            "urgency": "high|medium|low"
          }},
          "explanation": "Simple explanation of what this document means in 3-5 sentences",
          "next_steps": [{{"step": 1, "title": "string", "description": "string", "deadline": "string"}}],
          "draft_reply": "A formal reply/application letter the person can send in response",
          "disclaimer": "Write 'Guidance only, verify with the official office.' translated into {language}"
        }}
        """

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[file_part, prompt_text],
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        try:
            result_json = json.loads(response.text)
        except json.JSONDecodeError:
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            result_json = json.loads(clean_text)
            
        session_id = str(uuid.uuid4())
        
        sessions[session_id] = {
            "analysis": result_json.get("analysis", {}),
            "explanation": result_json.get("explanation", ""),
            "language": language
        }
        
        return {
            "session_id": session_id,
            **result_json
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/schemes")
async def get_schemes(req: SchemeRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    session_data = sessions.get(req.session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    try:
        analysis = session_data["analysis"]
        doc_type = analysis.get("doc_type", "document")
        issuer = analysis.get("issuer", "government")
        
        schemes_prompt = f"""
        Based on a document of type '{doc_type}' issued by '{issuer}', suggest relevant government schemes, subsidies, or assistance programs in India.
        Amount/subject: {analysis.get('amount_due', 'N/A')}. Required actions: {', '.join(analysis.get('required_actions', []))}.

        Reply ONLY in {req.language}, using its native script (Devanagari for Hindi/Bhojpuri/Marathi). English must be plain and simple. Hindi must be simple everyday Hindi, not formal or Sanskritised.
        Do NOT invent eligibility criteria or deadlines. Only include schemes you can verify through official sources.

        Format the output EXACTLY as this JSON structure:
        {{
            "schemes": [
                {{
                    "name": "string",
                    "description": "string",
                    "eligibility": "string",
                    "link": "official URL string",
                    "deadline": "string or Not found"
                }}
            ]
        }}
        """
        
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=schemes_prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
            )
        )
        
        try:
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            schemes_json = json.loads(clean_text)
        except json.JSONDecodeError:
            schemes_json = {
                "schemes": [{
                    "name": "Recommended Schemes",
                    "description": response.text,
                    "eligibility": "Refer to official portal",
                    "link": "",
                    "deadline": "N/A"
                }]
            }
            
        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
                metadata = candidate.grounding_metadata
                if hasattr(metadata, 'grounding_chunks') and metadata.grounding_chunks:
                    for chunk in metadata.grounding_chunks:
                        if hasattr(chunk, 'web') and chunk.web and hasattr(chunk.web, 'uri'):
                            uri = chunk.web.uri
                            for scheme in schemes_json.get("schemes", []):
                                if not scheme.get("link"):
                                    scheme["link"] = uri
                                    break
                                    
        return schemes_json
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/audio")
async def generate_audio(req: AudioRequest):
    lang_code = GTTS_LANG_MAP.get(req.language)
    if not lang_code:
        raise HTTPException(status_code=400, detail={"error": "Audio not available for this language"})
        
    try:
        tts = gTTS(text=req.text, lang=lang_code)
        fp = BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return StreamingResponse(fp, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "Audio generation failed"})

@app.post("/api/voice-question")
async def voice_question(
    audio: UploadFile = File(...),
    language: str = Form(...)
):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    try:
        audio_bytes = await audio.read()
        mime_type = audio.content_type
        if not mime_type:
            mime_type = "audio/webm"
            
        audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
        prompt = f"Transcribe and translate this audio to text. The user is speaking in {language}. Return only the transcribed question text, nothing else."
        
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[audio_part, prompt]
        )
        
        return {"question": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
