import { Pressable, StyleSheet, Text, View, StatusBar, ActivityIndicator,TextInput, FlatList, Modal, Alert, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, updateDoc, doc, arrayRemove } from 'firebase/firestore';
import { Firebase_auth, Firebase_db } from '../firebase/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import Expenses from './Expenses';
import { SelectList } from 'react-native-dropdown-select-list'


export default function GroupItem({route, navigation}) {
  const { id } = route.params
  const auth = Firebase_auth;
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([])
  const [ussers, setUssers] = useState([])
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [NewMember, SetNewMember] = useState('')
  const [expensetitle, Setexpensetitle] = useState('')
  const [expenseamount, Setexpenseamount] = useState(0)
  const [Userswo, SetUserswo] = useState([])
  const [GroupName, SetGroupName] = useState('')
  const [Switchmethod, SetSwitchmethod] = useState('equally')
  const [successtrack, Setsuccesstrack] = useState(false)
  const [benefitforme, Setbenefitforme] = useState(0)
  const [openSwipeId, setOpenSwipeId] = useState(null); // Хранит ID открытого свайпа
  const swipeableRefs = useRef({}); // Рефы для свайпов
  const [MembersModal, setMembersModal] = useState(false)
  const [SettingsModal, setSettingsModal] = useState(false)
  const [addExpenseModal, setaddExpenseModal] = useState(false)
  const selectdata = [
    {key:'1', value:'Equally'},
    {key:'2', value:'Benefit'},
    {key:'3', value:'Coming soon...', disabled: true},
]
  
  useEffect(() =>{
    let libusers = []
    let libuserswo = []
    const FetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(Firebase_db, "groups")));
        querySnapshot.forEach((doc) => {
          const data = {
            docId: doc.id,
            name: doc.data().name,
            admin: doc.data().admin,
            members: doc.data().members,
            expenses: doc.data().expenses,
            currency: doc.data().currency
          }
          if (doc.id == id) {
            setData(data)
            setMembers(data.members)
            setExpenses(data.expenses)
            setLoading(false)
          }
          SetUserswo(libuserswo)
        })
        Object.values(members).map((member) => {
          if (member.email !== user.email) {
            libuserswo.push(member)
          }
        })
      } catch (error) {
        console.error("Error fetching data:", error);
        // Возможно, здесь нужно выполнить какие-то действия при возникновении ошибки
      }
    }
    
    const FetchUser = async() =>{
      try{
        const querySnapshot = await getDocs(collection(Firebase_db, "users"));
        querySnapshot.forEach((doc) => {
          libusers.push(doc.data())
        });
        setUssers(libusers)
      } catch (error) {
        console.error("Error fetching data:", error);
        // Возможно, здесь нужно выполнить какие-то действия при возникновении ошибки
      }
      }
    FetchUser()
    FetchData()
  }, [successtrack])
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
              Setsuccesstrack(true)     
          }
  })
    swipeableRefs.current[openSwipeId].close() // Закрываем свайп после удаления
  };

  const handleSwipeOpen = (id) => {
    if (openSwipeId && openSwipeId !== id) {
      swipeableRefs.current[openSwipeId].close(); // Закрываем предыдущий свайп
    }
    setOpenSwipeId(id);
  };
  const LeaveGroup = async() =>{
    members.map(async(mem) =>{
        if(mem.email == user.email){
            await updateDoc(doc(db, "groups", id), {
                members: arrayRemove({'email' : mem.email})
                })
        }
    })
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
        alert('Enter amount')
    }else if(Switchmethod == 'equally'){
        const expamountsbequall = expenseamount / members.length
        let userowe = []
        Object.values(Userswo).map((Userswoo) =>{
            userowe.push({'email' : Userswoo.email, 'amount' : expamountsbequall, 'to': expenseuser})
        })
        await updateDoc(doc(db, "groups", id), {
            expenses: arrayUnion({docId: expenseId,expensetitle, expenseamount, timestamp, userlent: {}, userowes: userowe, expenseuser, Switchmethod: 'equally'})
        })
        .then(() =>{
            Setsuccesstrack(true)
            document.querySelector('.add_expense_block').classList.add('hidden')
        })
    }else if(Switchmethod == 'benefit'){
        const expamountsbequall = (expenseamount - benefitforme) / (members.length - 1)
            let userowe = []
            Object.values(Userswo).map((Userswoo) =>{
                userowe.push({'email' : Userswoo.email, 'amount' : expamountsbequall, 'to': expenseuser})
            })
            await updateDoc(doc(db, "groups", id), {
                expenses: arrayUnion({docId: expenseId, expensetitle, expenseamount, timestamp, userlent: {}, userowes: userowe, expenseuser, Switchmethod: 'equally'})
            })
            .then(() =>{
                Setsuccesstrack(true)
                document.querySelector('.add_expense_block').classList.add('hidden')
            })
    }else{
        alert('eerr')
    }
  }
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Modal visible={MembersModal}>
  <View style={styles.memberWrapper}>
  <FontAwesome name="close" size={32} color="#f5f4f6" onPress={() => setMembersModal(false)} />
    <View style={styles.containermemb}>
    <Text style={styles.headerText}>Members:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : members.length !== 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.docId}
          renderItem={({ item }) => (
            <Pressable>
              <Text style={styles.memberText}>{item.email}</Text>
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.memberText}>You are alone in this group, add new member.</Text>
      )}
      <Pressable style={styles.buttonmem}>
        <Text style={[styles.text]}>Add member</Text>
      </Pressable>
      <Expenses expenses={expenses} data={data} />
    </View>  
    </View>
  </Modal>  

  <Modal visible={SettingsModal}>
  <View style={styles.memberWrapper}>
  <FontAwesome name="close" size={32} color="#f5f4f6" onPress={() => setSettingsModal(false)} />
       <Text style={{color: '#FFF'}}>Settings</Text>
       <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: 20}}>
        <TextInput style={styles.input} placeholder='Change group name'
          value={GroupName}
          onChangeText={(text) => SetGroupName(text)}
          ></TextInput>
          <Pressable style={styles.buttonsave} >
            <Text style={styles.text}>Save</Text>
          </Pressable>
       </View>
          { data.admin == user.uid ? (
            <Pressable style={styles.buttondelete} >
            <Text style={styles.text}>Delete Group</Text>
          </Pressable>
          ) : (
            <Pressable onPress={LeaveGroup} style={styles.buttondelete} >
            <Text style={styles.text}>Leave Group</Text>
          </Pressable>
          )

          }
          
    </View>
  </Modal>   
  <Modal visible={addExpenseModal}>
    <View style={styles.memberWrapper}>
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
          { loading ? <ActivityIndicator size={'large'}  />
          : <>
            <Pressable onPress={UpdateDataExpense} style={styles.button} >
              <Text style={styles.text}>Add expense</Text>
            </Pressable>
          </>  
        }
      </View>
  </Modal>
      <Text style={{fontWeight: 700, alignSelf: 'center', marginVertical: 10, color: '#FFF'}}>{data.name}</Text>
      <View style={styles.group_bar}>
        <Text style={{fontWeight: 500}}>Total amount: {totalamount()} {data.currency}</Text>
        <View style={styles.links}>
          <Pressable onPress={() => setMembersModal(true)}> 
            <FontAwesome name="users" size={38} style={{margin: 6}} color="#f5f4f6" />
          </Pressable>
          <Pressable onPress={() => setSettingsModal(true)}>
            <Ionicons name="settings-sharp" size={38} style={{margin: 6}} color="#f5f4f6" />
          </Pressable>
        </View>
      </View>
      <View style={styles.expenses_wrapper}>
        <Pressable onPress={() => setaddExpenseModal(true)} style={styles.button} >
          <Text style={styles.text}>Add expense</Text>
        </Pressable>
        {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.docId}
          renderItem={({ item }) => (
            <Swipeable
            ref={(ref) => swipeableRefs.current[item.docId] = ref} // Сохраняем реф для каждого свайпа
            renderRightActions={() => renderRightActions(item.docId)}
            onSwipeableOpen={() => handleSwipeOpen(item.docId)} // Обработчик открытия свайпа
              >
                <Pressable style={styles.expense}>
                  <Text>{item.timestamp}</Text>
                  <Text>{item.expensetitle}</Text>
                  <Text>{item.expenseuser}</Text>
                  <Text>{item.expenseamount} {data.currency}</Text>
              </Pressable>
            </Swipeable>
            
          )}
        />
      ) } 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826'
  },
  group_bar:{
    flexDirection: 'row',
    backgroundColor: '#54C3EA',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignContent: 'center',
    alignItems: 'center'
  },
  links:{
    flexDirection: 'row'
  },
  deleteswipe:{
    height: 80,
    width: 100,
    backgroundColor: 'red',
    marginTop: 16,
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
    backgroundColor: '#f5f4f6',
    marginTop: 8
  },
  buttonsave: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: '30%',
    alignSelf: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    backgroundColor: '#f5f4f6',
  },
  buttondelete:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
    marginTop: 8
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  expense:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 30,
    height: 80,
    marginTop: 16,
    backgroundColor: '#54C3EA'
  },
  memberWrapper:{
    backgroundColor: '#121826',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50
  },
  input:{
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '60%',
    alignSelf: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
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
    backgroundColor: '#f5f4f6',
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 10,
  },
  result: {
    fontSize: 16,
    color: '#333',
  },
  
});
