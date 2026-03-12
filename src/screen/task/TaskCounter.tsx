import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../../interface/Task.interface';

interface Props {
  tasks: Task[];
}

const TaskCounter = ({ tasks }: Props) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const progress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.number}>{total}</Text>
        <Text style={styles.label}>All</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>{pending}</Text>
        <Text style={styles.label}>Pending</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>{progress}</Text>
        <Text style={styles.label}>Progress</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>{completed}</Text>
        <Text style={styles.label}>Done</Text>
      </View>
    </View>
  );
};

export default TaskCounter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    width: '23%',
    alignItems: 'center',
  },

  number: {
    fontWeight: '700',
    fontSize: 16,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
  },
});
