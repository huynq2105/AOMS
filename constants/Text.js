import * as theme from '../constants/theme';
// just copy this code from the driving repo :)
import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';

const Typography = ({
  h1,
  h2,
  h3,
  h4,
  body1,
  body2,
  body3,
  body4,
  body5,
  children,
  primary,
  secondary,
  black,
  white,
  gray,
  primaryALS,
  secondaryALS,
  darkGray,
  darkGray2,
  lightGray1,
  lightGray2,
  lightGray,
  lightGray3,
  green,
  red,
  style,
  ...props
}) => {
  const textStyles = [
    h1 && styles.h1,
    h2 && styles.h2,
    h3 && styles.h3,
    h4 && styles.h4,
    body1 && styles.body1,
    body2 && styles.body2,
    body3 && styles.body3,
    body4 && styles.body4,
    body5 && styles.body5,
    primary && styles.primary,
    secondary && styles.secondary,
    primaryALS && styles.primaryALS,
    secondaryALS && styles.secondaryALS,
    black && styles.black,
    white && styles.white,
    gray && styles.gray,
    darkGray && styles.darkGray,
    darkGray2 && styles.darkGray2,
    lightGray1 && styles.lightGray1,
    lightGray2 && styles.lightGray2,
    lightGray3 && styles.lightGray3,
    lightGray && styles.lightGray,
    green && styles.green,
    red && styles.red,
    style, // rewrite predefined styles
  ];
  return (
    <Text style={textStyles} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: theme.FONTS.h1,
  h2: theme.FONTS.h2,
  h3: theme.FONTS.h3,
  h4: theme.FONTS.h4,
  body1: theme.FONTS.body1,
  body2: theme.FONTS.body2,
  body3: theme.FONTS.body3,
  body4: theme.FONTS.body4,
  body5: theme.FONTS.body5,
  // position
  center: {textAlign: 'center'},
  right: {textAlign: 'right'},
  primary: {color: theme.COLORS.primary},
  secondary: {color: theme.COLORS.secondary},
  black: {color: theme.COLORS.black},
  white: {color: theme.COLORS.white},
  gray: {color: theme.COLORS.gray},
  darkGray: {color: theme.COLORS.darkGray},
  darkGray2: {color: theme.COLORS.darkGray2},
  lightGray1: {color: theme.COLORS.lightGray1},
  lightGray2: {color: theme.COLORS.lightGray2},
  lightGray3: {color: theme.COLORS.lightGray3},
  lightGray: {color: theme.COLORS.lightGray},
  green: {color: theme.COLORS.green},
  red: {color: theme.COLORS.red},
  primaryALS: {color: theme.COLORS.primaryALS},
  secondaryALS: {color: theme.COLORS.secondaryALS},
  // fonts
});

export default Typography;
