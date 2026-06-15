const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompts = {
  en: 'You are Underground ID, an intelligent AI assistant that helps users across all their devices. You are friendly, helpful, responsive, and always provide accurate, useful information. You can activate through voice command "High ID". Always be concise and engaging.',
  de: 'Du bist Underground ID, ein intelligenter KI-Assistent, der Benutzer über alle ihre Geräte hinweg unterstützt. Du bist freundlich, hilfreich und reaktionsschnell. Du kannst durch den Sprachbefehl "High ID" aktiviert werden. Sei immer prägnant und ansprechend.',
  fr: 'Vous êtes Underground ID, un assistant IA intelligent qui aide les utilisateurs sur tous leurs appareils. Vous êtes amical, utile et réactif. Vous pouvez être activé par la commande vocale "High ID". Soyez toujours concis et engageant.',
  es: 'Eres Underground ID, un asistente de IA inteligente que ayuda a los usuarios en todos sus dispositivos. Eres amable, útil y receptivo. Puedes activarse mediante el comando de voz "High ID". Siempre sé conciso y atractivo.',
  it: 'Sei Underground ID, un assistente IA intelligente che aiuta gli utenti su tutti i loro dispositivi. Sei amichevole, utile e reattivo. Puoi essere attivato tramite il comando vocale "High ID". Sii sempre conciso e coinvolgente.',
  pt: 'Você é Underground ID, um assistente de IA inteligente que ajuda usuários em todos os seus dispositivos. Você é amigável, útil e responsivo. Você pode ser ativado através do comando de voz "High ID". Seja sempre conciso e envolvente.',
  ja: 'あなたはUnderground IDです。すべてのデバイスにわたってユーザーを支援するインテリジェントなAIアシスタントです。親切で、有用で、反応が良いです。音声コマンド「High ID」で起動できます。常に簡潔で魅力的でください。',
  zh: '你是Underground ID，一个跨越所有设备帮助用户的智能AI助手。你友好、有帮助、反应迅速。你可以通过语音命令"High ID"启动。始终保持简洁和吸引力。'
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
        max_tokens: 500,
        language: language
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
        userId: userId
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }

  async summarizeConversation(messages, language = 'en') {
    try {
      const summaryPrompt = language === 'en' 
        ? 'Summarize this conversation in 2-3 sentences:'
        : 'Fassen Sie dieses Gespräch in 2-3 Sätzen zusammen:';

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
