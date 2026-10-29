'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, ArrowRight, Check, Github, Linkedin, LoaderCircle, Mail, Phone } from 'lucide-react';
import ContactGlobe from '@/components/ui/contact-globe';
import { site } from '@/data/site-config';
import { contactConfig } from '@/data/contact-config';
import { sendContact, validateContact, type ContactErrors, type ContactFields } from '@/lib/contact';

const empty: ContactFields = { name: '', company: '', email: '', message: '' };
type Field = keyof ContactFields;

export default function ContactWithGlobe({ active }: { active: boolean }) {
  const [fields, setFields] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  function update(field: Field, value: string) {
    setFields(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    if (status === 'error') setStatus('idle');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const result = validateContact(fields);
    setErrors(result.errors);
    const firstError = Object.keys(result.errors)[0] as Field | undefined;
    if (firstError) { formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus(); return; }
    inFlight.current = true;
    setStatus('sending'); setError('');
    try {
      await sendContact(result.fields, contactConfig);
      setStatus('sent'); setFields(empty);
    } catch (error) {
      setStatus('error'); setError(error instanceof Error ? error.message : 'Could not send your message. Please email me directly.');
    } finally { inFlight.current = false; }
  }
  function inputProps(field: Field) {
    return {
      id: `contact-${field}`, name: field, value: fields[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field, event.target.value),
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
      disabled: status === 'sending',
    };
  }
  function fieldError(field: Field) { return errors[field] ? <span id={`contact-${field}-error`} className="contact-field-error">{errors[field]}</span> : null; }
  return <div className="contact-with-globe">
    <div className="contact-form-card">
      <h3>Send a message</h3><p>Let’s start a conversation.</p><div className="contact-form-divider" aria-hidden="true"/>
      {status === 'sent' ? <div className="contact-success" role="status"><span className="contact-success-icon"><Check size={25}/></span><h4>Message sent.</h4><p>Thanks for reaching out. I’ll reply to the email address you shared.</p><button className="contact-submit" type="button" onClick={() => setStatus('idle')}>Write another message <ArrowRight size={16}/></button></div> : <form ref={formRef} onSubmit={submit} noValidate aria-busy={status === 'sending'}>
        <div className="contact-form-row">
          <div className="contact-field"><label htmlFor="contact-name">Full name <span>*</span></label><input {...inputProps('name')} autoComplete="name" placeholder="Your name" maxLength={100} required/>{fieldError('name')}</div>
          <div className="contact-field"><label htmlFor="contact-company">Company <span>(optional)</span></label><input {...inputProps('company')} autoComplete="organization" placeholder="Company or team" maxLength={140}/>{fieldError('company')}</div>
        </div>
        <div className="contact-field"><label htmlFor="contact-email">Email address <span>*</span></label><input {...inputProps('email')} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={254} required/>{fieldError('email')}</div>
        <div className="contact-field"><label htmlFor="contact-message">Your message <span>*</span></label><textarea {...inputProps('message')} placeholder="A little about your project or idea…" rows={4} minLength={10} maxLength={5000} required/>{fieldError('message')}</div>
        <div className="contact-form-status" role="status" aria-live="polite">{status === 'error' ? <p className="contact-field-error">{error}</p> : status === 'sending' ? 'Sending your message…' : null}</div>
        <button className="contact-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <>Sending… <LoaderCircle size={17} className="contact-spinner"/></> : <>Send message <ArrowRight size={17}/></>}</button>
        <p className="contact-form-note">Your details are emailed to me through EmailJS so I can respond.</p>
      </form>}
    </div>
    <aside className="contact-popup-details">
      <h3>Get in touch</h3><p>Tell me what you have in mind.<br/>I’d love to hear about it.</p>
      <div className="contact-popup-links">
        <a href={`mailto:${site.email}`}><Mail size={17}/><span>{site.email}</span><ArrowUpRight size={14}/></a>
        <a href={`tel:${site.phoneHref}`}><Phone size={17}/><span>{site.phone}</span><ArrowUpRight size={14}/></a>
        <a href={site.github} target="_blank" rel="noreferrer"><Github size={17}/><span>chaitu4765</span><ArrowUpRight size={14}/></a>
        <a href={site.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/><span>LinkedIn</span><ArrowUpRight size={14}/></a>
      </div>
      <ContactGlobe active={active}/>
    </aside>
  </div>;
}
