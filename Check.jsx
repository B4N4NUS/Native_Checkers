import { StyleSheet, Text, View, Image } from 'react-native';
import crown from './crown.png'

export function Check(param) {
    // BRUH
    switch (param.value) {
        case 'D':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,255,255,1)'}]}></View>
        case 'M':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(50,50,50,1)'}]}></View>
        case 'N':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,0,0,1)'}]}></View>
        case 'S':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(0,255,0,1)'}]}></View>
            
        case 'd':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,255,255,1)', opacity:0.6}]}></View>
        case 'm':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(50,50,50,1)', opacity:0.6}]}></View>
        case 'n':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,0,0,1)', opacity:0.6}]}></View>
        case 's':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(0,255,0,1)', opacity:0.6}]}></View>

        case 'DQ':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,255,255,1)'}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'MQ':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(50,50,50,1)'}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'NQ':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,0,0,1)'}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'SQ':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(0,255,0,1)'}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>

        case 'dq':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,255,255,1)', opacity:0.6}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'mq':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(50,50,50,1)', opacity:0.6}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'nq':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(255,0,0,1)', opacity:0.6}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>
        case 'sq':
            return <View style={[styles.check_piece,{backgroundColor: 'rgba(0,255,0,1)', opacity:0.6}]}>
                <Image style={{ margin: 2, flex: 1, alignContent: 'center', width: undefined, height: undefined, transform: [{ rotate: "-45deg" }], resizeMode: 'stretch', }} source={require('./crown.png')} />
            </View>

        case 'v':
            return <View style={[styles.check_piece,{backgroundColor: '445', opacity:0.6}]}></View>
        default:
            return <View></View>;
    }
}

const styles = {
    check_piece: {
         width: 25, 
         height: 25, 
         borderRadius: 50, 
         borderColor: '#000000', 
         borderWidth: 3, 
         borderStyle: 'solid'
    },
    background: {
      position: 'absolute',
      width: 250,
      height: 250,
      margin: 25,
      backgroundColor: "rgba(255,255,0,1)",
    },
  }
