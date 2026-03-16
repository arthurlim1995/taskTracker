import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { ClipboardList, Plus } from 'lucide-react-native';
import { useAppSelector } from '../../../hooks';
import { Task } from '../../interface/Task.interface';
import { STATUS } from '../../constants/Task.constants';

const HomePage = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const taskData = useAppSelector(state => state.taskScreen.taskData);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const greeting = () => {
    const hour = moment().hour();
    if (hour < 12) {
      return <Text>Good Morning</Text>;
    }
    if (hour < 18) {
      return <Text>Good Afternoon</Text>;
    }
    return <Text>Good Evening</Text>;
  };

  const taskStatus = useMemo(() => {
    const total = taskData.length;

    const completed = taskData.filter(
      t => t.status === STATUS.STATUS_COMPLETED,
    ).length;

    const progress = taskData.filter(
      t => t.status === STATUS.STATUS_PROGRESS,
    ).length;

    const pending = taskData.filter(
      t => t.status === STATUS.STATUS_PENDING,
    ).length;

    return { total, completed, progress, pending };
  }, [taskData]);

  const progressPercent =
    taskStatus.total === 0
      ? 0
      : (taskStatus.completed / taskStatus.total) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const recentTasks = useMemo(() => {
    return taskData
      .filter(task => {
        const taskDate = moment(task.createdAt, 'DD/MM/YYYY h:mm:ss a');
        return moment().diff(taskDate, 'hours') <= 24;
      })
      .slice(0, 3);
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

  const renderRecentTask = ({ item }: { item: Task }) => {
    return (
      <View style={styles.taskItem}>
        <View style={styles.recentTaskContentTop}>
          <Text style={styles.taskTitle}>{item.title}</Text>

          <Text
            style={[
              styles.recentTaskStatusBadge,
              {
                color: getStatusColor(item.status),
                borderColor: getStatusColor(item.status),
              },
            ]}
          >
            {item.status}
          </Text>
        </View>

        <Text style={styles.recentTaskDesc}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.subtitle}>
            You have {taskStatus.pending} pending tasks
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Completion Progress</Text>
            <Text style={styles.progressPercent}>
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: animatedWidth }]}
            />
          </View>
          <Text style={styles.progressText}>
            {taskStatus.completed} of {taskStatus.total} tasks completed
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Task Overview</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskStatus.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskStatus.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskStatus.progress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskStatus.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.recentHeader}>
            <Text style={styles.cardTitle}>Recent Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ClipboardList size={28} color={'#9CA3AF'} />
              <Text style={styles.emptyTitle}>No recent tasks</Text>
              <Text style={styles.emptySubTitle}>
                Start by adding your first task
              </Text>
            </View>
          ) : (
            <FlatList
              data={recentTasks}
              keyExtractor={item => item.id}
              renderItem={renderRecentTask}
              scrollEnabled={false}
            />
          )}
        </View>
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Plus size={22} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressPercent: {
    fontWeight: '700',
    color: '#E206EA',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    backgroundColor: '#6366F1',
    borderRadius: 20,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
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
    fontSize: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAll: {
    color: '#E206EA',
    fontWeight: '600',
    fontSize: 12,
  },
  taskItem: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  taskTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  recentTaskContentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTaskDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  recentTaskStatusBadge: {
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySubTitle: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  addBtn: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#E206EA',
    padding: 16,
    borderRadius: 50,
    elevation: 6,
  },
});
