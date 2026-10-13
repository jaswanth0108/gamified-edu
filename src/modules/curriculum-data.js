/**
 * LearnQuest — Curriculum Data Module (Multi-Class Expanded)
 *
 * Chapter/unit names are drawn from the verified NCERT textbook structure.
 * All questions are ORIGINAL creations for LearnQuest.
 * Source: https://ncert.nic.in/textbook.php
 * Last checked: October 2026  |  Status: DEMO
 */

export const APP_CONFIG = {
  name: 'LearnQuest',
  tagline: 'Your Personalised Learning Adventure',
  version: '2.0.0-demo',
  xpPerCorrectAnswer: 10,
  xpLevelCompletionBonus: 30,
  questionsPerLevel: 5,
  giftCardEveryNLevels: 5,
};

export const BOARDS = [
  { id: 'cbse',     name: 'CBSE',           icon: '🏫', description: 'Central Board of Secondary Education' },
  { id: 'icse',     name: 'ICSE',           icon: '🎓', description: 'Indian Certificate of Secondary Education' },
  { id: 'state-ap', name: 'AP State Board', icon: '📚', description: 'Andhra Pradesh State Board' },
  { id: 'state-ts', name: 'TS State Board', icon: '📖', description: 'Telangana State Board' },
  { id: 'state-tn', name: 'TN State Board', icon: '📝', description: 'Tamil Nadu State Board' },
  { id: 'state-ka', name: 'Karnataka',      icon: '📗', description: 'Karnataka State Board' },
];

export const SUBJECTS = [
  { id: 'mathematics',   name: 'Mathematics',   icon: '🔢', color: '#6C5CE7' },
  { id: 'science',       name: 'Science',        icon: '🔬', color: '#00B894' },
  { id: 'english',       name: 'English',        icon: '📖', color: '#0984E3' },
  { id: 'social-science',name: 'Social Science', icon: '🌍', color: '#E17055' },
  { id: 'hindi',         name: 'Hindi',          icon: '📝', color: '#FF9F43' },
];

export const LANGUAGES = [
  { id: 'en', name: 'English',  icon: '🇬🇧' },
  { id: 'hi', name: 'Hindi',    icon: '🇮🇳' },
  { id: 'te', name: 'Telugu',   icon: '📜' },
  { id: 'ta', name: 'Tamil',    icon: '📜' },
];

/* ─── World themes per subject ─────────────────────────────────────── */
export const WORLD_THEMES = {
  mathematics:    { name: 'Number Kingdom',      bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)', accent: '#e94560' },
  science:        { name: 'Discovery Jungle',    bg: 'linear-gradient(135deg,#0a2e1a 0%,#145a32 50%,#1e8449 100%)', accent: '#27ae60' },
  english:        { name: 'Storybook Village',   bg: 'linear-gradient(135deg,#1a0a2e 0%,#2c1654 50%,#4a235a 100%)', accent: '#8e44ad' },
  'social-science':{ name: 'History Trail',      bg: 'linear-gradient(135deg,#1a0e00 0%,#4a2c00 50%,#7d5a00 100%)', accent: '#f39c12' },
  hindi:          { name: 'Sahitya Nagar',       bg: 'linear-gradient(135deg,#1a0010 0%,#560026 50%,#900c3f 100%)', accent: '#e91e63' },
};

