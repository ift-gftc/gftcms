import {
  createBusinessDocumentHeaderXml,
  createTrawlerXml,
  createEpcClassXml,
  createLocationHeaderXml,
  createObjectEventXml,
  createTransformationEventXml,
  createAggregationEventXml
} from '@gftc/trawler'

import nextConnect from 'next-connect'

const handler = nextConnect()

handler.post(async (req, res) => {
  try {
    const {
      businessHeaderCsv,
      epcClassCsv,
      locationCsv,
      objectEventCsv,
      transformationEventCsv,
      aggregationEventCsv
    } = req.body

    const [
      bdhXml,
      epcClassXml,
      locationXml,
      objectEventXmlList,
      transformationEventXmlList,
      aggregationEventXmlList
    ] = await Promise.all([
      createBusinessDocumentHeaderXml(businessHeaderCsv),
      createEpcClassXml(epcClassCsv),
      createLocationHeaderXml(locationCsv),
      createObjectEventXml(objectEventCsv),
      createTransformationEventXml(transformationEventCsv),
      createAggregationEventXml(aggregationEventCsv)
    ])

    const result = createTrawlerXml({
      bdhXml,
      epcClassXml,
      locationXml,
      xmlList: [
        ...objectEventXmlList,
        ...transformationEventXmlList,
        ...aggregationEventXmlList
      ]
    })

    res.json({
      ok: true,
      result
    })
  } catch (error) {
    res.json({
      ok: false,
      error
    })
  }
})

export default handler
