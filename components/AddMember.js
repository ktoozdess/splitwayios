import React, { useState } from 'react';
import { Pressable, StyleSheet,View,  Text, TextInput, SafeAreaView, Alert } from 'react-native';
import { setDoc, doc, arrayUnion } from 'firebase/firestore';
import { Firebase_db } from '../firebase/config';
import { FontAwesome } from '@expo/vector-icons';

export default function AddMember({route, navigation }) {
  const [NewMember, SetNewMember] = useState('');
  const { id } = route.params
  const { ussers } = route.params
  const { members } = route.params
  const { updateMembers } = route.params;

  const UpdateData = async () => {
    const result = ussers.filter((user) => user.email.toLowerCase() === NewMember.toLowerCase());
    const tested = members.filter((user) => user.email.toLowerCase() === NewMember.toLowerCase());

    if (result.length === 1 && tested.length === 0) {
      await setDoc(doc(Firebase_db, "groups", id), {
        members: arrayUnion({ 'email': NewMember })
      }, { merge: true })
        .then(() => {
          SetNewMember('');
          updateMembers({ email: NewMember });
          navigation.goBack()
        });

    } else {
      Alert.alert('User not found or you want add user which already in this group');
      SetNewMember('');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
         <View style={styles.memberWrapper}>
         <Pressable onPress={() => navigation.goBack()}>
        <FontAwesome name="close" size={32} color="#f5f4f6" />
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder='Enter member`s email'
        value={NewMember}
        onChangeText={(text) => SetNewMember(text)}
      />
      <Pressable onPress={UpdateData} style={styles.buttonsave}>
        <Text style={styles.text}>Add member</Text>
      </Pressable>
         </View>
     
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },
  memberWrapper:{
    backgroundColor: '#121826',
    paddingHorizontal: 30,
    
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 16,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center'
  },
  buttonsave: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: '50%',
    borderRadius: 5,
    elevation: 3,
    backgroundColor: '#54C3EA',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