/* ─── NCERT Chapter syllabi per class/subject ──────────────────────── */
export const CURRICULA = {
  /* Class 1 Math */
  '1-mathematics': {
    board: 'cbse', class: 1, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c1m-ch1', title:'Shapes and Spaces',      env:'Shape Land',   color:'#e74c3c' },
      { id:'c1m-ch2', title:'Numbers from One to Nine',env:'Number Village',color:'#e67e22'},
      { id:'c1m-ch3', title:'Addition',               env:'Plus Island',  color:'#27ae60'},
      { id:'c1m-ch4', title:'Subtraction',            env:'Minus Bay',    color:'#2980b9'},
      { id:'c1m-ch5', title:'Numbers from Ten to Twenty',env:'Teen Town', color:'#8e44ad'},
      { id:'c1m-ch6', title:'Time',                   env:'Clock Castle', color:'#16a085'},
      { id:'c1m-ch7', title:'Measurement',            env:'Measure Meadow',color:'#d35400'},
      { id:'c1m-ch8', title:'Numbers from Twenty-one to Fifty',env:'Fifty Hills',color:'#c0392b'},
    ]
  },

  /* Class 2 Math */
  '2-mathematics': {
    board: 'cbse', class: 2, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c2m-ch1', title:'What is Long, What is Round?', env:'Shape World',   color:'#e74c3c'},
      { id:'c2m-ch2', title:'Counting in Groups',           env:'Group Garden', color:'#e67e22'},
      { id:'c2m-ch3', title:'How Much Can You Carry?',      env:'Weight World',  color:'#27ae60'},
      { id:'c2m-ch4', title:'Counting in Tens',             env:'Ten Town',      color:'#2980b9'},
      { id:'c2m-ch5', title:'Patterns',                     env:'Pattern Plains',color:'#8e44ad'},
      { id:'c2m-ch6', title:'Footprints',                   env:'Footprint Falls',color:'#16a085'},
    ]
  },

  /* Class 3 Math */
  '3-mathematics': {
    board: 'cbse', class: 3, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c3m-ch1', title:'Where to Look From?',    env:'Look-Out Lighthouse', color:'#e74c3c'},
      { id:'c3m-ch2', title:'Fun with Numbers',       env:'Number Fun Fair',     color:'#e67e22'},
      { id:'c3m-ch3', title:'Give and Take',          env:'Give-and-Take Gate',  color:'#27ae60'},
      { id:'c3m-ch4', title:'Long and Short',         env:'Ruler Ridge',         color:'#2980b9'},
      { id:'c3m-ch5', title:'Shapes and Designs',     env:'Design Desert',       color:'#8e44ad'},
      { id:'c3m-ch6', title:'Fun with Give-and-Take', env:'Trade Towers',        color:'#16a085'},
      { id:'c3m-ch7', title:'Time Goes On',           env:'Time Tower',          color:'#d35400'},
      { id:'c3m-ch8', title:'Who is Heavier?',        env:'Balance Bluffs',      color:'#c0392b'},
      { id:'c3m-ch9', title:'How Many Times?',        env:'Multiply Mountain',   color:'#1abc9c'},
      { id:'c3m-ch10',title:'Play with Patterns',     env:'Pattern Palace',      color:'#e91e63'},
    ]
  },

  /* Class 4 Math */
  '4-mathematics': {
    board: 'cbse', class: 4, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c4m-ch1', title:'Building with Bricks',          env:'Brick Bastion',  color:'#e74c3c'},
      { id:'c4m-ch2', title:'Long and Short',                env:'Length Lands',   color:'#e67e22'},
      { id:'c4m-ch3', title:'A Trip to Bhopal',              env:'Journey Junction',color:'#27ae60'},
      { id:'c4m-ch4', title:'Tick-Tick-Tick',                env:'Clock Cliff',    color:'#2980b9'},
      { id:'c4m-ch5', title:'The Way The World Looks',       env:'Vista Valley',   color:'#8e44ad'},
      { id:'c4m-ch6', title:'The Junk Seller',               env:'Market Maze',    color:'#16a085'},
      { id:'c4m-ch7', title:'Jugs and Mugs',                 env:'Volume Village', color:'#d35400'},
      { id:'c4m-ch8', title:'Carts and Wheels',              env:'Circle Circuit',  color:'#c0392b'},
      { id:'c4m-ch9', title:'Halves and Quarters',           env:'Fraction Falls', color:'#1abc9c'},
      { id:'c4m-ch10',title:'Play with Patterns',            env:'Pattern Peak',   color:'#e91e63'},
      { id:'c4m-ch11',title:'Tables and Shares',             env:'Division Domain',color:'#9b59b6'},
      { id:'c4m-ch12',title:'How Heavy? How Light?',         env:'Weight Wilderness',color:'#2ecc71'},
      { id:'c4m-ch13',title:'Fields and Fences',             env:'Area Arena',     color:'#f39c12'},
      { id:'c4m-ch14',title:'Smart Charts',                  env:'Data Dunes',     color:'#3498db'},
    ]
  },

  /* Class 5 Math */
  '5-mathematics': {
    board: 'cbse', class: 5, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c5m-ch1', title:'The Fish Tale',                       env:'Ocean Odyssey',  color:'#0984E3'},
      { id:'c5m-ch2', title:'Shapes and Angles',                   env:'Angle Alcove',   color:'#6C5CE7'},
      { id:'c5m-ch3', title:'How Many Squares?',                   env:'Square Savannah',color:'#00B894'},
      { id:'c5m-ch4', title:'Parts and Wholes',                    env:'Fraction Forest',color:'#FDCB6E'},
      { id:'c5m-ch5', title:'Does it Look the Same?',              env:'Mirror Meadow',  color:'#E17055'},
      { id:'c5m-ch6', title:'Be My Multiple, I\'ll Be Your Factor',env:'Factor Fortress',color:'#74B9FF'},
      { id:'c5m-ch7', title:'Can You See the Pattern?',            env:'Pattern Palace', color:'#A29BFE'},
      { id:'c5m-ch8', title:'Mapping Your Way',                    env:'Map Mountains',  color:'#55EFC4'},
      { id:'c5m-ch9', title:'Boxes and Sketches',                  env:'Box Bay',        color:'#FD79A8'},
      { id:'c5m-ch10',title:'Tenths and Hundredths',               env:'Decimal Delta',  color:'#636E72'},
      { id:'c5m-ch11',title:'Area and its Boundary',               env:'Area Alps',      color:'#00CEC9'},
      { id:'c5m-ch12',title:'Smart Charts',                        env:'Data Desert',    color:'#E84393'},
      { id:'c5m-ch13',title:'Ways to Multiply and Divide',         env:'Multiply Moor',  color:'#6C5CE7'},
      { id:'c5m-ch14',title:'How Big? How Heavy?',                 env:'Scale Shores',   color:'#2D3436'},
    ]
  },

  /* Class 6 Math — FULLY PLAYABLE DEMO */
  '6-mathematics': {
    board: 'cbse', class: 6, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'ch1', title:'Knowing Our Numbers',      env:'Number Kingdom',    color:'#6C5CE7' },
      { id:'ch2', title:'Whole Numbers',            env:'Whole World Valley', color:'#0984E3' },
      { id:'ch3', title:'Playing with Numbers',     env:'Factor Forest',     color:'#00B894' },
      { id:'ch4', title:'Basic Geometrical Ideas',  env:'Geometry Gardens',  color:'#E17055' },
      { id:'ch5', title:'Understanding Elementary Shapes',env:'Shape Summit',color:'#FDCB6E' },
      { id:'ch6', title:'Integers',                 env:'Integer Island',    color:'#74B9FF' },
      { id:'ch7', title:'Fractions',                env:'Fraction Falls',    color:'#A29BFE' },
      { id:'ch8', title:'Decimals',                 env:'Decimal Dunes',     color:'#55EFC4' },
      { id:'ch9', title:'Data Handling',            env:'Data Dome',         color:'#FD79A8' },
      { id:'ch10',title:'Mensuration',              env:'Measure Mountains', color:'#00CEC9' },
      { id:'ch11',title:'Algebra',                  env:'Algebra Abyss',     color:'#6C5CE7' },
      { id:'ch12',title:'Ratio and Proportion',     env:'Ratio Realm',       color:'#E84393' },
      { id:'ch13',title:'Symmetry',                 env:'Mirror Meadow',     color:'#27ae60' },
      { id:'ch14',title:'Practical Geometry',       env:'Compass Castle',    color:'#e74c3c' },
    ]
  },

  /* Class 7 Math */
  '7-mathematics': {
    board: 'cbse', class: 7, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c7m-ch1', title:'Integers',                              env:'Integer Isle',       color:'#6C5CE7'},
      { id:'c7m-ch2', title:'Fractions and Decimals',                env:'Fraction Fields',    color:'#0984E3'},
      { id:'c7m-ch3', title:'Data Handling',                         env:'Data Desert',        color:'#00B894'},
      { id:'c7m-ch4', title:'Simple Equations',                      env:'Equation Empire',    color:'#E17055'},
      { id:'c7m-ch5', title:'Lines and Angles',                      env:'Angle Archipelago',  color:'#FDCB6E'},
      { id:'c7m-ch6', title:'The Triangle and its Properties',       env:'Triangle Terrain',   color:'#74B9FF'},
      { id:'c7m-ch7', title:'Congruence of Triangles',               env:'Congruence Cove',    color:'#A29BFE'},
      { id:'c7m-ch8', title:'Comparing Quantities',                  env:'Compare Cliffs',     color:'#55EFC4'},
      { id:'c7m-ch9', title:'Rational Numbers',                      env:'Rational Ridges',    color:'#FD79A8'},
      { id:'c7m-ch10',title:'Practical Geometry',                    env:'Geometry Gulf',      color:'#00CEC9'},
      { id:'c7m-ch11',title:'Perimeter and Area',                    env:'Area Alps',          color:'#e74c3c'},
      { id:'c7m-ch12',title:'Algebraic Expressions',                 env:'Expression Estate',  color:'#9b59b6'},
      { id:'c7m-ch13',title:'Exponents and Powers',                  env:'Power Peak',         color:'#2ecc71'},
      { id:'c7m-ch14',title:'Symmetry',                              env:'Symmetry Summit',    color:'#f39c12'},
      { id:'c7m-ch15',title:'Visualising Solid Shapes',              env:'Solid Shape Shores', color:'#e91e63'},
    ]
  },

  /* Class 8 Math */
  '8-mathematics': {
    board: 'cbse', class: 8, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c8m-ch1', title:'Rational Numbers',           env:'Rational Realm',    color:'#6C5CE7'},
      { id:'c8m-ch2', title:'Linear Equations in One Variable',env:'Linear Lands',color:'#0984E3'},
      { id:'c8m-ch3', title:'Understanding Quadrilaterals',env:'Quad Quarters',   color:'#00B894'},
      { id:'c8m-ch4', title:'Data Handling',              env:'Data Domain',       color:'#E17055'},
      { id:'c8m-ch5', title:'Squares and Square Roots',   env:'Square Savanna',   color:'#FDCB6E'},
      { id:'c8m-ch6', title:'Cubes and Cube Roots',       env:'Cube Canyon',       color:'#74B9FF'},
      { id:'c8m-ch7', title:'Comparing Quantities',       env:'Compare Crest',     color:'#A29BFE'},
      { id:'c8m-ch8', title:'Algebraic Expressions and Identities',env:'Identity Island',color:'#55EFC4'},
      { id:'c8m-ch9', title:'Mensuration',                env:'Measure Mesa',      color:'#FD79A8'},
      { id:'c8m-ch10',title:'Exponents and Powers',       env:'Exponent Expanse',  color:'#00CEC9'},
      { id:'c8m-ch11',title:'Direct and Inverse Proportions',env:'Proportion Pass',color:'#e74c3c'},
      { id:'c8m-ch12',title:'Factorisation',              env:'Factor Falls',      color:'#9b59b6'},
      { id:'c8m-ch13',title:'Introduction to Graphs',     env:'Graph Grove',       color:'#2ecc71'},
    ]
  },

  /* Class 9 Math */
  '9-mathematics': {
    board: 'cbse', class: 9, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c9m-ch1', title:'Number Systems',              env:'Number Nebula',     color:'#6C5CE7'},
      { id:'c9m-ch2', title:'Polynomials',                 env:'Polynomial Plains', color:'#0984E3'},
      { id:'c9m-ch3', title:'Coordinate Geometry',         env:'Coordinate Cove',   color:'#00B894'},
      { id:'c9m-ch4', title:'Linear Equations in Two Variables',env:'Variable Valley',color:'#E17055'},
      { id:'c9m-ch5', title:'Introduction to Euclid\'s Geometry',env:'Euclid\'s Empire',color:'#FDCB6E'},
      { id:'c9m-ch6', title:'Lines and Angles',            env:'Line-Angle Lake',   color:'#74B9FF'},
      { id:'c9m-ch7', title:'Triangles',                   env:'Triangle Tundra',   color:'#A29BFE'},
      { id:'c9m-ch8', title:'Quadrilaterals',              env:'Quad Quarters',     color:'#55EFC4'},
      { id:'c9m-ch9', title:'Circles',                     env:'Circle City',       color:'#FD79A8'},
      { id:'c9m-ch10',title:'Heron\'s Formula',            env:'Heron\'s Hills',    color:'#00CEC9'},
      { id:'c9m-ch11',title:'Surface Areas and Volumes',   env:'Volume Vaults',     color:'#e74c3c'},
      { id:'c9m-ch12',title:'Statistics',                  env:'Stats Station',     color:'#9b59b6'},
    ]
  },

  /* Class 10 Math */
  '10-mathematics': {
    board: 'cbse', class: 10, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c10m-ch1', title:'Real Numbers',               env:'Real Realm',        color:'#6C5CE7'},
      { id:'c10m-ch2', title:'Polynomials',                env:'Poly Peaks',        color:'#0984E3'},
      { id:'c10m-ch3', title:'Pair of Linear Equations in Two Variables',env:'Equation Expanse',color:'#00B894'},
      { id:'c10m-ch4', title:'Quadratic Equations',        env:'Quadratic Quarry',  color:'#E17055'},
      { id:'c10m-ch5', title:'Arithmetic Progressions',    env:'AP Archipelago',    color:'#FDCB6E'},
      { id:'c10m-ch6', title:'Triangles',                  env:'Triangle Terrain',  color:'#74B9FF'},
      { id:'c10m-ch7', title:'Coordinate Geometry',        env:'Coordinate Canyon', color:'#A29BFE'},
      { id:'c10m-ch8', title:'Introduction to Trigonometry',env:'Trig Tower',       color:'#55EFC4'},
      { id:'c10m-ch9', title:'Some Applications of Trigonometry',env:'Trig Trails', color:'#FD79A8'},
      { id:'c10m-ch10',title:'Circles',                    env:'Circle Crest',      color:'#00CEC9'},
      { id:'c10m-ch11',title:'Areas Related to Circles',   env:'Arc Arena',         color:'#e74c3c'},
      { id:'c10m-ch12',title:'Surface Areas and Volumes',  env:'Surface Summit',    color:'#9b59b6'},
      { id:'c10m-ch13',title:'Statistics',                 env:'Stats Sanctuary',   color:'#2ecc71'},
      { id:'c10m-ch14',title:'Probability',                env:'Probability Plains',color:'#f39c12'},
    ]
  },

  /* Class 11 Math */
  '11-mathematics': {
    board: 'cbse', class: 11, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c11m-ch1', title:'Sets',                       env:'Set Shores',        color:'#6C5CE7'},
      { id:'c11m-ch2', title:'Relations and Functions',    env:'Function Fields',   color:'#0984E3'},
      { id:'c11m-ch3', title:'Trigonometric Functions',    env:'Trig Towers',       color:'#00B894'},
      { id:'c11m-ch4', title:'Complex Numbers and Quadratic Equations',env:'Complex Cove',color:'#E17055'},
      { id:'c11m-ch5', title:'Linear Inequalities',        env:'Inequality Isle',   color:'#FDCB6E'},
      { id:'c11m-ch6', title:'Permutations and Combinations',env:'Perm-Comb Peak',  color:'#74B9FF'},
      { id:'c11m-ch7', title:'Binomial Theorem',           env:'Binomial Bay',      color:'#A29BFE'},
      { id:'c11m-ch8', title:'Sequences and Series',       env:'Series Savanna',    color:'#55EFC4'},
      { id:'c11m-ch9', title:'Straight Lines',             env:'Line Lands',        color:'#FD79A8'},
      { id:'c11m-ch10',title:'Conic Sections',             env:'Conic Citadel',     color:'#00CEC9'},
      { id:'c11m-ch11',title:'Introduction to Three Dimensional Geometry',env:'3D Domain',color:'#e74c3c'},
      { id:'c11m-ch12',title:'Limits and Derivatives',     env:'Calculus Canyon',   color:'#9b59b6'},
      { id:'c11m-ch13',title:'Statistics',                 env:'Stats Star',        color:'#2ecc71'},
      { id:'c11m-ch14',title:'Probability',                env:'Probability Prism', color:'#f39c12'},
    ]
  },

  /* Class 12 Math */
  '12-mathematics': {
    board: 'cbse', class: 12, subject: 'mathematics', language: 'en',
    academicYear: '2024-25', verificationStatus: 'DEMO',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    chapters: [
      { id:'c12m-ch1', title:'Relations and Functions',           env:'Relation Realm',   color:'#6C5CE7'},
      { id:'c12m-ch2', title:'Inverse Trigonometric Functions',   env:'Inverse Isle',     color:'#0984E3'},
      { id:'c12m-ch3', title:'Matrices',                          env:'Matrix Mountains', color:'#00B894'},
      { id:'c12m-ch4', title:'Determinants',                      env:'Determinant Dunes',color:'#E17055'},
      { id:'c12m-ch5', title:'Continuity and Differentiability',  env:'Calculus Cliffs',  color:'#FDCB6E'},
      { id:'c12m-ch6', title:'Applications of Derivatives',       env:'Derivative Delta',  color:'#74B9FF'},
      { id:'c12m-ch7', title:'Integrals',                         env:'Integral Island',  color:'#A29BFE'},
      { id:'c12m-ch8', title:'Applications of the Integrals',     env:'Area Arch',        color:'#55EFC4'},
      { id:'c12m-ch9', title:'Differential Equations',            env:'Diff-Eq Domain',   color:'#FD79A8'},
      { id:'c12m-ch10',title:'Vector Algebra',                    env:'Vector Valley',    color:'#00CEC9'},
      { id:'c12m-ch11',title:'Three Dimensional Geometry',        env:'3D Galaxy',        color:'#e74c3c'},
      { id:'c12m-ch12',title:'Linear Programming',                env:'LP Lands',         color:'#9b59b6'},
      { id:'c12m-ch13',title:'Probability',                       env:'Probability Peaks',color:'#2ecc71'},
    ]
  },
};

