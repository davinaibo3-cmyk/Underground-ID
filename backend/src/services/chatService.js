const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
class ChatService {
  async generateResponse(messages, userId) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Underground ID, an intelligent AI assistant that helps users across all their devices. You are friendly, helpful, and can activate through voice command High ID.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Failed to generate response');
    }
  }
  async processMessage(message, userId, conversationHistory = []) {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: message }
      ];
      const reply = await this.generateResponse(messages, userId);
      return reply;
    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }
}
module.exports = new ChatService();
