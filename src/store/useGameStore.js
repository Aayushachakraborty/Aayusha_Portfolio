import { create } from 'zustand';

const initialState = {
  sceneIndex: 0,
  visitedProjects: [],
  isMuted: true,
  hasStarted: false,
  selectedProject: '',
};

export const useGameStore = create((set) => ({
  ...initialState,
  setScene: (sceneIndex) => set({ sceneIndex }),
  start: () => set({ hasStarted: true, sceneIndex: 1 }),
  selectProject: (selectedProject) => set({ selectedProject }),
  visitProject: (slug) => set((state) => ({
    visitedProjects: state.visitedProjects.includes(slug)
      ? state.visitedProjects
      : [...state.visitedProjects, slug],
  })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  restart: () => set({ ...initialState }),
}));
