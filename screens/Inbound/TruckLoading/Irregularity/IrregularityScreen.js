/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import {
getAwbInfo,
} from '../../../../api/InboundAPI';
import IconButton from '../../../../components/IconButton';

const IrregularityScreen = ({navigation,route}) => {
    const awb = route?.params?.awb ?? {};
    const [awbDetail,setAwbDetail] = useState(null);

    useFocusEffect(
        useCallback(() => {
          getAwbInfo(awb.lagiId)
          .then(data => {
            setAwbDetail(data);
          })
          .catch(e => {
            console.log('DLV73', e);
          });
        }, []),
      );
    function renderHeader() {
        return (
          <Header
            containerStyle={{
              height: 60,
              paddingHorizontal: SIZES.padding,
              alignItems: 'center',
              //backgroundColor: COLORS.green,
              flex: 1,
              //marginTop: Platform.OS == 'ios' ? 30 : 10,
            }}
            leftComponent={
              <TouchableOpacity
                style={{
                  width: 35,
                  height: 35,
                  //backgroundColor:COLORS.red,
                  // alignItems:'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.goBack()}>
                <Image
                  source={icons.back}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <View
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            }
            title="Irregularity"
            /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
          />
        );
      }
      function renderContent(){
        return(
            <>
            <View
            style={{
                paddingHorizontal:SIZES.radius
            }}>
                <Text h2>MAWB: {awb.mawb}</Text>
                <Text h2>HAWB: {awb.hawb}</Text>
            </View>
              {/* render detai */}
            <View
                    style={{
                        backgroundColor:COLORS.lightOrange2,
                        borderTopColor:COLORS.orange,
                        borderTopWidth:1,
                        borderBottomColor:COLORS.orange,
                        borderBottomWidth:1,
                        paddingHorizontal:SIZES.radius,
                        marginTop:SIZES.padding,
                        paddingVertical:SIZES.radius
                    }}
                >
                    <View
                        style={{
                            alignItems:'center'
                        }}
                    >
                        <Text h2>AWB Information</Text>
                    </View>
                    <View>
                        <Text body3>Pieces: {awbDetail?.lagiQuantityReceived}</Text>
                        <Text body3>Gross Weight: {awbDetail?.lagiWeightReceived}</Text>
                        <Text body3>Commodity: {awbDetail?.lagiGoodsContent}</Text>
                        <Text body3>Origin - Des: {awbDetail?.lagiAwbOrigin} - {awbDetail?.lagiAwbDest}</Text>
                        <Text body3>Shipper: {awbDetail?.lagiShipperName}</Text>
                        <Text body3>Consignee: {awbDetail?.lagiConsigneeName}</Text>
                        <Text body3>Remarks: {awbDetail?.lagiShipmentRemarks}</Text>
                    </View>
                </View>
            </>
        )
      }
    return (
        <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View
          style={{
            marginTop: Platform.OS === 'android' ? 80 : 60,
          }}>
        
        </View>
       
        {renderContent()}
        <View
          style={{
            position: 'absolute',
  
            bottom: 20,
            right: 20,
          }}>
          <IconButton
            icons={icons.plus}
            iconStyle={{
              tintColor: COLORS.white,
            }}
            containerStyle={{
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.green,
            }}
            onPress={() =>
              Platform.OS === 'ios'
                ? navigation.navigate('AddIrregularity',{awb})
                : navigation.navigate('AddIrregularity',{awb})
            }
          />
        </View>
      </SafeAreaView>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    }
})

export default IrregularityScreen;