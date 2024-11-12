const tf = require('@tensorflow/tfjs-node')
const cocoSsd = require('@tensorflow-models/coco-ssd')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

class ImageAnalysisService {

  constructor() {
    this.model = null
  }

  loadImage(filePath) {
    const imageBuffer = fs.readFileSync(filePath)
    const decodedImage = tf.node.decodeImage(imageBuffer, 3)
    return decodedImage
  }

  async runCocoSsdDetection(imagePath, objectToDetect) {
    try {
      this.model = await cocoSsd.load()
      const image = this.loadImage(imagePath)
      const predictions = await this.model.detect(image)
      const objectCount = predictions.filter(prediction => prediction.class === objectToDetect).length

      image.dispose()
      tf.dispose(image)

      return objectCount
    }catch(error){
      console.error("Error al contar personas en la imagen:", error)
      return 0
    }
  }

  async runYoloDetection(imagePath, objectToDetect) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [path.join(global.__basedir, '/src/yolo/object-detect.py'), imagePath])
  
      let result = ''

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString()
      })
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`)
      })
  
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const objectsDetected = JSON.parse(result)
            console.log(objectsDetected)

            if (objectsDetected.length > 0) {
              const objects = objectsDetected.filter(object => object.label === objectToDetect)
              resolve(objects.length)
            }else{
              resolve(0)
            }
          } catch (e) {
            reject(`Error al parsear JSON: ${e}`)
          }
        } else {
          reject(`El proceso de Python terminó con código ${code}`)
        }
      })
    })
  }
}

module.exports = ImageAnalysisService
