import React from 'react';
import { TouchableOpacity,Image } from 'react-native';
import icons from '../../constants/icons';
import PropTypes from 'prop-types';
function MenuIcon({ onPress, iconName = 'bars' }) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Image source={icons.menu} 
            style={{
                width:20,
                height:20
            }}
        />
      </TouchableOpacity>
    );
  }
  
  MenuIcon.propTypes = {
    onPress: PropTypes.func.isRequired,
    iconName: PropTypes.string,
  };
  
  export default MenuIcon;
  