import React, { useState, useRef, useEffect } from 'react'
import { Modal, useModal } from './Modal'
import { useToast } from './Toast'
import emailjs from 'emailjs-com'

/* ── init EmailJS once at module load (v3 requirement) ── */
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY)

const phoneRe = /^(\+?\d{1,3}[\s-]?)?(\(?\d{1,4}\)?[\s-]?){1,3}\d{2,4}[\s-]?\d{2,6}$/

/* ── Field — outside the component so identity is stable ── */
function Field({ name, label, placeholder, type = 'text', value, error, onChange, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children || (
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} className={error ? 'err' : ''} autoComplete="off"/>
      )}
      <span className="err-msg">{error || ''}</span>
    </div>
  )
}

/* ── mailto fallback: opens user's native email client ── */
function openMailtoFallback(form, plan) {
  const subject = encodeURIComponent(`[GetCalls] New Lead — ${plan || 'General'} — ${form.name}`)
  const body    = encodeURIComponent(
    `Hi Priyanshu,\n\nNew lead from your website!\n\n` +
    `Name:     ${form.name}\n` +
    `Email:    ${form.email}\n` +
    `Phone:    ${form.phone}\n` +
    `Business: ${form.business_type}\n` +
    `Plan:     ${plan || 'Not selected'}\n\n` +
    `Message:  ${form.message}\n`
  )
  window.open(`mailto:priyanshubhati2347@gmail.com?subject=${subject}&body=${body}`, '_blank')
}

