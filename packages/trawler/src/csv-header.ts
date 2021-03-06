/** @ignore */
export const csvAggregationEventHeader = [
  'eventId',

  'action',
  'bizStep',
  'informationProvider',
  'productOwner',
  'parentID',
  'eventTime',
  'eventTimeZoneOffset',
  'disposition',

  'childEPCs_epc',

  'readPoint_id',
  'bizLocation_id',

  'extension_childQuantityList_quantityElement_epcClass',
  'extension_childQuantityList_quantityElement_quantity',
  'extension_childQuantityList_quantityElement_uom',

  'extension_certificationList_certification_certificationType',
  'extension_certificationList_certification_certificationAgency',
  'extension_certificationList_certification_certificationIdentification',
  'extension_certificationList_certification_certificationStandard',
  'extension_certificationList_certification_certificationValue'
]

/** @ignore */
export const csvTransformationEventHeader = [
  'eventId',

  'bizStep',
  'informationProvider',
  'productOwner',
  'eventTime',
  'eventTimeZoneOffset',
  'disposition',

  'readPoint_id',
  'bizLocation_id',

  'inputQuantityList_quantityElement_epcClass',
  'inputQuantityList_quantityElement_quantity',
  'inputQuantityList_quantityElement_uom',

  'outputQuantityList_quantityElement_epcClass',
  'outputQuantityList_quantityElement_quantity',
  'outputQuantityList_quantityElement_uom',

  'humanWelfarePolicy',

  'ilmd_lotNumber',
  'ilmd_productionDate',
  'ilmd_harvestStartDate',
  'ilmd_harvestEndDate',
  'ilmd_itemExpirationDate',
  'ilmd_aquacultureMethod',
  'ilmd_proteinSource',
  'ilmd_countryOfOrigin',

  'ilmd_bestBeforeDate',
  'ilmd_preservationTechniqueCode',

  'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselName',
  'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselID',
  'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselPublicRegistry',
  'ilmd_vesselCatchInformationList_vesselCatchInformation_vesselFlagState',
  'ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber',

  'ilmd_certificationList_certification_certificationType',
  'ilmd_certificationList_certification_certificationAgency',
  'ilmd_certificationList_certification_certificationIdentification',
  'ilmd_certificationList_certification_certificationStandard',
  'ilmd_certificationList_certification_certificationValue'
]

/** @ignore */
export const csvObjectEventHeader = [
  'eventId',

  'action',
  'bizStep',
  'informationProvider',
  'productOwner',
  'eventTime',
  'eventTimeZoneOffset',
  'disposition',

  'epcList_epc',

  'readPoint_id',
  'bizLocation_id',

  'bizTransactionList_bizTransaction_type',
  'bizTransactionList_bizTransaction_value',

  'transshipStartDate',
  'transshipEndDate',
  'landingEndDate',
  'landingStartDate',

  'unloadingPort',

  'humanWelfarePolicy',

  'extension_sourceList_source_type',
  'extension_sourceList_source_value',

  'extension_destinationList_destination_type',
  'extension_destinationList_destination_value',

  'extension_ilmd_harvestEndDate',
  'extension_ilmd_harvestStartDate',

  'extension_ilmd_productionMethodForFishAndSeafoodCode',
  'extension_ilmd_broodstockSource',

  'extension_ilmd_certificationList_certification_certificationType',
  'extension_ilmd_certificationList_certification_certificationAgency',
  'extension_ilmd_certificationList_certification_certificationIdentification',
  'extension_ilmd_certificationList_certification_certificationStandard',
  'extension_ilmd_certificationList_certification_certificationValue',

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
  'extension_ilmd_vesselCatchInformationList_vesselCatchInformation_imoNumber',

  'extension_quantityList_quantityElement_epcClass',
  'extension_quantityList_quantityElement_quantity',
  'extension_quantityList_quantityElement_uom'
]

/** @ignore */
export const csvLocationHeader = [
  'informationProvider',
  'id',
  'name',
  'unloadingPort',
  'streetAddressOne',
  'streetAddressTwo',
  'city',
  'state',
  'postalCode',
  'countryCode',
  'latitude',
  'longitude',
  'contact',
  'telephone',
  'email',
  'vesselID',
  'vesselName',
  'imoNumber',
  'vesselFlagState',
  'vesselOwnerName',
  'vesselOrganizationName',
  'fishingGearTypeCode',
  'geofencePolygon_polygonPoint_seq',
  'geofencePolygon_polygonPoint_value'
]

/** @ignore */
export const csvEpcClassHeader = [
  'informationProvider',
  'id',
  'speciesForFisheryStatisticsPurposesCode',
  'descriptionShort',
  'speciesForFisheryStatisticsPurposesName',
  'tradeItemConditionCode',
  'additionalTradeItemIdentification',
  'preservationTechniqueCode',
  'grossWeight_measurement_value',
  'grossWeight_measurementUnit_code'
]

/** @ignore */
export const csvBusinessDocumentHeader = [
  'senderId',
  'senderName',
  'senderEmail',
  'receiverId',
  'receiverName',
  'receiverEmail'
]
