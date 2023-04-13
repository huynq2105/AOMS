import React, {useEffect, useState} from 'react';
import {TouchableWithoutFeedback, View, Image} from 'react-native';
import {scale} from 'react-native-size-scaling';
import { COLORS } from '../../constants/theme';
import {styles} from './styles';

const checkbox_check = require('./icon/checkbox-check.png');
const checkbox_uncheck = require('./icon/checkbox-uncheck.png');
const radio_check = require('./icon/radio-check.png');
const radio_uncheck = require('./icon/radio-uncheck.png');
const CheckComponent = ({
    style,
    size = 25,
    type = 'checkbox',
    color,
    check = false,
    fontFamily,
    onPress,
  }) => {
    const [value, setValue] = useState(check);
    useEffect(() => {
      if (check) {
        setValue(true);
      } else {
        setValue(false);
      }
    }, [check]);
  
    const font = () => {
      if (fontFamily) {
        return {
          fontFamily: fontFamily,
        };
      } else {
        return {};
      }
    };
  
    const onClick = () => {
      setValue(!value);
      if (onPress) {
        onPress(!value);
      }
    };
    return (
      <TouchableWithoutFeedback onPress={onClick}>
        <View style={[style ? style : styles.container]}>
          <Image
            style={{
              width: scale(size),
              height: scale(size),
              tintColor: COLORS.black,
            }}
            source={
              type === 'checkbox'
                ? value
                  ? checkbox_check
                  : checkbox_uncheck
                : value
                ? radio_check
                : radio_uncheck
            }
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CheckComponent;