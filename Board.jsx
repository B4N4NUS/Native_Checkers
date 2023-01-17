import React from 'react';
import { Square } from './Square';
import { StyleSheet, Text, View } from 'react-native';

// Доска
export class Board extends React.Component {
  // Перекидываем метод нажатия из игры на клетку внутри доски
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <View style={{borderColor:"#000000", borderWidth:5}}>

        <View style={styles.background}></View>

        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </View>
        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </View>
        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
        </View>
        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(18)}
          {this.renderSquare(19)}
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
        </View>
        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
          {this.renderSquare(27)}
          {this.renderSquare(28)}
          {this.renderSquare(29)}
        </View>
        <View className="board-row" style={styles.cont_row}>
          {this.renderSquare(30)}
          {this.renderSquare(31)}
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
          {this.renderSquare(35)}
        </View>
      </View>
    );
  }
}


const styles = {
  cont_row: {
    display: "flex",
    flexDirection: "row",
  },
  background: {
    position: 'absolute',
    width: 280,
    height: 280,
    margin: 28,
    backgroundColor: "rgba(255,255,0,1)",
  },
}