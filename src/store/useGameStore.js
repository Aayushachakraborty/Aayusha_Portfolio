import { create } from 'zustand';

const initialState = {
  sceneIndex: 0,
  visitedProjects: [],
  isMuted: typeof window === 'undefined' ? true : window.localStorage.getItem('aayusha.sound') !== 'on',
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
  toggleMute: () => set((state) => {
    const isMuted = !state.isMuted;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aayusha.sound', isMuted ? 'off' : 'on');
    }
    return { isMuted };
  }),
  setMuted: (isMuted) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aayusha.sound', isMuted ? 'off' : 'on');
    }
    set({ isMuted });
  },
  restart: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('aayusha.sound');
    set({ ...initialState });
  },
}));
