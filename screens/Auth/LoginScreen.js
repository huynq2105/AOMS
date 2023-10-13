import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  ImageBackground,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  StatusBar,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../constants/images';
import {SIZES, COLORS, FONTS} from '../../constants/theme';
import {getTenant, getTenantByApi} from '../../api/loginApi';
import AuthLayout from './AuthLayout';
import icons from '../../constants/icons';
import Text from '../../constants/Text';
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
import {connectToRedux} from '../../utils/ReduxConnect';
import TextButton from '../../components/TextButton';
import {login} from '../../api/loginApi';
import FormInput from '../../components/FormInput';
import {useToast} from 'react-native-toast-notifications';
import AppActions from '../../stores/actions/AppActions';
import TenantBox from '../../components/TenantBox/TenantBox';
import LoadingActions from '../../stores/actions/LoadingActions';
import utils from '../../utils/Utils';
import moment from 'moment';
import { getEnvConst } from '../../Environment';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {createAppConfigSelector} from '../../stores/selectors/AppSelectors';
import {createVerifyTokenSelector} from '../../stores/selectors/PersistentStorageSelectors';
const {version} = getEnvConst();
const LoginScreen = ({
  setToken,
  setTenant,
  navigation,
  setAccount,
  fetchAppConfig,
  verifyToken,
  startLoading,
  stopLoading,
}) => {
  const [email, setEmail] = useState('');
  const [emaiError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveMe, setSaveMe] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showTenantSelection, setShowTenantSelection] = useState(false);
  const toggleTenantSelection = () => {
    setShowTenantSelection(!showTenantSelection);
  };

  function isEnableSignIn() {
    return email != '' && password != '' && emaiError == '';
  }
  const getData = useCallback(async () => {
    //const saveMeStore = await AsyncStorage.getItem('saveMe');
    const userLogin = await AsyncStorage.getItem('userLogin');
    if (userLogin) {
      setEmail(userLogin);
    }
    const passwordLogin = await AsyncStorage.getItem('passwordLogin');
    if (passwordLogin) {
      setPassword(passwordLogin);
    }
    /* if (saveMeStore === 'true') {
      setSaveMe(true);
    } */
  }, []);
  useEffect(() => {
    getData();
  }, []);
  const handleLogin = async () => {
    let action;
    await AsyncStorage.setItem('userLogin', email);
    await AsyncStorage.setItem('passwordLogin', password);
    startLoading({key: 'login'});
    setError(null);
    setAccount({userName: email, password});
    login({userName: email, password: password})
      .then(data => {
        if (data.result !== 1) {
          Alert.alert('Login Fail', data.description);
          return;
        }
        setIsLoading(false);
        setToken({
          access_token: '',
          expires_in: 1800000,
          token_type: 'Bearer',
          refresh_token: '',
          expire_time: new Date().valueOf() + 1800000,
          scope: undefined,
        });
      })
      .catch(e => fetchAppConfig())
      .finally(() => {
        stopLoading({key: 'login'});
        new Promise(resolve =>
          fetchAppConfig({showLoading: false, callback: () => resolve(true)}),
        );
      });
    //action = authActions.login(email, password);
  };
  const setSaveMeHandler = async value => {
    if (value) {
      await AsyncStorage.setItem('saveMe', 'true');
    } else {
      await AsyncStorage.setItem('saveMe', 'false');
    }
    setSaveMe(value);
  };
  return (
    <AuthLayout /* title="AOMS" subTitle="ALS Off-airport Management System" */>
      <TenantBox
        showTenantSelection={showTenantSelection}
        toggleTenantSelection={toggleTenantSelection}
      />
      {!showTenantSelection ? (
        <View
          style={{
            flex: 3,
            marginHorizontal: SIZES.padding,
           // backgroundColor:COLORS.red
            //marginVertical: SIZES.base
          }}>
          {/* Email */}
          <FormInput
            //label="User"
            keyboardType="email-address"
            autoCompleteType="email"
            placeHolder='User Name'
            inputValue={email}
            inputStyle={{
              color: COLORS.blue,
            }}
            onChange={text => {
              //  utils.validateEmail(text, setEmailError);
              setEmail(text);
            }}
            //  errMsg={emaiError}
            appendComponent={
              <View
                style={{
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.correct}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor:
                      email == ''
                        ? COLORS.gray
                        : email != '' && emaiError == ''
                        ? COLORS.primaryALS
                        : COLORS.red,
                  }}
                />
              </View>
            }
          />
          <FormInput
            //label="Password"
            autoCompleteType="password"
            inputValue={password}
            placeHolder='Password'
            inputStyle={{
              color: COLORS.primaryALS,
            }}
            containerStyle={{
              //marginTop: SIZES.radius,
            }}
            secureTextEntry={!showPassword}
            errMsg={passwordError}
            onChange={text => {
              utils.validatePassword(text, setPasswordError);
              setPassword(text);
            }}
            appendComponent={
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                }}
                onPress={() => setShowPassword(prev => !prev)}>
                <Image
                  source={showPassword ? icons.eye_close : icons.eye}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            }
          />
          {/* Save Me & Fogot Password */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.radius,
              justifyContent: 'space-between',
            }}>
            {/*   <CustomSwitch
            value={saveMe}
            onChange={value => {
              setSaveMeHandler(value);
            }}
          /> */}
            {/*   <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text body4 gray>
              Forgot Password?
            </Text>
          </TouchableOpacity> */}
          </View>
          {/* Sign In & Sign up */}
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primaryALS} />
          ) : (
            <TextButton
              label="Sign In"
              disabled={!isEnableSignIn()}
              buttonContainerStyle={{
                marginTop: SIZES.radius,
                paddingVertical: SIZES.radius,
                borderRadius: SIZES.radius,
                backgroundColor: isEnableSignIn()
                  ? COLORS.primaryALS
                  : COLORS.transparentprimaryALS,
              }}
              onPress={handleLogin}
            />
          )}
        </View>
      ) : null}
      <View
        style={{
          flex:5
        }}
      ></View>
       <View
        style={{
          flex:1,
          //backgroundColor:COLORS.gray,
          alignItems:'center',
          justifyContent:'flex-end'
        }}
      >
        <Text body3 primaryALS>Powered by ALS {version}</Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'red',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    //backgroundColor: '#000000c0',
  },
});

export default connectToRedux({
  component: LoginScreen,
  stateProps: state => ({
    verifyToken: createVerifyTokenSelector()(state),
  }),
  dispatchProps: {
    setToken: PersistentStorageActions.setToken,
    setTenant: PersistentStorageActions.setTenant,
    setAccount: PersistentStorageActions.setCurrentUser,
    fetchAppConfig: AppActions.fetchAppConfigAsync,
    startLoading: LoadingActions.start,
    stopLoading: LoadingActions.stop,
    //setTokenExpired:PersistentStorageActions.setTokenExpired
  },
});
