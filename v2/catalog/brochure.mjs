// Builds the 3-page interactive RK Enterprises brochure (A4 PDF with clickable links).
// Run: node brochure.mjs  ->  brochure.html + RK-Enterprises-Brochure.pdf
import { writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'
import { products, stages, productsIn, company, waLink, tel } from '../src/data/products.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const url = (...p) => pathToFileURL(path.join(here, ...p)).href
const fonts = (f) => url('..', 'node_modules', ...f.split('/'))
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const SITE = 'https://rk-enterprises.co'
const N = products.length
const mkQr = (data) => QRCode.toString(data, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#13212A', light: '#FFFFFF' } })
const qrSite = await mkQr(SITE)
const qrWa = await mkQr(waLink("Hi RK Enterprises, I'd like to discuss equipment for my production line."))
const qrMap = await mkQr(company.mapUrl)
const num = (p) => String(products.indexOf(p) + 1).padStart(2, '0')

const css = `
@font-face{font-family:'Archivo';src:url(${fonts('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
${[400, 500, 600].map((w) => `@font-face{font-family:'Plex';src:url(${fonts(`@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${w}-normal.woff2`)}) format('woff2');font-weight:${w}}`).join('')}
${[400, 500].map((w) => `@font-face{font-family:'PlexMono';src:url(${fonts(`@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${w}-normal.woff2`)}) format('woff2');font-weight:${w}}`).join('')}
@page{size:A4;margin:0}
:root{--paper:#F3F4F1;--line:#D2D8D6;--ls:#A7B2B4;--ink:#13212A;--ink2:#43525A;--ink3:#5C6A70;--accent:#C2481A;--al:#E8622E}
*{box-sizing:border-box}
html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:400 9pt/1.5 'Plex',Arial,sans-serif;color:var(--ink);background:#dfe3e1}
h1,h2,h3,p,ul,ol,dl,dd,figure{margin:0;padding:0}
ul,ol{list-style:none}
a{color:inherit;text-decoration:none}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fff;page-break-after:always;break-after:page}
@media screen{.page{margin:8mm auto;box-shadow:0 2mm 8mm rgba(0,0,0,.18)}}
.display{font-family:'Archivo',Arial Narrow,sans-serif;font-stretch:72%;font-weight:780;text-transform:uppercase;letter-spacing:-.005em;line-height:.95}
.note{font:500 6.4pt/1.4 'PlexMono',monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--ink3)}
.accent{color:var(--accent)}
.grid-paper{background-image:linear-gradient(#E2E6E3 .2mm,transparent .2mm),linear-gradient(90deg,#E2E6E3 .2mm,transparent .2mm);background-size:8mm 8mm;background-color:#fff}

/* top bar: logo + section index (print) */
.bar{position:absolute;left:12mm;right:12mm;top:10mm;height:11mm;display:flex;align-items:center;justify-content:space-between;border-bottom:.35mm solid var(--ink)}
.logo{display:flex;align-items:center;gap:2.2mm;font:780 14pt/1 'Archivo',sans-serif;font-stretch:80%;text-transform:uppercase}
.logo b{background:var(--accent);color:#fff;padding:1mm 1.6mm .6mm;font-size:12pt}
.tabs{display:flex;gap:1.4mm}
.tabs span{font:500 6.6pt/1 'PlexMono',monospace;letter-spacing:.06em;text-transform:uppercase;padding:1.8mm 2.6mm;border:.25mm solid var(--ls);color:var(--ink2);background:#fff}
.tabs span.on{background:var(--ink);border-color:var(--ink);color:#fff}
.foot{position:absolute;left:12mm;right:12mm;bottom:10mm;display:flex;justify-content:space-between;align-items:center;padding-top:2mm;border-top:.3mm solid var(--ls)}
.body{position:absolute;left:12mm;right:12mm;top:26mm;bottom:19mm}

/* page 1 */
.hero{position:relative;height:96mm;overflow:hidden;background:var(--ink);margin-top:1mm}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 55%}
.hero-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(19,33,42,.96) 0%,rgba(19,33,42,.88) 42%,rgba(19,33,42,.15) 78%,rgba(19,33,42,0) 100%)}
.hero-copy{position:absolute;left:8mm;top:9mm;width:104mm;color:#fff}
.hero h1{font-size:37pt;color:#fff}
.hero p.lead{font-size:9.6pt;line-height:1.55;color:#d3dcdf;margin-top:4mm}
.hero-tag{position:absolute;left:8mm;bottom:6mm;color:#fff;border:.25mm solid rgba(255,255,255,.55);padding:1.6mm 2.4mm;background:rgba(19,33,42,.5)}
.cta-row{display:flex;gap:2mm;margin-top:5mm}
.btn{display:inline-flex;align-items:center;gap:1.6mm;font:600 8pt/1 'Plex',sans-serif;padding:3mm 4mm;color:#fff;background:var(--accent)}
.btn.wa{background:#1B7443}
.btn.ghost{background:#fff;color:var(--ink);border:.3mm solid var(--ink)}
.photo{background:var(--ink);height:72mm;overflow:hidden}
.photo img{width:100%;height:100%;object-fit:cover;object-position:center 55%}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:.5mm solid var(--ink);border-bottom:.2mm solid var(--line);margin-top:6mm}
.stats>div{padding:3mm 3mm 3mm 0}.stats>div+div{padding-left:4mm;border-left:.2mm solid var(--line)}
.stats b{display:block;font:500 17pt/1.1 'PlexMono',monospace;margin-top:.6mm}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:9mm;margin-top:6mm}
.h3{font:680 10.5pt/1.2 'Archivo',sans-serif;font-stretch:88%;text-transform:uppercase;margin-bottom:2.4mm}
.about-p{color:var(--ink2);font-size:9pt;line-height:1.6}
.steps{border-top:.5mm solid var(--ink);counter-reset:s;margin-top:2mm}
.steps li{counter-increment:s;display:grid;grid-template-columns:8mm 1fr;padding:2.2mm 0;border-bottom:.2mm solid var(--line)}
.steps li::before{content:counter(s,decimal-leading-zero);font:500 7.4pt/1.7 'PlexMono',monospace;color:var(--accent);grid-row:span 2}
.steps strong{font:680 9pt 'Archivo',sans-serif;font-stretch:88%}
.steps span{color:var(--ink2);font-size:8pt}
.ind{border-top:.5mm solid var(--ink)}
.ind li{display:flex;justify-content:space-between;gap:3mm;padding:2.1mm 0;border-bottom:.2mm solid var(--line)}
.ind strong{font:680 8.8pt 'Archivo',sans-serif;font-stretch:88%;white-space:nowrap}
.ind span{color:var(--ink2);font-size:7.6pt;text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:1.4mm;margin-top:2mm}
.chips span{font:500 6.8pt/1 'PlexMono',monospace;letter-spacing:.04em;text-transform:uppercase;padding:1.8mm 2.4mm;border:.25mm solid var(--ls);background:#F3F4F1;color:var(--ink2)}

/* product pages */
.sec{margin-bottom:5mm}
.sec-h{display:flex;justify-content:space-between;align-items:baseline;border-top:.5mm solid var(--ink);padding-top:2mm;margin-bottom:2.6mm}
.sec-h h2{font:760 13pt/1 'Archivo',sans-serif;font-stretch:76%;text-transform:uppercase}
.sec-h p{color:var(--ink2);font-size:7.6pt;max-width:95mm;text-align:right}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4mm}
.card{display:block;border:.25mm solid var(--ls);background:#fff;break-inside:avoid}
.card .im{height:25mm;position:relative;background:#fff;border-bottom:.2mm solid var(--line)}
.card .im img{position:absolute;inset:1.4mm;width:calc(100% - 2.8mm);height:calc(100% - 2.8mm);object-fit:contain}
.five .cards{grid-template-columns:repeat(5,1fr)}
.five .card h3{font-size:7.4pt}
.five .card .im{height:22mm}
.pair{display:grid;grid-template-columns:2fr 1fr;gap:6mm;margin-bottom:5mm}
.pair .sec{margin-bottom:0}
.pair .sec:first-child .cards{grid-template-columns:repeat(2,1fr)}
.pair .sec:last-child .cards{grid-template-columns:1fr}
.pair .sec-h p{display:none}
.card .tx{padding:2mm 2.2mm 2.2mm}
.card h3{font:680 8.2pt/1.2 'Archivo',sans-serif;font-stretch:90%;text-transform:uppercase;min-height:9.6mm}
.card .use{font-size:6.8pt;line-height:1.35;color:var(--ink2);margin-top:.6mm;min-height:9mm}
.card .no{position:absolute;left:1.6mm;top:1.4mm;font:500 6.4pt/1 'PlexMono',monospace;color:var(--accent);letter-spacing:.06em}
.card{border-top:.7mm solid var(--accent)}

/* contact block (page 3) */
.contact{position:absolute;left:0;right:0;bottom:0;background:var(--ink);color:#fff;padding:7mm 8mm;display:grid;grid-template-columns:1.15fr 1fr;gap:9mm;align-items:start;border-top:1.2mm solid var(--accent)}
.qrs{display:flex;gap:4mm;margin-top:5mm}
.qrs .qr{width:25mm}
.contact h2{font-size:22pt;color:#fff}
.contact h2 span{color:var(--al)}
.contact .note{color:#8fa0a8}
.contact p,.contact a{display:block;font-size:8.6pt;line-height:1.55;color:#fff;margin-top:.8mm}
.contact .n{font:500 9pt 'PlexMono',monospace}
.contact .btns{display:flex;gap:2mm;margin-top:4mm}
.contact .btn{font-size:7.6pt;padding:2.6mm 3.4mm}
.qr{background:#fff;padding:2mm;width:28mm}.qr svg{width:100%;height:auto;display:block}
.qr-c{font:500 6.4pt 'PlexMono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#c5cfd2;text-align:center;margin-top:1.4mm;white-space:nowrap}
`

const page = (n, id, tabOn, inner) => `<section class="page" id="${id}">
  <div class="bar">
    <div class="logo"><b>RK</b> Enterprises</div>
    <nav class="tabs">
      <span class="${tabOn === 1 ? 'on' : ''}">01 Company</span>
      <span class="${tabOn === 2 ? 'on' : ''}">02 Equipment</span>
      <span class="${tabOn === 3 ? 'on' : ''}">03 Equipment &amp; Contact</span>
    </nav>
  </div>
  <div class="body">${inner}</div>
  <div class="foot note"><span>${esc(company.phones[0])}</span><span>${esc(company.email)}</span><span>rk-enterprises.co</span><span>${n} / 3</span></div>
</section>`

const industries = [
  ['Pharmaceutical', 'Granulation, drying, coating, oral liquids'],
  ['Food & beverage', 'Syrups, oils, powders and blends'],
  ['Chemical', 'Filtration, drying and powder mixing'],
  ['Cosmetics', 'Emulsions, creams and clarification'],
  ['Specialty processing', 'Handling, storage, custom needs'],
]

const p1 = page(1, 'p1', 1, `
  <div class="hero">
    <img class="hero-img" src="${url('..', 'public', 'machines', 'rk-hero-machine.png')}" alt="">
    <div class="hero-shade"></div>
    <div class="hero-copy">
      <p class="note" style="color:#c5cfd2">Process equipment manufacturer · Vasai-Virar, Maharashtra</p>
      <h1 class="display" style="margin-top:2.4mm">Process equipment, built to <span style="color:var(--al)">your spec.</span></h1>
      <p class="lead">Filtration, milling, coating, drying, blending and granulation equipment for pharmaceutical, food, chemical and cosmetics production. Made to order for your product, batch size and process.</p>
    </div>
    <div class="hero-tag note">${N} machines · ${stages.length} process steps</div>
  </div>
  <div class="stats">
    <div><span class="note">Machine types</span><b>${N}</b></div>
    <div><span class="note">Process steps</span><b>${stages.length}</b></div>
    <div><span class="note">Projects delivered</span><b>100+</b></div>
    <div><span class="note">Project support</span><b>24/7</b></div>
  </div>
  <div class="cols2">
    <div>
      <h3 class="h3">About RK Enterprises</h3>
      <p class="about-p">RK Enterprises pairs practical manufacturing experience with an exacting approach to detail. We make equipment that earns its place on your floor, shift after shift. Every machine is built to your use case, from a single filter press to a complete ointment or syrup manufacturing line.</p>
      <h3 class="h3" style="margin-top:5mm">How we work</h3>
      <ol class="steps">
        <li><strong>Understand the process</strong><span>Every project starts with the details of your operation.</span></li>
        <li><strong>Engineer the answer</strong><span>We match material, geometry and controls to the task.</span></li>
        <li><strong>Build with accountability</strong><span>Made, tested and delivered by people who stand behind it.</span></li>
      </ol>
    </div>
    <div>
      <h3 class="h3">Industries we build for</h3>
      <ul class="ind">${industries.map(([a, b]) => `<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join('')}</ul>
      <h3 class="h3" style="margin-top:5mm">Equipment by process step</h3>
      <div class="chips">${stages.map((s) => `<span>${esc(s.name)} · ${productsIn(s.id).length}</span>`).join('')}</div>
      <h3 class="h3" style="margin-top:5mm">Company details</h3>
      <p class="about-p"><b>${esc(company.phones.join('  /  '))}</b><br>${esc(company.email)}<br>rk-enterprises.co<br>${company.address.map(esc).join(', ')}<br>GST ${esc(company.gst)} · ${esc(company.hours)}</p>
    </div>
  </div>`)

const sec = (s) => `<div class="sec ${productsIn(s.id).length === 5 ? 'five' : ''}">
  <div class="sec-h"><h2>${esc(s.name)}</h2><p>${esc(s.blurb)}</p></div>
  <div class="cards">${productsIn(s.id).map((p) => `<div class="card"><div class="im"><img src="${url('..', 'public', 'machines', p.image)}" alt="${esc(p.name)}"><span class="no">${num(p)}</span></div><div class="tx"><h3>${esc(p.name)}</h3><p class="use">${esc(p.applications.slice(0, 2).join(' · '))}</p></div></div>`).join('')}</div>
</div>`

const rest = stages.slice(4)
const [liquid, milling, coating, drying] = stages
const p2 = page(2, 'p2', 2, `${sec(liquid)}<div class="pair">${sec(milling)}${sec(coating)}</div>${sec(drying)}`)
const p3 = page(3, 'p3', 3, `${rest.map(sec).join('')}
  <div class="contact">
    <div>
      <h2 class="display">Talk to us about <span>your line.</span></h2>
      <p style="color:#c5cfd2;margin-top:2mm">Tell us the product, batch size and timeline. We'll recommend equipment and send a quotation.</p>
      <div class="qrs">
        <div><div class="qr">${qrSite}</div><p class="qr-c">Website</p></div>
        <div><div class="qr">${qrWa}</div><p class="qr-c">WhatsApp</p></div>
        <div><div class="qr">${qrMap}</div><p class="qr-c">Find us</p></div>
      </div>
      <p class="note" style="margin-top:2mm;color:#8fa0a8">Scan with your phone camera</p>
    </div>
    <div>
      <p class="note">Call / WhatsApp</p>${company.phones.map((p) => `<p class="n">${esc(p)}</p>`).join('')}
      <p class="note" style="margin-top:2.6mm">Email</p><p>${esc(company.email)}</p>
      <p class="note" style="margin-top:2.6mm">Website</p><p>rk-enterprises.co</p>
      <p class="note" style="margin-top:2.6mm">Head office</p><p>${company.address.map(esc).join('<br>')}</p>
      <p class="note" style="margin-top:2.6mm">GST</p><p class="n">${esc(company.gst)}</p>
      <p class="note" style="margin-top:2.6mm">Business hours</p><p>${esc(company.hours)}</p>
    </div>
  </div>`)

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>RK Enterprises — Brochure</title><style>${css}</style></head><body>${p1}${p2}${p3}</body></html>`
const htmlPath = path.join(here, 'brochure.html')
const pdfPath = path.join(here, 'RK-Enterprises-Brochure.pdf')
writeFileSync(htmlPath, html)
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync)
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files', '--virtual-time-budget=8000', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href], { stdio: 'ignore' })
console.log('Brochure ->', pdfPath)
