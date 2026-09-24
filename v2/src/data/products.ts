// Single source of truth for the catalogue. Adding a machine = adding an entry here.
// Spec values stay `null` until RK supplies them; pages render null as "On request"
// rather than inventing numbers.

export type Spec = { label: string; value: string | null }

export type Product = {
  slug: string
  name: string
  stage: StageId
  image: string
  summary: string
  applications?: string[]
  howItWorks?: string[]
  specs?: Spec[]
}

export type StageId = 'liquid' | 'milling' | 'coating' | 'drying' | 'blending' | 'granulation'

export const stages: { id: StageId; name: string; blurb: string; cover: string }[] = [
  { id: 'liquid', name: 'Liquid processing', blurb: 'Filtration, homogenising and collection for liquid batches.', cover: 'sparkler-filter-press' },
  { id: 'milling', name: 'Milling', blurb: 'Size reduction for consistent particle distribution.', cover: 'colloid-mill' },
  { id: 'coating', name: 'Coating', blurb: 'Coating systems for tablets and pills.', cover: 'coating-pan' },
  { id: 'drying', name: 'Drying', blurb: 'Batch and vacuum drying for heat-sensitive and bulk materials.', cover: 'fluid-bed-dryer' },
  { id: 'blending', name: 'Blending', blurb: 'Tumbling and ribbon mixing for uniform powder blends.', cover: 'octagonal-blender' },
  { id: 'granulation', name: 'Sifting, granulation & storage', blurb: 'Screening, granulating, material handling and WFI storage.', cover: 'rapid-mixer-granulator' },
]

const tbc = (...labels: string[]): Spec[] => labels.map((label) => ({ label, value: null }))

export const products: Product[] = [
  {
    slug: 'sparkler-filter-press', name: 'Sparkler Filter Press', stage: 'liquid', image: 'imgi_2_sparkler-filter-press.png',
    summary: 'Horizontal-plate pressure filter for clarifying syrups, oils, solvents and other liquids in batch production.',
    applications: ['Syrups and oral liquids', 'Edible and essential oils', 'Solvent clarification', 'Cosmetic liquids', 'Chemical process liquids'],
    howItWorks: [
      'Unfiltered liquid is pumped into the closed vessel under pressure.',
      'It flows through a stack of horizontal plates, each carrying filter paper or cloth, with an optional filter aid.',
      'Solids stay on the media; clear filtrate collects in the central channel and leaves through the outlet.',
      'Between batches the vessel is opened, and the plate stack is lifted out for cleaning and media change.',
    ],
    specs: tbc('Model range', 'Number of plates', 'Plate diameter', 'Filtration area', 'Output', 'Pump & motor', 'Contact-part material', 'Surface finish', 'Gaskets'),
  },
  { slug: 'zero-hold-up-filter-press', name: 'Zero Hold-Up Filter Press', stage: 'liquid', image: 'imgi_4_zero-hold-up-filter-press2.png', summary: 'Complete evacuation of the batch with minimal product loss.' },
  { slug: 'inline-homogenizer', name: 'Inline Homogenizer', stage: 'liquid', image: 'imgi_3_inline-homogenizer.png', summary: 'Precise emulsification and particle size reduction.' },
  { slug: 'ml-catch-pot', name: 'ML Catch Pot', stage: 'liquid', image: 'imgi_5_ML-catch-pot.png', summary: 'A safe, sanitary vessel for material collection.' },
  { slug: 'multi-mill', name: 'Multi Mill', stage: 'milling', image: 'imgi_6_multi-mill1.png', summary: 'Versatile size reduction for production use.' },
  { slug: 'colloid-mill', name: 'Colloid Mill', stage: 'milling', image: 'imgi_7_colloid-mill.png', summary: 'High-shear milling for fine particle reduction.' },
  { slug: 'coating-pan', name: 'Coating Pan', stage: 'coating', image: 'imgi_8_coating-pan.png', summary: 'Uniform coating for tablets and pills.' },
  { slug: 'tray-dryer', name: 'Tray Dryer', stage: 'drying', image: 'imgi_10_tray-dryer.png', summary: 'An efficient batch drying solution.' },
  { slug: 'vacuum-tray-dryer', name: 'Vacuum Tray Dryer', stage: 'drying', image: 'vacuum-tray-dryer.png', summary: 'Low-temperature drying for sensitive materials.' },
  { slug: 'fluid-bed-dryer', name: 'Fluid Bed Dryer', stage: 'drying', image: 'imgi_12_fluid-bed-dryer3.png', summary: 'Uniform moisture removal with fluidised-bed technology.' },
  { slug: 'rotocon-vacuum-dryer', name: 'Rotocon Vacuum Dryer', stage: 'drying', image: 'imgi_13_rotocon-vacuum-dryer-1.png', summary: 'Rotary vacuum drying for dependable operation.' },
  { slug: 'octagonal-blender', name: 'Octagonal Blender', stage: 'blending', image: 'octagonal-blender.png', summary: 'Gentle mixing for uniform blend quality.' },
  { slug: 'double-cone-blender', name: 'Double Cone Blender', stage: 'blending', image: 'imgi_15_double-cone-blender.png', summary: 'Efficient powder blending with tumbling action.' },
  { slug: 'ribbon-blender', name: 'Ribbon Blender', stage: 'blending', image: 'imgi_16_ribbon-blender.png', summary: 'High-capacity mixing for dry powders.' },
  { slug: 'vibro-sifter', name: 'Vibro Sifter', stage: 'granulation', image: 'imgi_17_vibro-sifter-new1.png', summary: 'Precision screening and particle grading.' },
  { slug: 'rapid-mixer-granulator', name: 'Rapid Mixer Granulator', stage: 'granulation', image: 'imgi_18_rapid-mixer-granulator1.png', summary: 'High-speed mixing and granulation in one unit.' },
  { slug: 'ipc-bin', name: 'IPC Bin', stage: 'granulation', image: 'imgi_19_IPC-bin.png', summary: 'Safe material handling and intermediate storage.' },
  { slug: 'wfi-storage-tank', name: 'WFI Storage Tank', stage: 'granulation', image: 'imgi_20_wfi-storage-tank-1.png', summary: 'Storage systems for water for injection.' },
]

export const stageOf = (id: StageId) => stages.find((s) => s.id === id)!
export const productsIn = (id: StageId) => products.filter((p) => p.stage === id)
export const sheetNo = (p: Product) => String(products.indexOf(p) + 1).padStart(2, '0')

export const company = {
  name: 'RK Enterprises',
  phones: ['+91 90288 72590', '+91 90297 51852'],
  whatsapp: '919028872590',
  email: 'enquiry@rk-enterprises.co',
  address: ['A-1 Complex, Gala no: B1 - U-16', 'A1 Industrial Estate, Kaman', 'Vasai-Virar, Maharashtra 421302'],
  gst: '27BDTPS0564A1ZE',
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM',
  mapUrl: 'https://www.google.com/maps?q=A1+Industrial+Estate+Kaman+Vasai-Virar+Maharashtra+421302',
}

export const tel = (phone: string) => 'tel:' + phone.replace(/\s/g, '')
export const waLink = (text: string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`