/* ─── Helper: get curriculum for class+subject ───────────────────── */
export function getCurriculum(classNum, subjectId) {
  const key = `${classNum}-${subjectId}`;
  return CURRICULA[key] || CURRICULA['6-mathematics']; // fallback to Class 6 Math
}

/* ─── Get flat array of level nodes from chapters ─────────────────── */
export function getLevels(classNum, subjectId) {
  const curr = getCurriculum(classNum, subjectId);
  const levels = [];
  curr.chapters.forEach((ch, chIdx) => {
    // Each chapter becomes 1 level for simplicity in the map
    levels.push({
      id: ch.id,
      chapterIndex: chIdx,
      levelNumber: chIdx + 1,
      title: ch.title,
      env: ch.env,
      color: ch.color,
      isMilestone: (chIdx + 1) % 5 === 0,
    });
  });
  return levels;
}

/* ─── Demo Questions for Class 6 Mathematics, Chapter 1 ──────────── */
export const DEMO_QUESTIONS = {
  'ch1': [
    {
      id:'q-ch1-1', type:'mcq',
      text:'Which of the following numbers is the greatest?',
      options:['45,321','45,231','54,321','43,521'],
      correctIndex:2,
      explanation:'54,321 is the greatest because the ten-thousands digit (5) is larger than 4 in the others.',
      hint:'Compare digits from left to right starting with the highest place value.',
      topic:'Comparing Numbers', objective:'Compare 5-digit numbers',
    },
    {
      id:'q-ch1-2', type:'mcq',
      text:'Arrange in ascending order: 23,456 ; 32,456 ; 22,456 ; 23,546',
      options:[
        '22,456 < 23,456 < 23,546 < 32,456',
        '23,456 < 22,456 < 23,546 < 32,456',
        '32,456 < 23,546 < 23,456 < 22,456',
        '22,456 < 23,546 < 23,456 < 32,456',
      ],
      correctIndex:0,
      explanation:'Ascending = smallest to largest: 22,456 < 23,456 < 23,546 < 32,456.',
      hint:'Ascending order means smallest first. Compare the leftmost digits first.',
      topic:'Ordering Numbers', objective:'Compare and order multi-digit numbers',
    },
    {
      id:'q-ch1-3', type:'tf',
      text:'The number 56,789 is greater than 65,789.',
      correctAnswer:false,
      explanation:'56,789 has 5 in ten-thousands; 65,789 has 6. Since 6 > 5, 65,789 is greater.',
      hint:'Look at the leftmost (ten-thousands) digit of both numbers.',
      topic:'Comparing Numbers', objective:'Compare 5-digit numbers',
    },
    {
      id:'q-ch1-4', type:'mcq',
      text:'What is the smallest 5-digit number using digits 3, 0, 7, 1, 5 (each once)?',
      options:['01,357','10,357','10,375','13,057'],
      correctIndex:1,
      explanation:'A 5-digit number cannot start with 0. Use 1 at front, then 0, 3, 5, 7 → 10,357.',
      hint:'The leading digit cannot be 0. Use the smallest non-zero digit first.',
      topic:'Comparing Numbers', objective:'Form numbers using digits',
    },
    {
      id:'q-ch1-5', type:'fill',
      text:'The largest 4-digit number is ____.',
      correctAnswer:'9999',
      explanation:'Placing the largest digit 9 in every position gives 9,999.',
      hint:'What is the largest single digit? Repeat it four times.',
      topic:'Number Boundaries', objective:'Identify boundary numbers',
    },
  ],
  'ch2': [
    {
      id:'q-ch2-1', type:'fill',
      text:'The successor of 999 is ____.',
      correctAnswer:'1000',
      explanation:'Successor = number + 1. 999 + 1 = 1000.',
      hint:'Successor means the next number. Add 1.',
      topic:'Predecessor and Successor', objective:'Find successor of whole numbers',
    },
    {
      id:'q-ch2-2', type:'fill',
      text:'The predecessor of 10,000 is ____.',
      correctAnswer:'9999',
      explanation:'Predecessor = number − 1. 10,000 − 1 = 9,999.',
      hint:'Predecessor means the previous number. Subtract 1.',
      topic:'Predecessor and Successor', objective:'Find predecessor of whole numbers',
    },
    {
      id:'q-ch2-3', type:'tf',
      text:'The whole number 0 has a predecessor.',
      correctAnswer:false,
      explanation:'0 is the smallest whole number; there is no whole number before it.',
      hint:'Whole numbers start from 0. Can you go below 0 within whole numbers?',
      topic:'Whole Numbers', objective:'Understand properties of 0',
    },
    {
      id:'q-ch2-4', type:'mcq',
      text:'Between which two consecutive whole numbers does no other whole number exist?',
      options:['5 and 7','10 and 12','15 and 16','20 and 22'],
      correctIndex:2,
      explanation:'15 and 16 are consecutive — no whole number sits between them.',
      hint:'Consecutive means one right after the other with no gap.',
      topic:'Consecutive Numbers', objective:'Identify consecutive whole numbers',
    },
    {
      id:'q-ch2-5', type:'mcq',
      text:'Every whole number has a:',
      options:['Predecessor only','Successor only','Both predecessor and successor','Successor, but only non-zero numbers have a predecessor'],
      correctIndex:3,
      explanation:'Every whole number has a successor. But 0, the smallest, has no predecessor in whole numbers.',
      hint:'Think about 0. Does it have a whole number before it?',
      topic:'Whole Numbers', objective:'Properties of whole numbers',
    },
  ],
};

