import parser from 'urlencoded-body-parser'

// import {
//   createBusinessDocumentHeaderXml,
//   createTrawlerXml,
//   createEpcClassXml,
//   createLocationHeaderXml,
//   createObjectEventXml,
//   createTransformationEventXml,
//   createAggregationEventXml
// } from '@gftc/trawler'

import nextConnect from 'next-connect'

const handler = nextConnect()

handler.post(async (req, res) => {
  try {
    req.data = await parser(req)
    console.log(req.data);
        
    // const {
    //   businessHeaderCsv,
    //   epcClassCsv,
    //   locationCsv,
    //   objectEventCsv,
    //   transformationEventCsv,
    //   aggregationEventCsv
    // } = req.body

    // const [
    //   bdhXml,
    //   epcClassXml,
    //   locationXml,
    //   objectEventXmlList,
    //   transformationEventXmlList,
    //   aggregationEventXmlList
    // ] = await Promise.all([
    //   createBusinessDocumentHeaderXml(businessHeaderCsv),
    //   createEpcClassXml(epcClassCsv),
    //   createLocationHeaderXml(locationCsv),
    //   createObjectEventXml(objectEventCsv),
    //   createTransformationEventXml(transformationEventCsv),
    //   createAggregationEventXml(aggregationEventCsv)
    // ])

    // const result = createTrawlerXml({
    //   bdhXml,
    //   epcClassXml,
    //   locationXml,
    //   xmlList: [
    //     ...objectEventXmlList,
    //     ...transformationEventXmlList,
    //     ...aggregationEventXmlList
    //   ]
    // })

    res.json({
      ok: true,
      // data
      // result
    })
  } catch (error) {
    res.json({
      ok: false,
      error: error.message
    })
  }
})

export default handler
