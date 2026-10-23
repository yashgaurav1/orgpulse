import React from 'react';
import { Skeleton as MotionSkeleton, SkeletonProps as MotionSkeletonProps } from '@/components/motion/Skeleton';

export interface SkeletonProps extends MotionSkeletonProps {}

export function Skeleton(props: SkeletonProps) {
  return <MotionSkeleton {...props} />;
}
