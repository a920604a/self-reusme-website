# Contact Form — Formspree Setup

The contact form on the homepage is handled by [Formspree](https://formspree.io/). The form backend URL is hardcoded in `src/hooks/useSubmit.js`:

```js
const FORMSPREE_URL = "https://formspree.io/f/xdaylpgp";
```

When forking this template, replace this URL with your own Formspree endpoint.

---

## Setting up your own Formspree endpoint

1. Create a free account at [formspree.io](https://formspree.io/).
2. Click **New Form**, give it a name, and set the destination email address.
3. Copy the form endpoint URL — it looks like `https://formspree.io/f/<form-id>`.
4. Replace the URL in `src/hooks/useSubmit.js`:

```js
const FORMSPREE_URL = "https://formspree.io/f/<your-form-id>";
```

5. Rebuild and redeploy the frontend.

---

## What is sent to Formspree

The `useSubmit` hook sends a JSON POST with these fields:

| JSON key | Source field | Description |
|----------|-------------|-------------|
| `name` | `firstName` | Sender's name |
| `email` | `email` | Sender's email address |
| `subject` | `subject` | Message subject |
| `message` | `comment` | Message body |

Formspree forwards these fields to the destination email configured in your dashboard.

---

## Free plan limits

The Formspree free plan allows 50 submissions per month. For higher volumes, upgrade to a paid plan or replace `useSubmit.js` with a different backend (e.g. EmailJS, a Cloudflare Worker, AWS SES).

---

## Response handling

`useSubmit` returns `{ isLoading, response, submit }`:

- On success: `response = { type: "success", message: "Thanks for your message, <name>! ..." }`
- On error: `response = { type: "error", message: "Something went wrong..." }`

The `ContactMeSection` component renders these via the `Alert` component and the `AlertProvider` context.
