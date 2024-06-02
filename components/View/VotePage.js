import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { collection, updateDoc, doc, arrayUnion, getDocs, query, getDoc, arrayRemove } from 'firebase/firestore';
import { Firebase_db } from '../../firebase/config'; // Подключите ваш Firebase конфиг
import { v4 as uuidv4 } from "uuid";

export default function VotePage({ route, navigation }) {
  const { id } = route.params;
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [options, setOptions] = useState('');
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(Firebase_db, "groups"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.id === id) {
            const fetchedData = doc.data().votes || [];
            setData(fetchedData);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const addVote = async () => {
    const voteId = uuidv4();

    if (expenseName && expenseAmount && options) {
      const newVote = {
        docId: voteId,
        expenseName,
        expenseAmount,
        options: options.split(",").map(option => option.trim()),
        vote: Array(options.split(",").length).fill(0)
      };

      await updateDoc(doc(Firebase_db, "groups", id), {
        votes: arrayUnion(newVote)
      });

      setData(prevData => [...prevData, newVote]); // Update local state immediately
      setExpenseName('');
      setExpenseAmount('');
      setOptions('');
    }
  };

  const voteForOption = async (expenseIndex, optionIndex) => {
    const updatedData = [...data];
    updatedData[expenseIndex].vote[optionIndex]++;
    setData(updatedData);
    
    const expenseRef = doc(Firebase_db, `groups/${id}`);
    const docSnap = await getDoc(expenseRef);
    if (docSnap.exists()) {
      const currentVotes = docSnap.data().votes || [];
      currentVotes[expenseIndex].vote[optionIndex] = updatedData[expenseIndex].vote[optionIndex];
      
      await updateDoc(expenseRef, {
        votes: currentVotes
      });
    }
  };

  const cancelVoteForOption = async (expenseIndex, optionIndex) => {
    const updatedData = [...data];
    updatedData[expenseIndex].vote[optionIndex]--;
    setData(updatedData);

    const expenseRef = doc(Firebase_db, `groups/${id}`);
    const docSnap = await getDoc(expenseRef);
    if (docSnap.exists()) {
      const currentVotes = docSnap.data().votes || [];
      currentVotes[expenseIndex].vote[optionIndex] = updatedData[expenseIndex].vote[optionIndex];
      
      await updateDoc(expenseRef, {
        votes: currentVotes
      });
    }
  };

  const deleteVote = async (vote) => {
    await updateDoc(doc(Firebase_db, "groups", id), {
      votes: arrayRemove(vote)
    });
    setData(data.filter(item => item.docId !== vote.docId)); // Update local state immediately
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote for Expenses</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense Name"
          value={expenseName}
          onChangeText={setExpenseName}
        />
        <TextInput
          style={styles.input}
          placeholder="Expense Amount"
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Options (comma-separated)"
          value={options}
          onChangeText={setOptions}
        />
        <TouchableOpacity style={styles.addButton} onPress={addVote}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.docId}
        renderItem={({ item, index: expenseIndex }) => (
          <Animated.View entering={FadeInUp} style={styles.expenseItem}>
            <Text style={styles.expenseName}>Expense Name: {item.expenseName}</Text>
            <Text style={styles.expenseAmount}>Expense Amount: {item.expenseAmount}</Text>
            <Text style={styles.optionsTitle}>Options:</Text>
            {Array.isArray(item.options) && item.options.map((option, optionIndex) => (
              <View key={optionIndex} style={styles.optionContainer}>
                <Text style={styles.optionText}>{option}</Text>
                <Text style={styles.voteText}>Votes: {item.vote[optionIndex]}</Text>
                <TouchableOpacity
                  style={styles.voteButton}
                  onPress={() => {
                    if (item.vote[optionIndex] > 0) {
                      cancelVoteForOption(expenseIndex, optionIndex);
                    } else {
                      voteForOption(expenseIndex, optionIndex);
                    }
                  }}
                >
                  <Text style={styles.voteButtonText}>{item.vote[optionIndex] > 0 ? 'Cancel Vote' : 'Vote'}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVote(item)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121826',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f5f4f6',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f4f6',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f5f4f6',
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseAmount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  voteText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  voteButton: {
    backgroundColor: '#54C3EA',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  voteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4c4c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
