const fs = require('fs'); 
const fsPromises = require('fs').promises
const path = require('path');

class LogService {
  constructor(logFile) {
    this.logFile = path.join(global.__basedir, '/src/storage/logs/', logFile)
  }

  async logMessage({ timestamp, filename, errorMessage = null }) {

    let logEntry = ''

    if(errorMessage){
      logEntry = `${timestamp},  ${errorMessage}\n`
    }else{
      logEntry = `${timestamp}, Ejecución exitosa del archivo ${filename}\n`
    }
    
    try {
      await fsPromises.appendFile(this.logFile, logEntry) 
      console.log('Log entry added:', logEntry.trim())
    } catch (err) {
      console.error('Error writing to log file:', err)
    }
  }
}

module.exports = LogService;
