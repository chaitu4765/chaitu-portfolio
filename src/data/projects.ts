export type Project = { slug: string; title: string; subtitle: string; category: string; status: string; tags: string[]; description: string; solution: string; features: string[]; users: string; architecture: string[]; rationale: string; contribution: string; challenges: string; validation: string; limitations: string; learning: string; future: string; repo: string; demo: string; visual: string; screenshot?: string; image?: string; categories?: string[]; overviewOnly?: boolean };
const studies: Project[] = [
{ slug:'ycn',title:'YCN',subtitle:'A place for a community to grow.',category:'Full-stack',status:'Development history · verification pending',tags:['React','Firebase','Firestore'],description:'A student community needs a shared place to discover events, connect with members, and participate.',solution:'A community platform explored around member and administrator workflows, using a React and Firebase architecture.',features:['Member registration and sign-in','Personal dashboards and ID cards','Events and participation history','Administrative event management'],users:'Students, community members, and event administrators.',architecture:['React interface','Firebase Authentication','Firestore member & event data'],rationale:'React supports reusable interfaces; Firebase provides managed authentication and document storage. A migration toward serverless Firebase on the Spark plan forms part of the project history.',contribution:'Worked on YCN and its community platform. Exact implementation ownership and contributions need confirmation before publication.',challenges:'Data consistency, access control, and coordinating admin and member workflows are important design concerns. Resolutions have not been verified from source.',validation:'Repository, access-control tests, and current deployment have not been supplied. Features listed here describe historical or intended scope.',limitations:'Current working features and deployment status need verification.',learning:'Reflection pending: document the verified lessons from deployment, maintenance, and authentication work.',future:'Verify member flows, review access rules, and document deployment steps.',repo:'',demo:'',visual:'community'},
{ slug:'campusconnect',title:'CampusConnect',subtitle:'University life, better connected.',category:'Mobile apps',status:'Concept · implementation unverified',tags:['Kotlin (proposed)','Compose (proposed)','Firebase (proposed)'],description:'Library information, laboratory opportunities, and career guidance are scattered across university resources.',solution:'A university super-app concept that prioritizes three student needs instead of trying to build every campus service at once.',features:['Conversational library assistant','Lab and workshop discovery','Structured career roadmaps'],users:'University students exploring campus resources and career paths.',architecture:['Compose interface (proposed)','Student resource layer (proposed)','Firebase / AI services (proposed)'],rationale:'Kotlin and Jetpack Compose are the proposed native Android direction. Firebase and AI integration require implementation and privacy decisions.',contribution:'Explored the CampusConnect concept. Repository evidence is needed to describe implementation ownership.',challenges:'Resource freshness, trustworthy answers, and feature prioritization remain design questions; no solved implementation is claimed.',validation:'No repository or usability results supplied. This is a concept presentation.',limitations:'No live functionality or on-device inference is claimed.',learning:'Reflection pending implementation and student feedback.',future:'Validate resource needs with students and prototype one complete workflow.',repo:'',demo:'',visual:'campus'},
{ slug:'opptrack',title:'OppTrack',subtitle:'Find the opportunity in the noise.',category:'Applied AI',status:'Exploration · implementation unverified',tags:['Android','On-device AI (concept)','Local processing (intended)'],description:'Internships, jobs, and hackathons can disappear in the stream of Android notifications.',solution:'An exploration of extracting structured opportunities from notification text using on-device language-model inference.',features:['Notification listener (scope to verify)','Structured opportunity extraction','Bookmarking and application tracking (intended)'],users:'Students and early-career applicants managing opportunities.',architecture:['Android notification listener (intended)','On-device text extraction (intended)','Local opportunity storage (intended)'],rationale:'The concept favors local text processing. Actual device support, model runtime, storage, and any server dependencies require source verification.',contribution:'Explored the OppTrack mobile application direction. Exact working features need repository confirmation.',challenges:'Notification permissions, sensitive text, model reliability, and device resource use need validation. No resolved performance claims are made.',validation:'No device tests or model evaluation results provided.',limitations:'PhishGuard AI is a distinct later cybersecurity direction, not a verified feature of OppTrack. It aims to analyze suspicious links and explain phishing classifications; implementation is unverified.',learning:'Reflection pending: document practical findings from notification handling and local inference.',future:'Verify permission flows, test extraction on consented examples, and document privacy boundaries.',repo:'',demo:'',visual:'opportunity'},
{ slug:'weather-aware-fuel',title:'Weather-aware fuel prediction',subtitle:'Understanding the conditions ahead.',category:'Research',status:'Research exploration · results unverified',tags:['Python','Ensemble learning','SLSQP'],description:'Ship fuel consumption depends on operational conditions as well as wind, waves, and ocean currents.',solution:'Exploring a weather-aware hybrid ensemble with physics-inspired features and SLSQP weight optimization.',features:['Data preprocessing and feature engineering','Comparison of regression and tree models','Weighted ensembles and Ridge stacking','Evaluation and explainability'],users:'Research and engineering audiences studying maritime fuel prediction.',architecture:['Operational + weather variables','Physics-inspired feature pipeline','Candidate models + ensemble','Evaluation / explainability'],rationale:'The modeling history includes Ridge, Random Forest, XGBoost, LightGBM, Gradient Boosting, SLSQP ensemble weighting, and a Ridge meta-regressor. NSGA-II route optimization is a separate downstream research task.',contribution:'Worked on this research direction. Specific experiments and implementation ownership need source confirmation.',challenges:'Real-world data quality, leakage-free evaluation, and model comparison are central concerns. No verified challenge resolution is available.',validation:'No datasets, evaluation splits, notebooks, or results files supplied. No accuracy, savings, or publication claims are made.',limitations:'Prediction and route optimization are distinct tasks. Experimental results remain unpublished here until verified.',learning:'Reflection pending: record reproducible findings and limitations from the actual experiments.',future:'Document data provenance, establish reproducible baselines, and report validated evaluation results.',repo:'',demo:'',visual:'research'},
];

