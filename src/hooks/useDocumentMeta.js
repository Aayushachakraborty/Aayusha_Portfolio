import { useEffect } from 'react';

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

export function useDocumentMeta({ title, description, ogImage }) {
  useEffect(() => {
    if (title) document.title = title;

    const descriptionTag = ensureMeta('meta[name="description"]', { name: 'description' });
    descriptionTag.setAttribute('content', description || '');

    const ogTitle = ensureMeta('meta[property="og:title"]', { property: 'og:title' });
    const ogDescription = ensureMeta('meta[property="og:description"]', { property: 'og:description' });
    const ogImageTag = ensureMeta('meta[property="og:image"]', { property: 'og:image' });
    const twitterCard = ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' });
    const twitterTitle = ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' });
    const twitterDescription = ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' });
    const twitterImage = ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' });

    ogTitle.setAttribute('content', title || '');
    ogDescription.setAttribute('content', description || '');
    ogImageTag.setAttribute('content', ogImage || '');
    twitterCard.setAttribute('content', 'summary_large_image');
    twitterTitle.setAttribute('content', title || '');
    twitterDescription.setAttribute('content', description || '');
    twitterImage.setAttribute('content', ogImage || '');
  }, [description, ogImage, title]);
}
