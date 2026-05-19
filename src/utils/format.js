export function formatReadTime(...parts) {
  const text = parts.filter(Boolean).join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `~${minutes} min read`;
}

export function formatBuildDate(value) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }
  if (typeof base !== 'object' || base === null) return override ?? base;
  if (typeof override !== 'object' || override === null) return override ?? base;

  const result = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge(base[key], override[key]);
  }
  return result;
}

export function parseExperienceDate(part) {
  if (!part) return null;
  const p = String(part).trim();
  if (!p) return null;
  if (/present|now|current/i.test(p)) return new Date();
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(p)) {
    const normalized = p.length === 7 ? `${p}-01` : p;
    const parsedIso = new Date(`${normalized}T00:00:00`);
    if (!Number.isNaN(parsedIso.getTime())) return parsedIso;
  }

  const tryDate = new Date(`1 ${p}`);
  if (!Number.isNaN(tryDate.getTime())) return tryDate;

  const parsed = new Date(p);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

export function monthsBetween(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) return 0;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return 0;
  const sy = start.getFullYear();
  const sm = start.getMonth();
  const ey = end.getFullYear();
  const em = end.getMonth();
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function getExperienceRange(job) {
  if (!job) return { start: null, end: null };
  const normalizedPeriod = String(job.period || '')
    .replace(/[\u2014\u2013\u201C\u201D]/g, ' - ')
    .replace(/\u00E2\u20AC[\u201C\u201D]/g, ' - ');
  const periodParts = normalizedPeriod
    .split(/\s+(?:-|to)\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const start = parseExperienceDate(job.startDate || periodParts[0]);
  const end = parseExperienceDate(job.endDate || periodParts[1] || 'Present');
  return { start, end };
}

export function formatMonthsAsDuration(months) {
  const safeMonths = Math.max(0, months || 0);
  const years = Math.floor(safeMonths / 12);
  const remMonths = safeMonths % 12;
  const yrs = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const mos = remMonths > 0 ? `${remMonths} mo${remMonths > 1 ? 's' : ''}` : '';
  return [yrs, mos].filter(Boolean).join(' ');
}

export function formatPeriodDuration(periodString) {
  if (!periodString || typeof periodString !== 'string') return '';
  const { start, end } = getExperienceRange({ period: periodString });
  if (!start) return '';
  return formatMonthsAsDuration(monthsBetween(start, end));
}

export function formatPeriodWithDuration(periodString) {
  const dur = formatPeriodDuration(periodString);
  return dur ? `${periodString} - ${dur}` : periodString;
}

export function formatJobPeriodWithDuration(job) {
  if (!job?.period) return '';
  const { start, end } = getExperienceRange(job);
  if (!start) return job.period;
  const duration = formatMonthsAsDuration(monthsBetween(start, end));
  return duration ? `${job.period} - ${duration}` : job.period;
}

export function calculateTotalExperienceMonths(items = []) {
  const ranges = items.map((job) => {
    const { start, end } = getExperienceRange(job);
    if (!start || !end || start > end) return null;
    return {
      start: start.getFullYear() * 12 + start.getMonth(),
      end: end.getFullYear() * 12 + end.getMonth(),
    };
  }).filter(Boolean).sort((a, b) => a.start - b.start);

  if (!ranges.length) return 0;

  const merged = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (!previous || range.start > previous.end + 1) {
      merged.push({ ...range });
    } else {
      previous.end = Math.max(previous.end, range.end);
    }
  }

  return merged.reduce((total, range) => total + (range.end - range.start + 1), 0);
}

export function calculateCareerJourneyMonths(items = []) {
  const ranges = items.map((job) => getExperienceRange(job))
    .filter(({ start, end }) => start && end && start <= end);

  if (!ranges.length) return 0;

  const firstStart = ranges.reduce((earliest, range) => (
    range.start < earliest ? range.start : earliest
  ), ranges[0].start);
  const lastEnd = ranges.reduce((latest, range) => (
    range.end > latest ? range.end : latest
  ), ranges[0].end);

  return monthsBetween(firstStart, lastEnd);
}

export function formatExperienceYearsBadge(items = []) {
  const months = calculateCareerJourneyMonths(items);
  if (!months) return '';
  return `${Math.floor(months / 12)}+`;
}

export function enrichProfileExperience(profile) {
  const items = profile?.experience?.items || [];
  const yearsBadge = formatExperienceYearsBadge(items);
  if (!yearsBadge) return profile;

  const yearsPlain = yearsBadge.replace('+', '');
  const person = { ...(profile.person || {}) };
  const meta = { ...(profile.meta || {}) };

  person.summary = (person.summary || '').replace(/\d+\+ years/i, `${yearsBadge} years`);
  person.heroStats = (person.heroStats || []).map((stat) => (
    /years/i.test(stat.label) ? { ...stat, value: yearsBadge } : stat
  ));

  meta.description = (meta.description || '').replace(/\d+\+ years/i, `${yearsBadge} years`);

  return {
    ...profile,
    person: {
      ...person,
      experienceYears: yearsPlain,
      experienceYearsBadge: yearsBadge,
    },
    meta,
  };
}
