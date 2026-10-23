import React from 'react';
import { Dialog as MotionDialog, DialogProps as MotionDialogProps } from '@/components/motion/ModalAndToast';

export interface DialogProps extends MotionDialogProps {}

export function Dialog(props: DialogProps) {
  return <MotionDialog {...props} />;
}
