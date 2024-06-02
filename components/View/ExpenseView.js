import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


export default function ExpenseView({ route, navigation }) {
    const { item } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Pressable style={{marginVertical: 16}} onPress={() => navigation.goBack()}>
                <FontAwesome name="close" size={32} color="#f5f4f6" />
            </Pressable>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Expense Details</Text>
                    <Text style={styles.detail}>
                        <Text style={styles.boldText}>Title:</Text> {item.expensetitle}
                    </Text>
                    <Text style={styles.detail}>
                        <Text style={styles.boldText}>Split method:</Text> {item.Switchmethod}
                    </Text>
                    <Text style={styles.detail}>
                        <Text style={styles.boldText}>Amount:</Text> {item.expenseamount}
                    </Text>
                    <Text style={styles.detail}>
                        <Text style={styles.boldText}>Payment user:</Text> {item.expenseuser}
                    </Text>
                    <Text style={styles.detail}>
                        <Text style={styles.boldText}>Date:</Text> {item.timestamp}
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Debts</Text>
                    {item.userowes.map((exp, index) => (
                        <View style={styles.owe} key={index}>
                            <Text style={{color: '#dfdde3'}}>
                                <Text style={styles.boldText}>{exp.email}</Text> owes {exp.amount} to{' '}
                                <Text style={styles.boldText}>{exp.to}</Text>
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: '#121826',
    },
    header: {
        paddingBottom: 20,
    },
    backLink: {
        color: '#007BFF',
        fontSize: 16,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#dfdde3'
    },
    detail: {
        marginBottom: 5,
        fontSize: 16,
        color: '#dfdde3'
    },
    boldText: {
        fontWeight: 'bold',
        color: '#dfdde3'
    },
    owe: {
        marginBottom: 5,
        fontSize: 16,
        
    },
});
