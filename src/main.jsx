import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import './styles.css'

const productGroups = [
  { title: 'Liquid Section', subtitle: 'Filtration and processing equipment for liquid applications', products: [
    { title: 'Sparkler Filter Press', text: 'Compact filtration for clear liquid separation.', image: 'imgi_2_sparkler-filter-press.png' },
    { title: 'Zero Hold-Up Filter Press', text: 'Complete evacuation with minimal product loss.', image: 'imgi_4_zero-hold-up-filter-press2.png' },
    { title: 'Inline Homogenizer', text: 'Precise emulsification and particle size reduction.', image: 'imgi_3_inline-homogenizer.png' },
    { title: 'ML Catch Pot', text: 'A safe, sanitary vessel for material collection.', image: 'imgi_5_ML-catch-pot.png' },
  ]},
  { title: 'Milling', subtitle: 'Size reduction for consistent particle distribution', products: [
    { title: 'Multi Mill', text: 'Versatile size reduction for production use.', image: 'imgi_6_multi-mill1.png' },
    { title: 'Colloid Mill', text: 'High-shear milling for fine particle reduction.', image: 'imgi_7_colloid-mill.png' },
  ]},
  { title: 'Coating', subtitle: 'Professional coating systems for tablets and capsules', products: [
    { title: 'Coating Pan', text: 'Uniform application for tablets and pills.', image: 'imgi_8_coating-pan.png' },
  ]},
  { title: 'Drying', subtitle: 'Efficient drying solutions for industrial manufacturing', products: [
    { title: 'Tray Dryer', text: 'An efficient batch drying solution.', image: 'imgi_10_tray-dryer.png' },
    { title: 'Vacuum Tray Dryer', text: 'Low-temperature drying for sensitive materials.', image: 'vacuum-tray-dryer.png' },
    { title: 'Fluid Bed Dryer', text: 'Uniform moisture removal with fluidized-bed technology.', image: 'imgi_12_fluid-bed-dryer3.png' },
    { title: 'Rotocon Vacuum Dryer', text: 'Rotary vacuum drying for dependable operation.', image: 'imgi_13_rotocon-vacuum-dryer-1.png' },
  ]},
  { title: 'Blending', subtitle: 'Mixing equipment for homogeneous powder blending', products: [
    { title: 'Octagonal Blender', text: 'Gentle mixing for uniform blend quality.', image: 'octagonal-blender.png' },
    { title: 'Double Cone Blender', text: 'Efficient powder blending with tumbling action.', image: 'imgi_15_double-cone-blender.png' },
    { title: 'Ribbon Blender', text: 'High-capacity mixing for dry powders.', image: 'imgi_16_ribbon-blender.png' },
  ]},
  { title: 'Specialty Equipment', subtitle: 'Additional equipment for complete production lines', products: [
    { title: 'Vibro Sifter', text: 'Precision screening and particle grading.', image: 'imgi_17_vibro-sifter-new1.png' },
    { title: 'Rapid Mixer Granulator', text: 'High-speed mixing and granulation in one unit.', image: 'imgi_18_rapid-mixer-granulator1.png' },
    { title: 'IPC Bin', text: 'Safe material handling and intermediate storage.', image: 'imgi_19_IPC-bin.png' },
    { title: 'WFI Storage Tank', text: 'Validated water-for-injection storage systems.', image: 'imgi_20_wfi-storage-tank-1.png' },
  ]},
]

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }

// Replace with your Formspree endpoint (formspree.io -> new form -> rk-enterprises.co address)
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

function ContactForm() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
      })
      setStatus(res.ok ? 'sent' : 'error')
      if (res.ok) e.target.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') return <div className="form-done"><h3>Message sent.</h3><p>Thanks for reaching out — our team will get back to you shortly.</p></div>

  return <form className="enquiry-form" onSubmit={handleSubmit}>
    <div className="form-row">
      <label>Name<input type="text" name="name" required /></label>
      <label>Company<input type="text" name="company" /></label>
    </div>
    <div className="form-row">
      <label>Email<input type="email" name="email" required /></label>
      <label>Phone<input type="tel" name="phone" /></label>
    </div>
    <label>What do you need?<textarea name="message" rows="4" required /></label>
    <button className="primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'} <span>→</span></button>
    {status === 'error' && <p className="form-error">Something went wrong — please call us instead, or try again.</p>}
  </form>
}

