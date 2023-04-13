import React from 'react';
import { View, Text, StyleSheet,Platform,FlatList } from 'react-native';
import Header from '../../components/Header';
import { SIZES,COLORS } from '../../constants/theme';
import dummyData from '../../constants/dummyData';
import OutboundItem from '../../components/OutboundItem';
import TextButton from '../../components/TextButton';
import AppActions from '../../stores/actions/AppActions';
import { connectToRedux } from '../../utils/ReduxConnect';
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
const HomeScreen = ({navigation,logoutAsync,setTokenExpired,setVerifyToken}) => {

    function renderLogout(){
    return(
  <TextButton
  label='Log out'
  buttonContainerStyle={{
    marginHorizontal:SIZES.padding,
    height:40,
    borderRadius:SIZES.radius
  }}
  onPress={()=>{
    setTokenExpired(null);
    //setVerifyToken('');
    logoutAsync();
  }}
  />)
}
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
            title="HomeS"
            rightComponent={
              <View
                style={{
                  width: 35,
                  height: 35,
                }}></View>
            }
            leftComponent={
              <View
              style={{
                width: 35,
                height: 35,
              }}></View>
            
          }
    
    
            /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
          />
        );
      }
      function renderContent(){
        const renderItem = ({item, index}) => (
          <OutboundItem
          customContainerStyle={{
            borderWidth:1,
            boderColor: COLORS.secondaryALS,
            marginLeft:SIZES.base
          }}
           title={item.description}
           onPress={() =>
            navigation.navigate(item.srceenNavigagor, {
              screen: item.srceenNavigagor,
            })
          }
          />
        );
        return(
            <View
                style={{
                    flex:1,
                    
                   // justifyContent:'center',
                    //alignItems:'center',
                }}
            >
              <FlatList
                data={dummyData.featuresHomeData}
                numColumns={2}
                keyExtractor={(item,index)=>item.id}
                renderItem={renderItem}

                style={{
                  marginTop:SIZES.padding,
                  padding:SIZES.base
                }}
              />
            </View>
        )
      }
    return (
<View style={styles.container}>
{/* {renderHeader()} */}
    {/*   <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View> */}
      {/*    <Text
        style={{
          ...FONTS.h3,
          marginHorizontal: SIZES.padding,
          marginVertical: SIZES.padding,
        }}>
        Gần đây
      </Text> */}
      {renderContent()}
      {renderLogout()}
    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})


export default connectToRedux({
  component: HomeScreen,
  dispatchProps: {
    logoutAsync: AppActions.logoutAsync,
    setTokenExpired: PersistentStorageActions.setTokenExpired,
    setVerifyToken: PersistentStorageActions.setVerifyToken
  },
});