/* ─── Topic-based question banks for fallback chapters ────────── */
const TOPIC_QUESTIONS = {
  /* Mathematics topics */
  'shapes': [
    { type:'mcq', text:'How many sides does a triangle have?', options:['2','3','4','5'], correctIndex:1, explanation:'A triangle has exactly 3 sides.', hint:'Think of the word "tri" which means three.', topic:'Shapes' },
    { type:'mcq', text:'Which shape has all sides equal and all angles 90°?', options:['Rectangle','Circle','Square','Triangle'], correctIndex:2, explanation:'A square has 4 equal sides and 4 right angles.', hint:'Think of a chess board tile.', topic:'Shapes' },
    { type:'tf',  text:'A circle has corners.', correctAnswer:false, explanation:'A circle is a curved shape with no corners or straight edges.', hint:'Try drawing a circle — does it have a sharp point?', topic:'Shapes' },
    { type:'mcq', text:'How many faces does a cube have?', options:['4','5','6','8'], correctIndex:2, explanation:'A cube has 6 faces, all of which are squares.', hint:'Count the faces of a dice.', topic:'3D Shapes' },
    { type:'fill', text:'A shape with 4 equal sides but angles that are not 90° is called a _____.', correctAnswer:'rhombus', explanation:'A rhombus has 4 equal sides but its angles are not all right angles.', hint:'Think of a diamond shape.', topic:'Quadrilaterals' },
  ],
  'numbers': [
    { type:'mcq', text:'What is the place value of 5 in the number 3,526?', options:['Ones','Tens','Hundreds','Thousands'], correctIndex:2, explanation:'In 3,526, the digit 5 is in the hundreds place.', hint:'Count from the right: ones, tens, hundreds.', topic:'Place Value' },
    { type:'tf',  text:'Every natural number has a successor.', correctAnswer:true, explanation:'You can always add 1 to any natural number to get the next one.', hint:'Can you always add 1 to a number?', topic:'Natural Numbers' },
    { type:'mcq', text:'Which of the following is NOT a factor of 12?', options:['3','4','5','6'], correctIndex:2, explanation:'12 ÷ 5 = 2.4, which is not a whole number, so 5 is not a factor of 12.', hint:'A factor divides the number evenly with no remainder.', topic:'Factors' },
    { type:'mcq', text:'What is the predecessor of 1,000?', options:['999','1,001','100','9,999'], correctIndex:0, explanation:'Predecessor = number − 1. 1,000 − 1 = 999.', hint:'Predecessor means the number that comes just before.', topic:'Predecessor and Successor' },
    { type:'fill', text:'The smallest 4-digit number is _____.', correctAnswer:'1000', explanation:'1,000 is the smallest four-digit number. 999 is the largest 3-digit number.', hint:'After 999 comes...', topic:'Number System' },
  ],
  'addition': [
    { type:'mcq', text:'What is 347 + 256?', options:['593','603','613','583'], correctIndex:1, explanation:'347 + 256 = 603. Add: 7+6=13 (carry 1), 4+5+1=10 (carry 1), 3+2+1=6.', hint:'Add column by column from right to left.', topic:'Addition' },
    { type:'tf',  text:'Adding 0 to any number changes its value.', correctAnswer:false, explanation:'Adding 0 to any number gives the same number. This is the additive identity property.', hint:'What is 7 + 0?', topic:'Properties of Addition' },
    { type:'mcq', text:'3 + 5 = 5 + 3 is an example of which property?', options:['Associative','Distributive','Commutative','Identity'], correctIndex:2, explanation:'The commutative property says a + b = b + a.', hint:'Changing the order doesn\'t change the sum.', topic:'Properties of Addition' },
    { type:'mcq', text:'What is the sum of the first 5 natural numbers?', options:['10','12','15','20'], correctIndex:2, explanation:'1+2+3+4+5 = 15.', hint:'Add them step by step: 1+2=3, 3+3=6, 6+4=10, 10+5=15.', topic:'Addition' },
    { type:'fill', text:'456 + _____ = 500', correctAnswer:'44', explanation:'500 − 456 = 44. So the missing number is 44.', hint:'Subtract 456 from 500.', topic:'Missing Number Addition' },
  ],
  'subtraction': [
    { type:'mcq', text:'What is 1,000 − 457?', options:['543','453','553','443'], correctIndex:0, explanation:'1,000 − 457 = 543. Use borrowing from left.', hint:'Borrow from the hundreds column.', topic:'Subtraction with Borrowing' },
    { type:'tf',  text:'Subtraction is commutative (a − b = b − a).', correctAnswer:false, explanation:'5 − 3 = 2 but 3 − 5 ≠ 2. Subtraction is NOT commutative.', hint:'Try 8 − 3 and 3 − 8. Are they the same?', topic:'Properties of Subtraction' },
    { type:'mcq', text:'If Rahim had ₹850 and spent ₹375, how much is left?', options:['₹475','₹525','₹485','₹575'], correctIndex:0, explanation:'850 − 375 = 475.', hint:'Subtract 375 from 850 step by step.', topic:'Word Problems' },
    { type:'mcq', text:'The result of subtraction is called?', options:['Sum','Product','Difference','Quotient'], correctIndex:2, explanation:'The result of subtraction is called the difference.', hint:'We say "the difference between two numbers is…"', topic:'Vocabulary' },
    { type:'fill', text:'735 − 200 = _____', correctAnswer:'535', explanation:'735 − 200 = 535. Subtract hundreds: 7−2=5, tens and ones unchanged.', hint:'Only the hundreds digit changes.', topic:'Subtraction' },
  ],
  'multiplication': [
    { type:'mcq', text:'What is 24 × 5?', options:['110','120','115','100'], correctIndex:1, explanation:'24 × 5 = 120. Or: 20×5=100, 4×5=20, 100+20=120.', hint:'Break it into 20×5 and 4×5.', topic:'Multiplication' },
    { type:'tf',  text:'Multiplication is repeated addition.', correctAnswer:true, explanation:'4 × 3 = 4+4+4 = 12. Multiplication is a shortcut for repeated addition.', hint:'Is 3×4 the same as 3+3+3+3?', topic:'Concept of Multiplication' },
    { type:'mcq', text:'What is the product of any number and 0?', options:['The number itself','1','0','Undefined'], correctIndex:2, explanation:'Any number × 0 = 0. This is the zero property of multiplication.', hint:'What is 100 × 0?', topic:'Properties of Multiplication' },
    { type:'mcq', text:'Which is the multiplicative identity?', options:['0','−1','1','10'], correctIndex:2, explanation:'Any number × 1 = the number itself. So 1 is the multiplicative identity.', hint:'Which number leaves any number unchanged when multiplied?', topic:'Properties of Multiplication' },
    { type:'fill', text:'8 × 7 = _____', correctAnswer:'56', explanation:'8 × 7 = 56. Remember: 8×7 is in the 8-times table.', hint:'Count 7 groups of 8: 8,16,24,32,40,48,56.', topic:'Times Tables' },
  ],
  'division': [
    { type:'mcq', text:'What is 144 ÷ 12?', options:['10','11','12','13'], correctIndex:2, explanation:'144 ÷ 12 = 12. Since 12 × 12 = 144.', hint:'Ask: 12 × ? = 144.', topic:'Division' },
    { type:'tf',  text:'Division by 0 is possible.', correctAnswer:false, explanation:'Division by 0 is undefined in mathematics — you cannot divide any number by zero.', hint:'Can you split 10 apples into 0 groups?', topic:'Properties of Division' },
    { type:'mcq', text:'In 56 ÷ 8 = 7, what is 8 called?', options:['Dividend','Divisor','Quotient','Remainder'], correctIndex:1, explanation:'The number we divide by (8) is called the divisor.', hint:'Dividend ÷ Divisor = Quotient.', topic:'Vocabulary' },
    { type:'mcq', text:'What is the remainder when 17 ÷ 5?', options:['0','1','2','3'], correctIndex:2, explanation:'17 = 5×3 + 2. So the remainder is 2.', hint:'5×3=15. 17−15=?', topic:'Remainder' },
    { type:'fill', text:'72 ÷ _____ = 9', correctAnswer:'8', explanation:'72 ÷ 8 = 9. So the missing divisor is 8.', hint:'Ask: 9 × ? = 72.', topic:'Missing Number Division' },
  ],
  'fractions': [
    { type:'mcq', text:'What fraction of a day is 6 hours?', options:['1/2','1/3','1/4','1/6'], correctIndex:2, explanation:'A day has 24 hours. 6/24 = 1/4.', hint:'Divide 6 by 24, then simplify.', topic:'Fractions of Quantities' },
    { type:'tf',  text:'1/2 > 1/4', correctAnswer:true, explanation:'1/2 = 0.5 and 1/4 = 0.25. So 1/2 is greater.', hint:'Imagine slicing a pizza: half is bigger than a quarter.', topic:'Comparing Fractions' },
    { type:'mcq', text:'What is 1/3 + 1/3?', options:['1/6','2/6','2/3','1/3'], correctIndex:2, explanation:'1/3 + 1/3 = 2/3. Add numerators when denominators are equal.', hint:'Add only the top numbers (numerators).', topic:'Addition of Fractions' },
    { type:'mcq', text:'Which fraction is equivalent to 2/4?', options:['1/2','1/3','3/4','2/3'], correctIndex:0, explanation:'2/4 = 1/2 when simplified by dividing both by 2.', hint:'Divide both numerator and denominator by 2.', topic:'Equivalent Fractions' },
    { type:'fill', text:'3/5 of 25 = _____', correctAnswer:'15', explanation:'3/5 of 25 = (3×25)/5 = 75/5 = 15.', hint:'Multiply 25 by 3, then divide by 5.', topic:'Fraction of a Number' },
  ],
  'geometry': [
    { type:'mcq', text:'The sum of angles in a triangle is:', options:['90°','180°','270°','360°'], correctIndex:1, explanation:'The three angles of any triangle always add up to 180°.', hint:'Try measuring the three angles of any triangle.', topic:'Angles in a Triangle' },
    { type:'tf',  text:'A rectangle is a special type of parallelogram.', correctAnswer:true, explanation:'A rectangle has all properties of a parallelogram, plus all angles are 90°.', hint:'Is a rectangle a quadrilateral with opposite sides parallel and equal?', topic:'Quadrilaterals' },
    { type:'mcq', text:'What is the perimeter of a square with side 6 cm?', options:['12 cm','24 cm','36 cm','18 cm'], correctIndex:1, explanation:'Perimeter of square = 4 × side = 4 × 6 = 24 cm.', hint:'A square has 4 equal sides. Add all 4.', topic:'Perimeter' },
    { type:'mcq', text:'How many diagonals does a rectangle have?', options:['1','2','3','4'], correctIndex:1, explanation:'A rectangle has 2 diagonals connecting opposite corners.', hint:'Draw lines from each corner to the opposite corner.', topic:'Properties of Shapes' },
    { type:'fill', text:'Area of a rectangle = length × _____', correctAnswer:'breadth', explanation:'Area = length × breadth (or length × width).', hint:'The other dimension of the rectangle.', topic:'Area' },
  ],
  'measurement': [
    { type:'mcq', text:'How many centimetres are in 1 metre?', options:['10','100','1000','10000'], correctIndex:1, explanation:'1 metre = 100 centimetres.', hint:'The prefix "centi" means 1/100.', topic:'Units of Length' },
    { type:'tf',  text:'1 kilogram = 1000 grams.', correctAnswer:true, explanation:'The prefix "kilo" means 1000. So 1 kg = 1000 g.', hint:'The prefix "kilo" always means 1000.', topic:'Units of Mass' },
    { type:'mcq', text:'Which unit is used to measure the capacity of a water bottle?', options:['kg','cm','litre','metre'], correctIndex:2, explanation:'Capacity (volume of liquid) is measured in litres or millilitres.', hint:'What unit is written on a 500 ml bottle?', topic:'Capacity' },
    { type:'mcq', text:'Convert 2.5 km to metres:', options:['250 m','2,500 m','25 m','25,000 m'], correctIndex:1, explanation:'1 km = 1000 m. So 2.5 × 1000 = 2,500 m.', hint:'Multiply km by 1000 to get metres.', topic:'Unit Conversion' },
    { type:'fill', text:'500 cm = _____ m', correctAnswer:'5', explanation:'500 cm ÷ 100 = 5 m.', hint:'Divide by 100 to convert cm to m.', topic:'Unit Conversion' },
  ],
  'algebra': [
    { type:'mcq', text:'If x + 5 = 12, what is x?', options:['6','7','8','17'], correctIndex:1, explanation:'x = 12 − 5 = 7.', hint:'Move 5 to the other side and subtract.', topic:'Simple Equations' },
    { type:'tf',  text:'An algebraic expression can contain variables and constants.', correctAnswer:true, explanation:'Expressions like 3x + 5 contain both a variable (x) and constants (3 and 5).', hint:'Variables are letters; constants are fixed numbers.', topic:'Algebraic Expressions' },
    { type:'mcq', text:'Simplify: 3a + 4a', options:['7','7a','12a','3a + 4a (cannot simplify)'], correctIndex:1, explanation:'3a + 4a = (3+4)a = 7a. Like terms can be added.', hint:'Add the coefficients of the same variable.', topic:'Like Terms' },
    { type:'mcq', text:'What is the value of 2x − 3 when x = 4?', options:['5','8','11','1'], correctIndex:0, explanation:'2(4) − 3 = 8 − 3 = 5.', hint:'Substitute x = 4 into the expression.', topic:'Evaluating Expressions' },
    { type:'fill', text:'If 3y = 18, then y = _____', correctAnswer:'6', explanation:'y = 18 ÷ 3 = 6.', hint:'Divide both sides by 3.', topic:'Linear Equations' },
  ],
  'ratio': [
    { type:'mcq', text:'In a class of 30 students, 12 are girls. What is the ratio of girls to boys?', options:['2:3','3:2','12:18','2:5'], correctIndex:0, explanation:'Girls = 12, Boys = 30−12 = 18. Ratio = 12:18 = 2:3.', hint:'Simplify 12:18 by dividing both by 6.', topic:'Ratio' },
    { type:'tf',  text:'The ratio 3:5 is the same as 6:10.', correctAnswer:true, explanation:'6:10 = 3:5 when both are divided by 2. They are equivalent ratios.', hint:'Divide both 6 and 10 by 2.', topic:'Equivalent Ratios' },
    { type:'mcq', text:'If a map scale is 1:50000, what does 2 cm on the map represent?', options:['50 km','1 km','100 km','10 km'], correctIndex:1, explanation:'2 × 50000 = 100000 cm = 1 km.', hint:'Multiply map length by the scale factor, then convert cm to km.', topic:'Scale and Maps' },
    { type:'mcq', text:'Divide ₹240 in the ratio 3:5. What is the smaller share?', options:['₹80','₹90','₹150','₹160'], correctIndex:1, explanation:'Total parts = 8. One part = 240/8 = 30. Smaller share = 3×30 = ₹90.', hint:'Find one part first, then multiply.', topic:'Dividing in a Ratio' },
    { type:'fill', text:'If ratio of A to B is 2:3 and A = 10, then B = _____', correctAnswer:'15', explanation:'A/B = 2/3 → 10/B = 2/3 → B = 15.', hint:'Cross multiply: 2 × B = 3 × 10.', topic:'Finding Missing Values' },
  ],
  'percentage': [
    { type:'mcq', text:'What is 25% of 200?', options:['25','50','75','100'], correctIndex:1, explanation:'25% of 200 = (25/100) × 200 = 50.', hint:'Divide 200 by 4 (since 25% = 1/4).', topic:'Percentage Calculation' },
    { type:'tf',  text:'50% is equal to 1/2.', correctAnswer:true, explanation:'50/100 = 1/2. Percent means "per hundred."', hint:'50 per 100 = 50/100. Simplify.', topic:'Percent and Fractions' },
    { type:'mcq', text:'A shirt costs ₹400. After 10% discount, the price is:', options:['₹360','₹380','₹390','₹350'], correctIndex:0, explanation:'10% of 400 = 40. Discounted price = 400 − 40 = ₹360.', hint:'Find 10% of 400 and subtract.', topic:'Discount' },
    { type:'mcq', text:'If a student scores 45 out of 60, what is the percentage?', options:['70%','72%','75%','80%'], correctIndex:2, explanation:'(45/60) × 100 = 75%.', hint:'Divide the score by total, multiply by 100.', topic:'Percentage Score' },
    { type:'fill', text:'_____ % of 50 = 10', correctAnswer:'20', explanation:'(x/100) × 50 = 10 → x = 10×100/50 = 20%.', hint:'Divide 10 by 50, then multiply by 100.', topic:'Finding the Percentage' },
  ],
  /* Science topics */
  'food': [
    { type:'mcq', text:'Which nutrient provides the most energy?', options:['Protein','Vitamins','Carbohydrates','Minerals'], correctIndex:2, explanation:'Carbohydrates (like rice, bread, potatoes) are the body\'s primary energy source.', hint:'Energy foods are usually starchy.', topic:'Nutrients' },
    { type:'tf',  text:'Plants prepare their food using photosynthesis.', correctAnswer:true, explanation:'Plants use sunlight, water, and CO₂ to make glucose through photosynthesis.', hint:'Photo = light, synthesis = making.', topic:'Photosynthesis' },
    { type:'mcq', text:'What is the function of protein in the body?', options:['Provide energy only','Build and repair tissues','Regulate temperature','Carry oxygen'], correctIndex:1, explanation:'Proteins are the body\'s building blocks — they build muscles, repair tissues, and make enzymes.', hint:'Think of proteins as "construction workers" for the body.', topic:'Protein' },
    { type:'mcq', text:'Deficiency of Vitamin C causes:', options:['Rickets','Scurvy','Night blindness','Anaemia'], correctIndex:1, explanation:'Vitamin C deficiency causes scurvy — a disease marked by bleeding gums and weak joints.', hint:'Sailors in the past got this disease from lack of fresh fruit.', topic:'Vitamins' },
    { type:'fill', text:'The green pigment in leaves that helps in photosynthesis is called _____.', correctAnswer:'chlorophyll', explanation:'Chlorophyll absorbs sunlight and gives leaves their green colour.', hint:'Starts with "chloro" — meaning green.', topic:'Photosynthesis' },
  ],
  'body': [
    { type:'mcq', text:'Which organ pumps blood throughout the body?', options:['Lungs','Liver','Heart','Kidney'], correctIndex:2, explanation:'The heart is a muscular pump that circulates blood through the body.', hint:'It beats about 72 times per minute.', topic:'Circulatory System' },
    { type:'tf',  text:'Human beings have 206 bones in their body.', correctAnswer:true, explanation:'An adult human skeleton has 206 bones. Babies start with around 270 but many fuse as they grow.', hint:'Think about the full skeleton.', topic:'Skeletal System' },
    { type:'mcq', text:'Where does digestion of food begin?', options:['Stomach','Small intestine','Mouth','Large intestine'], correctIndex:2, explanation:'Digestion begins in the mouth with chewing (mechanical) and saliva (chemical).', hint:'The very first step when you eat.', topic:'Digestive System' },
    { type:'mcq', text:'Which gas do we breathe in?', options:['Carbon dioxide','Nitrogen','Oxygen','Hydrogen'], correctIndex:2, explanation:'We inhale oxygen (O₂) which is used in cellular respiration.', hint:'What gas keeps us alive?', topic:'Respiratory System' },
    { type:'fill', text:'The largest organ of the human body is the _____.', correctAnswer:'skin', explanation:'The skin is the largest organ, covering the entire body and protecting internal organs.', hint:'It covers your entire body.', topic:'Human Body' },
  ],
  'materials': [
    { type:'mcq', text:'Which material is the best conductor of electricity?', options:['Wood','Plastic','Rubber','Copper'], correctIndex:3, explanation:'Copper is an excellent conductor of electricity and is used in electric wires.', hint:'Think of what electric wires are made of.', topic:'Conductors and Insulators' },
    { type:'tf',  text:'Glass is transparent.', correctAnswer:true, explanation:'Glass allows light to pass through, making it transparent.', hint:'Can you see through a glass window?', topic:'Properties of Materials' },
    { type:'mcq', text:'Which change is reversible?', options:['Burning paper','Rusting iron','Melting ice','Cooking food'], correctIndex:2, explanation:'Melting ice can be reversed by freezing the water again. The other changes are permanent.', hint:'Which one can go back to its original state?', topic:'Reversible and Irreversible Changes' },
    { type:'mcq', text:'What is the property of iron that makes it useful in making magnets?', options:['Hardness','Magnetic property','Conductivity','Transparency'], correctIndex:1, explanation:'Iron is ferromagnetic — it is attracted to magnets and can be magnetised.', hint:'Iron is affected by a magnet unlike wood or plastic.', topic:'Magnetic Materials' },
    { type:'fill', text:'Water boils at _____ °C at sea level.', correctAnswer:'100', explanation:'Water boils at 100°C (212°F) under standard atmospheric pressure.', hint:'Think of the boiling point of water.', topic:'States of Matter' },
  ],
  /* English Grammar & Vocabulary */
  'english_grammar': [
    { type:'mcq', text:'Which part of speech describes or modifies a noun?', options:['Verb','Adjective','Adverb','Preposition'], correctIndex:1, explanation:'An adjective describes a noun (e.g., "tall tree", "bright star").', hint:'Think of words like "happy", "blue", or "fast".', topic:'Parts of Speech' },
    { type:'tf',  text:'A proper noun must always begin with a capital letter.', correctAnswer:true, explanation:'Proper nouns name specific people, places, or entities (e.g., Delhi, Ravi) and always start with a capital letter.', hint:'Names of people and cities are proper nouns.', topic:'Nouns' },
    { type:'mcq', text:'Identify the verb in: "The clever fox jumped over the fence."', options:['clever','fox','jumped','fence'], correctIndex:2, explanation:'"Jumped" expresses an action, making it the verb of the sentence.', hint:'Which word shows what the fox actually did?', topic:'Verbs' },
    { type:'mcq', text:'Which word is an adverb in: "She sang sweetly at the concert"?', options:['sang','sweetly','concert','She'], correctIndex:1, explanation:'"Sweetly" describes how she sang, modifying the verb "sang".', hint:'Words ending in "-ly" are often adverbs describing actions.', topic:'Adverbs' },
    { type:'fill', text:'The plural of "child" is _____.', correctAnswer:'children', explanation:'"Child" has an irregular plural form: "children".', hint:'Not "childs", think of the plural word used in school.', topic:'Plurals' },
  ],
  'english_vocab': [
    { type:'mcq', text:'What is the synonym of "Courageous"?', options:['Timid','Brave','Cautious','Clever'], correctIndex:1, explanation:'"Courageous" and "Brave" both mean showing courage in the face of danger.', hint:'Someone who has no fear in their heart.', topic:'Synonyms' },
    { type:'tf',  text:'"Ancient" is the antonym of "Modern".', correctAnswer:true, explanation:'"Ancient" means belonging to the very distant past, while "Modern" means recent or present-day.', hint:'Ancient Egypt vs modern cities.', topic:'Antonyms' },
    { type:'mcq', text:'A book of maps is called an:', options:['Encyclopedia','Atlas','Dictionary','Chronicle'], correctIndex:1, explanation:'An atlas is a collection or bound volume of maps.', hint:'Starts with the letter "A".', topic:'Vocabulary' },
    { type:'mcq', text:'Choose the correct prefix to make the opposite of "possible":', options:['un-','dis-','im-','in-'], correctIndex:2, explanation:'The prefix "im-" attaches to "possible" to form "impossible".', hint:'Think of the word "impossible".', topic:'Prefixes and Suffixes' },
    { type:'fill', text:'A person who travels into outer space is called an _____.', correctAnswer:'astronaut', explanation:'An astronaut is trained to travel and work in a spacecraft.', hint:'Starts with "astro-", referring to the stars.', topic:'Word Knowledge' },
  ],
  /* Social Science / History / Geography */
  'earth_geography': [
    { type:'mcq', text:'Which imaginary line divides the Earth into Northern and Southern Hemispheres?', options:['Tropic of Cancer','Prime Meridian','Equator','Arctic Circle'], correctIndex:2, explanation:'The Equator (0° latitude) divides the Earth into the Northern and Southern Hemispheres.', hint:'It lies at 0 degrees latitude around the middle of Earth.', topic:'Latitudes' },
    { type:'tf',  text:'The Earth rotates from West to East on its axis.', correctAnswer:true, explanation:'Earth rotates from West to East, which is why the Sun appears to rise in the East and set in the West.', hint:'Think about where the morning sun rises.', topic:'Earth Motions' },
    { type:'mcq', text:'Which is the largest continent by both area and population?', options:['Africa','North America','Asia','Europe'], correctIndex:2, explanation:'Asia is the largest continent in both land area and population.', hint:'India and China are both in this continent.', topic:'Continents' },
    { type:'mcq', text:'The layer of gases surrounding the Earth is called the:', options:['Hydrosphere','Lithosphere','Biosphere','Atmosphere'], correctIndex:3, explanation:'The atmosphere is the blanket of air and gases surrounding the planet.', hint:'"Atmo" comes from Greek atmos, meaning vapor.', topic:'Realms of Earth' },
    { type:'fill', text:'The largest ocean in the world is the _____ Ocean.', correctAnswer:'pacific', explanation:'The Pacific Ocean is the largest and deepest ocean on Earth.', hint:'Starts with P, covers more area than all land combined.', topic:'Oceans' },
  ],
  'history_civics': [
    { type:'mcq', text:'Who is regarded as the Father of the Indian Constitution?', options:['Mahatma Gandhi','Dr. B. R. Ambedkar','Jawaharlal Nehru','Sardar Patel'], correctIndex:1, explanation:'Dr. Bhimrao Ramji Ambedkar chaired the Drafting Committee of the Indian Constitution.', hint:'He was the chairman of the Drafting Committee.', topic:'Indian Constitution' },
    { type:'tf',  text:'In a democracy, citizens elect their representatives through voting.', correctAnswer:true, explanation:'Democracy means rule by the people through free and fair periodic elections.', hint:'"Demos" means people, "kratos" means power.', topic:'Democratic Government' },
    { type:'mcq', text:'The Indus Valley Civilization was famous for its:', options:['Pyramids','Planned cities and drainage systems','Wooden palaces','Cave paintings only'], correctIndex:1, explanation:'Harappa and Mohenjo-daro featured grid-based town planning and advanced covered drainage.', hint:'Think of the great bath and brick drainage channels.', topic:'Ancient History' },
    { type:'mcq', text:'How many Fundamental Rights are guaranteed by the Indian Constitution?', options:['5','6','7','8'], correctIndex:1, explanation:'The Constitution of India currently guarantees 6 Fundamental Rights to all citizens.', hint:'Right to Equality, Freedom, Religion, Education, etc.', topic:'Civics' },
    { type:'fill', text:'The capital of India is New _____.', correctAnswer:'delhi', explanation:'New Delhi is the national capital of the Republic of India.', hint:'Seat of the Parliament and President\'s house.', topic:'National Symbols' },
  ],
  /* Hindi Vyakaran */
  'hindi_vyakaran': [
    { type:'mcq', text:'किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को क्या कहते हैं?', options:['सर्वनाम','संज्ञा','विशेषण','क्रिया'], correctIndex:1, explanation:'किसी व्यक्ति, स्थान, वस्तु या भाव के नाम को संज्ञा (Noun) कहते हैं।', hint:'जैसे: राम, दिल्ली, पुस्तक।', topic:'संज्ञा' },
    { type:'tf',  text:'"सुख" का विलोम शब्द "दुख" है।', correctAnswer:true, explanation:'सुख और दुख एक-दूसरे के परस्पर विपरीतार्थक (विलोम) शब्द हैं।', hint:'सुख का उल्टा क्या होता है?', topic:'विलोम शब्द' },
    { type:'mcq', text:'जो शब्द संज्ञा के स्थान पर प्रयुक्त होते हैं, उन्हें क्या कहते हैं?', options:['क्रिया','विशेषण','सर्वनाम','अव्यय'], correctIndex:2, explanation:'संज्ञा के स्थान पर आने वाले शब्दों (जैसे: वह, तुम, मैं) को सर्वनाम कहते हैं।', hint:'जैसे: वह, तुम, हम, आप।', topic:'सर्वनाम' },
    { type:'mcq', text:'"सूर्य" का पर्यायवाची शब्द कौन सा है?', options:['चंद्रमा','रवि','तारा','पवन'], correctIndex:1, explanation:'सूर्य के पर्यायवाची शब्द रवि, दिनकर, भानु, भास्कर हैं।', hint:'दिनकर, भानु, भास्कर भी इसके नाम हैं।', topic:'पर्यायवाची शब्द' },
    { type:'fill', text:'काम करने या होने का बोध कराने वाले शब्द को _____ कहते हैं।', correctAnswer:'क्रिया', explanation:'जिस शब्द से किसी काम के करने या होने का बोध हो, उसे क्रिया (Verb) कहते हैं।', hint:'जैसे: पढ़ना, लिखना, खेलना।', topic:'क्रिया' },
  ],
  /* Science: Plants, Animals, Water, Motion */
  'plants': [
    { type:'mcq', text:'Which part of a plant absorbs water and minerals from the soil?', options:['Stem','Leaf','Roots','Flower'], correctIndex:2, explanation:'Roots absorb water and dissolved minerals from the soil and anchor the plant firmly.', hint:'It grows downward into the ground.', topic:'Plant Structure' },
    { type:'tf',  text:'Stomata on leaves help in gas exchange and transpiration.', correctAnswer:true, explanation:'Stomata are tiny pores on leaves that allow carbon dioxide intake and water vapor release.', hint:'Tiny microscopic pores on the underside of leaves.', topic:'Leaves' },
    { type:'mcq', text:'Which part of the plant develops into a fruit after fertilization?', options:['Petal','Ovary','Pollen','Sepal'], correctIndex:1, explanation:'The ovary of the flower swells and ripens into the fruit enclosing seeds.', hint:'The swollen base of the pistil/carpels.', topic:'Flowers and Fruits' },
    { type:'mcq', text:'Plants make food using sunlight, water, and which gas?', options:['Oxygen','Nitrogen','Carbon Dioxide','Helium'], correctIndex:2, explanation:'Plants take in carbon dioxide (CO₂) from the air for photosynthesis.', hint:'The gas exhaled by animals and humans.', topic:'Photosynthesis' },
    { type:'fill', text:'The transfer of pollen grains from anther to stigma is called _____.', correctAnswer:'pollination', explanation:'Pollination is the transfer of pollen that allows flowering plants to reproduce.', hint:'Bees and wind are common agents of this process.', topic:'Plant Reproduction' },
  ],
  'animals': [
    { type:'mcq', text:'Animals that eat only plants are called:', options:['Carnivores','Herbivores','Omnivores','Decomposers'], correctIndex:1, explanation:'Herbivores (like cows, deer, rabbits) eat only plant material.', hint:'"Herba" means grass/plant in Latin.', topic:'Animal Diets' },
    { type:'tf',  text:'Fish breathe through gills by extracting dissolved oxygen from water.', correctAnswer:true, explanation:'Fish use gills filled with blood vessels to extract dissolved oxygen from water.', hint:'Water enters their mouth and exits past their gills.', topic:'Animal Adaptations' },
    { type:'mcq', text:'Which of the following is a cold-blooded animal?', options:['Pigeon','Dog','Frog','Whale'], correctIndex:2, explanation:'Amphibians like frogs and reptiles are ectothermic (cold-blooded) animals.', hint:'It lives both in water and on land.', topic:'Classification' },
    { type:'mcq', text:'The natural home or environment of an animal is known as its:', options:['Territory','Habitat','Sanctuary','Biome'], correctIndex:1, explanation:'A habitat provides an organism with food, water, shelter, and conditions needed to survive.', hint:'Starts with H: where an organism naturally lives.', topic:'Ecology' },
    { type:'fill', text:'Birds have hollow _____ which make their bodies lightweight for flying.', correctAnswer:'bones', explanation:'Pneumatic (hollow) bones allow birds to have high skeletal strength while remaining light enough for flight.', hint:'The hard structural framework inside their wings and body.', topic:'Bird Adaptations' },
  ],
  'motion_force': [
    { type:'mcq', text:'What is the formula to calculate Speed?', options:['Distance × Time','Distance ÷ Time','Time ÷ Distance','Force × Mass'], correctIndex:1, explanation:'Speed is defined as the distance covered per unit of time (Speed = Distance / Time).', hint:'Divide how far you went by how long it took.', topic:'Speed and Motion' },
    { type:'tf',  text:'Friction always opposes the relative motion between two contacting surfaces.', correctAnswer:true, explanation:'Friction is a resistive force that opposes motion between two surfaces sliding against each other.', hint:'It is what makes a sliding ball eventually stop.', topic:'Friction' },
    { type:'mcq', text:'What is the SI unit of force?', options:['Joule','Watt','Newton','Pascal'], correctIndex:2, explanation:'Force is measured in Newtons (N), named after Sir Isaac Newton.', hint:'Named after the English scientist who formulated laws of gravity.', topic:'Units of Force' },
    { type:'mcq', text:'The pull exerted by the Earth on all objects towards its center is called:', options:['Magnetism','Gravity','Electrostatics','Friction'], correctIndex:1, explanation:'Gravity is the attractive force that Earth exerts on all masses.', hint:'What makes an apple fall from a tree to the ground?', topic:'Gravitational Force' },
    { type:'fill', text:'The unit used to measure time in SI standard is _____.', correctAnswer:'second', explanation:'The standard International Unit (SI) for time is the second (s).', hint:'Sixty of these make one minute.', topic:'Measurement of Time' },
  ],
  'light_sound': [
    { type:'mcq', text:'Light travels in a:', options:['Curved path','Straight line','Zig-zag path','Circular loop'], correctIndex:1, explanation:'Light travels in straight lines (rectilinear propagation of light).', hint:'Think about how shadows form when light is blocked.', topic:'Rectilinear Propagation' },
    { type:'tf',  text:'Sound requires a material medium (solid, liquid, or gas) to travel.', correctAnswer:true, explanation:'Sound waves are mechanical vibrations and cannot travel through a vacuum.', hint:'Can sound travel through empty outer space?', topic:'Sound Waves' },
    { type:'mcq', text:'An image formed by a plane mirror is always:', options:['Real and inverted','Virtual and erect','Enlarged','Upside down'], correctIndex:1, explanation:'Plane mirrors form virtual, erect (upright), and laterally inverted images of the same size.', hint:'Look at your reflection in the bathroom mirror.', topic:'Reflection' },
    { type:'mcq', text:'Which of the following is a luminous object?', options:['Moon','Mirror','Sun','Glass window'], correctIndex:2, explanation:'The Sun emits its own light, whereas the Moon only reflects sunlight.', hint:'Which object produces its own light?', topic:'Light Sources' },
    { type:'fill', text:'The bouncing back of light rays from a shiny surface is called _____.', correctAnswer:'reflection', explanation:'Reflection occurs when light strikes a surface and bounces back into the medium.', hint:'Happens when you look into a mirror or calm water.', topic:'Reflection' },
  ],
  'integers_decimals': [
    { type:'mcq', text:'What is (−8) + 15?', options:['−7','7','−23','23'], correctIndex:1, explanation:'(−8) + 15 = 15 − 8 = 7.', hint:'Subtract 8 from 15.', topic:'Integers' },
    { type:'tf',  text:'Zero is greater than every negative integer.', correctAnswer:true, explanation:'0 lies to the right of all negative numbers on the number line, so 0 > any negative number.', hint:'Look at the number line: negatives are to the left of 0.', topic:'Number Line' },
    { type:'mcq', text:'What is 0.75 written as a fraction in simplest form?', options:['75/10','3/4','7/5','1/4'], correctIndex:1, explanation:'0.75 = 75/100 = 3/4 after dividing both numerator and denominator by 25.', hint:'Divide 75 and 100 by 25.', topic:'Decimals to Fractions' },
    { type:'mcq', text:'Which is smaller: −12 or −5?', options:['−12','−5','They are equal','Cannot be determined'], correctIndex:0, explanation:'On the number line, −12 is further to the left than −5, making −12 smaller.', hint:'The further left on the number line, the smaller the number.', topic:'Comparing Integers' },
    { type:'fill', text:'(−5) × (−4) = _____', correctAnswer:'20', explanation:'Multiplying two negative numbers always yields a positive product: (−) × (−) = (+).', hint:'Negative times negative equals positive.', topic:'Integer Multiplication' },
  ],
  'data_handling': [
    { type:'mcq', text:'What is the mean (average) of 4, 8, 12, and 16?', options:['8','10','12','40'], correctIndex:1, explanation:'Sum = 4+8+12+16 = 40. Total count = 4. Mean = 40 ÷ 4 = 10.', hint:'Add all numbers together and divide by 4.', topic:'Arithmetic Mean' },
    { type:'tf',  text:'In a data set, the mode is the number that appears most frequently.', correctAnswer:true, explanation:'Mode is the observation that occurs with the greatest frequency.', hint:'"Mode" sounds like "Most".', topic:'Mode' },
    { type:'mcq', text:'What is the probability of getting heads when tossing a fair coin?', options:['1','1/2','1/4','0'], correctIndex:1, explanation:'A fair coin has 2 equal outcomes (Heads or Tails). Probability of Heads = 1/2.', hint:'One favorable outcome out of two possible outcomes.', topic:'Probability' },
    { type:'mcq', text:'The difference between the highest and lowest values in a data set is the:', options:['Mean','Median','Range','Frequency'], correctIndex:2, explanation:'Range = Maximum Value − Minimum Value.', hint:'How wide does the data spread?', topic:'Range' },
    { type:'fill', text:'A circular graph divided into sectors is called a _____ chart.', correctAnswer:'pie', explanation:'A pie chart represents parts of a whole as proportional sectors of a circle.', hint:'Named after a round baked dessert.', topic:'Graphical Representation' },
  ],
};

