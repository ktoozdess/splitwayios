import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, Button, Pressable, Modal, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { setDoc, doc } from 'firebase/firestore';
import { Firebase_auth, Firebase_db } from '../../firebase/config.js';
import { TextInput } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Welcome() {
  const [Signupmodal, setSignupmodal] = useState(false);
  const [Loginmodal, SetLoginmodal] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = Firebase_auth;

  
  const signin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password1);
      console.log('Success');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setLoading(true);
    if (password1 === password2) {
      try {
        await createUserWithEmailAndPassword(auth, email, password1);
        await setDoc(doc(Firebase_db, "users", auth.currentUser.uid), {
          id: auth.currentUser.uid,
          email: email,
          username: username,
          profilePhoto: 'https://i.pinimg.com/736x/c9/e3/e8/c9e3e810a8066b885ca4e882460785fa.jpg',
        });
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: 'https://i.pinimg.com/736x/c9/e3/e8/c9e3e810a8066b885ca4e882460785fa.jpg'
        });
        console.log("Profile updated!");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Please enter correctly two passwords fields');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={Signupmodal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <FontAwesome name="close" size={32} color="#FFF" style={styles.closeButton} onPress={() => setSignupmodal(false)} />
            <KeyboardAvoidingView behavior='padding'>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' }}>Sign up</Text>
              <TextInput style={styles.input} placeholder='Username' value={username} onChangeText={(text) => setUsername(text)} placeholderTextColor="#888" />
              <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} placeholderTextColor="#888" />
              <TextInput style={styles.input} placeholder='Password' value={password1} secureTextEntry={true} onChangeText={(text) => setPassword1(text)} placeholderTextColor="#888" />
              <TextInput style={styles.input} placeholder='Password again' value={password2} secureTextEntry={true} onChangeText={(text) => setPassword2(text)} placeholderTextColor="#888" />
              {loading ? <ActivityIndicator size={'large'} color="#fff" /> : <Pressable style={styles.modalButton} onPress={signup}><Text style={styles.modalButtonText}>Sign up</Text></Pressable>}
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
      
      <Modal visible={Loginmodal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <FontAwesome name="close" size={32} color="#FFF" style={styles.closeButton} onPress={() => SetLoginmodal(false)} />
            <KeyboardAvoidingView behavior='padding'>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' }}>Log in</Text>
              <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} placeholderTextColor="#888" />
              <TextInput style={styles.input} placeholder='Password' value={password1} secureTextEntry={true} onChangeText={(text) => setPassword1(text)} placeholderTextColor="#888" />
              {loading ? <ActivityIndicator size={'large'} color="#fff" /> : <Pressable style={styles.modalButton} onPress={signin}><Text style={styles.modalButtonText}>Log in</Text></Pressable>}
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      <ImageBackground source={require('../../assets/Welcomepageimage.jpg')} resizeMode="cover" style={styles.image} />
      <View style={[styles.welcomewrapper, styles.boxShadow]}>
        <Image source={require('../../assets/logos/simple.png')} style={styles.simplelogo} />
        <Text style={styles.welctxt}>Welcome to SplitWay</Text>
        <View>
          <Pressable style={[styles.button, styles.buttonup]} onPress={() => setSignupmodal(true)}>
            <Text style={[styles.text, styles.textup]}>Sign up</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonin]} onPress={() => SetLoginmodal(true)}>
            <Text style={[styles.text, styles.textin]}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '80%',
    backgroundColor: '#121826',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  input: {
    backgroundColor: '#3b3f45',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 8,
    borderRadius: 12,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#4823eb',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  buttonup: {
    backgroundColor: '#4823eb',
  },
  buttonin: {
    backgroundColor: '#FFF',
  },
  welctxt: {
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
  textup: {
    color: '#FFF',
  },
  textin: {
    color: '#121826',
  },
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },
  image: {
    flex: 3,
    height: '100%',
  },
  welcomewrapper: {
    flex: 2,
    backgroundColor: '#121826',
    width: '100%',
    margin: 5,
  },
  boxShadow: {
    shadowColor: "#121826",
    shadowOffset: {
      width: 0,
      height: -40,
    },
    shadowOpacity: 0.9,
    shadowRadius: 40,
  },
  simplelogo: {
    width: 190,
    height: 150,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
