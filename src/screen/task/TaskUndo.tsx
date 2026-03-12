import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onUndo: () => void;
}

const UndoBanner = ({ visible, onUndo }: Props) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task deleted</Text>

      <TouchableOpacity onPress={onUndo}>
        <Text style={styles.undo}>UNDO</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UndoBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  text: {
    color: 'white',
  },

  undo: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
