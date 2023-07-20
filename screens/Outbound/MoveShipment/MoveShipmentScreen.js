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
import {getTruckFactoryPickup,updatePalletLocation} from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import CheckComponent from '../../../components/Checkbox';
import { FlatList } from 'react-native-gesture-handler';
import ItemSeparator from '../../../components/ItemSeparator'
import {useToast} from 'react-native-toast-notifications';
const MoveShipmentScreen = ({navigation}) => {
  const [pltText, setPltText] = useState('');
  const [locsText, setLocsText] = useState('');
  const today = moment();
  const toast = useToast();
  const [history,setHistory] = useState([])
  const textPltRef = useRef();
  const textLocsRef = useRef();
  const handleMoveShipment = () =>{
    console.log('handleMoveShipment')
    const payLoad = {pallet:pltText,location:locsText}
    const scanHistory = [];
    updatePalletLocation(payLoad).then((data)=>{
      toast.show('Move Pallet thành công! ', {
        type: 'success',
        placement: 'top',
        swipeEnabled: true,
        style: {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.green,
        },
        duration: 2000,
        animationType: 'slide-in',
      });
    }).catch((e)=>console.log(e))
    // if(history.length===10){
    //     history.pop();
    // }
    scanHistory.push({plt:pltText,loc:locsText,time:new Date()})
    setHistory([...history,...scanHistory])
    setPltText('')
    setLocsText('')
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
        title="Move Shipment"
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
                marginTop:pltText.length===0 ? SIZES.base + 70 : SIZES.base,
                
            }}
        >
            <View
                style={{
                    backgroundColor:COLORS.green,
                    alignItems:'center',
                    height:40,
                    justifyContent:'center'
                }}
            >
            <Text h2 white>THÀNH CÔNG</Text>
            </View>
          
            <FlatList
                data={history.sort((a,b)=>b.time-a.time)}
                keyExtractor={item=>item.plt}
                ListHeaderComponent={<View
                    style={{
                        flexDirection:'row'
                    }}
                >
                    <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >PalletID</Text></View>
                    
                    <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >Location</Text></View>
                </View>}
                ItemSeparatorComponent={()=><ItemSeparator />}
                renderItem={({item,index})=>(
                    <View
                        style={{
                            flexDirection:'row',
                            height:30
                        }}
                    >
                         <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >{item.plt}</Text></View>
                    
                    <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }}><Text >{item.loc}</Text></View>
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
              onChangeText={text => {
                setPltText(text);
              }}
            />
            {/*  {appendComponent} */}
          </View>
        </View>
        {pltText.length>0 && (
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
              <Text body2>Locs</Text>
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
                disableFullscreenUI={true}
                ref={textLocsRef}
                value={locsText}
                placeholder={'Location'}
                placeholderTextColor={COLORS.primaryALS}
                onSubmitEditing={handleMoveShipment}
                onChangeText={text => {
                  setLocsText(text);
                }}
              />
              {/*  {appendComponent} */}
            </View>
          </View>
        )}
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

export default MoveShipmentScreen;
