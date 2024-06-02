import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Firebase_auth } from '../firebase/config';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';


export default function Footer({navigation}) {
    const auth = Firebase_auth;
    const user = auth.currentUser;
    const feedlogo = auth.currentUser.photoURL

    const tofeed = () =>{
        navigation.navigate('Feedpage')
      }
      const tohome = () =>{
        navigation.navigate('Home')
      }
      const tocreate = () =>{
        navigation.navigate('Creategroup')
      }
      
  return (
    <View style={styles.footer}>
          <Pressable onPress={tohome}>
            <MaterialIcons name="home" size={42} color="#dfdde3" />
          </Pressable>
          <Pressable onPress={tocreate}>
            <FontAwesome6 name="add" size={42} color="#dfdde3" />
          </Pressable>
          {
            user && <Pressable onPress={tofeed}>
              <Image style={styles.profilelogofooter} source={{uri: `${feedlogo}`}}/>
              </Pressable>
          }
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer:{
    position: 'absolute', 
    left: 0, 
    right: 0,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 38,
    bottom: 0,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profilelogofooter:{
    width: 52,
    height: 52,
    borderRadius: 90
  }
});
