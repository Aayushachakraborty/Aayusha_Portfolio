import { useEffect, useMemo, useState } from 'react';
import person from '../data/person.json';
import ticker from '../data/ticker.json';
import manifesto from '../data/manifesto.json';
import numbers from '../data/numbers.json';
import skills from '../data/skills.json';
import projects from '../data/projects.json';
import experience from '../data/experience.json';
import awards from '../data/awards.json';
import video from '../data/video.json';
import meta from '../data/meta.json';
import stickers from '../data/stickers.json';
import { profileService } from '../services/profile.service';
import { deepMerge } from '../utils/format';

const baselineProfile = {
  person,
  ticker,
  manifesto,
  numbers,
  skills,
  projects,
  experience,
  awards,
  video,
  meta,
  stickers,
};

export function useProfile() {
  const [profile, setProfile] = useState(baselineProfile);
  const [loading, setLoading] = useState(Boolean(import.meta.env.VITE_API_URL));
  const [error, setError] = useState('');
  const [source, setSource] = useState('local');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    profileService.fetch(apiUrl)
      .then((payload) => {
        if (!mounted) return;
        setProfile((current) => deepMerge(current, payload));
        setSource('api');
        setError('');
      })
      .catch((err) => {
        if (!mounted) return;
        setSource('local');
        setError(err.message || 'Using local profile data.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => ({ profile, loading, error, source }), [error, loading, profile, source]);
}
