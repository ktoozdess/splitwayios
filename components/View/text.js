import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

const HomePage = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const backgroundColorInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#bde4ff', '#ffec99'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolate }]}>
      <View style={styles.card}>
        <Text style={styles.groupTitle}>Название группы</Text>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountLabel}>Total Amount:</Text>
          <Text style={styles.totalAmountValue}>$1000</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToMembers()}>
            <Text style={styles.actionButtonText}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToSettings()}>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expenses</Text>
        {/* Здесь можно добавить компоненты для отображения списка расходов */}
        <TouchableOpacity style={styles.addButton} onPress={() => addExpense()}>
          <Text style={styles.addButtonLabel}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalAmountLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#888',
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
