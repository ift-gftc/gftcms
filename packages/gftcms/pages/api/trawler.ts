import {
  createBusinessDocumentHeaderXml,
  createTrawlerXml,
  createEpcClassXml,
  createLocationHeaderXml,
  createObjectEventXml,
  createTransformationEventXml,
  createAggregationEventXml
} from '@gftc/trawler'

import { parse } from '@multisolution/multipart-parser'

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect()

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = parse(req.body)

    console.log(data)

    const {
      businessHeaderCsv,
      epcClassCsv,
      locationCsv,
      objectEventCsv,
      transformationEventCsv,
      aggregationEventCsv
    } = data

    const [
      bdhXml,
      epcClassXml,
      locationXml,
      objectEventXmlList,
      transformationEventXmlList,
      aggregationEventXmlList
    ] = await Promise.all([
      createBusinessDocumentHeaderXml(businessHeaderCsv.value),
      createEpcClassXml(epcClassCsv.value),
      createLocationHeaderXml(locationCsv.value),
      createObjectEventXml(objectEventCsv.value),
      createTransformationEventXml(transformationEventCsv.value),
      createAggregationEventXml(aggregationEventCsv.value)
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

    // res.json({
    //   ok: true,
    //   // data
    //   result
    // })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/xml')
    res.end(result)
  } catch (error) {
    res.json({
      ok: false,
      error: error.message
    })
  }
})

export default handler
