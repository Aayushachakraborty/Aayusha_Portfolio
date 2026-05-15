import { apiFetch } from './api';

export const profileService = {
  fetch(baseUrl) {
    return apiFetch(`${baseUrl}/api/profile`);
  },
};
