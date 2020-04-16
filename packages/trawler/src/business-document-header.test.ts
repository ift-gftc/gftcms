import { mock } from 'sinon'

import test from 'ava'
import fs from 'fs-extra'
import { createBusinessDocumentHeaderXml } from './business-document-header'
import { DateTime } from 'luxon'

test('correctly generated epc class header', async (t) => {
  const fileName = 'BusinessDocumentHeader'

  mock(DateTime).expects('local').returns(DateTime.fromMillis(1587032353925))

  const inputFile = await fs.readFile(`mock/${fileName}.csv`)

  const output = await createBusinessDocumentHeaderXml(inputFile)

  const result = output

  // await fs.writeFile(`mock/${fileName}.xml`, result);

  const outputFile = await fs.readFile(`mock/${fileName}.xml`)
  t.is(result, outputFile.toString())

  mock(DateTime).restore()
})
