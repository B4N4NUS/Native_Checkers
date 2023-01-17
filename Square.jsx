import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Check } from './Check';

// Клетка
export function Square(props) {
  return (
    <TouchableHighlight className="square" style={
      styles.rectangle
    } onPress={props.onClick}>
      <Check
        value={props.value}
      />
    </TouchableHighlight>
  )
}

const styles = {
  rectangle: {
    width: 40,
    height: 40,
    margin: 8,
    backgroundColor: "rgba(201,140,2,1)",
    transform:  [{ rotate: "45deg" }],
    alignItems: 'center',
    justifyContent: 'center',
  },
}
