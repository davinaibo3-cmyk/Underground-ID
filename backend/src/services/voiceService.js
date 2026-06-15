class VoiceService {
  async detectActivation(audioData) {
    try {
      return {
        detected: true,
        phrase: 'high id',
        confidence: 0.95
      };
    } catch (error) {
      console.error('Voice detection error:', error);
      return { detected: false, error: error.message };
    }
  }
  async processCommand(audioData) {
    try {
      return {
        success: true,
        command: 'chat_start',
        message: 'Starting chat mode'
      };
    } catch (error) {
      console.error('Command processing error:', error);
      return { success: false, error: error.message };
    }
  }
}
module.exports = new VoiceService();
