import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { Board } from './Board'
import { Button } from 'react-native-elements';
import { Manager, io } from "socket.io-client";
import DialogInput from './DialogInput';



export class Game extends React.Component {
  // Имена игроков по часовой стрелке
  playerNames = ['D', 'N', 'S', 'M']

  logEverything() {
    if (this.state.online) {
      this.state.socket.emit("new-table", {
        "squares": this.state.squares,
        "currentPlayer": this.state.currentPlayer,
        "dead": this.state.dead,
        "handling": this.state.handling,
        "currentActiveCell": this.state.currentActiveCell,
        "currentCheck": this.state.currentCheck,
        "lock": this.state.lock,
      })
    }
  }

  gameOver(text) {
    // alert("Someone disconnected\nGame has ended")
    this.setState({
      squares: this.state.squares.map(x => null),
      disableButtons: true,
      text: text,
      spectator: true,
      ended: true
    }, () => console.log("Game Ended"))
  }

  componentWillUnmount() {
    if (this.state.online) {
      this.state.socket.disconnect()
    }
  }

  constructor(props) {
    super(props);

    let squaress = []
    let dead = []
    let connectToServer = false
    let showDialog = false
    let meat = [true, true, true, true]
    let manCoop = false

    if (props.mode) {
      switch (props.mode) {
        case '4PL': {
          squaress = [
            //   'D', null, null, null, null, 'N',
            //   'D', null, null, null, null, 'N',
            //   null, 'DQ', null, null, 'S', null,
            //   'M', null, null, 'DQ', null, null,
            //   null, 'M', null, null, 'DQ', 'S',
            //   null, null, null, null, 'D', null,
            // ],
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          break
        }
        case '4PO': {
          squaress = [
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          connectToServer = true
          showDialog = true
          break
        }
        case '2PL': {
          squaress = [
            'D', 'D', 'D', null, null, null,
            'D', 'D', null, null, null, null,
            'D', null, null, null, null, null,
            null, null, null, null, null, 'S',
            null, null, null, null, 'S', 'S',
            null, null, null, 'S', 'S', 'S',
          ]
          dead = [false, true, false, true]
          break
        }
        case 'Mann': {
          squaress = [
            // 'D', 'D', 'D', 'N', 'N', 'N',
            // 'D', 'D', null, null, 'N', 'N',
            // 'D', null, null, null, null, 'N',
            // 'M', null, null, null, null, 'S',
            // 'M', 'M', null, null, 'S', 'S',
            // 'M', 'M', 'M', 'S', 'S', 'S',
            null, 'D', null, 'NQ', 'NQ', 'NQ',
            null, null, null, null, null, 'NQ',
            null, null, null, null, null, 'NQ',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          meat = [true, false, false, false]
          break
        }
        case 'Mann1V1': {
          squaress = [
            'D', 'D', 'D', null, null, null,
            'D', 'D', null, null, null, null,
            'D', null, null, null, null, null,
            null, null, null, null, null, 'S',
            null, null, null, null, 'S', 'S',
            null, null, null, 'S', 'S', 'S',
          ]
          dead = [false, true, false, true]
          meat = [true, false, false, false]
          break
        }
        case 'MannCoop': {
          squaress = [
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          meat = [true, false, true, false]
          manCoop = true
          break
        }
      }
    }

    if (connectToServer) {
      var io = require('socket.io-client');
      var socket = io.connect('http://' + props.address);

      socket.on('connect', () => {
        console.log('Connected!');

        socket.on("new-table", (data) => {
          this.setState({
            squares: data.squares,
            currentPlayer: data.currentPlayer,
            dead: data.dead,
            handling: data.handling,
            currentActiveCell: data.currentActiveCell,
            currentCheck: data.currentCheck,
            lock: data.lock,
            disableButtons: false,
          })
        })

      });
      socket.on('current-player-id', (playerId) => {
        this.setState({
          currentSocketId: playerId.id,
          text: this.state.spectator ? "Spectator mode\nCurrent player is " + playerId.id : "Current player is " + playerId.id + "\nYour name is " + this.state.thisSocketId
        }, () => console.log("Current player: " + playerId.id))

      });
      socket.on('spectator-mode', () => {
        this.setState({
          thisSocketId: this.generateBullscheisse(),
          spectator: true,
          text: "Spectator mode"
        })

      });
      socket.on('forbidden-name', () => {
        alert("You entered forbidden name!\nBut don't worry\nWe generated you a new unique name")
      });
      socket.on('game-ended', (playerId) => {
        this.gameOver("Someone disconnected\nGame has ended")

      });
      socket.on('this-player-id', (playerId) => {
        this.setState({
          thisSocketId: playerId.id,
          text: "Waiting for players\nYour name is " + playerId.id,
        })
        console.log("This is player: " + playerId.id)
      });

    }


    this.state = {
      //   'D', null, null, null, null, 'N',
      //   'D', null, null, null, null, 'N',
      //   null, 'DQ', null, null, 'S', null,
      //   'M', null, null, 'DQ', null, null,
      //   null, 'M', null, null, 'DQ', 'S',
      //   null, null, null, null, 'D', null,
      // ],
      squares: squaress,
      dead: dead,
      squaresDefault: [...squaress],
      deadDefault: dead,
      handling: false,
      currentPlayer: 0,
      currentActiveCell: null,
      currentCheck: 'D',
      lock: false,
      online: connectToServer,
      socket: socket,
      currentSocketId: 0,
      thisSocketId: 1,
      text: "Waiting for players",
      activeDialog: showDialog,
      spectator: false,
      disableButtons: false,
      meat: meat,
      manCoop: manCoop,
      ended: false,
    };
  }

  reset() {
    this.setState({
      squares: [...this.state.squaresDefault],
      dead: [...this.state.deadDefault],
      handling: false,
      currentPlayer: 0,
      currentActiveCell: null,
      currentCheck: 'D',
      lock: false
    }, () => this.logEverything())
  }

  // // Отработка нажатия на клетку доски
  // handleClick(i) {
  //   if (this.state.online && this.state.currentSocketId !== this.state.thisSocketId) {
  //     return
  //   } else {
  //     console.log(this.state.currentSocketId !== this.state.thisSocketId)
  //   }

  //   // // Доска
  //   let squares = this.state.squares
  //   // Если тыкнули на пустую клетку
  //   if (!squares[i]) {
  //     return
  //   }

  //   // Если игрок еще не выбрал шашку и тыкнул на одну из своих
  //   if (squares[i].charAt(0) === this.playerNames[this.state.currentPlayer % 4] && !this.state.handling) {
  //     this.setState({
  //       currentCheck: squares[i],
  //     }, () => this.logEverything())
  //     // Хайлайтим ходы для выбранной шашки
  //     squares[i] = squares[i].toLocaleLowerCase()
  //     squares = this.checkMovement(squares, i, false)
  //     this.setState({
  //       currentActiveCell: i,
  //       handling: true,
  //       squares: squares
  //     }, () => this.logEverything())


  //   } else {
  //     // Если игрок уже тыкал на другую шашку и хочет ее сменить, при этом не ходя предыдущей
  //     if (!this.state.lock && this.state.handling && squares[i].charAt(0) === squares[this.state.currentActiveCell].charAt(0).toUpperCase()) {
  //       // Возвращаем предыдущую к состоянию до хайлайтов
  //       squares = this.reverseSelection(squares)

  //       // Запоминаем новую шашку
  //       this.setState({
  //         currentActiveCell: i,
  //         currentCheck: squares[i],
  //         handling: true,
  //         squares: squares
  //       }, () => this.logEverything())

  //       // Смотрим возможные ходы для новой
  //       squares[i] = squares[i].toLocaleLowerCase()
  //       squares = this.checkMovement(squares, i, false)
  //     }
  //   }

  //   // Если игрок выбрал шашку и тыкнул в один из хайлайтов
  //   if (this.state.handling && squares[i] === 'v') {
  //     // Заменяем хайлайт на выбранную шашку
  //     squares[i] = this.state.currentCheck

  //     // Смотрим, можно ли продолжить ход, также удаляем фишки, стоявшие на пути игрока
  //     let resume = false
  //     let eaten = false
  //     if (this.state.currentActiveCell % 6 < i % 6 && Math.abs(this.state.currentActiveCell - i) > 1) {
  //       if (squares[i - 1] !== 'v') {
  //         eaten = true
  //         squares[i - 1] = null
  //       }
  //       resume = true
  //     }
  //     if (Math.floor(this.state.currentActiveCell / 6) < Math.floor(i / 6) && this.state.currentActiveCell % 6 === i % 6 && Math.abs(this.state.currentActiveCell - i) > 6) {
  //       if (squares[i - 6] !== 'v') {
  //         eaten = true
  //         squares[i - 6] = null
  //       }
  //       resume = true
  //     }
  //     if (this.state.currentActiveCell % 6 > i % 6 && Math.abs(this.state.currentActiveCell - i) > 1) {
  //       if (squares[i + 1] !== 'v') {
  //         eaten = true
  //         squares[i + 1] = null
  //       }
  //       resume = true
  //     }
  //     if (Math.floor(this.state.currentActiveCell / 6) > Math.floor(i / 6) && this.state.currentActiveCell % 6 === i % 6 && Math.abs(this.state.currentActiveCell - i) > 6) {
  //       if (squares[i + 6] !== 'v') {
  //         eaten = true
  //         squares[i + 6] = null
  //       }
  //       resume = true
  //     }

  //     // Смотрим, можно ли сделать из шашки дамку
  //     squares = this.makeQueen(this.validate(squares), i)

  //     // На всякий запоминаем положение доски и скидываем лок на выбор другой шашки
  //     this.setState({
  //       squares: squares,
  //       handling: false,
  //       lock: false,
  //     }, () => this.logEverything())


  //     // Если можно продолжить
  //     if (eaten && resume && this.canResume(squares, i, this.state.currentCheck)) {
  //       // Хайлайтим возможные ходы
  //       squares = this.checkMovement(squares, i, true)
  //       this.setState({
  //         currentCheck: squares[i],
  //       })
  //       squares[i] = squares[i].toLocaleLowerCase()
  //       this.setState({
  //         squares: squares,
  //         currentPlayer: this.state.currentPlayer,
  //         handling: true,
  //         currentActiveCell: i,
  //         lock: true,
  //       }, () => this.logEverything())

  //     } else {
  //       // Если продолжить нельзя
  //       this.chechAlive(squares)
  //       this.setState({
  //         squares: this.skipTurn(squares)
  //       }, () => this.logEverything())


  //     }
  //   }
  //   // this.chechAlive(squares)

  // }

  useSkynet() {
    setTimeout(() => {

      let squares = this.state.squares
      let myChecks = []
      let player = this.state.currentPlayer % 4

      // Получаем информацию о индексах шашек ИИ.
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] && squares[i].charAt(0) === this.playerNames[this.state.currentPlayer % 4]) {
          myChecks[myChecks.length] = i
        }
      }

      let movesStart = []
      let movesEnd = []
      let oneScoreStart = []
      let oneScoreEnd = []
      let lock = false

      // Проходимся по всем шашкам ИИ.
      for (let i = 0; i < myChecks.length; i++) {
        let score = 0


        if (squares[myChecks[i]].endsWith('Q')) {
          // Влево
          for (let q = myChecks[i] - 1; q >= Math.floor(myChecks[i] / 6) * 6; q--) {
            if (squares[q] !== null) {
              if (squares[q].charAt(0) !== squares[myChecks[i]].charAt(0) && squares[q - 1] === null && q !== Math.floor(myChecks[i] % 6) * 6) {
                squares[q - 1] = 'V'
                score = 2
              }
              break
            } else {
              squares[q] = 'v'
              score = score > 1 ? 2 : 1
            }
          }
          // Вправо
          for (let q = myChecks[i] + 1; q <= Math.floor(myChecks[i] / 6) * 6 + 5; q++) {
            if (squares[q] !== null) {
              if (squares[q].charAt(0) !== squares[myChecks[i]].charAt(0) && squares[q + 1] === null && q !== Math.floor(myChecks[i] % 6) * 6 + 5) {
                squares[q + 1] = 'V'
                score = 2
              }
              break
            } else {
              squares[q] = 'v'
              score = score > 1 ? 2 : 1
            }
          }
          // Вверх
          for (let q = myChecks[i] - 6; q > 0; q -= 6) {
            if (squares[q] !== null) {
              if (squares[q].charAt(0) !== squares[myChecks[i]].charAt(0) && squares[q - 6] === null && q !== myChecks[i] % 6) {
                squares[q - 6] = 'V'
                score = 2
              }
              break
            } else {
              squares[q] = 'v'
              score = score > 1 ? 2 : 1
            }
          }
          // Вниз
          for (let q = myChecks[i] + 6; q < 36; q += 6) {
            if (squares[q] !== null) {
              if (squares[q].charAt(0) !== squares[myChecks[i]].charAt(0) && squares[q + 6] === null && q !== 30 + myChecks[i] % 6) {
                squares[q + 6] = 'V'
                score = 2
              }
              break
            } else {
              squares[q] = 'v'
              score = score > 1 ? 2 : 1
            }
          }
        }
        else {
          // Вправо
          if (squares[myChecks[i] + 1]) {
            if (squares[myChecks[i] + 2] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 1].charAt(0) && Math.floor((myChecks[i] + 2) / 6) === Math.floor(myChecks[i] / 6)) {
              squares[myChecks[i] + 2] = 'V'
              score = 2
            }
          }
          else {
            if (!lock && myChecks[i] < 35 && Math.floor((myChecks[i] + 1) / 6) === Math.floor(myChecks[i] / 6) && (player === 0 || player === 3))
              squares[myChecks[i] + 1] = 'v'
            score = score > 1 ? 2 : 1
          }

          // Вниз
          if (squares[myChecks[i] + 6]) {
            if (squares[myChecks[i] + 12] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 6].charAt(0) && myChecks[i] + 6 < 30 && myChecks[i] + 6 > 5) {
              squares[myChecks[i] + 12] = 'V'
              score = 2
            }
          }
          else {
            if (!lock && myChecks[i] < 30 && (player === 0 || player === 1))
              squares[myChecks[i] + 6] = 'v'
            score = score > 1 ? 2 : 1
          }

          // Влево
          if (squares[myChecks[i] - 1]) {
            if (squares[myChecks[i] - 2] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 1].charAt(0) && Math.floor((myChecks[i] - 2) / 6) === Math.floor(myChecks[i] / 6)) {
              squares[myChecks[i] - 2] = 'V'
              score = 2
            }
          }
          else {
            if (!lock && myChecks[i] > 0 && Math.floor((myChecks[i] - 1) / 6) === Math.floor(myChecks[i] / 6) && (player === 1 || player === 2))
              squares[myChecks[i] - 1] = 'v'
            score = score > 1 ? 2 : 1
          }

          // Вверх
          if (squares[myChecks[i] - 6]) {
            if (squares[myChecks[i] - 12] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 6].charAt(0) && myChecks[i] - 6 < 30 && myChecks[i] - 6 > 5) {
              squares[myChecks[i] - 12] = 'V'
              score = 2
            }
          }
          else {
            if (!lock && myChecks[i] > 5 && (player === 2 || player === 3))
              squares[myChecks[i] - 6] = 'v'
            score = score > 1 ? 2 : 1
          }
        }

        if (score === 0) {
          continue
        }

        let bestMoves = []
        for (let j = 0; j < squares.length; j++) {
          if (score === 1 && squares[j] === 'v') {
            bestMoves[bestMoves.length] = j
          }
          if (score === 2 && squares[j] === 'V') {
            bestMoves[bestMoves.length] = j
          }
        }
        if (bestMoves.length === 0) {
          continue
        }
        if (score === 2) {
          movesStart[movesStart.length] = myChecks[i]
          movesEnd[movesEnd.length] = bestMoves[Math.floor(Math.random() * bestMoves.length)]
        } else {
          oneScoreStart[oneScoreStart.length] = myChecks[i]
          oneScoreEnd[oneScoreEnd.length] = bestMoves[Math.floor(Math.random() * bestMoves.length)]
        }
        squares = squares.map(x => x ? (x.toLocaleLowerCase() === 'v' ? null : x) : null)
      }

