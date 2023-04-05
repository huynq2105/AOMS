import React from "react";
import {View,StyleSheet,ActivityIndicator} from 'react-native'
import { activeTheme } from "../../theme/variables";
import { connectToRedux } from "../../utils/ReduxConnect";
import { createLoadingSelector,createOpacitySelector } from "../../stores/selectors/LoadingSelectors";

const Loading = ({loading,opacity}) =>{
    return loading ? (
        <View style={styles.container}>
          <View
            style={{
              ...styles.backdrop,
              opacity: opacity || 0.6,
            }}
          />
          <ActivityIndicator style={styles.spinner} color={styles.spinner.color} />
        </View>
      ) : null;
}

const backdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  };
const styles = StyleSheet.create({
    container: {
        ...backdropStyle,
        backgroundColor: 'transparent',
        zIndex: activeTheme.zIndex.indicator,
        alignItems: 'center',
        justifyContent: 'center',
      },
      backdrop: backdropStyle,
      spinner: {
        color: activeTheme.brandPrimary,
        fontSize: 100,
      },
})
export default connectToRedux({
    component: Loading,
    stateProps: state => ({
      loading: createLoadingSelector()(state),
      opacity: createOpacitySelector()(state),
    }),
  });