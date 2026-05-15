export default function DownloadCvButton({ href, variant = 'primary' }) {
  const className = variant === 'ghost' ? 'hbtn-ghost button-ghost' : 'hbtn-main';

  return (
    <a href={href} download className={className} data-event="cv_download">
      Download CV
    </a>
  );
}
