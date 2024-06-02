import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, SafeAreaView, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { Firebase_auth, Firebase_db } from '../../firebase/config';
import Footer from '../Footer';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import VotePage from './VotePage';
import Animated, {FadeInUp} from 'react-native-reanimated';


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
    <Text style={styles.title}>SplitWay</Text>
  <StatusBar barStyle="light-content" />
  <View style={styles.ListGroups}>
    {loading ? (
      <ActivityIndicator size="large" color="#ffffff" />
    ) : data.length !== 0 ? (
      <FlatList
        data={data}
        keyExtractor={item => item.docId}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInUp} style={styles.GroupItem} >
            <Pressable onPress={() => navigation.navigate('GroupItem', { id: item.docId })}> 
              <Text style={styles.groupName}>{item.name}</Text>
              <View style={styles.membersContainer}>
                {Object.values(item.members).map((member, index) => (
                  <View style={styles.member} key={index}>
                    <MaterialIcons name="fiber-manual-record" size={16} color="#f5f4f6" />
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
            
          </Animated.View>
        )}
      />
    ) : (
      <Text style={styles.noGroupText}>You are not a member of any group. Create a group.</Text>
    )}  
    </View>
  <Footer navigation={navigation} toaddgroup={toaddgroup} />

</SafeAreaView>

      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
  },
  ListGroups: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  GroupItem: {
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 10,
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  memberEmail: {
    marginLeft: 5,
    color: '#AAA'
  },
  noGroupText: {
    color: '#FFF',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    paddingHorizontal: 20,
  },
});
