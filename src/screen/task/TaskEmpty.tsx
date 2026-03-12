import { PackageOpen } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskEmptyState = () => {
  return (
    <View style={styles.container}>
      <PackageOpen size={40} />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  subtitle: {
    color: '#9CA3AF',
  },
});
