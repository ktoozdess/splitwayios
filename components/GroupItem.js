import { Pressable, StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity,TextInput, FlatList, Modal, Alert, Button } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, updateDoc, doc, arrayRemove, arrayUnion, deleteDoc } from 'firebase/firestore';
import { Firebase_auth, Firebase_db } from '../firebase/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import Expenses from './Expenses';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ExcludeUserDropdown from './ExcludeUserDropdown';
import { FontAwesome5 } from '@expo/vector-icons';
import AddMember from './AddMember';
import Animated, { FadeIn, FadeOut  } from 'react-native-reanimated';



export default function GroupItem({route, navigation}) {
  const { id } = route.params
  const auth = Firebase_auth;
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([])
  const [ussers, setUssers] = useState([])
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [expensetitle, Setexpensetitle] = useState('')
  const [expenseamount, Setexpenseamount] = useState(0)
  const [Userswo, SetUserswo] = useState([])
  const [GroupName, SetGroupName] = useState('')
  const [Switchmethod, SetSwitchmethod] = useState('Equally')
  const [successtrack, Setsuccesstrack] = useState(false)
  const [benefitforme, Setbenefitforme] = useState(0)
  const [openSwipeId, setOpenSwipeId] = useState(null); // Хранит ID открытого свайпа
  const swipeableRefs = useRef({}); // Рефы для свайпов
  const [MembersModal, setMembersModal] = useState(false)
  const [SettingsModal, setSettingsModal] = useState(false)
  const [addExpenseModal, setaddExpenseModal] = useState(false)
  const [excludedUsers, setExcludedUsers] = useState([]);
  const [AddMemberModal, setAddMemberModal] = useState(false)


  const selectdata = [
    {key:'1', value:'Equally'},
    {key:'2', value:'Benefit'},
    {key:'3', value:'Exclude'},
]
const event = new Date();
const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const timestamp = event.toLocaleDateString('en-EN', options)

const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(Firebase_db, "groups")));
    querySnapshot.forEach((doc) => {
      if (doc.id == id) {
        const data = {
          docId: doc.id,
          name: doc.data().name,
          admin: doc.data().admin,
          members: doc.data().members,
          expenses: doc.data().expenses,
          currency: doc.data().currency
        };
        setData(data);
        setMembers(data.members);
        setExpenses(data.expenses);
        const filteredUsers = data.members.filter(member => member.email !== user.email);
        SetUserswo(filteredUsers);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  setLoading(false);
};

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(Firebase_db, "users"));
    const users = querySnapshot.docs.map(doc => doc.data());
    setUssers(users);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {
  fetchData();
  fetchUsers();
}, [id]);

useFocusEffect(
  useCallback(() => {
    fetchData();
    fetchUsers();
  }, [id])
);

  var sum = 0;
  const totalamount = () =>{
  expenses.forEach(function(expense) {
      sum += parseInt(expense.expenseamount);
  });
  return sum
  }
  const deleteExpense = (expenseId) => {
    expenses.map(async(exp) =>{
      if(exp.docId == expenseId){
          await updateDoc(doc(Firebase_db, "groups", id), {
              expenses: arrayRemove(exp)
              })
              setExpenses(prevExpenses => prevExpenses.filter(exp => exp.docId !== expenseId));
              // if (openSwipeId === expenseId && swipeableRefs.current[expenseId]) {
              //   swipeableRefs.current[expenseId].close();
              // }  
          }
  })
    swipeableRefs.current[openSwipeId].close() // Закрываем свайп после удаления
  };

  const handleSwipeOpen = (id) => {
    if (openSwipeId && openSwipeId !== id && swipeableRefs.current[openSwipeId]) {
      swipeableRefs.current[openSwipeId].close(); // Закрываем предыдущий свайп
    }
    setOpenSwipeId(id);
  };
  const LeaveGroup = async() =>{
    members.map(async(mem) =>{
        if(mem.email == user.email){
            await updateDoc(doc(Firebase_db, "groups", id), {
                members: arrayRemove({'email' : mem.email})
                })
        }
    })
    navigation.navigate('Home')
}

