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
export const getAgents = (params = {type: 'OUTBOUND', page: 0}) => {
  return api
    .get('/api/master-data-module/kunds/get-paged-list-agent-for-select2', {params})
    .then(({data}) => data);
};
export const getDriversByVehicleId = (params = {VehicleId: 0}) => {
  return api
    .get('/api/master-data-module/drivers', {params})
    .then(({data}) => data);
};
export const createTruck = body =>
  api.post('/api/master-data-module/vehicles-registrations', body).then(({data}) => data);

  export const createDriver = body =>
  api.post('/api/master-data-module/drivers', body).then(({data}) => data);

  export const getTruckFactoryPickup = (params = {maxResultCount: 1000, skipCount: 0}) => {
    return api
      .get('/api/master-data-module/vehicles-registrations/GetVehiclesLoadingListAsync', {params})
      .then(({data}) => data);
  };
  export const getPoDoByVehicle = (params = {maxResultCount: 1000, skipCount: 0}) => {
    return api
      .get('/api/outbound-module/do-po-manages/get-po-do-by-vehicle', {params})
      .then(({data}) => data);
  };

  export const getSumPoDoVehicleDetail = (params={}) =>
  api.get(`/api/outbound-module/do-po-manages/get-sum-po-vehicle-detail`,{params}).then(({data}) => data);



