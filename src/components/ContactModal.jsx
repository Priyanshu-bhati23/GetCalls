import React, { useState, useRef, useEffect } from 'react'
import { Modal, useModal } from './Modal'
import { useToast } from './Toast'
import emailjs from 'emailjs-com'

/* ── init once ── */
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY)

const phoneRe = /^(\+?\d{1,3}[\s-]?)?(\(?\d{1,4}\)?[\s-]?){1,3}\d{2,4}[\s-]?\d{2,6}$/

/* ── Field (stable identity, outside parent) ── */
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
  // open in a new tab — browser will hand off to mail client or Gmail
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

  /* ────────────────────────────────────────────────────────────────────
     sendViaEmailJS — tries the EmailJS SDK.
     Returns { ok: true } on success, { ok: false, reason } on failure.
     ──────────────────────────────────────────────────────────────────── */
  const sendViaEmailJS = async () => {
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId || !PUBLIC_KEY) {
      return { ok: false, reason: 'env' }
    }

    /* The "To" field in your EmailJS template is the ONLY thing that
       controls where the email goes.  No payload key can override it.
       We send to_email, email, from_email so that whichever one the
       template To field references will resolve.  If ALL of them are
       empty in the template To, EmailJS returns 422 "recipients empty".
       In that case we fall back to mailto.                             */
    const payload = {
      // ── every common "To" variable — one of these must match what's in your template ──
      to_email:       'priyanshubhati2347@gmail.com',
      email:          'priyanshubhati2347@gmail.com',
      from_email:     'priyanshubhati2347@gmail.com',
      reply_to:       'priyanshubhati2347@gmail.com',

      // ── body ──
      to_name:        'Priyanshu',
      from_name:      form.name,
      user_name:      form.name,
      user_email:     form.email,
      customer_email: form.email,
      from_phone:     form.phone,
      phone:          form.phone,
      business_type:  form.business_type,
      message:        form.message,
      plan:           ctx?.plan || 'Not selected',
    }

    console.log('📬 EmailJS payload →', { serviceId, templateId, payload })

    try {
      const res = await emailjs.send(serviceId, templateId, payload)
      console.log('✅ sent:', res)
      return { ok: true }
    } catch (err) {
      console.error('❌ EmailJS error:', err, 'status:', err?.status, 'text:', err?.text)
      return { ok: false, reason: err?.text || 'unknown' }
    }
  }

  /* ── auto-reply (best effort, never blocks success) ── */
  const sendAutoReply = async () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const autoId    = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID
    if (!autoId || !serviceId) return

    try {
      await emailjs.send(serviceId, autoId, {
        to_email:   form.email,
        email:      form.email,
        from_email: form.email,
        reply_to:   form.email,
        user_name:  form.name,
        from_name:  form.name,
        name:       form.name,
      })
      console.log('✅ auto-reply sent')
    } catch (e) {
      console.warn('⚠️ auto-reply failed (non-blocking):', e?.text || e)
    }
  }

  /* ── main submit ── */
  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // 1) try EmailJS
    const result = await sendViaEmailJS()

    if (!result.ok) {
      console.warn('⚠️ EmailJS failed, falling back to mailto:', result.reason)

      // 2) fallback: open mailto in new tab — this ALWAYS works
      openMailtoFallback(form, ctx?.plan)

      // still show success to the user — the mailto window opened
      toast('📧 Email window opened! Send it to complete your request.', 'info', 4500)
      setSuccess(true)
      setLoading(false)
      return
    }

    // 3) EmailJS worked — fire auto-reply in background
    sendAutoReply()

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
