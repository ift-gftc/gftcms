import neatCsv from 'neat-csv'
import { csvTransformationEventHeader } from './csv-header'
import { parseCsvColumnList } from './utils'

export const createTransformationEventXml = async (data) => {
  const parsedData = (await neatCsv(data, {
    // headers: csvTransformationEventHeader,
    // skipLines: 4
    mapHeaders: ({ index }) => csvTransformationEventHeader[index] || null,
    skipLines: 3
  })) as any
  return parsedData
    .map(
      (
        {
          eventId,
          bizStep,
          informationProvider,
          productOwner,
          eventTime,
          eventTimeZoneOffset,
          disposition,
          readPoint_id,
          bizLocation_id,
          humanWelfarePolicy,

          ...rest
        },
        index
      ) => {
        if (!bizStep || !eventTime || !informationProvider) return ''

        const inputQuantityItemXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'inputQuantityList_quantityElement_epcClass',
            'inputQuantityList_quantityElement_quantity',
            'inputQuantityList_quantityElement_uom'
          ]
        })
          .map(
            (d) =>
              `<quantityElement> 
<epcClass>${d.inputQuantityList_quantityElement_epcClass}</epcClass>
<quantity>${d.inputQuantityList_quantityElement_quantity}</quantity>
${
  d.inputQuantityList_quantityElement_uom
    ? `<uom>${d.inputQuantityList_quantityElement_uom}</uom>`
    : ''
}
</quantityElement>`
          )
          .join('\n')

        const inputQuantityListXml = !!inputQuantityItemXml
          ? `<inputQuantityList>${inputQuantityItemXml}</inputQuantityList>`
          : ''

        const outputQuantityItemXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'outputQuantityList_quantityElement_epcClass',
            'outputQuantityList_quantityElement_quantity',
            'outputQuantityList_quantityElement_uom'
          ]
        })
          .map(
            (d) =>
              `<quantityElement> 
  <epcClass>${d.outputQuantityList_quantityElement_epcClass}</epcClass>
  <quantity>${d.outputQuantityList_quantityElement_quantity}</quantity>
  ${
    d.outputQuantityList_quantityElement_uom
      ? `<uom>${d.outputQuantityList_quantityElement_uom}</uom>`
      : ''
  }
</quantityElement>`
          )
          .join('\n')

        const outputQuantityListXml = !!outputQuantityItemXml
          ? `<outputQuantityList>${outputQuantityItemXml}</outputQuantityList>`
          : ''

        const ilmdCbvmdaItemsXml = [
          'lotNumber',
          'productionDate',
          'harvestStartDate',
          'harvestEndDate',
          'itemExpirationDate',
          'aquacultureMethod',
          'proteinSource',
          'countryOfOrigin',
          'bestBeforeDate',
          'preservationTechniqueCode'
        ]
          .filter((k) => !!rest[`ilmd_${k}`])
          .map((k) => `<cbvmda:${k}>${rest[`ilmd_${k}`]}</cbvmda:${k}>`)
          .join('\n')

        const ilmdVesselCatchInformationItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselName',
            'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselID',
            'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselPublicRegistry',
            'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselFlagState',
            'ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber'
          ]
        })
          .map(
            (d) => `<cbvmda:vesselCatchInformation>
  <cbvmda:vesselName>${d.ilmd_vesselCatchInformationList_vesselCatchInformation_vesselName}</cbvmda:vesselName> 
  <cbvmda:vesselID>${d.ilmd_vesselCatchInformationList_vesselCatchInformation_vesselID}</cbvmda:vesselID>
  <gdst:vesselPublicRegistry>${d.ilmd_vesselCatchInformationList_vesselCatchInformation_vesselPublicRegistry}</gdst:vesselPublicRegistry>
  <cbvmda:vesselFlagState>${d.ilmd_vesselCatchInformationList_vesselCatchInformation_vesselFlagState}</cbvmda:vesselFlagState>
  <gdst:imoNumber>${d.ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber}</gdst:imoNumber>
</cbvmda:vesselCatchInformation>`
          )
          .join('\n')
          .trim()

        const ilmdVesselCatchInformationListXml = !!ilmdVesselCatchInformationItemsXml
          ? `<cbvmda:vesselCatchInformationList>${ilmdVesselCatchInformationItemsXml}</cbvmda:vesselCatchInformationList>`
          : ''

        const ilmdCertificationItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'ilmd_certificationList_certification_certificationType',
            'ilmd_certificationList_certification_certificationAgency',
            'ilmd_certificationList_certification_certificationIdentification',
            'ilmd_certificationList_certification_certificationStandard',
            'ilmd_certificationList_certification_certificationValue'
          ]
        })
          .map(
            (d) => `<cbvmda:certification>
<gdst:certificateType>${d.ilmd_certificationList_certification_certificationType}</gdst:certificateType>              
<cbvmda:certificationStandard>${d.ilmd_certificationList_certification_certificationStandard}</cbvmda:certificationStandard> 
<cbvmda:certificationAgency>${d.ilmd_certificationList_certification_certificationAgency}</cbvmda:certificationAgency>
<cbvmda:certificationValue>${d.ilmd_certificationList_certification_certificationValue}</cbvmda:certificationValue>
<cbvmda:certificationIdentification>${d.ilmd_certificationList_certification_certificationIdentification}</cbvmda:certificationIdentification>
</cbvmda:certification>`
          )
          .join('\n')
          .trim()

        const ilmdCertificationXml = !!ilmdCertificationItemsXml
          ? `<cbvmda:certificationList>${ilmdCertificationItemsXml}</cbvmda:certificationList>`
          : ''

        const ilmdItemsXml = [
          ilmdCbvmdaItemsXml,
          ilmdVesselCatchInformationListXml,
          ilmdCertificationXml
        ]
          .join('\n')
          .trim()

        const ilmdXml = !!ilmdItemsXml
          ? `<ilmd>
              ${ilmdItemsXml}
            </ilmd>`
          : ''

        const bizStepXml = !!bizStep
          ? `<bizStep>${bizStep}</bizStep>`
          : '<bizStep></bizStep>'

        const dispositionXml = !!disposition
          ? `<disposition>urn:epcglobal:cbv:disp:${disposition}</disposition>`
          : '<disposition></disposition>'

        return {
          date: new Date(`${eventTime}Z${eventTimeZoneOffset}`),
          xml: `<extension>
<TransformationEvent>
<eventTime>${eventTime}</eventTime> 
<eventTimeZoneOffset>${eventTimeZoneOffset}</eventTimeZoneOffset>
<baseExtension>
  <eventID>${eventId}</eventID>
</baseExtension>
${bizStepXml}
${dispositionXml}

<readPoint><id>${readPoint_id}</id></readPoint>
<bizLocation><id>${bizLocation_id}</id></bizLocation>

${inputQuantityListXml}
${outputQuantityListXml}
${ilmdXml}
<gdst:humanWelfarePolicy>${humanWelfarePolicy}</gdst:humanWelfarePolicy>
<gdst:productOwner>${productOwner}</gdst:productOwner> 
<cbvmda:informationProvider>${informationProvider}</cbvmda:informationProvider>   
</TransformationEvent>
</extension>`
        }
      }
    )
    .filter((t) => !!t)
}
