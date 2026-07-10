/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared/services/chatbotApi.js
 */

const CHATBOT_API_URL =
  import.meta.env.VITE_RAG_CHAT_URL || 'http://localhost:3000/api/v1/chat';

const chatbotApi = {
  /**
   * Gửi câu hỏi tới API Chatbot RAG.
   *
   * @param {{ projectId?: number|string, project_id?: number|string, message: string }} payload
   * @returns {Promise<{ success: boolean, answer: string, table: { columns: Array, data: Array } | null }>}
   */
  sendMessage: async ({ projectId, project_id, message }) => {
    const resolvedProjectId = project_id ?? projectId;

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: Number(resolvedProjectId),
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chatbot API error: ${response.status}`);
    }

    return response.json();
  },
};

export default chatbotApi;
