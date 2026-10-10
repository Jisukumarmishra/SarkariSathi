import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const extractError = (error) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (detail?.error) return detail.error;
  return error.response?.data?.message || error.message || 'Something went wrong.';
};

export const analyzeDocument = async (file, question, language) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    formData.append('language', language);

    const { data } = await api.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const analysis = data.analysis || {};
    return {
      sessionId: data.session_id,
      analysis: {
        docType: analysis.doc_type || 'Not found',
        issuer: analysis.issuer || 'Not found',
        keyFields: analysis.key_fields || [],
        amountDue: analysis.amount_due || 'Not found',
        deadline: analysis.deadline || 'Not found',
        penalty: analysis.penalty || 'Not found',
        requiredActions: analysis.required_actions || [],
        urgency: analysis.urgency || 'medium',
      },
      explanation: data.explanation || '',
      nextSteps: (data.next_steps || []).map(s => ({
        step: s.step,
        title: s.title,
        description: s.description,
        deadline: s.deadline,
      })),
      draftReply: data.draft_reply || '',
      disclaimer: data.disclaimer || '',
    };
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const getSchemes = async (sessionId, language) => {
  try {
    const { data } = await api.post('/schemes', {
      session_id: sessionId,
      language,
    });
    return {
      schemes: (data.schemes || []).map(s => ({
        name: s.name,
        description: s.description,
        eligibility: s.eligibility,
        url: s.link || s.url || '',
        deadline: s.deadline,
      })),
    };
  } catch (error) {
    throw new Error(extractError(error));
  }
};

export const getAudio = async (text, language) => {
  try {
    const response = await api.post('/audio', { text, language }, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    throw new Error('Audio not available');
  }
};

export const sendVoiceQuestion = async (audioBlob, language) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'question.webm');
    formData.append('language', language);

    const { data } = await api.post('/voice-question', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    throw new Error(extractError(error));
  }
};
