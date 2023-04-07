import {createSelector} from 'reselect';

const getPersistentStorage = state => state.persistentStorage;
export function createTokenSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.token);
  }
  export function createCurrentUserSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.currentUser);
  }
  
  export function createVerifyTokenSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.verifyToken);
  }
  export function createCookieSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.cookie);
  }
   
  export function createTenantSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.tenant);
  }
  export function createTokenDeviceSelector() {
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.tokenDevice);
  }
  export function createTokenExpiredSelector(){
    return createSelector([getPersistentStorage], persistentStorage => persistentStorage.tokenExpired);
  }
  
  
  