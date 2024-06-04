import { createContext } from 'react';
import { Skeleton } from '@/core/editor-skeleton';
export const SkeletonContext = createContext<Skeleton>({} as any);
