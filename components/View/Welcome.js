import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, Button, Pressable, Modal, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
// import auth from '@react-native-firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import {Firebase_auth, Firebase_db} from '../../firebase/config.js'
import { TextInput } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Welcome() {
  const [Signupmodal, setSignupmodal] = useState(false)
  const [Loginmodal, SetLoginmodal] = useState(false)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loading,setLoading] = useState(false)
  const auth = Firebase_auth;
  
  const signin = async()=>{
    setLoading(true)
    try{
      const response = await signInWithEmailAndPassword(auth, email, password1)
      console.log('====================================');
      console.log('success');
      console.log('====================================');
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false)
    }
  }
  const signup = async()=>{
    setLoading(true)
    if(password1 == password2){
      createUserWithEmailAndPassword(auth, email, password1)
      .then(async() =>{
        try{
          await setDoc(doc(Firebase_db, "users", auth.currentUser.uid), {
            id: auth.currentUser.uid,
            email: email,
            username: username,
            profilePhoto: 'https://i.pinimg.com/736x/c9/e3/e8/c9e3e810a8066b885ca4e882460785fa.jpg',
        });
        updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: 'https://i.pinimg.com/736x/c9/e3/e8/c9e3e810a8066b885ca4e882460785fa.jpg'
        }).then(() => {
            console.log("Profile updated!");
        }).catch((error) => {
    // An error occurred
    });
        }catch(error){
          console.log(error);
        }finally{
          setLoading(false)
        }
      })
      
    }else{
      Alert.alert('Please enter correctly two passwords fields')
      setLoading(false)
    }
    
  }
  return (
    <View style={styles.container}>

      <Modal visible={Signupmodal}>
        <View style={styles.modalWrapper}>
        <KeyboardAvoidingView behavior='padding'>
        <FontAwesome name="close" size={32} color="#FFF" onPress={() => setSignupmodal(false)} />
         <Text style={{color: 'white'}} >Sign up</Text>

         <TextInput style={styles.input} placeholder='Username'
          value={username}
          onChangeText={(text) => setUsername(text)}
          ></TextInput>
            
         <TextInput style={styles.input} placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          ></TextInput>
          <TextInput style={styles.input} placeholder='Password'
          value={password1}
          secureTextEntry={true}
          onChangeText={(text) => setPassword1(text)}
          ></TextInput>
          <TextInput style={styles.input} placeholder='Password again'
          value={password2}
          secureTextEntry={true}
          onChangeText={(text) => setPassword2(text)}
          ></TextInput>
          { loading ? <ActivityIndicator size={'large'}  />
          : <>
            <Button title='Sign up' onPress={signup}/>
          </>  
        }
          </KeyboardAvoidingView>
        </View>
      </Modal>
      
      <Modal visible={Loginmodal}>
        <View style={styles.modalWrapper}>
          <KeyboardAvoidingView behavior='padding'>
        <FontAwesome name="close" size={32} color="#FFF" onPress={() => SetLoginmodal(false)} />
          <Text style={{color: 'white'}} >Log in</Text>

          <TextInput style={styles.input} placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          ></TextInput>
          <TextInput style={styles.input} placeholder='Password'
          value={password1}
          secureTextEntry={true}
          onChangeText={(text) => setPassword1(text)}
          ></TextInput>
          { loading ? <ActivityIndicator size={'large'}  />
          : <>
            <Button title='Log in' onPress={signin}/>
          </>  
        }
        </KeyboardAvoidingView>
        </View>
        
      </Modal>
      <ImageBackground source={require('../../assets/Welcomepageimage.jpg')} resizeMode="cover" style={styles.image}>
      </ImageBackground>
        <View style={[styles.welcomewrapper, styles.boxShadow]}>
          <Image source={require('../../assets/logos/simple.png')} style={styles.simplelogo} />
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
    backgroundColor: '#121826',
  },
  input:{
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '80%',
    alignSelf: 'center',
    margin: 6,
    borderRadius: 20
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
