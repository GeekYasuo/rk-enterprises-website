// Single source of truth for the catalogue. Adding a machine = adding an entry here.
// Every machine is built to the customer's use case, so `specs` lists the options RK tailors
// per order (labels only; pages present them as "what we customise", not a fixed data table).
// Descriptions explain how each machine type works in general; RK should review them
// against its own builds.

export type Spec = { label: string; value: string | null }

// Simplified process flow drawn on the machine page: what goes in, what the machine does, what comes out.
export type Flow = { in: string[]; action: string; out: string[] }

export type Product = {
  slug: string
  name: string
  stage: StageId
  image: string
  summary: string
  applications: string[]
  howItWorks: string[]
  specs: Spec[]
  flow?: Flow
  listing?: { label: string; url: string }
}

export type StageId = 'liquid' | 'milling' | 'coating' | 'drying' | 'blending' | 'granulation'

export const stages: { id: StageId; name: string; blurb: string; cover: string }[] = [
  { id: 'liquid', name: 'Liquid processing', blurb: 'Filtration, homogenising, gelatin melting and collection for liquid batches.', cover: 'sparkler-filter-press' },
  { id: 'milling', name: 'Milling', blurb: 'Size reduction for consistent particle distribution.', cover: 'colloid-mill' },
  { id: 'coating', name: 'Coating', blurb: 'Coating systems for tablets and pills.', cover: 'coating-pan' },
  { id: 'drying', name: 'Drying', blurb: 'Batch and vacuum drying for heat-sensitive and bulk materials.', cover: 'fluid-bed-dryer' },
  { id: 'blending', name: 'Blending', blurb: 'Tumbling and ribbon mixing for uniform powder blends.', cover: 'octagonal-blender' },
  { id: 'granulation', name: 'Sifting, granulation & storage', blurb: 'Screening, granulating, material handling and WFI storage.', cover: 'rapid-mixer-granulator' },
]

const onRequest = (...labels: string[]): Spec[] => labels.map((label) => ({ label, value: null }))

