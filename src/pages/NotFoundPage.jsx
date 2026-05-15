import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFoundPage({ navigate, meta }) {
  useDocumentMeta({
    title: `Not Found — ${meta.title}`,
    description: meta.description,
    ogImage: meta.ogImage,
  });

  return (
    <main className="notfound-page" id="main-content">
      <div className="sec-label">404</div>
      <h1>This page didn&apos;t survive contact with the business.</h1>
      <a
        href="/"
        className="hbtn-main"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
      >
        Back home
      </a>
    </main>
  );
}
