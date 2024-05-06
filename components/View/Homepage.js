import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, SafeAreaView, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { Firebase_auth, Firebase_db } from '../../firebase/config';
import Footer from '../Footer';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function Homepage({navigation}) {
    const [data, setData] = useState([])
    const [usser, setUsser] = useState([])
    const [loading, setLoading] = useState(true);
    const auth = Firebase_auth;
      const FetchUser = async() =>{
        const querySnapshot = await getDocs(collection(Firebase_db, "users"));
        querySnapshot.forEach((doc) => {
          if (doc.id == auth.currentUser.uid){
            setUsser(doc.data())
          }
        });
      }
      useEffect(() => {
        FetchUser();
      }, []);

      useEffect(() => {
        if (usser) {
          FetchData();
        }
      }, [usser]);
    
    const FetchData = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(query(collection(Firebase_db, "groups")));
      const tempData = [];
      querySnapshot.forEach((doc) => {
        const datas = {
          docId: doc.id,
          name: doc.data().name,
          admin: doc.data().admin,
          members: doc.data().members
        }
        const usserEmail = usser && usser.email ? usser.email.toLowerCase() : '';
        const leng = datas.members.filter((member) => member.email && member.email.toLowerCase() === usserEmail).length;
        if (leng !== 0) {
          tempData.push(datas);
        }
      }); 
      setData(tempData);
      setLoading(false);
    }
    const toaddgroup = () =>{
      navigation.navigate('Creategroup')
    }
    useFocusEffect(
      useCallback(() => {
        if (usser) {
          FetchData();
        }
      }, [usser])
    );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Text onPress={() => navigation.navigate('GroupPaymentsScreen')}>nnn</Text>
        <View style={styles.ListGroups}>
        
      {loading ? (
  <ActivityIndicator size="large" color="#ffffff" />
) : data.length !== 0 ? (
  <FlatList
    data={data}
    keyExtractor={item => item.docId}
    renderItem={({ item }) => (
      <Pressable style={styles.GroupItem} onPress={() => navigation.navigate('GroupItem', { id: item.docId })}>
        <Text>{item.name}</Text>
        <View>
          {Object.values(item.members).map((member, index) => (
            <View style={{ flexDirection: 'row' }} key={index}>
              <MaterialIcons name="fiber-manual-record" size={20} color="black" /><Text>{member.email}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    )}
  />
) : (
  <Text style={{ color: '#FFF' }}>You are not a member of any group, create a group</Text>
)}

        </View>

        <Footer navigation={navigation} toaddgroup={toaddgroup}/>
    </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826'
  },
  ListGroups:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  GroupItem:{
    width: 300,
    height: 240,
    paddingHorizontal: 18,
    margin: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54C3EA',
    borderRadius: 30,
  },

});
