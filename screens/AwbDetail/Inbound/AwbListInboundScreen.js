import React, { useEffect,useState,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet,TouchableOpacity,Image, Alert,Platform, FlatList } from 'react-native';
import { getAwbInfo,getDeliveries,updateDelivery,getListSearchAwb } from '../../../api/InboundAPI';
import Header from '../../../components/Header';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import { dateWithTime } from '../../../utils/DateHelpers';
import moment from 'moment';
import TextButton from '../../../components/TextButton';
import LineDivider from '../../../components/LineDivider';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';

const AwbListInboundScreen = ({navigation,route}) => {
    const awb = route?.params?.awb ?? '';
    const [listSearchAwb,setListSearchAwb] = useState([])
    useEffect(()=>{
        getListSearchAwb({MawbHawbs:awb}).then(({items,totalCount})=>{
            setListSearchAwb(items) 
        })
    },[])
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
            title="Awb Detail"
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
                onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
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
    console.log('===========================',listSearchAwb)
    function renderContent(){
        return(
            <View
                style={{
                    marginHorizontal:SIZES.radius,
                    marginTop:SIZES.radius
                }}
            >
                <FlatList
                    data={listSearchAwb}
                    keyExtractor={item=>item.lagiId}
                    ItemSeparatorComponent={()=><LineDivider lineStyle={{
                        backgroundColor:COLORS.secondaryALS,
                        height:1
                    }} />}
                  ListFooterComponent={()=>(
                    <View
                        style={{
                            height:60
                        }}
                    ></View>
                  )}
                    renderItem={({item,index})=>{
                        return(
                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    paddingVertical:SIZES.base
                                   // backgroundColor:COLORS.green
                                }}
                                onPress={()=> navigation.navigate('AwbDetailInbound',{lagiId:item.lagiId})}
                            >
                                <View
                                    style={{
                                        flex:1
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection:'row'
                                        }}
                                    >
                                        <Text body3>[{item.kund3letterCode}]</Text>
                                        <Text body3>{item.mawb} / {item.lagiHawb}</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection:'row'
                                        }}
                                    >
                                        <Text body3>GW {item.lagiWeightReceived} - </Text>
                                        <Text body3>{item.flight}</Text>
                                    </View>
                                    <Text body3 green>{item.status}</Text>
                                </View>
                                <View
                                style={{
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}
                                >
                                    <Image source={icons.right_arrow}
                                        style={{
                                            width:20,
                                            height:20,
                                            tintColor: COLORS.gray
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />

            </View>
        )
    }
    return (
<View style={styles.container}>
{renderHeader()}
<View
            style={{
              height: Platform.OS == 'ios' ? 90 : 60,
            }}></View>
             {/*  {renderGenaralImfomation()} */}
          {renderContent()}
    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default AwbListInboundScreen;