import React from 'react';
import { Toast as MotionToast, ToastProps as MotionToastProps } from '@/components/motion/ModalAndToast';

export interface ToastProps extends MotionToastProps {}

export function Toast(props: ToastProps) {
  return <MotionToast {...props} />;
}
