# trawler

The `trawler` library is created to make it easier for seafood supplychain entities to integrate their existing workflow with the tracability data flow. 

At its core, `trawler` defines a human-readable, easy to use csv schema for supplychain entity to convert their existing csv format to. Then using the library (or the microservice provided by `gftcms` which exposes a ready-to-use deployment of this library and others), the csv can then be converted into GDST compliance EPCIS XML document which can then be safely published to EPCIS datastore and other entities participating in the supplychain.

