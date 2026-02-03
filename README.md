# 🚀 GetCalls — Launch Guide

> Follow this guide top-to-bottom. You'll have your website live **today**.

---

## 1. Install Dependencies

```bash
cd getcalls
npm install
```

This downloads everything (React, Vite, Framer Motion, EmailJS). Takes ~30 seconds.

---

## 2. Set Up EmailJS (for contact form emails + auto-reply)

### a) Create an account
Go to **[emailjs.com](https://www.emailjs.com)** → Sign up free.

### b) Create an Email Service
- Click **Email Services** → **Add New Service**
- Pick **Gmail** → connect your Gmail: `priyanshubhati2347@gmail.com`
- Give it a name, click **Save**
- Copy your **Service ID** (looks like `service_xxxxxxx`)

### c) Create Template 1 — Owner Notification (the email YOU receive)
- Click **Email Templates** → **Create New Template**
- **CRITICAL:** At the very top, there's a field labeled **To** — set it to: `{{to_email}}`
- Subject: `🔔 New Lead — {{plan}} — {{from_name}}`
- Body:
```
Hi Priyanshu,

New lead from your website!

Name:     {{from_name}}
Email:    {{user_email}}
Phone:    {{from_phone}}
Business: {{business_type}}
Plan:     {{plan}}

Message:  {{message}}

—
Sent via GetCalls
```
- Click **Save** → copy the **Template ID** (looks like `template_xxxxxxx`)

### d) Create Template 2 — Auto-Reply (the email the CUSTOMER receives)
- Create another template
- Name it: `contact_autoreply` (or anything)
- **To email:** `{{to_email}}`
- Subject: `Thanks for reaching out — GetCalls ✨`
- Body:
```
Hi {{user_name}},

Thank you for trusting us! 🎉

We received your request and our team will personally call you within 24 hours to discuss your website.

In the meantime, if you have any questions, feel free to reply to this email or call us:
📞 +91 9057278418
📧 priyanshubhati.dev@gmail.com

Looking forward to building something amazing together!

Warm regards,
Priyanshu Bhati
GetCalls
```
- Save → copy this **Template ID** too

### e) Get your Public Key
- Go to **Account** → **API Keys**
- Copy the **Public Key**

---

## 3. Set Up Razorpay (for Pay Now buttons)

- Go to **[razorpay.com](https://razorpay.com)** → Sign up
- Complete KYC (required for live payments in India)
- Go to **Dashboard → Settings → API Keys**
- Copy your **Key ID** (starts with `rzp_test_…` for testing, `rzp_live_…` for production)

> 💡 For now use `rzp_test_…` so no real money is charged while testing.
> 💳 Test cards: **4111 1111 1111 1111** (any future date, any CVV)

---

## 4. Set Up OpenAI (for the chatbot)

- Go to **[platform.openai.com](https://platform.openai.com)** → Sign up
- Go to **API Keys** → create a new key
- Copy it (starts with `sk-…`)

> ⚠️ For production, you should proxy this through your own backend. For a quick launch today, putting it in `.env` works fine.

---

## 5. Fill in `.env`

Open the `.env` file in the project root and paste your keys:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx          # owner notification
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=template_yyyyy  # auto-reply to customer
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx

VITE_OPENAI_API_KEY=sk-xxxxxxx
```

---

## 6. Run Locally

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. Done! 🎉

Test everything:
- ✅ Contact form → sends you an email + auto-replies to the user
- ✅ Pay Now → Razorpay checkout opens (use test card `4111 1111 1111 1111`)
- ✅ Privacy / Terms → popup opens
- ✅ Chatbot → bottom-right bubble, type anything

---

## 7. Deploy to Vercel (Go Live Today)

### a) Push to GitHub
```bash
git init
git add .
git commit -m "initial getcalls website"
git remote add origin https://github.com/YOUR_USERNAME/getcalls.git
git push -u origin main
```

### b) Deploy on Vercel
- Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
- Click **New Project** → import your `getcalls` repo
- Framework: **Vite** (auto-detected)
- Click **Deploy** — it's live in ~20 seconds

### c) Add Environment Variables on Vercel
- Go to your project → **Settings** → **Environment Variables**
- Add each key from your `.env` file one by one
- Click **Redeploy**

### d) Add Your Domain (optional but recommended)
- Buy a domain (e.g., `getcalls.in`) on Namecheap or Google Domains
- In Vercel → **Settings** → **Domains** → add your domain
- Update your DNS records as shown by Vercel
- SSL is automatic ✅

---

## 8. Go-Live Checklist ✅

- [ ] All `.env` keys filled in
- [ ] EmailJS template **To** field set to `{{to_email}}`
- [ ] Razorpay KYC completed (for live payments)
- [ ] Deployed on Vercel
- [ ] Test: submit contact form → check your Gmail
- [ ] Test: click Pay Now → enter test card → see success
- [ ] Test: open Privacy & Terms popups
- [ ] Test: chat with the AI bot
- [ ] Domain connected (if you have one)
- [ ] Share your URL with friends 🎉

---

## 9. Quick Reference — Your Details

| Item | Value |
|------|-------|
| Founder | Priyanshu Bhati |
| Phone | +91 9057278418 |
| Contact Email | priyanshubhati.dev@gmail.com |
| Leads Email | priyanshubhati2347@gmail.com |
| Starter Price | ₹2,000 |
| Pro Price | ₹8,000 |
| Business Price | ₹10,000 |

---

## 10. Razorpay Production Checklist

When you're ready to accept real payments:

1. **Complete KYC** on Razorpay dashboard (requires Aadhaar, PAN, bank details)
2. **Switch to live keys:**
   - Dashboard → Settings → API Keys → Generate Live Key
   - Update `.env`: `VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx`
   - Redeploy on Vercel with the live key
3. **Set up webhooks** (optional but recommended):
   - Dashboard → Settings → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/razorpay-webhook`
   - Events: `payment.authorized`, `payment.failed`
   - Use this to verify payments on your backend

---

## Questions?
Email: priyanshubhati.dev@gmail.com
