import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import { rootSaga } from './sagas';
import ReduxThunk from 'redux-thunk';
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['persistentStorage'],
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
const DefaultMiddleware = (getDefaultMiddleware) =>getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
})
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: [sagaMiddleware,ReduxThunk]
    
  });
  
  export const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);