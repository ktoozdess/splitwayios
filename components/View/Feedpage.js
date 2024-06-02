import { StyleSheet, Text, View, StatusBar, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Firebase_auth, Firebase_db } from '../../firebase/config';
import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import Footer from '../Footer';

export default function Feedpage({navigation}) {
  const auth = Firebase_auth;
  const user = auth.currentUser;
  const feedlogo = auth.currentUser.photoURL;
  const [usser, setUsser] = useState([]);

  useEffect(() => {
    const FetchUser = async() => {
      const querySnapshot = await getDocs(collection(Firebase_db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.id === auth.currentUser.uid) {
          setUsser(doc.data());
        }
      });
    };
    FetchUser();
  }, []);

  const logout = async () => {
    try {
      await Firebase_auth.signOut();
      navigation.navigate('Main');  // Adjust this line to navigate to your desired screen after logout
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={styles.main_info}>
        <Image style={styles.profilelogo} source={{uri: `${feedlogo}`}}/>
        <Text style={{color: '#FFF'}}>{usser.name} {usser.surname}</Text>
        <Text style={{color: '#FFF'}}>{usser.username}</Text>
        <Text style={{color: '#FFF'}}>{usser.email}</Text>
      </View>
      <Pressable onPress={logout} style={styles.button} >
        <Text style={styles.text}>Logout</Text>
      </Pressable>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },
  profilelogo:{
    width: 120,
    height: 120,
    borderRadius: 90,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '40%',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#f5f4f6',
    marginTop: 18
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  headeropt:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 10
  },
  main_info:{
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 60
  },
});
