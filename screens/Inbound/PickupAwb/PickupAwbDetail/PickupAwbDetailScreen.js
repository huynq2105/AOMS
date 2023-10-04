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
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import moment from 'moment';
import CheckComponent from '../../../../components/Checkbox';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';
import {
  getPickupAwbDetail,
  updateStatusHawb
} from '../../../../api/InboundAPI';
import {
  DELIVER_FORMAT_TIME,
  ADD_TRUCK_FORMAT_TIME,
} from '../../../../utils/DateHelpers';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import LineDivider from '../../../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DMY_FORMAT,DMY_TIME } from '../../../../utils/DateHelpers';
import UpdateHawbStatusModal from './UpdateHawbStatusModal';

const PickupAwbDetailScreen = ({
  navigation,
  route,
  startLoading,
  stopLoading,
}) => {
const {awb,filterDateFrom,filterDateTo} = route?.params;
    const today = moment(); 
    const fligtDate = filterDateFrom + "-" + filterDateTo;
    const [listHawb,setListHawb] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [check, setCheck] = useState(false);
    const textInputRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const applyFuc = (value)=>{
        closeModal();
        let listLagisId = '';
        listHawb.forEach((item, index) => {
          if (item.checkHawb) {
            listLagisId += item.lagiId + ',';
          }
          
        });
        if(listLagisId.length > 2){
          updateStatusHawb(listLagisId.substring(0, listLagisId.length - 1),value,DMY_TIME(today)).then(()=>{
            loadHawb()
          })
        }
        
       
    }
    const closeModal = () => {
        setModalVisible(false);
      };
    const loadHawb = () => {
      startLoading('LoadHawb')
        getPickupAwbDetail({KundId: awb.kundId,FlightDate:fligtDate})
          .then(({items, totalCount}) => {
            if (!items) {
              Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
              return;
            }
            items.forEach((item, index) => {
              const result = [];
           
              items.forEach((item, index) => {
                const hawb = {
                   ...item,
                   checkHawb:false
                };
                result.push(hawb);
              });
              setListHawb(result);
            });
          })
          .catch(e => console.log(e)).finally(()=>stopLoading('LoadHawb'));
      };
      useFocusEffect(
        useCallback(() => {
          loadHawb()
        }, []),
      );
      const handleCheckItem = (e, item) => {
        const newState = listHawb.map(obj => {
          // 👇️ if id equals 2, update country property
          if (obj.lagiId === item.lagiId) {
            return {...obj, checkHawb: e};
          }
          // 👇️ otherwise return the object as is
          return obj;
        });
        setListHawb(newState);
        if (newState.every(item => item.checkHawb === true)) {
          setCheck(true);
        }
        if (newState.some(item => item.checkHawb === false)) {
          setCheck(false);
        }
      };
      const ToggleCheckSearch = e => {
        setCheck(e);
        const newState = listHawb.map(obj => {
          // 👇️ if id equals 2, update country property
          return {...obj, checkHawb: e};
        });
        setListHawb(newState);
      };
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
          justifyContent: 'center',
          //marginTop: Platform.OS == 'ios' ? 30 : 10,
        }}
        title="Pickup Awb Detail"
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
            }}></View>
        }

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
    );
  }
  function renderLoadHawb() {
    return (
      <View
        style={{
          flex: 1,
          padding: SIZES.base,
          marginBottom: SIZES.base,
          //marginVertical:SIZES.radius
        }}>
        <View
          style={{
            marginTop: SIZES.base,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',
           // backgroundColor: COLORS.red,
          }}>
          <CheckComponent
            check={check}
            size={24}
            color={COLORS.gray}
            onPress={e => {
              ToggleCheckSearch(e);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              borderWidth: 1,
              borderColor: COLORS.gray,
            }}>
            <Image
              source={icons.search}
              style={{
                width: 23,
                height: 23,
              }}
            />
            <TextInput
              style={{
                flex: 1,
              }}
              ref={textInputRef}
              value={searchText}
              placeholder={'Search'}
              placeholderTextColor={COLORS.primaryALS}
              onChangeText={text => {
                onChangeTextHandle(text);
              }}
            />
             {searchText !=='' && (<TouchableOpacity
              onPress={()=>{setSearchText('')}}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>)}
            {/*  {appendComponent} */}
          </View>
        </View>
        <FlatList
          data={listHawb}
          ListHeaderComponent={<View
            style={{
              marginTop:SIZES.padding
            }}
            ></View>}
            ItemSeparatorComponent={()=><LineDivider lineStyle={{height:1,
              backgroundColor:COLORS.gray,
              marginTop:SIZES.base,
              marginBottom:SIZES.base
            }}/>}
          keyExtractor={item => `hawb-${item?.lagiId}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                
              }}>
              <CheckComponent
                check={item?.checkHawb}
                size={24}
                color={COLORS.gray}
                onPress={e => {
                  handleCheckItem(e, item);
                  //handleSeachByHawb(e)
                }}
              />
              <View
                style={{
                
                  marginLeft:SIZES.radius,
                 // justifyContent:'center',
                  //alignItems:'center',
                  flex:1,
                  //backgroundColor:COLORS.green,
                  paddingRight:SIZES.padding
                }}
              >
                {/* Thông tin chung */}
                <View
                    style={{
                        flexDirection:"row"
                    }}
                >
                     <Text h3 primaryALS>[{item?.cargoTerminal}]</Text>
              
                <Text h3 primaryALS style={{
                    marginLeft:SIZES.base
                }}>{item?.mawb}/{item?.lagiHawb}</Text>
                </View>
               {/* Kiện cân chuyen bay */}
               <View
                    style={{
                        flexDirection:'row'
                    }}
               >
                <Text body3 gray>Pcs <Text h3 darkGray>{item?.lagiQuantityExpected}</Text>  - </Text>
                <Text body3 gray>GW <Text h3 darkGray>{item?.lagiWeightExpected}</Text>  - </Text>
                <Text body3 darkGray>{item?.flight} {item?.eta} </Text>
               </View>
               {/* Status */}
               <View>
               <Text body3 darkGray2>Status {item?.status}</Text>
               </View>
              </View>
             {/*  <TouchableOpacity
                //onPress={()=>handleEditPO(item)}
              >
                <Icon name='edit' size={24} style={{
                  color:COLORS.primaryALS
                }} />
              </TouchableOpacity> */}
            </View>
          )}
        />
        <View
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 0,
            flexDirection: 'row',
            //backgroundColor:COLORS.green,
            alignItems:'center',
            justifyContent:'center'
            //justifyContent: 'space-between',
          }}>
             <TextButton
            label="Update Status"
            buttonContainerStyle={{
              // flex:1,
             // width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal:SIZES.radius
            }}
            onPress={() => setModalVisible(true)}
          />
          
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
      }}>
      {renderHeader()}
      <View
        style={{
          marginTop: 80,
          flex:1
          //backgroundColor: COLORS.green,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.base,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Image
            source={icons.truck}
            style={{
              width: 40,
              height: 40,
              tintColor: COLORS.primaryALS,
            }}
          /> */}
          <Text h2 primaryALS style={{flex: 1, marginLeft: SIZES.base,fontSize:18}}>
            {awb?.agentName}
          </Text>
        </View>
        {renderLoadHawb()}
      </View>
      <UpdateHawbStatusModal applyFunc={applyFuc} modalVisible={modalVisible} handleOffModal={closeModal} />
    </View>
  );
};

export default connectToRedux({
  component: PickupAwbDetailScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
