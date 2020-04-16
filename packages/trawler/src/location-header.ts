import { csvLocationHeader } from './csv-header'
import neatCsv from 'neat-csv'
import { parseCsvColumnList } from './utils'

export const createLocationHeaderXml = async (data) => {
  const parsedData = (await neatCsv(data, {
    // headers: csvLocationHeader,
    // skipLines: 3
    mapHeaders: ({ index }) => csvLocationHeader[index] || null,
    skipLines: 2
  })) as any

  const vocabArrayKeyList = [
    'geofencePolygon_polygonPoint_seq',
    'geofencePolygon_polygonPoint_value'
  ]

  const vocabElementListItems = parsedData
    .map(
      (
        {
          id,

          ...optionalAttributeMap
        },
        index
      ) => {
        if (!id) return ''
        const optionalAttributeItems = Object.entries(optionalAttributeMap)
          .filter(([k, v]) => !!v && !vocabArrayKeyList.includes(k))
          .map(
            ([k, v]) =>
              `<attribute id="urn:epcglobal:cbv:mda#${k}">${v}</attribute>`
          )
          .join('\n')

        const polygonItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'id',
          itemKeyList: vocabArrayKeyList
        })
          .map(
            (d) =>
              `<polygonPoint seq="${d.geofencePolygon_polygonPoint_seq}">${d.geofencePolygon_polygonPoint_value}</polygonPoint>`
          )
          .join('\n')
          .trim()

        const geofanceXml = !!polygonItemsXml
          ? `<attribute id="urn:epcglobal:cbv:tr#geofencePolygon">${polygonItemsXml}</attribute>`
          : ''

        return `<VocabularyElement id="${id}">
${optionalAttributeItems}
${geofanceXml}
</VocabularyElement>`
      }
    )
    .join('\n')
    .trim()

  return `<Vocabulary type="urn:epcglobal:epcis:vtype:Location">
<VocabularyElementList>
${vocabElementListItems}
</VocabularyElementList>
</Vocabulary>`
}
