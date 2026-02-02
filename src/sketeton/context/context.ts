import { createContext } from 'react';
import { Skeleton } from '@/sketeton/editor-skeleton.ts';
export const SkeletonContext = createContext<Skeleton>({} as any);