      console.log(oneScoreStart)
      console.log(oneScoreEnd)
      console.log(movesStart)
      console.log(movesEnd)

      // console.log(this.checkMovement(squares,oneScoreStart[0], false))

      if (movesStart.length > 0) {
        let rnd = Math.floor(Math.random() * movesStart.length)
        squares[movesStart[rnd]] = squares[movesStart[rnd]].toLocaleLowerCase()
        this.setState({
          currentActiveCell: movesStart[rnd],
          currentCheck: squares[movesStart[rnd]].toUpperCase(),
          currentPlayer: player,
          squares: this.checkMovement(squares, movesStart[rnd], false),
          handling: true,
        }, () => {
          let move = this.handleClick(movesEnd[rnd])
          let timerId = setInterval(() => {
            if ((move && move.includes('v'))) {
              move = this.handleClick(move.findIndex(x => x && x === 'v'))
            } else {
              clearInterval(timerId)
            }
          }, 1000);
        })
        console.log("AI MOVED 2")
        return
      }
      if (oneScoreStart.length > 0) {
        let rnd = Math.floor(Math.random() * oneScoreStart.length)
        squares[oneScoreStart[rnd]] = squares[oneScoreStart[rnd]].toLocaleLowerCase()
        this.setState({
          currentActiveCell: oneScoreStart[rnd],
          currentCheck: squares[oneScoreStart[rnd]].toUpperCase(),
          currentPlayer: player,
          squares: this.checkMovement(squares, oneScoreStart[rnd], false),
          handling: true,
        }, () => this.handleClick(oneScoreEnd[rnd]))
        console.log("AI MOVED 1")
        return
      }
      console.log("Retarded AI Did Nothing Wrong")
      this.skipTurn()

    }, 1000)
  }

  handleClick(i, ai) {
    if (this.state.online && this.state.currentSocketId !== this.state.thisSocketId || this.state.ended) {
      return
    }

    // // Доска
    let squares = this.state.squares
    // Если тыкнули на пустую клетку
    if (!squares[i]) {
      return
    }

    // Если игрок еще не выбрал шашку и тыкнул на одну из своих
    if (squares[i].charAt(0) === this.playerNames[this.state.currentPlayer % 4] && !this.state.handling) {
      this.setState({
        currentCheck: squares[i],
      }, () => this.logEverything())
      // Хайлайтим ходы для выбранной шашки
      squares[i] = squares[i].toLocaleLowerCase()
      squares = this.checkMovement(squares, i, false)
      this.setState({
        currentActiveCell: i,
        handling: true,
        squares: squares
      }, () => this.logEverything())


    } else {
      // Если игрок уже тыкал на другую шашку и хочет ее сменить, при этом не ходя предыдущей
      if (!this.state.lock && this.state.handling && squares[i].charAt(0) === squares[this.state.currentActiveCell].charAt(0).toUpperCase()) {
        // Возвращаем предыдущую к состоянию до хайлайтов
        squares = this.reverseSelection(squares)

        // Запоминаем новую шашку
        this.setState({
          currentActiveCell: i,
          currentCheck: squares[i],
          handling: true,
          squares: squares
        }, () => this.logEverything())

        // Смотрим возможные ходы для новой
        squares[i] = squares[i].toLocaleLowerCase()
        squares = this.checkMovement(squares, i, false)
      }
    }

    // Если игрок выбрал шашку и тыкнул в один из хайлайтов
    if (this.state.handling && squares[i] === 'v') {
      // Заменяем хайлайт на выбранную шашку
      squares[i] = this.state.currentCheck

      // Смотрим, можно ли продолжить ход, также удаляем фишки, стоявшие на пути игрока
      let resume = false
      let eaten = false
      if (this.state.currentActiveCell % 6 < i % 6 && Math.abs(this.state.currentActiveCell - i) > 1) {
        if (squares[i - 1] !== 'v') {
          eaten = true
          squares[i - 1] = null
        }
        resume = true
      }
      if (Math.floor(this.state.currentActiveCell / 6) < Math.floor(i / 6) && this.state.currentActiveCell % 6 === i % 6 && Math.abs(this.state.currentActiveCell - i) > 6) {
        if (squares[i - 6] !== 'v') {
          eaten = true
          squares[i - 6] = null
        }
        resume = true
      }
      if (this.state.currentActiveCell % 6 > i % 6 && Math.abs(this.state.currentActiveCell - i) > 1) {
        if (squares[i + 1] !== 'v') {
          eaten = true
          squares[i + 1] = null
        }
        resume = true
      }
      if (Math.floor(this.state.currentActiveCell / 6) > Math.floor(i / 6) && this.state.currentActiveCell % 6 === i % 6 && Math.abs(this.state.currentActiveCell - i) > 6) {
        if (squares[i + 6] !== 'v') {
          eaten = true
          squares[i + 6] = null
        }
        resume = true
      }

      // Смотрим, можно ли сделать из шашки дамку
      squares = this.makeQueen(this.validate(squares), i)

      // На всякий запоминаем положение доски и скидываем лок на выбор другой шашки
      this.setState({
        squares: squares,
        handling: false,
        lock: false,
      }, () => this.logEverything())


      // Если можно продолжить
      if (eaten && resume && this.canResume(squares, i, this.state.currentCheck)) {
        // Хайлайтим возможные ходы
        squares = this.checkMovement(squares, i, true)
        this.setState({
          currentCheck: squares[i],
        })
        squares[i] = squares[i].toLocaleLowerCase()
        this.setState({
          squares: squares,
          currentPlayer: this.state.currentPlayer,
          handling: true,
          currentActiveCell: i,
          lock: true,
        }, () => this.logEverything())

      } else {
        // Если продолжить нельзя
        this.chechAlive(squares)
        this.setState({
          squares: this.skipTurn(squares)
        }, () => this.logEverything())


      }
    }
    return squares
    // this.chechAlive(squares)

  }

  chechAlive(squares) {
    let ded = this.state.dead
    for (let p = 0; p < 4; p++) {
      let playerDead = true
      for (let i = 0; i < 36; i++) {
        if (squares[i] && squares[i].charAt(0).toUpperCase() === this.playerNames[p]) {
          playerDead = false
        }
      }
      ded[p] = playerDead
    }
    this.setState({
      dead: ded,
    }, () => this.logEverything())
  }

  // Смотрим, можно ли создать дамку
  makeQueen(squares, i) {
    // Если шашка уже дамка
    if (this.state.currentCheck.length !== 1) {
      return squares
    }
    // Смотрим на углы поля
    switch (this.state.currentCheck) {
      case this.playerNames[0]: {
        if (i == 35) {
          squares[35] = this.state.currentCheck + "Q"
        }

        break
      }
      case this.playerNames[1]: {
        if (i == 30) {
          squares[30] = this.state.currentCheck + "Q"
        }
        break
      }
      case this.playerNames[2]: {
        if (i == 0) {
          squares[0] = this.state.currentCheck + "Q"
        }
        break
      }
      case this.playerNames[3]: {
        if (i == 5) {
          squares[5] = this.state.currentCheck + "Q"
        }
        break
      }
    }
    // Возвращаем обработанную доску
    return squares
  }

  // Смотрим, можно ли кого-нибудь съесть с нынешним расположением шашки игрока
  canResume(squares, i, check) {
    let left = true, right = true, up = true, down = true

    // Проверяем положение шашки на поле
    if (i < 5) {
      up = false
    }
    if (i > 28) {
      down = false
    }
    if ((i % 6) < 2) {
      left = false
    }
    if ((i % 6) > 3) {
      right = false
    }

    // Проверяем возможность захавать шашку противника 
    if (!(up && squares[i - 6] && squares[i - 6].charAt(0) !== check.charAt(0) && squares[i - 12] === null)) {
      up = false
    }
    if (!(down && squares[i + 6] && squares[i + 6].charAt(0) !== check.charAt(0) && squares[i + 12] === null)) {
      down = false
    }
    if (!(left && squares[i - 1] && squares[i - 1].charAt(0) !== check.charAt(0) && squares[i - 2] === null)) {
      left = false
    }
    if (!(right && squares[i + 1] && squares[i + 1].charAt(0) !== check.charAt(0) && squares[i + 2] === null)) {
      right = false
    }
    return (up || down || right || left)
  }

  // Убираем все хайлайты
  // returns : игровое поле
  validate(squares) {
    return squares.map(x => x ? (x !== x.toLocaleLowerCase() ? x : null) : null)
  }

  // Обработка ситуации, когда игрок решил сдаться
  giveUp() {
    let ded = this.state.dead
    ded[this.state.currentPlayer % 4] = true
    this.setState({
      dead: ded,
      squares: this.state.squares.map(x => x ? (x.charAt(0).toUpperCase() === this.playerNames[this.state.currentPlayer % 4] ? null : x) : null)
    }, () => {
      this.logEverything()
      this.skipTurn()
    })
  }

  // Переадресация хода на следующего игрока
  // returns : игровое поле
  skipTurn(squares) {
    let turn = this.state.currentPlayer
    let winner = false;

    for (let i = 1; i < 4; i++) {
      if (!this.state.dead[(this.state.currentPlayer + i) % 4]) {
        turn = i + this.state.currentPlayer
        break
      }
    }
    let deadMeat = true, deadAI = true
    for (let i = 0; i < 4; i++) {
      if (!this.state.dead[i]) {
        if (this.state.meat[i]) {
          deadMeat = false
        } else {
          deadAI = false
        }
      }
    }
    console.log("MEAT: " + deadMeat + " AI: " + deadAI)
    if (turn === this.state.currentPlayer || (this.state.manCoop && (deadAI || deadMeat))) {
      this.gameOver("Game Over")
    }

    this.setState({
      currentPlayer: turn
    }, () => {
      this.logEverything()
      if (!this.state.meat[turn % 4]) {
        this.useSkynet()
      }
    })

    if (squares) {
      return this.reverseSelection(squares)
    } else {
      this.setState({
        handling: false,
        squares: this.validate(this.reverseSelection(this.state.squares))
      }, () => this.logEverything())
    }
  }

  // Отмена выбора шашки персонажа и очистка хайлайтов
  // returns : игровое поле
  reverseSelection(squares) {
    return squares.map(x => x ? x.toUpperCase() : null).map(x => x === 'V' ? null : x)
  }


  // Выставляем хайлайты для шашек
  // returns : игровое поле
  checkMovement(squares, i, lock) {
    // Достаем полный номинал выбранной игроком шашки
    let check = squares[i].toUpperCase()
    // Смотрим, является ли она дамкой
    if (check.endsWith('Q')) {
      // Влево
      for (let q = i - 1; q >= Math.floor(i / 6) * 6; q--) {
        if (squares[q] !== null) {
          if (squares[q].charAt(0) !== check.charAt(0) && squares[q - 1] === null && q !== Math.floor(i % 6) * 6) {
            squares[q - 1] = 'v'
          }
          break
        } else {
          squares[q] = 'v'
        }
      }
      // Вправо
      for (let q = i + 1; q <= Math.floor(i / 6) * 6 + 5; q++) {
        if (squares[q] !== null) {
          if (squares[q].charAt(0) !== check.charAt(0) && squares[q + 1] === null && q !== Math.floor(i % 6) * 6 + 5) {
            squares[q + 1] = 'v'
          }
          break
        } else {
          squares[q] = 'v'
        }
      }
      // Вверх
      for (let q = i - 6; q > 0; q -= 6) {
        if (squares[q] !== null) {
          if (squares[q].charAt(0) !== check.charAt(0) && squares[q - 6] === null && q !== i % 6) {
            squares[q - 6] = 'v'
          }
          break
        } else {
          squares[q] = 'v'
        }
      }
      // Вниз
      for (let q = i + 6; q < 36; q += 6) {
        if (squares[q] !== null) {
          if (squares[q].charAt(0) !== check.charAt(0) && squares[q + 6] === null && q !== 30 + i % 6) {
            squares[q + 6] = 'v'
          }
          break
        } else {
          squares[q] = 'v'
        }
      }

    } else {
      // Вправо
      if (squares[i + 1]) {
        if (squares[i + 2] === null && check.charAt(0) !== squares[i + 1].charAt(0) && Math.floor((i + 2) / 6) === Math.floor(i / 6)) {
          squares[i + 2] = 'v'
        }
      }
      else {
        if (!lock && i < 35 && Math.floor((i + 1) / 6) === Math.floor(i / 6) && (this.state.currentPlayer % 4 === 0 || this.state.currentPlayer % 4 === 3))
          squares[i + 1] = 'v'
      }

      // Вниз
      if (squares[i + 6]) {
        if (squares[i + 12] === null && check.charAt(0) !== squares[i + 6].charAt(0) && i + 6 < 30 && i + 6 > 5) {
          squares[i + 12] = 'v'
        }
      }
      else {
        if (!lock && i < 30 && (this.state.currentPlayer % 4 === 0 || this.state.currentPlayer % 4 === 1))
          squares[i + 6] = 'v'
      }

      // Влево
      if (squares[i - 1]) {
        if (squares[i - 2] === null && check.charAt(0) !== squares[i - 1].charAt(0) && Math.floor((i - 2) / 6) === Math.floor(i / 6)) {
          squares[i - 2] = 'v'
        }
      }
      else {
        if (!lock && i > 0 && Math.floor((i - 1) / 6) === Math.floor(i / 6) && (this.state.currentPlayer % 4 === 1 || this.state.currentPlayer % 4 === 2))
          squares[i - 1] = 'v'
      }

      // Вверх
      if (squares[i - 6]) {
        if (squares[i - 12] === null && check.charAt(0) !== squares[i - 6].charAt(0) && i - 6 < 30 && i - 6 > 5) {
          squares[i - 12] = 'v'
        }
      }
      else {
        if (!lock && i > 5 && (this.state.currentPlayer % 4 === 2 || this.state.currentPlayer % 4 === 3))
          squares[i - 6] = 'v'
      }
    }

    return squares
  }

  // https://youtu.be/3hx9d45i1Gs
  generateBullscheisse() {
    let d = new Date().getTime()
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
  }

  denyDialog() {
    this.acceptDialog(this.generateBullscheisse())
  }

  acceptDialog(input) {
    this.state.socket.emit('handshake', { "name": input })
    this.setState({
      thisSocketId: input,
      activeDialog: false,
    })
  }

  render() {

    return (
      <>
        {!this.state.spectator && <DialogInput isDialogVisible={this.state.activeDialog}
          title={"How would you like to be called"}
          hintInput={"Oleg Gazmanov"}
          submitInput={(inputText) => this.acceptDialog(inputText)}
          closeDialog={() => this.denyDialog()}>
        </DialogInput>
        }

        {(this.state.online || this.state.spectator) && <View style={styles.info}>
          <Text style={styles.text}>{this.state.text}</Text>
        </View>
        }
        <View className="game-board">
          {setBackground(this.state.currentPlayer)}
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </View>
        <View className="game-info" style={{ flexDirection: 'row' }}>
          {!this.state.spectator && <TouchableOpacity onPress={() => this.giveUp()} style={styles.button} disabled={this.state.disableButtons} >
            <Text style={styles.text}>Quit Game</Text>
          </TouchableOpacity>
          }

          {!this.state.spectator && <TouchableOpacity onPress={() => this.skipTurn(null)} style={styles.button} disabled={this.state.disableButtons}>
            <Text style={styles.text}>Skip Turn</Text>
          </TouchableOpacity>
          }

          {!this.state.online && <TouchableOpacity onPress={() => this.reset()} style={styles.imageButton} disabled={this.state.disableButtons}>
            <Image style={{ flex: 1, alignContent: 'center', width: 40, height: undefined, resizeMode: 'contain', }} source={require('./refresh.png')} />
          </TouchableOpacity>
          }
        </View>
      </>
    );
  }
}
function setBackground(params) {
  switch (params % 4) {
    case 0:
      return <View style={[styles.turnBackground, { backgroundColor: 'rgba(255,255,255,1)', }]}></View>

    case 1:
      return <View style={[styles.turnBackground, { backgroundColor: 'rgba(255,0,0,1)', }]}></View>

    case 2:
      return <View style={[styles.turnBackground, { backgroundColor: 'rgba(0,255,0,1)', }]}></View>

    case 3:
      return <View style={[styles.turnBackground, { backgroundColor: 'rgba(50,50,50,1)' }]}></View>

    default:
      return <View></View>;
  }
  return <View style={{ position: 'absolute', width: '400px', height: '400px', margin: '0px', backgroundColor: {}, }}></View>
}

const styles = StyleSheet.create({
  turnBackground: {
    position: 'absolute',
    width: 345,
    height: 345,
    margin: 0
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  info: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    opacity: 0.6
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
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
});