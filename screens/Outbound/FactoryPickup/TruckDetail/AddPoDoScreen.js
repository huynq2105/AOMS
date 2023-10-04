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
import AddPoDoModal from './AddPoDoModal';
import {
  getListPoDo,
  AddPoDoToTruck,
  createPo,
} from '../../../../api/OutboundAPI';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import LoadingActions from '../../../../stores/actions/LoadingActions';
import TextButton from '../../../../components/TextButton';
import {FlatList} from 'react-native-gesture-handler';
import StepperInput from '../../../../components/StepperInput';
import LineDevider from '../../../../components/LineDivider'
import Icon from 'react-native-vector-icons/MaterialIcons';
const AddPoDoScreen = ({navigation, startLoading, stopLoading, route}) => {
  const truck = route?.params?.truck ?? {};
  const [poDos, setPoDos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const textInputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);
  const applyFunc = () =>{
    loadPo()
  }
  function updateQuantityHandler(newQuantity, id) {
    const newMycartList = poDos.map((cl) =>
      cl.id === id ? { ...cl, pieces: newQuantity } : cl
    );
    setPoDos(newMycartList);
  }
  const loadPo = useCallback(() => {
    getListPoDo({PONumber: searchText})
      .then(({items, totalCount: total}) => {
        if (!items) {
          Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
          return;
        }
        const result = [];
        items.forEach((item, index) => {
          const po = {
            id: item.doId,
            checkPo: false,
            labId: item.labId,
            poNumber: item.poNumber,
            pieces: item.pieces,
          };
          result.push(po);
        });
        setPoDos(result);
      })
      .catch(e => console.log(e));
  }, []);
  const handleCheckItem = (e, item) => {
    const newState = poDos.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === item.id) {
        return {...obj, checkPo: e};
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setPoDos(newState);
    if (newState.every(item => item.checkPo === true)) {
      setCheck(true);
    }
    if (newState.some(item => item.checkPo === false)) {
      setCheck(false);
    }
  };
  const handleAddPoDo = () => {
    const listPoDoToAdd = [];
    poDos.forEach((item, index) => {
      if (item.checkPo === true) {
        const data = {labId: item.labId, doId: item.id, pieces: item.pieces};
        listPoDoToAdd.push(data);
      }
    });
    const dataToAdd = {
      vehicleIsn: truck ? truck.id : 0,
      listItem: listPoDoToAdd,
    };
    AddPoDoToTruck(dataToAdd).then((data) => {
     /*  if (!data) {
        Alert.alert('Lỗi', 'Liên hệ với quản trị viên');
        return;
      } */
      navigation.goBack();
    }).catch(e =>Alert.alert('Lỗi', 'Liên hệ với quản trị viên',e));
  };
  const closeModal = () => {
    setModalVisible(false)
  };
  useEffect(() => {
    loadPo();
  }, [searchText]);
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
        title="Add PO"
        rightComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              justifyContent:'center'
            }}
            onPress={() => setModalVisible(true)}>
            <Image
              source={icons.plus}
              style={{
                width: 35,
                height: 35,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        }
        leftComponent={
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              justifyContent:'center'
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
    <SafeAreaView
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
            marginTop: SIZES.base,
            marginHorizontal: SIZES.padding,
            flexDirection: 'row',
          }}>
          <CheckComponent
            check={check}
            size={24}
            color={COLORS.lightGray1}
            onPress={e => {
              //ToggleCheckSearch(e)
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
          data={poDos}
          ItemSeparatorComponent={() => (
            <LineDevider
              lineStyle={{
                height: 2,
                marginBottom:SIZES.base,
                marginTop:SIZES.base
                //backgroundColor: COLORS.red,
              }}
            />
          )}
          ListHeaderComponent={()=>(
            <View
              style={{
                marginTop:SIZES.padding
              }}
            >
              <Text h2 primaryALS>Danh sách PO:</Text>
            </View>
          )}
          keyExtractor={item => `Po-${item?.id}`}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor:item?.checkPo ? COLORS.transparentprimaryALS: null

              }}>
              <CheckComponent
                check={item?.checkPo}
                size={24}
                color={COLORS.lightGray1}
                onPress={e => {
                  handleCheckItem(e, item);
                }}
              />
              <View
              style={{
                flexDirection:'row',
                marginLeft:SIZES.padding,
                alignItems:'center',
                flex:1
              }}
              >
                <Text h2 style={{
                  //flex:1
                }}>{item?.poNumber}</Text>
                <View
                  style={{
                    flex:1
                  }}
                ></View>
                <StepperInput
              containerStyle={{
                height: 50,
                width: 125,
                backgroundColor: COLORS.lightGray1,
                borderRadius:5
              }}
              value={item?.pieces}
              onAdd={() =>
                updateQuantityHandler(item?.pieces + 1, item.id)
              }
              onMinus={() => {
                if (item?.pieces > 1) {
                  updateQuantityHandler(item?.pieces - 1, item.id);
                }
              }}
            />
              {/*   <Text body3 style={{
                  marginRight:SIZES.padding
                  //marginLeft: SIZES.padding
                }}>{item?.pieces}</Text> */}
              </View>
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
              backgroundColor: COLORS.primaryALS,
            }}
            onPress={() => navigation.goBack()}
          />

          <TextButton
            label="Save"
            buttonContainerStyle={{
              backgroundColor: COLORS.red,
              width: 120,
              height: 40,
              borderRadius: SIZES.base,
            }}
            onPress={handleAddPoDo}
          />
        </View>
      </View>
     <AddPoDoModal modalVisible={modalVisible} applyFunc={applyFunc} handleOffModal={closeModal} />
    </SafeAreaView>
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
  component: AddPoDoScreen,
  stateProps: state => ({loading: createLoadingSelector()(state)}),
  dispatchProps: {
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
  },
});
