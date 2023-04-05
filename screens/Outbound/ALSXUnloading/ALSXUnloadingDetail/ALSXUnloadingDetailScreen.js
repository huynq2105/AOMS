import React, {useState, useEffect, useRef, useCallback} from 'react';
import {withDelay, withTiming, useSharedValue} from 'react-native-reanimated';
import moment from 'moment';
import {
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { getPoDoByVihicle } from '../../../../api/OutboundAPI';
import Header from '../../../../components/Header';
import {COLORS, SIZES} from '../../../../constants/theme';
import {startOfDay} from '../../../../utils/DateHelpers';
import icons from '../../../../constants/icons';
import Text from '../../../../constants/Text'
import LineDivider from '../../../../components/LineDivider';
import FilterModalDateTime from '../../../../components/FilterModalDateTime';
import { dateWithSec } from '../../../../utils/DateHelpers';
import {connectToRedux} from '../../../../utils/ReduxConnect';
import {createLoadingSelector} from '../../../../stores/selectors/LoadingSelectors';
import LoadingAction from '../../../../stores/actions/LoadingActions'
import TextButton from '../../../../components/TextButton';
import DatePicker from '../../../../components/DatePicker/DatePicker';
import DataList from '../../../../components/DataList/DataList';
import DataRenderResult from '../../../../components/DataRenderResult/DataRenderResult';

const ALSXUnloadingDetailScreen = ({navigation,route}) => {
    const {id,vehicRegNo,status} = route.params
    const params ={VehicleIsn:id};
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
      function renderTruckDetail(){
        return(
            <View
                style={{
                    marginVertical:SIZES.radius,
                    marginHorizontal:SIZES.padding,
                    flexDirection:'row'
                }}
            >
                <Image source={icons.truck}
                    style={{
                        width:20,
                        height:20,
                        tintColor:COLORS.primaryALS
                    }}
                />
                <Text primaryALS h3
                    style={{
                        flex:1,
                        marginLeft:SIZES.radius
                    }}
                >{vehicRegNo}</Text>
                     <Text secondaryALS h3
                    style={{
                    
                       
                    }}
                >{status}</Text>
            </View>
        )
      }
      function renderPoDo(){
        return(
            <View
            style={{
              flex: 1,
            }}>
              <DataRenderResult
                navigation={navigation}
                params={params}
                fetchFn={getPoDoByVihicle}
                render={item=>(
                  <View
                    style={{
                      paddingVertical:SIZES.radius,
                      paddingHorizontal:SIZES.base,
                      borderTopWidth:1,
                      borderColor:COLORS.secondaryALS,
                     // flexDirection:'row'
                    }}
                    //onPress={()=>handleNavigate(truck)}
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
                        marginRight:SIZES.base,
                        tintColor:COLORS.primaryALS
                      }} />
                         <Text primaryALS>{item.mawb}/{item.poNumber}</Text>
                    </View>
                   <View>
                    <Text>{item.pieces}/{item.piecesLoaded}</Text>
                    </View>
            
                  </View>
                )}
              />
          </View>
        )
      }
    return (
<View style={styles.container}>
{renderHeader()}
      <View
        style={{
          height: Platform.OS == 'ios' ? 90 : 60,
        }}></View>
         {renderTruckDetail()}
         {renderPoDo()}
    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ALSXUnloadingDetailScreen;