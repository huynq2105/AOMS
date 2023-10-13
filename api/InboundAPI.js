import api from './API';
export const getPickupAwbs = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/inbound-module/pickup-plan/get-paged-list-agent-with-hawb', {
      params,
    })
    .then(({data}) => data);
};

export const getPickupAwbDetail = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get(
      '/api/inbound-module/pickup-plan/get-paged-list-hawb-by-for-datatable',
      {params},
    )
    .then(({data}) => data);
};
export const updateStatusHawb = (listLagisId, status, updateDate) => {
  return api
    .post(
      `/api/inbound-module/pickup-plan/update-status-hawb?listLagisId=${listLagisId}&status=${status}&updateDate=${updateDate}`,
    )
    .then(({data}) => data);
};
export const getTruckUnloading = (
  params = {maxResultCount: 20, skipCount: 0},
) =>
  api
    .get(
      '/api/master-data-module/vehicles-registrations/get-truck-unloading-import',
      {params},
    )
    .then(({data}) => data);
export const getTruckLoading = (params = {maxResultCount: 20, skipCount: 0}) =>
  api
    .get('/api/inbound-module/truck-loadings/get-vehicles-loading-inbound', {
      params,
    })
    .then(({data}) => data);
export const getListHawbUnloading = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/inbound-module/truck-loadings/get-mawb-by-vehicleisn', {params})
    .then(({data}) => data);
};

export const putArrivedTruck = (body, id) =>
  api
    .put(`api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);
export const putUnloadingTruck = (body, id) =>
  api
    .put(`api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);
