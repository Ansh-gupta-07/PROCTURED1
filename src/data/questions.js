/**
 * HOPE OS — Sample Examination Questions
 * NEET Mock Test (Physics, Chemistry, Biology)
 */
const QUESTIONS = [
  {
    id: 1,
    text: "Which of the following tissues is primarily responsible for the transport of water and dissolved minerals from the roots to the rest of the plant?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Botany",
    difficulty: "easy",
    options: [
      "Phloem",
      "Xylem",
      "Stomata",
      "Root hairs"
    ]
  },
  {
    id: 2,
    text: "According to Newton's second law of motion, the net force acting on an object is directly proportional to its:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Mechanics",
    difficulty: "easy",
    options: [
      "Mass and velocity",
      "Mass and acceleration",
      "Volume and density",
      "Work and time"
    ]
  },
  {
    id: 3,
    text: "What is the correct IUPAC name for the organic compound CH3-CH2-OH?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Organic",
    difficulty: "easy",
    options: [
      "Methanol",
      "Ethanol",
      "Propanol",
      "Butanol"
    ]
  },
  {
    id: 4,
    text: "Which of the following cell organelles is commonly referred to as the 'powerhouse of the cell' due to its role in ATP production?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Zoology",
    difficulty: "easy",
    options: [
      "Nucleus",
      "Mitochondria",
      "Ribosome",
      "Endoplasmic Reticulum"
    ]
  },
  {
    id: 5,
    text: "The phenomenon where a ray of light bends as it passes from one transparent medium into another with a different refractive index is known as:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Optics",
    difficulty: "medium",
    options: [
      "Reflection",
      "Refraction",
      "Dispersion",
      "Diffraction"
    ]
  },
  {
    id: 6,
    text: "Which of the following elements is classified as a noble gas in the periodic table?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Inorganic",
    difficulty: "easy",
    options: [
      "Oxygen (O)",
      "Nitrogen (N)",
      "Helium (He)",
      "Hydrogen (H)"
    ]
  },
  {
    id: 7,
    text: "In the human digestive system, the chemical process of digestion actually begins in the:",
    marks: 4,
    type: "mcq",
    topic: "Biology - Human Physiology",
    difficulty: "medium",
    options: [
      "Stomach",
      "Small Intestine",
      "Large Intestine",
      "Mouth (Oral Cavity)"
    ]
  },
  {
    id: 8,
    text: "If a wire has a resistance of 10 Ohms and a voltage of 5 Volts is applied across it, what is the current flowing through the wire according to Ohm's Law?",
    marks: 4,
    type: "mcq",
    topic: "Physics - Electricity",
    difficulty: "medium",
    options: [
      "2 Amperes",
      "0.5 Amperes",
      "50 Amperes",
      "15 Amperes"
    ]
  },
  {
    id: 9,
    text: "Which of the following is the correct chemical formula for Baking Soda?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Inorganic",
    difficulty: "medium",
    options: [
      "Na2CO3 (Sodium Carbonate)",
      "NaHCO3 (Sodium Bicarbonate)",
      "NaCl (Sodium Chloride)",
      "NaOH (Sodium Hydroxide)"
    ]
  },
  {
    id: 10,
    text: "Which pancreatic hormone is primarily responsible for lowering blood glucose levels by facilitating cellular uptake of sugar?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Human Physiology",
    difficulty: "easy",
    options: [
      "Thyroxine",
      "Glucagon",
      "Insulin",
      "Adrenaline"
    ]
  },
  {
    id: 11,
    text: "The unit used to measure the power of a lens is:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Optics",
    difficulty: "easy",
    options: [
      "Dioptre",
      "Meter",
      "Watt",
      "Radian"
    ]
  },
  {
    id: 12,
    text: "Which of the following electromagnetic waves possesses the highest frequency and therefore the highest energy?",
    marks: 4,
    type: "mcq",
    topic: "Physics - Electromagnetic Waves",
    difficulty: "medium",
    options: [
      "Gamma rays",
      "X-rays",
      "Ultraviolet rays",
      "Radio waves"
    ]
  },
  {
    id: 13,
    text: "The escape velocity required for an object to overcome Earth's gravitational pull at its surface is approximately:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Gravitation",
    difficulty: "easy",
    options: [
      "11.2 km/s",
      "9.8 m/s",
      "300,000 km/s",
      "7.9 km/s"
    ]
  },
  {
    id: 14,
    text: "According to the principle of conservation of energy, energy can only be:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Thermodynamics",
    difficulty: "easy",
    options: [
      "Transformed from one form to another",
      "Created from absolute nothingness",
      "Destroyed completely leaving no trace",
      "Increased infinitely in a closed system"
    ]
  },
  {
    id: 15,
    text: "A 'light year' is primarily a unit used in astronomy to measure:",
    marks: 4,
    type: "mcq",
    topic: "Physics - Units & Measurements",
    difficulty: "easy",
    options: [
      "Astronomical distances",
      "Time taken for light to reach Earth",
      "The constant speed of light",
      "The luminosity of stars"
    ]
  },
  {
    id: 16,
    text: "What is the correct mathematical relationship between the frequency (f), wavelength (λ), and wave speed (v) of a wave?",
    marks: 4,
    type: "mcq",
    topic: "Physics - Waves",
    difficulty: "medium",
    options: [
      "v = f × λ",
      "v = f / λ",
      "λ = v × f",
      "f = v × λ"
    ]
  },
  {
    id: 17,
    text: "The pH value of pure, distilled water at standard room temperature (25°C) is exactly:",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Physical",
    difficulty: "easy",
    options: [
      "7",
      "0",
      "14",
      "1"
    ]
  },
  {
    id: 18,
    text: "Which specific isotope of hydrogen is known to be radioactive?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Inorganic",
    difficulty: "medium",
    options: [
      "Tritium",
      "Protium",
      "Deuterium",
      "None of the above"
    ]
  },
  {
    id: 19,
    text: "What is the primary chemical component of biogas produced by the anaerobic digestion of organic matter?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Organic",
    difficulty: "easy",
    options: [
      "Methane (CH4)",
      "Butane (C4H10)",
      "Propane (C3H8)",
      "Ethane (C2H6)"
    ]
  },
  {
    id: 20,
    text: "Which of the following gaseous compounds is commonly referred to as 'Laughing Gas' due to its euphoric effects when inhaled?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Inorganic",
    difficulty: "medium",
    options: [
      "Nitrous Oxide (N2O)",
      "Nitric Oxide (NO)",
      "Nitrogen Dioxide (NO2)",
      "Dinitrogen Tetroxide (N2O4)"
    ]
  },
  {
    id: 21,
    text: "The slow process of converting a liquid state into a vapor state at temperatures strictly below its boiling point is defined as:",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Physical",
    difficulty: "easy",
    options: [
      "Evaporation",
      "Boiling",
      "Condensation",
      "Sublimation"
    ]
  },
  {
    id: 22,
    text: "Which essential transition metal ion is centrally coordinated within the structure of Vitamin B12 (Cobalamin)?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Biomolecules",
    difficulty: "hard",
    options: [
      "Cobalt (Co)",
      "Iron (Fe)",
      "Magnesium (Mg)",
      "Zinc (Zn)"
    ]
  },
  {
    id: 23,
    text: "What is the widely used common commercial name for the chemical compound Calcium Oxychloride (CaOCl2)?",
    marks: 4,
    type: "mcq",
    topic: "Chemistry - Inorganic",
    difficulty: "medium",
    options: [
      "Bleaching powder",
      "Baking soda",
      "Washing soda",
      "Plaster of Paris"
    ]
  },
  {
    id: 24,
    text: "In the ABO blood group system, which specific blood type is classically considered the 'universal donor' for red blood cells?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Human Physiology",
    difficulty: "medium",
    options: [
      "O negative (O-)",
      "AB positive (AB+)",
      "A positive (A+)",
      "B negative (B-)"
    ]
  },
  {
    id: 25,
    text: "The fundamental structural, functional, and biological unit of the human nervous system is the:",
    marks: 4,
    type: "mcq",
    topic: "Biology - Human Physiology",
    difficulty: "easy",
    options: [
      "Neuron",
      "Nephron",
      "Alveolus",
      "Sarcomere"
    ]
  },
  {
    id: 26,
    text: "According to Chargaff's rules regarding the double-helical structure of DNA, the nitrogenous base Adenine (A) always pairs with:",
    marks: 4,
    type: "mcq",
    topic: "Biology - Genetics",
    difficulty: "easy",
    options: [
      "Thymine (T)",
      "Cytosine (C)",
      "Guanine (G)",
      "Uracil (U)"
    ]
  },
  {
    id: 27,
    text: "The clinical disease Scurvy, characterized by swollen, bleeding gums and poor wound healing, is primarily caused by a severe deficiency of:",
    marks: 4,
    type: "mcq",
    topic: "Biology - Nutrition",
    difficulty: "easy",
    options: [
      "Vitamin C (Ascorbic acid)",
      "Vitamin A (Retinol)",
      "Vitamin D (Calciferol)",
      "Vitamin B12 (Cobalamin)"
    ]
  },
  {
    id: 28,
    text: "Which of the following bones is the longest, heaviest, and strongest in the human skeleton?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Human Anatomy",
    difficulty: "easy",
    options: [
      "Femur (Thigh bone)",
      "Tibia (Shinbone)",
      "Humerus (Upper arm bone)",
      "Radius (Forearm bone)"
    ]
  },
  {
    id: 29,
    text: "What is the primary, essential photosynthetic pigment found directly in the reaction centers of photosystems in green plants?",
    marks: 4,
    type: "mcq",
    topic: "Biology - Botany",
    difficulty: "medium",
    options: [
      "Chlorophyll a",
      "Carotene",
      "Xanthophyll",
      "Anthocyanin"
    ]
  },
  {
    id: 30,
    text: "During gene expression, the biological process by which a specific segment of DNA is copied into a complementary sequence of messenger RNA (mRNA) is called:",
    marks: 4,
    type: "mcq",
    topic: "Biology - Molecular Basis of Inheritance",
    difficulty: "medium",
    options: [
      "Transcription",
      "Translation",
      "Replication",
      "Mutation"
    ]
  }
];

export const EXAM_CONFIG = {
  set: "A",
  subject: "NEET Mock Test — Physics, Chemistry, Biology",
  duration_seconds: 10800, // 3 hours
  total_marks: 120,
  instructions: "Answer all questions. Each correct answer carries 4 marks. There is no negative marking in this mock format.",
};

export default QUESTIONS;
