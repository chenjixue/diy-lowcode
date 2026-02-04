import { createContext } from 'react';
import { Skeleton } from '@/sketeton/skeleton.ts';
export const SkeletonContext = createContext<Skeleton>({} as any);
