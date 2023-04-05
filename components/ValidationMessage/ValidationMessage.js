import React, {forwardRef} from 'react';
import {Text, StyleSheet} from 'react-native';

const ValidationMessage = ({children, ...props}) => {
  return children ? <Text style={styles.des}>{children}</Text> : null;
};
const styles = StyleSheet.create({
  des: {
    fontSize: 12,
    marginHorizontal: 10,
    marginTop: -5,
    color: '#ed2f2f',
  },
});
export default ValidationMessage;
