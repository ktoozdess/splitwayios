import { StyleSheet, StatusBar, Text, View, TextInput, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { collection, addDoc, arrayUnion } from 'firebase/firestore';
import { Firebase_db, Firebase_auth } from '../../firebase/config';
import Footer from '../Footer';
import { SelectList } from 'react-native-dropdown-select-list'


export default function Creategroup({navigation}) {
    const auth = Firebase_auth;
    const user = auth.currentUser;
    const [Groupname, setGroupname] = useState('')
    const [Switchcurrency, SetSwitchcurrency] = useState('USD')
    const [loading,setLoading] = useState(false)
    const selectdata = [
      {key:'1', value:'USD'},
      {key:'2', value:'EUR'},
      {key:'3', value:'RUB'},
  ]
    const creategrouphandle = async () =>{
      setLoading(true)
        try {
            const docRef = await addDoc(collection(Firebase_db, "groups"), {
                name: Groupname,
                admin: user.uid,
                members: arrayUnion({'email' : user.email, 'id' : user.uid}),
                expenses: [],
                currency: Switchcurrency,
            });
              
            } catch (e) {
            console.error("Error adding document: ", e);
            }finally{
              setLoading(false)
              navigation.navigate('Home')
            }
    }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
        <Text style={{color: 'white'}}>create group</Text>
        <View style={styles.options}>
        <TextInput style={styles.input} placeholder='Group name'
          value={Groupname}
          onChangeText={(text) => setGroupname(text)}
          ></TextInput>
            <SelectList 
              setSelected={(val) => SetSwitchcurrency(val)} 
              data={selectdata} 
              save="value"
              boxStyles={{backgroundColor: '#FFF', width: '60%', alignSelf: 'center', marginTop: 10}}
              dropdownStyles={{backgroundColor: '#FFF', width: '60%', alignSelf: 'center'}}
              placeholder='Set currency'
              search={false}
          />
          { loading ? <ActivityIndicator size={'large'}  />
          : <>
            <Button title='Create group' onPress={creategrouphandle}/>
          </>  
        }
        </View>
        <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826'
  },
  options:{
    marginTop: 20
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
  
});
