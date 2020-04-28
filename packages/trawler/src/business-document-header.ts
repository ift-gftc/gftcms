import neatCsv from 'neat-csv'

import { DateTime } from 'luxon'
import { csvBusinessDocumentHeader } from './csv-header'

/**
 * @param data 
 * - Example: [click here](https://github.com/ift-gftc/gftcms/blob/master/packages/trawler/mock/BusinessDocumentHeader.csv)
 * 
 * @returns
 * - Example: [click here](https://github.com/ift-gftc/gftcms/blob/master/packages/trawler/mock/BusinessDocumentHeader.xml)
 */
export const createBusinessDocumentHeaderXml = async (
  data: string | Buffer | import('stream').Readable
) => {
  const [csvData] = (await neatCsv(data, {
    mapHeaders: ({ index }) => csvBusinessDocumentHeader[index] || null
  })) as any

  const {
    senderId,
    senderName,
    senderEmail,
    receiverId,
    receiverName,
    receiverEmail
  } = csvData

  if (
    !senderId ||
    !senderName ||
    !senderEmail ||
    !receiverId ||
    !receiverName ||
    !receiverEmail
  ) {
    throw new Error('wrong format')
  }

  const dt = DateTime.local()
  const creationDate = dt.toISO()

  return `<sbdh:StandardBusinessDocumentHeader>
  <sbdh:HeaderVersion>1.0</sbdh:HeaderVersion>
  <sbdh:Sender>
      <sbdh:Identifier>${senderId}</sbdh:Identifier>
      <sbdh:ContactInformation>
          <sbdh:Contact>${senderName}</sbdh:Contact>
          <sbdh:EmailAddress>${senderEmail}</sbdh:EmailAddress>
      </sbdh:ContactInformation>
  </sbdh:Sender>
  <sbdh:Receiver>
      <sbdh:Identifier>${receiverId}</sbdh:Identifier>
      <sbdh:ContactInformation>
          <sbdh:Contact>${receiverName}</sbdh:Contact>
          <sbdh:EmailAddress>${receiverEmail}</sbdh:EmailAddress>
      </sbdh:ContactInformation>
  </sbdh:Receiver>
  <sbdh:DocumentIdentification>
      <sbdh:Standard>GS1</sbdh:Standard>
      <sbdh:TypeVersion>3.0</sbdh:TypeVersion>
      <sbdh:InstanceIdentifier>9999</sbdh:InstanceIdentifier>
      <sbdh:Type>Seafood Traceability</sbdh:Type>
      <sbdh:MultipleType>false</sbdh:MultipleType>
      <sbdh:CreationDateAndTime>${creationDate}</sbdh:CreationDateAndTime>
  </sbdh:DocumentIdentification>
</sbdh:StandardBusinessDocumentHeader>`
}
