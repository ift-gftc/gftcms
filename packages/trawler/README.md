# trawler

The `trawler` library is created to make it easier for seafood supplychain entities to integrate their existing workflow with the tracability data flow. 

At its core, `trawler` defines a human-readable, easy to use csv schema for supplychain entity to convert their existing csv format to. Then using the library (or the microservice provided by `gftcms` which exposes a ready-to-use deployment of this library and others), the csv can then be converted into GDST compliance EPCIS XML document which can then be safely published to EPCIS datastore and other entities participating in the supplychain.

# Documentation

Visit [docs/index](https://ift-gftc.github.io/gftcms/packages/trawler/docs/index.html)

# Install

```
npm i -S @gftc/trawler
```

# Usage

The excerpt below is taken from gftcms's [consumption of the library](https://github.com/ift-gftc/gftcms/blob/master/packages/gftcms/pages/api/trawler.ts).

```typescript

// Import trawler generator functions:
import {
  createTrawlerXml,
  createBusinessDocumentHeaderXml,
  createEpcClassXml,
  createLocationHeaderXml,
  createObjectEventXml,
  createTransformationEventXml,
  createAggregationEventXml
} from '@gftc/trawler'

// Use the generator to create the xml pieces for each csv form
...
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


// Combine the generator's result to create the final EPCIS document 
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
```