/**
 * Yunda Fashion - Initial Mock Data & Store Configuration
 * Kompatibel untuk langsung dibuka via klik ganda (file://) maupun web server (http://)
 */

const INITIAL_PRODUCTS = [
  // --- 1. KEMEJA ---
  {
    id: "PROD-001",
    sku: "KMJ-OVR-01",
    name: "Kemeja Rayon Oversize",
    category: "Kemeja",
    price: 115000,
    minStock: 5,
    rackId: "rak-a1",
    rackName: "Rak Gantung A - Baris 1",
    zone: "Zona Kemeja Pria & Wanita",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-001-1", color: "Sage Green", size: "All Size", stock: 18, qrCode: "QR-KMJ-OVR-SG" },
      { id: "VAR-001-2", color: "Broken White", size: "All Size", stock: 5, qrCode: "QR-KMJ-OVR-BW" },
      { id: "VAR-001-3", color: "Dusty Pink", size: "All Size", stock: 2, qrCode: "QR-KMJ-OVR-DP" }
    ],
    description: "Kemeja bahan rayon twill adem, jatuh, cocok untuk style casual modern dan daily outfit hijab."
  },
  {
    id: "PROD-002",
    sku: "KMJ-LNN-02",
    name: "Kemeja Linen Kerah Basic",
    category: "Kemeja",
    price: 135000,
    minStock: 4,
    rackId: "rak-a2",
    rackName: "Rak Gantung A - Baris 2",
    zone: "Zona Kemeja Pria & Wanita",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-002-1", color: "Cream Khaki", size: "M", stock: 12, qrCode: "QR-KMJ-LNN-CK-M" },
      { id: "VAR-002-2", color: "Navy Blue", size: "L", stock: 8, qrCode: "QR-KMJ-LNN-NB-L" },
      { id: "VAR-002-3", color: "Pure White", size: "XL", stock: 1, qrCode: "QR-KMJ-LNN-PW-XL" }
    ],
    description: "Kemeja linen premium berserat tegas, memberi kesan elegan dan rapi untuk formal maupun santai."
  },

  // --- 2. BLUS ---
  {
    id: "PROD-003",
    sku: "BLS-FLR-01",
    name: "Blus Floral Chiffon Korean Style",
    category: "Blus",
    price: 98000,
    minStock: 6,
    rackId: "island-1",
    rackName: "Island Rack Tengah 1",
    zone: "Zona Trendy Blouse",
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-003-1", color: "Floral Lilac", size: "M", stock: 14, qrCode: "QR-BLS-FLR-LL" },
      { id: "VAR-003-2", color: "Floral Soft Peach", size: "L", stock: 6, qrCode: "QR-BLS-FLR-SP" },
      { id: "VAR-003-3", color: "Floral Sky Blue", size: "XL", stock: 3, qrCode: "QR-BLS-FLR-SB" }
    ],
    description: "Blus motif bunga aesthetic korea dengan aksen tali leher dan ruffle lengan terompet."
  },
  {
    id: "PROD-004",
    sku: "BLS-SLK-02",
    name: "Blus Silk Kerut Organza",
    category: "Blus",
    price: 125000,
    minStock: 4,
    rackId: "island-1",
    rackName: "Island Rack Tengah 1",
    zone: "Zona Trendy Blouse",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-004-1", color: "Rose Gold", size: "All Size", stock: 9, qrCode: "QR-BLS-SLK-RG" },
      { id: "VAR-004-2", color: "Champagne", size: "All Size", stock: 0, qrCode: "QR-BLS-SLK-CP" }
    ],
    description: "Blus sutra sintetis mengkilap anggun dengan detail kerutan cantik pada bagian dada."
  },

  // --- 3. GAMIS ---
  {
    id: "PROD-005",
    sku: "GMS-ABY-01",
    name: "Gamis Abaya Silk Turkey Luxury",
    category: "Gamis",
    price: 245000,
    minStock: 5,
    rackId: "etalase-depan",
    rackName: "Etalase Depan Utama (Mannequin)",
    zone: "Zona Premium Luxury Display",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-005-1", color: "Midnight Black", size: "L", stock: 15, qrCode: "QR-GMS-ABY-MB-L" },
      { id: "VAR-005-2", color: "Emerald Green", size: "XL", stock: 4, qrCode: "QR-GMS-ABY-EG-XL" },
      { id: "VAR-005-3", color: "Burgundy Maroon", size: "XXL", stock: 2, qrCode: "QR-GMS-ABY-BM-XXL" }
    ],
    description: "Gamis abaya model flowy dengan bordir benang emas di manset lengan, bahan silk premium adem."
  },
  {
    id: "PROD-006",
    sku: "GMS-CRT-02",
    name: "Gamis Ceruty Babydoll 2-Layer",
    category: "Gamis",
    price: 185000,
    minStock: 5,
    rackId: "rak-b1",
    rackName: "Rak Gantung B - Gamis & Dress",
    zone: "Zona Gamis Casual Muslimah",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-006-1", color: "Mocca Brown", size: "M", stock: 20, qrCode: "QR-GMS-CRT-MB-M" },
      { id: "VAR-006-2", color: "Dusty Lavender", size: "L", stock: 7, qrCode: "QR-GMS-CRT-DL-L" },
      { id: "VAR-006-3", color: "Olive Green", size: "XL", stock: 1, qrCode: "QR-GMS-CRT-OG-XL" }
    ],
    description: "Gamis berlapis bahan ceruty babydoll full furing hyget tebal tidak menerawang, busui friendly."
  },

  // --- 4. ROK ---
  {
    id: "PROD-007",
    sku: "ROK-PLS-01",
    name: "Rok Plisket Premium Velvet Glow",
    category: "Rok",
    price: 75000,
    minStock: 6,
    rackId: "island-1",
    rackName: "Island Rack Tengah 1",
    zone: "Zona Trendy Blouse & Skirt",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-007-1", color: "Hitam Pekat", size: "All Size", stock: 25, qrCode: "QR-ROK-PLS-HP" },
      { id: "VAR-007-2", color: "Dark Choco", size: "All Size", stock: 8, qrCode: "QR-ROK-PLS-DC" },
      { id: "VAR-007-3", color: "Milo Nude", size: "All Size", stock: 3, qrCode: "QR-ROK-PLS-MN" }
    ],
    description: "Rok lipit plisket awet lipatan rapi tidak mudah melar, pinggang full karet elastis nyaman."
  },
  {
    id: "PROD-008",
    sku: "ROK-SPN-02",
    name: "Rok Span Rajut Rib Premium",
    category: "Rok",
    price: 68000,
    minStock: 5,
    rackId: "island-1",
    rackName: "Island Rack Tengah 1",
    zone: "Zona Trendy Blouse & Skirt",
    image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-008-1", color: "Charcoal Grey", size: "M", stock: 11, qrCode: "QR-ROK-SPN-CG" },
      { id: "VAR-008-2", color: "Oatmeal Beige", size: "L", stock: 4, qrCode: "QR-ROK-SPN-OB" }
    ],
    description: "Rok rajut knit tebal bertekstur garis lurus vertikal, memberi efek kaki lebih jenjang dan modis."
  },

  // --- 5. JEANS ---
  {
    id: "PROD-009",
    sku: "JNS-BF-01",
    name: "Highwaist Boyfriend Jeans Denim",
    category: "Jeans",
    price: 145000,
    minStock: 5,
    rackId: "island-2",
    rackName: "Island Rack Tengah 2 (Denim & Pants)",
    zone: "Zona Denim & Celana",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-009-1", color: "Light Snow Blue", size: "28", stock: 16, qrCode: "QR-JNS-BF-LSB-28" },
      { id: "VAR-009-2", color: "Medium Vintage", size: "29", stock: 7, qrCode: "QR-JNS-BF-MV-29" },
      { id: "VAR-009-3", color: "Dark Indigo", size: "30", stock: 2, qrCode: "QR-JNS-BF-DI-30" }
    ],
    description: "Celana jeans potongan boyfriend non-stretch authentic denim tebal 13oz, cutting rapi dan stylish."
  },
  {
    id: "PROD-010",
    sku: "JNS-SKN-02",
    name: "Skinny Stretch Jeans High Rise",
    category: "Jeans",
    price: 139000,
    minStock: 5,
    rackId: "island-2",
    rackName: "Island Rack Tengah 2 (Denim & Pants)",
    zone: "Zona Denim & Celana",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-010-1", color: "Jet Black", size: "28", stock: 14, qrCode: "QR-JNS-SKN-JB-28" },
      { id: "VAR-010-2", color: "Navy Wash", size: "29", stock: 5, qrCode: "QR-JNS-SKN-NW-29" },
      { id: "VAR-010-3", color: "Acid Grey", size: "30", stock: 0, qrCode: "QR-JNS-SKN-AG-30" }
    ],
    description: "Jeans skinny super stretch melar elastis mengikuti siluet kaki tanpa rasa sesak saat beraktivitas."
  },

  // --- 6. CELANA KAIN ---
  {
    id: "PROD-011",
    sku: "CLN-KLT-01",
    name: "Celana Kulot Scuba Highwaist Formal",
    category: "Celana Kain",
    price: 89000,
    minStock: 6,
    rackId: "island-2",
    rackName: "Island Rack Tengah 2 (Denim & Pants)",
    zone: "Zona Denim & Celana",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-011-1", color: "Black Formal", size: "All Size", stock: 22, qrCode: "QR-CLN-KLT-BF" },
      { id: "VAR-011-2", color: "Ivory White", size: "All Size", stock: 9, qrCode: "QR-CLN-KLT-IW" },
      { id: "VAR-011-3", color: "Camel Brown", size: "All Size", stock: 2, qrCode: "QR-CLN-KLT-CB" }
    ],
    description: "Kulot bahan scuba gramasi tebal lembut, bertekstur mulus, tidak jiplak, cocok untuk kantor dan kuliah."
  },
  {
    id: "PROD-012",
    sku: "CLN-ANK-02",
    name: "Ankle Pants Semi Wool Slim Fit",
    category: "Celana Kain",
    price: 110000,
    minStock: 4,
    rackId: "island-2",
    rackName: "Island Rack Tengah 2 (Denim & Pants)",
    zone: "Zona Denim & Celana",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-012-1", color: "Dark Grey", size: "M", stock: 10, qrCode: "QR-CLN-ANK-DG" },
      { id: "VAR-012-2", color: "Beige Tan", size: "L", stock: 4, qrCode: "QR-CLN-ANK-BT" }
    ],
    description: "Celana panjang model ankle pants potongan lurus modern, bahan semi wool halus anti lecek."
  },

  // --- 7. MANSET ---
  {
    id: "PROD-013",
    sku: "MNS-TRT-01",
    name: "Manset Turtle Neck Kaos Spandek Rayon",
    category: "Manset",
    price: 35000,
    minStock: 8,
    rackId: "rak-c1",
    rackName: "Rak Display C - Inner & Aksesoris",
    zone: "Zona Inner & Essentials",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-013-1", color: "Hitam", size: "All Size", stock: 30, qrCode: "QR-MNS-TRT-HTM" },
      { id: "VAR-013-2", color: "Putih Bersih", size: "All Size", stock: 8, qrCode: "QR-MNS-TRT-PTH" },
      { id: "VAR-013-3", color: "Kulit Nude", size: "All Size", stock: 3, qrCode: "QR-MNS-TRT-NUD" },
      { id: "VAR-013-4", color: "Abu Misty", size: "All Size", stock: 1, qrCode: "QR-MNS-TRT-MST" }
    ],
    description: "Inner turtle neck leher tinggi adem super elastis, menyerap keringat dan tidak menerawang."
  },
  {
    id: "PROD-014",
    sku: "MNS-TGN-02",
    name: "Manset Tangan Sambung Bolero",
    category: "Manset",
    price: 28000,
    minStock: 6,
    rackId: "rak-c1",
    rackName: "Rak Display C - Inner & Aksesoris",
    zone: "Zona Inner & Essentials",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-014-1", color: "Hitam", size: "All Size", stock: 19, qrCode: "QR-MNS-TGN-HTM" },
      { id: "VAR-014-2", color: "Coksu / Mocca", size: "All Size", stock: 6, qrCode: "QR-MNS-TGN-CKS" }
    ],
    description: "Manset bolero praktis menyatu di bagian punggung, tidak mudah melorot saat dipakai olahraga atau luar ruangan."
  },

  // --- 8. LEJING ---
  {
    id: "PROD-015",
    sku: "LJG-WDH-01",
    name: "Legging Wudhu Friendly Premium Jersey",
    category: "Lejing",
    price: 49000,
    minStock: 8,
    rackId: "rak-c2",
    rackName: "Rak Display C - Inner & Aksesoris",
    zone: "Zona Inner & Essentials",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-015-1", color: "Hitam", size: "Standard (M-XL)", stock: 35, qrCode: "QR-LJG-WDH-HTM-STD" },
      { id: "VAR-015-2", color: "Hitam", size: "Jumbo (XXL-XXXL)", stock: 8, qrCode: "QR-LJG-WDH-HTM-JMB" },
      { id: "VAR-015-3", color: "Dark Nude", size: "Standard (M-XL)", stock: 3, qrCode: "QR-LJG-WDH-NUD-STD" }
    ],
    description: "Legging dengan lubang di telapak kaki untuk mempermudah saat berwudhu tanpa perlu melepas celana."
  },
  {
    id: "PROD-016",
    sku: "LJG-SML-02",
    name: "Legging Highwaist Seamless Anti Begah",
    category: "Lejing",
    price: 55000,
    minStock: 7,
    rackId: "rak-c2",
    rackName: "Rak Display C - Inner & Aksesoris",
    zone: "Zona Inner & Essentials",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    variants: [
      { id: "VAR-016-1", color: "Deep Charcoal", size: "All Size", stock: 15, qrCode: "QR-LJG-SML-DC" },
      { id: "VAR-016-2", color: "Maroon Solid", size: "All Size", stock: 4, qrCode: "QR-LJG-SML-MS" },
      { id: "VAR-016-3", color: "Navy Solid", size: "All Size", stock: 0, qrCode: "QR-LJG-SML-NS" }
    ],
    description: "Legging tanpa jahitan samping, bahan rajut elastis yang menopang perut dengan lembut dan nyaman."
  }
];

