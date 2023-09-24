import {useFocusEffect} from '@react-navigation/native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import i18n from 'i18n-js';
import {SIZES, COLORS, FONTS} from '../../constants/theme';
//import { connectStyle, Icon, Input, InputGroup, Item, List, Spinner, Text } from 'native-base';
import PropTypes from 'prop-types';
import {
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {activeTheme} from '../../theme/variables';
import {debounce} from '../../utils/Debounce';
import {connectToRedux} from '../../utils/ReduxConnect';
import LoadingButton from '../LoadingButton/LoadingButton';

function DataRenderResultWithSearch({
  style,
  navigation,
  fetchFn,
  render,
  params,
  searchText,
  renderFooter,
  renderHeader,
  applyFunc = ()=>{},
  renderSeparator,
  maxResultCount = 50,
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
  const [isLoading, setIsLoading] = useState(false);
  const fetch = (skip = 0, isRefreshingActive = true) => {
    if (isRefreshingActive) setLoading(true);
    return fetchFn({...params, maxResultCount, skipCount: skip})
      .then(({items, totalCount: total}) => {
        if (!Array.isArray(items)) {
          Alert.alert('Lỗi', 'Không thể lấy dữ liệu!');
          return;
        }
        setTotalCount(total);
        applyFunc(items,total)
        setRecords(skip ? [...records, ...items] : items);
        setSkipCount(skip);
      })
      .catch(e => {
        console.log('DLV73=========', e);
      })
      .finally(() => {
        if (isRefreshingActive) setLoading(false);
      });
  };

  const fetchPartial = () => {
    if (loading || records.length === totalCount) return;

    setButtonLoading(true);
    fetch(skipCount + maxResultCount, false).finally(() =>
      setButtonLoading(false),
    );
  };
  useEffect(() => {
    if(searchText !==''){
    function searchFetch() {
      console.log('searchText Change!')
      setSearchLoading(true);
      setIsLoading(true);
      return fetch(0, false).finally(() =>
        setTimeout(() => {
          setSearchLoading(false)}, 150),
      );
    }
    debounceAdv(searchFetch, debounceTime)();
  }
  }, [searchText,type,filterByHawb]);
  useFocusEffect(
    useCallback(() => {
      setSkipCount(0);
      fetch(0, false);
    }, [params]),
  );
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
            paddingHorizontal: SIZES.radius,
            borderRadius: SIZES.radius,
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
              //ref={textInputRef}
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
      </View>
    );
  }
console.log('danh sach ============',records)
  return (
    <>
      {renderSearch()}
      <View style={styles.container}>
        {/* <Text
          style={{
            marginBottom: SIZES.base,
          }}>
          Total: {totalCount}
        </Text> */}
        <FlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={renderSeparator}
          //is ={renderFooter}
          refreshing={loading}
          onRefresh={fetch}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          keyExtractor={(item, index) => `id-${index}`}
          //refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} />}
          data={records}
          renderItem={({item, index}) => (
            <>
              {render(item, index)}
              {index + 1 === skipCount + maxResultCount &&
              totalCount > records.length ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <LoadingButton
                    loading={buttonLoading}
                    onPress={() => fetchPartial()}>
                    <Text>Load More</Text>
                  </LoadingButton>
                </View>
              ) : null}
            </>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  list: {},
  spinner: {
    transform: [{scale: 0.5}],
    position: 'absolute',
    right: 8,
    top: -40,
    color: activeTheme.brandInfo,
  },
});

//const Forwarded = forwardRef((props, ref) => <DataList {...props} forwardedRef={ref} />);

export default DataRenderResultWithSearch;