const deleteGroup = async() =>{
  await deleteDoc(doc(Firebase_db, "groups", id));
  navigation.navigate('Home')
}

  const renderRightActions = (expenseId) => (
    <View style={styles.rightAction}>
      <Pressable onPress={() => deleteExpense(expenseId)} style={styles.deleteswipe}>
        <MaterialIcons name="delete" size={42} color="white" />
      </Pressable>
    </View>
  );
  const UpdateDataExpense = async() =>{
    const expenseuser = user.email
    const expenseId = uuidv4()

    if(expensetitle == ''){
        Alert.alert('Enter title')
    }else if(expenseamount == 0){
        Alert.alert('Enter amount')
    }else if(Switchmethod == 'Equally' && Userswo != []){
        const expamountsbequall = expenseamount / members.length
        let userowe = []
        Object.values(Userswo).map((Userswoo) =>{
            userowe.push({'email' : Userswoo.email, 'amount' : expamountsbequall, 'to': expenseuser})
        })
        await updateDoc(doc(Firebase_db, "groups", id), {
            expenses: arrayUnion({docId: expenseId,expensetitle, expenseamount, timestamp, userlent: {}, userowes: userowe, expenseuser, Switchmethod: 'Equally'})
        })
        .then(() =>{
          setExpenses(prevExpenses => [...prevExpenses, {
            docId: expenseId,
            expensetitle,
            expenseamount,
            timestamp,
            userlent: {},
            userowes: userowe,
            expenseuser,
            Switchmethod
          }]);
          Setexpensetitle('');
          Setexpenseamount(0);
          SetSwitchmethod('Equally');
          setaddExpenseModal(false)
        })
    }else if(Switchmethod == 'Benefit'){
        const expamountsbequall = (expenseamount - benefitforme) / (members.length - 1)
            let userowe = []
            Object.values(Userswo).map((Userswoo) =>{
                userowe.push({'email' : Userswoo.email, 'amount' : expamountsbequall, 'to': expenseuser})
            })
            await updateDoc(doc(Firebase_db, "groups", id), {
                expenses: arrayUnion({docId: expenseId, expensetitle, expenseamount, timestamp, userlent: {}, userowes: userowe, expenseuser, Switchmethod: 'Benefit'})
            })
            .then(() =>{
              setExpenses(prevExpenses => [...prevExpenses, {
                docId: expenseId,
                expensetitle,
                expenseamount,
                timestamp,
                userlent: {},
                userowes: userowe,
                expenseuser,
                Switchmethod
              }]);
              Setexpensetitle('');
              Setexpenseamount(0);
              SetSwitchmethod('Equally');
              setaddExpenseModal(false)
            })
    }else if(Switchmethod == 'Exclude'){
      let userowe = [];
    const expAmountPerUser = (expenseamount - benefitforme) / (members.length - excludedUsers.length);

    // Создайте список должников, исключая исключенных пользователей
    Object.values(Userswo).forEach((Userswoo) => {
      if (!excludedUsers.includes(Userswoo.email)) {
        userowe.push({ email: Userswoo.email, amount: expAmountPerUser, to: expenseuser });
      }
    });

    await updateDoc(doc(Firebase_db, "groups", id), {
      expenses: arrayUnion({
        docId: expenseId,
        expensetitle,
        expenseamount,
        timestamp,
        userlent: {},
        userowes: userowe,
        expenseuser,
        Switchmethod: 'Exclude'
      })
    })
    .then(() => {
      setExpenses(prevExpenses => [...prevExpenses, {
        docId: expenseId,
        expensetitle,
        expenseamount,
        timestamp,
        userlent: {},
        userowes: userowe,
        expenseuser,
        Switchmethod
      }]);
      Setexpensetitle('');
      Setexpenseamount(0);
      SetSwitchmethod('Equally');
      setaddExpenseModal(false)
    })
    }else{
        Alert.alert('eerr')
    }
  }
  const updateMembers = (newMember) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers, newMember];
      setData((prevData) => ({ ...prevData, members: updatedMembers }));
      return updatedMembers;
    });
  };
  
  const openbenefitopt = () =>{
    if (Switchmethod == 'Benefit'){
        return(
          <View style={styles.benefitContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Me</Text>
            <TextInput
              style={styles.input}
              value={benefitforme}
              onChangeText={(text) => Setbenefitforme(text)}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
            <Text style={styles.label}>/ {expenseamount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Each</Text>
            <Text style={styles.result}>
              {(expenseamount - benefitforme) / (members.length - 1)} / {expenseamount}
            </Text>
          </View>
        </View>
        )
    }
}
const openexcludeopt = () =>{
  if (Switchmethod == 'Exclude'){
      return(
        <ExcludeUserDropdown
        members={members}
        excludedUsers={excludedUsers} 
        setExcludedUsers={setExcludedUsers} 
      />
      )
  }
}
const updateGroupName = async () => {
  if (GroupName !== '') {
    await updateDoc(doc(Firebase_db, "groups", id), {
      name: GroupName
    }).then(() => {
      setSettingsModal(false);
      // Обновление состояния группы после успешного изменения имени
      setData(prevData => ({ ...prevData, name: GroupName }));
    })
  }
}
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Modal visible={MembersModal}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.memberWrapper}>
  <FontAwesome name="close" size={32} color="#f5f4f6" onPress={() => setMembersModal(false)} />
    <View style={styles.containermemb}>
    <Text style={styles.headerText}>Members:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : members.length !== 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.email} 
          renderItem={({ item }) => (
            <Pressable key={item.email}>
              {item.email == data.admin ? (
                <View style={{flexDirection: 'row'}}><MaterialIcons name="fiber-manual-record" size={20} color="#F76806" /><Text style={styles.memberText}>{item.email}</Text></View>) : 
                (<View style={{flexDirection: 'row'}}><MaterialIcons name="fiber-manual-record" size={20} color="#54C3EA" /><Text style={styles.memberText}>{item.email}</Text></View>)}
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.memberText}>You are alone in this group, add new member.</Text>
      )}
        <Pressable 
          onPress={() => {
            navigation.navigate('AddMember', { members: members, id: id, ussers: ussers, updateMembers: updateMembers });
            setMembersModal(false); // Закрываем модальное окно
          }} 
          style={styles.buttonmem}
        >
          <Text style={[styles.text]}>Add member</Text>
      </Pressable>
      <Expenses expenses={expenses} data={data} />
    </View>  

    </Animated.View>
  </Modal>  

  <Modal visible={SettingsModal}>
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.memberWrapper}>
  <FontAwesome name="close" size={32} color="#f5f4f6" onPress={() => setSettingsModal(false)} />
  <Text style={[styles.title, {marginVertical: 10}]}>Settings</Text>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder='Change group name'
      value={GroupName}
      onChangeText={(text) => SetGroupName(text)}
    />
    <Pressable onPress={updateGroupName} style={styles.buttonsave}>
      <Text style={styles.text}>Save</Text>
    </Pressable>
  </View>
  { data.admin == user.uid ? (
    <Pressable onPress={deleteGroup} style={styles.buttondelete}>
      <Text style={styles.text}>Delete Group</Text>
    </Pressable>
  ) : (
    <Pressable onPress={LeaveGroup} style={styles.leaveButton}>
      <Text style={styles.text}>Leave Group</Text>
    </Pressable>
  )}
