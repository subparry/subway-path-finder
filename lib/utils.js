const Ajv = require('ajv')

const networkSchema = require('./networkSchema')

const ajv = new Ajv()

const extractUniqueColors = (stations) => {
  const stationNames = Object.keys(stations)
  const allowedTrainColors = stationNames.reduce((colors, station) => {
    const currentColor = stations[station].color
    if (currentColor) {
      colors.add(currentColor)
    }
    return colors
  }, new Set())
  return Array.from(allowedTrainColors)
}

const readAndValidateInput = (filename) => {
  const inputData = require(filename)
  const valid = ajv.validate(networkSchema, inputData)
  if (!valid) {
    throw new Error('Failed schema validation')
  }
  return inputData
}

const indexBackwards = (arr, idx) => arr[arr.length + idx]

module.exports = {
  extractUniqueColors,
  readAndValidateInput,
  indexBackwards,
}
