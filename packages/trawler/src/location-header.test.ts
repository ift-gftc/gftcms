import test from 'ava'
import fs from 'fs-extra'
import { createLocationHeaderXml } from './location-header'

test('correctly generated location header', async (t) => {
  const fileName = 'Location'

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const output = await createLocationHeaderXml(inputFile)

  const result = output

  // await fs.writeFile(`mock/${fileName}.xml`, result);

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)
  t.is(result, outputFile.toString())
})