/* ─── Question generator — looks up topic-based questions ─────── */
function _getTopicQuestions(levelId, chapterTitle) {
  const title = chapterTitle.toLowerCase();
  
  // Keyword → question bank mapping
  const matches = [
    [['shape', 'space', 'round', 'long', 'brick', 'wheel', 'cart', 'pattern', 'design', 'polygon', 'symmetry'], 'shapes'],
    [['knowing our numbers', 'whole number', 'number', 'counting', 'digit', 'numeral', 'roman', 'factor', 'multiple'], 'numbers'],
    [['addition', 'add', 'give', 'sum', 'plus', 'and take'], 'addition'],
    [['subtraction', 'subtract', 'minus', 'difference'], 'subtraction'],
    [['multiplication', 'multiply', 'times', 'product', 'many times', 'table'], 'multiplication'],
    [['division', 'divide', 'share', 'split', 'divisor'], 'division'],
    [['fraction', 'half', 'quarter', 'halves', 'part'], 'fractions'],
    [['geometry', 'angle', 'triangle', 'quadrilateral', 'perimeter', 'area', 'line', 'circle'], 'geometry'],
    [['measurement', 'length', 'weight', 'capacity', 'measure', 'long and short', 'heavier', 'jug', 'mug', 'time', 'clock', 'calendar'], 'measurement'],
    [['algebra', 'variable', 'expression', 'equation', 'linear'], 'algebra'],
    [['ratio', 'proportion', 'scale', 'unitary'], 'ratio'],
    [['percentage', 'percent', 'discount', 'profit', 'loss', 'interest'], 'percentage'],
    [['integer', 'negative', 'decimal', 'tenths', 'rational'], 'integers_decimals'],
    [['data', 'graph', 'chart', 'mean', 'median', 'mode', 'probability', 'organising'], 'data_handling'],
    [['food', 'nutrition', 'nutrient', 'component of food', 'cooking', 'diet', 'vitamin', 'digest'], 'food'],
    [['body', 'organ', 'bone', 'muscle', 'heart', 'blood', 'lung', 'skeleton', 'movement in animals'], 'body'],
    [['material', 'conductor', 'insulator', 'magnet', 'transparent', 'solid', 'liquid', 'gas', 'substance', 'sorting', 'separation'], 'materials'],
    [['plant', 'leaf', 'flower', 'root', 'tree', 'crop', 'agriculture', 'forest', 'getting to know plants'], 'plants'],
    [['animal', 'habitat', 'living organism', 'wildlife', 'adaptation', 'bird', 'fish', 'insect'], 'animals'],
    [['water', 'air', 'atmosphere', 'weather', 'climate', 'wind', 'storm', 'cyclone', 'pollution', 'environment'], 'water_air'],
    [['light', 'shadow', 'reflection', 'mirror', 'sound', 'vibration', 'echo', 'optics'], 'light_sound'],
    [['electric', 'circuit', 'current', 'switch', 'battery', 'bulb', 'wire'], 'electricity'],
    [['motion', 'force', 'speed', 'distance', 'time and motion', 'friction', 'gravity', 'pressure'], 'motion_force'],
    [['noun', 'verb', 'adjective', 'adverb', 'grammar', 'tense', 'pronoun', 'preposition', 'sentence', 'punctuation', 'clause'], 'english_grammar'],
    [['vocabulary', 'synonym', 'antonym', 'story', 'poem', 'prose', 'reading', 'word', 'comprehension'], 'english_vocab'],
    [['earth', 'globe', 'map', 'continent', 'ocean', 'latitude', 'longitude', 'solar system', 'planet', 'landform', 'geography'], 'earth_geography'],
    [['history', 'civics', 'democracy', 'constitution', 'kingdom', 'empire', 'ruler', 'government', 'panchayat', 'harappa', 'ashoka', 'revolt'], 'history_civics'],
    [['hindi', 'संज्ञा', 'सर्वनाम', 'विशेषण', 'क्रिया', 'विलोम', 'पर्यायवाची', 'व्याकरण', 'भाषा', 'मुहावरे', 'कविता', 'कहानी'], 'hindi_vyakaran'],
  ];

  for (const [keywords, bankKey] of matches) {
    if (keywords.some(kw => title.includes(kw))) {
      const pool = TOPIC_QUESTIONS[bankKey];
      if (pool) return pool.map((q, i) => ({ ...q, id: `${levelId}-q${i+1}` }));
    }
  }
  return null;
}

