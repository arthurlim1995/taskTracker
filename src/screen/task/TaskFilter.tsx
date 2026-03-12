import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { dateOptions, statusOptions } from '../../constants/Task.constants';
import { StatusType } from '../../types/Task.types';

interface FilterType {
  showFilter: boolean;
  filterStatus: 'All' | StatusType;
  filterDate: 'All' | '7days' | '30days';
  setFilterStatus: (i: 'All' | StatusType) => void;
  setFilterDate: (i: 'All' | '7days' | '30days') => void;
  setHideFilter: (i: boolean) => void;
  setIsFiltering: (i: boolean) => void;
  applyFilter: () => void;
  resetFilter: () => void;
}

const TaskFilter = ({
  showFilter,
  filterStatus,
  filterDate,
  setFilterStatus,
  setFilterDate,
  setHideFilter,
  setIsFiltering,
  applyFilter,
  resetFilter,
}: FilterType) => {
  return (
    <Modal visible={showFilter} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Tasks</Text>

          <Dropdown
            style={styles.dropdown}
            data={statusOptions}
            labelField="label"
            valueField="value"
            value={filterStatus}
            onChange={item => setFilterStatus(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={dateOptions}
            labelField="label"
            valueField="value"
            value={filterDate}
            onChange={item => setFilterDate(item.value)}
          />

          <View style={styles.btnContainer}>
            <Pressable
              style={[styles.modalBtn, styles.filterBtn]}
              onPress={() => {
                setHideFilter(false);
                setIsFiltering(true);
                setTimeout(applyFilter, 300);
              }}
            >
              <Text style={styles.modalBtnText}>Filter</Text>
            </Pressable>

            <Pressable
              style={[styles.modalBtn, styles.resetBtn]}
              onPress={resetFilter}
            >
              <Text style={styles.modalBtnText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaskFilter;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  resetBtn: {
    backgroundColor: '#9CA3AF',
  },
  filterBtn: {
    backgroundColor: '#4F46E5',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
