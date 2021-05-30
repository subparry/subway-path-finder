const {
  extractUniqueColors,
  readAndValidateInput,
  indexBackwards,
} = require('./utils')

class MetroNetwork {
  constructor(inputFilename) {
    this.inputData = readAndValidateInput(inputFilename)
    this.stations = { ...this.inputData.stations }
    this.allowedColors = extractUniqueColors(this.stations)
  }

  findShortestPath({ from, to, trainColor }) {
    this.trainColor = trainColor
    this.from = from
    this.to = to
    this.performValidations()
    this.successfulPaths = []
    this.findRecursively({ trainColor, currentPath: [from] })
  }

  performValidations() {
    if (!this.stations[this.from] || !this.stations[this.to]) {
      throw new Error('From and To stations must exist in given input file')
    }

    if (this.from === this.to) {
      throw new Error('Origin and destination must be different')
    }

    if (this.trainColor) {
      if (!this.allowedColors.includes(this.trainColor)) {
        throw new Error(
          `Train color ${this.trainColor} has no matching station`
        )
      }

      if (
        !this.trainCanVisit(this.stations[this.to]) ||
        !this.trainCanVisit(this.stations[this.from])
      ) {
        throw new Error(
          `Origin and destination stations must match train color or have no color`
        )
      }
    }
  }

  trainCanVisit(station) {
    if (!this.trainColor || !station.color) return true

    return station.color === this.trainColor
  }

  findRecursively({ currentPath, trainColor }) {
    const currentStation = indexBackwards(currentPath, -1)
    const possibleMoves = this.getNextPossibleMoves({
      from: currentStation,
      exclude: currentPath,
      color: trainColor,
    })
    if (!possibleMoves.length) return

    if (possibleMoves.includes(this.to)) {
      this.successfulPaths.push([...currentPath, this.to])
    } else {
      possibleMoves.forEach((station) =>
        this.findRecursively({
          currentPath: [...currentPath, station],
          trainColor,
        })
      )
    }
  }

  getNextPossibleMoves({ from, exclude, color }) {
    const linkedStations = this.getStationByName(from).linkedWith.filter(
      (linked) => !exclude.includes(linked)
    )
    if (!linkedStations.length) return []

    return linkedStations.reduce((acc, stationName) => {
      const possibleNext = this.getStationByName(stationName)
      if (color && possibleNext.color && possibleNext.color !== color) {
        return [
          ...acc,
          ...this.getNextPossibleMoves({
            from: stationName,
            exclude: [...exclude, from],
            color,
          }),
        ]
      }
      return [...acc, stationName]
    }, [])
  }

  getStationByName(name) {
    return this.stations[name]
  }

  getAvailableStations() {
    return Object.keys(this.stations)
  }

  getShortest() {
    if (!this.successfulPaths.length) {
      throw new Error(
        'There are no successful paths from origin to destination or maybe you have not run "findShortestPath" method first'
      )
    }
    const filteredPaths = this.successfulPaths.reduce(
      (acc, path) => {
        const currentSteps = path.length
        if (currentSteps < acc.stations) {
          acc.paths = [path]
          acc.stations = currentSteps
        } else if (currentSteps === acc.stations) {
          acc.paths.push(path)
        }
        return acc
      },
      {
        stations: Infinity,
        paths: [],
      }
    )
    return filteredPaths
  }
}

module.exports = MetroNetwork
