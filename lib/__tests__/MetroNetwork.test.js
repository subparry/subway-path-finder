const MetroNetwork = require('../MetroNetwork')
const path = require('path')

const filePath = path.resolve(__dirname, '../../sampleInput.json')

describe('MetroNetwork', () => {
  describe('initializing', () => {
    it('reads given absolute file path to JSON file and validates its structure', () => {
      // This should not fail schema validation
      new MetroNetwork(filePath)

      let thrownError
      try {
        // This one should fail
        new MetroNetwork(path.resolve(__dirname, 'badSchemaInput.json'))
      } catch (error) {
        thrownError = error
      }
      expect(thrownError).toBeDefined()
    })

    it('throws error if file does not exist', () => {
      let thrownError
      try {
        new MetroNetwork(path.resolve(__dirname, '../../nonExistentFile.json'))
      } catch (error) {
        thrownError = error
      }
      expect(thrownError).toBeDefined()
    })

    it('throws error if JSON is malformed', () => {
      let thrownError
      try {
        new MetroNetwork(path.resolve(__dirname, 'malformedInput.json'))
      } catch (error) {
        thrownError = error
      }
      expect(thrownError).toBeDefined()
    })

    it('returns allowed train colors', () => {
      const instance = new MetroNetwork(filePath)

      expect(instance.allowedColors).toContain('red', 'green')
    })
  })

  describe('find shortest path', () => {
    let instance

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new MetroNetwork(filePath)
    })

    it('disallows entering train color for which there are no stations', () => {
      let thrownError
      try {
        instance.findShortestPath({
          from: 'Irarrazaval',
          to: 'Baquedano',
          trainColor: 'yellow',
        })
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.message).toEqual(
        'Train color yellow has no matching station'
      )
    })

    it('disallows entering non existent station', () => {
      let thrownError
      try {
        instance.findShortestPath({
          from: 'Bellavista',
          to: 'Baquedano',
          trainColor: 'red',
        })
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()

      expect(thrownError.message).toEqual(
        'From and To stations must exist in given input file'
      )
    })

    it('disallows specifying origin station of a color different than the train color', () => {
      let thrownError
      try {
        instance.findShortestPath({
          from: 'Irarrazaval',
          to: 'Baquedano',
          trainColor: 'green',
        })
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()

      expect(thrownError.message).toEqual(
        'Origin and destination stations must match train color or have no color'
      )
    })

    it('finds possible paths', () => {
      instance.findShortestPath({
        from: 'Ñuble',
        to: 'Salvador',
        trainColor: 'red',
      })
      expect(instance.successfulPaths).toEqual([
        ['Ñuble', 'Irarrazaval', 'Parque Bustamante', 'Baquedano', 'Salvador'],
        [
          'Ñuble',
          'Irarrazaval',
          'Parque Bustamante',
          'Santa Ana',
          'Baquedano',
          'Salvador',
        ],
        [
          'Ñuble',
          'Irarrazaval',
          'Santa Ana',
          'Parque Bustamante',
          'Baquedano',
          'Salvador',
        ],
        ['Ñuble', 'Irarrazaval', 'Santa Ana', 'Baquedano', 'Salvador'],
      ])
    })

    it('returns shortest paths', () => {
      instance.findShortestPath({
        from: 'Ñuble',
        to: 'Salvador',
        trainColor: 'red',
      })

      expect(instance.getShortest()).toEqual({
        paths: [
          [
            'Ñuble',
            'Irarrazaval',
            'Parque Bustamante',
            'Baquedano',
            'Salvador',
          ],
          ['Ñuble', 'Irarrazaval', 'Santa Ana', 'Baquedano', 'Salvador'],
        ],
        stations: 5,
      })
    })
  })
})