export default function ContactModal() {
  const { open, ctx, closeModal } = useModal()
  const { show: toast }           = useToast()

  const [form,    setForm]    = useState({ name:'', phone:'', email:'', business_type:'', message:'' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const wasOpen                = useRef(false)

  useEffect(() => {
    const isOpen = open === 'contact'
    if (isOpen && !wasOpen.current) {
      setForm({ name:'', phone:'', email:'', business_type:'', message:'' })
      setErrors({})
      setLoading(false)
      setSuccess(false)
    }
    wasOpen.current = isOpen
  }, [open])

  const change = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()  || form.name.trim().length < 2)      errs.name          = 'Enter your full name'
    if (!form.phone.trim() || !phoneRe.test(form.phone.trim())) errs.phone         = 'Enter a valid phone number'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email'
    if (!form.business_type)                                     errs.business_type = 'Pick a business type'
    if (!form.message.trim() || form.message.trim().length < 8) errs.message       = 'Tell us a bit more (min 8 chars)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  /* ════════════════════════════════════════════════════════════════════
     sendOwnerNotification — sends lead details to YOU (Priyanshu)
     ════════════════════════════════════════════════════════════════════ */
  const sendOwnerNotification = async () => {
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId || !PUBLIC_KEY) {
      return { ok: false, reason: 'env' }
    }

    /* ──────────────────────────────────────────────────────────────────
       OWNER EMAIL TEMPLATE SETUP (EmailJS Dashboard):
       
       To:       priyanshubhati2347@gmail.com    (hardcoded in template)
       Reply-To: {{reply_to}}                     (customer's email)
       Subject:  🔔 New Lead — {{plan}} — {{customer_name}}
       
       Body:
       Hi Priyanshu,

       New lead from your website!

       Name:     {{customer_name}}
       Email:    {{customer_email}}
       Phone:    {{customer_phone}}
       Business: {{business_type}}
       Plan:     {{plan}}

       Message:
       {{message}}

       —
       Reply to this email to contact the customer directly.
       Sent via GetCalls
       ────────────────────────────────────────────────────────────────── */

    const ownerPayload = {
      // ── Customer details (the person who filled the form) ──
      customer_name:  form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      
      // ── Reply-To header: when you hit reply, it goes to the customer ──
      reply_to: form.email,
      
      // ── Lead details ──
      business_type: form.business_type,
      message:       form.message,
      plan:          ctx?.plan || 'Not selected',
      
      // ── These are for template compatibility (in case you use them) ──
      from_name:  form.name,
      from_email: form.email,
      from_phone: form.phone,
    }

    console.log('📬 Owner notification payload →', ownerPayload)

    try {
      const res = await emailjs.send(serviceId, templateId, ownerPayload)
      console.log('✅ Owner email sent:', res)
      return { ok: true }
    } catch (err) {
      console.error('❌ Owner email failed:', err, 'status:', err?.status, 'text:', err?.text)
      return { ok: false, reason: err?.text || 'unknown' }
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     sendCustomerConfirmation — sends "thank you" email to the CUSTOMER
     ════════════════════════════════════════════════════════════════════ */
  const sendCustomerConfirmation = async () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const autoId    = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID
    
    console.log('🔍 Customer email check:', {
      serviceId: serviceId ? '✓ set' : '✗ missing',
      autoId: autoId ? '✓ set' : '✗ missing',
      customerEmail: form.email
    })

    if (!autoId || !serviceId) {
      console.warn('⚠️ Auto-reply template not configured in .env — customer will NOT receive confirmation email')
      console.warn('   Add VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID to your .env file')
      return
    }

    /* ──────────────────────────────────────────────────────────────────
       CUSTOMER CONFIRMATION TEMPLATE SETUP (EmailJS Dashboard):
       
       CRITICAL: The "To" field in the template editor must be set to
       one of these variables (they all point to the same email):
       
       To:       {{customer_email}}    ← RECOMMENDED
       OR        {{to_email}}
       OR        {{email}}
       
       Reply-To: priyanshubhati.dev@gmail.com
       Subject:  Thanks for reaching out — GetCalls ✨
       
       Body:
       Hi {{customer_name}},

       Thank you for trusting us! 🎉

       We received your request and our team will personally call you 
       within 24 hours to discuss your website.

       In the meantime, if you have any questions, feel free to reply 
       to this email or call us:
       📞 +91 9057278418
       📧 priyanshubhati.dev@gmail.com

       Looking forward to building something amazing together!

       Warm regards,
       Priyanshu Bhati
       GetCalls
       ────────────────────────────────────────────────────────────────── */

    const customerPayload = {
      // ── ALL possible "To" variable names (covers any template setup) ──
      customer_email: form.email,
      to_email:       form.email,
      email:          form.email,
      user_email:     form.email,
      from_email:     form.email,
      
      // ── Personalization (all possible name variables) ──
      customer_name: form.name,
      user_name:     form.name,
      name:          form.name,
      from_name:     form.name,
      
      // ── Reply-To: when customer hits reply, it goes to YOUR email ──
      reply_to: 'priyanshubhati.dev@gmail.com',
    }

    console.log('📬 Customer confirmation payload →', customerPayload)

    try {
      const res = await emailjs.send(serviceId, autoId, customerPayload)
      console.log('✅ Customer confirmation sent successfully:', res)
      console.log(`   Email sent to: ${form.email}`)
    } catch (err) {
      // Log the full error so we can debug
      console.error('❌ Customer confirmation FAILED:', err)
      console.error('   Status:', err?.status)
      console.error('   Text:', err?.text)
      console.error('   Message:', err?.message)
      
      if (err?.text?.includes('recipients')) {
        console.error('   ⚠️  FIX: Go to EmailJS → your auto-reply template → set To field to: {{customer_email}}')
      }
      
      // Still non-blocking — owner email already sent
    }
  }

  /* ── main submit ── */
  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // 1) Send notification to owner (YOU)
    const result = await sendOwnerNotification()

    if (!result.ok) {
      console.warn('⚠️ EmailJS failed, falling back to mailto:', result.reason)
      
      // Fallback: open mailto window
      openMailtoFallback(form, ctx?.plan)
      toast('📧 Email window opened! Send it to complete your request.', 'info', 4500)
      setSuccess(true)
      setLoading(false)
      return
    }

    // 2) Send confirmation to customer (fire and forget, but log everything)
    sendCustomerConfirmation()

    setSuccess(true)
    toast('🎉 Request sent! We\'ll call you within 24 hours.', 'success', 4000)
    setLoading(false)
  }

  /* ── render ── */
  return (
    <Modal id="contact">
      {success ? (
        <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
          <span style={{ fontSize:'3rem', display:'block', marginBottom:14 }}>🎉</span>
          <h4 style={{ color:'#fff', fontSize:'1.1rem', fontWeight:700, marginBottom:8 }}>You're all set!</h4>
          <p style={{ color:'var(--text-dim)', fontSize:'.84rem', lineHeight:1.6 }}>
            Our team will call you within <strong style={{ color:'#fff' }}>24 hours</strong> to discuss your website.<br/>
            We also sent a confirmation to <strong style={{ color:'var(--accent)' }}>{form.email}</strong>.
          </p>
          <button className="btn btn-cyan" style={{ marginTop:22 }} onClick={() => closeModal()}>Close</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {ctx?.plan && (
            <span style={{
              display:'inline-block', background:'rgba(0,229,255,.1)', border:'1px solid rgba(0,229,255,.25)',
              color:'var(--accent)', fontSize:'.72rem', fontWeight:700, padding:'4px 12px',
              borderRadius:50, textTransform:'uppercase', letterSpacing:'.8px', marginBottom:18
            }}>📦 {ctx.plan} Plan</span>
          )}

          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.55rem', fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:6 }}>
            Let's build your website 🚀
          </h3>
          <p style={{ color:'var(--text-dim)', fontSize:'.87rem', lineHeight:1.6, marginBottom:24 }}>
            Fill in the details below and we'll get back to you within 24 hours.
          </p>

          <Field name="name"  label="Your Name"     placeholder="John Smith"       value={form.name}  error={errors.name}  onChange={change}/>
          <Field name="phone" label="Phone Number"  placeholder="+1 234 567 8900" type="tel"   value={form.phone} error={errors.phone} onChange={change}/>
          <Field name="email" label="Email Address" placeholder="john@email.com"  type="email" value={form.email} error={errors.email} onChange={change}/>

          <Field name="business_type" label="Business Type" error={errors.business_type} onChange={change}>
            <select name="business_type" value={form.business_type} onChange={change} className={errors.business_type ? 'err' : ''}>
              <option value="" disabled>Select your business…</option>
              <option value="coach">Coach / Trainer</option>
              <option value="freelancer">Freelancer</option>
              <option value="shop">Shop / Retail</option>
              <option value="service">Service Business</option>
              <option value="food">Food / Restaurant</option>
              <option value="real-estate">Real Estate</option>
              <option value="agency">Agency</option>
              <option value="saas">SaaS / Tech</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field name="message" label="What do you need?" error={errors.message} onChange={change}>
            <textarea name="message" value={form.message} onChange={change}
              placeholder="Tell us about your business and what kind of website you want…"
              className={errors.message ? 'err' : ''} rows={3}/>
          </Field>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:15, background:'var(--accent)', color:'#0a0a0a',
            border:'none', borderRadius:50,
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? .55 : 1,
            transition:'transform .2s, box-shadow .2s, opacity .2s', marginTop:8
          }}
            onMouseEnter={e => !loading && (e.target.style.boxShadow='0 8px 28px var(--accent-glow)')}
            onMouseLeave={e => (e.target.style.boxShadow='none')}
          >
            {loading ? <><span className="spinner"/>Sending…</> : 'Get Started →'}
          </button>
        </form>
      )}
    </Modal>
  )
}
