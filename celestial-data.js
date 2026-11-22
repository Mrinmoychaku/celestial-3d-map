/**
 * CELESTIAL DATA & TELEMETRY - COMPREHENSIVE ATMOSPHERE & WEATHER ARCHITECTURE
 * Contains high-precision planetary physics, dynamic weather patterns,
 * supersonic wind speeds, atmospheric chemical spectroscopy, altitude layers,
 * internal core structures, and complete moon systems.
 */

const CELESTIAL_DATA = [
  {
    id: "sun",
    name: "সোলিস প্রাইম (Solis Prime)",
    nameEn: "Solis Prime",
    type: "নক্ষত্র (Primary Star)",
    spectral: "G2V Hyper-Radiant",
    radiusKm: "696,340 km",
    mass: "1.989 × 10³⁰ kg",
    temp: "5,778 K (Surface) / 15M K (Core)",
    velocity: "—",
    distanceAu: "0.00 AU",
    period: "—",
    description: "নক্ষত্রমন্ডলের কেন্দ্রীয় উজ্জ্বল নক্ষত্র। এর মহাকর্ষীয় ক্ষেত্র সমগ্র মণ্ডলের গতিপথ নিয়ন্ত্রণ করে এবং প্লাজমা ও তাপশক্তি বিকিরণ করে।",
    descriptionEn: "The central radiant star of the system. Its gravitational anchor controls all orbital dynamics and radiates sustained fusion energy.",
    color: "#ffaa33",
    emissive: true,
    size: 5.5,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    inclination: 0,
    eccentricity: 0,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "করোনাল ম্যাস ইজেকশন ও সুপার-হট প্লাজমা ঝড়",
      weatherStatusEn: "Coronal Mass Ejections & Ultra-Relativistic Plasma Storms",
      windSpeed: "১,৪৫০,০০০ - ২,৮০০,০০০ km/h (সৌর বায়ু)",
      windSpeedEn: "1,450,000 - 2,800,000 km/h (Solar Wind)",
      avgWindKmh: 1600000,
      windDirection: "কেন্দ্র থেকে বহির্মুখী তেজস্ক্রিয় বিকিরণ (Radial Outflow)",
      windDirectionEn: "Radial Outflow along Magnetic Field Lines",
      surfacePressure: "Photosphere: 0.001 bar / Core: ২৫০ বিলিয়ন bar",
      stormActivity: "সৌরশিখা (Solar Flares) ও প্লাজমা প্রমিনেন্স লুপ",
      stormActivityEn: "Prominence Arches & X-class Solar Flares",
      precipitation: "হাই-এনার্জি প্রোটন ও ইলেকট্রন কণার বৃষ্টি",
      precipitationEn: "High-Energy Relativistic Protons & Electron Stream",
      cloudCoverage: "১০০% ম্যাগনেটিক প্লাজমা গ্র্যানিউলস",
      gases: [
        { name: "হাইড্রোজেন আয়ন (H⁺)", nameEn: "Hydrogen (H)", percent: 73.46, color: "#f59e0b" },
        { name: "হিলিয়াম প্লাজমা (He²⁺)", nameEn: "Helium (He)", percent: 24.85, color: "#fbbf24" },
        { name: "অক্সিজেন প্লাজমা (O)", nameEn: "Oxygen (O)", percent: 0.77, color: "#38bdf8" },
        { name: "ভারী ধাতু ও কার্বন (Fe/C/Ne)", nameEn: "Heavy Metals (Fe/C)", percent: 0.92, color: "#ec4899" }
      ],
      layers: [
        { name: "ফটোস্ফিয়ার (Photosphere)", nameEn: "Photosphere", alt: "0 - 500 km", desc: "দৃশ্যমান পৃষ্ঠভাগ; ৫,৫০০°C উষ্ণতার গ্র্যানিউলেশন সেল", descEn: "Visible surface layer; granulation convection cells" },
        { name: "ক্রোমোস্ফিয়ার (Chromosphere)", nameEn: "Chromosphere", alt: "500 - 2,100 km", desc: "গোলাপি আভার উত্তপ্ত স্তর ও স্পিকিউল গ্যাস স্তম্ভ", descEn: "Spicule jet zone and hydrogen-alpha emission" },
        { name: "ট্রানজিশন অঞ্চল (Transition Zone)", nameEn: "Transition Zone", alt: "2,100 - 10,000 km", desc: "তাপমাত্রা হঠাৎ ২০ হাজার থেকে ১০ লক্ষ ডিগ্রিতে উল্লম্ফন", descEn: "Rapid temperature spike to 1,000,000 K" },
        { name: "করোনা (Solar Corona)", nameEn: "Solar Corona", alt: "10,000 - 5,000,000 km", desc: "কোটি কিলোমিটার বিস্তৃত অতি-উত্তপ্ত প্লাজমা মুকুট", descEn: "Diffuse ultra-hot magnetic plasma halo" }
      ],
      internalStructure: [
        { layer: "নিউক্লিয়ার ফিউশন কোর (Fusion Core)", depth: "0 - 175,000 km", temp: "15,000,000°C" },
        { layer: "রেডিয়েটিভ জোন (Radiative Zone)", depth: "175,000 - 490,000 km", temp: "7,000,000°C" },
        { layer: "ট্যাকোক্লাইন (Tachocline)", depth: "490,000 - 510,000 km", temp: "2,000,000°C" },
        { layer: "কনভেক্টিভ জোন (Convective Zone)", depth: "510,000 - 696,340 km", temp: "2,000,000°C - 5,500°C" }
      ]
    }
  },
  {
    id: "cygnus_beacon",
    name: "সিগনাস বীকন (Cygnus Beacon-9)",
    nameEn: "Cygnus Beacon-9",
    type: "বাইনারি রিলে নোড (Binary Relay Node)",
    spectral: "Artificial / Fusion Relay",
    radiusKm: "3,200 km (Structure)",
    mass: "4.2 × 10¹⁸ kg",
    temp: "2,400 K",
    velocity: "38.6 km/s",
    distanceAu: "0.38 AU",
    period: "74 দিন",
    description: "রেফারেন্স ছবির দ্বিতীয় উজ্জ্বল আলোকবিন্দু। এটি অভ্যন্তরীণ কক্ষপথে শক্তি ও যোগাযোগ সিগন্যাল রিলে করে।",
    descriptionEn: "The prominent secondary luminous node seen in the blueprint, functioning as an orbital energy relay and navigation beacon.",
    color: "#ff7722",
    emissive: true,
    size: 1.4,
    orbitRadius: 10,
    orbitSpeed: 0.024,
    rotationSpeed: 0.015,
    inclination: 0.08,
    eccentricity: 0.06,
    atmosphereData: {
      hasAtmosphere: false,
      weatherStatus: "চৌম্বকীয় প্লাজমা শিল্ড ও যোগাযোগ তরঙ্গের বিকিরণ",
      weatherStatusEn: "Magnetic Shielding & High-Frequency Beam Propagation",
      windSpeed: "০ km/h (কৃত্রিম শূন্যতা)",
      windSpeedEn: "0 km/h (Vacuum Enclosure)",
      avgWindKmh: 0,
      windDirection: "স্থিতিশীল ম্যাগনেটিক টরাস",
      windDirectionEn: "Stationary Magnetic Torus Field",
      surfacePressure: "0.000 bar (কৃত্রিম মহাকাশ প্ল্যাটফর্ম)",
      stormActivity: "শক্তি রিঅ্যাক্টর প্লাজমা ডিসচার্জ",
      stormActivityEn: "Tokamak Fusion Torus Discharges",
      precipitation: "কোনো বৃষ্টি নেই",
      precipitationEn: "None (Vacuum)",
      cloudCoverage: "০%",
      gases: [
        { name: "ডিউটেরিয়াম প্লাজমা (²H)", nameEn: "Deuterium (²H)", percent: 60.0, color: "#38bdf8" },
        { name: "ট্রিটিয়াম জ্বালানি (³H)", nameEn: "Tritium (³H)", percent: 35.0, color: "#f97316" },
        { name: "হিলিয়াম ছাই (⁴He)", nameEn: "Helium Ash", percent: 5.0, color: "#a855f7" }
      ],
      layers: [
        { name: "প্লাজমা শিল্ড (Shield Hull)", alt: "0 - 50 m", desc: "চৌম্বকীয় রেডিয়েশন ফিল্টার", descEn: "Magnetic deflection envelope" }
      ],
      internalStructure: [
        { layer: "টাইটানিয়াম-টংস্টেন সংকর বহিরাবরণ", depth: "0 - 15 m", temp: "300°C" },
        { layer: "সুপারকন্ডাক্টিভ ম্যাগনেট সেল", depth: "15 - 80 m", temp: "-269°C" },
        { layer: "ফিউশন কোর রিঅ্যাক্টর চেম্বার", depth: "80 - 800 m", temp: "100,000,000°C" }
      ]
    }
  },
  {
    id: "vulcanus",
    name: "ভলকানাস (Vulcanus-I)",
    nameEn: "Vulcanus-I",
    type: "লাভা ও ধাতব গ্রহ (Molten Chthonian)",
    spectral: "Silicate / Metallic Core",
    radiusKm: "2,440 km",
    mass: "3.30 × 10²³ kg",
    temp: "427°C (Day) / -173°C (Night)",
    velocity: "47.4 km/s",
    distanceAu: "0.52 AU",
    period: "88 দিন",
    description: "সূর্যের নিকটতম উত্তপ্ত গ্রহ। গলিত লাভার নদী এবং ভারী ধাতব ভূত্বক দ্বারা বেষ্টিত।",
    descriptionEn: "The innermost rocky planet, scorched by solar radiation with active basaltic fissures and high orbital velocity.",
    color: "#b56238",
    size: 1.1,
    orbitRadius: 15,
    orbitSpeed: 0.018,
    rotationSpeed: 0.008,
    inclination: 0.12,
    eccentricity: 0.08,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "উত্তপ্ত ধাতব বাষ্প ও অতি-ক্ষীণ এক্সোস্ফিয়ার ঝড়",
      weatherStatusEn: "Superheated Vaporized Silicate & Solar Sputtering Storms",
      windSpeed: "৭৫ - ১৫০ km/h (সৌর বিকিরণ বায়ুপ্রবাহ)",
      windSpeedEn: "75 - 150 km/h (Radiation Pressure Winds)",
      avgWindKmh: 95,
      windDirection: "দিনভাগ থেকে অন্ধকার রাতের মেরুর দিকে",
      windDirectionEn: "Subsolar Point to Nightside Terminator",
      surfacePressure: "10⁻¹⁴ bar (চরম ক্ষীণ ভ্যাকুয়াম স্তর)",
      stormActivity: "সৌর কণিকা বোমাবর্ষণ ও ভূত্বকের ধাতব বিস্ফোরণ",
      stormActivityEn: "Intense Proton Sputtering & Thermal Micrometeors",
      precipitation: "গলিত সীসা ও জিঙ্কের অনুদ্বায়ী ঘনীভবন",
      precipitationEn: "Vaporized Metallic Condensation",
      cloudCoverage: "০% (মেঘহীন উন্মুক্ত আকাশ)",
      gases: [
        { name: "সোডিয়াম বাষ্প (Na)", nameEn: "Sodium (Na)", percent: 42.0, color: "#fbbf24" },
        { name: "ম্যাগনেসিয়াম গ্যাস (Mg)", nameEn: "Magnesium (Mg)", percent: 29.0, color: "#e2e8f0" },
        { name: "অক্সিজেন আয়ন (O)", nameEn: "Oxygen Ions (O)", percent: 22.0, color: "#38bdf8" },
        { name: "পটাশিয়াম ও হিলিয়াম (K/He)", nameEn: "Potassium/Helium", percent: 7.0, color: "#a855f7" }
      ],
      layers: [
        { name: "সারফেস বাউন্ডারি এক্সোস্ফিয়ার", nameEn: "Surface Boundary Exosphere", alt: "0 - 1,200 km", desc: "পরমাণুগুলো পরস্পরের সাথে ধাক্কা না খেয়ে উন্মুক্ত মহাশূন্যে ঘুরে বেড়ায়", descEn: "Collisionless atomic drift governed by solar photon pressure" }
      ],
      internalStructure: [
        { layer: "গলিত ব্যাসাল্টিক ক্রাস্ট", depth: "0 - 35 km", temp: "420°C" },
        { layer: "সিলিকন-ম্যাগনেসিয়াম ম্যান্টল", depth: "35 - 550 km", temp: "1,200°C" },
        { layer: "বিশালাকার তরল লোহা কোর (৭৫% ব্যাসার্ধ)", depth: "550 - 2,440 km", temp: "2,200°C" }
      ]
    },
    moons: [
      {
        id: "vulcan_pyros",
        name: "পাইরস (Pyros-I)",
        nameEn: "Pyros-I",
        type: "দগ্ধ গ্রহাণু উপগ্রহ (Scorched Asteroid Moon)",
        radiusKm: "420 km",
        distance: 2.2,
        size: 0.28,
        speed: 0.06,
        color: "#8a4f32",
        orbitTilt: 0.15,
        textureType: "rocky",
        description: "ভলকানাসের মহাকর্ষে আটকে পড়া লাভা-গলিত ধূসর গ্রহাণু খণ্ড।",
        descriptionEn: "Captured molten asteroid fragment orbiting close to Vulcanus."
      }
    ]
  },
  {
    id: "terra_nova",
    name: "টেরা নোভা (Terra Nova-III)",
    nameEn: "Terra Nova-III",
    type: "মহাসাগরীয় বাসযোগ্য গ্রহ (Oceanic Terran)",
    spectral: "Nitrogen-Oxygen Biome",
    radiusKm: "6,371 km",
    mass: "5.97 × 10²⁴ kg",
    temp: "15°C (Average: -40°C to +48°C)",
    velocity: "29.8 km/s",
    distanceAu: "1.00 AU",
    period: "365 দিন",
    description: "নীল জলরাশি, মহাদেশীয় ভূমি এবং মেঘের স্তরে আবৃত সমৃদ্ধ বায়ুমণ্ডল বিশিষ্ট প্রধান কেন্দ্র। এর একটি উজ্জ্বল চাঁদ রয়েছে।",
    descriptionEn: "The sapphire jewel of the system with vast oceans, continental landmasses, swirling atmosphere, and an orbiting natural satellite.",
    color: "#2a82d2",
    size: 2.2,
    orbitRadius: 23,
    orbitSpeed: 0.012,
    rotationSpeed: 0.014,
    inclination: 0.035,
    eccentricity: 0.03,
    hasAtmosphereGlow: true,
    atmosphereColor: 0x00b4d8,
    hasClouds: true,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "নাতিশীতোষ্ণ মহাসাগরীয় সাইক্লোন ও আর্দ্র মৌসুমী বর্ষণ",
      weatherStatusEn: "Temperate Maritime Systems, Tropical Cyclones & Monsoon Fronts",
      windSpeed: "১৫ - ৩২০ km/h (জেট স্ট্রিম ও টাইফুন)",
      windSpeedEn: "15 - 320 km/h (Jet Streams & Category 5 Cyclones)",
      avgWindKmh: 42,
      windDirection: "পশ্চিম থেকে পূর্বমুখী করিওলিস জেট স্ট্রিম (Westerlies & Trades)",
      windDirectionEn: "Mid-latitude Westerlies & Equatorial Trade Winds",
      surfacePressure: "1.013 bar (1.00 atm sea level)",
      stormActivity: "ক্রান্তীয় সামুদ্রিক সাইক্লোন ও সুপারসেল বজ্রঝড়",
      stormActivityEn: "Oceanic Cyclones, Supercell Thunderstorms & Polar Blizzards",
      precipitation: "বিশুদ্ধ পানির বৃষ্টি, শিলাবৃষ্টি ও আল্পাইন তুষারপাত",
      precipitationEn: "Liquid H₂O Rainfall, Hail & Mountain Snowfall",
      cloudCoverage: "৬২% (ঘূর্ণায়মান কিউমুলাস ও সাইরাস মেঘমালা)",
      gases: [
        { name: "নাইট্রোজেন (N₂)", nameEn: "Nitrogen (N₂)", percent: 78.08, color: "#38bdf8" },
        { name: "অক্সিজেন (O₂)", nameEn: "Oxygen (O₂)", percent: 20.95, color: "#4ade80" },
        { name: "আর্গন (Ar)", nameEn: "Argon (Ar)", percent: 0.93, color: "#a855f7" },
        { name: "কার্বন ডাই-অক্সাইড (CO₂)", nameEn: "CO₂ & Vapor", percent: 0.04, color: "#f97316" }
      ],
      layers: [
        { name: "ট্রপোস্ফিয়ার (Troposphere)", nameEn: "Troposphere", alt: "0 - 12 km", desc: "সকল মেঘ, বৃষ্টি, ঝড় ও বায়ুপ্রবাহের প্রধান কেন্দ্র", descEn: "Drives 99% of weather dynamics, clouds, and storms" },
        { name: "স্ট্র্যাটোস্ফিয়ার (Stratosphere)", nameEn: "Stratosphere", alt: "12 - 50 km", desc: "ওজোন গ্যাস স্তর যা ইউভি রশ্মি শোষণ করে; শান্ত বিমান চলাচলের স্তর", descEn: "Ozone absorption zone, home to high-speed jet streams" },
        { name: "মেসোস্ফিয়ার (Mesosphere)", nameEn: "Mesosphere", alt: "50 - 85 km", desc: "মহাকাশের উল্কাপিন্ড পুড়ে ছাই হয়ে যাওয়ার শীতল স্তর (-৯০°C)", descEn: "Meteor burn-up zone; coldest planetary layer (-90°C)" },
        { name: "থার্মোস্ফিয়ার ও আয়নোস্ফিয়ার", nameEn: "Thermosphere", alt: "85 - 600 km", desc: "মেরুজ্যোতি (Aurora) ও রেডিও তরঙ্গ প্রতিফলন স্তর", descEn: "Auroral displays and satellite orbital highway" },
        { name: "এক্সোস্ফিয়ার (Exosphere)", nameEn: "Exosphere", alt: "600 - 10,000 km", desc: "মহাকাশের সাথে বায়ুমণ্ডলের উন্মুক্ত প্রান্তিক মিলনস্থল", descEn: "Diffuse hydrogen envelope bleeding into vacuum" }
      ],
      internalStructure: [
        { layer: "মহাসাগর ও সিলিকেট গ্রানাইট ভূত্বক", depth: "0 - 40 km", temp: "15°C - 450°C" },
        { layer: "সান্দ্র অলিভাইন ম্যান্টল (Upper Mantle)", depth: "40 - 670 km", temp: "1,100°C" },
        { layer: "লোয়ার ম্যান্টল ও ব্রিগম্যানাইট", depth: "670 - 2,890 km", temp: "2,400°C" },
        { layer: "গলিত তরল লোহা বহিঃকোর (Outer Core)", depth: "2,890 - 5,150 km", temp: "4,400°C" },
        { layer: "কঠিন স্ফটিকায়িত লোহা-নিকেল অন্তঃকোর", depth: "5,150 - 6,371 km", temp: "5,400°C" }
      ]
    },
    moons: [
      {
        id: "terra_luna",
        name: "লুনা প্রাইমা (Luna Prima)",
        nameEn: "Luna Prima",
        type: "প্রাকৃতিক উপগ্রহ (Natural Satellite)",
        radiusKm: "1,737 km",
        distance: 4.5,
        size: 0.58,
        speed: 0.032,
        color: "#e2e8f0",
        orbitTilt: 0.09,
        textureType: "rocky",
        description: "টেরা নোভার প্রাচীন শিলা ও ক্র্যাটারে আবৃত রূপালী উপগ্রহ।",
        descriptionEn: "Ancient cratered natural satellite maintaining tidal equilibrium."
      }
    ]
  },
  {
    id: "ares_crimson",
    name: "অ্যারিস রূধীর (Ares Crimson-IV)",
    nameEn: "Ares Crimson-IV",
    type: "মরুভূমি গ্রহ (Desert Oxide World)",
    spectral: "Ferrous Carbonate",
    radiusKm: "3,389 km",
    mass: "6.42 × 10²³ kg",
    temp: "-63°C (-140°C to +20°C)",
    velocity: "24.1 km/s",
    distanceAu: "1.52 AU",
    period: "687 দিন",
    description: "মরচে-লাল লৌহ অক্সাইড ধূলিকণা ও গভীর গিরিখাত বিশিষ্ট শুষ্ক গ্রহ। দুই প্রান্তে বরফের মেরু রয়েছে।",
    descriptionEn: "Rusty ochre desert world marked by deep rift valleys, iron-rich sandstorms, and polar dry-ice caps.",
    color: "#df5a2c",
    size: 1.5,
    orbitRadius: 32,
    orbitSpeed: 0.009,
    rotationSpeed: 0.012,
    inclination: 0.05,
    eccentricity: 0.07,
    hasAtmosphereGlow: true,
    atmosphereColor: 0xe07a5f,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "গ্রহজোড়া রক্তিম ধূলিঝড় ও কার্বন ডাই-অক্সাইড তুষারপাত",
      weatherStatusEn: "Global Ferrous Dust Storms, Towering Dust Devils & Dry Ice Frost",
      windSpeed: "৬৫ - ৪০০ km/h (মার্শিয়ান সুপার-গেল)",
      windSpeedEn: "65 - 400 km/h (Martian Supersonic Dust Gails)",
      avgWindKmh: 85,
      windDirection: "গ্রীষ্মের দক্ষিণ গোলার্ধ থেকে উত্তর মেরুর দিকে",
      windDirectionEn: "Subtropical Hadley Cell to Polar Vortex",
      surfacePressure: "0.006 bar (পৃথিবীর মাত্র ০.৬% চাপ)",
      stormActivity: "কিলোমিটার উঁচু ঘূর্ণি টর্নেডো (Dust Devils)",
      stormActivityEn: "Kilometer-tall Dust Devils & Planet-Enveloping Sandstorms",
      precipitation: "শুষ্ক ড্রাই আইস (CO₂) বরফের সূক্ষ্ম স্ফটিক",
      precipitationEn: "Sublimated CO₂ Dry Ice Snow & Micro-Frost",
      cloudCoverage: "২৫% (পাতলা বরফ-ধূলির সাইরাস মেঘ)",
      gases: [
        { name: "কার্বন ডাই-অক্সাইড (CO₂)", nameEn: "Carbon Dioxide", percent: 95.32, color: "#f97316" },
        { name: "নাইট্রোজেন (N₂)", nameEn: "Nitrogen (N₂)", percent: 2.60, color: "#38bdf8" },
        { name: "আর্গন (Ar)", nameEn: "Argon (Ar)", percent: 1.90, color: "#a855f7" },
        { name: "অক্সিজেন ও জলীয় বাষ্প", nameEn: "O₂ / H₂O Trace", percent: 0.18, color: "#4ade80" }
      ],
      layers: [
        { name: "নিম্ন বায়ুমণ্ডল (Lower Atmosphere)", nameEn: "Lower Atmosphere", alt: "0 - 45 km", desc: "ধূলিকণা দ্বারা উত্তপ্ত ও ঘন ধূলিঝড়ের উৎসস্থল", descEn: "Dust heating layer producing massive dust devils" },
        { name: "মধ্য বায়ুমণ্ডল (Middle Atmosphere)", nameEn: "Middle Atmosphere", alt: "45 - 110 km", desc: "ড্রাই আইসের অত্যন্ত পাতলা সাইরাস মেঘ", descEn: "Cold CO₂ cloud condensation deck" },
        { name: "থার্মোস্ফিয়ার ও এক্সোস্ফিয়ার", nameEn: "Upper Atmosphere", alt: "110 - 500 km", desc: "চৌম্বকক্ষেত্রহীন সৌর বায়ুর আঘাতে গ্যাস ক্ষয়", descEn: "Unshielded atmospheric stripping by solar wind" }
      ],
      internalStructure: [
        { layer: "লৌহ অক্সাইড সমৃদ্ধ ব্যাসাল্ট ক্রাস্ট", depth: "0 - 50 km", temp: "-60°C" },
        { layer: "সিলিকেট শক্ত ম্যান্টল", depth: "50 - 1,700 km", temp: "1,200°C" },
        { layer: "আংশিক গলিত লোহা-সালফার কোর", depth: "1,700 - 3,389 km", temp: "1,900°C" }
      ]
    },
    moons: [
      {
        id: "ares_phobos",
        name: "ফোবস (Phobos-V)",
        nameEn: "Phobos-V",
        type: "অভ্যন্তরীণ উপগ্রহ (Inner Moonlet)",
        radiusKm: "11.2 km",
        distance: 2.8,
        size: 0.32,
        speed: 0.052,
        color: "#9c7c68",
        orbitTilt: 0.04,
        textureType: "rocky",
        description: "অ্যারিসের অতি নিকটবর্তী দ্রুতগামী বিষমাকৃতির পাথুরে উপগ্রহ।",
        descriptionEn: "Oblong, heavily cratered inner moon with high orbital frequency."
      },
      {
        id: "ares_deimos",
        name: "ডিমোস (Deimos-V)",
        nameEn: "Deimos-V",
        type: "বহিঃস্থ উপগ্রহ (Outer Moonlet)",
        radiusKm: "6.2 km",
        distance: 4.8,
        size: 0.22,
        speed: 0.028,
        color: "#857367",
        orbitTilt: 0.07,
        textureType: "rocky",
        description: "রেগোলিথ ধূলিকণায় মসৃণ বহিঃস্থ ছোট উপগ্রহ।",
        descriptionEn: "Outer dusty moonlet with thick regolith mantle."
      }
    ]
  },
  {
    id: "zeus_major",
    name: "জিউস মেজর (Zeus Major-V)",
    nameEn: "Zeus Major-V",
    type: "দানবীয় গ্যাস গ্রহ (Jovian Gas Giant)",
    spectral: "Hydrogen-Helium Complex",
    radiusKm: "69,911 km",
    mass: "1.898 × 10²⁷ kg",
    temp: "-110°C (Cloud Deck) / 24,000°C (Core)",
    velocity: "13.1 km/s",
    distanceAu: "2.85 AU",
    period: "11.8 বছর",
    description: "মণ্ডলটির বৃহত্তম গ্যাসীয় দানব। এর ঘূর্ণায়মান বায়ুমণ্ডলীয় স্ট্রাইপ ও দীর্ঘস্থায়ী মহাজাগতিক ঝড় একে অনন্য রূপ দেয়।",
    descriptionEn: "The largest gas giant in the sector, characterized by dynamic atmospheric cloud bands and an ancient anticyclonic vortex storm.",
    color: "#d9a16a",
    size: 4.2,
    orbitRadius: 44,
    orbitSpeed: 0.006,
    rotationSpeed: 0.02,
    inclination: 0.065,
    eccentricity: 0.04,
    hasAtmosphereGlow: true,
    atmosphereColor: 0xf4a261,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "গ্রেট রেড স্পট মেগা-ঘূর্ণিঝড় ও সুপারসনিক বিপরীত জেট স্ট্রিম",
      weatherStatusEn: "The Great Red Spot Anticyclone & Supersonic Opposing Jet Streams",
      windSpeed: "৪৩০ - ৬৮০ km/h (স্ট্রাটোস্ফিয়ারিক কারেন্ট)",
      windSpeedEn: "430 - 680 km/h (Relentless Equatorial Counter-Currents)",
      avgWindKmh: 540,
      windDirection: "পর্যায়ক্রমিক পূর্ব-পশ্চিমমুখী করিওলিস ব্যান্ড (Alternating Belts)",
      windDirectionEn: "Zonal Flow Belts (Light Zones Rising, Dark Belts Sinking)",
      surfacePressure: "2 bar (Cloud Tops) থেকে ২০ লক্ষ bar (অভ্যন্তরে)",
      stormActivity: "হাজার গুণ শক্তিশালী সুপারবোল্ট মেগা-বজ্রপাত",
      stormActivityEn: "Continent-sized Superbolt Lightning & Millennium Storms",
      precipitation: "তরল অ্যামোনিয়া বরফ ও অতি-উচ্চচাপে তরল হিলিয়াম বৃষ্টি",
      precipitationEn: "Ammonia Ice Hail, Liquid Water-Ammonia Droplets & Helium Rain",
      cloudCoverage: "১০০% (ঘন রঙিন হাইড্রোকার্বন ও অ্যামোনিয়া মেঘের স্তর)",
      gases: [
        { name: "আণবিক হাইড্রোজেন (H₂)", nameEn: "Hydrogen (H₂)", percent: 89.80, color: "#f59e0b" },
        { name: "হিলিয়াম গ্যাস (He)", nameEn: "Helium (He)", percent: 10.20, color: "#fbbf24" },
        { name: "মিথেন ও অ্যামোনিয়া (CH₄/NH₃)", nameEn: "Methane/Ammonia", percent: 0.35, color: "#38bdf8" },
        { name: "ফসফরাস ও সালফার ধোঁয়াশা", nameEn: "Phosphorus Tholins", percent: 0.05, color: "#ef4444" }
      ],
      layers: [
        { name: "উচ্চ অ্যামোনিয়া বরফ ডেক", nameEn: "Ammonia Ice Cirrus", alt: "0 - 50 km (0.5 bar)", desc: "সাদা রঙের স্ফটিক বরফের বহিরাবরণ (-১৪০°C)", descEn: "White crystalline ammonia ice clouds at -140°C" },
        { name: "অ্যামোনিয়াম হাইড্রোসালফাইড স্তর", nameEn: "Hydrosulfide Layer", alt: "50 - 120 km (2 bar)", desc: "বাদামি-লালচে বর্ণের প্রধান রঙের ব্যান্ডসমূহ", descEn: "Tawny orange-brown cloud belts enriched with sulfur" },
        { name: "ঘন পানি ও বরফের মেঘমালা", nameEn: "Water Cloud Base", alt: "120 - 200 km (5 bar)", desc: "বিশাল সুপারবোল্ট বজ্রপাত সৃষ্টিকারী উষ্ণ স্তর", descEn: "Violent moist convection zone generating mega-lightning" },
        { name: "ধাতব তরল হাইড্রোজেন সাগর", nameEn: "Supercritical Fluid Mantle", alt: "200 - 20,000 km", desc: "চরম চাপে গ্যাসীয় হাইড্রোজেন তরল ধাতুতে রূপান্তরিত", descEn: "Liquid molecular hydrogen transitioning to metallic ocean" }
      ],
      internalStructure: [
        { layer: "বায়ুমণ্ডলীয় রঙিন ক্লাউড ডেক", depth: "0 - 3,000 km", temp: "-110°C - 2,000°C" },
        { layer: "তরল আণবিক হাইড্রোজেন মহাসাগর", depth: "3,000 - 22,000 km", temp: "5,000°C" },
        { layer: "তরল ধাতব হাইড্রোজেন ম্যান্টল (চৌম্বক ডায়নামো)", depth: "22,000 - 58,000 km", temp: "11,000°C" },
        { layer: "দানবীয় ঘন সিলিকা-লোহা পাথুরে কোর", depth: "58,000 - 69,911 km", temp: "24,000°C" }
      ]
    },
    moons: [
      {
        id: "zeus_io",
        name: "আইও (Io-Volcanica)",
        nameEn: "Io-Volcanica",
        type: "আগ্নেয়গিরি উপগ্রহ (Volcanic Moon)",
        radiusKm: "1,821 km",
        distance: 6.8,
        size: 0.65,
        speed: 0.048,
        color: "#ffcc22",
        orbitTilt: 0.02,
        textureType: "io",
        description: "সৌরজগতের সর্বাধিক সক্রিয় আগ্নেয়গিরি সম্পন্ন সালফার ও লাভাময় উজ্জ্বল হলুদ উপগ্রহ।",
        descriptionEn: "Most volcanically active body with vivid yellow-orange sulfur frost."
      },
      {
        id: "zeus_europa",
        name: "ইউরোপা (Europa-Oceanus)",
        nameEn: "Europa-Oceanus",
        type: "বরফ সাগর উপগ্রহ (Oceanic Ice World)",
        radiusKm: "1,560 km",
        distance: 9.6,
        size: 0.55,
        speed: 0.036,
        color: "#b8e2f2",
        orbitTilt: 0.03,
        textureType: "europa",
        description: "মসৃণ ফাটলযুক্ত বরফের নিচে তরল মহাসাগর সমৃদ্ধ রহস্যময় উপগ্রহ।",
        descriptionEn: "Pristine ice-shell moon concealing a global subsurface liquid water ocean."
      },
      {
        id: "zeus_ganymede",
        name: "গ্যানিমিড (Ganymede-Titan)",
        nameEn: "Ganymede-Titan",
        type: "দানবীয় উপগ্রহ (Giant Silicate Moon)",
        radiusKm: "2,634 km",
        distance: 13.5,
        size: 0.85,
        speed: 0.024,
        color: "#9ca3af",
        orbitTilt: 0.015,
        textureType: "rocky",
        description: "বুধ গ্রহের চেয়েও বড় সৌরজগতের বৃহত্তম উপগ্রহ, যার নিজস্ব চৌম্বকক্ষেত্র রয়েছে।",
        descriptionEn: "Largest moon in the system, even larger than Mercury with grooved terrain."
      },
      {
        id: "zeus_callisto",
        name: "ক্যালিস্টো (Callisto-Ancient)",
        nameEn: "Callisto-Ancient",
        type: "প্রাচীন ক্র্যাটার উপগ্রহ (Ancient Cratered Moon)",
        radiusKm: "2,410 km",
        distance: 17.8,
        size: 0.75,
        speed: 0.016,
        color: "#6b7280",
        orbitTilt: 0.025,
        textureType: "rocky",
        description: "শতকোটি বছরের অসংখ্য উল্কাপাতের দাগযুক্ত চরম প্রাচীন শিলা উপগ্রহ।",
        descriptionEn: "Heavily cratered primordial ice-rock world preserved across billions of years."
      }
    ]
  },
  {
    id: "chronos_magister",
    name: "ক্রোনস মেজিস্টার (Chronos Magister-VI)",
    nameEn: "Chronos Magister-VI",
    type: "বলয়যুক্ত মহাজাগতিক দানব (Ringed Titan Giant)",
    spectral: "Volatile Ammonia-Ice",
    radiusKm: "58,232 km",
    mass: "5.68 × 10²⁶ kg",
    temp: "-140°C (Cloud Tops) / 11,700°C (Core)",
    velocity: "9.7 km/s",
    distanceAu: "4.20 AU",
    period: "29.4 বছর",
    description: "মূল রেফারেন্স ছবির সবচেয়ে আকর্ষণীয় রিংযুক্ত গ্রহ। এর মহিমান্বিত বরফ ও পাথুরে বলয় সিস্টেম এবং সুস্পষ্ট ক্যাবিনী ফাঁক রয়েছে।",
    descriptionEn: "The centerpiece ringed colossus featured prominently in the reference blueprint, flanked by luminous concentric rings and orbital markers.",
    color: "#e8c99b",
    size: 3.8,
    orbitRadius: 58,
    orbitSpeed: 0.0042,
    rotationSpeed: 0.018,
    inclination: 0.09,
    eccentricity: 0.05,
    hasRings: true,
    ringInner: 4.8,
    ringOuter: 10.2,
    ringTilt: 0.46,
    hasAtmosphereGlow: true,
    atmosphereColor: 0xe9c46a,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "উত্তর মেরুর ৩০,০০০ কিমি বিশালাকার ষড়ভুজ ঝড় ও সুপারসনিক জেট উইন্ড",
      weatherStatusEn: "Colossal 30,000 km North Polar Hexagon Vortex & Supersonic Equatorial Roar",
      windSpeed: "১,২০০ - ১,৮০০ km/h (সৌরজগতের দ্বিতীয় দ্রুততম ঝড়)",
      windSpeedEn: "1,200 - 1,800 km/h (Mach 1.5 Supersonic Equatorial Storms)",
      avgWindKmh: 1450,
      windDirection: "নিরক্ষীয় পূর্বমুখী সুপারসনিক প্রবাহ (Prograde Jet Streams)",
      windDirectionEn: "Unbroken Broad Equatorial Eastward Prograde Current",
      surfacePressure: "1.4 bar (Cloud Tops) থেকে ১০ লক্ষ bar (অভ্যন্তর)",
      stormActivity: "মেরু হেক্সাগন সাইক্লোন ও প্রতি ৩০ বছর অন্তর গ্রেট হোয়াইট স্পট",
      stormActivityEn: "Persistent Hexagonal Polar Jet & Decadal Great White Spots",
      precipitation: "তরল মিথেন শিশির ও অভ্যন্তরে হীরা/হিলিয়াম বৃষ্টি",
      precipitationEn: "Liquid Methane/Ethane Drizzle & Internal Helium Smear",
      cloudCoverage: "১০০% (স্বর্ণালী ফ্যাকাশে অ্যামোনিয়া ও কুয়াশা স্ট্রাইপ)",
      gases: [
        { name: "আণবিক হাইড্রোজেন (H₂)", nameEn: "Hydrogen (H₂)", percent: 96.30, color: "#f59e0b" },
        { name: "হিলিয়াম গ্যাস (He)", nameEn: "Helium (He)", percent: 3.25, color: "#fbbf24" },
        { name: "মিথেন গ্যাস (CH₄)", nameEn: "Methane (CH₄)", percent: 0.45, color: "#38bdf8" },
        { name: "অ্যামোনিয়া ও ফসফাইন", nameEn: "Ammonia/Phosphine", percent: 0.01, color: "#ec4899" }
      ],
      layers: [
        { name: "উত্তর মেরুর হেক্সাগন জেট", nameEn: "Polar Hexagon Vortex", alt: "0 - 75 km", desc: "জ্যামিতিক নিখুঁত ষড়ভুজাকৃতির ৩২০ কিমি/ঘণ্টার ঘূর্ণিঝড়", descEn: "Symmetric hexagonal atmospheric standing wave" },
        { name: "উচ্চ অ্যামোনিয়া কুয়াশা স্তর", nameEn: "Upper Photochemical Haze", alt: "75 - 150 km", desc: "সূর্যালোকের প্রভাবে সোনালী হালকা রঙের চাদর", descEn: "Dull golden-butterscotch smog veil" },
        { name: "অ্যামোনিয়াম ডেক ও বরফ ক্লাউড", nameEn: "Ammonium Hydrosulfide Deck", alt: "150 - 250 km", desc: "ঘন ভারী মেঘ ও বরফ বলয়ের দীর্ঘ ছায়া অঞ্চল", descEn: "Dense cloud base influenced by ring shadow cooling" },
        { name: "তরল ধাতব হাইড্রোজেন স্তর", nameEn: "Liquid Metallic Mantle", alt: "250 - 30,000 km", desc: "তীব্র চাপে পরিবাহী ধাতব হাইড্রোজেন সাগরের প্রবাহ", descEn: "High-temperature conducting fluid generating magnetosphere" }
      ],
      internalStructure: [
        { layer: "বহিস্থ রঙিন ক্লাউড ব্যান্ড", depth: "0 - 1,000 km", temp: "-140°C - 300°C" },
        { layer: "তরল আণবিক হাইড্রোজেন আবরণ", depth: "1,000 - 20,000 km", temp: "4,000°C" },
        { layer: "তরল ধাতব হাইড্রোজেন ও হিলিয়াম ড্রপলেট জোন", depth: "20,000 - 45,000 km", temp: "8,500°C" },
        { layer: "ঘন পাথুরে-বরফ কোর (পৃথিবীর ৯-২২ গুণ ভর)", depth: "45,000 - 58,232 km", temp: "11,700°C" }
      ]
    },
    moons: [
      {
        id: "chronos_mimas",
        name: "মিমাস (Mimas-Crater)",
        nameEn: "Mimas-Crater",
        type: "বিশাল ক্র্যাটার উপগ্রহ (Herschel Basin Moon)",
        radiusKm: "198 km",
        distance: 11.2,
        size: 0.38,
        speed: 0.055,
        color: "#cbd5e1",
        orbitTilt: 0.25,
        textureType: "rocky",
        description: "রিংয়ের ঠিক বাইরে অবস্থিত বিশালাকার হার্শেল ক্র্যাটার বিশিষ্ট বরফ উপগ্রহ।",
        descriptionEn: "Inner moon bearing the immense Herschel impact crater."
      },
      {
        id: "chronos_enceladus",
        name: "এনসেলাডাস (Enceladus-Geyser)",
        nameEn: "Enceladus-Geyser",
        type: "ক্রায়ো-গিজার উপগ্রহ (Cryovolcanic Ice Moon)",
        radiusKm: "252 km",
        distance: 13.5,
        size: 0.46,
        speed: 0.042,
        color: "#f8fafc",
        orbitTilt: 0.22,
        textureType: "europa",
        description: "সৌরজগতের সবচেয়ে শুভ্র ও প্রতিফলক বরফ পৃষ্ঠ, যার দক্ষিণ মেরু থেকে বরফের ফোয়ারা নির্গত হয়।",
        descriptionEn: "Dazzling white world with south-polar cryovolcanic geysers feeding Saturn's rings."
      },
      {
        id: "chronos_titan",
        name: "টাইটান (Titan-Gold)",
        nameEn: "Titan-Gold",
        type: "ঘন বায়ুমণ্ডলীয় উপগ্রহ (Atmospheric Mega-Moon)",
        radiusKm: "2,574 km",
        distance: 17.5,
        size: 0.96,
        speed: 0.024,
        color: "#f59e0b",
        orbitTilt: 0.18,
        textureType: "titan",
        description: "ঘন নাইট্রোজেন ও মিথেন গ্যাসের সোনালী কুয়াশাময় বায়ুমণ্ডল এবং তরল মিথেনের হ্রদ বিশিষ্ট মহিমান্বিত উপগ্রহ।",
        descriptionEn: "Magnificent moon cloaked in dense golden smog with liquid hydrocarbon seas.",
        atmosphereData: {
          hasAtmosphere: true,
          weatherStatus: "তরল মিথেন ও ইথেনের বৃষ্টি, হ্রদ এবং সোনালী নাইট্রোজেন কুয়াশা",
          weatherStatusEn: "Liquid Methane Rainstorms, Hydrocarbon Seas & Golden Nitrogen Smog",
          windSpeed: "১২ - ৩৫ km/h (পৃষ্ঠে শান্ত, উচ্চে দ্রুত)",
          windSpeedEn: "12 - 35 km/h (Gentle Surface Breezes, Fast Stratospheric Winds)",
          avgWindKmh: 18,
          windDirection: "নিরক্ষীয় পশ্চিমা বায়ু ও মেরু মেঘ ঘূর্ণি",
          windDirectionEn: "Equatorial Prograde Superrotation",
          surfacePressure: "1.47 bar (পৃথিবীর চেয়ে ৫০% বেশি বায়ুমণ্ডলীয় চাপ!)",
          stormActivity: "মৌসুমী ভারী তরল মিথেন সাইক্লোন",
          stormActivityEn: "Seasonal Polar Hydrocarbon Monsoons",
          precipitation: "তরল মিথেন (CH₄) ও ইথেন ড্রপলেট",
          precipitationEn: "Liquid Methane (CH₄) Rain Filling Kraken Mare",
          cloudCoverage: "৮৫% (ঘন সোনালী থোলিন অ্যারোসল কুয়াশা)",
          gases: [
            { name: "নাইট্রোজেন গ্যাস (N₂)", nameEn: "Nitrogen (N₂)", percent: 94.20, color: "#38bdf8" },
            { name: "মিথেন গ্যাস (CH₄)", nameEn: "Methane (CH₄)", percent: 5.65, color: "#f59e0b" },
            { name: "হাইড্রোজেন ও জটিল থোলিন", nameEn: "Hydrogen/Tholins", percent: 0.15, color: "#ec4899" }
          ],
          layers: [
            { name: "ঘন থোলিন স্মগ ডেক", nameEn: "Orange Tholin Stratosphere", alt: "50 - 300 km", desc: "সূর্যরশ্মি থেকে আসা সোনালী আলোক বিচ্ছুরণ", descEn: "Dense organic smog filtering ultraviolet light" },
            { name: "মিথেন ট্রপোস্ফিয়ার", nameEn: "Methane Weather Stratum", alt: "0 - 50 km", desc: "মিথেন মেঘ ও তরল বর্ষণের অঞ্চল (-১৭৯°C)", descEn: "Cryogenic weather zone with hydrocarbon precipitation" }
          ]
        }
      },
      {
        id: "chronos_rhea",
        name: "রিয়া (Rhea-Silicate)",
        nameEn: "Rhea-Silicate",
        type: "বরফ ও সিলিকেট উপগ্রহ (Ice-Silicate World)",
        radiusKm: "763 km",
        distance: 21.5,
        size: 0.58,
        speed: 0.016,
        color: "#94a3b8",
        orbitTilt: 0.15,
        textureType: "rocky",
        description: "ঘন বরফের ভূত্বক ও সূক্ষ্ম উল্কাপাত রেখাবিশিষ্ট প্রাচীন চাঁদ।",
        descriptionEn: "Heavily cratered dirty-ice moon in distant stable resonance."
      }
    ]
  },
  {
    id: "aether_cyan",
    name: "ইথার সাইয়ান (Aether Cyan-VII)",
    nameEn: "Aether Cyan-VII",
    type: "বরফ দানব (Cyan Ice Giant)",
    spectral: "Methane-Ice Mantle",
    radiusKm: "25,362 km",
    mass: "8.68 × 10²⁵ kg",
    temp: "-195°C (-224°C Coldest recorded)",
    velocity: "6.8 km/s",
    distanceAu: "6.10 AU",
    period: "84 বছর",
    description: "উজ্জ্বল ফিরোজা-নীল মিথেন গ্যাসের শীতল গ্রহ। এর নিজস্ব সূক্ষ্ম উল্লম্ব বলয় ও মায়াবী নীলাভ আভা রয়েছে।",
    descriptionEn: "A pristine aquamarine ice giant draped in high-altitude methane haze with delicate perpendicular ring arcs.",
    color: "#4ad6d8",
    size: 2.8,
    orbitRadius: 72,
    orbitSpeed: 0.0028,
    rotationSpeed: 0.011,
    inclination: 0.14,
    eccentricity: 0.04,
    hasRings: true,
    ringInner: 3.4,
    ringOuter: 4.8,
    ringTilt: 1.52,
    hasAtmosphereGlow: true,
    atmosphereColor: 0x48cae4,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "অতি-শীতল ফিরোজা মিথেন কুয়াশা ও অভ্যন্তরে হীরক বৃষ্টি (Diamond Rain)",
      weatherStatusEn: "Super-chilled Cyan Methane Smog & Deep Mantle Diamond Rain",
      windSpeed: "৫০০ - ৯০০ km/h (বিপরীতগামী তীব্র ঝড়)",
      windSpeedEn: "500 - 900 km/h (Retrograde Equatorial Gales)",
      avgWindKmh: 680,
      windDirection: "অক্ষীয় কাত অনুযায়ী উল্লম্ব করিওলিস ঘূর্ণি (98° Axial Tilt)",
      windDirectionEn: "Extreme Oblique Vortices aligned with 98° Tilt",
      surfacePressure: "1.3 bar (Cloud Deck) থেকে কোটি bar",
      stormActivity: "উজ্জ্বল মিথেন সাইরাস বরফ ঝড় ও আলোক বিচ্ছুরণ",
      stormActivityEn: "Occasional Translucent Convective Cirrus Flares",
      precipitation: "গভীর ম্যান্টলে কঠিন হীরার বর্ষণ ও অ্যামোনিয়া বরফ",
      precipitationEn: "Solid Diamond Precipitation & Methane Hail",
      cloudCoverage: "১০০% (মসৃণ মায়াবী অ্যাকোয়ামেরিন গ্যাসীয় চাদর)",
      gases: [
        { name: "আণবিক হাইড্রোজেন (H₂)", nameEn: "Hydrogen (H₂)", percent: 82.50, color: "#f59e0b" },
        { name: "হিলিয়াম গ্যাস (He)", nameEn: "Helium (He)", percent: 15.20, color: "#fbbf24" },
        { name: "মিথেন গ্যাস (CH₄ - নীল বর্ণ দেয়)", nameEn: "Methane (CH₄)", percent: 2.30, color: "#00f0ff" },
        { name: "হাইড্রোজেন ডিউটেরাইড (HD)", nameEn: "Deuteride Trace", percent: 0.01, color: "#a855f7" }
      ],
      layers: [
        { name: "উচ্চ মিথেন সাইরাস ক্লাউড", nameEn: "Methane Cirrus Haze", alt: "0 - 50 km", desc: "লাল আলো শোষণ করে ফিরোজা রঙ তৈরি করে", descEn: "Red absorption layer yielding pristine cyan hue" },
        { name: "হাইড্রোজেন সালফাইড ও অ্যামোনিয়া ডেক", nameEn: "Hydrogen Sulfide Deck", alt: "50 - 150 km", desc: "অত্যন্ত তীব্র ঝাঁজালো গন্ধযুক্ত দুর্গম মেঘমালা", descEn: "Pungent, highly compressed sulfide ice layer" },
        { name: "সুপারক্রিটিক্যাল আইস ও ডায়মন্ড সাগর", nameEn: "Diamond Mantle Ocean", alt: "150 - 15,000 km", desc: "চরম তাপে সংকুচিত গলিত পানি, মিথেন ও হীরার বৃষ্টি", descEn: "Superdense hot water-ammonia slush with diamond precipitation" }
      ],
      internalStructure: [
        { layer: "বহিস্থ ফিরোজা গ্যাস স্তর", depth: "0 - 5,000 km", temp: "-195°C - 700°C" },
        { layer: "সুপার-আয়নিক পানি ও মিথেন বরফ ম্যান্টল", depth: "5,000 - 20,000 km", temp: "2,000°C - 5,000°C" },
        { layer: "কঠিন সিলিকেট ও লোহা-নিকেল কোর", depth: "20,000 - 25,362 km", temp: "6,800°C" }
      ]
    },
    moons: [
      {
        id: "aether_miranda",
        name: "মিরান্ডা (Miranda-Fractured)",
        nameEn: "Miranda-Fractured",
        type: "টেকটনিক গিরিখাত উপগ্রহ (Tectonic Canyon World)",
        radiusKm: "235 km",
        distance: 5.5,
        size: 0.36,
        speed: 0.044,
        color: "#93c5fd",
        orbitTilt: 0.85,
        textureType: "rocky",
        description: "সৌরজগতের গভীরতম গিরিখাত (Verona Rupes) ও অদ্ভুত জ্যামিতিক শেভরন বিশিষ্ট বিশৃঙ্খল ভূত্বকের চাঁদ।",
        descriptionEn: "Chaotic tectonic terrain harboring the sheerest cliff cliffs in the solar system."
      },
      {
        id: "aether_titania",
        name: "টাইটানিয়া (Titania-Crown)",
        nameEn: "Titania-Crown",
        type: "প্রধান বরফ উপগ্রহ (Primary Ice Moon)",
        radiusKm: "788 km",
        distance: 8.8,
        size: 0.62,
        speed: 0.026,
        color: "#bfdbfe",
        orbitTilt: 0.85,
        textureType: "rocky",
        description: "ইথারের বৃহত্তম উপগ্রহ। বিশাল ফল্ট উপত্যকা এবং টেকটোনিক ফল্টলাইন দ্বারা আবৃত।",
        descriptionEn: "Largest satellite of Aether, scarred by massive extensional fault trenches."
      }
    ]
  },
  {
    id: "hades_outpost",
    name: "হেডিস আউটপোস্ট (Hades Deep-VIII)",
    nameEn: "Hades Deep-VIII",
    type: "দূরবর্তী বামন গ্রহ (Trans-Neptunian Dwarf)",
    spectral: "Nitrogen Ice Crust",
    radiusKm: "1,188 km",
    mass: "1.30 × 10²² kg",
    temp: "-230°C (-240°C to -218°C)",
    velocity: "4.7 km/s",
    distanceAu: "8.40 AU",
    period: "248 বছর",
    description: "নক্ষত্রমণ্ডলের দূরবর্তী সীমানার হিমশীতল অভিভাবক। কাইপার বেল্টের প্রান্তে পরিভ্রমণরত।",
    descriptionEn: "The distant sentinel at the edge of deep space, drifting quietly among the outer cometary debris field.",
    color: "#b0b8c6",
    size: 0.9,
    orbitRadius: 86,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.005,
    inclination: 0.19,
    eccentricity: 0.12,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "নাইট্রোজেন বরফের ধোঁয়াশা ও ঋতুভিত্তিক ক্রায়ো-শৈত্য",
      weatherStatusEn: "Tenuous Nitrogen-Methane Hazes & Seasonal Condensation Freeze",
      windSpeed: "১৫ - ৪৫ km/h (শান্ত কিন্তু অতি-শীতল)",
      windSpeedEn: "15 - 45 km/h (Sublimation-Driven Sub-surface Breezes)",
      avgWindKmh: 24,
      windDirection: "স্পুটনিক প্ল্যানিটিয়া হিমবাহ থেকে মেরুর দিকে",
      windDirectionEn: "Glacial Outflow from Sputnik Planitia Nitrogen Basin",
      surfacePressure: "10⁻⁵ bar (১০ মাইক্রোবার)",
      stormActivity: "ক্রায়ো-ভলকানিক নাইট্রোজেন বাষ্প উদ্গীরণ",
      stormActivityEn: "Cryovolcanic Sublimation Plumes & Nitrogen Geysers",
      precipitation: "নাইট্রোজেন ও মিথেন বরফের সূক্ষ্ম তুষার",
      precipitationEn: "Fine Tholin & Methane Micro-Snow",
      cloudCoverage: "১৫% (নীলাভ আলোক বিচ্ছুরণকারী থোলিন হ্যাজ)",
      gases: [
        { name: "নাইট্রোজেন গ্যাস (N₂)", nameEn: "Nitrogen (N₂)", percent: 98.50, color: "#38bdf8" },
        { name: "মিথেন গ্যাস (CH₄)", nameEn: "Methane (CH₄)", percent: 1.00, color: "#f59e0b" },
        { name: "কার্বন মনোক্সাইড (CO)", nameEn: "Carbon Monoxide", percent: 0.50, color: "#a855f7" }
      ],
      layers: [
        { name: "নীল কুয়াশা স্তর (Blue Haze Rings)", alt: "0 - 200 km", desc: "২০টির বেশি সূক্ষ্ম স্তরে বিভক্ত নীলাভ থোলিন ধোঁয়াশা", descEn: "Stratified layers of complex organic photochemical aerosols" }
      ],
      internalStructure: [
        { layer: "নাইট্রোজেন ও মিথেন বরফের মসৃণ ক্রাস্ট", depth: "0 - 20 km", temp: "-230°C" },
        { layer: "পানি-বরফের শক্ত সাবসারফেস ম্যান্টল", depth: "20 - 250 km", temp: "-120°C" },
        { layer: "ঘন পাথুরে সিলিকেট কোর", depth: "250 - 1,188 km", temp: "450°C" }
      ]
    },
    moons: [
      {
        id: "hades_charon",
        name: "শ্যারন (Charon-Binary)",
        nameEn: "Charon-Binary",
        type: "বাইনারি জোড় উপগ্রহ (Tidally Locked Companion)",
        radiusKm: "606 km",
        distance: 3.4,
        size: 0.44,
        speed: 0.032,
        color: "#78716c",
        orbitTilt: 0.28,
        textureType: "rocky",
        description: "হেডিসের সাথে মিউচুয়ালি টাইডাল-লকড লালচে থোলিন টুপিযুক্ত দানবীয় সহযোগী চাঁদ।",
        descriptionEn: "Mutually locked binary companion capped with reddish hydrocarbon tholins."
      }
    ]
  },
  {
    id: "halcyon_c",
    name: "হ্যালসিয়ন-সি ধূমকেতু (Halcyon-C)",
    nameEn: "Halcyon-C Comet",
    type: "ধূমকেতু (Eccentric Comet)",
    spectral: "Volatile Ice C/2349-H1",
    radiusKm: "12 km",
    mass: "2.2 × 10¹⁴ kg",
    temp: "-220°C (Aphelion) / 120°C (Perihelion)",
    velocity: "18.4 - 84.6 km/s",
    distanceAu: "0.80 - 45.0 AU",
    period: "76.4 বছর",
    description: "অতি-উপবৃত্তাকার কক্ষপথে ঘূর্ণায়মান সুপ্রাচীন বরফ ও মিথেন ধূমকেতু। সূর্যের কাছাকাছি এলে এর দৃষ্টিনন্দন দ্বৈত আয়ন ও ধূলিকণার লেজ প্রস্ফুটিত হয়।",
    descriptionEn: "A pristine hyper-eccentric comet composed of frozen volatiles, displaying a luminous dual ion-dust tail as it sweeps past Solis-IX.",
    color: "#7dfcff",
    size: 0.42,
    orbitRadius: 65,
    orbitSpeed: 0.0035,
    rotationSpeed: 0.02,
    inclination: 0.56,
    eccentricity: 0.76,
    isComet: true,
    perihelion: 20,
    aphelion: 125,
    atmosphereData: {
      hasAtmosphere: true,
      weatherStatus: "সৌর তাপে উদ্বায়ী বরফের বাষ্পীভবন ও আয়নিত পুচ্ছ",
      weatherStatusEn: "Sublimation Geysers & Dual Ion-Dust Cometary Jet Streams",
      windSpeed: "১২০ - ৫৫০ km/h (আউটগ্যাসিং জেট)",
      windSpeedEn: "120 - 550 km/h (Outgassing Volatiles)",
      avgWindKmh: 310,
      windDirection: "সৌর বিকিরণ চাপের বিপরীতে বহির্মুখী পুচ্ছ",
      windDirectionEn: "Anti-Solar Ion Stream Driven by Solar Wind",
      surfacePressure: "10⁻⁸ bar (ভ্যাকুয়াম সদৃশ)",
      stormActivity: "উদ্বায়ী মিথেন ও সায়ানাইড বাষ্পের ক্রায়ো-জেট",
      stormActivityEn: "Subsurface Volatile Explosions & Micro-meteor Dust",
      precipitation: "সৌর বিকিরণে অবমুক্ত বরফকুচি ও সিলিকেট কণা",
      precipitationEn: "Silicate Dust Grains & Ionized Hydrocarbon Ice",
      cloudCoverage: "কোমা ক্লাউড (Coma): ৫০,০০০ কিমি ব্যাস",
      gases: [
        { name: "জলীয় বাষ্প (H₂O)", nameEn: "Water Vapor", percent: 80.0, color: "#38bdf8" },
        { name: "কার্বন ডাইঅক্সাইড (CO₂)", nameEn: "Carbon Dioxide", percent: 10.0, color: "#a855f7" },
        { name: "কার্বন মনোক্সাইড (CO)", nameEn: "Carbon Monoxide", percent: 6.0, color: "#f59e0b" },
        { name: "জৈব মিথেন ও সায়ানাইড (CH₄/CN)", nameEn: "Organics & Cyanogen", percent: 4.0, color: "#ec4899" }
      ],
      layers: [
        { name: "নিউক্লিয়াস ক্রাস্ট (Icy Nucleus)", alt: "0 - 12 km", desc: "ছিদ্রযুক্ত অন্ধকার জৈব পদার্থের স্তর", descEn: "Dark porous silicate-organic crust" },
        { name: "অভ্যন্তরীণ কোমা (Inner Coma)", alt: "12 - 5,000 km", desc: "ঘন গ্যাসীয় বাষ্পীভবন মণ্ডল", descEn: "Dense sublimation cloud surrounding nucleus" },
        { name: "দ্বৈত পুচ্ছ মণ্ডল (Ion & Dust Tails)", alt: "5,000 - 10,000,000 km", desc: "লক্ষ লক্ষ কিলোমিটার দীর্ঘ আলোকোজ্জ্বল লেজ", descEn: "Dual magnetic ion and curved dust trails extending into deep space" }
      ],
      internalStructure: [
        { layer: "ধূলিযুক্ত কার্বন ও বরফের ফ্র্যাজাইল ক্রাস্ট", depth: "0 - 1 km", temp: "-80°C" },
        { layer: "অ্যামোর্ফাস পানি-বরফ ও শুষ্ক বরফের ম্যাট্রিক্স", depth: "1 - 12 km", temp: "-220°C" }
      ]
    },
    moons: []
  }
];

