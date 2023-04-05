import React from 'react';
import {View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as dimensions from '../constants/dimensions';

const NavIcon = ({tintColor, ...props}) => (
  <FontAwesome
    size={dimensions.iconSize}
    style={{color: tintColor}}
    {...props}
  />
);

export default NavIcon;
