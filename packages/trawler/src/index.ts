export { createBusinessDocumentHeaderXml } from './business-document-header'
export { createEpcClassXml } from './epc-class-header'
export { createLocationHeaderXml } from './location-header'
export { createObjectEventXml } from './object-event'
export { createTransformationEventXml } from './transformation-event'
export { createAggregationEventXml } from './aggregation-event'

export const createTrawlerXml = ({
  bdhXml,
  epcClassXml,
  locationXml,
  xmlList
}) => {
  return `<?xml version="1.0" encoding="UTF-8"?> 
<epcis:EPCISDocument xmlns:epcis="urn:epcglobal:epcis:xsd:1" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:sbdh="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" 
  schemaVersion="0" 
  creationDate="2001-12-17T09:30:47Z" 
  xsi:schemaLocation="urn:epcglobal:epcis:xsd:1  http://www.gs1si.org/BMS/epcis/1_2/EPCglobal-epcis-1_2.xsd" 
  xmlns:cbvmda="urn:epcglobal:cbv:mda" 
  xmlns:gdst="https://traceability-dialogue.org/epcis">
  <EPCISHeader>
    ${bdhXml}
    <extension>
      <EPCISMasterData>
        <VocabularyList> 
          ${epcClassXml}
          ${locationXml}
        </VocabularyList>
      </EPCISMasterData>
    </extension>
  </EPCISHeader>
  <EPCISBody>
    <EventList>
      ${xmlList
        .sort((a, b) => a.date - b.date)
        .map((i) => i.xml)
        .join('\n')}
    </EventList>
  </EPCISBody>
</epcis:EPCISDocument>`
}
