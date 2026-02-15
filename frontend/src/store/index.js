import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authSlice } from './slices/authSlice';
import { academicsSlice } from './slices/academicsSlice';
import { codingSlice } from './slices/codingSlice';
import { psychSlice } from './slices/psychSlice';
import { recommendationSlice } from './slices/recommendationSlice';
import { roadmapSlice } from './slices/roadmapSlice';
import { projectsSlice } from './slices/projectsSlice';
import { uiSlice } from './slices/uiSlice';

const useStore = create(
    persist(
        (...args) => ({
            ...authSlice(...args),
            ...academicsSlice(...args),
            ...codingSlice(...args),
            ...psychSlice(...args),
            ...recommendationSlice(...args),
            ...roadmapSlice(...args),
            ...projectsSlice(...args),
            ...uiSlice(...args),
        }),
        {
            name: 'nextstepai-v3',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Don't persist auth (handled by Clerk)
                academics: state.academics,
                coding: state.coding,
                psychometric: state.psychometric,
                recommendations: state.recommendations,
                roadmap: state.roadmap,
                projects: state.projects,
                theme: state.theme,
            }),
            version: 3,
            migrate: (persistedState, version) => {
                if (version < 3) {
                    // Reset state if version changed
                    return {};
                }
                return persistedState;
            },
        }
    )
);

export default useStore;