// ui/NWModal.tsx
import { styled } from 'nativewind';
import Modal from 'react-native-modal';

/**
 * Only the outer <View> inside Modal needs className,
 * so we create a thin wrapper that passes className
 * to Modal's `style` prop via style array.
 */
export const NWModal = styled(Modal, {
  props: {
    style: 'view',   // treat the style prop of Modal as a View style target
  },
});
