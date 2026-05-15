import { useEffect, useState } from 'react';
import { contactService } from '../../services/contact.service';
import CopyEmail from '../shared/CopyEmail';
import DownloadCvButton from '../shared/DownloadCvButton';
import Decoration from '../shared/Decoration';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact({ person, decorations = [] }) {
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '', company_url: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [failure, setFailure] = useState('');

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => {
      setSuccess('');
      setFormValues({ name: '', email: '', message: '', company_url: '' });
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [success]);

  function validate(values) {
    const nextErrors = {};
    if (!values.name || values.name.trim().length < 2) nextErrors.name = 'Enter at least 2 characters';
    if (!EMAIL_REGEX.test(values.email || '')) nextErrors.email = 'Enter a valid email';
    if (!values.message || values.message.trim().length < 10) nextErrors.message = 'Enter at least 10 characters';
    return nextErrors;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(formValues);
    setErrors(nextErrors);
    setFailure('');
    setSuccess('');

    if (Object.keys(nextErrors).length > 0) return;
    if (formValues.company_url) {
      setSuccess('Message sent.');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        await contactService.send(apiUrl, {
          name: formValues.name,
          email: formValues.email,
          message: formValues.message,
        });
      }
      setSuccess('Message sent.');
      setErrors({});
    } catch (error) {
      setFailure(error.message || 'Unable to send message right now.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <section id="contact">
      {decorations.map((decoration) => <Decoration key={decoration.id} {...decoration} />)}
      <div className="contact-bg-text" aria-hidden="true">Hire<br />Me.</div>
      <div className="contact-pre rv on">Ready when you are</div>
      <h2 className="contact-head rv on">Let&apos;s<br /><em>build</em><br /><span className="out2">together.</span></h2>
      <p className="contact-sub rv on">{person.availability}</p>
      <div className="contact-grid">
        <div className="contact-copy rv on">
          <div className="contact-card">
            <div className="contact-card-label">Best first step</div>
            <a href={`mailto:${person.email}`} className="contact-email">{person.email}</a>
            <div className="contact-actions">
              <CopyEmail email={person.email} />
              <DownloadCvButton href={person.resumeUrl} variant="ghost" />
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-label">Response</div>
            <p className="contact-note">{person.responseSla}</p>
            <p className="contact-note">
              If you&apos;re hiring for AI/ML, data science, forecasting, analytics, or decision-support products, this form reaches me directly.
            </p>
          </div>

          <div className="contact-row">
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="soc">LinkedIn</a>
            <a href={person.github} target="_blank" rel="noreferrer" className="soc">GitHub</a>
            <a href={`tel:${person.phone}`} className="soc">{person.phone}</a>
            {person.calendlyUrl ? <a href={person.calendlyUrl} target="_blank" rel="noreferrer" className="soc">Book a 15-min call</a> : null}
          </div>
        </div>

        <form className="contact-form rv on" onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
          <div className="form-intro">
            <div className="contact-card-label">Send a note</div>
            <p id="contact-form-title" className="form-title">Tell me what you&apos;re building, hiring for, or trying to fix.</p>
          </div>

          <div className="sr-only">
            <label htmlFor="company_url">Company URL</label>
            <input id="company_url" name="company_url" value={formValues.company_url} onChange={updateField} tabIndex="-1" autoComplete="off" />
          </div>

          <div className="form-field">
            <label htmlFor="contact_name">Name</label>
            <input
              id="contact_name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={updateField}
              aria-describedby={errors.name ? 'contact_name_error' : undefined}
            />
            <p id="contact_name_error" className="field-error">{errors.name || ''}</p>
          </div>

          <div className="form-field">
            <label htmlFor="contact_email">Email</label>
            <input
              id="contact_email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={updateField}
              aria-describedby={errors.email ? 'contact_email_error' : undefined}
            />
            <p id="contact_email_error" className="field-error">{errors.email || ''}</p>
          </div>

          <div className="form-field">
            <label htmlFor="contact_message">Message</label>
            <textarea
              id="contact_message"
              name="message"
              rows="5"
              value={formValues.message}
              onChange={updateField}
              aria-describedby={errors.message ? 'contact_message_error' : undefined}
            />
            <p id="contact_message_error" className="field-error">{errors.message || ''}</p>
          </div>

          <div className="form-footer">
            <button type="submit" className="hbtn-main" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send message'}
            </button>
            <span className="form-meta">{person.responseSla}</span>
          </div>
          <p className="form-status success" role="status">{success}</p>
          <div className="form-status error" role="status">
            {failure ? (
              <span className="failure-inline">
                {failure} Email me directly at {person.email}. <CopyEmail email={person.email} />
              </span>
            ) : ''}
          </div>
        </form>
      </div>
    </section>
  );
}
