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
    
     
    
