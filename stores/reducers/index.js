import { combineReducers } from '@reduxjs/toolkit';
import PersistentStorageReducer from './PersistentStorageReducer';

import LoadingReducer from './LoadingReducer';
import AppReducer from './AppReducer';

const rootReducer = combineReducers({
  loading: LoadingReducer,
  persistentStorage: PersistentStorageReducer,
  app: AppReducer,
});

export default rootReducer;
