import React, { useState, useEffect } from 'react'
import { Modal, useModal } from './Modal'
import { useToast } from './Toast'

/* ════════════════════════════════════════════════════════════════════
   RazorpayModal — replaces StripeModal for Indian payments
   
   Razorpay flow:
   1. Load Razorpay checkout.js script (happens once in index.html)
   2. When user clicks Pay Now → open this modal
   3. Modal shows summary + "Proceed to Payment" button
   4. Click → launches Razorpay's hosted checkout (popup)
   5. User pays → success callback → we show success screen
   
   Setup required:
   - Get Razorpay account at https://razorpay.com
   - Dashboard → Settings → API Keys → copy Key ID (starts with rzp_test_)
   - Add to .env as VITE_RAZORPAY_KEY_ID
   - For production, create orders via your backend + verify signature
   ════════════════════════════════════════════════════════════════════ */

export default function RazorpayModal() {
  const { ctx, closeModal } = useModal()
  const { show: toast }     = useToast()
  const [success, setSuccess] = useState(false)

  const amount  = ctx?.amount || 0
  const plan    = ctx?.plan   || 'Pro'
  const billing = ctx?.billing || 'once'

  // Reset success when modal reopens
  useEffect(() => {
    setSuccess(false)
  }, [ctx])

  const handlePayment = () => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

    if (!keyId || keyId === 'rzp_test_xxxxxxx') {
      toast('Razorpay not configured. Check .env file.', 'error', 3500)
      console.error('❌ VITE_RAZORPAY_KEY_ID not set in .env')
      return
    }

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      toast('Razorpay script not loaded. Check index.html.', 'error', 3500)
      console.error('❌ Razorpay script missing from index.html')
      return
    }

    const options = {
      key: keyId,
      amount: amount * 100,  // Razorpay expects paise (₹1 = 100 paise)
      currency: 'INR',
      name: 'GetCalls',
      description: `${plan} Plan — ${billing === 'monthly' ? 'Monthly' : 'One-time'}`,
      image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="%230a0a0b"/><text x="6" y="23" font-size="20" fill="%2300e5ff" font-family="sans-serif" font-weight="bold">G</text></svg>',
      
      /* ── prefill customer details ── */
      prefill: {
        name:  '',
        email: '',
        contact: '',
      },

      /* ── theming ── */
      theme: {
        color: '#00e5ff',  // your accent color
      },

      /* ── success handler ── */
      handler: function(response) {
        console.log('✅ Razorpay payment success:', response)
        // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        
        // In production, send these to your backend to verify the signature
        // For now we trust the frontend callback (demo mode)
        
        setSuccess(true)
        toast('🎉 Payment successful! We\'ll start your website now.', 'success', 4500)
      },

      /* ── error/cancel handler ── */
      modal: {
        ondismiss: function() {
          console.log('⚠️ Razorpay checkout closed by user')
          toast('Payment cancelled', 'info', 2500)
        }
      }
    }

    const rzp = new window.Razorpay(options)

    rzp.on('payment.failed', function(response) {
      console.error('❌ Razorpay payment failed:', response.error)
      toast(`Payment failed: ${response.error.description}`, 'error', 3500)
    })

    // Open Razorpay checkout popup
    rzp.open()
  }

  return (
    <Modal id="razorpay" maxWidth={440}>
      {success ? (
        /* ── success screen ── */
        <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
          <span style={{ fontSize:'3rem', display:'block', marginBottom:14 }}>💳✅</span>
          <h4 style={{ color:'#fff', fontSize:'1.1rem', fontWeight:700, marginBottom:8 }}>Payment Successful!</h4>
          <p style={{ color:'var(--text-dim)', fontSize:'.84rem', lineHeight:1.65 }}>
            Thanks for choosing the <strong style={{ color:'#fff' }}>{plan}</strong> plan.<br/>
            We'll start building your website immediately. Check your email for details.
          </p>
          <button className="btn btn-cyan" style={{ marginTop:22 }} onClick={() => closeModal()}>Close</button>
        </div>
      ) : (
        /* ── payment summary + proceed button ── */
        <div>
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
            💳 Secure Payment via Razorpay
          </h3>
          <p style={{ color:'var(--text-dim)', fontSize:'.82rem', marginBottom:18 }}>
            Pay securely with cards, UPI, wallets, or net banking. Razorpay is India's most trusted payment gateway.
          </p>

          {/* Payment methods preview */}
          <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:'.7rem', color:'var(--text-dim)', textTransform:'uppercase', fontWeight:600, letterSpacing:'.8px' }}>Accepted:</span>
            {['💳 Cards','📱 UPI','💰 Wallets','🏦 Net Banking'].map((m, i) => (
              <span key={i} style={{
                fontSize:'.72rem', color:'var(--text-mid)', fontWeight:500,
                background:'rgba(255,255,255,.04)', padding:'4px 10px', borderRadius:8
              }}>{m}</span>
            ))}
          </div>

          {/* Security badges */}
          <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
            {['🔒 256-bit SSL','✅ PCI DSS Compliant','🛡️ Secure by Razorpay'].map((b, i) => (
              <span key={i} style={{ fontSize:'.72rem', color:'var(--text-dim)', fontWeight:500 }}>{b}</span>
            ))}
          </div>

          {/* Proceed button */}
          <button onClick={handlePayment} style={{
            width:'100%', padding:'15px', background:'var(--accent)', color:'#0a0a0a',
            border:'none', borderRadius:50,
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'1rem',
            cursor:'pointer', transition:'box-shadow .2s'
          }}
            onMouseEnter={e => e.target.style.boxShadow='0 8px 28px var(--accent-glow)'}
            onMouseLeave={e => e.target.style.boxShadow='none'}
          >
            Proceed to Payment — ₹{amount.toLocaleString()}
          </button>

          <p style={{ fontSize:'.7rem', color:'var(--text-dim)', textAlign:'center', marginTop:12 }}>
            You'll be redirected to Razorpay's secure checkout
          </p>
        </div>
      )}
    </Modal>
  )
}
