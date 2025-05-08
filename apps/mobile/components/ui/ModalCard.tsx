import React, { ReactNode } from 'react';
import { View, Pressable } from 'react-native';
import Modal from 'react-native-modal';

interface ModalCardProps {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
  /** extra Tailwind classes for the card itself */
  className?: string;
}

export const ModalCard: React.FC<ModalCardProps> = ({
  visible,
  onClose,
  children,
  className = '',
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onClose}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.4}
    useNativeDriver
    /** This component isn’t css‑interop aware → use plain style */
    style={{ margin: 0, justifyContent: 'flex-end' }}>
    {/* tap‑outside to dismiss */}
    <Pressable className="flex-1" onPress={onClose} />
    <View className={`bg-white rounded-t-3xl p-6 shadow-xl ${className}`}>
      {children}
    </View>
  </Modal>
);
