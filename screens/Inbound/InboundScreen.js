import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import Header from '../../components/Header';
import {SIZES, COLORS} from '../../constants/theme';
import dummyData from '../../constants/dummyData';
import OutboundItem from '../../components/OutboundItem';
import icons from '../../constants/icons';
import Text from '../../constants/Text';
const InboundScreen = ({navigation}) => {
  const renderItem = ({item, index}) => (
    <OutboundItem
      customContainerStyle={{
        boderColor: COLORS.secondaryALS,
        marginLeft: SIZES.base,
      }}
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
        title="INBOUND"
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
                width: 20,
                height: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        }
      />
    );
  }
  function renderOffCargoTerminal() {
    return (
      <FlatList
        data={dummyData.featuresImpData_OffAirport}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        style={{
          marginTop: SIZES.base,
          //padding: SIZES.base,
          // backgroundColor:COLORS.green,
          marginBottom: SIZES.base,
        }}
      />
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
        }}>
      
        <FlatList
          data={dummyData.featuresImpData}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          ListHeaderComponent={
            <View
            style={{
             // marginTop: SIZES.padding,
              paddingHorizontal: SIZES.base,
              marginBottom:SIZES.base
            }}>
            <Text h3>Airport Terminal:</Text>
          </View>
          }
          renderItem={renderItem}
          style={{
            marginTop: SIZES.base,
            padding: SIZES.base,
            // backgroundColor:COLORS.green,
            marginBottom: SIZES.base,
          }}
          ListFooterComponent={
            <View
              style={
                {
                  // marginTop:SIZES.padding,
                  //paddingHorizontal:SIZES.base
                }
              }>
              <Text h3>Off-Airport Terminal:</Text>
              {renderOffCargoTerminal()}
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

export default InboundScreen;
