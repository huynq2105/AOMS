import api from './API';

export const getTruckUnloadingOutbound = (
  params = {maxResultCount: 20, skipCount: 0},
) =>
  api
    .get(
      '/api/master-data-module/vehicles-registrations/get-truck-unloading-import',
      {params},
    )
    .then(({data}) => data);
// export const getPoDoByVihicle = (params = {maxResultCount: 20, skipCount: 0}) =>
//   api
//     .get('/api/outbound-module/do-po-manages/get-po-do-by-vehicle', {params})
//     .then(({data}) => data);
export const getDeliver = (params = {maxResultCount: 20, skipCount: 0}) =>
  api
    .get(
      '/api/master-data-module/vehicles-registrations/GetVehiclesCargoTerminalListAsync',
      {params},
    )
    .then(({data}) => data);

export const createVehicle = body =>
  api.post('/api/master-data-module/vehicles', body).then(({data}) => data);
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
export const getWarehouse = (params = {maxResultCount: 1000, skipCount: 0}) => {
  return api
    .get('/api/master-data-module/ware-houses', {params})
    .then(({data}) => data);
};
export const getFactory = (
  params = {
    maxResultCount: 1000,
    skipCount: 0,
    KundCustomerTypeCode: 'FACTORY',
  },
) => {
  return api
    .get('/api/master-data-module/kunds', {params})
    .then(({data}) => data);
};
export const getAgents = (params = {type: 'OUTBOUND', page: 0}) => {
  return api
    .get('/api/master-data-module/kunds/get-paged-list-agent-for-select2', {
      params,
    })
    .then(({data}) => data);
};
export const getWareHousePickUp = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/master-data-module/ware-house-pickup', {
      params,
    })
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

export const createDriver = body =>
  api.post('/api/master-data-module/drivers', body).then(({data}) => data);

export const getTruckFactoryPickup = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get(
      '/api/master-data-module/vehicles-registrations/GetVehiclesLoadingListAsync',
      {params},
    )
    .then(({data}) => data);
};
export const getPoDoByVehicle = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/outbound-module/do-po-manages/get-po-do-by-vehicle', {params})
    .then(({data}) => data);
};

export const getSumPoDoVehicleDetail = (params = {}) =>
  api
    .get(`/api/outbound-module/do-po-manages/get-sum-po-vehicle-detail`, {
      params,
    })
    .then(({data}) => data);

export const getListPoDo = (params = {maxResultCount: 1000, skipCount: 0}) => {
  return api
    .get('/api/outbound-module/do-po-manages/get-po-do-list', {params})
    .then(({data}) => data);
};

export const AddPoDoToTruck = body =>
  api
    .post('/api/outbound-module/truck-pickups/add-po-do-to-truck', body)
    .then(({data}) => data);

export const closeTruck = (body, id) =>
  api
    .put(`/api/master-data-module/vehicles-registrations/${id}`, body)
    .then(({data}) => data);

export const createPo = body =>
  api
    .post('/api/outbound-module/shipment-orders/create-new-po', body)
    .then(({data}) => data);
export const removeAllGroupByMawb = (listLabId, vehicleRegId) => {
  return api
    .post(
      `/api/master-data-module/vhld-vehicledetails/remove-all-group-by-mawb?vehicleRegId=${vehicleRegId}&listLabId=${listLabId}`,
    )
    .then(({data}) => data);
};
export const UpdatePiecesLoaded = (vehicleRegId, piecesLoaded) => {
  return api
    .put(
      `/api/master-data-module/vhld-vehicledetails/update-pcs-loaded?vehicleDetailId=${vehicleRegId}&pcs=${piecesLoaded}`,
    )
    .then(({data}) => data);
};

export const getDoByNumber = (params = {maxResultCount: 1000, skipCount: 0}) =>
  api
    .get(`/api/outbound-module/do-po-manages`, {params})
    .then(({data}) => data);
export const getTruckById = id =>
  api
    .get(`/api/master-data-module/vehicles-registrations/${id}`)
    .then(({data}) => data);
export const getVihicleById = id =>
  api.get(`/api/master-data-module/vehicles/${id}`).then(({data}) => data);
export const getTruckLoading = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/outbound-module/truck-loading-plan/get-list-truck', {
      params,
    })
    .then(({data}) => data);
};
export const getAwbLoading = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/outbound-module/do-dnn-pallet-mgr/get-list-mawb-to-move', {
      params,
    })
    .then(({data}) => data);
};
export const getListDetailTruck = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/outbound-module/truck-loading-plan/get-list-detail-truck', {
      params,
    })
    .then(({data}) => data);
};
export const getListPalletToMove = (
  params = {maxResultCount: 1000, skipCount: 0},
) => {
  return api
    .get('/api/outbound-module/do-dnn-pallet-mgr/get-list-pallet-to-move', {
      params,
    })
    .then(({data}) => data);
};
export const updatePalletLocation = body =>
  api
    .post('/api/outbound-module/do-dnn-pallet-mgr/update-pallet-location', body)
    .then(({data}) => data);
    export const getListPalletByMawbInTruck = (
      params = {maxResultCount: 1000, skipCount: 0},
    ) => {
      return api
        .get('/api/outbound-module/do-dnn-pallet-mgr/get-list-pallet-by-mawb-in-truck', {
          params,
        })
        .then(({data}) => data);
    };
