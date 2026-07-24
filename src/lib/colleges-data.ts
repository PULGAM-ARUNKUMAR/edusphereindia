export type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  courses: string[];
  nirfRank: number;
  naacGrade: "A++" | "A+" | "A" | "B++";
  feeMin: number;
  feeMax: number;
  hostelAvailable: boolean;
  hostelFee?: number;
  environmentHighlights: string[];
  coverImage: string;
  gallery: string[];
  placementRate: number;
  avgPackageLpa: number;
  description: string;
  address: string;
  placements: {
    highestPackageLpa: number;
    medianPackageLpa: number;
    topRecruiters: string[];
    trend: { year: number; avgLpa: number; placementRate: number }[];
    sectorSplit: { sector: string; percent: number }[];
  };
};

export const COURSES = [
  "B.Tech",
  "MBA",
  "BBA",
  "BA",
  "MCA",
  "Medicine",
  "PhD",
] as const;

const img = (seed: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

// Curated Unsplash photo IDs for realistic campus/education imagery
const gallery = (ids: string[]) => ids.map((id) => img(id));

export const colleges: College[] = [
  {
    id: "1",
    name: "IIT Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    courses: ["B.Tech", "MCA", "PhD"],
    nirfRank: 3,
    naacGrade: "A++",
    feeMin: 220000,
    feeMax: 250000,
    hostelAvailable: true,
    hostelFee: 32000,
    environmentHighlights: [
      "550-acre lush green campus",
      "24/7 Central Library",
      "SINE Incubation Hub",
      "Powai Lake views",
    ],
    coverImage: img("photo-1562774053-701939374585"),
    gallery: gallery([
      "photo-1562774053-701939374585",
      "photo-1523050854058-8df90110c9f1",
      "photo-1541339907198-e08756dedf3f",
      "photo-1607013251379-e6eecfffe234",
    ]),
    placementRate: 92,
    avgPackageLpa: 21.8,
    description:
      "The Indian Institute of Technology Bombay is a premier public technical university located in Powai, Mumbai. Renowned worldwide for engineering, research, and entrepreneurship, IITB consistently ranks among India's top institutions.",
    address: "Powai, Mumbai, Maharashtra 400076",
  },
  {
    id: "2",
    name: "IIM Ahmedabad",
    slug: "iim-ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    courses: ["MBA", "PhD"],
    nirfRank: 1,
    naacGrade: "A++",
    feeMin: 1200000,
    feeMax: 1400000,
    hostelAvailable: true,
    hostelFee: 80000,
    environmentHighlights: [
      "Louis Kahn iconic red-brick campus",
      "Vikram Sarabhai Library",
      "Global case-based pedagogy",
    ],
    coverImage: img("photo-1607013251379-e6eecfffe234"),
    gallery: gallery([
      "photo-1607013251379-e6eecfffe234",
      "photo-1519452575417-564c1401ecc0",
      "photo-1498243691581-b145c3f54a5a",
      "photo-1526040652367-ac003a0475fe",
    ]),
    placementRate: 100,
    avgPackageLpa: 34.5,
    description:
      "IIM Ahmedabad is India's most prestigious business school, consistently ranked #1 by NIRF. Its flagship PGP program produces India's top business leaders across sectors.",
    address: "Vastrapur, Ahmedabad, Gujarat 380015",
  },
  {
    id: "3",
    name: "AIIMS New Delhi",
    slug: "aiims-new-delhi",
    city: "New Delhi",
    state: "Delhi",
    courses: ["Medicine", "PhD"],
    nirfRank: 1,
    naacGrade: "A++",
    feeMin: 1600,
    feeMax: 6000,
    hostelAvailable: true,
    hostelFee: 5000,
    environmentHighlights: [
      "India's #1 medical institute",
      "2200-bed super-specialty hospital",
      "Cutting-edge research labs",
    ],
    coverImage: img("photo-1519494026892-80bbd2d6fd0d"),
    gallery: gallery([
      "photo-1519494026892-80bbd2d6fd0d",
      "photo-1587351021759-3e566b6af7cc",
      "photo-1538108149393-fbbd81895907",
      "photo-1504439468489-c8920d796a29",
    ]),
    placementRate: 100,
    avgPackageLpa: 12.0,
    description:
      "The All India Institute of Medical Sciences, New Delhi is India's foremost public medical college and hospital. MBBS at AIIMS remains the most sought-after medical degree in India.",
    address: "Ansari Nagar, New Delhi 110029",
  },
  {
    id: "4",
    name: "St. Xavier's College",
    slug: "st-xaviers-mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    courses: ["BA", "BBA", "MCA"],
    nirfRank: 14,
    naacGrade: "A+",
    feeMin: 40000,
    feeMax: 55000,
    hostelAvailable: false,
    environmentHighlights: [
      "Heritage Gothic architecture",
      "150+ years of academic legacy",
      "Vibrant Malhar cultural fest",
    ],
    coverImage: img("photo-1498243691581-b145c3f54a5a"),
    gallery: gallery([
      "photo-1498243691581-b145c3f54a5a",
      "photo-1541339907198-e08756dedf3f",
      "photo-1523050854058-8df90110c9f1",
    ]),
    placementRate: 78,
    avgPackageLpa: 6.5,
    description:
      "St. Xavier's College, Mumbai is an autonomous arts, science, and commerce institution known for its academic excellence and rich Jesuit heritage since 1869.",
    address: "5 Mahapalika Marg, Mumbai, Maharashtra 400001",
  },
  {
    id: "5",
    name: "Christ University",
    slug: "christ-university",
    city: "Bengaluru",
    state: "Karnataka",
    courses: ["BBA", "MBA", "BA", "MCA"],
    nirfRank: 60,
    naacGrade: "A+",
    feeMin: 180000,
    feeMax: 220000,
    hostelAvailable: true,
    hostelFee: 95000,
    environmentHighlights: [
      "Modern urban campus",
      "Global exchange programs",
      "Vibrant multicultural student body",
    ],
    coverImage: img("photo-1541339907198-e08756dedf3f"),
    gallery: gallery([
      "photo-1541339907198-e08756dedf3f",
      "photo-1523050854058-8df90110c9f1",
      "photo-1562774053-701939374585",
      "photo-1519452575417-564c1401ecc0",
    ]),
    placementRate: 88,
    avgPackageLpa: 7.8,
    description:
      "Christ (Deemed to be University), Bengaluru is a private university offering holistic education across disciplines with a strong industry-academia interface.",
    address: "Hosur Rd, Bengaluru, Karnataka 560029",
  },
  {
    id: "6",
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    courses: ["B.Tech", "MCA", "BBA", "PhD"],
    nirfRank: 11,
    naacGrade: "A++",
    feeMin: 198000,
    feeMax: 395000,
    hostelAvailable: true,
    hostelFee: 75000,
    environmentHighlights: [
      "372-acre green campus",
      "5000+ international students",
      "State-of-the-art labs & maker spaces",
    ],
    coverImage: img("photo-1523050854058-8df90110c9f1"),
    gallery: gallery([
      "photo-1523050854058-8df90110c9f1",
      "photo-1562774053-701939374585",
      "photo-1519452575417-564c1401ecc0",
      "photo-1607013251379-e6eecfffe234",
    ]),
    placementRate: 90,
    avgPackageLpa: 9.2,
    description:
      "VIT Vellore is a private research university offering globally benchmarked undergraduate and postgraduate programs in engineering, sciences, and management.",
    address: "Katpadi, Vellore, Tamil Nadu 632014",
  },
];

export function getCollegeBySlug(slug: string): College | undefined {
  return colleges.find((c) => c.slug === slug);
}

export function formatINR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}