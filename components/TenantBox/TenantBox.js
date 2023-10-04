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
import {Picker} from '@react-native-picker/picker';
import {createTenantSelector} from '../../stores/selectors/PersistentStorageSelectors'
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
const TenantBox = ({
  tenant = {},
  setTenant,
  showTenantSelection,
  toggleTenantSelection,
}) => {
  const [tenantName, setTenantName] = useState(tenant.name);
  const [listTenant, setListTenant] = useState([{id: 0, label: '---', value: '---'},{id: 0, label: 'ALSB', value: 'ALSB'},{id: 1, label: 'ALSW', value: 'ALSW'},{id: 2, label: 'ALSE', value: 'ALSE'},{id: 3, label: 'CLC', value: 'CLC'}]);
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
          <Text  style={styles.title}>Company</Text>
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
        <View style={{ flex: 1,
        paddingHorizontal:SIZES.padding}}>
            <Text>Name</Text>
            {/* <TextInput style={{
                 backgroundColor:COLORS.lightGray2,
                 height: 55,
                 marginTop: SIZES.base,
                 paddingHorizontal: SIZES.padding,
                 borderRadius: SIZES.radius,
            }} value={tenantName} onChangeText={setTenantName}  autoCapitalize='characters' /> */}
            <Picker
                  mode="dropdown"
                  style={{
                    borderColor: COLORS.gray,
                    borderWidth:1,
                    color: COLORS.gray
                  }}
                  selectedValue={tenantName}
                  onValueChange={(itemValue, itemIndex) =>{
                    console.log('Item Value==================',itemValue)
                    setTenantName(itemValue)
                  }
                   
                  }>
                  {listTenant.map(it => (
                    <Picker.Item
                      key={it.id.toString()}
                      label={it.label}
                      value={it.value}
                    />
                  ))}
                </Picker>
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
                 COLORS.primaryALS ,
                 width: 130,
                paddingVertical: 7,
                marginLeft: SIZES.radius,
                borderRadius: SIZES.radius,
                borderColor: COLORS.primaryALS,
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
  tenant: {color: COLORS.primaryALS,fontSize:16,   fontWeight: '800',},
  title: {
    marginRight: 10,
    color: COLORS.primaryALS,
    fontSize: 14,
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
