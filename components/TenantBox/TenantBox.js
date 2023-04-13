import React, {
  useState,
} from 'react';
import { 
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {connectToRedux} from '../../utils/ReduxConnect';
import {SIZES, COLORS, FONTS} from '../../constants/theme';
import TextButton from '../TextButton';
import {getTenant} from '../../api/AccountAPI';
import {createTenantSelector} from '../../stores/selectors/PersistentStorageSelectors'
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
const TenantBox = ({
  tenant = {},
  setTenant,
  showTenantSelection,
  toggleTenantSelection,
}) => {
  const [tenantName, setTenantName] = useState(tenant.name);
  const findTenant = () => {
    if (!tenantName) {
      setTenant({});
      toggleTenantSelection();
      return;
    }
    getTenant(tenantName).then(({success, ...data}) => {
      if (!success) {
        Alert.alert(
            'Error',
         'GivenTenantIsNotAvailable',
          [{text: 'Ok'}],
        );
        return;
      }
      setTenant(data);
      toggleTenantSelection();
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection:'row'
          }}
        >
          <Text  style={styles.title}>Agent</Text>
          <Text style={styles.tenant}>
            {tenant.name
              ? tenant.name
              : 'NotSelected'}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            ...styles.switchTouchableOpacity,
            display: !showTenantSelection ? 'flex' : 'none',
          }}
          onPress={() => toggleTenantSelection()}>
          <Text style={{color: '#fff'}}>
           Switch
          </Text>
        </TouchableOpacity>
      </View>
      {showTenantSelection ? (
        <View style={{ flex: 1}}>
            <Text>Name</Text>
            <TextInput style={{
                 backgroundColor:COLORS.lightGray2,
                 height: 55,
                 marginTop: SIZES.base,
                 paddingHorizontal: SIZES.padding,
                 borderRadius: SIZES.radius,
            }} value={tenantName} onChangeText={setTenantName}  autoCapitalize='characters' />
          <View style={{ flexDirection: 'row', justifyContent:'space-around',marginTop:SIZES.padding }}>
            <TextButton buttonContainerStyle={{
                backgroundColor:
                 COLORS.red ,
                width: 130,
                paddingVertical: 7,
                marginLeft: SIZES.radius,
                borderRadius: SIZES.radius,
                borderColor: COLORS.red,
                borderWidth:1
              }} label='Cancel' onPress={() => toggleTenantSelection()} />
            <TextButton buttonContainerStyle={{
                backgroundColor:
                 COLORS.green ,
                 width: 130,
                paddingVertical: 7,
                marginLeft: SIZES.radius,
                borderRadius: SIZES.radius,
                borderColor: COLORS.green,
                borderWidth:1
              }} label='Save'  onPress={() => findTenant()} />
          </View>
        </View>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.padding,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    //backgroundColor:COLORS.green
  },
  TouchableOpacity: {marginTop: 20, width: '49%'},
  switchTouchableOpacity: {
    borderRadius: 10,
    width:60,
    backgroundColor: COLORS.secondaryALS,
    height: 35,
    justifyContent:'center',
    alignItems:'center'
  },
  tenant: {color: 'white',   fontWeight: '800',},
  title: {
    marginRight: 10,
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    //textTransform: 'uppercase',
  },
  hint: {color: '#bbb', textAlign: 'left'},
});
export default connectToRedux({
  component: TenantBox,
  dispatchProps: {
    setTenant: PersistentStorageActions.setTenant,
  },
  stateProps: state => ({
    tenant: createTenantSelector()(state),
  }),
});
