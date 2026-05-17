export const GAME_SCENES = [
  { path: '/', label: 'BOOT', hud: 'SCENE 01 - BOOT' },
  { path: '/world', label: 'WORLD ENTRY', hud: 'SCENE 02 - WORLD ENTRY' },
  { path: '/about', label: 'CITY RUN', hud: 'SCENE 03 - CITY RUN' },
  { path: '/skills', label: 'SKILLS DISTRICT', hud: 'SCENE 04 - SKILLS DISTRICT' },
  { path: '/experience', label: 'EXPERIENCE HIGHWAY', hud: 'SCENE 05 - EXPERIENCE HIGHWAY' },
  { path: '/airport', label: 'AIRPORT', hud: 'SCENE 06 - AIRPORT' },
  { path: '/project', label: 'PROJECT FLIGHT', hud: 'SCENE 07 - PROJECT FLIGHT' },
  { path: '/contact', label: 'CONTACT HQ', hud: 'SCENE 08 - CONTACT HQ' },
];

export function getSceneByPath(pathname) {
  if (pathname.startsWith('/project/')) return GAME_SCENES[6];
  return GAME_SCENES.find((scene) => scene.path === pathname) || GAME_SCENES[0];
}

export function getSceneIndex(pathname) {
  if (pathname.startsWith('/project/')) return 6;
  const index = GAME_SCENES.findIndex((scene) => scene.path === pathname);
  return index >= 0 ? index : 0;
}