export const products: Product[] = [
  // ── Liquid processing ──
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
    specs: onRequest('Model range', 'Number of plates', 'Plate diameter', 'Filtration area', 'Output', 'Pump & motor', 'Contact-part material', 'Surface finish', 'Gaskets'),
  },
  {
    slug: 'zero-hold-up-filter-press', name: 'Zero Hold-Up Filter Press', stage: 'liquid', image: 'imgi_4_zero-hold-up-filter-press2.png',
    summary: 'Plate filter press with a separate scavenger plate that filters the last of the batch, so no unfiltered liquid is left behind in the vessel.',
    applications: ['Syrups and oral liquids', 'High-value liquids where losses matter', 'Oils and solvents', 'Cosmetic liquids', 'Chemical process liquids'],
    howItWorks: [
      'Liquid is pumped into the vessel and filters down through the stack of horizontal plates.',
      'Near the end of the batch, the remaining liquid settles below the main plate stack.',
      'A scavenger plate at the bottom, with its own outlet, filters this residual liquid.',
      'The whole batch is filtered, with no unfiltered hold-up left in the vessel.',
    ],
    flow: { in: ['Unfiltered liquid'], action: 'Plate stack + scavenger plate', out: ['Clear filtrate', 'No unfiltered residue'] },
    specs: onRequest('Model range', 'Number of plates', 'Plate diameter', 'Filtration area', 'Output', 'Scavenger plate', 'Pump & motor', 'Contact-part material', 'Surface finish'),
  },
  {
    slug: 'inline-homogenizer', name: 'Inline Homogenizer', stage: 'liquid', image: 'imgi_3_inline-homogenizer.png',
    summary: 'High-shear rotor–stator mixer fitted into the pipeline, for emulsions, dispersions and droplet or particle size reduction.',
    applications: ['Creams, lotions and emulsions', 'Syrups and suspensions', 'Sauces and food emulsions', 'Chemical dispersions'],
    howItWorks: [
      'Product is pumped into the homogenizer head from a tank or process line.',
      'A high-speed rotor draws it into a close-fitting stator.',
      'Intense shear in the rotor–stator gap breaks droplets and particles down.',
      'Product leaves in a single pass, or recirculates to the tank until it reaches the target consistency.',
    ],
    flow: { in: ['Premix from tank or line'], action: 'Rotor–stator shear', out: ['Emulsion or dispersion', 'Recirculate if needed'] },
    specs: onRequest('Model range', 'Flow rate', 'Motor power', 'Rotor speed', 'Rotor–stator type', 'Inlet / outlet connections', 'Contact-part material', 'Seal type'),
  },
  {
    slug: 'ml-catch-pot', name: 'ML Catch Pot', stage: 'liquid', image: 'imgi_5_ML-catch-pot.png',
    summary: 'Collection vessel for mother liquor and condensate, fitted in vacuum and filtration lines to capture liquid before it reaches the vacuum pump.',
    applications: ['Nutsche filter and centrifuge lines', 'Vacuum drying systems', 'Solvent recovery', 'API and bulk drug plants'],
    howItWorks: [
      'The catch pot is connected between the process equipment and the vacuum source.',
      'Under vacuum, mother liquor or condensate is drawn into the vessel.',
      'Liquid collects in the pot while the vacuum line continues on to the pump.',
      'The collected liquid is drained through the bottom outlet for recovery or disposal.',
    ],
    flow: { in: ['Mother liquor or condensate'], action: 'Collection under vacuum', out: ['Liquid to drain or recovery', 'Vacuum line to pump'] },
    specs: onRequest('Capacity', 'Operating vacuum / pressure', 'Nozzles & connections', 'Sight glass', 'Contact-part material', 'Surface finish'),
  },

  {
    slug: 'gelatin-melting-tank', name: 'Gelatin Melting Tank', stage: 'liquid', image: 'gelatin-melting-tank.jpg',
    summary: 'Stainless steel vacuum tank with heating and stirring for preparing gelatin and V-gel solutions, built to GMP standards. Made in capacities from 50 to 1,000 litres, or to your batch size.',
    applications: ['Gelatin preparation for softgel and capsule production', 'V-gel formulations', 'GMP-compliant pharmaceutical manufacturing'],
    howItWorks: [
      'Gelatin and water are charged into the jacketed tank through its inlet.',
      'The tank is heated while a stirrer mixes the batch, and vacuum draws out trapped air.',
      'A thermometer, pressure gauge and safety valve keep temperature and pressure in range.',
      'The molten gelatin solution is discharged through the outlet to the next stage.',
    ],
    flow: { in: ['Gelatin and water'], action: 'Heating, stirring and vacuum', out: ['Uniform gelatin solution'] },
    specs: onRequest('Capacity', 'Heating (steam / electric)', 'Vacuum stirring', 'Buffer tank', 'Contact-part material', 'Surface finish (mirror / matt)', 'Automation level'),
    listing: { label: 'View on IndiaMART', url: 'https://www.indiamart.com/proddetail/gelatin-melting-tanks-2853114353155.html' },
  },

  {
    slug: 'ointment-manufacturing-plant', name: 'Ointment Manufacturing Plant', stage: 'liquid', image: 'ointment-manufacturing-plant.jpg',
    summary: 'Complete line for making ointments, creams, lotions and gels: phase preparation tanks, a vacuum homogenising mixer and transfer to holding. Planned around your formulation and batch size.',
    applications: ['Pharmaceutical ointments and creams', 'Cosmetic creams and lotions', 'Gels and pastes', 'Dermatological and veterinary products'],
    howItWorks: [
      'The water phase and oil phase are heated and mixed separately in their own preparation tanks.',
      'Both phases are drawn under vacuum into the main jacketed mixing vessel.',
      'A scraper agitator and a high-shear homogeniser blend them into a smooth, stable emulsion.',
      'The finished batch is cooled in the jacket and transferred to a holding tank ready for filling.',
    ],
    flow: { in: ['Water phase', 'Oil phase'], action: 'Vacuum homogenising mixer', out: ['Smooth ointment or cream', 'Transfer to holding tank'] },
    specs: onRequest('Batch size', 'Vessel and tank sizes', 'Heating and cooling', 'Homogeniser and agitator', 'Vacuum system', 'Automation and controls', 'Contact-part material', 'Cleaning (CIP / manual)'),
  },
  {
    slug: 'liquid-oral-syrup-plant', name: 'Liquid Oral Syrup Manufacturing Plant', stage: 'liquid', image: 'liquid-oral-syrup-plant.jpg',
    summary: 'Integrated line for syrups, suspensions and oral solutions: sugar dissolving, manufacturing vessel, homogenising, filtration and storage. Configured for your product range and batch size.',
    applications: ['Syrups and cough preparations', 'Suspensions and antacids', 'Vitamin and nutraceutical liquids', 'Paediatric oral formulations'],
    howItWorks: [
      'Sugar and other ingredients are dissolved in a steam-jacketed vessel.',
      'The solution moves to the manufacturing vessel, where an agitator mixes in the actives and excipients.',
      'An inline homogeniser and filters give a uniform, clear product.',
      'The finished liquid is held in a storage tank until it goes to filling.',
    ],
    flow: { in: ['Sugar, water and actives'], action: 'Dissolve, mix, homogenise, filter', out: ['Finished oral liquid', 'To storage tank'] },
    specs: onRequest('Batch size', 'Number and size of vessels', 'Agitators and homogeniser', 'Filtration stages', 'Transfer pumps', 'Automation and controls', 'Contact-part material', 'Cleaning (CIP / SIP)'),
  },

  // ── Milling ──
  {
    slug: 'multi-mill', name: 'Multi Mill', stage: 'milling', image: 'imgi_6_multi-mill1.png',
    summary: 'High-speed rotary mill with knife and impact blades, for granulating, pulverising and sizing wet and dry materials.',
    applications: ['Sizing wet and dry granules', 'Pulverising', 'Herbal and ayurvedic materials', 'Spices and food ingredients', 'Chemicals and pigments'],
    howItWorks: [
      'Material is fed into the hopper.',
      'Rotating blades, knife edge or impact edge depending on the direction of rotation, cut or strike the material.',
      'Particles are forced through an interchangeable screen that sets the output size.',
      'Sized material is discharged below the screen into a container.',
    ],
    flow: { in: ['Wet or dry material'], action: 'Rotating blades + screen', out: ['Sized granules or powder'] },
    specs: onRequest('Output', 'Rotor speed', 'Motor power', 'Blade type', 'Screen sizes', 'Contact-part material', 'Surface finish'),
  },
  {
    slug: 'colloid-mill', name: 'Colloid Mill', stage: 'milling', image: 'imgi_7_colloid-mill.png',
    summary: 'Rotor–stator mill with an adjustable gap, for fine grinding, emulsifying and homogenising liquids and pastes.',
    applications: ['Ointments, creams and pastes', 'Suspensions and syrups', 'Sauces, pastes and nut butters', 'Chemical emulsions'],
    howItWorks: [
      'Product is fed in through the hopper.',
      'It passes through a narrow, adjustable gap between a high-speed rotor and a fixed stator.',
      'Shear and turbulence in the gap reduce particle and droplet size.',
      'Processed product leaves through the outlet, and can be recirculated for a finer result.',
    ],
    flow: { in: ['Liquid or paste'], action: 'Adjustable rotor–stator gap', out: ['Fine, uniform product', 'Recirculate if needed'] },
    specs: onRequest('Output', 'Motor power', 'Rotor speed', 'Gap adjustment range', 'Cooling jacket', 'Contact-part material'),
  },

  // ── Coating ──
  {
    slug: 'coating-pan', name: 'Coating Pan', stage: 'coating', image: 'imgi_8_coating-pan.png',
    summary: 'Rotating pan for sugar coating, polishing and coating tablets, pills and granules.',
    applications: ['Sugar coating tablets', 'Pill and granule coating', 'Polishing', 'Confectionery coating'],
    howItWorks: [
      'Tablets are loaded into the pan, which is mounted at an angle.',
      'The pan rotates, keeping the tablets tumbling continuously.',
      'Coating solution is applied while hot air dries each layer.',
      'Layers build up until the coating is complete, and the batch is unloaded.',
    ],
    flow: { in: ['Uncoated tablets', 'Coating solution', 'Hot air'], action: 'Rotating, tilted pan', out: ['Coated tablets'] },
    specs: onRequest('Pan diameter', 'Batch capacity', 'Pan speed', 'Motor power', 'Hot-air blower & heater', 'Pan material'),
  },

  // ── Drying ──
  {
    slug: 'tray-dryer', name: 'Tray Dryer', stage: 'drying', image: 'imgi_10_tray-dryer.png',
    summary: 'Batch dryer that circulates heated air over trays of wet material inside an insulated cabinet.',
    applications: ['Granules and powders', 'Pharmaceutical intermediates', 'Herbs, spices and food products', 'Chemicals and pigments'],
    howItWorks: [
      'Wet material is spread on trays, which are loaded into the cabinet on racks or trolleys.',
      'Fans circulate air over steam or electric heaters.',
      'The heated air passes across the trays, evaporating moisture from the material.',
      'Some moist air is exhausted and replaced with fresh air until drying is complete.',
    ],
    flow: { in: ['Wet material on trays', 'Heated air'], action: 'Circulating hot air', out: ['Dry product', 'Moist exhaust air'] },
    specs: onRequest('Number of trays', 'Tray size', 'Heating (steam / electric)', 'Temperature range', 'Fan & motor', 'Contact-part material', 'Insulation'),
  },
  {
    slug: 'vacuum-tray-dryer', name: 'Vacuum Tray Dryer', stage: 'drying', image: 'vacuum-tray-dryer.png',
    summary: 'Tray dryer that works under vacuum, so moisture and solvents evaporate at lower temperatures. Suited to heat-sensitive and solvent-wet materials.',
    applications: ['Heat-sensitive APIs', 'Solvent-wet products', 'Hygroscopic materials', 'Oxidation-sensitive materials'],
    howItWorks: [
      'Material is placed on trays that sit on heated shelves inside a sealed chamber.',
      'A vacuum pump lowers the pressure inside the chamber.',
      'Moisture or solvent evaporates at a lower temperature, taking heat from the shelves.',
      'Vapours pass to a condenser for recovery, and the dry product is removed at the end of the cycle.',
    ],
    flow: { in: ['Wet material on heated shelves'], action: 'Drying under vacuum', out: ['Dry product', 'Vapour to condenser'] },
    specs: onRequest('Number of shelves', 'Tray size', 'Heating medium', 'Vacuum level', 'Condenser & receiver', 'Contact-part material'),
  },
  {
    slug: 'fluid-bed-dryer', name: 'Fluid Bed Dryer', stage: 'drying', image: 'imgi_12_fluid-bed-dryer3.png',
    summary: 'Dryer that suspends wet granules in a rising stream of hot air, drying them quickly and evenly.',
    applications: ['Granules before compression', 'Food powders and granules', 'Nutraceutical granules', 'Chemicals'],
    howItWorks: [
      'Wet granules are loaded into the product container.',
      'Heated, filtered air is blown up through its perforated base.',
      'The air lifts and suspends the particles, so the bed "fluidises" and every granule is surrounded by hot air.',
      'Filter bags hold back fine particles while moist air exhausts; drying stops at the target moisture.',
    ],
    flow: { in: ['Wet granules', 'Heated, filtered air'], action: 'Fluidised bed', out: ['Dry granules', 'Exhaust air through filter bags'] },
    specs: onRequest('Batch capacity', 'Container volume', 'Heating (steam / electric)', 'Blower & motor', 'Filter bags', 'Contact-part material', 'Controls'),
  },
  {
    slug: 'rotocon-vacuum-dryer', name: 'Rotocon Vacuum Dryer', stage: 'drying', image: 'imgi_13_rotocon-vacuum-dryer-1.png',
    summary: 'Rotating, jacketed double-cone vessel that dries under vacuum, turning the product continuously for even, gentle drying.',
    applications: ['APIs and bulk drugs', 'Solvent-wet products', 'Heat-sensitive chemicals', 'Powders that need gentle turning while drying'],
    howItWorks: [
      'Wet product is charged into the jacketed cone-shaped vessel.',
      'Heating fluid circulates through the jacket while vacuum is applied.',
      'The vessel rotates slowly, turning the product so it keeps meeting the heated wall.',
      'Vapours pass through a filter to the condenser, and dry product is discharged through the bottom valve.',
    ],
    flow: { in: ['Wet product', 'Heating fluid in jacket'], action: 'Rotating under vacuum', out: ['Dry powder', 'Vapour to condenser'] },
    specs: onRequest('Working capacity', 'Gross volume', 'Jacket heating medium', 'Vacuum level', 'Rotation speed', 'Motor & drive', 'Contact-part material'),
  },

  // ── Blending ──
  {
    slug: 'octagonal-blender', name: 'Octagonal Blender', stage: 'blending', image: 'octagonal-blender.png',
    summary: 'Tumble blender with an octagonal container, for gentle, uniform mixing of dry powders and granules.',
    applications: ['Lubrication blending before compression', 'Granule blending', 'Nutraceutical premixes', 'Food and chemical powders'],
    howItWorks: [
      'Powders or granules are loaded into the octagonal container, leaving space for the material to move.',
      'The container rotates slowly about a horizontal axis.',
      'Its octagonal shape folds and tumbles the material with each turn, without heavy shear.',
      'After the set blending time, the blend is discharged through the bottom valve.',
    ],
    flow: { in: ['Dry powders or granules'], action: 'Tumbling octagonal container', out: ['Uniform blend'] },
    specs: onRequest('Working capacity', 'Gross volume', 'Rotation speed', 'Motor & gearbox', 'Discharge valve', 'Contact-part material'),
  },
  {
    slug: 'double-cone-blender', name: 'Double Cone Blender', stage: 'blending', image: 'imgi_15_double-cone-blender.png',
    summary: 'Tumble blender with two cones joined at the centre, for uniform mixing of free-flowing dry powders and granules.',
    applications: ['Dry powder blending', 'Granule blending', 'Food and nutraceutical premixes', 'Chemical powders'],
    howItWorks: [
      'Material is loaded through the charging port.',
      'The vessel rotates about a horizontal axis through its centre.',
      'With each turn, the material cascades between the two cones, splitting and recombining.',
      'The finished blend is discharged through the valve at the cone tip.',
    ],
    flow: { in: ['Dry powders or granules'], action: 'Tumbling double cone', out: ['Uniform blend'] },
    specs: onRequest('Working capacity', 'Gross volume', 'Rotation speed', 'Motor & gearbox', 'Discharge valve', 'Contact-part material'),
  },
  {
    slug: 'ribbon-blender', name: 'Ribbon Blender', stage: 'blending', image: 'imgi_16_ribbon-blender.png',
    summary: 'U-shaped trough with a double helical ribbon agitator, for high-volume mixing of dry powders and pastes.',
    applications: ['Dry powder premixes', 'Spice and food blends', 'Chemical and fertiliser powders', 'Adding small amounts of liquid to powders'],
    howItWorks: [
      'Material is loaded into the horizontal U-shaped trough.',
      'A central shaft carries an outer and an inner ribbon, wound in opposite directions.',
      'As it turns, one ribbon moves material towards the ends and the other moves it back towards the centre.',
      'This counter-flow mixes the whole batch, which is then discharged through the bottom valve.',
    ],
    flow: { in: ['Dry powders or pastes'], action: 'Counter-flow ribbons', out: ['Uniform blend'] },
    specs: onRequest('Working capacity', 'Gross volume', 'Agitator speed', 'Motor & gearbox', 'Discharge valve', 'Contact-part material'),
  },

  // ── Sifting, granulation & storage ──
  {
    slug: 'vibro-sifter', name: 'Vibro Sifter', stage: 'granulation', image: 'imgi_17_vibro-sifter-new1.png',
    summary: 'Vibrating screen separator for sifting, grading and removing oversize particles from powders and granules.',
    applications: ['Sifting raw material powders', 'Grading granules', 'Removing lumps and foreign particles', 'Food, chemical and pharma powders'],
    howItWorks: [
      'Material is fed onto the top screen.',
      'A vibratory motor with eccentric weights makes the screen deck vibrate.',
      'Fine particles pass through the mesh while oversize particles travel to the outer edge.',
      'Each fraction leaves through its own outlet; extra decks grade the material into more sizes.',
    ],
    flow: { in: ['Powder or granules'], action: 'Vibrating mesh screen', out: ['Sifted fines', 'Oversize separated'] },
    specs: onRequest('Screen diameter', 'Number of decks', 'Output', 'Vibratory motor', 'Mesh sizes', 'Contact-part material'),
  },
  {
    slug: 'rapid-mixer-granulator', name: 'Rapid Mixer Granulator', stage: 'granulation', image: 'imgi_18_rapid-mixer-granulator1.png',
    summary: 'Mixes dry powders and forms wet granules in the same bowl, using a high-speed impeller and chopper.',
    applications: ['Wet granulation for tablets', 'Dry mixing', 'Nutraceutical and food granules', 'Chemical granules'],
    howItWorks: [
      'Dry powders are loaded into the bowl and mixed by the main impeller.',
      'Binder solution is added while mixing continues.',
      'The impeller builds granules while the high-speed side chopper breaks up oversized lumps.',
      'Wet granules are discharged through the side valve, ready for drying.',
    ],
    flow: { in: ['Dry powders', 'Binder solution'], action: 'Impeller + chopper', out: ['Wet granules to dryer'] },
    specs: onRequest('Working capacity', 'Gross volume', 'Impeller motor & speed', 'Chopper motor & speed', 'Discharge valve', 'Contact-part material', 'Controls'),
  },
  {
    slug: 'ipc-bin', name: 'IPC Bin', stage: 'granulation', image: 'imgi_19_IPC-bin.png',
    summary: 'In-process container for storing and moving granules and powders between process steps, closed against contamination.',
    applications: ['Transfer between granulation, blending and compression', 'In-process storage', 'Dust-controlled powder handling'],
    howItWorks: [
      'Material from one process step is charged into the bin through the top lid.',
      'The closed bin is moved to the next step on its wheels or with a lift.',
      'It is raised or positioned above the next machine.',
      'Material is discharged by gravity through the bottom valve.',
    ],
    flow: { in: ['Granules or powder from one step'], action: 'Closed, mobile container', out: ['Gravity discharge to next step'] },
    specs: onRequest('Capacity', 'Shape', 'Discharge valve', 'Wheels & mobility', 'Contact-part material', 'Surface finish'),
  },
  {
    slug: 'wfi-storage-tank', name: 'WFI Storage Tank', stage: 'granulation', image: 'imgi_20_wfi-storage-tank-1.png',
    summary: 'Stainless steel tanks for storing water for injection (WFI) and purified water, built for hygienic storage and circulation.',
    applications: ['Water for injection', 'Purified water', 'Pharmaceutical utility systems', 'Hygienic liquid storage'],
    howItWorks: [
      'Water from the generation system enters the tank.',
      'A vent filter protects the stored water as the level rises and falls.',
      'Water circulates in a loop through the distribution system to the points of use.',
      'Spray balls and drain valves allow the tank to be cleaned and sanitised.',
    ],
    flow: { in: ['WFI or purified water from generation'], action: 'Hygienic storage', out: ['Distribution loop to points of use'] },
    specs: onRequest('Capacity', 'Orientation', 'Jacket & insulation', 'Vent filter', 'Spray ball', 'Contact-part material', 'Surface finish'),
  },
  {
    slug: 'ss-storage-tank', name: 'SS Storage Tank', stage: 'granulation', image: 'ss-storage-tank.jpg',
    summary: 'Stainless steel tanks for storing liquids, in food, pharma, chemical and cosmetic plants. Made to your capacity, with the fittings and finish your product needs.',
    applications: ['Process liquids and syrups', 'Water and utility storage', 'Food and beverage ingredients', 'Chemicals and cosmetic bases'],
    howItWorks: [
      'Liquid enters the tank through its inlet nozzle.',
      'The vessel holds it in a closed, cleanable stainless steel body, with a jacket or insulation if the product needs temperature control.',
      'A vent, level indicator and sampling point let operators monitor the contents.',
      'Liquid leaves through the bottom outlet valve to the next process step or to filling.',
    ],
    flow: { in: ['Process liquid'], action: 'Closed stainless steel storage', out: ['Outlet to next step or filling'] },
    specs: onRequest('Capacity', 'Orientation (vertical / horizontal)', 'Grade (SS 304 / SS 316L)', 'Jacket and insulation', 'Nozzles and fittings', 'Surface finish', 'Agitator (optional)'),
  },
]

export const stageOf = (id: StageId) => stages.find((s) => s.id === id)!
export const productsIn = (id: StageId) => products.filter((p) => p.stage === id)
export const sheetNo = (p: Product) => String(products.indexOf(p) + 1).padStart(2, '0')

export const company = {
  name: 'RK Enterprises',
  phones: ['+91 90297 51852', '+91 90288 72590'],
  whatsapp: '919028872590',
  email: 'enquiry@rk-enterprises.co',
  address: ['A-1 Complex, B1 - U-16', 'A1 Industrial Estate, Kaman', 'Vasai-Virar, Maharashtra 421302'],
  gst: '27BDTPS0564A1ZE',
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM',
  mapUrl: 'https://www.google.com/maps?q=A1+Industrial+Estate+Kaman+Vasai-Virar+Maharashtra+421302',
}

export const tel = (phone: string) => 'tel:' + phone.replace(/\s/g, '')
export const waLink = (text: string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`
