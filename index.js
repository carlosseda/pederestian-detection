( async () => {

  global.__basedir = __dirname
  require('dotenv').config()

  const IORedis = require('ioredis')
  const fs = require('fs')

  const redisClient = new IORedis(process.env.REDIS_URL)
  const subscriberClient = new IORedis(process.env.REDIS_URL)
  const eventsPath = './src/events/'

  fs.readdirSync(eventsPath).forEach(function (file) {
    require(eventsPath + file).handleEvent(redisClient, subscriberClient)
  })

  const TelegramService = require('./src/services/telegram-service.js')
  
  const telegramService = new TelegramService(process.env.API_TG_BOT)
  telegramService.setRedisClient(redisClient)

  global.__telegramService = telegramService
})()
