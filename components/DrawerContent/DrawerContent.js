import React from 'react';
import {Image, StyleSheet,FlatList, View,SafeAreaView,TouchableOpacity} from 'react-native';
import { getEnvVars } from '../../Environment';
import PropTypes from 'prop-types';
import {Text,ListItem} from 'react-native-elements'
import { getEnvConst } from '../../Environment';
import images from '../../constants/images';
import { COLORS, SIZES } from '../../constants/theme';
import icons from '../../constants/icons';
import { connectToRedux } from '../../utils/ReduxConnect';
import AppActions from '../../stores/actions/AppActions';
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
import TextButton from '../TextButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
const {version} = getEnvConst();
const screens = {
    Home: {label: '::Menu:Home', requiredPolicy:'CCC', iconName: 'home'},
    // Dashboard: { label: '::Menu:Dashboard', requiredPolicy:'CCC, iconName: 'cube' },
    Notification: {label: 'Notification', requiredPolicy:'', iconName: 'plane-arrival', o: true},
    SecurityCheck: {label: 'Security Check', requiredPolicy:'CCC', iconName: 'user-shield', o: true},
    Outbound: {label: 'Outbound', requiredPolicy:'', iconName: 'flight', o: true},
    Inbound: {label: 'Inbound', requiredPolicy:'CCC', iconName: 'plane-arrival', o: true},
    QuickScan: {label: 'Quick Scan', requiredPolicy:'CCC', iconName: 'search', o: true},
    Inventory: {label: 'Inventory', requiredPolicy:'CCC', iconName: 'boxes', o: true},
    Report: {label: 'Reports', requiredPolicy:'CCC', iconName: 'chart-bar', o: true},
    Track: {label: 'Track & Trace', requiredPolicy:'', iconName: 'search', o: true},
    // Users: {
    //   label: 'AbpIdentity::Users',
    //   iconName: 'home',
    //   requiredPolicy: 'AbpIdentity.Users',
    // },
    // Tenants: {
    //   label: 'Saas::Tenants',
    //   iconName: 'home',
    //   requiredPolicy: 'Saas.Tenants',
    // },
    Settings: {label: 'AbpSettingManagement::Settings', requiredPolicy:'', iconName: 'cog'},
  };
  const DrawerContent = ({navigation, state: {routeNames, index: currentScreenIndex},logOutHandle}) =>{
    const navigate = screen => {
      //var screenName = screen.substring(0,screen.length-3)
      navigation.closeDrawer();
      navigation.navigate(screen);
     
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container} forceInset={{top: 'always', horizontal: 'never'}}>
          <View style={styles.headerView}>
            <Text style={{
              fontSize:25
            }}>AOMS</Text>
          </View>
          <FlatList
            data={routeNames}
            keyExtractor={item => item}
            renderItem={({item,index}) =>  (
              <TouchableOpacity
              key={item}
              style={{
                // justifyContent:'center',
                 alignItems:'center',
                 flexDirection:"row"
              }}
              onPress={()=>navigate(item)}
              >
                <View>
                  <View
                    style={{
                      padding:10
                    }}
                  >
                    {/* <Icon name={screens[item].iconName} size={24} /> */}
                   {/*  <Icon
                      dark={item !== routeNames[currentScreenIndex]}
                      light={item === routeNames[currentScreenIndex]}
                      fontSize={16}
                      type='FontAwesome5'
                      name='home'
                    /> */}
                  </View>
                </View>
                <View style={{borderBottomWidth: 0}}>
                  <Text
                    style={{
                      color: item === routeNames[currentScreenIndex] ? COLORS.primaryALS : COLORS.secondaryALS,
                      fontSize:20,
                      //marginHorizontal
                    }}>
                {item}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
        <TextButton
          label={'Log out'}
          onPress={logOutHandle}
          buttonContainerStyle={{
            marginHorizontal:SIZES.padding,
            paddingVertical: SIZES.base,
            borderRadius: SIZES.base
          }}
          
        />
        <View style={styles.footer}>
          <Text note style={styles.copyRight}>© AOMS</Text>
          <Text note style={styles.version}>{version}</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    logo: {
      marginTop: 10,
      //marginBottom: 0,
      width: '90%',
      //width:70,
      height:50
    },
    headerView: {
      borderBottomWidth: 1,
      borderColor: '#eee',
      alignItems: 'center',
      paddingVertical:SIZES.base
    },
    navItem: {
      marginLeft: 0,
      marginBottom: 3,
      paddingLeft: 10,
      width: '100%',
      backgroundColor: '#f2f2f2',
    },
    footer: {
      backgroundColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    copyRight: {
      margin: 15,
    },
    version: {
      margin: 15,
    },
  });
  
  // DrawerContent.propTypes = {
  //   state: PropTypes.object.isRequired,
  // };
  export default DrawerContent
  export {screens};
  
  
  