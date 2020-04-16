import neatCsv from 'neat-csv'
import { csvAggregationEventHeader } from './csv-header'
import { parseCsvColumnList } from './utils'

export const createAggregationEventXml = async (data) => {
  const parsedData = (await neatCsv(data, {
    // headers: csvAggregationEventHeader,
    // skipLines: 5
    mapHeaders: ({ index }) => csvAggregationEventHeader[index] || null,
    skipLines: 4
  })) as any
  return parsedData
    .map(
      (
        {
          eventId,
          action,
          bizStep,
          informationProvider,
          productOwner,
          parentID,
          eventTime,
          eventTimeZoneOffset,
          disposition,
          readPoint_id,
          bizLocation_id
        },
        index
      ) => {
        if (!action || !bizStep || !eventTime || !informationProvider) return ''

        const epcItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: ['childEPCs_epc']
        })
          .map((d) => `<epc>${d.childEPCs_epc}</epc>`)
          .join('\n')

        const childEPCsXml = !!epcItemsXml
          ? `<childEPCs>${epcItemsXml}</childEPCs>`
          : ''

        const childQuantityListItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_childQuantityList_quantityElement_epcClass',
            'extension_childQuantityList_quantityElement_quantity',
            'extension_childQuantityList_quantityElement_uom'
          ]
        })
          .map(
            (
              d
            ) => `<quantityElement><epcClass>${d.extension_childQuantityList_quantityElement_epcClass}</epcClass>
  <quantity>${d.extension_childQuantityList_quantityElement_quantity}</quantity>
  <uom>${d.extension_childQuantityList_quantityElement_uom}</uom>
</quantityElement>`
          )
          .join('\n')

        const childQuantityListXml = !!childQuantityListItem
          ? `<childQuantityList>${childQuantityListItem}</childQuantityList>`
          : ''

        const certificationListItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_certificationList_certification_certificationType',
            'extension_certificationList_certification_certificationAgency',
            'extension_certificationList_certification_certificationIdentification',
            'extension_certificationList_certification_certificationStandard',
            'extension_certificationList_certification_certificationValue'
          ]
        })
          .map(
            (d) => `<cbvmda:certification>
  <gdst:certificateType>${d.extension_certificationList_certification_certificationType}</gdst:certificateType>
  <cbvmda:certificationAgency>${d.extension_certificationList_certification_certificationAgency}</cbvmda:certificationAgency>
  <cbvmda:certificationIdentification>${d.extension_certificationList_certification_certificationIdentification}</cbvmda:certificationIdentification>
  <cbvmda:certificationStandard>${d.extension_certificationList_certification_certificationStandard}</cbvmda:certificationStandard>
  <cbvmda:certificationValue>${d.extension_certificationList_certification_certificationValue}</cbvmda:certificationValue>
</cbvmda:certification>`
          )
          .join('\n')

        const certificationListXml = !!certificationListItem
          ? `<cbvmda:certificationList>${certificationListItem}</cbvmda:certificationList>`
          : ''

        const extensionItemsXml = [
          childQuantityListXml,
          certificationListXml
        ].join('\n')

        const extensionXml = !!extensionItemsXml
          ? `<extension>${extensionItemsXml}</extension>`
          : ''

        const bizStepXml = !!bizStep
          ? `<bizStep>${bizStep}</bizStep>`
          : '<bizStep></bizStep>'

        const dispositionXml = !!disposition
          ? `<disposition>urn:epcglobal:cbv:disp:${disposition}</disposition>`
          : '<disposition></disposition>'

        return {
          date: new Date(`${eventTime}Z${eventTimeZoneOffset}`),
          xml: `<AggregationEvent>
<eventTime>${eventTime}</eventTime> 
<eventTimeZoneOffset>${eventTimeZoneOffset}</eventTimeZoneOffset>
<baseExtension>
  <eventID>${eventId}</eventID>
</baseExtension>

${childEPCsXml}

<action>${action}</action>
${bizStepXml}
${dispositionXml}
<parentID>${parentID}</parentID>

<readPoint><id>${readPoint_id}</id></readPoint>
<bizLocation><id>${bizLocation_id}</id></bizLocation>
${extensionXml}
<gdst:productOwner>${productOwner}</gdst:productOwner>
<cbvmda:informationProvider>${informationProvider}</cbvmda:informationProvider> 
</AggregationEvent>`
        }
      }
    )
    .filter((t) => !!t.xml)
}
