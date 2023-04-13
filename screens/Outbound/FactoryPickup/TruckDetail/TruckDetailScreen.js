import React, {useState, useEffect,useRef} from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {
  getPoDoByVehicle,
  getSumPoDoVehicleDetail
} from '../../../../api/OutboundAPI';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';

const TruckDetailScreen = ({navigation,route,startLoading,stopLoading}) => {
    const truck = route?.params?.truck ?? {};
   //console.log('truckDetai===============',truck)
      const [truckDetail,setTruckDetail] = useState(null)
      const textInputRef = useRef();
      const [searchSelected,setSearchSelected] = useState(false);
      const [searchText,setSearchText] = useState('');
      const [check, setCheck] = useState(false);
      const [checkSearch,setCheckSearch] = useState(false)
      const params ={VehicleIsn:truck.id};
      const [listSo,setListSo] = useState([{id:0,checkSo:false,name:'Test1',quanity:2},{id:1,checkSo:false,name:'Test2',quanity:5},{id:2,checkSo:false,name:'Test3',quanity:3}])
      useEffect(()=>{
        //console.log('Truck ID',truck.id)
        getSumPoDoVehicleDetail({vehicleIsn:truck.id}).then((data)=>{
            ///console.log('data=================================',data)
            setTruckDetail(data)
        }).catch((e)=>Alert.alert(e))
      },[])
      const onChangeTextHandle = (text) =>{

      }
      const handleCheckItem = (e,item) =>{
        const newState = listSo.map(obj => {
            // 👇️ if id equals 2, update country property
            if (obj.id === item.id) {
              return {...obj, checkSo: e};
            }
            // 👇️ otherwise return the object as is
            return obj;
          });
          setListSo(newState)
          if(newState.every(item=>item.checkSo===true)) {
            setCheck(true)
           }
           if(newState.some(item=>item.checkSo===false))  {
            setCheck(false)
           }
      }
      const ToggleCheckSearch =(e) =>{
        setCheck(e)
        const newState = listSo.map(obj => {
            // 👇️ if id equals 2, update country property
            return {...obj, checkSo: e};
        
       
          });
       setListSo(newState);
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
          marginBottom: 80,

          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Add Truck"
        rightComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            onPress={()=>navigation.goBack()}
            >
                <Image source={icons.back} style={{
                    width:20,
                    height:20,
                    tintColor:COLORS.white

                }} />
            </TouchableOpacity>
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
  function renderPoDo() {
    return (
      <View
        style={{
          flex: 1,
          marginTop:30
         // backgroundColor:COLORS.green,
         // width:400
        }}>
          <DataRenderResult
            navigation={navigation}
            params={params}
            fetchFn={getPoDoByVehicle}
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
               // onPress={()=>handleNavigate(truck)}
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
                     <Text primaryALS>{truck.poNumber}</Text>
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
                >{truck.piecesLoaded}/{truck.pieces}</Text>
              
                </View>
        
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }
  function renderDetail(){
    return(
        <View
            style={{
                marginTop:40
            }}
        >
            
            <View>
                <Text>Total PODO: {truckDetail?.countPO}</Text>
                <Text>Total Pieces: {truckDetail?.countPcs}</Text>
                <Text>Total GW Loaded: {truckDetail?.countWeight}</Text>
                <Text>Serial No:: {truckDetail?.countPO}</Text>
            </View>
        </View>
    )
  }
  function renderLoad(){
    return(
        <View>
           <View
        style={{
          marginTop: SIZES.base,
          marginHorizontal: SIZES.padding,
          flexDirection:'row'
        }}
        >
              <CheckComponent
          check={check}
          size={24}
          color={COLORS.lightGray1}
          onPress={e => {
            ToggleCheckSearch(e)
          }}
        />
          <View
          style={{
            flexDirection: "row",
            height: 40,
            flex:1,
            borderRadius: SIZES.radius,
            backgroundColor:COLORS.lightGray2,
            alignItems:'center',
            paddingHorizontal:SIZES.radius,
            borderWidth:1,
            borderColor:COLORS.black
          }}
        >
           <Image source={icons.search} style={{
            width:23,
            height:23
           }} />
          <TextInput
            style={{
              flex: 1,
            }}
            ref={textInputRef}
            value={searchText}
            placeholder={'Search'}
            placeholderTextColor={COLORS.primaryALS}
            onChangeText={(text) => {
              onChangeTextHandle(text);
            }}
          />
             {/*  {appendComponent} */}
           
        </View>
      
           </View>
           <ScrollView>
                {listSo.map((item,id)=>(
                    <TouchableOpacity
                        key={id.toString()}
                        style={{
                            flexDirection:'row',
                            marginTop:SIZES.base,
                            justifyContent:'space-between'
                        }}
                    >
                     <CheckComponent
          check={item.checkSo}
          size={24}
          color={COLORS.lightGray1}
          onPress={e => {
            handleCheckItem(e,item)
            //handleSeachByHawb(e)
          }}
        />
                    <Text>{item.name}</Text>
                    <Text>{item.quanity}</Text>
                    </TouchableOpacity>
                ))}
           </ScrollView>
        </View>
    )
  }
    return (
<View style={styles.container}>

{renderHeader()}
<View
    style={{
        marginTop:80,
        backgroundColor:COLORS.green
    }}
>
<View
                style={{
                    flexDirection:'row',
                }}
            >
                <Image source={icons.truck}
                    style={{
                        width:20,
                        height:20,
                        tintColor:COLORS.primaryALS
                    }}
                />
                <Text>{truck?.vehicRegNo}</Text>
                <Text>{truck?.status}</Text>
            </View>
</View>

 {truck?.status ==='Completed' && renderDetail()}
 {truck?.status ==='Completed' && renderPoDo()}
 {(truck?.status === 'Loading' || truck?.status ==='Ready to load') && renderLoad()}

    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
export default connectToRedux({
    component: TruckDetailScreen,
    stateProps: state => ({loading: createLoadingSelector()(state)}),
    dispatchProps: {
      startLoading: LoadingActions.start,
      stopLoading: LoadingActions.stop,
    },
  });
  