export const putCompleteTruck = (body, id) =>
  api
    .put(`api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);
export const getDelivers = (params = {maxResultCount: 20, skipCount: 0}) =>
  api
    .get(
      '/api/master-data-module/vehicles-registrations/GetVehiclesCargoTerminalListAsync',
      {
        params,
      },
    )
    .then(({data}) => data);
    export const getDeliverDetail = id =>
    api.get(`/api/master-data-module/vehicles-registrations/${id}`).then(({data}) => data);

    export const getImages = (id) => {
      api
        .get(
          '/api/master-data-module/vehicles-registrations/GetListVhrFileByVhrId',
          {params: {vehiclesRegistrationId: id}},
        )
        .then(({data}) => data);
    };
    export const updateDeliverDetail = (body, id) =>
  api
    .put(`/api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);
    export const updateStatusComplete = id =>
    api.post(`/api/master-data-module/vhld-vehicledetails/update-qty-weight/${id}`).then(({data}) => data);
    export const  getFolders= filter => (
      params = {Filter: filter},
    ) => {
      return api
        .get('/api/file-management/directory-descriptor', {params})
        .then(({data}) => data);
    };
    export const getTruckFactoryPickup = (params = {maxResultCount: 20, skipCount: 0}) =>
    api
      .get('/api/master-data-module/vehicles-registrations/GetVehiclesLoadingListAsync', {
        params,
      })
      .then(({data}) => data);
      export const getWarehouse = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/master-data-module/ware-houses', {params})
          .then(({data}) => data);
      };

      export const getCargoTerminal = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/share-data-module/erts-remote-transit-sheds', {params})
          .then(({data}) => data);
      };
          export const getCargoTerminalErtsCode = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/share-data-module/erts-remote-transit-sheds', {params})
          .then(({data}) => data);
      };

      export const postVehicle = body =>
  api
    .post('/api/master-data-module/vehicles', body)
    .then(({data}) => data);
    export const postDrivers = body =>
    api
      .post('/api/master-data-module/drivers', body)
      .then(({data}) => data);

      export const getVehicleRegNo = (params = {vehicleRegNo: 0}) => {
        return api
          .get('/api/master-data-module/vehicles/CheckExistVehicleRegNo', {params})
          .then(({data}) => data);
      };
      export const getDriversListAsync = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/master-data-module/drivers/GetDriverListAsync', {params})
          .then(({data}) => data);
      };
      export const getVehicles = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/master-data-module/vehicles', {params})
          .then(({data}) => data);
      };
      export const getDrivers = (params = {maxResultCount: 1000, skipCount: 0}) => {
        return api
          .get('/api/master-data-module/drivers', {params})
          .then(({data}) => data);
      };
      export const getDriversByVehicleId = (params = {VehicleId: 0}) => {
        return api
          .get('/api/master-data-module/drivers', {params})
          .then(({data}) => data);
      };
      export const createTruck = body =>
  api
    .post('/api/master-data-module/vehicles-registrations', body)
    .then(({data}) => data);
    export const getTruckDetail = (
      params = {maxResultCount: 1000, skipCount: 0},
    ) => {
      return api
        .get('/api/inbound-module/truck-loadings/get-mawb-by-vehicleisn', {params})
        .then(({data}) => data);
    };
    export const getSumVehicleDetail = (params = {}) =>
  api
    .get(`/api/inbound-module/truck-loadings/get-sum-vehicle-detail`, {
      params,
    })
    .then(({data}) => data);
    export const getTruckById = id =>
    api.get(`/api/master-data-module/vehicles-registrations/${id}`).then(({data}) => data);
    export const getAwbList = (params = {maxResultCount: 1000, skipCount: 0}) => {
      return api
        .get('/api/inbound-module/truck-loadings/get-list-group-hawb-v1', {params})
        .then(({data}) => data);
    };

    export const getListMawbDetail = (params = {maxResultCount: 1000, skipCount: 0}) => {
      return api
        .get('/api/inbound-module/truck-loadings/get-list-group-by-lagi-id', {params})
        .then(({data}) => data);
    };
    export const AddAwbToTruck = body =>
  api
    .post('/api/inbound-module/truck-loadings/add-hawb-to-truck', body)
    .then(({data}) => data);
    export const unloadAwb = body =>
    api
      .post('/api/inbound-module/truck-loadings/unload-hawb-to-truck', body)
      .then(({data}) => data);
    export const removeManyHawb = (listObjectIsn, vehicleRegId) => {
      return api
        .post(
          `/api/inbound-module/truck-loadings/remove-many-hawb?vehicleRegId=${vehicleRegId}&listObjectIsn=${listObjectIsn}`,
        )
        .then(({data}) => data);
    };
    export const closeTruck = (body, id) =>
  api
    .put(`/api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);
    export const getIrregulars = (params = {maxResultCount: 1000, skipCount: 0}) => {
      return api
        .get('/api/master-data-module/hawb-irrs/get-list-irrs-by-hawb-id', {params})
        .then(({data}) => data);
    };
    export const getAwbInfo = id =>
    api.get(`/api/inbound-module/lagis/${id}`).then(({data}) => data);
    export const postIrregular = body =>
    api
      .post('/api/master-data-module/hawb-irrs', body)
      .then(({data}) => data);


      export const createIrr = body =>
      api.post('/api/master-data-module/hawb-irrs', body).then(({data}) => data);
      export const uploadCompleted = (vehicleRegID, objectIsn) => {
        return api
          .put(
            `/api/inbound-module/truck-loadings/unload-vehicle-by-objectisn?vehicleRegID=${vehicleRegID}&objectIsn=${objectIsn}`,
          )
          .then(({data}) => data);
      };
      export const checkAwbInboundExist = (params = {MawbPrefix:'',MawbSerial:'',Hawb:''}) => {
        return api
          .get('/api/inbound-module/awbSearchs/CheckAwbExist', {params})
          .then(({data}) => data);
      };
      export const getTrackTraceInboundSearch = (params = {MawbPrefix:'',MawbSerial:'',Hawb:''}) => {
        return api
          .get('/api/inbound-module/awbSearchs/GetListAwbSearchAsync', {params})
          .then(({data}) => data);
      };

      export const updateDelivery = (body, id) =>
      api
        .put(`/api/inbound-module/delivery-dockets/update-confirm-delivery?deliveryDocketId=${id}`, body)
        .then(({data}) => data);
        export const getDeliveries = (params = {hawbId: 0}) => {
          return api
            .get('/api/inbound-module/delivery-dockets/get-list-unupdated-received-time-delivery-docket-by/hawb-id', {params})
            .then(({data}) => data);
        };
        export const getListSearchAwb = (params = {MawbHawbs:''}) => {
          return api
            .get('/api/inbound-module/track-trace/get-paged-list-hawb-for-datatable', {params})
            .then(({data}) => data);
        };
  
      
    
