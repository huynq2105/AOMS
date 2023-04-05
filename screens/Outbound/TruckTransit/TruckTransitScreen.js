import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TruckTransitScreen = props => {
    
    return (
<View style={styles.container}>
        <Text>TruckTransitScreen Screen</Text>
    </View>
    ) 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default TruckTransitScreen;