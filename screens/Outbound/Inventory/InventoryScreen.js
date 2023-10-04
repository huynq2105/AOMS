import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { set, uniqueId } from 'lodash';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import {getTruckFactoryPickup,updatePalletLocation,getListPalletToMove} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import CheckComponent from '../../../components/Checkbox';
import { FlatList } from 'react-native-gesture-handler';
import ItemSeparator from '../../../components/ItemSeparator'
import {useToast} from 'react-native-toast-notifications';
const InventoryScreen = ({navigation}) => {
  const [pltText, setPltText] = useState('');
  const today = moment();
  const toast = useToast();
  const [history,setHistory] = useState([])
  const textPltRef = useRef();
  const textLocsRef = useRef();
  const handleMoveShipment = () =>{
    console.log('handleMoveShipment')
    const payLoad = {PalletNo:pltText}
    const scanHistory = [];
    getListPalletToMove(payLoad)
      .then(({items, totalCount: total}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
       /*  items.forEach((item, index) => {
           if(item.location != ''){
            result.push(item)
           }
          }); */
        setHistory([...history,...items])
      })
      .catch(e => console.log(e));
    // if(history.length===10){
    //     history.pop();
    // }
    setPltText('')
  }
  console.log('scanHistory',history)
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
        title="Inventory"
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

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderHistory(){
    return(
        <View
            style={{
                marginTop: SIZES.base,
                marginHorizontal:SIZES.base
            }}
        >
            <View
                style={{
                    backgroundColor:COLORS.primaryALS,
                    alignItems:'center',
                    height:35,
                    justifyContent:'center'
                }}
            >
              <Text h3 white>THÀNH CÔNG</Text>
            </View>
          
            <FlatList
                data={history.sort((a,b)=>b.time-a.time)}
                keyExtractor={item=>item.palletNo}
                ListHeaderComponent={<View
                    style={{
                      flexDirection: 'row',
                      borderTopColor: COLORS.gray,
                      borderTopWidth: 1,
                      marginTop:SIZES.base
                    }}
                >
                      <View style={{
                             flex:1,
                             borderLeftWidth: 1,
                             borderLeftColor: COLORS.gray,
                             paddingHorizontal: 5,
                             paddingVertical: SIZES.base,
                             justifyContent: 'center',
                             alignItems: 'center',
                             backgroundColor:COLORS.lightGray1
                        }}><Text h3>STT</Text></View>
                     <View style={{
                            flex:3,
                            borderLeftWidth: 1,
                            borderLeftColor: COLORS.gray,
                            paddingHorizontal: 5,
                            paddingVertical: SIZES.base,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:COLORS.lightGray1
                        }}><Text >DO</Text></View>
                    <View style={{
                            flex:3,
                            borderLeftWidth: 1,
                            borderLeftColor: COLORS.gray,
                            paddingHorizontal: 5,
                            paddingVertical: SIZES.base,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:COLORS.lightGray1
                        }}><Text >PalletID</Text></View>
                    
                    <View style={{
                            flex:3,
                            borderLeftWidth: 1,
                  borderLeftColor: COLORS.gray,
                  paddingHorizontal: 5,
                  paddingVertical: SIZES.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRightWidth: 1,
                  borderRightColor: COLORS.gray,
                  backgroundColor:COLORS.lightGray1
                        }}><Text >Location</Text></View>
                </View>}
                ItemSeparatorComponent={()=><ItemSeparator />}
                renderItem={({item,index})=>(
                    <View
                        style={{
                          flexDirection:'row',
                          height:30,
                          borderTopWidth: 1,
              borderColor: COLORS.gray,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor:index%2 == 1? COLORS.lightGray1 : null,
                        }}
                    >
                          <View style={{
                           flex: 1,
                           borderLeftWidth: 1,
                           borderLeftColor: COLORS.gray,
                           //borderLeftWidth: 1,
                           //borderLeftColor: COLORS.secondaryALS,
                           alignItems: 'center',
                           //  paddingHorizontal: SIZES.radius,
                          justifyContent: 'center',
                        }}><Text >{index + 1}</Text></View>
                           <View style={{
                            flex:3,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >{item.doNo}</Text></View>
                         <View style={{
                            flex:3,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >{item.palletNo}</Text></View>
                    
                    <View style={{
                            flex:3,
                            justifyContent:'center',
                            alignItems:'center',
                            borderRightWidth: 1,
                            borderRightColor: COLORS.gray,
                        }}><Text >{item.location}</Text></View>
                    </View>
                )}
            />
        </View>
    )
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          marginTop: 80,
          flex: 1,
        }}>
        <View
          style={{
            marginTop: SIZES.base,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text body2>Plt</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 60,
              flex: 5,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              borderWidth: 1,
              borderColor: COLORS.black,
            }}>
            <Image
              source={icons.barcode}
              style={{
                width: 23,
                height: 23,
              }}
            />
            <TextInput
              style={{
                flex: 1,
              }}
              ref={textPltRef}
              value={pltText}
              placeholder={'Pallet'}
              placeholderTextColor={COLORS.primaryALS}
              onSubmitEditing={handleMoveShipment}
              onChangeText={text => {
                setPltText(text);
              }}
            />
            {/*  {appendComponent} */}
          </View>
        </View>
        {renderHistory()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    //padding: 16,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 35,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default InventoryScreen;
