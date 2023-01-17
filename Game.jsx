import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { Board } from './Board'
import { Button } from 'react-native-elements';
import { Manager, io } from "socket.io-client";
import DialogInput from './DialogInput';



export class Game extends React.Component {
  // Имена игроков по часовой стрелке
  playerNames = ['D', 'N', 'S', 'M']

  // Отправка данных о сессии на сервер
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
        "ended": this.state.ended
      })
    }
  }

  // Конец игры
  gameOver(text) {
    this.setState({
      disableButtons: true,
      text: text,
      spectator: true,
      ended: true
    }, () => console.log("Game Ended"))
  }

  // Установка текста в поле информации
  setText(text) {
    this.setState({
      text: text,
    })
  }

  // Отключаем сокет при выходе на главный экран
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
    let hardmode = false
    let wait = false

    // Смотрим на выбранный режим игры
    if (props.mode) {
      switch (props.mode) {
        case '4PL': {
          squaress = [
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
          wait = true
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
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          meat = [true, false, false, false]
          break
        }
        case 'MannHard': {
          squaress = [
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',

          ]
          dead = [false, false, false, false]
          meat = [true, false, false, false]
          hardmode = true
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
        case 'Bullying Stupid Machine': {
          squaress = [
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          meat = [true, true, true, false]
          break
        }
        case 'All Hail The Queen': {
          squaress = [
            'D', 'D', 'D', 'N', 'N', 'N',
            'D', 'DQ', null, null, 'NQ', 'N',
            'D', null, null, null, null, 'N',
            'M', null, null, null, null, 'S',
            'M', 'MQ', null, null, 'SQ', 'S',
            'M', 'M', 'M', 'S', 'S', 'S',
          ]
          dead = [false, false, false, false]
          break
        }
        case 'Smoll': {
          squaress = [
            'D', 'D', null, null, 'N', 'N',
            'D', null, null, null, null, 'N',
            null, null, null, null, null, null,
            null, null, null, null, null, null,
            'M', null, null, null, null, 'S',
            'M', 'M', null, null, 'S', 'S',
          ]
          dead = [false, false, false, false]
          break
        }
        case 'Queens Gambit': {
          squaress = [
            'DQ', 'DQ', 'DQ', 'NQ', 'NQ', 'NQ',
            'DQ', 'DQ', null, null, 'NQ', 'NQ',
            'DQ', null, null, null, null, 'NQ',
            'MQ', null, null, null, null, 'SQ',
            'MQ', 'MQ', null, null, 'SQ', 'SQ',
            'MQ', 'MQ', 'MQ', 'SQ', 'SQ', 'SQ',
          ]
          dead = [false, false, false, false]
          break
        }
      }
    }

    if (connectToServer) {
      var io = require('socket.io-client');
      var socket = io.connect('http://' + props.address);

      // Отклик на проблемы с соединением
      socket.on("connect_error", () => {
        this.setText("Cant establish connection with server!\nTry another IP + Port configuration (settings)\nAlso check if local server is running properly")
      });

      // Отклик на установление соединения
      socket.on('connect', () => {
        console.log('Server responded!');

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
            ended: data.ended
          })
        })

      });
      // Отклик на получение информации о нынешнем игроке
      socket.on('current-player-id', (playerId) => {
        this.setState({
          currentSocketId: playerId.id,
          text: this.state.spectator ? "Spectator mode\nCurrent player is " + playerId.id : "Current player is " + playerId.id + "\nYour name is " + this.state.thisSocketId
        }, () => console.log("Current player: " + playerId.id))
      });
      // Отклик на переход в режим зрителя
      socket.on('spectator-mode', () => {
        this.setState({
          spectator: true,
          waiting: true,
        }, () => { this.setText("Spectator Mode") })
      });
      // Отклик на переход в режим ожидания (очереди)
      socket.on('wait', () => {
        this.setState({
          spectator: false,
          waiting: true,
        })
      });
      // Отклик на переход из режима ожидания в саму игру
      socket.on('wake-up', () => {
        this.setState({
          spectator: false,
          waiting: false,
        })
      })
      // Отклик на ввод некорректного имени
      socket.on('forbidden-name', () => {
        alert("You entered forbidden name!\nBut don't worry\nWe generated you a new unique name")
      });
      // Отклик на конец игры из-за вылетевшего игрока
      socket.on('game-ended', (playerId) => {
        this.gameOver("Someone disconnected\nGame has ended")

      });
      // Отклик на штатное заверщение игры
      socket.on('game-ended-piecefully', (playerId) => {
        this.gameOver("Game has ended")

      });
      // Отклик на перезагрузку карты (после начала новой игры)
      socket.on('reset', (playerId) => {
        this.reset()

      });
      // Отклик на получение имени игрока от сервера
      socket.on('this-player-id', (playerId) => {
        this.setState({
          thisSocketId: playerId.id,
        })
        if (this.state.waiting) {
          this.setText("You are in queue\nYour name is " + playerId.id)
        } else {
          this.setText("Waiting for players\nYour name is " + playerId.id)
        }
        console.log("This is player: " + playerId.id)
      });

    }


    this.state = {
      // Игровое поле
      squares: squaress,
      // Состояние игроков
      dead: dead,
      // Исходное поле (нужно для ресета)
      squaresDefault: [...squaress],
      // Исходное состояниее игроков (нужно для ресета)
      deadDefault: dead,
      // Говорит, взял ли уже игрок шашку
      handling: false,
      // Нынешний игрок
      currentPlayer: 0,
      // Нынешняя активная клетка (индекс)
      currentActiveCell: null,
      // Нынешняя активная шашка
      currentCheck: 'D',
      // Лок на смену активной шашкм (когда игрок пошел в атаку)
      lock: false,
      // Если был выбран онлайн режим
      online: connectToServer,
      // Если был выбран онлайн режим
      socket: socket,
      // Имя нынешнего игрока в онлайн режиме
      currentSocketId: 0,
      // Имя клиента в онлайн режиме
      thisSocketId: 1,
      // Тест в инфо панели сверху
      text: "Waiting for players",
      // Показывать ли диалог с выбором имени
      activeDialog: showDialog,
      // Включен ли режим зрителя
      spectator: false,
      // Отключение кнопок
      disableButtons: false,
      // Кто из игроков является человеком
      meat: meat,
      // Включен ли режим коопа против компа
      manCoop: manCoop,
      // Закончилась ли игра
      ended: false,
      // Включены ли сложные боты
      harderBots: hardmode,
      // Находится ли игрок в очереди (онлайн)
      waiting: wait
    };
  }

  // Сброс доски в изначальное положение (доступен только в офлайне)
  reset() {
    this.setState({
      squares: [...this.state.squaresDefault],
      dead: [...this.state.deadDefault],
      handling: false,
      currentPlayer: 0,
      currentActiveCell: null,
      currentCheck: 'D',
      lock: false,
      ended: false
    }, () => this.logEverything())
  }

  // Обработка хода бота
  useSkynet() {
    // Ставим таймаут для того, чтобы пользователь не считал себя супер медленным
    setTimeout(() => {

      let squares = this.state.squares
      let myChecks = []
      let player = this.state.currentPlayer % 4
      let hardmode = this.state.harderBots

      // Получаем информацию о индексах шашек ИИ.
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] && squares[i].charAt(0) === this.playerNames[this.state.currentPlayer % 4]) {
          myChecks[myChecks.length] = i
        }
      }
      console.log('[' + player + "] check indexes: " + myChecks)

      let movesStart = []
      let movesEnd = []
      let oneScoreStart = []
      let oneScoreEnd = []
      let badMovesStart = []
      let badMovesEnd = []
      let lock = false

      // Проходимся по всем шашкам ИИ.
      for (let i = 0; i < myChecks.length; i++) {
        let score = 0

        // Ходы для дамки
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
        // Ходы для обычной шашки
        else {
          // Вправо
          if (squares[myChecks[i] + 1]) {
            if (squares[myChecks[i] + 2] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 1].charAt(0) && Math.floor((myChecks[i] + 2) / 6) === Math.floor(myChecks[i] / 6)) {
              squares[myChecks[i] + 2] = 'V'
              score = 2
            }
          }
          else {
            if (myChecks[i] < 35 && Math.floor((myChecks[i] + 1) / 6) === Math.floor(myChecks[i] / 6) && (player === 0 || player === 3)) {
              if (hardmode && myChecks[i] < 33 && squares[myChecks[i] + 2] && squares[myChecks[i] + 3] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 2] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 3]) {
                squares[myChecks[i] + 1] = 'vb'
              } else {
                squares[myChecks[i] + 1] = 'v'
              }
              score = score > 1 ? 2 : 1
            }
          }

          // Вниз
          if (squares[myChecks[i] + 6]) {
            if (squares[myChecks[i] + 12] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 6].charAt(0) && myChecks[i] + 6 < 30 && myChecks[i] + 6 > 5) {
              squares[myChecks[i] + 12] = 'V'
              score = 2
            }
          }
          else {
            if (myChecks[i] < 30 && (player === 0 || player === 1)) {
              if (hardmode && myChecks[i] < 18 && squares[myChecks[i] + 12] && squares[myChecks[i] + 18] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 12] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] + 18]) {
                squares[myChecks[i] + 6] = 'vb'
              } else {
                squares[myChecks[i] + 6] = 'v'
              }
              score = score > 1 ? 2 : 1
            }
          }

          // Влево
          if (squares[myChecks[i] - 1]) {
            if (squares[myChecks[i] - 2] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 1].charAt(0) && Math.floor((myChecks[i] - 2) / 6) === Math.floor(myChecks[i] / 6)) {
              squares[myChecks[i] - 2] = 'V'
              score = 2
            }
          }
          else {
            if (myChecks[i] > 0 && Math.floor((myChecks[i] - 1) / 6) === Math.floor(myChecks[i] / 6) && (player === 1 || player === 2)) {
              if (hardmode && myChecks[i] > 2 && squares[myChecks[i] - 2] && squares[myChecks[i] - 3] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 2] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 3]) {
                squares[myChecks[i] - 1] = 'vb'
              } else {
                squares[myChecks[i] - 1] = 'v'
              }
              score = score > 1 ? 2 : 1
            }
          }

          // Вверх
          if (squares[myChecks[i] - 6]) {
            if (squares[myChecks[i] - 12] === null && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 6].charAt(0) && myChecks[i] - 6 < 30 && myChecks[i] - 6 > 5) {
              squares[myChecks[i] - 12] = 'V'
              score = 2
            }
          }
          else {
            if (myChecks[i] > 5 && (player === 2 || player === 3)) {
              if (myChecks[i] > 17 && squares[myChecks[i] - 12] && squares[myChecks[i] - 18] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 12] && squares[myChecks[i]].charAt(0) !== squares[myChecks[i] - 18]) {
                squares[myChecks[i] - 6] = 'vb'
              } else {
                squares[myChecks[i] - 6] = 'v'
              }
              score = score > 1 ? 2 : 1
            }
          }
        }

        // Если вообще не можем сдвинуться
        if (score === 0) {
          continue
        }

        let bestMoves = []
        let badMoves = []

        // Собираем возможные комбинации ходов
        for (let j = 0; j < squares.length; j++) {
          if (score === 1 && squares[j] === 'v') {
            bestMoves[bestMoves.length] = j
          }
          if (score === 2 && squares[j] === 'V') {
            bestMoves[bestMoves.length] = j
          }
          if (squares[j] === 'vb') {
            badMoves[badMoves.length] = j
          }
        }
        // Если можем сделать нормальный ход
        if (bestMoves.length !== 0) {
          // Если это прям суперский ход
          if (score === 2) {
            movesStart[movesStart.length] = myChecks[i]
            movesEnd[movesEnd.length] = bestMoves[Math.floor(Math.random() * bestMoves.length)]
          } else {
            // Если это ну такой, нормальный ход, солидненький
            oneScoreStart[oneScoreStart.length] = myChecks[i]
            oneScoreEnd[oneScoreEnd.length] = bestMoves[Math.floor(Math.random() * bestMoves.length)]
          }
        } else {
          // Если вариантов не осталось, и пришлось подставиться под противника
          if (badMoves.length !== 0) {
            badMovesStart[badMovesStart.length] = myChecks[i]
            badMovesEnd[badMovesEnd.length] = badMoves[Math.floor(Math.random() * badMoves.length)]
          }
        }

        // Сбрасываем стол к исходному состоянию
        squares = squares.map(x => x ? (x.toLocaleLowerCase().includes('v') ? null : x) : null)
      }

      // Если можем двинутся и кого-то съесть
      if (movesStart.length > 0) {
        // Выбираем рандомный ход и отправляем его в исполнение
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
          }, 250);
        })
        console.log("[" + player + "] AI HAS MADE A GOOD MOVE")
        return
      }
      // Если никого съесть не можем, но переместиться сумеем
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
        console.log("[" + player + "] AI HAS MADE A NORMAL MOVE")
        return
      }
      // Если все очень плохо, и единственный выход - подставится
      if (badMovesStart.length > 0) {
        let rnd = Math.floor(Math.random() * badMovesStart.length)
        squares[badMovesStart[rnd]] = squares[badMovesStart[rnd]].toLocaleLowerCase()
        this.setState({
          currentActiveCell: badMovesStart[rnd],
          currentCheck: squares[badMovesStart[rnd]].toUpperCase(),
          currentPlayer: player,
          squares: this.checkMovement(squares, badMovesStart[rnd], false),
          handling: true,
        }, () => this.handleClick(badMovesEnd[rnd]))
        console.log("[" + player + "] AI WAS DESPERATE TO MAKE A BAD MOVE")
        return
      }

      // Если вообще ничем и никак не можем двинуться, то пропускаем ход
      console.log("[" + player + "] AI CANT MOVE")
      this.skipTurn()

    }, 250)
  }


  // Обработка нажатия на клетку игрового поля
  handleClick(i) {
    // Если игра закончилась, или ходит кто-то не тот
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

  // Проверка на жизнеспособность игрока
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
    if (this.state.manCoop) {
      console.log("MEAT: " + deadMeat + " AI: " + deadAI)
    }
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
          if (!lock)
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
          if (!lock)
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
          if (!lock)
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
          if (!lock)
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

  // Отмена ввода в диалоговое окно (онлайн)
  denyDialog() {
    this.acceptDialog(this.generateBullscheisse())
  }

  // Принятие диалога (онлайн)
  acceptDialog(input) {
    this.state.socket.emit('handshake', { "name": input })
    this.setState({
      thisSocketId: input,
      activeDialog: false,
    })
  }

  // Переход в режим зрителя (онлайн)
  spectate() {
    this.setState({
      spectator: true
    })
  }

  // Рендер
  render() {
    return (
      <>
        {/* Форма для ввода имени */}
        {this.state.online && <DialogInput isDialogVisible={this.state.activeDialog}
          title={"How would you like to be called"}
          hintInput={"Oleg Gazmanov"}
          submitInput={(inputText) => this.acceptDialog(inputText)}
          closeDialog={() => this.denyDialog()}>
        </DialogInput>
        }

        {/* Секция с информацией о сессии */}
        {(this.state.online || this.state.spectator) && <View style={styles.info}>
          <Text style={styles.text}>{this.state.text}</Text>
        </View>
        }
        {/* Игровое поле */}
        {(!this.state.waiting || this.state.spectator) && <View className="game-board">
          {setBackground(this.state.currentPlayer)}
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </View>
        }
        {/* Кнопки */}
        <View className="game-info" style={{ flexDirection: 'row' }}>
          {/* Кнопка краткосрочной ликвидации */}
          {!this.state.online && <TouchableOpacity onPress={() => this.giveUp()} style={styles.button} disabled={this.state.disableButtons} >
            <Text style={styles.text}>Give Up</Text>
          </TouchableOpacity>
          }
          {/* Кнопка пропуска хода */}
          {(!this.state.spectator && !this.state.waiting) && <TouchableOpacity onPress={() => this.skipTurn(null)} style={styles.button} disabled={this.state.disableButtons}>
            <Text style={styles.text}>Skip Turn</Text>
          </TouchableOpacity>
          }
          {/* Кнопка ресета игры */}
          {!this.state.online && <TouchableOpacity onPress={() => this.reset()} style={styles.imageButton} disabled={this.state.disableButtons}>
            <Image style={{ flex: 1, alignContent: 'center', width: 40, height: undefined, resizeMode: 'contain', }} source={require('./refresh.png')} />
          </TouchableOpacity>
          }
          {/* Кнопка перехода в режим зрителя (онлайн) */}
          {this.state.waiting && !this.state.spectator && <TouchableOpacity onPress={() => this.spectate()} style={styles.imageButton}>
            <Text style={styles.text}>Spectate</Text>
          </TouchableOpacity>
          }
        </View>
      </>
    );
  }
}

// Элемент, меняющий фон под нынешнего игрока
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

// Стили
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