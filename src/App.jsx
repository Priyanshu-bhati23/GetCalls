import React from 'react'
import { ToastProvider } from './components/Toast'
import { ModalProvider } from './components/Modal'

import Nav            from './components/Nav'
import Hero           from './components/Hero'
import Problem        from './components/Problem'
import Solution       from './components/Solution'
import Features       from './components/Features'
import Pricing        from './components/Pricing'
import Cta            from './components/Cta'
import Footer         from './components/Footer'
import ContactModal   from './components/ContactModal'
import PolicyModal    from './components/PolicyModal'
import StripeModal    from './components/StripeModal'
import ChatBot        from './components/ChatBot'

export default function App() {
  return (
    <ModalProvider>
      <ToastProvider>
        {/* Ambient background orbs */}
        <div className="orb orb-1"/>
        <div className="orb orb-2"/>
        <div className="orb orb-3"/>

        <Nav/>
        <Hero/>
        <Problem/>
        <Solution/>
        <Features/>
        <Pricing/>
        <Cta/>
        <Footer/>

        {/* Modals */}
        <ContactModal/>
        <PolicyModal/>
        <StripeModal/>

        {/* AI Chatbot */}
        <ChatBot/>
      </ToastProvider>
    </ModalProvider>
  )
}
