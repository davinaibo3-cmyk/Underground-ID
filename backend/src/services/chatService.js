const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompts = {
  en: 'You are Underground ID, an intelligent AI assistant helping users across all devices. Friendly, helpful, accurate. Activate with "High ID". Always be concise, engaging, and provide excellent information.',
  de: 'Du bist Underground ID, ein intelligenter KI-Assistent. Freundlich, hilfreich, prägnant. Aktivierbar mit "High ID". Gib immer hervorragende Informationen.',
  fr: 'Vous êtes Underground ID, un assistant IA intelligent. Amical, utile, concis. Activable avec "High ID". Fournissez toujours des informations excellentes.',
  es: 'Eres Underground ID, un asistente de IA inteligente. Amable, útil, conciso. Activable con "High ID". Proporciona siempre información excelente.',
  it: 'Sei Underground ID, un assistente IA intelligente. Amichevole, utile, conciso. Attivabile con "High ID". Fornisci sempre informazioni eccellenti.',
  pt: 'Você é Underground ID, um assistente de IA inteligente. Amigável, útil, conciso. Ativável com "High ID". Sempre forneça informações excelentes.',
  ja: 'あなたはUnderground IDです。インテリジェントなAIアシスタント。親切、有用、簡潔。"High ID"で起動可能。常に優れた情報を提供してください。',
  zh: '你是Underground ID，一个智能AI助手。友好、有用、简洁。可通过"High ID"激活。始终提供优质信息。'
};

class ChatService {
  async generateResponse(messages, userId, language = 'en') {
    try {
      const systemPrompt = systemPrompts[language] || systemPrompts['en'];
      
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
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

  async processMessage(message, userId, language = 'en', conversationHistory = []) {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const reply = await this.generateResponse(messages, userId, language);
      
      return {
        success: true,
        reply: reply,
        language: language,
        timestamp: new Date(),
        userId: userId,
        messageCount: messages.length
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }

  async summarizeConversation(messages, language = 'en') {
    try {
      const summaryPrompts = {
        en: 'Summarize this conversation in 2-3 sentences:',
        de: 'Fassen Sie dieses Gespräch in 2-3 Sätzen zusammen:',
        fr: 'Résumez cette conversation en 2-3 phrases:',
        es: 'Resuma esta conversación en 2-3 oraciones:',
        it: 'Riassumiamo questa conversazione in 2-3 frasi:',
        pt: 'Resuma esta conversa em 2-3 frases:',
        ja: 'この会話を2〜3文で要約してください：',
        zh: '用2-3句话总结这次对话:'
      };

      const summaryPrompt = summaryPrompts[language] || summaryPrompts['en'];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: summaryPrompt + '\n' + JSON.stringify(messages) }
        ],
        temperature: 0.5,
        max_tokens: 150
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Summary error:', error);
      return 'Unable to generate summary';
    }
  }
}

module.exports = new ChatService();
