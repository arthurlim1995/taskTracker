import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task } from '../../interface/Task.interface';
import { STATUS, SYNCSTATUS } from '../../constants/Task.constants';

interface TaskItemType {
  item: Task;
  onDelete: (id: string) => void;
  onComplete: (id: string, status: string) => void;
  swipeRef: (ref: Swipeable | null) => void;
  closeOthers: () => void;
  onEdit: (task: Task) => void;
  closeCurrent: () => void;
}

const TaskItem = ({
  item,
  onDelete,
  onComplete,
  swipeRef,
  closeOthers,
  onEdit,
  closeCurrent,
}: TaskItemType) => {
  const getSyncStatusColor = (i: string) => {
    switch (i) {
      case SYNCSTATUS.SYNC_STATUS_FAILED:
        return '#EF4444';
      case SYNCSTATUS.SYNC_STATUS_PENDING_SYNC:
        return '#F59E0B';
      case SYNCSTATUS.SYNC_STATUS_SUCESS:
        return '#10B981';
      default:
        return 'black';
    }
  };

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

  const renderRight = () => (
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => {
        onDelete(item.id);
      }}
    >
      <Text style={styles.text}>Delete</Text>
    </TouchableOpacity>
  );

  const renderLeft = () => {
    if (item.status === 'Completed') {
      return null;
    }

    return (
      <TouchableOpacity
        style={[
          styles.completeBtn,
          item.status === 'In Progress' ? styles.green : styles.yellow,
        ]}
        onPress={() => {
          onComplete(item.id, item.status);
          closeCurrent();
        }}
      >
        <Text style={styles.text}>
          {item.status === 'In Progress' ? 'Complete' : 'Start Task'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      onSwipeableOpen={closeOthers}
      renderRightActions={renderRight}
      renderLeftActions={renderLeft}
    >
      <TouchableOpacity style={styles.card} onPress={() => onEdit(item)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>

          <Text
            style={[
              styles.syncStatus,
              { color: getSyncStatusColor(item.syncStatus) },
            ]}
          >
            {item.syncStatus}
          </Text>
        </View>

        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{item.createdAt}</Text>

          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>

        {item.priority && (
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  desc: {
    color: '#6B7280',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  status: {
    fontWeight: '600',
  },
  syncStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  completeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  green: {
    backgroundColor: '#10B981',
  },
  yellow: {
    backgroundColor: '#F59E0B',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
