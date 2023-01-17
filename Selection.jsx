import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { AddressSettings } from './Settings.js';

// Настройки подключения к серверу
export function Selection() {
    let currentText = AddressSettings.address
    const setText = text => {
        currentText = text
    }

    const apply = text => {
        AddressSettings.address = text
    }

    return (
        <View className="AddressSettings-info" style={{ flexDirection: 'column' }}>
                <Text style={styles.info_text}>
                    This application implements multiplayer via local network. If you want to play online, first of all start dedicated server from /server folder. Then input given IP with port into the field below. 
                </Text>
            <View style={styles.container}>
                <TextInput style={styles.input_container}
                    onChangeText={newText => setText(newText)}
                    defaultValue={AddressSettings.address}>
                </TextInput>
            </View>
            <TouchableOpacity onPress={() => { apply(currentText) }} style={styles.button}>
                <Text style={styles.text}>Apply</Text>
            </TouchableOpacity>
        </View>
    );

}


const styles = {
    input_container: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        padding: 10,

    },
    container: {
        borderRadius: 4,
        borderWidth: 2,

        borderColor: "white"

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    info_text: {
        maxWidth:300,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
}