function ProductCard({ product, index }) {
  const card = useRef(null)
  const { scrollYProgress } = useScroll({ target: card, offset: ['start end', 'end start'] })
  const rotateY = useTransform(scrollYProgress, [0, .35, .7, 1], [index === 0 ? -18 : 18, 0, 0, index === 0 ? 14 : -14])
  const rotateX = useTransform(scrollYProgress, [0, .5, 1], [12, 0, -8])
  const y = useTransform(scrollYProgress, [0, .5, 1], [55, 0, -35])
  return <motion.article ref={card} style={{ rotateY, rotateX, y }} className="product-card">
    <span>{String(index + 1).padStart(2, '0')}</span><div className="product-image"><img src={`/machines/${product.image}`} alt={product.title} /></div>
    <div className="product-content"><h3>{product.title}</h3><p>{product.text}</p></div>
    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} aria-label={`Enquire about ${product.title}`}>↗</button>
  </motion.article>
}

function App() {
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const nav = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <>
    <motion.div className="scroll-progress" style={{ scaleX }} />
    <header className="nav">
      <button className="brand" onClick={() => nav('top')} aria-label="RK Enterprises home"><span>RK</span> ENTERPRISES</button>
      <nav className={open ? 'links open' : 'links'}>
        <button onClick={() => nav('about')}>About</button><button onClick={() => nav('products')}>Products</button><button onClick={() => nav('capabilities')}>Capabilities</button>
      </nav>
      <button className="nav-cta" onClick={() => nav('contact')}>Get a quote <b>↗</b></button>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '×' : '☰'}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="grid-glow" />
        <div className="hero-copy">
          <motion.p initial="hidden" animate="visible" variants={reveal} transition={{ duration: .5 }} className="eyebrow"><i /> PRECISION MANUFACTURING · INDIA</motion.p>
          <motion.h1 initial="hidden" animate="visible" variants={reveal} transition={{ delay: .08, duration: .7 }}>Built for the<br/><em>work that matters.</em></motion.h1>
          <motion.p initial="hidden" animate="visible" variants={reveal} transition={{ delay: .16, duration: .6 }} className="lead">Engineering industrial equipment that keeps ambitious production lines moving.</motion.p>
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ delay: .24, duration: .6 }} className="hero-actions">
            <button className="primary" onClick={() => nav('products')}>Explore our work <span>→</span></button>
            <button className="text-button" onClick={() => nav('contact')}>Talk to an engineer <span>↗</span></button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: .94, x: 35 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: .12 }} className="machine-wrap">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="scanline" />
          <img src="/machines/rk-hero-machine.png" alt="Stainless steel process equipment" />
          <div className="machine-tag"><span className="pulse" /> CUSTOM PROCESS EQUIPMENT</div>
          <div className="machine-mark">RKE<br/><small>01 / 03</small></div>
        </motion.div>
        <div className="hero-foot"><span>SCROLL TO DISCOVER</span><div className="scroll-line"/><span>ISO-ALIGNED PRODUCTION</span></div>
      </section>

      <section className="ticker" aria-label="Industries served"><div>PHARMACEUTICAL <b>✦</b> FOOD &amp; BEVERAGE <b>✦</b> CHEMICAL <b>✦</b> COSMETICS <b>✦</b> SPECIALTY PROCESSING <b>✦</b> PHARMACEUTICAL <b>✦</b></div></section>

      <section id="about" className="intro section">
        <motion.p whileInView="visible" initial="hidden" viewport={{ once: true }} variants={reveal} className="eyebrow dark"><i /> WHO WE ARE</motion.p>
        <motion.div whileInView="visible" initial="hidden" viewport={{ once: true }} variants={reveal} transition={{ delay: .08 }} className="intro-grid">
          <h2>Complex production<br/>deserves <em>clear thinking.</em></h2>
          <div><p>RK Enterprises pairs practical manufacturing experience with an exacting approach to detail. We make equipment that earns its place on your floor, shift after shift.</p><a href="#contact" onClick={(e) => { e.preventDefault(); nav('contact') }}>More about RK <span>→</span></a></div>
        </motion.div>
        <div className="stats"><div><strong>100<span>+</span></strong><small>PROJECTS DELIVERED</small></div><div><strong>24<span>/7</span></strong><small>PROJECT SUPPORT</small></div></div>
      </section>

      <section id="products" className="products section-dark">
        <div className="section-head"><div><p className="eyebrow"><i /> WHAT WE MAKE</p><h2>Equipment with<br/><em>intent.</em></h2></div><p>Designed for demanding operations. Made to fit the way you work.</p></div>
        <div className="product-categories">{productGroups.map((group, groupIndex) => <div className="product-group" key={group.title}>
          <div className="category-head"><span>0{groupIndex + 1}</span><div><h3>{group.title}</h3><p>{group.subtitle}</p></div></div>
          <div className="product-list">{group.products.map((product, index) => <ProductCard product={product} index={index} key={product.title} />)}</div>
        </div>)}</div>
      </section>

      <section id="capabilities" className="capabilities section">
        <div className="cap-image"><img src="/machines/rk-hero-machine.png" alt="RK Enterprises manufacturing equipment"/><div>DESIGNED TO<br/>PERFORM <span>↘</span></div></div>
        <div className="cap-copy"><p className="eyebrow dark"><i /> HOW WE WORK</p><h2>From drawing<br/>board to <em>delivery.</em></h2><div className="steps"><p><b>01</b><span><strong>Understand the process</strong>Every project starts with the details of your operation.</span></p><p><b>02</b><span><strong>Engineer the answer</strong>We match material, geometry and controls to the task.</span></p><p><b>03</b><span><strong>Build with accountability</strong>Made, tested and delivered by people who stand behind it.</span></p></div></div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-rings"/>
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow"><i /> START A CONVERSATION</p><h2>Let's build<br/><em>what's next.</em></h2><p>Tell us what you need. Our team will get back to you with a practical way forward.</p>
            <div className="contact-links">
              <a href="tel:+919028872590">Call +91 90288 72590 <span>→</span></a>
              <a href="tel:+919029751852">Call +91 90297 51852 <span>→</span></a>
              <a href="mailto:enquiry@rk-enterprises.co">enquiry@rk-enterprises.co <span>→</span></a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="locations section">
        <div className="locations-intro"><p className="eyebrow dark"><i /> FIND US</p><h2>Made close to<br/><em>the work.</em></h2><p>Manufacturing and support from Vasai-Virar, Maharashtra.</p></div>
        <div className="location-map-grid">
          <article className="location-card"><span>HEAD OFFICE</span><h3>A-1 Complex</h3><p>Gala no: B1 - U-16, A1 Industrial Estate, Kaman, Vasai-Virar, Maharashtra 421302</p><div className="location-phones"><a href="tel:+919028872590">+91 90288 72590 <b>↗</b></a><a href="tel:+919029751852">+91 90297 51852 <b>↗</b></a></div></article>
          <div className="location-map">
            <iframe title="RK Enterprises location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Gala+no+B1-U-16+A1+Industrial+Estate+Kaman+Vasai-Virar+Maharashtra+421302&output=embed" />
          </div>
        </div>
        <div className="business-strip"><div><span>GST NUMBER</span><b>27BDTPS0564A1ZE</b></div><div><span>BUSINESS HOURS</span><b>MON – SAT, 9:00 AM – 6:00 PM</b></div></div>
      </section>
    </main>
    <footer><button className="brand" onClick={() => nav('top')}><span>RK</span> ENTERPRISES</button><p>Engineered industrial solutions, made in India.</p><div><a href="tel:+919028872590">+91 90288 72590</a><a href="tel:+919029751852">+91 90297 51852</a><a href="mailto:enquiry@rk-enterprises.co">enquiry@rk-enterprises.co</a><span>© 2026 RK Enterprises</span></div></footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
