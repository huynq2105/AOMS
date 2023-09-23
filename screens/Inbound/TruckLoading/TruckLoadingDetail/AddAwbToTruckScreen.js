import React, {useState, useEffect, useRef, useCallback} from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Text from '../../../../constants/Text';
import {SIZES, COLORS} from '../../../../constants/theme';
import icons from '../../../../constants/icons';
import Header from '../../../../components/Header';
import CheckComponent from '../../../../components/Checkbox';
import {getAwbList} from '../../../../api/InboundAPI';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import {FlatList} from 'react-native-gesture-handler';
import StepperInput from '../../../../components/StepperInput';
import LineDevider from '../../../../components/LineDivider';
import {AddAwbToTruck} from '../../../../api/InboundAPI'
const AddAwbToTruckScreen = ({
  navigation,
  startLoading,
  stopLoading,
  route,
}) => {
  const truck = route?.params?.truck ?? {};
  const [awbs, setawbs] = useState([]);
  const [filterAwbs,setFilterAwbs] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const textInputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);

  function updateQuantityHandler(newQuantity, id) {
    console.log('da chay vao updateQuantityHandler======',newQuantity,id)
    const newMycartList = awbs.map(cl =>
      cl.id === id ? {...cl, piecesToLoaded: newQuantity} : cl,
    );
    setawbs(newMycartList);
    setFilterAwbs(newMycartList)
  }
  const loadAwb = useCallback(() => {
    getAwbList({Awb: searchText})
      .then(({items, totalCount: total}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
        items.forEach((item, index) => {
          const awb = {
            id: item.lagiId,
            checkAwb: false,
            flight: item.flight,
            flightDate: item.flightDate,
            mawb: item.mawbPrefix + item.mawbSerial,
            hawb: item.hawb,
            pieces: item.pieces,
            piecesLoaded: item.piecesLoaded,
            piecesUnloaded: item.piecesUnloaded,
            piecesRemain: item.pieces - item.piecesLoaded,
            piecesToLoaded : item.pieces - item.piecesLoaded,
          };
          result.push(awb);
        });
        setawbs(result);
        setFilterAwbs(result)
      })
      .catch(e => console.log(e));
  }, []);
  const ToggleCheckSearch = e => {
    setCheck(e);
   /*  if (e) {
      setDisablebuttonRemove(false);
    } else {
      setDisablebuttonRemove(true);
    } */
    const newState = filterAwbs.map(obj => {
      // 👇️ if id equals 2, update country property
      return {...obj, checkAwb: e};
    });
    setFilterAwbs(newState);
  };
  const handleCheckItem = (e, item) => {
    const newState = awbs.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, checkAwb: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setFilterAwbs(newState);
    //setawbs(newState);
    if (newState.every(item => item.checkAwb === true)) {
      setCheck(true);
    }
    if (newState.some(item => item.checkAwb === false)) {
      setCheck(false);
    }
  };
  const onChangeTextHandle = text => {
    setSearchText(text);
    if (text) {
      //making a case insensitive regular expression to get similar value from the film json
      const regex = new RegExp(`${text.trim()}`, 'i');
      //setting the filtered film array according the query from the input
      setFilterAwbs(awbs.filter(awb => awb.hawb.search(regex) >= 0));
    } else {
      //if the query is null then return blank
      setFilterAwbs(awbs);
    }
  };
  const handleAddAwbs = () => {
    const listAwbToAdd = [];
    filterAwbs.forEach((item, index) => {
      if (item.checkAwb === true) {
        const data = {lagiId: item.id, pieces: item.piecesToLoaded};
        listAwbToAdd.push(data);
      }
    });
    const dataToAdd = {
      vehicleIsn: truck ? truck.id : 0,
      listItem: listAwbToAdd,
    };
    console.log('Data To Add=======================',dataToAdd)
    AddAwbToTruck(dataToAdd)
      .then(data => {
        navigation.navigate('TruckLoadingDetail',{truck: {...truck,status:'Loading'}})
      })
      .catch(e => console.log(e));
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    loadAwb();
  }, []);
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
        title="Add Awb To Truck"
        // rightComponent={
        //   <TouchableOpacity
        //     style={{
        //       width: 35,
        //       height: 35,
        //       justifyContent: 'center',
        //     }}
        //     onPress={() => setModalVisible(true)}>
        //     <Image
        //       source={icons.filter}
        //       style={{
        //         width: 35,
        //         height: 35,
        //         tintColor: COLORS.white,
        //       }}
        //     />
        //   </TouchableOpacity>
        // }
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

        /*  rightComponent={<CartQuantityButton quantity={cartLagiQuantity} onPress={()=>navigation.navigate("CartLagi")} />} */
      />
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
          flex: 1,
          padding: SIZES.base,
          marginBottom: SIZES.base,
        }}>
        <View
          style={{
            marginTop: 60,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',
          }}>
          <CheckComponent
            check={check}
            size={24}
            color={COLORS.gray}
            onPress={e => {
              ToggleCheckSearch(e)
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
              borderColor: COLORS.black,
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
              placeholder={'Tim theo mawb'}
              placeholderTextColor={COLORS.primaryALS}
              onChangeText={text => {
                onChangeTextHandle(text);
              }}
            />
            {/*  {appendComponent} */}
          </View>
        </View>
        <FlatList
          data={filterAwbs}
          ItemSeparatorComponent={() => (
            <LineDevider
              lineStyle={{
                height: 1,
                marginBottom: SIZES.base,
                marginTop: SIZES.base,
                backgroundColor: COLORS.gray,
              }}
            />
          )}
          ListHeaderComponent={() => (
            <View
              style={{
                marginTop: SIZES.padding,
              }}>
              <Text body3 primaryALS>
                Danh sách Vận đơn:
              </Text>
            </View>
          )}
          keyExtractor={item => `Po-${item?.id}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: item?.checkAwb
                  ? COLORS.transparentprimaryALS
                  : null,
              }}>
              <CheckComponent
                check={item?.checkAwb}
                size={24}
                color={COLORS.gray}
                onPress={e => {
                  handleCheckItem(e, item);
                }}
              />
              <View
                style={{
                  flex:1
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: SIZES.radius,
                   // alignItems: 'center',
                    //backgroundColor: COLORS.lightGreen,
                    // flex:1
                  }}>
                  <Text
                    body3
                    style={
                      {
                        //flex:1
                      }
                    }>
                    {item?.mawb} / {item?.hawb}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                    }}></View>

                  {/*   <Text body3 style={{
                  marginRight:SIZES.padding
                  //marginLeft: SIZES.padding
                }}>{item?.pieces}</Text> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft:SIZES.radius,
                    //backgroundColor:COLORS.lightOrange
                  }}>
                  <View
                    style={{
                      flexDirection:'row',
                      alignItems:'center',
                      flex:2
                    }}
                  >
                    <Image
                      source={icons.flightLanded}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                    <Text body3 style={{
                      marginLeft:SIZES.base
                    }}>{item?.flight}</Text>
                  </View>
                  <View
                     style={{
                      flexDirection:'row',
                      alignItems:'center',
                      flex:1
                    }}
                  >
                    <Image
                      source={icons.awb_number}
                      style={{
                        width: 25,
                        height: 25,
                        tintColor:COLORS.primaryALS
                      }}
                    />
                    <Text body3 style={{
                      marginLeft:SIZES.base
                    }}>
                      {item?.piecesRemain}/{item?.pieces}
                    </Text>
                  </View>
                  <StepperInput
                    containerStyle={{
                      height: 40,
                      width: 105,
                      backgroundColor: COLORS.lightGray1,
                      borderRadius: 10,
                      marginLeft:SIZES.base,
                      flex: 2,
                    }}
                    value={item?.piecesToLoaded}
                    onAdd={() =>
                      updateQuantityHandler(item?.piecesToLoaded + 1, item.id)
                    }
                    onMinus={() => {
                      if (item?.piecesToLoaded > 1) {
                        updateQuantityHandler(item?.piecesToLoaded - 1, item.id);
                      }
                    }}
                  />
                </View>
              </View>
              <View></View>
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
            justifyContent: 'space-around',
          }}>
          <TextButton
            label="Cancel"
            buttonContainerStyle={{
              width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.gray,
            }}
            onPress={() => navigation.goBack()}
          />

          <TextButton
            label="Add"
            buttonContainerStyle={{
              backgroundColor: COLORS.green,
              width: 120,
              height: 40,
              borderRadius: SIZES.base,
            }}
            onPress={handleAddAwbs}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default connectToRedux({
  component: AddAwbToTruckScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
