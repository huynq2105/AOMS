import { useFocusEffect } from "@react-navigation/native";
import React, { forwardRef, useCallback, useEffect, useState, } from 'react';
import { RefreshControl, StyleSheet, View,FlatList,Button,Text,TouchableOpacity,TextInput } from 'react-native';
import { debounce } from "../../utils/Debounce";
import { connectToRedux } from "../../utils/ReduxConnect";
import {createTokenSelector} from '../../stores/selectors/PersistentStorageSelectors'
import { SIZES,COLORS,FONTS } from "../../constants/theme";
import icons from "../../constants/icons";
import images from "../../constants/images";
import Icon from 'react-native-vector-icons/MaterialIcons';
function DataList({
    style,
    navigation,
    fetchFn,
    render,
    maxResultCount = 15,
    token,
    debounceTime = 350,
    ...props
  }) {
    const [records, setRecords] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [skipCount, setSkipCount] = useState(0);
    const [filter, setFilter] = useState('');
    const fetch = (skip = 0, isRefreshingActive = true) => {
      if (isRefreshingActive) setLoading(true);
      return fetchFn({ filter, maxResultCount, skipCount: skip })
        .then(({ items, totalCount: total }) => {
         
          setTotalCount(total);
          setRecords(skip ? [...records, ...items] : items);
          setSkipCount(skip);
        })
        .finally(() => {
          if (isRefreshingActive) setLoading(false);
        });
    };
    const fetchPartial = () => {
      setButtonLoading(true);
      fetch(skipCount + maxResultCount, false).finally(() => setButtonLoading(false));
    };
  
    useFocusEffect(
      useCallback(() => {
        setSkipCount(0);
        fetch(0, false);
      }, []),
    );
    useEffect(() => {
      function searchFetch() {
        setSearchLoading(true);
    
        return fetch(0, false).finally(() => setTimeout(() => setSearchLoading(false), 150));
      }
      debounce(searchFetch, debounceTime)();
    }, [filter]);
  function renderSearch(){
    return(
      function renderSearch() {
        return (
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: SIZES.padding,
              marginTop: SIZES.padding,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 45,
                flex: 1,
                //   marginTop:SIZES.padding,
                marginBottom: SIZES.base,
                paddingHorizontal: SIZES.base,
                borderRadius: SIZES,
                backgroundColor: COLORS.lightGray2,
                // paddingTop:5
                //justifyContent:'center'
              }}>
              <Image
                source={icons.search}
                style={{height: 20, width: 20, tintColor: COLORS.black}}
              />
              <View
                style={{
                  alignItems: 'center',
                  //  backgroundColor:COLORS.yellow,
                  marginBottom: -5,
                }}>
                <TextInput
                returnKeyType="done"
                  // onEndEditing={onSearchHandler}
                  ref={textInputRef}
                  style={{
                    flex: 1,
                    // backgroundColor:COLORS.white,
                    ...FONTS.body3,
                  }}
                  placeholder=""
                  value={filter}
                  onChangeText={text => setFilter(text)}
                />
              </View>
            </View>
            {/* render Date Filter */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: SIZES.base,
                marginBottom: 10,
                // backgroundColor:COLORS.red
              }}>
              <Calendar
                isVisible={isVisibleCalendar}
                isActiveIcon={isActiveCalendar}
                onToggleCalendar={onToggleCalendar}
                onSelectedDate={onChangeCalendar}
                initialDate={dateForFiltering}
              />
            </View>
          </View>
        );
      }
    )
  }
    return (
      <>
        {renderSearch()}
        <View style={{
          flex:1
        }}>
          {/* search Input */}
        
          <FlatList
            showsVerticalScrollIndicator
            scrollEnabled
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} />}
            data={records}
            renderItem={({item,index})=>(
              <View style={{ justifyContent: 'center', alignItems: 'center',backgroundColor:'white',flex:1 }}>
              <Text>{item.email}</Text>
             <TouchableOpacity onPress={fetchPartial}>
               <Text>Load More</Text>
             </TouchableOpacity>
            </View>
            )}
          />
        </View>
      </>
    );
  }
  
  export default connectToRedux({
    component: DataList,
    stateProps: state => ({
      token: createTokenSelector()(state),
    }),
  }); 