/**
 * 12 FICTIONAL SCI-FI CONSTELLATIONS ASTRONOMICAL CATALOG
 * Mapped across celestial sphere radius 780
 */
const CONSTELLATIONS_DATA = [
  {
    id: "cygnus_major",
    name: "সিগনাস মেজর (হাঁস)",
    nameEn: "Cygnus Major",
    stars: [
      { ra: 0.2, dec: 0.45, mag: 1.2, name: "Deneb-IX" },
      { ra: 0.28, dec: 0.38, mag: 2.1, name: "Sadr-Beta" },
      { ra: 0.35, dec: 0.32, mag: 1.8, name: "Gienah-Sol" },
      { ra: 0.18, dec: 0.34, mag: 2.3, name: "Rukh" },
      { ra: 0.39, dec: 0.25, mag: 2.5, name: "Albireo-V" }
    ],
    lines: [[0, 1], [1, 2], [1, 3], [1, 4]]
  },
  {
    id: "orion_nexus",
    name: "অরিয়ন নেক্সাস (শিকারী)",
    nameEn: "Orion Nexus",
    stars: [
      { ra: 1.4, dec: 0.15, mag: 1.1, name: "Betel-Nexus" },
      { ra: 1.35, dec: -0.15, mag: 1.0, name: "Rigel-Prime" },
      { ra: 1.5, dec: 0.12, mag: 2.0, name: "Bellatrix-9" },
      { ra: 1.48, dec: -0.16, mag: 2.2, name: "Saiph-IV" },
      { ra: 1.42, dec: -0.02, mag: 2.4, name: "Alnitak" },
      { ra: 1.44, dec: -0.01, mag: 2.3, name: "Alnilam" },
      { ra: 1.46, dec: 0.00, mag: 2.4, name: "Mintaka" }
    ],
    lines: [[0, 2], [2, 6], [6, 5], [5, 4], [4, 1], [0, 4], [1, 3]]
  },
  {
    id: "vela_prime",
    name: "ভেলা প্রাইম (পালতোলা তরী)",
    nameEn: "Vela Prime",
    stars: [
      { ra: 2.2, dec: -0.55, mag: 1.4, name: "Suhail-A" },
      { ra: 2.35, dec: -0.48, mag: 2.1, name: "Kala" },
      { ra: 2.45, dec: -0.62, mag: 1.9, name: "Regor" },
      { ra: 2.15, dec: -0.68, mag: 2.4, name: "Markeb" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]
  },
  {
    id: "aegis_shield",
    name: "ইজিস শিল্ড (সুরক্ষা ঢাল)",
    nameEn: "Aegis Shield",
    stars: [
      { ra: 3.1, dec: 0.28, mag: 1.5, name: "Apex-Shield" },
      { ra: 3.25, dec: 0.35, mag: 2.2, name: "Crest-A" },
      { ra: 3.35, dec: 0.22, mag: 2.0, name: "Base-Right" },
      { ra: 3.22, dec: 0.12, mag: 1.8, name: "Bottom-Rim" },
      { ra: 3.02, dec: 0.18, mag: 2.3, name: "Base-Left" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 3]]
  },
  {
    id: "phoenix_corridor",
    name: "ফিনিক্স করিডোর (অগ্নিপাখি)",
    nameEn: "Phoenix Corridor",
    stars: [
      { ra: 4.1, dec: -0.42, mag: 1.3, name: "Ankaa" },
      { ra: 4.25, dec: -0.32, mag: 2.0, name: "Wurren" },
      { ra: 4.38, dec: -0.46, mag: 2.3, name: "Boral" },
      { ra: 3.95, dec: -0.50, mag: 2.2, name: "Zenith-Wing" }
    ],
    lines: [[0, 1], [0, 2], [0, 3], [1, 2]]
  },
  {
    id: "centaurus_gate",
    name: "সেন্টরাস গেটওয়ে",
    nameEn: "Centaurus Gateway",
    stars: [
      { ra: 5.0, dec: -0.38, mag: 1.0, name: "Rigil-Kent" },
      { ra: 5.15, dec: -0.42, mag: 1.5, name: "Hadar" },
      { ra: 5.25, dec: -0.25, mag: 2.1, name: "Menkent" },
      { ra: 4.90, dec: -0.22, mag: 2.4, name: "Muhlifain" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    id: "draco_spiral",
    name: "ড্রাকো স্পাইরাল (ড্রাগন)",
    nameEn: "Draco Spiral",
    stars: [
      { ra: -0.5, dec: 0.65, mag: 1.6, name: "Thuban-IX" },
      { ra: -0.3, dec: 0.72, mag: 2.0, name: "Rastaban" },
      { ra: -0.1, dec: 0.68, mag: 1.8, name: "Eltanin" },
      { ra: -0.2, dec: 0.58, mag: 2.3, name: "Grumium" },
      { ra: -0.4, dec: 0.52, mag: 2.5, name: "Nod-Dragon" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
  },
  {
    id: "aquila_nav",
    name: "অ্যাকুইলা নেভিগেটর (ঈগল)",
    nameEn: "Aquila Navigator",
    stars: [
      { ra: -1.2, dec: 0.12, mag: 1.0, name: "Altair-Nav" },
      { ra: -1.15, dec: 0.18, mag: 2.3, name: "Tarazed" },
      { ra: -1.25, dec: 0.05, mag: 2.2, name: "Alshain" },
      { ra: -1.35, dec: -0.05, mag: 2.5, name: "Deneb-Okab" }
    ],
    lines: [[1, 0], [0, 2], [2, 3]]
  },
  {
    id: "hydra_void",
    name: "হাইড্রা ভয়েড",
    nameEn: "Hydra Void",
    stars: [
      { ra: -2.0, dec: -0.15, mag: 1.5, name: "Alphard-Sol" },
      { ra: -1.8, dec: -0.08, mag: 2.2, name: "Minchir" },
      { ra: -2.2, dec: -0.22, mag: 2.4, name: "Ashlesha" },
      { ra: -2.4, dec: -0.30, mag: 2.1, name: "Ukdah" }
    ],
    lines: [[1, 0], [0, 2], [2, 3]]
  },
  {
    id: "lyra_resonator",
    name: "লাইরা রেজোনেটর",
    nameEn: "Lyra Resonator",
    stars: [
      { ra: -2.8, dec: 0.42, mag: 0.8, name: "Vega-Prime" },
      { ra: -2.72, dec: 0.36, mag: 2.4, name: "Sheliak" },
      { ra: -2.76, dec: 0.32, mag: 2.3, name: "Sulafat" },
      { ra: -2.88, dec: 0.38, mag: 2.6, name: "Epsilon-Lyr" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]
  },
  {
    id: "corvus_beacon",
    name: "করভাস বীকন (কাক)",
    nameEn: "Corvus Beacon",
    stars: [
      { ra: -3.4, dec: -0.28, mag: 1.8, name: "Gienah-Corv" },
      { ra: -3.55, dec: -0.35, mag: 2.1, name: "Kraz" },
      { ra: -3.65, dec: -0.24, mag: 2.0, name: "Algorab" },
      { ra: -3.48, dec: -0.18, mag: 2.5, name: "Minkar" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    id: "pegasus_matrix",
    name: "পেগাসাস মেট্রিক্স",
    nameEn: "Pegasus Matrix",
    stars: [
      { ra: -4.2, dec: 0.25, mag: 1.4, name: "Markab" },
      { ra: -4.0, dec: 0.28, mag: 1.7, name: "Scheat" },
      { ra: -3.95, dec: 0.12, mag: 1.8, name: "Alpheratz" },
      { ra: -4.18, dec: 0.08, mag: 2.2, name: "Algenib" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  }
];

/**
 * COMPREHENSIVE BILINGUAL UI DICTIONARY
 */
const STRINGS = {
  en: {
    title: 'SOLIS-IX · CELESTIAL BLUEPRINT',
    subtitle: 'SYS.ID: SOLIS-IX // 3D ORBITAL MECHANICS SIMULATION // E-328',
    audio: 'Audio',
    tour: 'Tour',
    info: 'Info',
    capture: 'Capture',
    thermal: 'Thermal',
    search: 'Search (⌘K)',
    scale: 'Scale',
    reset: 'Reset',
    pause: 'Pause',
    play: 'Play',
    speed: 'Speed',
    mode: 'Mode',
    modeFree: 'Free',
    modeOrbit: 'Orbit-Lock',
    modeOrrery: 'Orrery',
    modeFly: 'Fly-by',
    orbits: 'Orbits',
    hud: 'Labels',
    grid: 'Grid',
    trails: 'Trails',
    events: 'Events',
    constellations: 'Constellations',
    nebula: 'Nebula',
    cardClose: 'Close',
    exportJson: 'Export JSON',
    scaleCompare: 'Scale Compare',
    radius: 'Radius',
    distance: 'Distance',
    period: 'Orbital Period',
    velocity: 'Velocity',
    temp: 'Temp',
    spectral: 'Spectral Class',
    moons: 'Moons / Satellites',
    searchPlaceholder: 'Search bodies (e.g. Zeus, Luna, Halcyon, Solis)...',
    solarFlareAlert: '⚡ SOLAR FLARE DETECTED — MAGNITUDE X2.4 // RADIAL PROTON WAVE',
    scaleTitle: 'CELESTIAL SCALE SILHOUETTE COMPARISON',
    scaleSubtitle: 'True-to-Scale Silhouettes normalized vs Earth Reference (40px base)',
    timeline: 'Timeline',
    playEpochs: '▶ Play Epochs',
    pauseEpochs: '⏸ Pause Epochs'
  },
  bn: {
    title: 'সোলিস-৯ · সেলেস্টিয়াল ব্লুপ্রিন্ট',
    subtitle: 'SYS.ID: SOLIS-IX // ৩ডি কক্ষপথ মেকানিক্স সিমুলেশন // E-328',
    audio: 'সাউন্ড',
    tour: 'ট্যুর',
    info: 'তথ্য',
    capture: 'ক্যাপচার',
    thermal: 'থার্মাল',
    search: 'খুঁজুন (⌘K)',
    scale: 'স্কেল',
    reset: 'রিসেট',
    pause: 'বিরতি',
    play: 'প্লে',
    speed: 'গতি',
    mode: 'মোড',
    modeFree: 'ফ্রি ভিউ',
    modeOrbit: 'অরবিট-লক',
    modeOrrery: 'টপ-ডাউন অরেই',
    modeFly: 'ফ্লাই-বাই',
    orbits: 'কক্ষপথ',
    hud: 'লেবেল',
    grid: 'গ্রিড',
    trails: 'ট্রেইল',
    events: 'ঘটনা',
    constellations: 'নক্ষত্রমণ্ডল',
    nebula: 'নেবুলা',
    cardClose: 'বন্ধ করুন',
    exportJson: 'JSON এক্সপোর্ট',
    scaleCompare: 'আকার তুলনা',
    radius: 'ব্যাস (Radius)',
    distance: 'দূরত্ব (Distance)',
    period: 'আবর্তন কাল (Period)',
    velocity: 'কক্ষপথ গতি (Velocity)',
    temp: 'তাপমাত্রা (Temp)',
    spectral: 'স্পেকট্রাল ক্লাস (Spectral)',
    moons: 'উপগ্রহ মণ্ডল (Moons)',
    searchPlaceholder: 'গ্রহ, চাঁদ বা ধূমকেতু খুঁজুন (যেমন: Zeus, Luna, Halcyon)...',
    solarFlareAlert: '⚡ তীব্র সৌরশিখা সনাক্ত — মাত্রা X2.4 // উচ্চগতির প্রোটন তরঙ্গ বিচ্ছুরিত',
    scaleTitle: 'মহাজাগতিক ব্যাস ও আকৃতির আপেক্ষিক তুলনা',
    scaleSubtitle: 'পৃথিবীর মাপকে আদর্শ (৪০ পিক্সেল) ধরে সঠিক জ্যামিতিক স্কেলিং',
    timeline: 'টাইমলাইন',
    playEpochs: '▶ যুগ ভ্রমণ',
    pauseEpochs: '⏸ থামুন'
  }
};

/**
 * 6 DEEP COSMIC TIMELINE EPOCHS (PAST, PRESENT, DEEP FUTURE)
 * Defines historical transformations, planetary evolutions, solar states, and lore.
 */
const TIMELINE_EPOCHS = [
  {
    id: "primordial",
    timeLabel: "T -4.5 Gyr",
    yearNumber: -4500000000,
    name: "আদিম প্রোটো-স্টেলার সৃষ্টি যুগ (Primordial Accretion)",
    nameEn: "Primordial Accretion Era",
    badge: "T -4.5 BILLION YEARS // PRIMORDIAL COLLAPSE",
    cosmicAge: "৪.৫ বিলিয়ন বছর আগে (4.5 Billion Years Ago)",
    summary: "সৌরজগতের জন্মলগ্নে সৌরনীহারিকা ঘনীভূত হয়ে প্রোটো-সূর্যের সৃষ্টি হয়েছে। নবজাত গ্রহগুলো প্রচণ্ড মহাজাগতিক সংঘর্ষ ও লাভা সমুদ্রে নিমজ্জিত। টেরা নোভা এবং এরেসে তরল পানি নেই—কেবল তপ্ত ব্যাসাল্ট শিলা ও বিষাক্ত গ্যাসীয় মেঘ।",
    summaryEn: "The dawn of Solis-IX as the protoplanetary nebula collapses into a violent proto-star. Newly formed planets endure extreme bombardment, glowing with global magma oceans under toxic silicate clouds.",
    sunState: {
      scale: 1.35,
      color: "#ff5500",
      coronaColor: "#ff3300",
      lightColor: 0xff6622,
      lightIntensity: 4.5,
      flareMultiplier: 3.0
    },
    planetChanges: [
      { id: "terra_nova", state: "molten", descBn: "লাভা সমুদ্র ও ফুটন্ত শিলা", descEn: "Global magma ocean, zero liquid water" },
      { id: "ares_crimson", state: "molten", descBn: "তপ্ত ব্যাসাল্ট ও উল্কা খাদ", descEn: "Violent basalt bombardment" },
      { id: "chronos_magister", state: "dense_dust", descBn: "অতি-ঘন ধ্বংসাবশেষের ঘূর্ণায়মান রিং", descEn: "Chaotic primordial debris disc" }
    ]
  },
  {
    id: "ancient",
    timeLabel: "T -500 Myr",
    yearNumber: -500000000,
    name: "প্রাচীন জলমগ্ন ও প্রথম প্রাণ যুগ (Ancient Hydrosphere)",
    nameEn: "Ancient Hydrosphere Era",
    badge: "T -500 MILLION YEARS // ANCIENT RIVERS & OCEANS",
    cosmicAge: "৫০ কোটি বছর আগে (500 Million Years Ago)",
    summary: "সৌরজগতে প্রশান্তি ফিরে এসেছে। প্রাচীন এরেস (মঙ্গল) গ্রহে তখন ছিল গভীর নীল সাগর, নদী উপত্যকা ও ঘন জলীয় মেঘ! টেরা নোভায় আদিম মহাসাগরে প্রথম এককোষী প্রাণের বিকাশ শুরু হয়েছে। ক্রোনসের বলয় সদ্য জন্ম নেওয়া বরফের মতো স্ফটিক দ্যুতি ছড়াচ্ছে।",
    summaryEn: "Golden ancient era. Ancient Ares possessed rolling blue oceans, river valleys, and a thick nitrogen atmosphere. Terra Nova harbors primordial microbial ocean life, and Chronos's rings shine like pristine mirror ice.",
    sunState: {
      scale: 1.0,
      color: "#ffaa33",
      coronaColor: "#ff9900",
      lightColor: 0xffeedd,
      lightIntensity: 3.5,
      flareMultiplier: 1.0
    },
    planetChanges: [
      { id: "terra_nova", state: "ancient_ocean", descBn: "৮৫% গভীর নীল মহাসাগর ও আদিম শৈবাল", descEn: "Deep global blue ocean, single-cell life" },
      { id: "ares_crimson", state: "oceanic_mars", descBn: "বহমান নীল নদী ও মহাসাগরীয় অববাহিকা", descEn: "Blue Mars: liquid lakes and active clouds" },
      { id: "chronos_magister", state: "pristine_rings", descBn: "স্ফটিকের মতো অতি-উজ্জ্বল রিং", descEn: "Newly formed razor-sharp ice rings" }
    ]
  },
  {
    id: "current",
    timeLabel: "CE 2349",
    yearNumber: 2349,
    name: "বর্তমান আধুনিক মহাকাশ যুগ (Current Astrometric Era)",
    nameEn: "Current Astrometric Era",
    badge: "CE 2349 // PRESENT HUMAN EPOCH",
    cosmicAge: "বর্তমান কাল (Present Human Epoch)",
    summary: "আমাদের বর্তমান আধুনিক সভ্যতা। সিগনাস বীকন-৯ আন্তঃনক্ষত্র নেভিগেশন স্টেশন সক্রিয়, টেরা নোভা মহাসাগরীয় বাসযোগ্য বিশ্ব, এবং সৌরজগতের গভীর মহাকাশ কাইপার বেল্ট পর্যন্ত ছড়িয়ে পড়েছে গবেষণা ও টেলিমেট্রি নজরদারি।",
    summaryEn: "The present human exploration era. Solis-IX is balanced; Cygnus Beacon-9 serves as an interstellar waypoint, Terra Nova thrives as a technological cradle, and mining outposts dot the gas giant moons.",
    sunState: {
      scale: 1.0,
      color: "#ffaa33",
      coronaColor: "#ffaa33",
      lightColor: 0xfff5e6,
      lightIntensity: 3.6,
      flareMultiplier: 1.0
    },
    planetChanges: [
      { id: "terra_nova", state: "current", descBn: "আধুনিক মহাসাগরীয় মহাজাগতিক বিশ্ব", descEn: "Oceanic cradle of civilization" },
      { id: "ares_crimson", state: "current", descBn: "শুষ্ক লাল মরুভূমি ও গ্র্যান্ড ক্যানিয়ন", descEn: "Ferric red deserts and deep canyons" },
      { id: "chronos_magister", state: "current", descBn: "ক্লাসিক্যাল বলয় ও গ্যাসীয় মেঘমালা", descEn: "Banded gas storm giant with rings" }
    ]
  },
  {
    id: "terraformed",
    timeLabel: "CE +10,000 yr",
    yearNumber: 12349,
    name: "উন্নত টেরাফর্মিং ও মেগাস্ট্রাকচার যুগ (Cybernetic Expansion)",
    nameEn: "Cybernetic Terraforming Era",
    badge: "CE +10,000 YEARS // TERRAFORMED SOLAR HORIZON",
    cosmicAge: "১০,০০০ বছর পরে (10,000 Years in the Future)",
    summary: "মানবজাতির টাইপ-২ সভ্যতায় রূপান্তর। এরেস গ্রহের জলবায়ু প্রকৌশল সম্পন্ন হয়েছে—সবুজ অরণ্য, কৃত্রিম লেক ও শ্বাসযোগ্য বায়ুমণ্ডল গড়ে উঠেছে। সূর্যের চারপাশে তৈরি হয়েছে আংশিক ডাইসন সোয়ার্ম এনার্জি রিং এবং সিগনাস বীকনে আলোকোজ্জ্বল মহাকাশ শহর।",
    summaryEn: "Post-planetary expansion. Ares Crimson is fully terraformed with lush boreal forests and artificial seas. A partial Dyson energy swarm orbits Solis, while Cygnus Beacon expands into a massive orbital city.",
    sunState: {
      scale: 1.0,
      color: "#ffbb44",
      coronaColor: "#00f0ff",
      lightColor: 0xfffaea,
      lightIntensity: 3.8,
      flareMultiplier: 0.6
    },
    planetChanges: [
      { id: "terra_nova", state: "megacity", descBn: "অরবিটাল এলিভেটর ও মেগাসিটি গ্রিড", descEn: "Orbital rings, hyper-connected ecumenopolis" },
      { id: "ares_crimson", state: "terraformed_green", descBn: "টেরাফর্মড সবুজ অরণ্য ও নীল সাগর", descEn: "Terraformed: green biomes and fresh seas" },
      { id: "cygnus_beacon", state: "megastructure", descBn: "উন্নত অরবিটাল হাব ও ডাইসন নোড", descEn: "Holographic mega-station and Dyson node" }
    ]
  },
  {
    id: "red_giant",
    timeLabel: "T +3.0 Gyr",
    yearNumber: 3000000000,
    name: "সৌর লোহিত দানব ও বরফ চাঁদ জাগরণ (Solar Red Giant Era)",
    nameEn: "Stellar Red Giant & Ice Thaw Era",
    badge: "T +3.0 BILLION YEARS // RED GIANT EXPANSION",
    cosmicAge: "৩০০ কোটি বছর পরে (3.0 Billion Years in the Future)",
    summary: "সোলিস-৯ তার হাইড্রোজেন শেষ করে বিশাল লোহিত দানব নক্ষত্রে ফুলে উঠেছে! এর তীব্র তাপে ভলকানাস ভস্মীভূত এবং টেরা নোভার সমস্ত মহাসাগর বাষ্পীভূত হয়ে শুকিয়ে পাথুরে মরুভূমিতে রূপ নিয়েছে। আশ্চর্যজনকভাবে, জিউসের বরফ চাঁদ ইউরোপা এবং ক্রোনসের টাইটান বরফ গলে নতুন উষ্ণ গ্রীষ্মমণ্ডলীয় সাগরে পরিণত হয়েছে!",
    summaryEn: "Solis exhausts core hydrogen and swells into an enormous Red Giant star. Mercury-Vulcanus is incinerated; Terra Nova's oceans boil away into space. Yet Jupiter-Zeus's Europa and Saturn's Titan thaw into warm, thriving tropical ocean worlds!",
    sunState: {
      scale: 2.3,
      color: "#ff2200",
      coronaColor: "#ff1100",
      lightColor: 0xff4422,
      lightIntensity: 5.2,
      flareMultiplier: 2.2
    },
    planetChanges: [
      { id: "terra_nova", state: "scorched_dry", descBn: "বাষ্পীভূত শুকনো সমুদ্রতল ও উত্তপ্ত মরুভূমি", descEn: "Oceans boiled away; scorched arid wasteland" },
      { id: "ares_crimson", state: "baked", descBn: "চরম উত্তপ্ত শিলাভূমি ও পাতলা ধোঁয়াশা", descEn: "Sun-baked crust stripped of atmosphere" },
      { id: "zeus_europa", state: "tropical_ocean", descBn: "বরফ গলে সৃষ্টি হওয়া উষ্ণ গ্রীষ্মমণ্ডলীয় সাগর", descEn: "Europa thawed: tropical planetary ocean world" }
    ]
  },
  {
    id: "white_dwarf",
    timeLabel: "T +6.0 Gyr",
    yearNumber: 6000000000,
    name: "শ্বেত বামন ও মহাজাগতিক গোধূলি (Cosmic Twilight & White Dwarf)",
    nameEn: "White Dwarf & Cosmic Twilight",
    badge: "T +6.0 BILLION YEARS // WHITE DWARF & NEBULA",
    cosmicAge: "৬০০ কোটি বছর পরে (6.0 Billion Years in the Future)",
    summary: "সোলিস-৯ তার গ্যাসীয় খোলস মহাকাশে উড়িয়ে দিয়ে একটি নীলাভ-সাদা ক্ষুদ্র ও অতি-ঘন শ্বেত বামন নক্ষত্রে সংকুচিত হয়েছে। পুরো সিস্টেমে বিস্তৃত হয়েছে একটি মনোমুগ্ধকর প্ল্যানেটারি নেবুলা বলয়। সমস্ত বহিঃস্থ গ্রহ চরম শৈত্যে বরফে জমে শান্ত মহাজাগতিক সমাধিতে রূপ নিয়েছে।",
    summaryEn: "The final cosmic chapter. Solis sheds its outer envelopes, forming an iridescent planetary nebula, leaving behind a cold, ultra-dense White Dwarf. Endless cosmic freeze blankets the silent frozen planets under perpetual starlight.",
    sunState: {
      scale: 0.38,
      color: "#e0f2fe",
      coronaColor: "#38bdf8",
      lightColor: 0x93c5fd,
      lightIntensity: 2.4,
      flareMultiplier: 0.2
    },
    planetChanges: [
      { id: "terra_nova", state: "frozen_grave", descBn: "হিমায়িত মিথেন বরফ ও নিথর আঁধার", descEn: "Frozen atmospheric frost and utter silence" },
      { id: "ares_crimson", state: "deep_freeze", descBn: "চরম শীতল জমাটবাঁধা তুষারভূমি", descEn: "Deep cosmic freeze; glacial methane dunes" },
      { id: "chronos_magister", state: "dissipated_rings", descBn: "বলয় ক্ষয়ে যাওয়া শান্ত বরফ দানব", descEn: "Dissipated faint rings under faint starlight" }
    ]
  }
];
