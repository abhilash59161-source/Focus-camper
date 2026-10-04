import { StudentProfile, StudySession, Subject } from '../types';

export const INDIAN_UNIVERSITY_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Information Technology (IT)',
  'Chemical Engineering',
  'Biotechnology Engineering',
  'Aerospace Engineering',
  'Mathematics & Computing',
  'Commerce & Economics',
  'Basic Sciences & Humanities',
] as const;

export const SUBJECT_COLOR_PRESETS = [
  { name: 'Emerald', hex: '#059669', bgLight: 'bg-emerald-50', textDark: 'text-emerald-700', borderLight: 'border-emerald-200', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800' },
  { name: 'Blue', hex: '#2563eb', bgLight: 'bg-blue-50', textDark: 'text-blue-700', borderLight: 'border-blue-200', badgeBg: 'bg-blue-100', badgeText: 'text-blue-800' },
  { name: 'Amber', hex: '#d97706', bgLight: 'bg-amber-50', textDark: 'text-amber-700', borderLight: 'border-amber-200', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800' },
  { name: 'Purple', hex: '#7c3aed', bgLight: 'bg-purple-50', textDark: 'text-purple-700', borderLight: 'border-purple-200', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800' },
  { name: 'Rose', hex: '#e11d48', bgLight: 'bg-rose-50', textDark: 'text-rose-700', borderLight: 'border-rose-200', badgeBg: 'bg-rose-100', badgeText: 'text-rose-800' },
  { name: 'Indigo', hex: '#4f46e5', bgLight: 'bg-indigo-50', textDark: 'text-indigo-700', borderLight: 'border-indigo-200', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800' },
  { name: 'Teal', hex: '#0d9488', bgLight: 'bg-teal-50', textDark: 'text-teal-700', borderLight: 'border-teal-200', badgeBg: 'bg-teal-100', badgeText: 'text-teal-800' },
  { name: 'Orange', hex: '#ea580c', bgLight: 'bg-orange-50', textDark: 'text-orange-700', borderLight: 'border-orange-200', badgeBg: 'bg-orange-100', badgeText: 'text-orange-800' },
];

export const DEFAULT_INDIAN_SUBJECTS: Subject[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    branch: 'Computer Science & Engineering (CSE)',
    topics: ['Arrays & Strings', 'Linked Lists', 'Binary Trees & BST', 'Dynamic Programming', 'Graph Algorithms', 'Sorting & Searching'],
    code: 'CS201',
    semester: 'Sem 3',
    colorName: 'Emerald',
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    hex: '#059669',
  },
  {
    id: 'maths3',
    name: 'Engineering Mathematics III',
    branch: 'Basic Sciences & Humanities',
    topics: ['Fourier Series', 'Laplace Transforms', 'Partial Differential Equations', 'Complex Variables', 'Probability Distributions'],
    code: 'MA201',
    semester: 'Sem 3',
    colorName: 'Blue',
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-700',
    borderLight: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    hex: '#2563eb',
  },
  {
    id: 'de',
    name: 'Digital Electronics & Logic',
    branch: 'Electronics & Communication Engineering (ECE)',
    topics: ['Boolean Algebra & K-Maps', 'Combinational Circuits', 'Flip Flops & Registers', 'Finite State Machines', 'ADC & DAC Converters'],
    code: 'EC202',
    semester: 'Sem 3',
    colorName: 'Amber',
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-700',
    borderLight: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    hex: '#d97706',
  },
  {
    id: 'thermo',
    name: 'Applied Thermodynamics',
    branch: 'Mechanical Engineering (ME)',
    topics: ['First & Second Laws', 'Rankine & Brayton Cycles', 'Steam Turbines', 'Refrigeration Cycles', 'Psychrometry & Gas Mixtures'],
    code: 'ME203',
    semester: 'Sem 3',
    colorName: 'Purple',
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-700',
    borderLight: 'border-purple-200',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    hex: '#7c3aed',
  },
];

// Branch curriculum templates for Indian universities (AICTE / UGC standard syllabi)
export const BRANCH_STARTER_SUGGESTIONS: Record<string, Array<{ name: string; code: string; semester: string; topics: string[]; colorIdx: number }>> = {
  'Computer Science & Engineering (CSE)': [
    { name: 'Data Structures & Algorithms', code: 'CS201', semester: 'Semester 3', topics: ['Binary Search Trees', 'Dynamic Programming', 'Graph Traversals (BFS/DFS)', 'Greedy Algorithms', 'Sorting & Heaps', 'Recursion & Backtracking'], colorIdx: 0 },
    { name: 'Database Management Systems', code: 'CS301', semester: 'Semester 4', topics: ['SQL Joins & Subqueries', 'Database Normalization (3NF/BCNF)', 'B+ Tree Indexing', 'ACID Transactions & Concurrency', 'ER Modeling & Relational Algebra'], colorIdx: 1 },
    { name: 'Operating Systems', code: 'CS302', semester: 'Semester 4', topics: ['CPU Process Scheduling', 'Deadlock Detection & Prevention', 'Virtual Memory & Paging', 'Semaphore & Inter-process Comm', 'File System Architecture'], colorIdx: 3 },
    { name: 'Computer Networks', code: 'CS303', semester: 'Semester 5', topics: ['OSI 7-Layer & TCP/IP Model', 'IPv4/IPv6 Subnetting & CIDR', 'Routing (OSPF, BGP, RIP)', 'TCP Congestion Control & Flow', 'DNS, HTTP & SSL Protocols'], colorIdx: 4 },
    { name: 'Theory of Computation & Automata', code: 'CS304', semester: 'Semester 5', topics: ['Finite Automata (DFA/NFA)', 'Regular Expressions & Pumping Lemma', 'Context-Free Grammars & Pushdown', 'Turing Machines & Decidability', 'Chomsky Hierarchy'], colorIdx: 2 },
    { name: 'Design & Analysis of Algorithms', code: 'CS305', semester: 'Semester 4', topics: ['Divide & Conquer Analysis', 'Asymptotic Notations (O, Ω, Θ)', 'Shortest Paths (Dijkstra, Bellman-Ford)', 'Minimum Spanning Trees', 'NP-Completeness & Reductions'], colorIdx: 5 },
  ],
  'Information Technology (IT)': [
    { name: 'Object Oriented Programming with Java', code: 'IT201', semester: 'Semester 3', topics: ['Polymorphism & Inheritance', 'Exception Handling & Try-Catch', 'Java Collections Framework', 'Multithreading & Concurrency', 'Streams & Lambda Expressions'], colorIdx: 0 },
    { name: 'Full Stack Web Engineering', code: 'IT301', semester: 'Semester 4', topics: ['DOM Manipulation & ES6+', 'React Hooks & State Management', 'Node.js & Express REST APIs', 'MongoDB & Schema Design', 'JWT Authentication & Security'], colorIdx: 1 },
    { name: 'Cloud Computing & Virtualization', code: 'IT401', semester: 'Semester 6', topics: ['Docker Containers & Microservices', 'Kubernetes Orchestration', 'AWS S3, EC2 & Lambda', 'Virtual Machines & Hypervisors', 'CI/CD Pipelines & DevOps'], colorIdx: 4 },
    { name: 'Cyber Security & Cryptography', code: 'IT302', semester: 'Semester 5', topics: ['Symmetric Encryption (AES/DES)', 'Public Key Cryptography (RSA/ECC)', 'Hash Functions (SHA-256)', 'Firewalls, IDS & IPS', 'Network Penetration & OWASP Top 10'], colorIdx: 5 },
    { name: 'Software Engineering & Agile Methodologies', code: 'IT202', semester: 'Semester 3', topics: ['Agile & Scrum Framework', 'SDLC Models & Sprint Cycles', 'UML Class & Sequence Diagrams', 'Software Testing (Unit, Integration)', 'CI/CD Version Control (Git)'], colorIdx: 6 },
  ],
  'Artificial Intelligence & Data Science (AI & DS)': [
    { name: 'Machine Learning Algorithms', code: 'AI301', semester: 'Semester 4', topics: ['Supervised Learning (Regression, Classification)', 'Gradient Descent Optimization', 'Support Vector Machines (SVM)', 'Decision Trees & Random Forests', 'Model Evaluation & Cross-Validation'], colorIdx: 5 },
    { name: 'Deep Learning & Neural Networks', code: 'AI401', semester: 'Semester 5', topics: ['Backpropagation & Loss Functions', 'Convolutional Neural Networks (CNN)', 'Recurrent Networks (RNN & LSTM)', 'Transformers & Attention Mechanisms', 'Transfer Learning & PyTorch'], colorIdx: 3 },
    { name: 'Data Mining & Statistical Analysis', code: 'DS301', semester: 'Semester 4', topics: ['Exploratory Data Analysis (EDA)', 'Clustering (K-Means & DBSCAN)', 'Dimensionality Reduction (PCA)', 'Association Rule Mining (Apriori)', 'Hypothesis Testing & p-values'], colorIdx: 0 },
    { name: 'Natural Language Processing (NLP)', code: 'AI402', semester: 'Semester 6', topics: ['Tokenization & Stemming', 'TF-IDF & Word2Vec Embeddings', 'Named Entity Recognition (NER)', 'BERT & Large Language Models', 'Sentiment Analysis Pipelines'], colorIdx: 1 },
    { name: 'Big Data Engineering & Analytics', code: 'DS402', semester: 'Semester 6', topics: ['Hadoop Distributed File System (HDFS)', 'Apache Spark & RDD Computing', 'MapReduce Programming Paradigm', 'Data Lakehouse Architecture', 'NoSQL Engines (Cassandra, Neo4j)'], colorIdx: 7 },
  ],
  'Electronics & Communication Engineering (ECE)': [
    { name: 'Digital Electronics & Logic Design', code: 'EC202', semester: 'Semester 3', topics: ['Boolean Algebra & Karnaugh Maps', 'Combinational Multiplexers & Decoders', 'Flip-Flops & Shift Registers', 'Synchronous & Ripple Counters', 'Verilog HDL Hardware Modeling'], colorIdx: 2 },
    { name: 'Signals & Systems', code: 'EC204', semester: 'Semester 3', topics: ['Continuous & Discrete Time Signals', 'Linear Time-Invariant (LTI) Systems', 'Fourier Series & Transform', 'Z-Transform & Region of Convergence', 'Nyquist Sampling Theorem'], colorIdx: 1 },
    { name: 'Analog Electronic Circuits', code: 'EC301', semester: 'Semester 4', topics: ['Operational Amplifier (Op-Amp) Circuits', 'BJT & MOSFET Small-Signal Amplifiers', 'Feedback Amplifiers & Stability', 'Sinusoidal Oscillators (Wien Bridge)', 'Active Filters & Voltage Regulators'], colorIdx: 5 },
    { name: 'Electromagnetic Field Theory & Antennas', code: 'EC303', semester: 'Semester 5', topics: ["Maxwell's Equations in Integral/Diff Form", 'Uniform Plane Wave Propagation', 'Poynting Vector & Energy Flow', 'Transmission Line Impedance Matching', 'Dipole & Patch Antenna Radiation'], colorIdx: 3 },
    { name: 'Microprocessors & Microcontrollers', code: 'EC304', semester: 'Semester 5', topics: ['8086 Architecture & Pin Diagram', 'Assembly Language Programming', 'ARM Cortex-M Embedded Systems', 'Interrupt Controller & Timers', 'SPI, I2C & UART Interfaces'], colorIdx: 7 },
    { name: 'Digital Signal Processing (DSP)', code: 'EC401', semester: 'Semester 6', topics: ['Discrete Fourier Transform (DFT/FFT)', 'FIR Filter Design (Windowing)', 'IIR Filter Design (Bilinear Transformation)', 'Finite Word Length Effects', 'DSP Processors Architecture'], colorIdx: 0 },
  ],
  'Electrical & Electronics Engineering (EEE)': [
    { name: 'Electrical Machines I & II', code: 'EE201', semester: 'Semester 3', topics: ['Single-Phase & Three-Phase Transformers', 'DC Generators & Motor Characteristics', 'Three-Phase Induction Motors', 'Synchronous Alternators & Motors', 'Speed Control of Induction Drives'], colorIdx: 2 },
    { name: 'Power Systems Analysis & Protection', code: 'EE301', semester: 'Semester 5', topics: ['Transmission Line Parameter Modeling', 'Bus Admittance & Load Flow (Gauss-Seidel)', 'Symmetrical & Unsymmetrical Faults', 'Overcurrent & Differential Relays', 'Circuit Breakers & Arc Interruption'], colorIdx: 7 },
    { name: 'Control Systems Engineering', code: 'EE302', semester: 'Semester 4', topics: ['Transfer Function & Block Diagrams', 'Routh-Hurwitz Stability Criterion', 'Root Locus Plotting Techniques', 'Frequency Response & Bode Plots', 'PID Controller Tuning'], colorIdx: 1 },
    { name: 'Power Electronics & Converters', code: 'EE303', semester: 'Semester 5', topics: ['SCR, IGBT & MOSFET Characteristics', 'Controlled Rectifiers (Phase Control)', 'DC-DC Buck & Boost Converters', 'Pulse Width Modulated (PWM) Inverters', 'AC Voltage Controllers & Cycloconverters'], colorIdx: 4 },
    { name: 'Electric Drives & Renewable Energy', code: 'EE401', semester: 'Semester 6', topics: ['Four-Quadrant Motor Drives', 'Solar Photovoltaic Cell Modeling', 'Wind Turbine Induction Generators', 'Grid Integration & Power Quality', 'Electric Vehicle Powertrain Control'], colorIdx: 0 },
  ],
  'Mechanical Engineering (ME)': [
    { name: 'Applied Thermodynamics & Thermal Power', code: 'ME201', semester: 'Semester 3', topics: ['First & Second Laws of Thermodynamics', 'Carnot, Otto & Diesel Cycles', 'Steam Tables & Rankine Superheat Cycle', 'Brayton Gas Turbine Cycle', 'Refrigeration & Heat Pumps'], colorIdx: 3 },
    { name: 'Fluid Mechanics & Hydraulic Machinery', code: 'ME202', semester: 'Semester 3', topics: ['Fluid Statics & Manometry', "Bernoulli's Equation & Pipe Flow", 'Navier-Stokes Equations Intro', 'Pelton, Francis & Kaplan Turbines', 'Centrifugal & Reciprocating Pumps'], colorIdx: 6 },
    { name: 'Strength of Materials & Mechanics', code: 'ME203', semester: 'Semester 4', topics: ['Stress-Strain Relations & Hooke Law', 'Shear Force & Bending Moment Diagrams', 'Torsion in Circular Shafts', 'Deflection of Beams (Macaulay Method)', 'Thin & Thick Cylinders under Pressure'], colorIdx: 4 },
    { name: 'Kinematics & Theory of Machines', code: 'ME301', semester: 'Semester 4', topics: ['Velocity & Acceleration in Mechanisms', 'Cam Profile Generation', 'Spur, Helical & Epicyclic Gear Trains', 'Balancing of Rotating Masses', 'Governors & Flywheel Fluctuation'], colorIdx: 7 },
    { name: 'Heat & Mass Transfer', code: 'ME302', semester: 'Semester 5', topics: ['Fourier Law of Conduction', 'Newton Law of Cooling & Free Convection', 'Forced Convection Heat Transfer', 'Radiation Blackbody Laws & View Factors', 'Heat Exchanger LMTD & NTU Methods'], colorIdx: 0 },
    { name: 'Manufacturing Processes & Machine Tools', code: 'ME303', semester: 'Semester 5', topics: ['Sand Casting & Gating System Design', 'Arc & Resistance Welding Metallurgy', 'Metal Forming (Rolling, Extrusion, Forging)', 'Orthogonal Metal Cutting & Tool Wear', 'CNC Machining & G-Code Programming'], colorIdx: 1 },
  ],
  'Civil Engineering (CE)': [
    { name: 'Structural Analysis I & II', code: 'CE201', semester: 'Semester 3', topics: ['Determinate & Indeterminate Trusses', 'Slope Deflection Method', 'Moment Distribution Method (Hardy Cross)', 'Influence Lines for Moving Loads', 'Matrix Flexibility & Stiffness Methods'], colorIdx: 1 },
    { name: 'Geotechnical Engineering & Soil Mechanics', code: 'CE202', semester: 'Semester 4', topics: ['Index Properties of Soils & Atterberg Limits', 'Permeability & Darcy Law', 'Compaction & Consolidation Theory', 'Shear Strength (Mohr-Coulomb)', 'Terzaghi Bearing Capacity of Foundations'], colorIdx: 2 },
    { name: 'Surveying & Geomatics', code: 'CE203', semester: 'Semester 3', topics: ['Levelling, Contouring & Curvature Correction', 'Theodolite Traversing & Error Adjustment', 'Total Station Principles & EDM', 'Curves Setting (Circular & Transition)', 'GPS, Photogrammetry & GIS Cartography'], colorIdx: 0 },
    { name: 'Design of Reinforced Concrete Structures (RCC)', code: 'CE301', semester: 'Semester 5', topics: ['Limit State Method (IS 456:2000)', 'Singly & Doubly Reinforced Beams', 'Shear, Bond & Development Length', 'One-Way & Two-Way Slab Design', 'Axially Loaded Short & Slender Columns'], colorIdx: 4 },
    { name: 'Hydrology & Water Resources Engineering', code: 'CE302', semester: 'Semester 5', topics: ['Precipitation & Rain Gauge Networks', 'Unit Hydrograph Theory', 'Infiltration & Evapotranspiration', 'Gravity Dams & Spillway Design', 'Canal Design & Lacey Silt Theory'], colorIdx: 6 },
    { name: 'Transportation & Highway Engineering', code: 'CE303', semester: 'Semester 6', topics: ['Highway Geometric Design & Sight Distances', 'Pavement Design (IRC Guidelines)', 'Traffic Flow Characteristics & Signal Timing', 'Bituminous Mix Design & CBR Test', 'Airport Runway Orientation & Taxiways'], colorIdx: 7 },
  ],
  'Chemical Engineering': [
    { name: 'Chemical Process Calculations (Stoichiometry)', code: 'CH201', semester: 'Semester 3', topics: ['Material Balances without Reactions', 'Material Balances with Recycle & Bypass', 'Combustion Calculations & Orsat Analysis', 'Energy Balances & Heat of Formation', 'Humidity Charts & Psychrometric Analysis'], colorIdx: 7 },
    { name: 'Fluid Flow & Particle Operations', code: 'CH202', semester: 'Semester 3', topics: ['Newtonian & Non-Newtonian Fluid Flow', 'Boundary Layer in Pipes & Pressure Drop', 'Pumps & Compressors in Chemical Plants', 'Screening, Crushing & Grinding Laws', 'Filtration, Sedimentation & Centrifugation'], colorIdx: 6 },
    { name: 'Heat Transfer in Process Industries', code: 'CH301', semester: 'Semester 4', topics: ['Conduction in Composite Walls', 'Heat Transfer Coefficients in Pipes', 'Shell & Tube Heat Exchangers (TEMA)', 'Boiling & Condensation Regimes', 'Multi-Effect Evaporator Design'], colorIdx: 0 },
    { name: 'Mass Transfer Operations I & II', code: 'CH302', semester: 'Semester 5', topics: ["Fick's Diffusion Law & Mass Flux", 'Gas Absorption & Packed Column Height', 'McCabe-Thiele Method for Distillation', 'Liquid-Liquid Extraction & Ternary Diagrams', 'Drying Curves & Rate Calculations'], colorIdx: 1 },
    { name: 'Chemical Reaction Engineering', code: 'CH303', semester: 'Semester 5', topics: ['Kinetics of Homogeneous Reactions', 'Ideal Batch, CSTR & PFR Reactors', 'Multiple Reactions & Yield Optimization', 'Temperature & Pressure Effects', 'Heterogeneous Catalysis & Effectiveness Factor'], colorIdx: 4 },
  ],
  'Biotechnology Engineering': [
    { name: 'Biochemistry & Enzymology', code: 'BT201', semester: 'Semester 3', topics: ['Amino Acids & Protein Secondary Structure', 'Carbohydrate Metabolism & Glycolysis', 'Lipid Biosynthesis & Beta Oxidation', 'Michaelis-Menten Enzyme Kinetics', 'Enzyme Inhibition (Competitive/Non-comp)'], colorIdx: 0 },
    { name: 'Molecular Biology & Genetics', code: 'BT202', semester: 'Semester 3', topics: ['DNA Replication in Prokaryotes & Eukaryotes', 'Transcription & RNA Polymerases', 'Genetic Code & Translation Mechanism', 'Gene Regulation & Lac Operon', 'Mendelian Genetics & Chromosomal Linkage'], colorIdx: 5 },
    { name: 'Bioprocess Engineering & Fermentation', code: 'BT301', semester: 'Semester 4', topics: ['Microbial Growth Kinetics (Monod Model)', 'Bioreactor Design (Stirred Tank, Airlift)', 'Sterilization of Media & Air', 'Aeration & Oxygen Transfer Rate (kLa)', 'Scale-Up Criteria in Fermentation'], colorIdx: 1 },
    { name: 'Genetic Engineering & Recombinant DNA', code: 'BT302', semester: 'Semester 5', topics: ['Restriction Endonucleases & Ligases', 'Plasmids, Bacteriophages & Expression Vectors', 'Polymerase Chain Reaction (PCR & qPCR)', 'cDNA Library Construction', 'CRISPR-Cas9 Gene Editing Principles'], colorIdx: 4 },
    { name: 'Immunology & Cell Biology', code: 'BT303', semester: 'Semester 5', topics: ['Innate & Adaptive Immunity Components', 'Antibody Structure & Isotypes', 'Major Histocompatibility Complex (MHC)', 'ELISA, Western Blotting & Flow Cytometry', 'Cell Signaling Pathways & Apoptosis'], colorIdx: 3 },
  ],
  'Aerospace Engineering': [
    { name: 'Incompressible & Compressible Aerodynamics', code: 'AE201', semester: 'Semester 3', topics: ['Potential Flow Theory & Vortex Theorems', 'Kutta-Joukowski Airfoil Lift Theorem', 'Prandtl Lifting-Line Wing Theory', 'Normal & Oblique Shock Waves', 'Prandtl-Meyer Expansion Fans'], colorIdx: 1 },
    { name: 'Aerospace Structures & Materials', code: 'AE202', semester: 'Semester 4', topics: ['Thin-Walled Aircraft Beam Bending', 'Shear Flow in Open & Closed Sections', 'Structural Buckling of Stiffened Panels', 'Carbon Fiber Composite Laminates', 'Fatigue Life & Damage Tolerance'], colorIdx: 4 },
    { name: 'Aircraft Propulsion & Jet Engines', code: 'AE301', semester: 'Semester 5', topics: ['Brayton Cycle for Turbojets & Turbofans', 'Inlet Diffuser & Nozzle Dynamics', 'Axial Compressors & Cascade Aerodynamics', 'Combustor Chambers & Flame Stabilization', 'Rocket Propulsion & Tsiolkovsky Equation'], colorIdx: 7 },
    { name: 'Flight Mechanics & Aircraft Stability', code: 'AE302', semester: 'Semester 5', topics: ['Aircraft Equations of Motion', 'Longitudinal Static Stability & Neutral Point', 'Lateral-Directional Static Stability', 'Dutch Roll & Phugoid Dynamic Modes', 'Control Surfaces (Elevators, Ailerons, Rudder)'], colorIdx: 3 },
    { name: 'Space Flight & Orbital Mechanics', code: 'AE401', semester: 'Semester 6', topics: ["Kepler's Laws & Orbit Determination", 'Hohmann Transfer & Orbital Maneuvers', 'Interplanetary Trajectory & Gravity Assists', "Lagrange Points & Three-Body Problem", 'Spacecraft Attitude Control & Reaction Wheels'], colorIdx: 0 },
  ],
  'Mathematics & Computing': [
    { name: 'Discrete Mathematics & Graph Theory', code: 'MC201', semester: 'Semester 3', topics: ['Propositional & Predicate Logic', 'Recurrence Relations & Generating Functions', 'Trees, Euler & Hamiltonian Graphs', 'Graph Colorings & Planarity', 'Group Theory & Algebraic Structures'], colorIdx: 0 },
    { name: 'Linear Algebra & Numerical Methods', code: 'MC202', semester: 'Semester 3', topics: ['Vector Spaces, Subspaces & Basis', 'Eigenvalues, Eigenvectors & Diagonalization', 'Singular Value Decomposition (SVD)', 'Newton-Raphson & Root Finding', 'Numerical Integration (Simpson & Gauss)'], colorIdx: 1 },
    { name: 'Probability Theory & Stochastic Processes', code: 'MC301', semester: 'Semester 4', topics: ['Random Variables & Joint Distributions', 'Expectation, Variance & Covariance', 'Central Limit Theorem & Chebyshev Inequality', 'Discrete Markov Chains & Transition Matrices', 'Poisson & Brownian Motion Processes'], colorIdx: 3 },
    { name: 'Optimization Techniques & Operations Research', code: 'MC302', semester: 'Semester 5', topics: ['Linear Programming & Simplex Algorithm', 'Duality Theory & Sensitivity Analysis', 'Non-Linear Optimization (KKT Conditions)', 'Integer Programming & Branch-and-Bound', 'Dynamic Programming in Decision Science'], colorIdx: 5 },
    { name: 'Scientific Computing & Simulation', code: 'MC401', semester: 'Semester 6', topics: ['Finite Difference Methods for PDEs', 'Monte Carlo Simulation Methods', 'Fast Fourier Transform Algorithms', 'Sparse Matrix Solvers & Preconditioning', 'Parallel Computing with MPI/OpenMP'], colorIdx: 4 },
  ],
  'Commerce & Economics': [
    { name: 'Financial Accounting & Reporting Standards', code: 'COM201', semester: 'Semester 3', topics: ['Accounting Principles & Double Entry', 'Preparation of Financial Statements', 'Depreciation & Inventory Valuation', 'Cash Flow Statements (AS-3 / Ind AS 7)', 'Corporate Financial Disclosures'], colorIdx: 0 },
    { name: 'Managerial Economics & Market Structures', code: 'COM202', semester: 'Semester 3', topics: ['Demand Forecasting & Elasticity of Demand', 'Production Functions & Laws of Returns', 'Cost Concepts & Break-Even Analysis', 'Perfect Competition & Monopoly Pricing', 'Oligopoly & Game Theory Basics'], colorIdx: 1 },
    { name: 'Cost & Management Accounting', code: 'COM301', semester: 'Semester 4', topics: ['Cost Sheet Preparation & Job Costing', 'Marginal Costing & CVP Analysis', 'Standard Costing & Variance Analysis', 'Budgetary Control & Zero-Based Budgeting', 'Activity-Based Costing (ABC)'], colorIdx: 2 },
    { name: 'Direct & Indirect Taxation (GST)', code: 'COM302', semester: 'Semester 5', topics: ['Income Tax Heads (Salary, Business, Capital Gains)', 'Deductions under Chapter VI-A', 'GST Architecture & CGST/SGST/IGST', 'Input Tax Credit (ITC) Mechanism', 'Tax E-filing & TDS Assessment'], colorIdx: 7 },
    { name: 'Financial Management & Capital Budgeting', code: 'COM401', semester: 'Semester 6', topics: ['Time Value of Money (PV & FV)', 'Capital Budgeting (NPV, IRR, Payback)', 'Cost of Capital (WACC Calculation)', 'Capital Structure Theories (MM Model)', 'Working Capital Management Strategies'], colorIdx: 4 },
  ],
  'Basic Sciences & Humanities': [
    { name: 'Engineering Mathematics I & Calculus', code: 'MA101', semester: 'Semester 1', topics: ['Matrices, Rank & Cayley-Hamilton Theorem', 'Differential Calculus & Mean Value Theorems', 'Partial Derivatives & Jacobians', 'Multiple Integrals (Double & Triple)', 'Vector Calculus (Gradient, Divergence, Curl)'], colorIdx: 1 },
    { name: 'Engineering Physics & Quantum Mechanics', code: 'PH101', semester: 'Semester 1', topics: ['Interference & Diffraction of Light', 'Laser Principles & Optical Fibers', 'Wave-Particle Duality & De Broglie Waves', "Schrodinger's Wave Equation", 'Superconductivity & Nanomaterials'], colorIdx: 3 },
    { name: 'Engineering Chemistry & Material Science', code: 'CH101', semester: 'Semester 1', topics: ['Water Technology & Hardness Removal', 'Corrosion Science & Protection Methods', 'Polymers & Composite Materials', 'Spectroscopic Techniques (UV-Vis, IR)', 'Battery Technologies & Fuel Cells'], colorIdx: 6 },
    { name: 'Programming for Problem Solving (C Language)', code: 'CS101', semester: 'Semester 2', topics: ['Variables, Data Types & Operators', 'Conditional Statements & Loops in C', 'Functions & Parameter Passing', 'Pointers & Dynamic Memory Allocation', 'Arrays, Strings & File Handling'], colorIdx: 0 },
    { name: 'Basic Electrical & Electronics Engineering', code: 'EE101', semester: 'Semester 2', topics: ["Kirchhoff's Laws & Network Theorems", 'AC Circuits, Power Factor & Resonance', 'Single-Phase Transformer Operation', 'PN Junction Diode & Zener Regulator', 'Bipolar Junction Transistor (BJT) Modes'], colorIdx: 2 },
    { name: 'Engineering Mechanics & Statics', code: 'ME101', semester: 'Semester 2', topics: ['Coplanar Force Systems & Equilibrium', 'Centroids & Moment of Inertia', 'Analysis of Simple Pin-Jointed Trusses', 'Friction Laws & Ladder/Wedge Problems', 'Kinematics of Particles & D-Alembert Principle'], colorIdx: 4 },
  ],
};

const PROFILE_KEY = 'focuscampus_user_profile';
const SESSIONS_KEY = 'focuscampus_study_sessions';
const SUBJECTS_KEY = 'focuscampus_subjects';
const CELEBRATED_KEY = 'focuscampus_celebrated_dates';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatMinutesToHoursMinutes = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
};

// Storage Accessors
export const getStoredProfile = (): StudentProfile | null => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveProfile = (profile: StudentProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const clearProfile = (): void => {
  localStorage.removeItem(PROFILE_KEY);
};

// Requirement: "give all the plans zero first. after the login of user they will create their own topics and subjects."
// Returns empty array [] initially if user has not yet created subjects!
export const getStoredSubjects = (): Subject[] => {
  try {
    const data = localStorage.getItem(SUBJECTS_KEY);
    if (data) {
      const parsed: Subject[] = JSON.parse(data);
      // Ensure backward compatibility with topics array
      return parsed.map((s) => ({
        ...s,
        topics: Array.isArray(s.topics) ? s.topics : [],
      }));
    }
  } catch {
    // Fallback
  }
  // All plans start at zero first! No pre-populated subjects until user creates them.
  return [];
};

export const saveCustomSubject = (subject: Subject): Subject[] => {
  const subjects = getStoredSubjects();
  const sanitizedSubject: Subject = {
    ...subject,
    topics: Array.isArray(subject.topics) ? subject.topics : [],
  };
  const existing = subjects.findIndex((s) => s.id === sanitizedSubject.id);
  let updated: Subject[];
  if (existing >= 0) {
    updated = [...subjects];
    updated[existing] = sanitizedSubject;
  } else {
    updated = [sanitizedSubject, ...subjects];
  }
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteSubject = (subjectId: string): Subject[] => {
  const subjects = getStoredSubjects();
  const updated = subjects.filter((s) => s.id !== subjectId);
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
  return updated;
};

export const addTopicToSubject = (subjectId: string, topicName: string): Subject[] => {
  const subjects = getStoredSubjects();
  const trimmed = topicName.trim();
  if (!trimmed) return subjects;

  const updated = subjects.map((sub) => {
    if (sub.id === subjectId) {
      const currentTopics = Array.isArray(sub.topics) ? sub.topics : [];
      if (!currentTopics.includes(trimmed)) {
        return {
          ...sub,
          topics: [...currentTopics, trimmed],
        };
      }
    }
    return sub;
  });

  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
  return updated;
};

export const removeTopicFromSubject = (subjectId: string, topicToRemove: string): Subject[] => {
  const subjects = getStoredSubjects();
  const updated = subjects.map((sub) => {
    if (sub.id === subjectId) {
      const currentTopics = Array.isArray(sub.topics) ? sub.topics : [];
      return {
        ...sub,
        topics: currentTopics.filter((t) => t !== topicToRemove),
      };
    }
    return sub;
  });

  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
  return updated;
};

// Bulk import selected subjects and syllabus topics
export const bulkImportSubjects = (newSubjectsList: Subject[]): Subject[] => {
  const existing = getStoredSubjects();
  const existingMap = new Map<string, Subject>();
  existing.forEach((s) => existingMap.set(s.name.trim().toLowerCase(), s));

  const toAdd: Subject[] = [];

  newSubjectsList.forEach((sub) => {
    const key = sub.name.trim().toLowerCase();
    if (existingMap.has(key)) {
      // If subject with same name exists, merge any new syllabus topics
      const existingSub = existingMap.get(key)!;
      const combinedTopics = Array.from(
        new Set([...(existingSub.topics || []), ...(sub.topics || [])])
      );
      existingSub.topics = combinedTopics;
    } else {
      toAdd.push({
        ...sub,
        id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        topics: Array.isArray(sub.topics) ? sub.topics : [],
      });
    }
  });

  const merged = [...toAdd, ...existing];
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(merged));
  return merged;
};

// Helper for Indian students to quick-import suggested subjects with syllabus topics for their branch
export const seedBranchSuggestedSubjects = (branchName: string): Subject[] => {
  const existing = getStoredSubjects();
  const suggestions = BRANCH_STARTER_SUGGESTIONS[branchName] || BRANCH_STARTER_SUGGESTIONS['Computer Science & Engineering (CSE)'];

  const newSubjects: Subject[] = suggestions.map((s, idx) => {
    const color = SUBJECT_COLOR_PRESETS[s.colorIdx % SUBJECT_COLOR_PRESETS.length];
    return {
      id: `sub_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      name: s.name,
      branch: branchName,
      code: s.code,
      semester: 'Semester 3',
      topics: [...s.topics],
      colorName: color.name,
      bgLight: color.bgLight,
      textDark: color.textDark,
      borderLight: color.borderLight,
      badgeBg: color.badgeBg,
      badgeText: color.badgeText,
      hex: color.hex,
    };
  });

  const merged = [...newSubjects, ...existing];
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(merged));
  return merged;
};

// Requirement: "give all the plans zero first" -> Return empty array [] initially!
export const getStoredSessions = (userEmail?: string): StudySession[] => {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (data) {
      const parsed: StudySession[] = JSON.parse(data);
      if (userEmail) {
        return parsed.filter((s) => !s.userId || s.userId === userEmail);
      }
      return parsed;
    }
  } catch {
    // Fallback
  }

  // All plans start at zero first
  return [];
};

export const saveSession = (session: Omit<StudySession, 'id' | 'createdAt' | 'cloudSynced'>): StudySession => {
  const existing = getStoredSessions();
  const newSession: StudySession = {
    ...session,
    id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    cloudSynced: true,
  };

  const updated = [newSession, ...existing];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  return newSession;
};

export const updateSession = (updatedSession: StudySession): StudySession[] => {
  const existing = getStoredSessions();
  const updated = existing.map((s) => (s.id === updatedSession.id ? { ...updatedSession, cloudSynced: true } : s));
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteSession = (sessionId: string): StudySession[] => {
  const existing = getStoredSessions();
  const updated = existing.filter((s) => s.id !== sessionId);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  return updated;
};

// Celebration milestone check
export const hasCelebratedToday = (dateStr: string): boolean => {
  try {
    const dates = JSON.parse(localStorage.getItem(CELEBRATED_KEY) || '[]');
    return Array.isArray(dates) && dates.includes(dateStr);
  } catch {
    return false;
  }
};

export const markCelebratedToday = (dateStr: string): void => {
  try {
    const dates = JSON.parse(localStorage.getItem(CELEBRATED_KEY) || '[]');
    if (!dates.includes(dateStr)) {
      dates.push(dateStr);
      localStorage.setItem(CELEBRATED_KEY, JSON.stringify(dates));
    }
  } catch {
    localStorage.setItem(CELEBRATED_KEY, JSON.stringify([dateStr]));
  }
};

// Analytics & Aggregations
export const calculateTodayStats = (sessions: StudySession[], dailyGoalMinutes: number) => {
  const today = getTodayDateString();
  const todaySessions = sessions.filter((s) => s.date === today);
  const totalMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const percentageGoal = dailyGoalMinutes > 0 ? Math.round((totalMinutes / dailyGoalMinutes) * 100) : 0;

  return {
    date: today,
    totalMinutes,
    totalHoursFormatted: (totalMinutes / 60).toFixed(1),
    sessionsCount: todaySessions.length,
    percentageGoal,
    remainingMinutes: Math.max(0, dailyGoalMinutes - totalMinutes),
    goalReached: totalMinutes >= dailyGoalMinutes && dailyGoalMinutes > 0,
    todaySessions,
  };
};

export const calculateCurrentWeekStats = (sessions: StudySession[]) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const mondayStr = monday.toISOString().split('T')[0];
  const sundayStr = sunday.toISOString().split('T')[0];

  const weekSessions = sessions.filter((s) => s.date >= mondayStr && s.date <= sundayStr);
  const totalMinutes = weekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const activeDates = new Set(weekSessions.map((s) => s.date));

  return {
    startDateStr: mondayStr,
    endDateStr: sundayStr,
    formattedRange: `${monday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    totalMinutes,
    totalHours,
    sessionsCount: weekSessions.length,
    activeDaysCount: activeDates.size,
    weekSessions,
  };
};

export const calculateCurrentMonthStats = (sessions: StudySession[]) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const startStr = startOfMonth.toISOString().split('T')[0];
  const endStr = endOfMonth.toISOString().split('T')[0];

  const monthSessions = sessions.filter((s) => s.date >= startStr && s.date <= endStr);
  const totalMinutes = monthSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return {
    monthName,
    totalMinutes,
    totalHours,
    sessionsCount: monthSessions.length,
    daysInMonth: endOfMonth.getDate(),
    monthSessions,
  };
};

export const calculateSubjectBreakdown = (sessions: StudySession[], subjects: Subject[]) => {
  const subjectMap = new Map<string, Subject>();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  const totals: Record<string, { minutes: number; name: string; branch?: string; subjectId: string }> = {};

  let overallMinutes = 0;
  sessions.forEach((s) => {
    overallMinutes += s.durationMinutes;
    if (!totals[s.subjectId]) {
      const foundSub = subjectMap.get(s.subjectId);
      totals[s.subjectId] = {
        subjectId: s.subjectId,
        name: s.subjectName || foundSub?.name || 'Other',
        branch: s.subjectBranch || foundSub?.branch || '',
        minutes: 0,
      };
    }
    totals[s.subjectId].minutes += s.durationMinutes;
  });

  return Object.values(totals)
    .map((item) => {
      const subject = subjectMap.get(item.subjectId);
      const percentage = overallMinutes > 0 ? Math.round((item.minutes / overallMinutes) * 100) : 0;
      return {
        subjectId: item.subjectId,
        subjectName: item.name,
        branch: item.branch || subject?.branch || '',
        minutes: item.minutes,
        hoursFormatted: (item.minutes / 60).toFixed(1),
        percentage,
        colorHex: subject?.hex || '#2563eb',
        bgLight: subject?.bgLight || 'bg-slate-50',
        textDark: subject?.textDark || 'text-slate-700',
        badgeBg: subject?.badgeBg || 'bg-slate-100',
        badgeText: subject?.badgeText || 'text-slate-800',
      };
    })
    .sort((a, b) => b.minutes - a.minutes);
};

export const calculateLast7DaysActivity = (sessions: StudySession[], dailyGoalMinutes: number) => {
  const days: { dayName: string; shortDate: string; date: string; minutes: number; percentage: number; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;

    const dayMinutes = sessions.filter((s) => s.date === dateStr).reduce((acc, s) => acc + s.durationMinutes, 0);

    const percentage = dailyGoalMinutes > 0 ? Math.min(100, Math.round((dayMinutes / dailyGoalMinutes) * 100)) : 0;

    days.push({
      dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      shortDate: d.toLocaleDateString('en-IN', { month: 'numeric', day: 'numeric' }),
      date: dateStr,
      minutes: dayMinutes,
      percentage,
      isToday,
    });
  }

  return days;
};

export const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  const dates = new Set(sessions.map((s) => s.date));
  let streak = 0;
  const checkDate = new Date();

  const todayStr = checkDate.toISOString().split('T')[0];
  if (!dates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const str = checkDate.toISOString().split('T')[0];
    if (dates.has(str)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
