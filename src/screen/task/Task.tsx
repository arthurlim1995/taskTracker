import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task } from '../../interface/Task.interface';
import { useInternet } from '../../hooks/useInternet';
import { StatusType } from '../../types/Task.types';
import TaskCounter from './TaskCounter';
import UndoBanner from './TaskUndo';
import TaskItem from './TaskItem';
import TaskEmptyState from './TaskEmpty';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setTaskData } from '../../slice/Task.reducer';
import moment from 'moment';
import { DateTimeFormat } from '../../constants/DateTime.constants';
import TaskFilter from './TaskFilter';
import TaskEdit from './TaskEdit';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const isOnline = useInternet();

  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | StatusType>('All');
  const [filterDate, setFilterDate] = useState<'All' | '7days' | '30days'>(
    'All',
  );
  const [tempFilterStatus, setTempFilterStatus] = useState<'All' | StatusType>(
    'All',
  );
  const [tempFilterDate, setTempFilterDate] = useState<
    'All' | '7days' | '30days'
  >('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<StatusType>('Pending');
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const wasOffline = useRef(!isOnline);
  const swipeRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const openedSwipeId = useRef<string | null>(null);
  const resetTimeout = useRef<number | null>(null);

  const taskData = useAppSelector(state => state.taskScreen.taskData);

  const closeOthers = (id: string) => {
    if (openedSwipeId.current && openedSwipeId.current !== id) {
      swipeRefs.current[openedSwipeId.current]?.close();
    }
    openedSwipeId.current = id;
  };

  const closeCurrent = () => {
    if (openedSwipeId.current) {
      swipeRefs.current[openedSwipeId.current]?.close();
    }
  };

  const closeAllSwipes = () => {
    Object.values(swipeRefs.current).forEach(ref => ref?.close());
    openedSwipeId.current = null;
  };

  const saveTask = () => {
    if (!title.trim()) return;

    let newOrUpdatedTasks: Task[];

    if (editingTask) {
      newOrUpdatedTasks = taskData.map(t =>
        t.id === editingTask.id
          ? {
              ...t,
              title,
              description,
              status,
              syncStatus: isOnline ? 'Synced' : 'Pending Sync',
            }
          : t,
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        // createdAt: new Date().toISOString(),
        createdAt: moment(new Date()).format(DateTimeFormat.FORMAT_10),
        status,
        syncStatus: isOnline ? 'Synced' : 'Pending Sync',
      };
      newOrUpdatedTasks = [newTask, ...taskData];
    }

    dispatch(setTaskData(newOrUpdatedTasks));
    closeModal();

    // Auto Sync if online and there is any pending task
    if (
      isOnline &&
      newOrUpdatedTasks.some(t => t.syncStatus === 'Pending Sync')
    ) {
      syncTasks();
    }
  };

  const closeModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setModalVisible(false);
  };

  const openEditModal = (task: Task) => {
    closeAllSwipes();
    setEditingTask(task);
    setTitle(task.title ?? '');
    setDescription(task.description ?? '');
    setStatus(task.status);
    setModalVisible(true);
  };

  const deleteTask = (id: string) => {
    const removed = taskData.find(t => t.id === id);
    const newTaskData = taskData.filter(t => t.id !== id);
    dispatch(setTaskData(newTaskData));

    if (removed) {
      setDeletedTasks(prev => [removed, ...prev]);
      setShowUndo(true);

      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }

      resetTimeout.current = setTimeout(() => {
        setShowUndo(false);
        setDeletedTasks([]);
        resetTimeout.current = null;
      }, 4000);
    }
  };

  const undoDelete = () => {
    if (deletedTasks.length > 0) {
      const newTaskData = [...deletedTasks, ...taskData];
      dispatch(setTaskData(newTaskData));
    }
    setShowUndo(false);
    setDeletedTasks([]);

    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
  };

  const completeTask = (id: string, stat: string) => {
    const newTaskData: Task[] = taskData.map(t =>
      t.id === id
        ? {
            ...t,
            status: stat === 'Pending' ? 'In Progress' : 'Completed',
            syncStatus: isOnline ? 'Synced' : 'Pending Sync',
          }
        : t,
    );
    dispatch(setTaskData(newTaskData));
  };

  const applyFilters = () => {
    setIsFiltering(true);

    setTimeout(() => {
      setFilterStatus(tempFilterStatus);
      setFilterDate(tempFilterDate);

      setIsFiltering(false);
      setFilterModalVisible(false);
    }, 800);
  };

  const filteredTasks = taskData.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' ? true : task.status === filterStatus;

    let matchesDate = true;

    const taskDate = moment(task.createdAt, 'DD/MM/YYYY h:mm:ss a');

    if (filterDate === '7days') {
      matchesDate = moment().diff(taskDate, 'days') <= 7;
    }

    if (filterDate === '30days') {
      matchesDate = moment().diff(taskDate, 'days') <= 30;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const syncTasks = () => {
    setIsSyncing(true);
    setSyncResult('');

    setTimeout(() => {
      const newTaskData: Task[] = taskData.map(task =>
        task.syncStatus === 'Pending Sync'
          ? { ...task, syncStatus: 'Synced' }
          : task,
      );

      dispatch(setTaskData(newTaskData));

      setIsSyncing(false);
      setSyncResult('Sync completed');

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => setSyncResult(''));
      }, 5000);
    }, 1500);
  };

  useEffect(() => {
    if (!wasOffline.current && !isOnline) {
      wasOffline.current = true;
    }

    if (wasOffline.current && isOnline) {
      wasOffline.current = false;

      if (taskData.some(t => t.syncStatus === 'Pending Sync')) {
        syncTasks();
      } else {
        // dispatch(
        //   setTaskData(prev => prev.map(t => ({ ...t, syncStatus: 'Synced' }))),
        // );
        const newTaskData: Task[] = taskData.map(t => ({
          ...t,
          syncStatus: 'Synced',
        }));
        dispatch(setTaskData(newTaskData));
      }
    }
  }, [isOnline, taskData]);

  console.log('TaskData', taskData);

  const resetFilters = () => {
    setFilterModalVisible(false);
    setIsFiltering(true);

    setTimeout(() => {
      setTempFilterStatus('All');
      setTempFilterDate('All');
      setFilterStatus('All');
      setFilterDate('All');
      setIsFiltering(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addBtn}
        >
          <Plus color="white" size={20} />
        </TouchableOpacity>
      </View>

      <UndoBanner visible={showUndo} onUndo={undoDelete} />

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            You are offline. Changes will sync when online.
          </Text>
        </View>
      )}

      {isOnline && taskData.some(t => t.syncStatus === 'Pending Sync') && (
        <TouchableOpacity style={styles.syncBanner} onPress={syncTasks}>
          {isSyncing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.syncText}>Sync Pending Tasks</Text>
          )}
        </TouchableOpacity>
      )}

      {syncResult !== '' && (
        <Animated.View style={[styles.syncSuccess, { opacity: fadeAnim }]}>
          <Text style={styles.syncText}>{syncResult}</Text>
        </Animated.View>
      )}

      <TaskCounter tasks={taskData} />

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search tasks"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter color="white" size={18} />
        </TouchableOpacity>
      </View>

      {isFiltering ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Filtering tasks...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          {/* <Text style={styles.emptyText}>No tasks found.</Text> */}
          <TaskEmptyState />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onDelete={deleteTask}
              onComplete={completeTask}
              swipeRef={ref => (swipeRefs.current[item.id] = ref)}
              closeOthers={() => closeOthers(item.id)}
              onEdit={openEditModal}
              closeCurrent={() => closeCurrent()}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TaskFilter
        showFilter={filterModalVisible}
        filterStatus={tempFilterStatus}
        filterDate={tempFilterDate}
        setFilterStatus={setTempFilterStatus}
        setFilterDate={setTempFilterDate}
        setHideFilter={setFilterModalVisible}
        setIsFiltering={setIsFiltering}
        applyFilter={applyFilters}
        resetFilter={resetFilters}
      />

      <TaskEdit
        showModal={modalVisible}
        editTask={editingTask}
        title={title}
        setTitle={setTitle}
        desc={description}
        setDesc={setDescription}
        save={saveTask}
        closeModal={closeModal}
        status={status}
        setStatus={setStatus}
      />
    </SafeAreaView>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#E206EA',
    padding: 10,
    borderRadius: 8,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterBtn: {
    marginLeft: 8,
    backgroundColor: '#E206EA',
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  offlineBanner: {
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontWeight: '600',
  },
  syncBanner: {
    backgroundColor: '#db0909',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  syncText: {
    color: 'white',
    fontWeight: '600',
  },
  syncSuccess: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  // btnGreen: {
  //   backgroundColor: '#10B981',
  // },
  // btnYellow: {
  //   backgroundColor: '#f0a902',
  // },
});
