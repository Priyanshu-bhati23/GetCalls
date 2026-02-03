import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Modal, useModal } from './Modal'
import { useToast } from './Toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

/* ── inner payment form (must be inside <Elements>) ── */
function PaymentForm({ amount, plan, billing }) {
  const stripe   = useStripe()
  const elements = useElements()
  const { closeModal } = useModal()
  const { show: toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [cardReady, setCardReady] = useState(false)

  if (success) {
    return (
      <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
        <span style={{ fontSize:'3rem', display:'block', marginBottom:14 }}>💳✅</span>
        <h4 style={{ color:'#fff', fontSize:'1.1rem', fontWeight:700, marginBottom:8 }}>Payment Successful!</h4>
        <p style={{ color:'var(--text-dim)', fontSize:'.84rem', lineHeight:1.65 }}>
          Thanks for choosing the <strong style={{ color:'#fff' }}>{plan}</strong> plan.<br/>
          We'll start building your website immediately. Check your email for details.
        </p>
        <button className="btn btn-cyan" style={{ marginTop:22 }} onClick={() => closeModal()}>Close</button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    // In a real app you'd create a PaymentIntent on your backend first.
    // This is a demo flow: we confirm the card is valid via createToken.
    const { token, error: tokenErr } = await stripe.createToken(elements.getElement(CardElement))

    if (tokenErr) {
      setError(tokenErr.message)
      setLoading(false)
      return
    }

    // Simulate server charge (1.2s delay)
    await new Promise(r => setTimeout(r, 1200))

    // Demo: always succeed after token is valid
    setSuccess(true)
    toast('🎉 Payment successful! We\'ll start your website now.', 'success', 4500)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Plan summary card */}
      <div style={{
        background:'rgba(0,229,255,.06)', border:'1px solid rgba(0,229,255,.2)',
        borderRadius:14, padding:'18px 20px', marginBottom:22, display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <div>
          <p style={{ color:'var(--text-mid)', fontSize:'.76rem', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600, marginBottom:4 }}>Plan</p>
          <p style={{ color:'#fff', fontSize:'1rem', fontWeight:700 }}>{plan}</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ color:'var(--text-mid)', fontSize:'.76rem', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600, marginBottom:4 }}>Total</p>
          <p style={{ color:'var(--accent)', fontFamily:"'Syne',sans-serif", fontSize:'1.4rem', fontWeight:800, letterSpacing:'-1px' }}>₹{amount.toLocaleString()}</p>
        </div>
      </div>

      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.3rem', fontWeight:800, color:'#fff', letterSpacing:'-0.8px', marginBottom:6 }}>
        💳 Card Details
      </h3>
      <p style={{ color:'var(--text-dim)', fontSize:'.82rem', marginBottom:18 }}>Secured by Stripe. We never store your card.</p>

      {/* Stripe CardElement */}
      <div style={{
        background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)',
        borderRadius:12, padding:'14px 16px', marginBottom: error ? 8 : 18
      }}>
        <CardElement
          onChange={e => { setCardReady(e.complete); if (e.error) setError(e.error.message) }}
          style={{
            base: { color:'#fff', fontSize:'16px', fontFamily:"'DM Sans',sans-serif", '::placeholder':{ color:'#6a6a7c' } },
            invalid: { color:'#ff6b6b' }
          }}
        />
      </div>

      {error && <p style={{ color:'#ff6b6b', fontSize:'.76rem', marginBottom:12 }}>{error}</p>}

      {/* Secure badge row */}
      <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
        {['🔒 SSL Encrypted','🛡️ PCI Compliant','✅ Secure Checkout'].map((b, i) => (
          <span key={i} style={{ fontSize:'.72rem', color:'var(--text-dim)', fontWeight:500 }}>{b}</span>
        ))}
      </div>

      <button type="submit" disabled={loading || !cardReady || !stripe} style={{
        width:'100%', padding:'15px', background:'var(--accent)', color:'#0a0a0a',
        border:'none', borderRadius:50,
        fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'1rem',
        cursor: (loading || !cardReady) ? 'not-allowed' : 'pointer',
        opacity: (loading || !cardReady) ? .5 : 1,
        transition:'opacity .2s, box-shadow .2s'
      }}
        onMouseEnter={e => (!loading && cardReady) && (e.target.style.boxShadow='0 8px 28px var(--accent-glow)')}
        onMouseLeave={e => (e.target.style.boxShadow='none')}
      >
        {loading ? <><span className="spinner"/>Processing…</> : `Pay ₹${amount.toLocaleString()} Now`}
      </button>
    </form>
  )
}

/* ── exported wrapper ── */
export default function StripeModal() {
  const { ctx } = useModal()
  const amount = ctx?.amount || 0
  const plan   = ctx?.plan   || 'Pro'
  const billing= ctx?.billing|| 'once'

  return (
    <Modal id="stripe" maxWidth={440}>
      <Elements stripe={stripePromise}>
        <PaymentForm amount={amount} plan={plan} billing={billing}/>
      </Elements>
    </Modal>
  )
}
