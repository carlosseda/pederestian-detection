const TelegramBot = require('node-telegram-bot-api')

class TelegramService {
  constructor (telegramToken) {
    this.token = telegramToken
    this.bot = new TelegramBot(this.token, { polling: true })
    this.redisClient = null

    this.bot.onText(/\/captura/, async (msg) => {
      const chatId = msg.chat.id

      this.redisClient.publish('new-snapshot', JSON.stringify({chatId}))
    });

    // this.bot.on('message', async (msg) => {
    //   const chatId = this.chatId || msg.chat.id

    //   if (msg.photo) {  
    //     await this.analyzeImage(msg, chatId)
    //   }
    // })
  }

  async setRedisClient(redisClient){
    this.redisClient = redisClient
  }

  async sendMessage (chatId, message) {
    try {
      
      await this.bot.sendMessage(chatId, message)
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
    }
  }

  async sendPhoto (chatId, filename) {
    try {
      
      await this.bot.sendPhoto(chatId, filename )
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
    }
  }

  async analyzeImage (message, chatId) {
    const fileId = message.photo[message.photo.length - 1].file_id
    try {
      const fileUrl = await this.bot.getFileLink(fileId)
      console.log(fileUrl)
    } catch (error) {
      console.error('Error al obtener la imagen:', error)
    }
  }
}

module.exports = TelegramService