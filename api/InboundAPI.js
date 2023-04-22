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
    export const getTruckloading = (
      params = {maxResultCount: 20, skipCount: 0},
    ) =>
      api
        .get(
          '/api/inbound-module/truck-loadings/get-vehicles-loading-inbound',
          {params},
        )
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
