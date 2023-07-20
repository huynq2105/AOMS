import {useEffect,useState} from 'react'
import {store} from '../stores'
import {createGrantedPolicySelector} from '../stores/selectors/AppSelectors'

export function usePermission(key) {
  console.log('Keyyyyyyyyy==========',key)
    const [permission, setPermission] = useState(false);
  
    const state = store.getState();
    const policy = createGrantedPolicySelector(key)(state);
    console.log('policy==========',policy)
    useEffect(() => {
      setPermission(policy);
    }, [policy]);
    console.log('permission==========',permission)
    return permission;
  }