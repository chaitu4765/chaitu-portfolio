# Portfolio contact template

The site is connected to service `service_okzm1em` and template `template_opzte3v` using the public key supplied by the owner. Public settings live in `src/data/contact-config.ts`; optional build-time overrides are listed in `.env.example`.

In the EmailJS dashboard, the existing template must have:

- **To Email:** `chaitu4765@gmail.com` (fixed recipient).
- **Subject:** `Portfolio enquiry — {{from_name}}`
- **From Name:** `Chaitanya Portfolio`
- **From Email:** use the connected service's default email.
- **Reply To:** `{{reply_to}}`
- **Content:** the HTML in `portfolio-contact.html`.

The form also sends `name`, `email`, `title`, `time`, and `message` for compatibility with EmailJS's standard Contact Us template. The `message` variable contains the sender's name, email, company, and message together, so the stock template preserves all four form fields. The custom HTML uses escaped double-curly variables.

The owner confirmed a successful submission and receipt at `chaitu4765@gmail.com` on 29 October 2026. The saved dashboard template has not been overwritten; the custom HTML above is an optional prepared layout. Template content, recipient, and Reply-To are controlled in EmailJS, not by this static website.

To check delivery, open Contact in the portfolio, enter a clearly labeled test message and a reply email you control, then submit once. The site only shows success after EmailJS returns a successful response. Check the recipient inbox (and spam folder) to confirm actual delivery. The automated tests mock the EmailJS response and do not send mail.