/* ─── Subject Concept Fallback (Rigorous Curricular Questions) ── */
function _getSubjectFallbackQuestions(levelId, chapterTitle) {
  // Infer academic subject from level ID or keywords
  const isScience = /science|sci|physic|chem|bio|matter|energy|living/i.test(levelId + ' ' + chapterTitle);
  const isSocial  = /social|history|geography|civics|trail|polity/i.test(levelId + ' ' + chapterTitle);
  const isLanguage= /english|hindi|language|story|poem|grammar/i.test(levelId + ' ' + chapterTitle);

  if (isScience) {
    return [
      {
        id:`${levelId}-q1`, type:'mcq',
        text:`In the scientific study of "${chapterTitle}", which method is essential for verifying observations?`,
        options:['Repeated experimentation','Guesswork','Memorizing opinions','Ignoring evidence'],
        correctIndex:0,
        explanation:'Scientific discovery relies on systematic observation and repeatable experiments.',
        hint:'Scientists always test hypotheses through evidence and experiments.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q2`, type:'tf',
        text:`All living organisms require energy to carry out life processes such as growth and repair.`,
        correctAnswer:true,
        explanation:'Energy from food and nutrients fuels all biological processes in living organisms.',
        hint:'Think about why living beings need food and rest.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q3`, type:'mcq',
        text:`Which tool helps scientists observe microscopic details in "${chapterTitle}"?`,
        options:['Telescope','Microscope','Periscope','Barometer'],
        correctIndex:1,
        explanation:'A microscope magnifies minute cells and structures invisible to the naked eye.',
        hint:'"Micro" means extremely small.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q4`, type:'mcq',
        text:`Matter can exist in which three primary states in nature?`,
        options:['Hot, Warm, Cold','Solid, Liquid, Gas','Light, Heavy, Medium','Hard, Soft, Rough'],
        correctIndex:1,
        explanation:'The three fundamental classical states of matter are solid, liquid, and gas.',
        hint:'Think of ice, water, and steam.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q5`, type:'fill',
        text:`The process where green plants synthesize food using sunlight is called _____.`,
        correctAnswer:'photosynthesis',
        explanation:'Photosynthesis is the fundamental bio-chemical process that powers plant life on Earth.',
        hint:'Photo = light, synthesis = building.',
        topic:chapterTitle,
      },
    ];
  }

  if (isSocial) {
    return [
      {
        id:`${levelId}-q1`, type:'mcq',
        text:`When exploring "${chapterTitle}", which source provides primary historical evidence?`,
        options:['Inscriptions and artifacts','Modern comic books','Unverified rumors','Fictional movies'],
        correctIndex:0,
        explanation:'Archaeological artifacts, coins, and stone inscriptions are genuine primary sources.',
        hint:'Things created by people living in ancient times.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q2`, type:'tf',
        text:`Natural resources like fresh water and fertile soil directly influence where human civilizations develop.`,
        correctAnswer:true,
        explanation:'Major ancient civilizations like Harappa, Egypt, and Mesopotamia all developed along fertile river valleys.',
        hint:'Think of why ancient cities were built next to rivers.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q3`, type:'mcq',
        text:`On a map, the standard direction pointing straight upward toward the top margin is:`,
        options:['South','East','North','West'],
        correctIndex:2,
        explanation:'By cartographic convention, the top of a standard map points towards true North.',
        hint:'Think of the compass rose pointing up.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q4`, type:'mcq',
        text:`The system of rules and fundamental laws according to which a nation is governed is called its:`,
        options:['Dictionary','Constitution','Gazette','Treaty'],
        correctIndex:1,
        explanation:'A Constitution is the supreme legal framework defining the governance and rights of citizens.',
        hint:'India adopted its supreme framework on 26 January 1950.',
        topic:chapterTitle,
      },
      {
        id:`${levelId}-q5`, type:'fill',
        text:`The imaginary horizontal lines running parallel to the equator are lines of _____.`,
        correctAnswer:'latitude',
        explanation:'Lines of latitude run east-west parallel to the equator and measure angular distance north or south.',
        hint:'Rhymes with "flatitude".',
        topic:chapterTitle,
      },
    ];
  }

  // Default: Rigorous Mathematical & Quantitative Reasoning
  return [
    {
      id:`${levelId}-q1`, type:'mcq',
      text:`In studying "${chapterTitle}", when evaluating 15 + 5 × 2, the correct result by order of operations (BODMAS) is:`,
      options:['40','25','30','35'],
      correctIndex:1,
      explanation:'Multiplication precedes addition: 5 × 2 = 10; then 15 + 10 = 25.',
      hint:'Perform multiplication before addition according to BODMAS.',
      topic:chapterTitle,
    },
    {
      id:`${levelId}-q2`, type:'tf',
      text:`In mathematics, the sum of any two even numbers is always an even number.`,
      correctAnswer:true,
      explanation:'For any integers 2m and 2n, their sum 2m + 2n = 2(m + n), which is always divisible by 2.',
      hint:'Test with numbers: 4 + 6 = 10, 8 + 2 = 10. Both results are even.',
      topic:chapterTitle,
    },
    {
      id:`${levelId}-q3`, type:'mcq',
      text:`What is the greatest common divisor (GCD / HCF) of 12 and 18?`,
      options:['2','3','6','9'],
      correctIndex:2,
      explanation:'Factors of 12 are {1,2,3,4,6,12} and factors of 18 are {1,2,3,6,9,18}. Highest common is 6.',
      hint:'Find the largest number that divides both 12 and 18 without a remainder.',
      topic:chapterTitle,
    },
    {
      id:`${levelId}-q4`, type:'mcq',
      text:`If a polygon has 5 sides, what is it called?`,
      options:['Hexagon','Pentagon','Octagon','Heptagon'],
      correctIndex:1,
      explanation:'A 5-sided polygon is a pentagon. Hexagon has 6 sides, heptagon 7, octagon 8.',
      hint:'"Penta" is the Greek prefix for five.',
      topic:chapterTitle,
    },
    {
      id:`${levelId}-q5`, type:'fill',
      text:`The perimeter of a regular triangle with each side 7 cm is _____ cm.`,
      correctAnswer:'21',
      explanation:'Perimeter is the total boundary length: 7 + 7 + 7 = 3 × 7 = 21 cm.',
      hint:'Add the three equal sides of the triangle.',
      topic:chapterTitle,
    },
  ];
}

