// EmailJS browser credentials are public; never put a private key here.
export const contactConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'service_okzm1em',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'template_opzte3v',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '3lleCCVhR5jjYQZbm',
};
