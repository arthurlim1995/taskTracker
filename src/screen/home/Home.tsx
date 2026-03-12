import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import moment from 'moment';
import { useAppSelector } from '../../../hooks';
import { Task } from '../../interface/Task.interface';
import { STATUS } from '../../constants/Task.constants';

const HomePage = () => {
  const insets = useSafeAreaInsets();
  const taskData = useAppSelector(state => state.taskScreen.taskData);

  const stats = useMemo(() => {
    const total = taskData.length;
    const completed = taskData.filter(t => t.status === 'Completed').length;
    const progress = taskData.filter(t => t.status === 'In Progress').length;
    const pending = taskData.filter(t => t.status === 'Pending').length;

    return { total, completed, progress, pending };
  }, [taskData]);

  const recentTasks = useMemo(() => {
    return taskData.filter(task => {
      const taskDate = moment(task.createdAt, 'DD/MM/YYYY h:mm:ss a');
      return moment().diff(taskDate, 'hours') <= 1;
    });
  }, [taskData]);

  const getStatusColor = (s: string) => {
    switch (s) {
      case STATUS.STATUS_PROGRESS:
        return '#f0a902';
      case STATUS.STATUS_PENDING:
        return '#c7040e';
      case STATUS.STATUS_COMPLETED:
        return '#13ad51';
      default:
        return 'black';
    }
  };

  const renderRecentTask = (i: Task) => {
    return (
      <View style={styles.taskItem}>
        <View style={styles.recentTaskContentTop}>
          <Text style={styles.taskTitle}>{i.title}</Text>
          <Text
            style={[
              styles.recentTaskStatusBadge,
              {
                color: getStatusColor(i.status),
                borderColor: getStatusColor(i.status),
              },
            ]}
          >
            {i.status}
          </Text>
        </View>
        <View>
          <Text style={styles.recentTaskDesc}>{i.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task Tracker</Text>
      <Text style={styles.section}>Task Overview</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.progress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
      <View style={styles.recentCard}>
        <Text style={styles.section}>Recent Added Tasks</Text>
        {recentTasks.length === 0 ? (
          <Text style={styles.empty}>No tasks created in the last hours.</Text>
        ) : (
          <FlatList
            data={recentTasks}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderRecentTask(item)}
          />
        )}
      </View>
      {/* Temporary Comment Quick Add Task Icon - not sure if this is needed */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Plus color="white" size={24} />
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>
          Add Task
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },

  statLabel: {
    color: '#6B7280',
  },

  taskItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  taskTitle: {
    fontWeight: '700',
    fontSize: 15,
  },

  empty: {
    color: '#9CA3AF',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#E206EA',
    padding: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  quickActionBtn: {
    backgroundColor: '#E206EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  quickActionText: {
    color: 'white',
    fontWeight: '600',
  },

  recentCard: {
    flex: 1,
  },
  recentTaskContentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTaskDesc: {
    fontSize: 12,
    fontWeight: 400,
    color: '#474747',
  },
  recentTaskStatusBadge: {
    fontSize: 10,
    fontWeight: 700,
    borderWidth: 2,
    padding: 3,
    borderRadius: 5,
  },
});
