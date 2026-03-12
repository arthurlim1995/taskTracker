import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskEmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.title}>No tasks found</Text>
      <Text style={styles.subtitle}>Create your first task</Text>
    </View>
  );
};

export default TaskEmptyState;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignItems: 'center',
  },

  icon: {
    fontSize: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },

  subtitle: {
    color: '#9CA3AF',
  },
});
