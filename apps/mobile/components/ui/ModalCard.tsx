import React, { ReactNode } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export const ModalCard: React.FC<Props> = ({ visible, onClose, children }) => (
  <Modal
    isVisible={visible}
    backdropOpacity={0.4}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    useNativeDriver
    onBackdropPress={onClose}
    style={styles.modal}>
    <Pressable style={{ flex: 1 }} onPress={onClose} />

    <View style={styles.card}>
      {/* grab handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      {children}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'flex-end' },
  card: {
    width: '100%',
    height: '93%',            // sits just under the Dynamic Island
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
});