const liveWebsites: Project[] = [
  {
    "slug": "dealatecorp",
    "title": "DealateCorp",
    "subtitle": "Technology, branding, and digital growth.",
    "description": "A corporate website presenting DealateCorp’s IT and digital marketing services, creative work, and client partnerships.",
    "tags": [
      "Corporate",
      "Digital services"
    ],
    "features": [
      "IT and digital marketing service pages",
      "Selected creative work and client showcase",
      "Project enquiry and contact page"
    ],
    "demo": "https://dealatecorp-portfolio.vercel.app/"
  },
  {
    "slug": "ycn",
    "title": "Youth Networking Community",
    "subtitle": "A digital home for the next generation of builders.",
    "description": "A community website introducing YNC’s networking, events, hackathons, and mentorship programs through a space-inspired interface.",
    "tags": [
      "Community",
      "Events"
    ],
    "features": [
      "Community mission and journey",
      "Programs, events, and membership information",
      "Photo galleries and community portal entry"
    ],
    "demo": "https://youth-networking-community.vercel.app/"
  },
  {
    "slug": "vizag-chamber",
    "title": "Vizag Chamber",
    "subtitle": "Connecting business, people, and possibilities.",
    "description": "A website for the Vizagapatam Chamber of Commerce and Industry, presenting its community, membership, leadership, and business activities.",
    "tags": [
      "Business community",
      "Membership"
    ],
    "features": [
      "Chamber and leadership information",
      "Membership and services navigation",
      "Events, media, and community highlights"
    ],
    "demo": "https://vizagchambers-u216.vercel.app/"
  },
  {
    "slug": "godha-towers",
    "title": "DC Real-estate",
    "subtitle": "A considered introduction to Godha Towers.",
    "description": "A property website presenting Godha Towers in Yendada, Visakhapatnam, with an architectural introduction, residences, amenities, and project information.",
    "tags": [
      "Real estate",
      "Property showcase"
    ],
    "features": [
      "Architectural hero and project overview",
      "Residences and amenity showcase",
      "Project information and contact navigation"
    ],
    "demo": "https://dcreal-estate.vercel.app/"
  },
  {
    "slug": "hytalent",
    "title": "HYtalent",
    "subtitle": "Learning that moves people forward.",
    "description": "A learning and development website presenting HYtalent’s training programs and services for organizations, students, and professionals.",
    "tags": [
      "Learning",
      "Training programs"
    ],
    "features": [
      "Leadership and behavioural training",
      "Programs for organizations and early careers",
      "Company story, gallery, and contact pages"
    ],
    "demo": "https://hytalent.vercel.app/"
  },
  {
    "slug": "padmam",
    "title": "Padmam",
    "subtitle": "Silver jewellery, with a story.",
    "description": "A jewellery website prototype showcasing Padmam’s 92.5 silver collections, campaign imagery, and Indian artistry.",
    "tags": [
      "Jewellery",
      "Storefront prototype"
    ],
    "features": [
      "Campaign carousel and collection discovery",
      "Necklace, earring, bridal, and bangle collections",
      "Brand story and jewellery presentation"
    ],
    "demo": "https://padmam.vercel.app/"
  }
].map(project => ({
 ...project, category: 'Live websites', status: project.slug === 'padmam' ? 'Live prototype' : 'Live website',
 visual: 'homepage', screenshot: '/images/projects/' + project.slug + '.webp',
 solution: project.description, users: '', architecture: [], rationale: '',
 contribution: 'Website design and development by Ganta Krishna Chaitanya.',
 challenges: '', validation: 'Public homepage captured on 29 October 2026.',
 limitations: '', learning: '', future: '', repo: '',
}));

