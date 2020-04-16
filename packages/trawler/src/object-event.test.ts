import test from 'ava'
import fs from 'fs-extra'
import { createObjectEventXml } from './object-event'

test('correctly generated object event', async (t) => {
  const fileName = 'ObjectEvent'

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const output = await createObjectEventXml(inputFile)

  const result = output.map((d) => d.xml).join('\n')

  // await fs.writeFile(`mock/${fileName}.xml`, result);

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)
  t.is(result, outputFile.toString())
})
