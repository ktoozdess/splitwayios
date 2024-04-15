import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, Button, Pressable, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const [Signupmodal, setSignupmodal] = useState(false)
  const [Loginmodal, SetLoginmodal] = useState(false)


  return (
    <View style={styles.container}>

      <Modal visible={Signupmodal}>
        <View style={styles.modalWrapper}>
        <Ionicons name="arrow-back" size={36} color="#121826" />
          <FontAwesome name="close" size={32} color="#121826" onPress={() => setSignupmodal(false)} />
         <Text style={{color: 'black'}} >Sign up</Text>
        </View>
      </Modal>
      
      <Modal visible={Loginmodal}>
        <View style={styles.modalWrapper}>
        <FontAwesome name="close" size={32} color="#121826" onPress={() => SetLoginmodal(false)} />
          <Text style={{color: 'black'}} >Log in</Text>
        </View>
        
      </Modal>
      <ImageBackground source={require('../assets/Welcomepageimage.jpg')} resizeMode="cover" style={styles.image}>
      </ImageBackground>
        <View style={[styles.welcomewrapper, styles.boxShadow]}>
          <Image source={require('../assets/logos/simple.png')} style={styles.simplelogo} />
          <Text style={styles.welctxt} >Welcome to SplitWay</Text>
          <View>
            <Pressable style={[styles.button, styles.buttonup]} onPress={() => setSignupmodal(true)}>
              <Text style={[styles.text, styles.textup]}  >Sign up</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonin]} onPress={() => SetLoginmodal(true)}>
              <Text style={[styles.text, styles.textin]} >Log in</Text>
            </Pressable>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper:{
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: '#dfdde3',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    width: '80%',
  },
  buttonup:{
    backgroundColor: '#4823eb'
  },
  buttonin:{
    backgroundColor: '#FFF'
  },
  welctxt:{
    textAlign: 'center',
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  textup:{
    color: '#FFF'
  },
  textin:{
    color: '#121826'
  },
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },
  image: {
    flex: 3,
    height: '100%',
  },
  welcomewrapper:{
    flex: 2,
    backgroundColor:'#121826',
    width: '100%',
    margin: 5,
  },
  boxShadow: {
    shadowColor: "#121826",
    shadowOffset:{
      width: 0,
      height: -40
    },
    shadowOpacity: 0.9,
    shadowRadius: 40
  },
  simplelogo:{
    width: 190,
    height: 150,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
});