const mobileApps: Project[] = [
  {
    "slug": "moto-stock",
    "title": "Moto Stock",
    "subtitle": "Dealership ERP for stock, invoices, stores, and sales.",
    "description": "A showroom-focused mobile ERP application for managing incoming bikes, customer invoices, outgoing sales, and store-level visibility.",
    "features": [
      "Incoming bike and stock management",
      "Customer invoices and outgoing sales",
      "Store-level operational visibility"
    ],
    "tags": [
      "Android",
      "Dealership ERP",
      "Inventory"
    ],
    "solution": "A mobile workspace connecting the everyday stock and sales workflows of a vehicle dealership.",
    "contribution": "Designed and developed Moto Stock.",
    "categories": [
      "Mobile apps"
    ]
  },
  {
    "slug": "medistock",
    "title": "MediStock",
    "subtitle": "Offline-first pharmacy inventory and billing.",
    "description": "A pharmacy workspace for medicines, stock, purchases, billing, branches, reports, and local operational control.",
    "features": [
      "Medicine and stock management",
      "Purchases and billing",
      "Branches and operational reports",
      "Offline-first local operations"
    ],
    "tags": [
      "Android",
      "Offline-first",
      "Pharmacy operations"
    ],
    "solution": "An offline-first mobile workspace that brings pharmacy inventory, billing, and operational information together.",
    "contribution": "Designed and developed MediStock.",
    "categories": [
      "Mobile apps"
    ]
  },
  {
    "slug": "rakshak",
    "title": "Rakshak",
    "subtitle": "On-device phishing detection, before the next tap.",
    "description": "A cybersecurity application that reads user notifications, detects phishing links with a small language model running locally on the mobile device, and warns the user.",
    "features": [
      "Reads user notifications to identify links",
      "Analyzes links using a locally running small language model",
      "Warns the user when a link is flagged as potential phishing"
    ],
    "tags": [
      "Android",
      "Cybersecurity",
      "Local SLM",
      "Research"
    ],
    "solution": "Notification intake → link analysis with a local small language model → user warning. The application brings phishing detection into the mobile notification workflow.",
    "contribution": "Designed and developed Rakshak, combining a mobile security application with on-device SLM research.",
    "categories": [
      "Mobile apps",
      "Research",
      "Applied AI"
    ]
  }
].map(project => ({
 ...project, category: 'Mobile apps', status: 'Built application', visual: 'app',
 image: '/images/projects/' + project.slug + '.svg', overviewOnly: true,
 users: '', architecture: [], rationale: '', challenges: '', validation: '',
 limitations: '', learning: '', future: '', repo: '', demo: '',
}));

const illustratedStudies = studies.filter(project => project.slug !== 'ycn').map(project => ({
 ...project, image: '/images/projects/' + project.slug + '.svg',
}));
export const projects: Project[] = [...liveWebsites, ...mobileApps, ...illustratedStudies];
export function matchesProjectFilter(project: Project, filter: string) {
 return filter === 'All projects' || project.category === filter || Boolean(project.categories?.includes(filter));
}

