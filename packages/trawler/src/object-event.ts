import neatCsv from 'neat-csv'
import { csvObjectEventHeader } from './csv-header'
import { parseCsvColumnList } from './utils'

export const createObjectEventXml = async (data) => {
  const parsedData = (await neatCsv(data, {
    // headers: csvObjectEventHeader,
    // skipLines: 5
    mapHeaders: ({ index }) => csvObjectEventHeader[index] || null,
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
          eventTime,
          eventTimeZoneOffset,
          disposition,
          readPoint_id,
          bizLocation_id,

          humanWelfarePolicy,

          extension_ilmd_productionMethodForFishAndSeafoodCode,
          ...rest
        },
        index
      ) => {
        if (!action || !eventTime || !informationProvider) return ''

        const isObserve = action === 'OBSERVE'

        //#region parse basic lists
        const epcItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: ['epcList_epc']
        })
          .map((d) => `<epc>${d.epcList_epc}</epc>`)
          .join('\n')

        const epcListXml = !!epcItemsXml
          ? `<epcList>${epcItemsXml}</epcList>`
          : ''

        const bizTransactionItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'bizTransactionList_bizTransaction_type',
            'bizTransactionList_bizTransaction_value'
          ]
        })
          .map(
            (d) =>
              `<bizTransaction type="urn:epcglobal:cbv:btt:${d.bizTransactionList_bizTransaction_type}">${d.bizTransactionList_bizTransaction_value}</bizTransaction>`
          )
          .join('\n')

        const bizTransactionListXml = !!bizTransactionItem
          ? `<bizTransactionList>${bizTransactionItem}</bizTransactionList>`
          : ''

        const sourceListItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_sourceList_source_type',
            'extension_sourceList_source_value'
          ]
        })
          .map(
            (d) =>
              `<source type="urn:epcglobal:cbv:sdt:${d.extension_sourceList_source_type}">${d.extension_sourceList_source_value}</source>`
          )
          .join('\n')

        const sourceListXml = !!sourceListItem
          ? `<sourceList>${sourceListItem}</sourceList>`
          : ''

        const destinationListItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_destinationList_destination_type',
            'extension_destinationList_destination_value'
          ]
        })
          .map(
            (d) =>
              `<destination type="urn:epcglobal:cbv:sdt:${d.extension_destinationList_destination_type}">
              ${d.extension_destinationList_destination_value}
            </destination>`
          )
          .join('\n')

        const destinationListXml = !!destinationListItem
          ? `<destinationList>${destinationListItem}</destinationList>`
          : ''

        const humanWelfarePolicyXml = !!humanWelfarePolicy
          ? `<gdst:humanWelfarePolicy>${humanWelfarePolicy}</gdst:humanWelfarePolicy>`
          : ''

        const quantityListItem = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_quantityList_quantityElement_epcClass',
            'extension_quantityList_quantityElement_quantity',
            'extension_quantityList_quantityElement_uom'
          ]
        })
          .map(
            (d) => `<quantityElement>
<epcClass>${d.extension_quantityList_quantityElement_epcClass}</epcClass>
<quantity>${d.extension_quantityList_quantityElement_quantity}</quantity>
<uom>${d.extension_quantityList_quantityElement_uom}</uom>
</quantityElement>`
          )
          .join('\n')

        const quantityListXml = !!quantityListItem
          ? `<quantityList>${quantityListItem}</quantityList>`
          : ''
        //#endregion

        const cbvmdaItemsXml = [
          'transshipStartDate',
          'transshipEndDate',
          'landingEndDate',
          'landingStartDate'
        ]
          .filter((k) => !!rest[k])
          .map((k) => `<cbvmda:${k}>${rest[k]}</cbvmda:${k}>`)
          .join('\n')

        //#region parse ilmd
        const ilmdCbvmdaItemsXml = [
          'unloadingPort',
          'harvestEndDate',
          'harvestStartDate'
        ]
          .filter((k) => !!rest[`extension_ilmd_${k}`])
          .map(
            (k) => `<cbvmda:${k}>${rest[`extension_ilmd_${k}`]}</cbvmda:${k}>`
          )
          .join('\n')

        const ilmdGdstItemsXml = ['broodstockSource']
          .filter((k) => !!rest[`extension_ilmd_${k}`])
          .map((k) => `<gdst:${k}>${rest[`extension_ilmd_${k}`]}</gdst:${k}>`)
          .join('\n')

        const ilmdProductionMethodXml = !!extension_ilmd_productionMethodForFishAndSeafoodCode
          ? `<productionMethodForFishAndSeafoodCode>${extension_ilmd_productionMethodForFishAndSeafoodCode}</productionMethodForFishAndSeafoodCode>`
          : ''

        const ilmdVesselCatchInformationItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_catchArea',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_rmfoArea',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_economicZone',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_subnationalPermitArea',

            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_fishingGearTypeCode',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselFlagState',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselID',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselName',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_gpsAvailability',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselPublicRegistry',

            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_satelliteTrackingAuthority',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_fisheryImprovementProject',
            'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber'
          ]
        })
          .map(
            (d) => `<cbvmda:vesselCatchInformation>
<cbvmda:vesselName>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselName}</cbvmda:vesselName>
<cbvmda:vesselID>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselID}</cbvmda:vesselID>
<gdst:imoNumber>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber}</gdst:imoNumber>
<cbvmda:vesselFlagState>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselFlagState}</cbvmda:vesselFlagState>
<gdst:vesselPublicRegistry>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_vesselPublicRegistry}</gdst:vesselPublicRegistry>
<gdst:gpsAvailability>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_gpsAvailability}</gdst:gpsAvailability>
<gdst:satelliteTrackingAuthority>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_satelliteTrackingAuthority}</gdst:satelliteTrackingAuthority>
<cbvmda:economicZone>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_economicZone}</cbvmda:economicZone>
<gdst:fisheryImprovementProject>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_fisheryImprovementProject}</gdst:fisheryImprovementProject>
<gdst:rmfoArea>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_rmfoArea}</gdst:rmfoArea>
<gdst:subnationalPermitArea>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_subnationalPermitArea}</gdst:subnationalPermitArea>
<cbvmda:catchArea>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_catchArea}</cbvmda:catchArea>
<cbvmda:fishingGearTypeCode>${d.extension_ilmd_vesselCatchInformationList_vesselCatchInformation_fishingGearTypeCode}</cbvmda:fishingGearTypeCode>
</cbvmda:vesselCatchInformation>`
          )
          .join('\n')
          .trim()

        const ilmdVesselCatchInformationListXml = !!ilmdVesselCatchInformationItemsXml
          ? `<cbvmda:vesselCatchInformationList>${ilmdVesselCatchInformationItemsXml}</cbvmda:vesselCatchInformationList>`
          : ''

        const certificationItemsXml = parseCsvColumnList({
          csvData: parsedData,
          index,
          indexKey: 'informationProvider',
          itemKeyList: [
            'extension_ilmd_certificationList_certification_certificationType',
            'extension_ilmd_certificationList_certification_certificationAgency',
            'extension_ilmd_certificationList_certification_certificationIdentification',
            'extension_ilmd_certificationList_certification_certificationStandard',
            'extension_ilmd_certificationList_certification_certificationValue'
          ]
        })
          .map(
            (d) => `<cbvmda:certification>
<gdst:certificateType>${d.extension_ilmd_certificationList_certification_certificationType}</gdst:certificateType>
<cbvmda:certificationStandard>${d.extension_ilmd_certificationList_certification_certificationStandard}</cbvmda:certificationStandard> 
<cbvmda:certificationAgency>${d.extension_ilmd_certificationList_certification_certificationAgency}</cbvmda:certificationAgency>
<cbvmda:certificationValue>${d.extension_ilmd_certificationList_certification_certificationValue}</cbvmda:certificationValue>
<cbvmda:certificationIdentification>${d.extension_ilmd_certificationList_certification_certificationIdentification}</cbvmda:certificationIdentification>
</cbvmda:certification>`
          )
          .join('\n')
          .trim()

        const certificationXml = !!certificationItemsXml
          ? isObserve
            ? `<gdst:certificationList>${certificationItemsXml}</gdst:certificationList>`
            : `<cbvmda:certificationList>${certificationItemsXml}</cbvmda:certificationList>`
          : ''

        const ilmdItemsXml = [
          ilmdGdstItemsXml,
          ilmdVesselCatchInformationListXml,
          ilmdProductionMethodXml,
          ilmdCbvmdaItemsXml,
          !isObserve ? certificationXml : ''
        ]
          .join('\n')
          .trim()

        const ilmdXml = !!ilmdItemsXml
          ? `<ilmd>
          ${ilmdItemsXml}
        </ilmd>`
          : ''

        //#endregion

        const extensionItemsXml = [
          quantityListXml,
          sourceListXml,
          destinationListXml,
          ilmdXml
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
          xml: `<ObjectEvent>
<eventTime>${eventTime}</eventTime> 
<eventTimeZoneOffset>${eventTimeZoneOffset}</eventTimeZoneOffset>
<baseExtension>
  <eventID>${eventId}</eventID>
</baseExtension>
${epcListXml}
<action>${action}</action>

${bizStepXml}
${dispositionXml}

<readPoint><id>${readPoint_id}</id></readPoint>
<bizLocation><id>${bizLocation_id}</id></bizLocation>

${bizTransactionListXml}

${isObserve ? certificationXml : ''}
${cbvmdaItemsXml}

${extensionXml}
${humanWelfarePolicyXml}
<gdst:productOwner>${productOwner}</gdst:productOwner>
<cbvmda:informationProvider>${informationProvider}</cbvmda:informationProvider> 
</ObjectEvent>`
        }
      }
    )
    .filter((t) => !!t.xml)
}
