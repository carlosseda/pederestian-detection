const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')

class StreamRTSPService {
  constructor(rtspUrl, outputDir='/src/storage/shoots') {
    this.rtspUrl = rtspUrl
    this.outputDir = path.join(global.__basedir, outputDir)

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  async takeSnapshot() {
    const outputFilePath = path.join(this.outputDir, `snapshot_${Date.now()}.jpg`)
    
    try{
      return new Promise((resolve,  reject) => {
        ffmpeg(this.rtspUrl)
          .outputOptions('-frames:v 1')
          .on('end', () => {
            const filename = outputFilePath;
            resolve({success: true,  filename})
          })
          .on('error', (err) => {
            resolve({success: false})
          })
          .save(outputFilePath)
      })
    }catch(error){
      console.error('Error al tomar la captura:', error)
    }
  }
}

module.exports = StreamRTSPService