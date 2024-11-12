
const StreamRTSPService = require('../services/stream-rtsp-service.js')
const ImageAnalysisService = require('../services/image-analysis-service.js')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-snapshot', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-snapshot') {
      const data = JSON.parse(message)
      const streamRTSPService = new StreamRTSPService(process.env.RTSP_URL)
      const response =  await streamRTSPService.takeSnapshot()

      if(response.success){
        const imageAnalysisService = new ImageAnalysisService()
        const numberPeople = await imageAnalysisService.runYoloDetection(response.filename, 'person')
        // const numberPeople = await imageAnalysisService.runCocoSsdDetection(response.filename, 'person')

        global.__telegramService.sendMessage(data.chatId, "Hay " + numberPeople + " personas en la imagen")
      }
    }
  })
}