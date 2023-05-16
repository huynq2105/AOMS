import React from 'react';
import {
  View,
  Text,
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
const OutboundScreen = ({navigation}) => {
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
  function renderContent() {
    const renderItem = ({item, index}) => (
      <OutboundItem
        customContainerStyle={{
         // borderWidth: 1,
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
    return (
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          columnWrapperStyle={{justifyContent:'space-around'}}
          data={dummyData.featuresExpData}
          numColumns={3}
          keyExtractor={(item, index) => item.id}
          renderItem={renderItem}
          style={{
            marginTop: SIZES.padding,
            padding: SIZES.base,
          }}
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

export default OutboundScreen;
