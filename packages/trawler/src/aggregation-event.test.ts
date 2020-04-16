import test from 'ava'
import fs from 'fs-extra'
import { createAggregationEventXml } from './aggregation-event'

test('correctly generated aggregation event', async (t) => {
  const fileName = 'AggregationEvent'

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)

  const aggregationXml = await createAggregationEventXml(inputFile)

  const result = aggregationXml.map((d) => d.xml).join('\n')

  t.is(result, outputFile.toString())
  // await fs.writeFile(`mock/${fileName}.xml`, result);
})