/* ─── Main question getter ───────────────────────────────────── */
export function getQuestionsForLevel(levelId, chapterTitle) {
  /* 1. Prefer hand-authored demo questions */
  if (DEMO_QUESTIONS[levelId]) return DEMO_QUESTIONS[levelId];

  /* 2. Use topic-matched questions from expanded bank */
  const topicQs = _getTopicQuestions(levelId, chapterTitle);
  if (topicQs) return topicQs;

  /* 3. Deep conceptual curricular fallback for the subject */
  return _getSubjectFallbackQuestions(levelId, chapterTitle);
}

/* ─── Gift cards ─────────────────────────────────────────────────── */
export const GIFT_CARDS = [
  { id:'gc-5',  milestone:5,  title:'Knowledge Explorer',   description:'Completed 5 levels! You are officially an explorer!',  rarity:'Common',    color:'#6C5CE7' },
  { id:'gc-10', milestone:10, title:'Number Ninja',         description:'10 levels mastered! Your skills are sharp as a blade!', rarity:'Uncommon',  color:'#0984E3' },
  { id:'gc-15', milestone:15, title:'Science Star',         description:'15 levels conquered! Knowledge is your superpower!',    rarity:'Rare',      color:'#00B894' },
  { id:'gc-20', milestone:20, title:'Curious Inventor',     description:'20 levels! Your curiosity has no limits!',              rarity:'Epic',      color:'#FDCB6E' },
  { id:'gc-25', milestone:25, title:'Master Adventurer',    description:'25 levels! You are a true champion of learning!',       rarity:'Legendary', color:'#E17055' },
];

export const CORRECT_MESSAGES = [
  { title:'Brilliant! 🌟',      message:'You solved it perfectly!'},
  { title:'Amazing! 🎉',        message:'You\'re getting really good at this!'},
  { title:'Superb! 🚀',         message:'Your thinking is spot on!'},
  { title:'Wonderful! ✨',       message:'You discovered something new!'},
  { title:'Excellent! 🏆',      message:'Keep up the fantastic work!'},
  { title:'Outstanding! 🌈',    message:'You\'re a natural explorer!'},
  { title:'Perfect! 💎',        message:'Nothing can stop you now!'},
  { title:'Incredible! 🔥',     message:'Your brain power is amazing!'},
];

export const INCORRECT_MESSAGES = [
  { title:'Nice try! 💪',       message:'Every explorer learns by trying again.'},
  { title:'Almost there! 🤔',   message:'Let\'s look at this clue together.'},
  { title:'Keep going! 🌟',     message:'New discoveries take practice.'},
  { title:'Good effort! 💡',    message:'Let\'s think about this differently.'},
  { title:'Don\'t worry! 🌈',   message:'Even the best explorers take a second look.'},
];
