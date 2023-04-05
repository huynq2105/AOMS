import {COLORS,constants,FONTS,SIZES,icons} from '../../constants'
import { StyleSheet } from 'react-native';

import * as dimensions from '../../constants/dimensions'
import * as scalingUtils from '../../constants/scalingUtils'
const { indent, verticalIndent } = dimensions;
export default StyleSheet.create({
    calendarIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: verticalIndent,
        paddingHorizontal: indent,
        marginTop: verticalIndent,
        marginBottom: verticalIndent / 2,
        alignItems: 'center',
      },
      cancelButtonText: {
        color: COLORS.red,
      },
      doneButtonText: {
        color: COLORS.green,
      },
      textStyle: {
        fontSize: scalingUtils.moderateScale(14)
      },
      container: {
        backgroundColor: 'white',
        paddingVertical: verticalIndent,
      },
    
      modal: {
        marginHorizontal: scalingUtils.moderateScale(5),
      },
})