import React, { useState, useEffect } from 'react'
import { Modal, useModal } from './Modal'
import { useToast } from './Toast'
import emailjs from 'emailjs-com'

const phoneRe =
  /^(\+?\d{1,3}[\s-]?)?(\(?\d{1,4}\)?[\s-]?){1,3}\d{2,4}[\s-]?\d{2,6}$/

export default function ContactModal() {
  const { open, ctx, closeModal } = useModal()
  const { show: toast } = useToast()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    business_type: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ✅ RESET ONLY WHEN THIS MODAL OPENS
  useEffect(() => {
    if (open !== 'contact') return

    setForm({
      name: '',
      phone: '',
      email: '',
      business_type: '',
      message: '',
    })
    setErrors({})
    setLoading(false)
    setSuccess(false)
  }, [open])

  const change = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}

    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Enter your full name'

    if (!form.phone.trim() || !phoneRe.test(form.phone.trim()))
      errs.phone = 'Enter a valid phone number'

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    )
      errs.email = 'Enter a valid email'

    if (!form.business_type)
      errs.business_type = 'Pick a business type'

    if (!form.message.trim() || form.message.trim().length < 8)
      errs.message = 'Tell us a bit more (min 8 chars)'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const payload = {
      to_name: 'Priyanshu',
      from_name: form.name,
      from_email: form.email,
      from_phone: form.phone,
      business_type: form.business_type,
      message: form.message,
      plan: ctx?.plan || 'Not selected',
      reply_to: form.email,
      user_name: form.name,
    }

    try {
      await emailjs.send(serviceId, templateId, payload, publicKey)

      try {
        const autoReplyTemplate =
          import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID ||
          templateId + '_autoreply'

        await emailjs.send(
          serviceId,
          autoReplyTemplate,
          {
            to_email: form.email,
            user_name: form.name,
          },
          publicKey
        )
      } catch (_) {}

      setSuccess(true)
      toast("🎉 Request sent! We'll call you within 24 hours.", 'success', 4000)
    } catch (err) {
      console.error('EmailJS error:', err)
      toast('Something went wrong. Please try again.', 'error', 3500)
      setLoading(false)
    }
  }

  const Field = ({ name, label, placeholder, type = 'text', children }) => (
    <div className="form-group">
      <label>{label}</label>
      {children || (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={change}
          placeholder={placeholder}
          className={errors[name] ? 'err' : ''}
          autoComplete="off"
        />
      )}
      <span className="err-msg">{errors[name] || ''}</span>
    </div>
  )

  return (
    <Modal id="contact">
      {success ? (
        <div style={{ textAlign: 'center', padding: '28px 0 8px' }}>
          <span
            style={{
              fontSize: '3rem',
              display: 'block',
              marginBottom: 14,
            }}
          >
            🎉
          </span>
          <h4
            style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            You're all set!
          </h4>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '.84rem',
              lineHeight: 1.6,
            }}
          >
            Our team will call you within{' '}
            <strong style={{ color: '#fff' }}>24 hours</strong>.<br />
            We also sent a confirmation to{' '}
            <strong style={{ color: 'var(--accent)' }}>
              {form.email}
            </strong>
            .
          </p>
          <button
            className="btn btn-cyan"
            style={{ marginTop: 22 }}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {ctx?.plan && (
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(0,229,255,.1)',
                border: '1px solid rgba(0,229,255,.25)',
                color: 'var(--accent)',
                fontSize: '.72rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 50,
                textTransform: 'uppercase',
                letterSpacing: '.8px',
                marginBottom: 18,
              }}
            >
              📦 {ctx.plan} Plan
            </span>
          )}

          <h3
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-1px',
              marginBottom: 6,
            }}
          >
            Let's build your website 🚀
          </h3>

          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '.87rem',
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Fill in the details below and we'll get back to you within 24
            hours.
          </p>

          <Field name="name" label="Your Name" placeholder="John Smith" />
          <Field
            name="phone"
            label="Phone Number"
            placeholder="+1 234 567 8900"
            type="tel"
          />
          <Field
            name="email"
            label="Email Address"
            placeholder="john@email.com"
            type="email"
          />

          <Field name="business_type" label="Business Type">
            <select
              name="business_type"
              value={form.business_type}
              onChange={change}
              className={errors.business_type ? 'err' : ''}
            >
              <option value="" disabled>
                Select your business…
              </option>
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

          <Field name="message" label="What do you need?">
            <textarea
              name="message"
              value={form.message}
              onChange={change}
              placeholder="Tell us about your business and what kind of website you want…"
              className={errors.message ? 'err' : ''}
              rows={3}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 15,
              background: 'var(--accent)',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 50,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
              fontSize: '.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.55 : 1,
              marginTop: 8,
            }}
          >
            {loading ? 'Sending…' : 'Get Started →'}
          </button>
        </form>
      )}
    </Modal>
  )
}
