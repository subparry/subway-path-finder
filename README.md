# Metro network path finding

## Description and considerations

This is an implementation for finding the shortest path between 2 subway stations considering the following factors:

- Branching
- Unweighted nodes
- Possible circular paths
- Colored stations
- Multiple possible paths

It is implemented as a recursive function that checks all possible paths and stores the successful ones (those that effectively reach the set destination). Then, finding the shortest ones is a simple task.

The implementation is very performant on small subway networks. I have not tested it at larger scale but I know that as it is recursive, it could cause stack overflow. I think that for larger scale, it can be implemented using worker processes to calculate possible paths and having a shared memory variable that contains the shortest amount of steps found so far so that the algorithm could drop all paths that are taking more steps than the shortest found without having to calculate the final outcome.

## Usage

Install dependencies:

```
$ npm install
```

First you have to have a json file defining the subway structure. For this you can follow the sample `sampleInput.json` provided at the project root.

There is also a schema file `networkSchema.js` following JSONSchema spec that you can check for validating your json data.

Then, you must run the following npm script specifying full path to your JSON file.

```
$ npm start --file=/home/<youruser>/path/to/dataInput.json
```

Or if you don't specify a file, it will fallback to `metroDeChile.json`

_Although stations of `metroDeChile.json` file are from Chilean metro network, it does not represent the full extension or station colors of the real network_

## Tests

To run the test suite:

```
$ npm test
```
