import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Task } from '../../interface/Task.interface';
import { StatusType } from '../../types/Task.types';
import { statusOptions } from '../../constants/Task.constants';

interface FilterEditType {
  showModal: boolean;
  editTask: Task | null;
  title: string;
  setTitle: (i: string) => void;
  desc: string;
  setDesc: (i: string) => void;
  status: StatusType;
  setStatus: (i: StatusType) => void;
  save: () => void;
  closeModal: () => void;
}

const TaskEdit = ({
  showModal,
  editTask,
  title,
  setTitle,
  desc,
  setDesc,
  status,
  setStatus,
  save,
  closeModal,
}: FilterEditType) => {
  return (
    <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editTask ? 'Edit Task' : 'New Task'}
          </Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            style={[styles.input, styles.textDesc]}
            multiline
          />

          <Dropdown
            style={styles.dropdown}
            data={statusOptions.slice(1)}
            labelField="label"
            valueField="value"
            value={status}
            onChange={item => setStatus(item.value)}
          />

          <View style={styles.modalButtons}>
            <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={save}>
              <Text style={styles.modalBtnText}>Save</Text>
            </Pressable>

            <Pressable
              style={[styles.modalBtn, styles.canceBtn]}
              onPress={closeModal}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaskEdit;

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
  saveBtn: {
    backgroundColor: '#4F46E5',
  },
  canceBtn: {
    backgroundColor: '#9CA3AF',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDesc: {
    height: 80,
  },
});
