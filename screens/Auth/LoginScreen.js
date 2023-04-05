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
  StyleSheet
} from 'react-native';
import {getEnvVars} from '../../Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../constants/images';
import {SIZES, COLORS, FONTS} from '../../constants/theme';
import {getTenant,getTenantByApi} from '../../api/loginApi';
import AuthLayout from './AuthLayout';
import icons from '../../constants/icons';
import Text from '../../constants/Text';
import PersistentStorageActions from '../../stores/actions/PersistentStorageActions';
import {connectToRedux} from '../../utils/ReduxConnect';
import TextButton from '../../components/TextButton';
import {login} from '../../api/loginApi';
import FormInput from '../../components/FormInput';
import {useToast} from 'react-native-toast-notifications';
import AppActions from '../../stores/actions/AppActions'
import TenantBox from '../../components/TenantBox/TenantBox'
import utils from '../../utils/Utils';
import moment from 'moment';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import { createAppConfigSelector } from "../../stores/selectors/AppSelectors";
import { createVerifyTokenSelector } from '../../stores/selectors/PersistentStorageSelectors';
const LoginScreen = ({setToken, setTenant, navigation,setAccount,fetchAppConfig,setTokenExpired,verifyToken}) => {
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
/*   const a = '02 Apr 2023 01:44:51 GMT'
  const dt = moment(a).format('DD/MM/yyyy');
  console.log('Convert Date Time========================',dt); */
  /* const getData = useCallback(async () => {
    const saveMeStore = await AsyncStorage.getItem('saveMe');
    const userLogin = await AsyncStorage.getItem('userLogin');
    if (userLogin) {
      setEmail(userLogin);
    }
    const passwordLogin = await AsyncStorage.getItem('passwordLogin');
    if (passwordLogin) {
      setPassword(passwordLogin);
    }
    if (saveMeStore === 'true') {
      setSaveMe(true);
    }
  }, []); */
  function isEnableSignIn() {
    return email != '' && password != '' && emaiError == '';
  }
  const handleLogin = () => {
    let action;
    setIsLoading(true);
  /*   await AsyncStorage.setItem('userLogin', email);
    if (saveMe) {
      await AsyncStorage.setItem('passwordLogin', password);
    } else {
      await AsyncStorage.removeItem('passwordLogin');
    } */
    setError(null);
    setAccount({userName:email,password})
    login({userName: email, password: password})
      .then(data => {
        if (data.result !== 1) {
          Alert.alert('Login Fail',data.description);
          return;
        }
        console.log('data Login',data)
        /* setToken({
          "access_token": "",
          "expires_in": 1800000,
          "token_type": "Bearer",
          "refresh_token": "",
          "expire_time": new Date().valueOf() + 1800000,
          "scope": undefined,
        });
        setTokenExpired(new Date().valueOf() + 1800000); */
        setToken({
          "access_token": verifyToken,
          "expires_in": 1800000,
          "token_type": "Bearer",
          "refresh_token": "",
          "expire_time": new Date().valueOf() + 1800000,
          "scope": undefined,
        });
      }).then(
        () =>
          new Promise(resolve =>
            fetchAppConfig({ showLoading: false, callback: () => resolve(true) }),
          ),
      )
      .catch(e => {
        console.log('Login Error',e)
        //fetchAppConfig()
        setError(e);
        setIsLoading(false);
      }).finally(()=>{
        console.log('Login finally')
        setIsLoading(false);
        /* new Promise(resolve =>
          fetchAppConfig({showLoading: false, callback: () => resolve(true)}),
        ) */
      });
    //action = authActions.login(email, password);
  };
/*   useEffect(() => {
    getData();
  }, []); */
/*   useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]); */
  const setSaveMeHandler = async value => {
    if (value) {
      await AsyncStorage.setItem('saveMe', 'true');
    } else {
      await AsyncStorage.setItem('saveMe', 'false');
    }
    setSaveMe(value);
  };
  return (
    <AuthLayout    title="AOMS-UAT"
    subTitle="ALS Off-airport Management System">
       <TenantBox
        showTenantSelection={showTenantSelection}
        toggleTenantSelection={toggleTenantSelection}
      />
   {!showTenantSelection ? (
        <View
        style={{
          flex: 1,
          marginHorizontal: SIZES.padding,
          //marginVertical: SIZES.base
        }}>
          
        {/* Email */}
        <FormInput
          label="User"
          keyboardType="email-address"
          autoCompleteType="email"
          inputValue={email}
          inputStyle={{
            color: COLORS.white,
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
                      ? COLORS.green
                      : COLORS.red,
                }}
              />
            </View>
          }
        />
        <FormInput
          label="Password"
          autoCompleteType="password"
          inputValue={password}
          inputStyle={{
            color: COLORS.primaryALS,
          }}
          containerStyle={{
            marginTop: SIZES.radius,
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
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
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
    verifyToken: createVerifyTokenSelector()(state)
  }),
  dispatchProps: {
    setToken: PersistentStorageActions.setToken,
    setTenant: PersistentStorageActions.setTenant,
    setAccount: PersistentStorageActions.setCurrentUser,
    fetchAppConfig: AppActions.fetchAppConfigAsync,
    setTokenExpired:PersistentStorageActions.setTokenExpired
  },
});

