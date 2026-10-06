// Builds the printable RK Enterprises catalogue (A4 PDF) from the v2 site's product data.
// Run: node build.mjs   →  catalog.html + RK-Enterprises-Catalogue.pdf
import { writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'
import { products, stages, productsIn, company, sheetNo } from '../src/data/products.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const url = (...p) => pathToFileURL(path.join(here, ...p)).href
const fonts = (f) => url('..', 'node_modules', ...f.split('/'))
const machineImg = (p) => url('..', 'public', 'machines', p.image)

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const N = products.length
const SITE = 'https://rk-enterprises.co'
const PRODUCT_PAGE_START = 4
const perPage = 2
const pageOf = (p) => PRODUCT_PAGE_START + Math.floor(products.indexOf(p) / perPage)
const bySlug = (s) => products.find((p) => p.slug === s)
const totalPages = PRODUCT_PAGE_START - 1 + Math.ceil(N / perPage) + 2 // + enquiry sheet + back cover

const qr = await QRCode.toString(SITE, { type: 'svg', margin: 0, color: { dark: '#13212A', light: '#FFFFFF' } })

const css = `
@font-face{font-family:'Archivo';src:url(${fonts('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
${[400, 500, 600].map((w) => `@font-face{font-family:'Plex';src:url(${fonts(`@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${w}-normal.woff2`)}) format('woff2');font-weight:${w}}`).join('')}
${[400, 500].map((w) => `@font-face{font-family:'PlexMono';src:url(${fonts(`@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${w}-normal.woff2`)}) format('woff2');font-weight:${w}}`).join('')}
@page{size:A4;margin:0}
:root{--paper:#F3F4F1;--line:#D2D8D6;--line-strong:#A7B2B4;--ink:#13212A;--ink-2:#43525A;--ink-3:#5C6A70;--accent:#C2481A;--accent-line:#E8622E;--wash:#FBEBE3}
*{box-sizing:border-box}
html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:400 9pt/1.5 'Plex',Arial,sans-serif;color:var(--ink);background:#dfe3e1}
h1,h2,h3,h4,p,ul,ol,dl,dd,figure{margin:0;padding:0}
ul,ol{list-style:none}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fff;page-break-after:always;break-after:page}
@media screen{.page{margin:8mm auto;box-shadow:0 2mm 8mm rgba(0,0,0,.18)}}
.display{font-family:'Archivo',Arial Narrow,sans-serif;font-stretch:72%;font-weight:760;text-transform:uppercase;letter-spacing:-.005em;line-height:.94}
.note{font:500 6.5pt/1.4 'PlexMono',monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}
.num{font-family:'PlexMono',monospace;font-variant-numeric:tabular-nums}
.accent{color:var(--accent)}
.grid-paper{background-image:linear-gradient(var(--line) .2mm,transparent .2mm),linear-gradient(90deg,var(--line) .2mm,transparent .2mm);background-size:8mm 8mm;background-color:#fff}

/* running header / footer */
.hd,.ft{position:absolute;left:14mm;right:14mm;display:flex;justify-content:space-between;align-items:center}
.hd{top:9mm;padding-bottom:2mm;border-bottom:.3mm solid var(--line-strong)}
.ft{bottom:8mm;padding-top:2mm;border-top:.3mm solid var(--line-strong)}
.hd b{color:var(--ink);font-weight:500}
.body{position:absolute;left:14mm;right:14mm;top:22mm;bottom:17mm}

/* cover */
.cover{padding:16mm 16mm 14mm;display:flex;flex-direction:column}
.cover .top{display:flex;justify-content:space-between;align-items:flex-start}
.cover .logo{width:64mm;height:auto;display:block;background:#fff;padding:3mm 4mm;box-sizing:content-box;margin:-3mm 0 0 -4mm}
.cover h1{font-size:64pt;margin-top:18mm}
.cover h1 span{display:block;color:var(--accent)}
.cover .lead{max-width:118mm;font-size:11pt;line-height:1.55;color:var(--ink-2);margin-top:8mm}
.plate-dark{position:relative;margin-top:auto;height:98mm;background:var(--ink);overflow:hidden}
.plate-dark img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%}
.plate-dark .tag{position:absolute;left:6mm;top:6mm;color:#fff;background:rgba(19,33,42,.72);padding:1.6mm 2.4mm;border:.2mm solid rgba(255,255,255,.4)}
.title-block{display:grid;grid-template-columns:repeat(4,1fr);border-top:.5mm solid var(--ink);margin-top:6mm}
.title-block>div{padding:3mm 3mm 0 0}
.title-block>div+div{padding-left:3mm;border-left:.2mm solid var(--line)}
.title-block dd{font:500 12pt/1.2 'PlexMono',monospace;margin-top:1mm}
.cover .contact-line{margin-top:6mm;display:flex;justify-content:space-between;font-size:8.5pt;color:var(--ink-2)}

/* about */
.about h2{font-size:38pt}
.about .lead{font-size:11pt;line-height:1.6;color:var(--ink-2);max-width:150mm;margin-top:6mm}
.about .banner{position:relative;height:62mm;background:var(--ink);margin:9mm 0 8mm;overflow:hidden}
.about .banner img{width:100%;height:100%;object-fit:cover;object-position:center 55%}
.facts{display:grid;grid-template-columns:repeat(3,1fr);border-top:.5mm solid var(--ink);border-bottom:.2mm solid var(--line)}
.facts>div{padding:4mm 4mm 4mm 0}
.facts>div+div{padding-left:5mm;border-left:.2mm solid var(--line)}
.facts b{display:block;font:500 22pt/1.1 'PlexMono',monospace;margin-top:1mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12mm;margin-top:9mm}
.two h3,.sec-h{font-family:'Archivo',sans-serif;font-stretch:88%;font-weight:680;font-size:12pt;text-transform:uppercase;margin-bottom:3mm}
.steps{border-top:.5mm solid var(--ink);counter-reset:s}
.steps li{counter-increment:s;display:grid;grid-template-columns:9mm 1fr;padding:3.2mm 0;border-bottom:.2mm solid var(--line)}
.steps li::before{content:counter(s,decimal-leading-zero);font:500 8pt/1.8 'PlexMono',monospace;color:var(--accent);grid-row:span 2}
.steps strong{font:680 10pt 'Archivo',sans-serif;font-stretch:88%}
.steps p{color:var(--ink-2);font-size:8.5pt}
.ind{border-top:.5mm solid var(--ink)}
.ind li{padding:3mm 0;border-bottom:.2mm solid var(--line)}
.ind strong{font:680 10pt 'Archivo',sans-serif;font-stretch:88%;display:block}
.ind span{font-size:8.5pt;color:var(--ink-2)}

/* contents */
.contents h2{font-size:34pt}
.contents .sub{color:var(--ink-2);font-size:10pt;margin-top:3mm;max-width:130mm}
.stgrid{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:8mm;align-items:stretch}
.stcard{border:.25mm solid var(--line-strong);background:#fff}
.stcard{display:grid;grid-template-columns:36mm 1fr}
.stcard .im{display:grid;place-items:center;border-right:.25mm solid var(--line);background:#fff;padding:2mm}
.stcard .im img{width:100%;height:auto;max-height:100%;object-fit:contain}
.stcard .bd{padding:3.5mm 4mm 3mm}
.stcard h3{font:680 12pt/1.15 'Archivo',sans-serif;font-stretch:88%;text-transform:uppercase}
.stcard p{color:var(--ink-2);font-size:8pt;margin:1mm 0 2.5mm;line-height:1.4}
.stcard li{display:flex;align-items:baseline;gap:1.5mm;padding:1.2mm 0;border-top:.2mm solid var(--line);font-size:8.6pt;font-weight:500}
.stcard li i{flex:1;border-bottom:.2mm dotted var(--line-strong);transform:translateY(-1mm)}
.stcard li .num{color:var(--accent);font-size:7.5pt}

/* machine sheets */
.mach{height:125mm;border-top:.6mm solid var(--ink);padding-top:3mm;display:flex;flex-direction:column}
.mach+.mach{margin-top:8mm}
.mach .row{display:flex;justify-content:space-between;align-items:baseline}
.mach h2{font-size:24pt;margin:1.5mm 0 4mm}
.mach .cols{display:grid;grid-template-columns:70mm 1fr;gap:8mm;flex:1;min-height:0}
.plate{width:70mm;aspect-ratio:375/285;background:#fff;border:.25mm solid var(--line-strong);display:grid;place-items:center;position:relative}
.plate img{width:100%;height:100%;object-fit:contain;padding:2mm}
.plate::before,.plate::after{content:'';position:absolute;width:4mm;height:4mm;border:.5mm solid var(--accent-line)}
.plate::before{left:-.5mm;top:-.5mm;border-right:0;border-bottom:0}
.plate::after{right:-.5mm;bottom:-.5mm;border-left:0;border-top:0}
.apps{margin-top:4mm}
.apps h4,.rc h4{font:500 6.5pt/1.4 'PlexMono',monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:1.5mm}
.apps li{position:relative;padding:.9mm 0 .9mm 4mm;font-size:8.6pt;border-bottom:.2mm solid var(--line)}
.apps li::before{content:'';position:absolute;left:0;top:2.1mm;width:1.6mm;height:1.6mm;background:var(--accent)}
.rc{display:flex;flex-direction:column;gap:3.6mm;min-width:0}
.summary{font-size:9.6pt;line-height:1.5;color:var(--ink)}
.how ol{counter-reset:h}
.how li{counter-increment:h;position:relative;padding:.8mm 0 .8mm 7mm;font-size:8.3pt;line-height:1.4;color:var(--ink-2)}
.how li::before{content:counter(h,decimal-leading-zero);position:absolute;left:0;top:1mm;font:500 7pt 'PlexMono',monospace;color:var(--accent)}
.flow{display:grid;grid-template-columns:1fr 6mm 1.05fr 6mm 1fr;align-items:stretch;gap:0;font-size:7.6pt;line-height:1.3}
.flow>div{padding:2mm 2.4mm;border:.25mm solid var(--line-strong)}
.flow .fa{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600;display:grid;place-items:center;text-align:center}
.flow .ar{border:0;padding:0;display:grid;place-items:center;color:var(--accent);font-size:10pt}
.flow b{display:block;font:500 5.8pt 'PlexMono',monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:.6mm}
.chips{display:flex;flex-wrap:wrap;gap:1.2mm}
.chips span{font:500 6.4pt/1 'PlexMono',monospace;letter-spacing:.03em;padding:1.3mm 1.8mm;border:.2mm solid var(--line-strong);color:var(--ink-2);background:var(--paper)}
.chips-note{font-size:7pt;color:var(--ink-3);margin-top:1.4mm}

/* enquiry sheet */
.enq h2{font-size:34pt}
.enq .sub{color:var(--ink-2);font-size:10pt;max-width:140mm;margin:3mm 0 8mm}
.fields{display:grid;grid-template-columns:1fr 1fr;gap:6.5mm 10mm}
.fields .f{border-bottom:.3mm solid var(--ink);height:13mm;display:flex;flex-direction:column;justify-content:flex-start}
.fields .f.w{grid-column:1/-1}
.fields .f.tall{height:34mm}
.check{margin-top:9mm;display:grid;grid-template-columns:repeat(3,1fr);gap:2mm 6mm}
.check div{display:flex;gap:2mm;align-items:center;font-size:8.6pt}
.check i{width:3.4mm;height:3.4mm;border:.3mm solid var(--ink);flex:none}
.send{margin-top:10mm;display:grid;grid-template-columns:1fr 1fr 1fr;border-top:.5mm solid var(--ink)}
.send>div{padding:3.5mm 3mm 0 0}
.send>div+div{padding-left:4mm;border-left:.2mm solid var(--line)}
.send b{display:block;font:500 8.2pt/1.35 'PlexMono',monospace;margin-top:1mm;white-space:nowrap}

/* back cover */
.back{background:var(--ink);color:#fff;padding:16mm}
.back .logo-wrap{background:#fff;display:inline-block;padding:4mm 5mm}
.back .logo-wrap img{width:58mm;display:block}
.back h2{font-size:52pt;color:#fff;margin-top:22mm}
.back h2 span{color:var(--accent-line)}
.back .lead{color:#c5cfd2;font-size:11pt;max-width:120mm;margin-top:7mm;line-height:1.55}
.back .info{position:absolute;left:16mm;right:16mm;bottom:16mm;display:grid;grid-template-columns:1fr 1fr 34mm;gap:8mm;align-items:start;border-top:.3mm solid #4b5c65;padding-top:7mm}
.back .info .note{color:#8fa0a8}
.back .info p,.back .info a{display:block;font-size:9.5pt;line-height:1.55;margin-top:1mm;color:#fff;text-decoration:none}
.back .info .num{font-size:9.5pt}
.back .qr{background:#fff;padding:2.5mm;width:34mm}
.back .qr svg{width:100%;height:auto;display:block}
.back .qr-cap{white-space:nowrap;font:500 6pt 'PlexMono',monospace;letter-spacing:.02em;color:#8fa0a8;margin-top:1.5mm;text-align:center;text-transform:uppercase}
`

const hd = (label) => `<div class="hd note"><span><b>${esc(company.name)}</b> · Process Equipment Catalogue</span><span>${esc(label)}</span></div>`
const ft = (n) => `<div class="ft note"><span>${esc(company.phones.join('  ·  '))}  ·  ${esc(company.email)}</span><span class="num">${String(n).padStart(2, '0')} / ${totalPages}</span></div>`

const cover = `<section class="page cover grid-paper">
  <div class="top">
    <img class="logo" src="${url('assets', 'logo.png')}" alt="RK Enterprises">
    <p class="note" style="text-align:right">2026 Edition<br>Vasai-Virar, Maharashtra</p>
  </div>
  <h1 class="display">Process<br>equipment <span>catalogue</span></h1>
  <p class="lead">Filtration, milling, coating, drying, blending and granulation equipment for pharmaceutical, food, chemical and cosmetics production. Built to your specification.</p>
  <div class="plate-dark"><img src="${url('..', 'public', 'machines', 'rk-hero-machine.png')}" alt=""><span class="tag note" style="color:#fff">Custom process equipment</span></div>
  <dl class="title-block">
    <div><dt class="note">Machine types</dt><dd>${N}</dd></div>
    <div><dt class="note">Process steps</dt><dd>${stages.length}</dd></div>
    <div><dt class="note">Built</dt><dd>To order</dd></div>
    <div><dt class="note">Project support</dt><dd>24/7</dd></div>
  </dl>
  <div class="contact-line"><span>${esc(company.phones.join('  ·  '))}</span><span>${esc(company.email)}</span></div>
</section>`

const industries = [
  ['Pharmaceutical', 'Granulation, drying, coating and oral-liquid lines'],
  ['Food & beverage', 'Syrups, oils, powders and blends'],
  ['Chemical', 'Liquid filtration, drying and powder mixing'],
  ['Cosmetics', 'Emulsions, creams and liquid clarification'],
  ['Specialty processing', 'Handling, storage and custom process needs'],
]

const about = `<section class="page about">${hd('About us')}
  <div class="body">
    <p class="note">Who we are</p>
    <h2 class="display" style="margin-top:2mm">From drawing board <span class="accent">to delivery.</span></h2>
    <p class="lead">RK Enterprises pairs practical manufacturing experience with an exacting approach to detail. We make equipment that earns its place on your floor, shift after shift.</p>
    <div class="banner"><img src="${url('..', 'public', 'machines', 'rk-hero-machine.png')}" alt=""></div>
    <dl class="facts">
      <div><dt class="note">Machine types</dt><b>${N}</b></div>
      <div><dt class="note">Projects delivered</dt><b>100+</b></div>
      <div><dt class="note">Project support</dt><b>24/7</b></div>
    </dl>
    <div class="two">
      <div><h3>How we work</h3><ol class="steps">
        <li><strong>Understand the process</strong><p>Every project starts with the details of your operation.</p></li>
        <li><strong>Engineer the answer</strong><p>We match material, geometry and controls to the task.</p></li>
        <li><strong>Build with accountability</strong><p>Made, tested and delivered by people who stand behind it.</p></li>
      </ol></div>
      <div><h3>Industries we build for</h3><ul class="ind">${industries.map(([a, b]) => `<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join('')}</ul></div>
    </div>
  </div>${ft(2)}</section>`

const contents = `<section class="page contents">${hd('Contents')}
  <div class="body">
    <p class="note">Find equipment by process step</p>
    <h2 class="display" style="margin-top:2mm">${N} machines. <span class="accent">${stages.length} process steps.</span></h2>
    <p class="sub">Start from what your line needs to do. Each step lists the machines we build for it, with the page of its data sheet.</p>
    <div class="stgrid">${stages.map((s, i) => {
      const cover = bySlug(s.cover)
      return `<article class="stcard"><div class="im"><img src="${machineImg(cover)}" alt=""></div><div class="bd">
        <p class="note">Step ${String(i + 1).padStart(2, '0')}</p><h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p>
        <ul>${productsIn(s.id).map((p) => `<li><span>${esc(p.name)}</span><i></i><span class="num">p.${String(pageOf(p)).padStart(2, '0')}</span></li>`).join('')}</ul>
      </div></article>`
    }).join('')}</div>
  </div>${ft(3)}</section>`

const machine = (p) => {
  const st = stages.find((s) => s.id === p.stage)
  const flow = p.flow ? `<div class="flow">
      <div><b>In</b>${p.flow.in.map(esc).join('<br>')}</div><div class="ar">→</div>
      <div class="fa">${esc(p.flow.action)}</div><div class="ar">→</div>
      <div><b>Out</b>${p.flow.out.map(esc).join('<br>')}</div></div>` : ''
  return `<article class="mach">
    <div class="row note"><span>${esc(st.name)}</span><span class="num">Sheet ${sheetNo(p)} / ${N}</span></div>
    <h2 class="display">${esc(p.name)}</h2>
    <div class="cols">
      <div><div class="plate"><img src="${machineImg(p)}" alt="${esc(p.name)}"></div>
        <div class="apps"><h4>Applications</h4><ul>${p.applications.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div></div>
      <div class="rc">
        <p class="summary">${esc(p.summary)}</p>
        <div class="how"><h4 class="note" style="margin-bottom:1mm">How it works</h4><ol>${p.howItWorks.map((h) => `<li>${esc(h)}</li>`).join('')}</ol></div>
        ${flow}
        <div class="rc-spec"><h4 class="note" style="margin-bottom:1.5mm">Specified to your requirement</h4>
          <div class="chips">${p.specs.map((s) => `<span>${esc(s.label)}</span>`).join('')}</div>
          <p class="chips-note">Values are confirmed for each order. Ask for a quotation.</p></div>
      </div>
    </div></article>`
}

const productPages = []
for (let i = 0; i < N; i += perPage) {
  const n = PRODUCT_PAGE_START + i / perPage
  const pair = products.slice(i, i + perPage)
  productPages.push(`<section class="page">${hd(pair.map((p) => sheetNo(p)).join(' – ') === '' ? '' : `Equipment · Sheets ${pair.map(sheetNo).join(' & ')}`)}<div class="body">${pair.map(machine).join('')}</div>${ft(n)}</section>`)
}

const enquiry = `<section class="page enq">${hd('Enquiry sheet')}
  <div class="body">
    <p class="note">Request a quotation</p>
    <h2 class="display" style="margin-top:2mm">Tell us about <span class="accent">your line.</span></h2>
    <p class="sub">Fill in what you know, then send a photo or scan by WhatsApp or email. We will recommend equipment and send a quotation.</p>
    <div class="fields">
      <div class="f note">Company</div><div class="f note">Contact person</div>
      <div class="f note">Phone / WhatsApp</div><div class="f note">Email</div>
      <div class="f w note">Equipment required</div>
      <div class="f note">Product / material processed</div><div class="f note">Batch size or capacity</div>
      <div class="f note">Contact-part material</div><div class="f note">Utilities available (steam / electric / air)</div>
      <div class="f note">Required by (date)</div><div class="f note">Delivery location</div>
      <div class="f w tall note">Notes and special requirements</div>
    </div>
    <p class="note" style="margin-top:9mm">Process step</p>
    <div class="check" style="margin-top:2.5mm">${stages.map((s) => `<div><i></i>${esc(s.name)}</div>`).join('')}</div>
    <div class="send">
      <div><span class="note">WhatsApp</span><b>${esc(company.phones[0])}</b></div>
      <div><span class="note">Email</span><b>${esc(company.email)}</b></div>
      <div><span class="note">Hours</span><b>${esc(company.hours)}</b></div>
    </div>
  </div>${ft(totalPages - 1)}</section>`

const back = `<section class="page back">
  <div class="logo-wrap"><img src="${url('assets', 'logo.png')}" alt="RK Enterprises"></div>
  <h2 class="display">Let's build<br><span>what's next.</span></h2>
  <p class="lead">Tell us the product, batch size and timeline. We'll recommend equipment and send a quotation.</p>
  <div class="info">
    <div>
      <p class="note">Head office</p><p>${company.address.map(esc).join('<br>')}</p>
      <p class="note" style="margin-top:4mm">GST</p><p class="num">${esc(company.gst)}</p>
    </div>
    <div>
      <p class="note">Phone</p>${company.phones.map((p) => `<a class="num">${esc(p)}</a>`).join('')}
      <p class="note" style="margin-top:4mm">Email</p><a>${esc(company.email)}</a>
      <p class="note" style="margin-top:4mm">Hours</p><p>${esc(company.hours)}</p>
    </div>
    <div><div class="qr">${qr}</div><p class="qr-cap">rk-enterprises.co</p></div>
  </div></section>`

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>RK Enterprises — Process Equipment Catalogue</title><style>${css}</style></head><body>${cover}${about}${contents}${productPages.join('')}${enquiry}${back}</body></html>`

const htmlPath = path.join(here, 'catalog.html')
const pdfPath = path.join(here, 'RK-Enterprises-Catalogue.pdf')
writeFileSync(htmlPath, html)

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync)
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files', '--virtual-time-budget=8000', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href], { stdio: 'inherit' })
console.log(`Pages: ${totalPages}  →  ${pdfPath}`)
