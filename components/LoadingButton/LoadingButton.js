import React from 'react';
import { StyleSheet,ActivityIndicator,TouchableOpacity } from 'react-native';

const  LoadingButton = ({ loading = false, children, ...props })=> {
    return (
      <TouchableOpacity style={styles.button} {...props}>
        {children}
        {loading ? <ActivityIndicator style={styles.spinner} color={styles.spinner.color || 'white'} /> : null}
      </TouchableOpacity>
    );
  }
  const styles = StyleSheet.create({
    button: { marginTop: 20, marginBottom: 30, height: 30 },
    spinner: {
      transform: [{ scale: 0.5 }],
      color: 'red',
      marginRight: 5,
    },
  });
  
export default LoadingButton

