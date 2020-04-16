import neatCsv from 'neat-csv'
import { DateTime } from 'luxon'
import { csvBusinessDocumentHeader } from './csv-header'

export const createBusinessDocumentHeaderXml = async (csvData) => {
  const [data] = (await neatCsv(csvData, {
    mapHeaders: ({ index }) => csvBusinessDocumentHeader[index] || null
  })) as any

  const {
    senderId,
    senderName,
    senderEmail,
    receiverId,
    receiverName,
    receiverEmail
  } = data

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
