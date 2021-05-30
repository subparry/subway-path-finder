const MetroNetwork = require('./MetroNetwork')
const list = require('cli-list-select')
const path = require('path')

const [file] = process.argv.slice(2)
const fallbackFile = path.resolve(__dirname, '../metroDeChile.json')
const run = async () => {
  let metroNetwork
  try {
    metroNetwork = new MetroNetwork(file || fallbackFile)
  } catch (error) {
    console.log(`ERROR: ${error.message}`)
    process.exit(1)
  }

  console.log('JSON file loaded successfully!')

  const availableStations = metroNetwork.getAvailableStations()
  const allowedColors = metroNetwork.allowedColors
  let tryAgain

  do {
    console.log(
      'Please enter origin station (move cursor with up and down, select with space, confirm with enter)'
    )
    const origin = await list(availableStations, {
      singleCheck: true,
    })
    origin.station = availableStations[origin.checks || origin.index]

    console.log('Please enter destination station')
    const destination = await list(availableStations, {
      singleCheck: true,
    })
    destination.station =
      availableStations[destination.checks || destination.index]

    console.log('Please enter train color:')
    const train = await list([...allowedColors, 'No color'], {
      singleCheck: true,
    })
    train.color = allowedColors[train.checks || train.index]

    console.log(`
    Calculating shortest path from ${origin.station} to ${destination.station}. 
    Train color: ${[...allowedColors, 'No color'][train.checks || train.index]}
    `)

    try {
      metroNetwork.findShortestPath({
        from: origin.station,
        to: destination.station,
        trainColor: train.color,
      })

      const shortestPaths = metroNetwork.getShortest()

      console.log(`The shortest path(s) with ${
        shortestPaths.stations
      } stations are:
  ${shortestPaths.paths.map((p) => p.join(' => ')).join('\n')}
      `)
    } catch (error) {
      console.log(`ERROR: ${error.message}`)
    }

    console.log('Do you want to select again?')
    tryAgain = await list(['No', 'Yes'], { singleCheck: true })
  } while (tryAgain.checks || tryAgain.index)
  console.log('Bye!')
  process.exit(0)
}

run()
