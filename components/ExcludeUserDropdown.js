import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ExcludeUserDropdown = ({ members, excludedUsers, setExcludedUsers }) => {
  const toggleExclusion = (email) => {
    if (excludedUsers.includes(email)) {
      setExcludedUsers(excludedUsers.filter((user) => user !== email));
    } else {
      setExcludedUsers([...excludedUsers, email]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exclude user:</Text>
      <View style={styles.dropdown}>
        {members.map((member, index) => (
          <Pressable
            key={index}
            style={[
              styles.option,
              excludedUsers.includes(member.email) && styles.selectedOption,
            ]}
            onPress={() => toggleExclusion(member.email)}
          >
            <Text style={styles.optionText}>{member.email}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  option: {
    backgroundColor: '#54C3EA',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExcludeUserDropdown;
