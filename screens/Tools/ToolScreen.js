import React, {useState, useEffect} from 'react';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import dummyData from '../../constants/dummyData';
import images from '../../constants/images';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Button
} from 'react-native';
import icons from '../../constants/icons';
import Text from '../../constants/Text';
import LineDivider from '../../components/LineDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connectToRedux} from '../../utils/ReduxConnect';
import AppActions from '../../stores/actions/AppActions';
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
import {changePassword} from '../../api/IdentityAPI';
import {createCurrentUserSelector, createTenantSelector} from '../../stores/selectors/PersistentStorageSelectors';
import TextButton from '../../components/TextButton';
import CustomSwitch from '../../components/CustomSwitch';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal'
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
console.log('FocusAwareStatusBar',isFocused)
  return isFocused ? <StatusBar backgroundColor={COLORS.white} {...props} /> : null;
}

const ToolScreen = ({navigation, logoutAsync, setTenant, user,tenant}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toogleModal = () =>{
    setModalVisible(!isModalVisible)
  }
  const LogOutHandle = async () => {
    //await GoogleSignin.signOut();
    logoutAsync();
  };
  const changePasswordHandle = () => {
    navigation.navigate('AddTracking');
  };
  function renderHeader() {
    return (
      <View
        style={{
          height: 165,
          backgroundColor: COLORS.primaryALS,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.lightGray1,
          borderBottomLeftRadius: SIZES.radius,
          borderBottomRightRadius: SIZES.radius,
         // marginTop:Platform.OS==='android'?20:0
          // zIndex:2,
          //position:'relative'
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.padding,
            marginTop: SIZES.radius,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Setting')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={images.logoALS}
              resizeMode={'contain'}
              style={{
                width: 30,
                height: 30,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: SIZES.base,
              flex: 1,
            }}>
            <Text h3 white>
              {user?.name? user.name  : 'Nguyễn Văn A'}
            </Text>
            <Text body3 white>
              {tenant?.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: SIZES.padding,
            marginTop: SIZES.padding,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginLeft: 10,
              flex: 1,
            }}>
            {/* Phone */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.call}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: COLORS.white,
                  marginRight: SIZES.base,
                }}
              />
              <Text white body4>
                (+84) {user?.phoneNumber}
              </Text>
            </View>
            {/* Email */}
            {/* Phone */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.email}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: COLORS.white,
                  marginRight: SIZES.base,
                }}
              />
              <Text white body4>
              {user?.email}
              </Text>
            </View>
          </View>
          {/* Edit */}
          <TextButton
            label="Edit"
            buttonContainerStyle={{
              backgroundColor: COLORS.white,
              paddingHorizontal: SIZES.radius,
              height: 25,
              borderRadius: 5,
            }}
            labelStyle={{
              color: COLORS.primaryALS,
              fontSize: 14,
              fontFamily: 'Opensans-bold',
              //fontWeight:'bold'
            }}
          />
        </View>
        {/* Search */}
      </View>
    );
  }
  function renderNotification() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.padding,
          backgroundColor: COLORS.white,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          paddingVertical: SIZES.radius,
          marginBottom: SIZES.radius,
          shadowColor: COLORS.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 2,
          height: 110,
          marginTop: SIZES.radius,
        }}>
        <Text
          h2
          darkGray
          style={{
            fontWeight: 'bold',
          }}>
          Notification
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.padding,
          }}>
          <Image
            source={icons.bell}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primaryALS,
              marginRight: SIZES.radius,
            }}
          />
          <Text
            black
            style={{
              flex: 1,
            }}>
            Notification
          </Text>
          <CustomSwitch label={false} onChange={() => {}} />
        </View>
      </View>
    );
  }
  function renderInfomation() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.padding,
          backgroundColor: COLORS.white,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          paddingVertical: SIZES.radius,
          marginBottom: 20,
          shadowColor: COLORS.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 2,
          // height:110,
          marginTop: SIZES.radius,
        }}>
        <Text
          h2
          darkGray
          style={{
            fontWeight: 'bold',
          }}>
          Other
        </Text>
        {/* Profile Imfomation */}
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            marginBottom: -10,
            // paddingHorizontal:SIZES.padding
          }}>
           <Icon
                      name="lock"
                      size={20}
                      style={{
                        color: COLORS.primaryALS,
                      }}
                    />
          <Text
            body4
            style={{
              color: COLORS.gray,
              marginLeft: SIZES.base,
              flex: 1,
            }}>
            About ALS
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 10,
              height: 10,
              tintColor: COLORS.darkGray,
            }}
          />
        </View>
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
            height: 1,
            // marginTop:SIZES.padding
          }}
        />
        {/* Change Password */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            marginBottom: -10,
           //paddingHorizontal:SIZES.padding
          }}
          onPress={()=>{navigation.navigate('ChangePassword')}}
          >
           <Icon
                      name="lock"
                      size={20}
                      style={{
                        color: COLORS.primaryALS,
                      }}
                    />
          <Text
            body4
            style={{
              color: COLORS.gray,
              marginLeft: SIZES.base,
              flex: 1,
            }}>
            Change Password
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 10,
              height: 10,
              tintColor: COLORS.darkGray,
            }}
          />
        </TouchableOpacity>
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
            height: 1,
            // marginTop:SIZES.padding
          }}
        />
        {/* Profile Imfomation */}
        {/* Profile Imfomation */}
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            marginBottom: -10,
            // paddingHorizontal:SIZES.padding
          }}>
          <Icon
                      name="help"
                      size={20}
                      style={{
                        color: COLORS.primaryALS,
                      }}
                    />
          <Text
            body4
            style={{
              color: COLORS.gray,
              marginLeft: SIZES.base,
              flex: 1,
            }}>
            Help center
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 10,
              height: 10,
              tintColor: COLORS.darkGray,
            }}
          />
        </View>
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
            height: 1,
            // marginTop:SIZES.padding
          }}
        />
        {/* Help */}
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            marginBottom: -10,
            // paddingHorizontal:SIZES.padding
          }}>
            <Icon
                      name="settings"
                      size={20}
                      style={{
                        color: COLORS.primaryALS,
                      }}
                    />
          <Text
            body4
            style={{
              color: COLORS.gray,
              marginLeft: SIZES.base,
              flex: 1,
            }}>
            Settings
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 10,
              height: 10,
              tintColor: COLORS.darkGray,
            }}
          />
        </View>
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
            height: 1,
            // marginTop:SIZES.padding
          }}
        />
        <View
          style={{
            height: 60,
          }}>
          <View
          style={{
            height:10
          }}></View>
         
            <Text
              body4
              style={{
                color: COLORS.gray,
                marginLeft: SIZES.base,
              }}>
              Version
            </Text>
            <Text
              body4
              style={{
                color: COLORS.black,
                marginLeft: SIZES.base,
                fontWeight: 'bold',
              }}>
              0.1.3
            </Text>
            <TextButton
              label='Release Note'
              labelStyle={{
                ...FONTS.body5
              }}
              onPress={()=>{toogleModal()}}
              buttonContainerStyle={{
                position:'absolute',
                bottom:0,
                right:0,
                width:100,
                borderRadius:5
              }}
            />
        </View>
      </View>
    );
  }
  function renderLogout(){
    return(
  <TextButton
  label='Log out'
  buttonContainerStyle={{
    marginHorizontal:SIZES.padding,
    height:40,
    borderRadius:SIZES.radius
  }}
  onPress={logoutAsync}
  />
  
    )
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:COLORS.white,
      }}>
         <FocusAwareStatusBar barStyle="light-content" backgroundColor={COLORS.primaryALS} />
      {renderHeader()}
      <ScrollView
        style={{
          marginTop: SIZES.base,

          //flex: 1,
        }}>
         {renderNotification()}
        {renderInfomation()} 
        {renderLogout()}
        {/* Avatar and User */}
        {/* Logout */}
    
     
      </ScrollView>
     <View
      style={{
        height:100
      }}
     ></View>
     <Modal
        useNativeDriver={true}
        backdropOpacity={1}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        onBackButtonPress={() => {
          setModalVisible(false);
        }}
        isVisible={isModalVisible}
        backdropColor={'rgba(100,100,100,0.5)'}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
            padding: SIZES.padding,
          }}>
         <View
          style={{
            flex:1
          }}
         >
          <Text h4 gray>Release Note 0.1.3</Text>
          <Text>- Thêm chức năng tìm kiếm theo Hawb</Text>
          <Text>- Thay đổi cách hiển thị Dim của Mawb</Text>
          <Text>- Bỏ trạng thái trên trang lịch bay</Text>
          <Text>- Hiển thị Dim của từng hawb</Text>
         </View>
          <Button title="OK" onPress={toogleModal}></Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default connectToRedux({
  component: ToolScreen,
  stateProps: state => ({
    user: createCurrentUserSelector()(state) ?? 'NGUYEN VAN B',
    tenant: createTenantSelector()(state)
  }),
  dispatchProps: {
    logoutAsync: AppActions.logoutAsync,
    setTenant: PersistentStorageActions.setTenant,
  },
});