</Animated.View>

  </Modal>   
  <Modal visible={addExpenseModal}>
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.memberWrapper}>
      <FontAwesome name="close" size={32} color="#f5f4f6" onPress={() => setaddExpenseModal(false)} />
          <Text>Add new expense</Text>
          <TextInput style={styles.inputexpense} placeholder='Title of expense'
          value={expensetitle}
          onChangeText={(text) => Setexpensetitle(text)}
          ></TextInput>
          <TextInput style={styles.inputexpense} placeholder='Amount of expense'
          value={expenseamount}
          onChangeText={(text) => Setexpenseamount(text)}
          ></TextInput>
          <SelectList 
              setSelected={(val) => SetSwitchmethod(val)} 
              data={selectdata} 
              save="value"
              boxStyles={{backgroundColor: '#FFF', width: '80%', alignSelf: 'center', marginTop: 10}}
              dropdownStyles={{backgroundColor: '#FFF', width: '80%', alignSelf: 'center'}}
              placeholder='Select split method'
              search={false}
          />
          {openbenefitopt()}
          {openexcludeopt()}
          { loading ? <ActivityIndicator size={'large'}  />
          : <>
            <Pressable onPress={UpdateDataExpense} style={styles.button} >
              <Text style={styles.text}>Add expense</Text>
            </Pressable>
          </>  
        }
      </Animated.View>
  </Modal>
      <View style={styles.expenses_wrapper}>
        {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.name}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => navigation.navigate('VotePage', { id: id })}>
                <FontAwesome5 name="vote-yea" style={{margin: 6}} size={30} color="#f5f4f6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMembersModal(true)}>
                <FontAwesome name="users" size={30} style={{margin: 6}} color="#f5f4f6" />
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => setSettingsModal(true)}>
                <Ionicons name="settings-sharp" size={30} style={{margin: 6}} color="#f5f4f6" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.docId}
            renderItem={({ item }) => (
              <Swipeable
                ref={(ref) => {
                  swipeableRefs.current[item.docId] = ref;
                }}
                renderRightActions={() => renderRightActions(item.docId)}
                onSwipeableOpen={() => handleSwipeOpen(item.docId)}
              >
                <Pressable onPress={() => navigation.navigate('ExpenseView', { item: item })} style={styles.expenseItem}>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseTitle}>{item.expensetitle}</Text>
                    <Text style={styles.expenseAmount}>{data.currency} {item.expenseamount}</Text>
                  </View>
                  <View style={styles.expenseMeta}>
                    <Text style={styles.expenseUser}>{item.expenseuser}</Text>
                    <Text style={styles.expenseTimestamp}>{item.timestamp}</Text>
                  </View>
                </Pressable>
              </Swipeable>
            )}
          />
         
        </Animated.View>
      ) } 
      </View>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.content}>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={() => setaddExpenseModal(true)}>
              <Ionicons name="add-circle" size={48} color="white" />
            </TouchableOpacity>
            <Text style={styles.totalAmount}>Total: {data.currency} {totalamount()}</Text>
          </View>
        </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
    justifyContent: 'space-between',
    paddingHorizontal: 18
  },
  links:{
    flexDirection: 'row'
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  expenses_wrapper:{
    flexDirection: 'column',
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteswipe:{
    height: 86,
    width: 120,
    backgroundColor: 'red',
    marginTop: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent:'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#54C3EA',
    marginTop: 8
  },
  buttonsave: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: '30%',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 3,
    backgroundColor: '#54C3EA',
  },
  buttondelete:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  expenseItem: {
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#00A3FF',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF4500',
  },
  expenseMeta: {
    marginTop: 10,
  },
  expenseUser: {
    fontSize: 14,
    color: '#FFF',
  },
  expenseTimestamp: {
    fontSize: 12,
    color: '#AAA',
  },
  memberWrapper:{
    backgroundColor: '#121826',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50
  },
  containermemb: {
    padding: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 10,
  },
  memberText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  buttonmem:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '60%',
    alignSelf: 'flex-start',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#54C3EA',
    marginTop: 8
  },
  inputexpense:{
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: 3
  },
  benefitContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 10,
  },
  result: {
    fontSize: 16,
    color: '#333',
  },
  
});

