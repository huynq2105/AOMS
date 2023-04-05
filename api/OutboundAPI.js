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
export const getPoDoByVihicle = (params = {maxResultCount: 20, skipCount: 0}) =>
  api
    .get('/api/outbound-module/do-po-manages/get-po-do-by-vehicle', {params})
    .then(({data}) => data);
export const getDeliver = (params = {maxResultCount: 20, skipCount: 0}) =>
api
  .get('/api/master-data-module/vehicles-registrations/GetVehiclesCargoTerminalListAsync', {params})
  .then(({data}) => data);
