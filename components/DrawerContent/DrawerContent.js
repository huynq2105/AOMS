import React from 'react';
import {Image, StyleSheet,FlatList, View,SafeAreaView} from 'react-native';
import { getEnvVars } from '../../Environment';
import PropTypes from 'prop-types';
import {Text,ListItem,Icon} from 'react-native-elements'
import { getEnvConst } from '../../Environment';
const {version} = getEnvConst();
const screens = {
    Home: {label: '::Menu:Home', requiredPolicy:'CCC', iconName: 'home'},
    // Dashboard: { label: '::Menu:Dashboard', requiredPolicy:'CCC, iconName: 'cube' },
    Notification: {label: 'Notification', requiredPolicy:'', iconName: 'bell', o: true},
    SecurityCheck: {label: 'Security Check', requiredPolicy:'CCC', iconName: 'user-shield', o: true},
    Outbound: {label: 'Outbound', requiredPolicy:'', iconName: 'plane-departure', o: true},
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
  function DrawerContent({navigation, state: {routeNames, index: currentScreenIndex}}) {
    const navigate = screen => {
      navigation.navigate(screen);
      navigation.closeDrawer();
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container} forceInset={{top: 'always', horizontal: 'never'}}>
          <View style={styles.headerView}>
            <Image style={styles.logo} resizeMode='stretch' 
                   source={require('../../assets/aoms_logo.png')}/>
          </View>
          <FlatList
            data={routeNames}
            keyExtractor={item => item}
            renderItem={name => screens[name] ? (
              <View
              key={name}
              >
                <View>
                  <View>
                    <Icon
                      dark={name !== routeNames[currentScreenIndex]}
                      light={name === routeNames[currentScreenIndex]}
                      fontSize={16}
                      type='FontAwesome5'
                      name={screens[name].iconName}
                    />
                  </View>
                </View>
                <View style={{borderBottomWidth: 0}}>
                  <Text
                    style={{
                      color: name === routeNames[currentScreenIndex] ? '#fff' : '#000',
                    }}>
                    {screens[name].o ? screens[name].label : i18n.t(screens[name].label)}
                  </Text>
                </View>
              </View>
            ) : null}
          />
        </SafeAreaView>
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
      marginTop: 0,
      marginBottom: 0,
      width: '100%',
    },
    headerView: {
      borderBottomWidth: 1,
      borderColor: '#eee',
      alignItems: 'center',
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
  
  DrawerContent.propTypes = {
    state: PropTypes.object.isRequired,
  };
  
  export {screens};
  export default DrawerContent;
  