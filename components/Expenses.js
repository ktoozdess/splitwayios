import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";


export default function Expenses({expenses, data}) {

    const [expense, setExpense] = useState([])
    const auth = getAuth();
    let tempData = [];
    useEffect(() =>{
        let libexpense = []
        Object.values(expenses).map((expense) =>{
            Object.values(expense.userowes).map((expens) =>{
                libexpense.push(expens)
            })
            libexpense.sort((a, b) => a.email.localeCompare(b.email))
            setExpense(libexpense)
        })
    },[data])
        const rendersumexpenses = () =>{
            tempData = expense.filter((item)=>item.to == auth.currentUser.email)
                let sumexpenses = [];
            let result  = tempData.reduce((prev, item) => {
                if (item.email in prev){
                    prev[item.email] += item.amount
                }else{
                    prev[item.email] = item.amount
                }
                return prev
            }, {})

            Object.keys(result).forEach(item => {

                sumexpenses.push({'email' : item, 'amount' : result[item]})

            });
            if(tempData.length !== 0){
                return(
                    <View style={styles.expenseWrapper}>
                    <Text style={styles.headerText}>Users who owe me:</Text>
                    <FlatList
                        data={sumexpenses}
                        keyExtractor={item => item.docId}
                        renderItem={({ item }) => (
                            <Text style={styles.expenseText}>{item.email} {Math.round(item.amount * 10) / 10} {data.currency}</Text>
                        )}
                    />
                    </View>
                    )
            }
        }

    return(
        <>
            {rendersumexpenses()}
        </>
    )
}
const styles = StyleSheet.create({
    expenseWrapper: {
      marginTop: 30,
      backgroundColor: "#f5f4f6",
      padding: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerText: {
      color: "#333",
      fontSize: 18,
      marginBottom: 10,
      fontWeight: "bold",
    },
    expenseText: {
      color: "#333",
      fontSize: 16,
      marginBottom: 5,
    },
  });
