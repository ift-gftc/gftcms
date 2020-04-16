import test from 'ava'
import fs from 'fs-extra'
import { createTransformationEventXml } from './transformation-event'

test('correctly generated transformation event', async (t) => {
  const fileName = 'TransformationEvent'

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const output = await createTransformationEventXml(inputFile)

  const result = output.map((d) => d.xml).join('\n')

  // await fs.writeFile(`mock/${fileName}.xml`, result);

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)
  t.is(result, outputFile.toString())
})
