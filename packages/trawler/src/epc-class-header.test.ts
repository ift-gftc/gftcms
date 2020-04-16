import test from 'ava'
import fs from 'fs-extra'
import { createEpcClassXml } from './epc-class-header'

test('correctly generated epc class header', async (t) => {
  const fileName = 'EPCClass'

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const output = await createEpcClassXml(inputFile)

  const result = output

  // await fs.writeFile(`mock/${fileName}.xml`, result);

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)
  t.is(result, outputFile.toString())
})
