import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';

import Header from '../../components/Header';
import {SIZES, COLORS} from '../../constants/theme';
import dummyData from '../../constants/dummyData';
import OutboundItem from '../../components/OutboundItem';
import {checkAwbInboundExist,getTrackTraceInboundSearch} from '../../api/InboundAPI';
import icons from '../../constants/icons';
import Text from '../../constants/Text';
import {Formik} from 'formik';
import TextButton from '../../components/TextButton';
import TextRadioButton from '../../components/TextRadioButton';
const AwbSearchScreen = ({navigation}) => {
  const [type, setType] = useState(1);
  const mawbRef = React.useRef();
  const hawbRef = React.useRef();
  const onSubmit = values => {
    checkAwbInboundExist({
      MawbPrefix: values.mawb.split('-')[0],
      MawbSerial: values.mawb.split('-')[1],
      Hawb: values.hawb, 
    }).then((data) => {
        handleSearchResult(data,values)
    });
  };
  function handleGetTrackTrace(values){
    getTrackTraceInboundSearch({
        MawbPrefix: values.mawb.split('-')[0],
        MawbSerial: values.mawb.split('-')[1],
        Hawb: values.hawb, 
      }).then(({items, totalCount})=>{
            if(totalCount==1){
                navigation.navigate('AwbDetailInbound',{lagiId:items[0].id})
            }
      }).catch(e=>Alert.alert(e))
  }
  const handleSearchResult = (result,values) =>{
    console.log('result===========',result)
    if(result==0){
        console.log('Not found')
    }
    else if(result==1){
        handleGetTrackTrace(values)
    }
    else{
      navigation.navigate('AwbListInbound',{awb:values.mawb})
    }
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
        title="Awb Search"
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
  function renderSelection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.radius,
        }}>
        <TextRadioButton
          customContainerStyle={{
            flex: 1,
          }}
          iconStyle={{
            tintColor: COLORS.primaryALS,
          }}
          label="Inbound"
          labelStyle={{
            fontSize:18
          }}
          isSelected={type === 1}
          onPress={() => {
            setType(1);
          }}
        />
        <TextRadioButton
          customContainerStyle={{
            flex: 1,
          }}
          iconStyle={{
            tintColor: COLORS.primaryALS,
          }}
          label="Ountbound"
          labelStyle={{
            fontSize:18
          }}
          isSelected={type === 2}
          onPress={() => {
            setType(2);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View>
      {renderSelection()}
      <View
        style={{
          marginTop: SIZES.padding,
        }}>
        <Formik
          //validateOnMount={true}
          enableReinitialize
          // validationSchema={Yup.object().shape(validations)}
          initialValues={{
            mawb: '',
            hawb: '',
          }}
          onSubmit={values => onSubmit(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldValue,
          }) => (
            <>
              <View
                style={{
                  paddingHorizontal: SIZES.padding,
                }}>
                <View
                  style={
                    {
                      // display: 'flex',
                    }
                  }>
                  <View>
                    <Text
                      h3
                      primaryALS
                      style={
                        {
                          //marginTop: 60,
                        }
                      }>
                      Awb Number:
                    </Text>
                    <TextInput
                      style={{
                        //flex:1,
                        // borderWidth: 1,
                        height: 45,
                        marginBottom: SIZES.base,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray,
                        fontSize:18
                      }}
                      ref={mawbRef}
                      placeholder="Mawb Number"
                      value={values.mawb}
                      onChangeText={handleChange('mawb')}
                    />
                  </View>
                  <View>
                    <Text
                      h3
                      primaryALS
                      style={
                        {
                          //marginTop: 60,
                        }
                      }>
                      Hawb Number:
                    </Text>
                    <TextInput
                      style={{
                        //flex:1,
                        // borderWidth: 1,
                        height: 45,
                        marginBottom: SIZES.base,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.gray,
                        fontSize:18
                      }}
                    
                      ref={hawbRef}
                      placeholder="Hawb Number"
                      value={values.hawb}
                      onChangeText={handleChange('hawb')}
                    />
                  </View>
                </View>
                {/*    <View
                      style={{
                        height: 60,
                      }}></View> */}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingHorizontal: SIZES.padding,
                  marginTop: SIZES.radius,
                  /*      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      left: 0, */
                }}>
                <TextButton
                  label="Search"
                  buttonContainerStyle={{
                    flex: 1,
                    // width: 120,
                    height: 40,
                    // borderRadius: SIZES.base,
                    backgroundColor: isValid ? COLORS.primaryALS : COLORS.gray,
                  }}
                  disabled={!isValid}
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:COLORS.green
  },
});

export default AwbSearchScreen;
