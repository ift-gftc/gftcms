# GFTC Micro Services

A set of tools, library and microservices available for developers of tracability solutions to utilize and integrate into their workflow and/or software.

This repository is a **monorepo**, with the following packages:

## gftcms

A microservice appliaction exposing APIs to interact with traceability tools and library. `gftcms` is created using [nextjs](https://nextjs.org) and deployed using [now](https://now.sh). A sample deployment is available at [gftcms.now.sh](http://gftcms.now.sh/). For usage, click [here](./packages/gftcms/README.md).

## trawler 

A library that ease the process of parsing and combining CSV documents to EPCIS XML documentation. `trawler` is created using [typescript](https://www.typescriptlang.org/) and deployed to [npm](https://www.npmjs.com/). The package is available at [@gftc/trawler](https://www.npmjs.com/package/@gftc/trawler). For API documentation, click [here](./packages/trawler/README.md).