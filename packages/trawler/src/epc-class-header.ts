import neatCsv from 'neat-csv'

import { csvEpcClassHeader } from './csv-header'
import { parseCsvColumnList, parseUom } from './utils'

/**
 * @param data 
 * - Example: [click here](https://github.com/ift-gftc/gftcms/blob/master/packages/trawler/mock/EPCClass.csv)
 * 
 * @returns
 * - Example: [click here](https://github.com/ift-gftc/gftcms/blob/master/packages/trawler/mock/EPCClass.xml)
 * - Specs:   [click here](https://ift-gftc.github.io/doc.gdst/wild-events/master-data/)
 */
export const createEpcClassXml = async (
  data: string | Buffer | import('stream').Readable
) => {
  const parsedData = (await neatCsv(data, {
    mapHeaders: ({ index }) => csvEpcClassHeader[index] || null,
    skipLines: 2
    // headers: csvEpcClassHeader,
    // skipLines: 3
  })) as any

  const vocabArrayKeyList = [
    'grossWeight_measurement_value',
    'grossWeight_measurementUnit_code'
  ]

  const vocabElementListItems = parsedData
    .map(({ id, ...optionalAttributeMap }, index) => {
      if (!id) return ''
      const optionalAttributeItems = Object.entries(optionalAttributeMap)
        .filter(([k, v]) => !!v && !vocabArrayKeyList.includes(k))
        .map(
          ([k, v]) =>
            `<attribute id="urn:epcglobal:cbv:mda#${k}">${v}</attribute>`
        )
        .join('\n')

      const grossWeightDataList = parseCsvColumnList({
        csvData: parsedData,
        index,
        indexKey: 'id',
        itemKeyList: vocabArrayKeyList
      })

      const grossWeightItemsXml = grossWeightDataList
        .map(
          (d) =>
            `<measurement measurementUnitCode="${parseUom(
              d.grossWeight_measurementUnit_code
            )}">${d.grossWeight_measurement_value}</measurement>`
        )
        .join('\n')
        .trim()

      const grossWeightXml = !!grossWeightItemsXml
        ? `<attribute id="urn:epcglobal:cbv:mda#grossWeight">${grossWeightItemsXml}</attribute>`
        : ''

      return `<VocabularyElement id="${id}">
${optionalAttributeItems}
${grossWeightXml}
</VocabularyElement>`
    })
    .join('\n')
    .trim()

  return `<Vocabulary type="urn:epcglobal:epcis:vtype:EPCClass">
  <VocabularyElementList>
    ${vocabElementListItems}
  </VocabularyElementList>
</Vocabulary>`
}
