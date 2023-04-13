import React, {useState, useEffect} from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,

  TouchableOpacity,
  View,
  Platform,
  Image
} from 'react-native';
import Text from '../../../constants/Text'
import { SIZES,COLORS,FONTS } from '../../../constants/theme';
//import Autocomplete component
import Autocomplete from 'react-native-autocomplete-input';
import {getUsers} from '../../../api/IdentityAPI'
import Header from '../../../components/Header';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import moment from 'moment';
import utils from '../../../utils/Utils';
import { getDeliver,getTruckFactoryPickup } from '../../../api/OutboundAPI';
import DataRenderResult from '../../../components/DataRenderResult/DataRenderResult';
import IconButton from '../../../components/IconButton';
import { DMY_FORMAT } from '../../../utils/DateHelpers';
import images from '../../../constants/images';
const FactoryPickupScreen = ({navigation}) => {
  const [filterDate, setFilterDate] = useState({
    show: false,
    val: new Date()
  });
  const today = moment();
  const [params,setParams] = useState({LoadingArrivalDate:DMY_FORMAT(filterDate.val),CustomerId:0,TruckType:'PICK UP',Type: 'EXPORT'});
  const changeFilterDate = (date) => {
    console.log(date);
    setFilterDate({show: false, val: date ? date : filterDate.val});
  setParams({...params,LoadingArrivalDate:DMY_FORMAT(date)});
    // loadData();
  }
const handleNavigate = (truck)=>{
  navigation.navigate('TruckDetail', {truck: truck});
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
        title="Truck Unloading"
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
            }}
            onPress={()=>navigation.openDrawer()}
            >
              <Image source={icons.menu}
                style={{
                  width:20,
                  height:20,
                  tintColor:COLORS.white
                }}
              />
            </TouchableOpacity>
        }

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
        }}>
          <DataRenderResult
            navigation={navigation}
            params={params}
            fetchFn={getTruckFactoryPickup}
            render={truck=>(
              <TouchableOpacity
                style={{
                  paddingVertical:SIZES.radius,
                  paddingHorizontal:SIZES.base,
                  borderTopWidth:1,
                  borderColor:COLORS.secondaryALS,
                  flexDirection:'row',
                  alignItems:'center'
                }}
                onPress={()=>handleNavigate(truck)}
              >
                <View
                  style={{
                    flexDirection:'row',
                    flex:3,
                   // backgroundColor:COLORS.green,
                    alignItems:'center'
                  }}
                >
                  <Image source={icons.truck}
                  style={{
                    width:30,
                    height:30,
                    marginRight:SIZES.base,
                    tintColor:COLORS.primaryALS
                  }} />
                     <Text primaryALS>{truck.vehicRegNo}</Text>
                </View>
                <View
                  style={{
                    flexDirection:"row",
                    flex:5
                    
                  }}
                >
                <Text
                  style={{
                    flex:1
                  }}
             /*    >{utils.getTruckStatus(truck.status)?.des}</Text> */
             >{truck.status}</Text>
                <Image source={icons.right_arrow}
                  style={{
                    width:20,
                    height:20,
                    tintColor:COLORS.primaryALS
                  }}
                />
                </View>
        
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }
    return (
      <View style={styles.container}>
      {renderHeader()}
            {/* <View
              style={{
                height: Platform.OS == 'ios' ? 90 : 60,
              }}></View> */}
              <View
                style={{
                  marginTop:60,
                  justifyContent:'center',
                  alignItems:'center',
                  flexDirection:'row'
                }}
              >
              <Text h3 primaryALS>Pickup Date</Text>
              <View
                style={{
                  height:40,
                  width:100,
                  borderWidth:1,
                  borderColor:COLORS.gray,
                  marginLeft:SIZES.base,
                  justifyContent:'center',
                  alignItems:'center'
                }}
              >
                <Text>{DMY_FORMAT(filterDate.val)}</Text>
              </View>
              <TouchableOpacity
                style={{
                  marginLeft:SIZES.base
                }}
                onPress={() => setFilterDate({...filterDate, show: true})}
              >
                <Image source={icons.calendar}
                style={{
                  width:20,
                  height:20,
                  tintColor:COLORS.green
                }}
                />
              </TouchableOpacity>
              </View>
              {
          filterDate.show && (
            <DatePicker
              modal
              mode='date'
              open={filterDate.show}
              date={filterDate.val}
              onConfirm={changeFilterDate}
              onCancel={() => setFilterDate({...filterDate, show: false})}
              minimumDate={new Date(2000, 1, 1)}
              maximumDate={new Date()}
              locale={"vi"}
            />
          )
        }
            {renderContent()}
            <View
              style={{
position:'absolute',

   bottom:20,
   // left:0,
    right:20,
              }}
            >
            <IconButton
              icons={icons.plus}
              containerStyle={{
             
                width:50,
                height:50,
                borderRadius:25,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:COLORS.green
              }}
              onPress={()=>navigation.navigate('AddTruck')}
            />
            </View>
           
          </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        padding: 16,
        //marginTop: 40,
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
})

export default FactoryPickupScreen;