const STORE_RACKS = [
  {
    id: "etalase-depan",
    name: "Etalase Depan & Mannequin",
    category: "Gamis / Premium Display",
    icon: "sparkles",
    capacity: 30,
    colorTheme: "#f43f5e",
    gridArea: "etalase",
    description: "Area showcase kaca depan toko untuk koleksi gamis mewah & produk unggulan."
  },
  {
    id: "rak-a1",
    name: "Rak Gantung A1 (Kemeja 1)",
    category: "Kemeja",
    icon: "shirt",
    capacity: 40,
    colorTheme: "#3b82f6",
    gridArea: "raka1",
    description: "Rak dinding gantung sisi kiri untuk Kemeja Oversize & Rayon."
  },
  {
    id: "rak-a2",
    name: "Rak Gantung A2 (Kemeja 2)",
    category: "Kemeja",
    icon: "shirt",
    capacity: 40,
    colorTheme: "#0ea5e9",
    gridArea: "raka2",
    description: "Rak dinding gantung sisi kiri untuk Kemeja Linen & Formal."
  },
  {
    id: "island-1",
    name: "Island Rack Tengah 1 (Blus & Rok)",
    category: "Blus & Rok",
    icon: "layers",
    capacity: 60,
    colorTheme: "#ec4899",
    gridArea: "island1",
    description: "Display island tengah toko untuk blus korea dan rok plisket/span."
  },
  {
    id: "island-2",
    name: "Island Rack Tengah 2 (Denim & Celana)",
    category: "Jeans & Celana Kain",
    icon: "grid",
    capacity: 60,
    colorTheme: "#6366f1",
    gridArea: "island2",
    description: "Display island tengah toko untuk celana jeans & kulot scuba."
  },
  {
    id: "rak-b1",
    name: "Rak Gantung B (Gamis & Dress)",
    category: "Gamis",
    icon: "tag",
    capacity: 45,
    colorTheme: "#8b5cf6",
    gridArea: "rakb",
    description: "Rak gantung dinding sisi kanan khusus gamis ceruty dan long dress."
  },
  {
    id: "rak-c1",
    name: "Rak Display C1 (Manset Inner)",
    category: "Manset",
    icon: "package",
    capacity: 70,
    colorTheme: "#10b981",
    gridArea: "rakc1",
    description: "Rak display berjenjang untuk aneka manset leher & manset tangan."
  },
  {
    id: "rak-c2",
    name: "Rak Display C2 (Lejing Legging)",
    category: "Lejing",
    icon: "package",
    capacity: 70,
    colorTheme: "#14b8a6",
    gridArea: "rakc2",
    description: "Rak display bertingkat untuk legging wudhu & highwaist seamless."
  },
  {
    id: "area-kasir",
    name: "Meja Kasir & POS Gateway",
    category: "Checkout / Scanner",
    icon: "credit-card",
    capacity: 0,
    colorTheme: "#64748b",
    gridArea: "kasir",
    description: "Area kasir untuk proses transaksi penjualan, QR scanner barcode & cetak nota."
  },
  {
    id: "fitting-room",
    name: "Fitting Room & Cermin 360°",
    category: "Fitting Room",
    icon: "user",
    capacity: 0,
    colorTheme: "#94a3b8",
    gridArea: "fitting",
    description: "Kamar pas pelanggan dengan cermin full body dan pencahayaan estetik."
  }
];

const CATEGORIES = [
  "Semua",
  "Kemeja",
  "Blus",
  "Gamis",
  "Rok",
  "Jeans",
  "Celana Kain",
  "Manset",
  "Lejing"
];

// Ekspos ke window agar bisa diakses secara global (tanpa terhalang CORS file://)
window.YUNDA_DATA = {
  INITIAL_PRODUCTS,
  STORE_RACKS,
  CATEGORIES
};
