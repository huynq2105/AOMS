import api from './API';
export const updateSeal = body =>
  api
    .post('/api/master-data-module/vhsl-vehicle-seal-infos/update-seal', body)
    .then(({data}) => data);
export const getSealByTruckId = (
  params = {maxResultCount: 20, skipCount: 0, VehicleRegId: 0},
) =>
  api
    .get('/api/master-data-module/vhsl-vehicle-seal-infos', {params})
    .then(({data}) => data);
export const getVehicleSecurity = (params = {}) =>
  api
    .get(
      `/api/master-data-module/vehicles-registrations/get-vehicle-security-check`,
      {
        params,
      },
    )
    .then(({data}) => data);
export const checkSeal = body =>
  api
  .post('/api/master-data-module/vehicles-registrations/check-seal', body)
  .then(({data}) => data);
