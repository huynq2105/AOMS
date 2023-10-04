import React from 'react';
import {
  View,
 
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Text from '../../constants/Text'
import Header from '../../components/Header';
import {SIZES, COLORS} from '../../constants/theme';
import dummyData from '../../constants/dummyData';
import OutboundItem from '../../components/OutboundItem';
import icons from '../../constants/icons';
import { withPermission } from '../../hocs/PermissionHOC';
import { createAppConfigSelector } from '../../stores/selectors/AppSelectors';
import AppActions from '../../stores/actions/AppActions';
import { connectToRedux } from '../../utils/ReduxConnect';
const OutboundScreen = ({navigation,appConfig}) => {
  const OutboundItemWithPermission = withPermission(OutboundItem,null,appConfig?.auth);
  const renderItem = ({item, index}) => (
    <OutboundItemWithPermission
      customContainerStyle={{
       // borderWidth: 1,
        //boderColor: COLORS.secondaryALS,
        marginLeft: SIZES.base,
      }}
      policyKey = {item.requiredPolicy}
      image={item.icon}
      title={item.description}
      onPress={() =>
        navigation.navigate(item.srceenNavigagor, {screen: item.screenName})
      }
    />
  );
  function renderHeader() {
    return (
      <Header
        // eslint-disable-next-line react-native/no-inline-styles
        containerStyle={{
          height: 60,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          backgroundColor: COLORS.primaryALS,
          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Outbound"
        rightComponent={
          <View
            style={{
              width: 35,
              height: 35,
            }}></View>
        }
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              justifyContent: 'center',
            }}
            onPress={() => navigation.openDrawer()}>
            <Image
              source={icons.menu}
              style={{
                width: 24,
                height: 24,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        }
      />
    );
  }
  function renderOffAirportTerminal(){
    return(
      <FlatList
        data={dummyData.featuresExpData_OffAirport}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        listKey={(item, index) => 'D' + index.toString()}
        renderItem={renderItem}
        style={{
          marginTop: SIZES.base,
          //padding: SIZES.base,
          // backgroundColor:COLORS.green,
          marginBottom: SIZES.base,
        }}
      />
    )
  }
  function renderAirportTerminal(){
    return(
      <FlatList
      data={dummyData.featuresExpData_Airport}
      numColumns={2}
      keyExtractor={(item, index) => item.id}
      listKey={(item, index) => 'D' + index.toString()}
      renderItem={renderItem}
      style={{
        marginTop: SIZES.base,
        //padding: SIZES.base,
        // backgroundColor:COLORS.green,
        marginBottom: SIZES.base,
      }}
    />
    )
  }
  function renderContent() {
   
    return (
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
        ListHeaderComponent={
          <View
          style={{
           // marginTop: SIZES.padding,
           marginBottom:SIZES.base,
            paddingHorizontal: SIZES.base,
          }}>
          <Text h3>Factory:</Text>
        </View>
        }
       /*    columnWrapperStyle={{justifyContent:'space-around'}} */
          data={dummyData.featuresExpData_Factory}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={renderItem}
          style={{
            marginTop: SIZES.base,
            padding: SIZES.base,
          }}
          ListFooterComponent={
            <View>
              <Text h3>Off-Airport Terminal:</Text>
              {renderOffAirportTerminal()}
              <Text h3>Airport Terminal:</Text>
              {renderAirportTerminal()}
            </View>
         
          }
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default connectToRedux({
  component: OutboundScreen,
  stateProps: state => ({
    appConfig: createAppConfigSelector()(state),
  }),
  dispatchProps: {
    fetchAppConfig: AppActions.fetchAppConfigAsync,
  },
});

