import React, { useEffect,useState,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet,TouchableOpacity,Image, Alert } from 'react-native';
import { getAwbInfo,getDeliveries,updateDelivery } from '../../../api/InboundAPI';
import Header from '../../../components/Header';
import Text from '../../../constants/Text';
import {SIZES, COLORS, FONTS} from '../../../constants/theme';
import DatePicker from 'react-native-date-picker';
import icons from '../../../constants/icons';
import { dateWithTime,dateFormat } from '../../../utils/DateHelpers';
import moment from 'moment';
import TextButton from '../../../components/TextButton';
import LineDivider from '../../../components/LineDivider';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {useToast} from 'react-native-toast-notifications';
const AwbDetailInboundScreen = ({navigation,route}) => {  
    const lagiId = route?.params?.lagiId ?? 0;
    const [bills,setBills] = useState();
    const [billSelected,setBillSelected] = useState('');
    const [delivers,setDelivers] = useState([])
    const [filterDeliver,setFilterDeliver] = useState({})
    const [awb, setAwb] = useState({});
    const [modalVisible,setModalVisible] = useState(false);
    const toast = useToast();
    /* useFocusEffect(
        useCallback(() => {
          getAwbInfo(lagiId)
          .then(data => {
            setAwb(data);
          })
          .catch(e => {
            console.log('DLV73', e);
          });
        }, []),
      ); */
      //console.log('awb=========================',awb)
      useEffect(()=>{
        getAwbInfo(lagiId)
        .then(data => {
          setAwb(data);
        })
        .catch(e => {
          console.log('DLV73', e);
        });
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
      function renderGenaralImfomation() {
        return (
          <View
            style={{
             // height: 280,
              backgroundColor: COLORS.green,
              //marginHorizontal: SIZES.padding,
              flex:1
            //  marginTop: SIZES.padding,
             // borderRadius: SIZES.base,
              //padding: SIZES.padding,
             // marginBottom: 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  //padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.awb}
                  style={{
                    width: 60,
                    height: 60,
                    //tintColor:COLORS.lightGray1
                  }}
                />
              </View>
    
              <View
                style={{
                  marginLeft: SIZES.padding,
                  flex: 1,
                  backgroundColor: COLORS.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text h3 primaryALS>
                 { awb?.lagiHawb}
                  </Text>
                </View>
    
                <Text body5>
                  Loại hàng:
                  {awb.lagiGoodsContent}
                </Text>
                {/* Can kien */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: 200,
                    //backgroundColor:COLORS.green
                  }}>
                  <View
                    style={{
                      flex: 1,
                      //backgroundColor:COLORS.green
                    }}>
                    <Text>Pieces</Text>
                    <Text h4 black>
                      {awb.lagiQuantityReceived}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      //backgroundColor:COLORS.yellow
                    }}>
                    <Text>Weight</Text>
                    <Text h4 black>
                      {awb.lagiWeightReceived}{' '}
                      kg
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: COLORS.lightGray1,
                marginTop: SIZES.radius,
              }}></View>
     
              <View
                style={{
                  marginTop: SIZES.base,
                }}>
                {/* AWB */}
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text>AWB Number</Text>
                  <View
                    style={{
                      flex: 1,
                    }}></View>
                  <Text secondaryALS></Text>
                </View>
                {/* Shipment Date */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: SIZES.base,
                  }}>
                  <Text>Shipment Date</Text>
                  <View
                    style={{
                      flex: 1,
                    }}></View>
                  <Text secondaryALS>{awb.status5Datetime}</Text>
                </View>
              </View>
     
          </View>
        );
      }
      function renderContent(){
        return(
            <View
                style={{
                   // marginTop:SIZES.base,
                    //marginHorizontal:SIZES.padding
                }}
            >
              <View
                style={{
                  backgroundColor:COLORS.lightGray1,
                  paddingHorizontal:SIZES.padding,
                  paddingVertical:SIZES.base
                }}
              >
                <Text h3>{awb?.lagiMawbPrefix}-{awb?.lagiMawbNo} / {awb?.lagiHawb}</Text>
                <Text body3>{awb?.lagiNotifyName}</Text>
              </View>
                {/* Genaral */}
                <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                <Text body3>Cargo Terminal</Text>
                <Text h3>{awb?.lagiShedName}</Text>
                <Text body3>Off-Airport Cargo Terminal</Text>
                <Text h3>{awb?.lagiTsoName}</Text>
                </View>
               
                <LineDivider lineStyle={{
                  backgroundColor:COLORS.gray,
                  marginTop: SIZES.radius,
                  height:1
                }}/>
                <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text body3>Origin</Text>
                        <Text body3>Des</Text>
                    </View>
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text h3>{awb.lagiAwbOrigin}</Text>
                        <Text h3>{awb.lagiAwbDest}</Text>
                    </View>
                </View>
                <LineDivider lineStyle={{
                  backgroundColor:COLORS.gray,
                  marginTop: SIZES.radius,
                  height:1
                }}/>
                  {/* P-W */}
                  <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text body3>Pieces (NPX/NPR)</Text>
                        <Text body3>Weight (GWX/GWR)</Text>
                    </View>
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text h3>{awb.lagiQuantityReceived}/{awb.lagiQuantityExpected}</Text>
                        <Text h3>{awb.lagiWeightReceived}/{awb.lagiWeightExpected}</Text>
                    </View>
                </View>
                <LineDivider lineStyle={{
                  backgroundColor:COLORS.gray,
                  marginTop: SIZES.radius,
                  height:1
                }}/>
              <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text body3>Delivered</Text>
                        <Text body3>Chargeable Weight</Text>
                    </View>
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}
                    >
                        <Text h3>{awb.lagiQuantityDelivered}</Text>
                        <Text h3>{awb.lagiWeightReceived}/{awb.lagiWeightExpected}</Text>
                    </View>
                </View>
                
                {/* Genaral */}
                <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                <Text body3>Commodity</Text>
                <Text h3>{awb?.lagiGoodsContent}</Text>
                </View>
                <LineDivider lineStyle={{
                  backgroundColor:COLORS.gray,
                  marginTop: SIZES.radius,
                  height:1
                }}/>
                 <View
                  style={{
                    marginTop:SIZES.radius,
                    paddingHorizontal:SIZES.padding
                  }}
                >
                <Text body3>Agent</Text>
                <Text h3>{awb?.lagiNotifyName}</Text>
                </View>
               
               
            </View>
        )
      }
      const handleDelivery = () =>{
        setModalVisible(true)
         getDeliveries({hawbId:lagiId}).then((data)=>{
          console.log('data=====================',data)
          setDelivers(data)
          const resultBill = []
          data.forEach((item, index) => {
            resultBill.push(item.numberOfDeliverySlips);
          });
          setBills(resultBill);
          setBillSelected(resultBill[0])
          setFilterDeliver(data[0])
          //setModalVisible(true)
         })
      }
      console.log('billllllllllllllllllllllllll',billSelected)
      const handleChangeDropDown = (value) =>{
        setBillSelected(value)
         filterDeliver.forEach((item,index)=>{
          if(item.numberOfDeliverySlips === value){
            setFilterDeliver(item)
          }
         })
      }
      const checkConfirmDelivery = () =>{
        //setModalVisible(true)
        console.log('awb?.lagiStatus2===========================',awb?.lagiStatus2)
        if(awb?.lagiStatus2.length < 5){
            Alert.alert('Lô hàng chưa thể trả do chưa check out và thanh toán')
        }else{
            Alert.alert('Delivery AWB', 'Bạn có chắc chắn? ', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => handleDelivery()},
              ]);
        }
      }
      const handleConfirmDlv = ()=>{
        const data = {
          receivedDate: filterDeliver?.createdDateAsString,
          deliveryDate: dateFormat(new Date())
        }
        const id = filterDeliver?.id
        updateDelivery(data,id).then(()=>{
          toast.show('Update status thành công! ', {
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
          
        }).catch((e=>{
          toast.show('có lỗi! '+ e, {
            type: 'error',
            placement: 'top',
            swipeEnabled: true,
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.red,
            },
            duration: 2000,
            animationType: 'slide-in',
          });
        })).finally(()=>setModalVisible(false))
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
          <View
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextButton
            label="Delivery"
            buttonContainerStyle={{
               flex:1,
               width: 100,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={() => checkConfirmDelivery()}
          />

         {/*  <TextButton
            label="Remove"
            buttonContainerStyle={{
              // flex:1,
              //   width: 120,
              width: 100,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: disableButtonRemove
                ? COLORS.lightGray1
                : COLORS.gray,
              paddingHorizontal: SIZES.radius,
            }}
            disabled={disableButtonRemove}
            onPress={removeAwbFromTruck}
          /> */}
          {/* <TextButton
            label="Irregularity"
            buttonContainerStyle={{
              // flex:1,
              //  width: 120,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.primaryALS,
              paddingHorizontal: SIZES.radius,
            }}
            disabled={true}
            onPress={() => navigation.navigate('Irregularity', {})}
          /> */}
          {/* <TextButton
            label="Close"
            buttonContainerStyle={{
              backgroundColor: COLORS.red,
              width: 100,
              //    width: 120,
              height: 40,
              borderRadius: SIZES.base,
              paddingHorizontal: SIZES.radius,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          /> */}
        </View>
        <Modal
     // backdropColor="rgba(0,0,0,0.5)"
      backdropOpacity={0.5}
      backdropTransitionInTiming={0.3}
      onBackdropPress={() => {
        setModalVisible(false);
      }}
      onBackButtonPress={() => {
        setModalVisible(false);
      }}
      animationType="slide"
      transparent={true}
      isVisible={modalVisible}
     // visible={modalVisible}
      onRequestClose={() => {
       setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <View
              style={{
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              <Text h3 primaryALS style={{
                fontSize:18
              }}>Delivery Confirm</Text>
            </View>
            <View
              style={{
                marginTop:SIZES.radius,
                borderBottomColor:COLORS.darkGray2,
                borderBottomWidth:1
              }}
            >
              <Text body3 black>Select DLV Bill No</Text>
              <Picker
                  mode="dropdown"
                  style={{
                    lineHeight:1,
                   
                  }}
                  selectedValue={billSelected}
                  onValueChange={(itemValue, itemIndex) =>
                    handleChangeDropDown(itemValue)
                  }>
                  {bills.map(it => (
                    <Picker.Item
                      key={it.toString()}
                      label={it}
                      value={it}
                    />
                  ))}
                </Picker>
            </View>
            <View
              style={{
                flexDirection:'row',
                justifyContent:'space-between'
              }}
            >
              <Text body3>Pieces</Text>
              <Text body3>Weight</Text>
            </View>
            <View
              style={{
                flexDirection:'row',
                justifyContent:'space-between'
              }}
            >
              <Text h3>{filterDeliver?.pieces}</Text>
              <Text h3>{filterDeliver?.weight}</Text>
            </View>
            <Text body3 style={{
              marginTop:SIZES.radius
            }}>Thời gian nhận phiếu</Text>
            <View
              style={{
                flexDirection:'row',
                justifyContent:'space-between'
              }}
            >
              <Text h3>{filterDeliver?.createdDateAsString}</Text>
              {/* <Text h3>{filterDeliver?.weight}</Text> */}
            </View>
            <Text body3 style={{
              marginTop:SIZES.radius
            }}>Thời gian trả kiện đầu tiên</Text>
            <View
              style={{
                flexDirection:'row',
                justifyContent:'space-between'
              }}
            >
               <Text h3>{dateFormat(new Date())}</Text>
              {/* <Text h3>hh:mm</Text> */}
            </View>
            <View
              style={{
                marginTop:SIZES.padding,
                justifyContent:'center',
                alignItems:'center'
              }}
            >
            <TextButton
            label="Confirm"
            buttonContainerStyle={{
              // flex:1,
              //   width: 120,
              width: 100,
              height: 40,
              borderRadius: SIZES.base,
              backgroundColor: COLORS.red,
              paddingHorizontal: SIZES.radius,
              
            }}
           
            onPress={()=>{handleConfirmDlv()}}
          /> 
            </View>
        </View>
      </View>
    </Modal>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredView: {
      flex: 1,
     /*  justifyContent: 'center',
      alignItems: 'center', */
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
     // alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
})

export default AwbDetailInboundScreen;