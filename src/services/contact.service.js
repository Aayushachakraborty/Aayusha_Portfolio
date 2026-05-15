import { apiFetch } from './api';

export const contactService = {
  send(baseUrl, payload) {
    return apiFetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
