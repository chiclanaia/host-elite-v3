-- Update Features from specs.csv (Auto-generated)


INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_00_CONSULT',
    NULL,
    'DIM_FINANCE',
    'PH_1_INVEST',
    'GLOBAL',
    'Investment Thesis Advisor',
    'Strategic consultative onboarding for investors',
    'A multi-step consultative engine that evaluates the host''s fiscal residence vs. the target property''s location. TIER 3 acts as a Virtual Banker providing amenity-based price biasing and non-resident banking constraints.',
    '1. Pedagogical Objective: Strategy precedes math. Beginners look for ''properties''; experts build ''theses''. This module coaches the user to define their Investor Profile (Tax Residency, Available Capital, Setting) before looking at assets. It teaches how residency-to-asset tax treaties and LTV (Loan-to-Value) limits are the primary drivers of cross-border success. 2. Behavior Matrix: TIER_0: Basic profile setup. TIER_1 (Bronze): Single-project thesis with regional price hints. TIER_2 (Silver): ''Asset Ecosystem'' selector (Urban, Ski, Coastal, Rural) with automated price adjustments. TIER_3 (Gold): Virtual Investment Banker. Integrates non-resident banking constraints (e.g., 60% LTV) and generates a ''Strategic Investment Thesis'' PDF. 3. User Journey & UI: Input: ''Where do you pay taxes?'' -> ''Select Ecosystem''. Logic: Cross-references residency-to-asset tax treaties. Output: ''Feasibility Radar Chart'' and Affordability Envelope. Coach: ''The Non-Resident Trap''—warning on equity requirements. 4. Business Logic: RG-01: TIER_3 for cross-border logic. RG-02: Trigger ''Amenity Bias'' logic based on ecosystem.

Functional Specification: Consultative State-Machine. TIER_1: Lookup public price-per-sqm. TIER_2: Build a ''Weighted Ecosystem Engine'' applying coefficients (e.g., Ski Resort = +40% in Winter). TIER_3: Develop ''Lending Logic''. VISUAL REQUIREMENT: Generate a ''Feasibility Radar Chart'' scoring the project on 5 axes: Cashflow, Appreciation, Regulation, Financing, and Tax Efficiency. Output a LaTeX ''Strategic Thesis Report'' with visual ecosystem maps.',
    'TIER_0: Basic profile setup. TIER_1 (Bronze): Single-project thesis with regional price hints. TIER_2 (Silver): ''Asset Ecosystem'' selector (Urban, Ski, Coastal, Rural) with automated price adjustments. TIER_3 (Gold): Virtual Investment Banker. Integrates non-resident banking constraints (e.g., 60% LTV) and generates a ''Strategic Investment Thesis'' PDF.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_01',
    'FIN_00_CONSULT',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'GLOBAL',
    'ROI & Cashflow Architect',
    'Professional financial modeling and reporting engine',
    'A high-precision engine translating the Thesis into a detailed financial roadmap. TIER 3 generates ''Investor-Grade'' 10-year P&L reports and debt coverage analysis.',
    '1. Pedagogical Objective: Cash flow is the business''s heartbeat. Experts see monthly struggle; beginners see yearly totals. This tool teaches ''Seasonal Liquidity'' and the importance of the Debt Coverage Ratio (DCR). 2. Behavior Matrix: TIER_0: Annual totals. TIER_1 (Bronze): Monthly cashflow grid for one unit. TIER_2 (Silver): Portfolio-wide Seasonality Modeling (e.g., High Winter for Ski). TIER_3 (Gold): Professional Analysis. Full 10-year projection including Exit IRR and bank-ready PDF reports. 3. User Journey & UI: Input: Expenses + Loan terms. Logic: Monthly cashflow with seasonal weights. Output: Dynamic ''Cashflow Waterfall'' and NPV charts. Coach: ''The Seasonal Buffer'' tip. 4. Business Logic: RG-01: TIER_3 for ''Investment Grade Report''. RG-02: Ingest ''Amenity Premium'' from FIN_00_CONSULT.

Functional Specification: Professional P&L Engine. TIER_1: Annual math. TIER_2: Develop ''Seasonality Logic'' with monthly multipliers. TIER_3: Build a ''Bank-Ready PDF Engine''. VISUAL REQUIREMENT: Generate a ''Monthly Cashflow Heatmap'' (Red for negative months, Green for positive) to visually highlight liquidity gaps. Include a ''10-Year Wealth Accumulation'' Area Chart showing Debt Paydown vs. Asset Appreciation.',
    'TIER_0: Annual totals. TIER_1 (Bronze): Monthly cashflow grid for one unit. TIER_2 (Silver): Portfolio-wide Seasonality Modeling (e.g., High Winter for Ski). TIER_3 (Gold): Professional Analysis. Full 10-year projection including Exit IRR and bank-ready PDF reports.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_00',
    NULL,
    'DIM_LEGAL',
    'PH_1_INVEST',
    'GLOBAL',
    'Compliance & Banking Sentinel',
    'Strategic constraint and regulatory monitor',
    'Monitors zoning, registration laws, and local banking restrictions. TIER 3 tracks municipal decree shifts and non-resident lending appetite.',
    '1. Pedagogical Objective: Clear the hurdles early. You can''t buy what you can''t fund or register. This teaches the user to identify ''Deal-Killers'' (STR bans or Banking boycotts). 2. Behavior Matrix: TIER_0: Static STR law summary. TIER_1 (Bronze): City-level license check. TIER_2 (Silver): ''Banking Climate'' monitor. TIER_3 (Gold): ''Sentinel'' mode. Aggregates municipal decree changes and flags condo-level STR ban risks. 3. User Journey & UI: Input: City + Neighborhood. Logic: Geo-spatial check. Output: ''Regulatory Risk Gauge''. Coach: ''The Aparthotel Strategy''. 4. Business Logic: RG-01: TIER_2 for Banking insight. RG-02: TIER_3 for real-time gazette scraping.

Functional Specification: Regulatory/Financial Constraint Service. TIER_1: Map portals. TIER_2: Implement ''Banking Appetite'' index. TIER_3: Build ''Gazette Scraper''. VISUAL REQUIREMENT: Display a ''Risk Heatmap'' overlay on a map interface. Color-code neighborhoods from Green (Safe/Unrestricted) to Red (Total Ban/Moratorium). Include a ''Banking Thermometer'' showing lender appetite for non-residents in that specific region.',
    'TIER_0: Static STR law summary. TIER_1 (Bronze): City-level license check. TIER_2 (Silver): ''Banking Climate'' monitor. TIER_3 (Gold): ''Sentinel'' mode. Aggregates municipal decree changes and flags condo-level STR ban risks.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_08',
    'LEG_00',
    'DIM_LEGAL',
    'PH_1_INVEST',
    'LOC_PROPERTY',
    'Non-Resident Admin Hub',
    'Strategic guidance for cross-border administrative IDs',
    'A high-level administrative consultant for obtaining mandatory foreign IDs. TIER 3 provides end-to-end partner tracking and document preparation.',
    '1. Pedagogical Objective: Admin friction is the first deal-killer. Teaches the sequence of steps required for a foreigner to operate a business, preventing legal freezes. 2. Behavior Matrix: TIER_0: Document list. TIER_1 (Bronze): Interactive ''Admin Stepper''. TIER_2 (Silver): Multi-ID tracking and pre-filled letter templates. TIER_3 (Gold): Concierge Bridge with automated status polling. 3. User Journey & UI: Input: PII + Passport. Logic: Workflow automation. Output: Visual ''Application Timeline''. Coach: ''The Appointment Trap''. 4. Business Logic: RG-01: Non-residents only. RG-02: TIER_3 for partner polling.

Functional Specification: Jurisdictional Stepper. TIER_1: 5-step milestone UI. TIER_2: PDF Pre-filler. TIER_3: Partner Bridge. VISUAL REQUIREMENT: Create a ''Process Timeline'' visual (like a subway map) showing exactly where the user is in the bureaucracy (e.g., ''Document Prep'' -> ''Notary'' -> ''Tax Office''). Use animated progress bars to reduce anxiety during long wait times.',
    'TIER_0: Document list. TIER_1 (Bronze): Interactive ''Admin Stepper''. TIER_2 (Silver): Multi-ID tracking and pre-filled letter templates. TIER_3 (Gold): Concierge Bridge with automated status polling.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_00',
    NULL,
    'DIM_OPS',
    'PH_2_DESIGN',
    'GLOBAL',
    'Structural Asset Onboarding',
    'Professional technical and operational property audit',
    'Captures the ''Anatomy'' of the property to define maintenance and safety. TIER 3 provides a ''Technical Debt'' analysis for aging assets.',
    '1. Pedagogical Objective: A property is a machine. Most hosts fail because they don''t understand the asset''s technical life-cycle. This teaches the host to audit ''invisible'' infrastructure. 2. Behavior Matrix: TIER_0: Basic counts. TIER_1 (Bronze): Technical Inventory (brands, serials). TIER_2 (Silver): Operational Health Audit with preventative schedules. TIER_3 (Gold): Technical Debt Sentinel. Calculates ''Deferred Maintenance'' cost. 3. User Journey & UI: Input: Technical walkthrough. Logic: Maintenance interval calculation. Output: ''System Health Dials''. Coach: ''The Boiler Rule''. 4. Business Logic: RG-01: TIER_1 for specs. RG-02: Mandatory ''Shut-off Valve'' photo.

Functional Specification: Asset Anatomy structure. TIER_1: Hierarchical inventory. TIER_2: Predictive Failure algorithm. TIER_3: CapEx Forecaster. VISUAL REQUIREMENT: Generate a ''Technical Health Dashboard'' with circular dials for each major system (HVAC, Electrical, Plumbing). Green = Healthy, Red = End of Life. Include a ''CapEx Projection Bar Chart'' showing expected replacement costs over the next 5 years.',
    'TIER_0: Basic counts. TIER_1 (Bronze): Technical Inventory (brands, serials). TIER_2 (Silver): Operational Health Audit with preventative schedules. TIER_3 (Gold): Technical Debt Sentinel. Calculates ''Deferred Maintenance'' cost.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'EXP_01',
    NULL,
    'DIM_EXP',
    'PH_2_DESIGN',
    'GLOBAL',
    'Amenity & Yield Biasing',
    'Strategic asset procurement and yield uplift planner',
    'Links amenities to rental premiums. TIER 3 provides ROI scores for amenities based on regional market data.',
    '1. Pedagogical Objective: Strategic spending. Every Euro spent should increase Price or Occupancy. Teaches ''Value-Added Renovation''. 2. Behavior Matrix: TIER_0: Checklist. TIER_1 (Bronze): Cost tracker. TIER_2 (Silver): ''Yield Multiplier'' estimator (e.g., Pool impact). TIER_3 (Gold): Live procurement engine fetching public prices and mapping ''ADR Uplift'' to FIN_01. 3. User Journey & UI: Input: Hero Amenities. Logic: Cost vs. Revenue premium. Output: ''Amenity ROI'' Bar Charts. Coach: ''The Pool Premium''. 4. Business Logic: RG-01: TIER_3 for ROI logic. RG-02: Auto-update FIN_01 ADR.

Functional Specification: Amenity-Yield Correlation. TIER_1: CRUD items. TIER_2: Revenue Multipliers. TIER_3: Public Price Scraper. VISUAL REQUIREMENT: Display ''ROI Bar Charts'' for each selected amenity. Show ''Cost to Install'' (Red bar) vs. ''1-Year Revenue Uplift'' (Green bar) side-by-side to visualize the payback period instantly.',
    'TIER_0: Checklist. TIER_1 (Bronze): Cost tracker. TIER_2 (Silver): ''Yield Multiplier'' estimator (e.g., Pool impact). TIER_3 (Gold): Live procurement engine fetching public prices and mapping ''ADR Uplift'' to FIN_01.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_02',
    'FIN_00',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'GLOBAL',
    'Renovation Budget',
    'Smart Capex Planner',
    'A strategic Capex tool to prevent budget overruns. TIER 3 uses public indices to detect quote anomalies.',
    '1. Pedagogical Objective: Renovation creep kills profit. Teaches ''Dependency Management'' and budgeting. 2. Behavior Matrix: TIER_0: PDF list. TIER_1 (Bronze): Interactive tracker. TIER_2 (Silver): ''Vendor Matrix'' (3 quotes/item). TIER_3 (Gold): AI Quote Auditor comparing against public labor indices. 3. User Journey & UI: Input: Finish level. Logic: Dynamic total + buffer. Output: ''Spend Breakdown'' Donut Chart. Coach: ''Hero Amenities''. 4. Business Logic: RG-01: TIER_2 for multi-quote. RG-02: TIER_3 triggers alerts.

Functional Specification: Budget manager. TIER_1: Task CRUD. TIER_2: Variance Dashboard. TIER_3: Anomaly Detection. VISUAL REQUIREMENT: Create a ''Budget vs. Actual'' Bullet Chart for every room. Use a large ''Donut Chart'' to show spend distribution (e.g., 40% Kitchen, 20% Bath, 10% Decor). Highlight ''Over-Budget'' segments in bright red.',
    'TIER_0: PDF list. TIER_1 (Bronze): Interactive tracker. TIER_2 (Silver): ''Vendor Matrix'' (3 quotes/item). TIER_3 (Gold): AI Quote Auditor comparing against public labor indices.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'EXP_02',
    'EXP_01',
    'DIM_EXP',
    'PH_2_DESIGN',
    'GLOBAL',
    'AI Vision Asset Register',
    'Computer-Vision driven asset and damage protection coach',
    'Inventory system using AI to document assets. TIER 3 uses 360° Computer Vision to value items and detect missing essentials.',
    '1. Pedagogical Objective: Evidence-based hospitality. You cannot claim what you haven''t proved. Teaches ''Professional Standards of Evidence''. 2. Behavior Matrix: TIER_1 (Bronze): Mobile inventory. TIER_2 (Silver): Serial logging and warranty alerts. TIER_3 (Gold): AI Vision Agent identifying items from 360° photos. 3. User Journey & UI: Input: 360° photo. Logic: Image label detection. Output: Visual Asset Gallery. Coach: ''The Wear & Tear Rule''. 4. Business Logic: RG-01: Link to EXP_01. RG-02: TIER_3 for AI.

Functional Specification: Asset tracking (YOLOv8). TIER_1: Manual tagging. TIER_2: Warranty Monitor. TIER_3: AI Vision Agent. VISUAL REQUIREMENT: Display a ''Visual Inventory Grid''—a gallery of detected items with price tags overlaid. Use a ''Value TreeMap'' to show which rooms hold the most expensive assets (e.g., Living Room = largest box due to TV/Sofa).',
    'TIER_1 (Bronze): Mobile inventory. TIER_2 (Silver): Serial logging and warranty alerts. TIER_3 (Gold): AI Vision Agent identifying items from 360° photos.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_01',
    NULL,
    'DIM_OPS',
    'PH_2_DESIGN',
    'GLOBAL',
    'Operations Critical Path Engine',
    'Self-healing construction and setup timeline coach',
    'Professional Gantt engine for property readiness. TIER 3 automatically re-calculates dependencies and shifts logistics.',
    '1. Pedagogical Objective: Launching is a sequence. Teaches ''Dependency Management'' and ''Opportunity Cost''. 2. Behavior Matrix: TIER_1 (Bronze): Task list. TIER_2 (Silver): Portfolio timeline. TIER_3 (Gold): Self-healing Gantt Engine. 3. User Journey & UI: Input: Tasks. Logic: Critical Path Method (CPM). Output: Interactive Gantt with ''Risk Zones''. Coach: ''The Slack Factor''. 4. Business Logic: RG-01: Auto-reschedule. RG-02: TIER_3 for Gantt logic.

Functional Specification: Timeline engine. TIER_1: CRUD. TIER_2: Conflict Detection. TIER_3: CPM Engine. VISUAL REQUIREMENT: Render a standard ''Gantt Chart'' but highlight the ''Critical Path'' in bold red lines. Visually shade the ''Slip Impact'' area—showing how many days the launch is delayed if the current task slips.',
    'TIER_1 (Bronze): Task list. TIER_2 (Silver): Portfolio timeline. TIER_3 (Gold): Self-healing Gantt Engine.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'MKT_04',
    NULL,
    'DIM_MKT',
    'PH_3_LAUNCH',
    'GLOBAL',
    'Strategic Guest Avatar & Channel Mapping',
    'Consultative persona-driven marketing and distribution strategy',
    'Engine that defines the ''Guest Avatar'' to dictate marketing tone. TIER 3 uses local demand data to suggest the best persona.',
    '1. Pedagogical Objective: Marketing is not ''one size fits all''. Teaches users to pick a ''Guest Avatar'' and align pillows, pricing, and OTAs. 2. Behavior Matrix: TIER_0: Guest types. TIER_1 (Bronze): ''Avatar Builder''. TIER_2 (Silver): ''Amenity Alignment''. TIER_3 (Gold): ''Channel Strategy Architect''. 3. User Journey & UI: Input: ''Who are you attracting?''. Logic: Correlation matrix. Output: ''Persona Radar Chart''. Coach: ''The Niche Riches''. 4. Business Logic: RG-01: TIER_2 for ''Amenity Bias''. RG-02: Link to MKT_02.

Functional Specification: Hospitality Strategy Logic. TIER_1: Persona selection. TIER_2: Amenity Scorer. TIER_3: Channel Affinity. VISUAL REQUIREMENT: Generate a ''Persona Fit Radar Chart'' comparing the property''s current features against the ideal needs of the selected avatar (e.g., ''Work Setup'' axis is low for ''Families'' but high for ''Nomads''). Use a ''Venn Diagram'' to show channel overlap.',
    'TIER_0: Guest types. TIER_1 (Bronze): ''Avatar Builder''. TIER_2 (Silver): ''Amenity Alignment''. TIER_3 (Gold): ''Channel Strategy Architect''.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'MKT_00',
    NULL,
    'DIM_MKT',
    'PH_3_LAUNCH',
    'GLOBAL',
    'Visual Psychology Auditor',
    'AI-driven conversion and competitive intelligence auditor',
    'Conversion auditor benchmarking listings. TIER 3 uses competitive intelligence to highlight ''Amenity Gaps''.',
    '1. Pedagogical Objective: Perception drives the rate. Teaches ''Visual Psychology''. 2. Behavior Matrix: TIER_1 (Bronze): Manual audit. TIER_2 (Silver): ''Amenity Gap'' analysis. TIER_3 (Gold): AI Auditor benchmarking against top 10% properties. 3. User Journey & UI: Input: Listing URL. Logic: Benchmarking. Output: ''Conversion Probability Gauge''. Coach: ''The Hero Photo Rule''. 4. Business Logic: RG-01: Score < 60 warning. RG-02: TIER_3 for competitive scraping.

Functional Specification: Conversion auditor. TIER_1: Static rules. TIER_2: Amenity Gap. TIER_3: Market Benchmark. VISUAL REQUIREMENT: Display a large ''Conversion Score Gauge'' (0-100). Below it, show a ''Gap Bar Chart'' comparing the user''s photo count and amenity count against the ''Market Leader Average'' (e.g., Your Pool Photos: 0 vs Market: 3).',
    'TIER_1 (Bronze): Manual audit. TIER_2 (Silver): ''Amenity Gap'' analysis. TIER_3 (Gold): AI Auditor benchmarking against top 10% properties.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'MKT_02',
    'MKT_04',
    'DIM_MKT',
    'PH_3_LAUNCH',
    'GLOBAL',
    'Avatar-Centric Copywriting Engine',
    'AI-driven semantic content generator based on guest persona',
    'Copywriting agent rewriting content for a specific guest avatar. TIER 3 adapts psychological triggers.',
    '1. Pedagogical Objective: Copy is a sales conversation. Teaches ''Psychological Triggering''. 2. Behavior Matrix: TIER_1 (Bronze): Template generator. TIER_2 (Silver): Persona-based rewrites. TIER_3 (Gold): ''Cultural Localizer'' and auto-translate. 3. User Journey & UI: Input: Persona. Logic: Semantic mapping. Output: Multi-platform copy. Coach: ''The First Paragraph''. 4. Business Logic: RG-01: Link to MKT_04. RG-02: Auto-translate.

Functional Specification: Copywriting Agent (LLM). TIER_1: Keywords. TIER_2: Tone templates. TIER_3: Ingest Guest Avatar. VISUAL REQUIREMENT: While text-based, show a ''Sentiment Analysis Cloud''—visualizing the most prominent emotions/keywords in the generated text (e.g., ''Cozy'', ''Safe'', ''Fast WiFi'') to confirm alignment with the avatar.',
    'TIER_1 (Bronze): Template generator. TIER_2 (Silver): Persona-based rewrites. TIER_3 (Gold): ''Cultural Localizer'' and auto-translate.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'MKT_01',
    'MKT_00',
    'DIM_MKT',
    'PH_3_LAUNCH',
    'GLOBAL',
    'Photo Guide',
    'AI Image Enhancement & Staging Suite',
    'Pro-level photography guidance. TIER 3 corrects lighting and geometry using AI.',
    '1. Pedagogical Objective: Sell the dream. High visuals increase ADR. 2. Behavior Matrix: TIER_0: Framing guides. TIER_1 (Bronze): Camera overlay. TIER_2 (Silver): ''Scenario Staging''. TIER_3 (Gold): AI Enhancement Engine. 3. User Journey & UI: Input: Raw photo. Logic: AI HDR. Output: ''Before/After'' slider. Coach: ''Golden Hour'' tip. 4. Business Logic: RG-01: Resolution check. RG-02: TIER_3 for AI.

Functional Specification: Image processor. TIER_1: Overlays. TIER_2: Shot-List. TIER_3: AI Processing. VISUAL REQUIREMENT: Implement an interactive ''Before/After Slider'' for every enhanced image. Show a ''Quality Score'' badge (e.g., ''Lighting: A'', ''Sharpness: B'') overlaying the image metadata.',
    'TIER_0: Framing guides. TIER_1 (Bronze): Camera overlay. TIER_2 (Silver): ''Scenario Staging''. TIER_3 (Gold): AI Enhancement Engine.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'MKT_03',
    NULL,
    'DIM_MKT',
    'PH_6_SCALE',
    'GLOBAL',
    'Direct Booking Site',
    'Conversion-Optimized Direct Booking Engine',
    'Website builder for direct bookings. TIER 3 features a loyalty/referral module.',
    '1. Pedagogical Objective: Take back control. Teaches ''Direct Traffic'' value. 2. Behavior Matrix: TIER_1 (Bronze): Single page. TIER_2 (Silver): Multi-property site. TIER_3 (Gold): High-Performance Engine with Loyalty. 3. User Journey & UI: Input: Domain. Logic: Availability pull. Output: Hosted site. Coach: ''The Billboard Effect''. 4. Business Logic: RG-01: Stripe required. RG-02: Auto SSL.

Functional Specification: Booking SPA. TIER_1: Static page. TIER_2: Live Inventory. TIER_3: One-Click Checkout. VISUAL REQUIREMENT: Provide a ''Conversion Funnel'' dashboard for the site owner—visualizing ''Visitors'' -> ''Date Selectors'' -> ''Bookings'' as a funnel chart to identify drop-off points.',
    'TIER_1 (Bronze): Single page. TIER_2 (Silver): Multi-property site. TIER_3 (Gold): High-Performance Engine with Loyalty.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'PRI_01',
    NULL,
    'DIM_PRICING',
    'PH_3_LAUNCH',
    'GLOBAL',
    'Yield Setup',
    'Market-Adaptive Pricing Configurator',
    'Initial pricing based on cost-plus. TIER 3 uses live neighborhood demand data.',
    '1. Pedagogical Objective: Pricing as a strategy. Teaches the ''New Listing Boost''. 2. Behavior Matrix: TIER_0: Base calculator. TIER_1 (Bronze): Seasonal grid. TIER_2 (Silver): Portfolio-wide tiers. TIER_3 (Gold): Demand-Adaptive Setup. 3. User Journey & UI: Input: Costs. Logic: Cost-plus + Market delta. Output: ''Price Calendar'' Heatmap. Coach: 15% discount tip. 4. Business Logic: RG-01: Min price guardrail. RG-02: TIER_3 for market indices.

Functional Specification: Pricing configurator. TIER_1: 12-month grid. TIER_2: Global Rules. TIER_3: Neighborhood data. VISUAL REQUIREMENT: Generate a ''Price Calendar Heatmap''—color-coding days from Cool Blue (Low Rate) to Hot Red (Peak Rate). Overlay a ''Market Demand Line'' to show correlation with local trends.',
    'TIER_0: Base calculator. TIER_1 (Bronze): Seasonal grid. TIER_2 (Silver): Portfolio-wide tiers. TIER_3 (Gold): Demand-Adaptive Setup.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'PRI_02',
    NULL,
    'DIM_PRICING',
    'PH_5_ANALYZE',
    'GLOBAL',
    'Yield Strategy Optimizer',
    'AI-driven dynamic pricing and demand elasticity coach',
    'Algorithm maximizing RevPAR. TIER 3 adjusts rates based on local public events.',
    '1. Pedagogical Objective: Yield is about elasticity. Teaches the ''Revenue Curve''. 2. Behavior Matrix: TIER_1 (Bronze): Rule-based. TIER_2 (Silver): Event-based. TIER_3 (Gold): AI Dynamic Pricing with 20+ variables. 3. User Journey & UI: Input: Strategy. Logic: Elasticity Modeling. Output: ''Revenue Curve'' Chart. Coach: ''The Empty Night Myth''. 4. Business Logic: RG-01: TIER_3 for real-time. RG-02: Break-even floor.

Functional Specification: Dynamic pricing. TIER_1: Triggers. TIER_2: Holiday API. TIER_3: Elasticity Model. VISUAL REQUIREMENT: Display a ''Price Elasticity Curve''—showing the user the projected trade-off between Price (Y-axis) and Occupancy Probability (X-axis). Highlight the ''Optimal Revenue Point'' on the curve.',
    'TIER_1 (Bronze): Rule-based. TIER_2 (Silver): Event-based. TIER_3 (Gold): AI Dynamic Pricing with 20+ variables.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_02',
    NULL,
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'iCal Sync',
    'Redundant Calendar Sync Engine',
    'Basic calendar sync. TIER 3 syncs every 5 minutes with conflict alerts.',
    '1. Pedagogical Objective: Trust is reliability. Teaches distribution foundations. 2. Behavior Matrix: TIER_0: 1-way. TIER_1 (Bronze): 2-way (1h). TIER_2 (Silver): Portfolio Sync (30m). TIER_3 (Gold): High-Frequency (5m). 3. User Journey & UI: Input: iCal URLs. Logic: Merge. Output: ''Unified Calendar'' Grid. Coach: API vs iCal. 4. Business Logic: RG-01: Failure alert. RG-02: TIER_3 high freq.

Functional Specification: Sync service. TIER_1: Cron 60m. TIER_2: Conflict UI. TIER_3: Intelligent Polling. VISUAL REQUIREMENT: A ''Unified Calendar Grid'' is mandatory. Color-code bookings by source (Airbnb=Pink, Booking=Blue). Include a ''Sync Health Pulse'' visual—green dots indicating the last successful sync time for each channel.',
    'TIER_0: 1-way. TIER_1 (Bronze): 2-way (1h). TIER_2 (Silver): Portfolio Sync (30m). TIER_3 (Gold): High-Frequency (5m).'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_03',
    NULL,
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Channel Manager',
    'API-Direct Distribution Engine',
    'Centralized hub. TIER 3 syncs content and pricing instantly.',
    '1. Pedagogical Objective: Scale through automation. Teaches ''Single Source of Truth''. 2. Behavior Matrix: TIER_0: iCal. TIER_1 (Bronze): 1 API. TIER_2 (Silver): 3 APIs. TIER_3 (Gold): Unlimited API. 3. User Journey & UI: Input: API Keys. Logic: Push/pull. Output: ''Channel Mix'' Pie Chart. Coach: API benefits. 4. Business Logic: RG-01: TIER_2 for multi. RG-02: Markup logic.

Functional Specification: Distribution engine. TIER_1: OAuth. TIER_2: Markup Rules. TIER_3: Content Sync. VISUAL REQUIREMENT: Show a ''Channel Distribution Pie Chart''—visualizing which platforms are generating the most revenue. Include ''Connection Status Lights'' (Green/Red) for each API link.',
    'TIER_0: iCal. TIER_1 (Bronze): 1 API. TIER_2 (Silver): 3 APIs. TIER_3 (Gold): Unlimited API.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_03_AIRBNB',
    'OPS_03',
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Airbnb Connector',
    'Official Airbnb API Agent',
    'Real-time Airbnb connection. TIER 3 enables full automation.',
    '1. Pedagogical Objective: Channel mastery. Teaches first-response ranking. 2. Behavior Matrix: TIER_1 (Bronze): Availability. TIER_2 (Silver): Messaging. TIER_3 (Gold): Content & Reviews. 3. User Journey & UI: Input: Login. Logic: Content map. Output: Sync status. Coach: Response time. 4. Business Logic: RG-01: Re-auth. RG-02: TIER_2 messaging.

Functional Specification: Airbnb API. TIER_1: Push. TIER_2: Messaging. TIER_3: Reviews. VISUAL REQUIREMENT: Display ''Response Time Trends'' as a line graph to help the host improve their ranking metrics.',
    'TIER_1 (Bronze): Availability. TIER_2 (Silver): Messaging. TIER_3 (Gold): Content & Reviews.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_03_BOOKING',
    'OPS_03',
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Booking.com Connector',
    'Booking.com XML Specialist',
    'Advanced XML connection. TIER 3 automates promotions and VCC.',
    '1. Pedagogical Objective: Professional rigor. Teaches ''Rate Plans''. 2. Behavior Matrix: TIER_1 (Bronze): Availability. TIER_2 (Silver): Rate Plans. TIER_3 (Gold): Promotions & VCC. 3. User Journey & UI: Input: ID. Logic: Rate map. Output: Dashboard. Coach: Non-refundable tip. 4. Business Logic: RG-01: TIER_3 VCC.

Functional Specification: Booking XML. TIER_1: Base rate. TIER_2: Overrides. TIER_3: Promotions. VISUAL REQUIREMENT: Show a ''Cancellation Rate'' bar chart comparing Flexible vs. Non-Refundable bookings to justify the strategy.',
    'TIER_1 (Bronze): Availability. TIER_2 (Silver): Rate Plans. TIER_3 (Gold): Promotions & VCC.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_03_VRBO',
    'OPS_03',
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Vrbo Connector',
    'Vrbo Multi-Unit Distribution Agent',
    'Direct connection for family bookings. TIER 3 optimizes for family filters.',
    '1. Pedagogical Objective: Niche targeting. Teaches content adaptation. 2. Behavior Matrix: TIER_1 (Bronze): Basic. TIER_2 (Silver): Family optimization. TIER_3 (Gold): Content sync. 3. User Journey & UI: Input: Account. Logic: Content opt. Output: Health check. Coach: Kitchen photos. 4. Business Logic: RG-01: Age limits.

Functional Specification: Vrbo API. TIER_1: Push. TIER_2: Family Mapper. TIER_3: Content Bridge. VISUAL REQUIREMENT: A ''Family Appeal Scorecard''—visually checking off Vrbo-specific amenities (Crib, Garden) with a score out of 100.',
    'TIER_1 (Bronze): Basic. TIER_2 (Silver): Family optimization. TIER_3 (Gold): Content sync.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_04',
    NULL,
    'DIM_OPS',
    'PH_4_OPS',
    'LOC_PROPERTY',
    'Police Connection',
    'Automated Law Enforcement Reporter',
    'Automated guest ID reporting. TIER 3 features mobile OCR scanning.',
    '1. Pedagogical Objective: Legal peace of mind. Teaches ''Identity Management''. 2. Behavior Matrix: TIER_0: Links. TIER_1 (Bronze): CSV. TIER_2 (Silver): Check-in Portal. TIER_3 (Gold): API Submission. 3. User Journey & UI: Input: ID Scan. Logic: XML format. Output: Receipt. Coach: 24h rule. 4. Business Logic: RG-01: Non-reporting alert. RG-02: TIER_3 scan.

Functional Specification: Compliance reporting. TIER_1: CSV. TIER_2: Guest Portal. TIER_3: API Bridge. VISUAL REQUIREMENT: A ''Compliance Consistency Graph'' (Line Chart)—showing the percentage of guests successfully reported within 24h over the last 6 months.',
    'TIER_0: Links. TIER_1 (Bronze): CSV. TIER_2 (Silver): Check-in Portal. TIER_3 (Gold): API Submission.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_05',
    NULL,
    'DIM_OPS',
    'PH_4_OPS',
    'LOC_PROPERTY',
    '90-Day Counter',
    'Smart Regulatory Compliance Cap',
    'Tracking London''s 90-day limit. TIER 3 blocks calendars automatically.',
    '1. Pedagogical Objective: Respect local limits. Teaches ''Short vs Mid-term''. 2. Behavior Matrix: TIER_0: Manual. TIER_1 (Bronze): Automated counter. TIER_2 (Silver): Forecasting. TIER_3 (Gold): Auto-block. 3. User Journey & UI: Input: Booking data. Logic: Nights calc. Output: ''Capacity Gauge''. Coach: 30+ day tip. 4. Business Logic: RG-01: London only. RG-02: TIER_3 block.

Functional Specification: Night counter. TIER_1: Aggregate. TIER_2: Strategy Alerts. TIER_3: Safety Switch. VISUAL REQUIREMENT: Display a ''Capacity Gauge'' (Donut Chart) showing ''Nights Used'' vs ''Nights Remaining''. Color code segments: Green (0-60), Orange (60-80), Red (80+).',
    'TIER_0: Manual. TIER_1 (Bronze): Automated counter. TIER_2 (Silver): Forecasting. TIER_3 (Gold): Auto-block.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_08',
    NULL,
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Task Automation',
    'Event-Driven Operations Engine',
    'Automation of cleaning. TIER 3 reschedules via Smart Locks.',
    '1. Pedagogical Objective: Efficiency. Teaches ''Workflow Automation''. 2. Behavior Matrix: TIER_0: Manual. TIER_1 (Bronze): Triggers. TIER_2 (Silver): Contextual rules. TIER_3 (Gold): Smart Lock integration. 3. User Journey & UI: Input: Rules. Logic: Event->Action. Output: ''Operations Calendar''. Coach: Early Checkout. 4. Business Logic: RG-01: Sync OPS_09. RG-02: TIER_3 lock.

Functional Specification: Rules engine. TIER_1: Simple trigger. TIER_2: Conditional. TIER_3: Smart Lock. VISUAL REQUIREMENT: An ''Operations Calendar View'' is essential. Color-code tasks by type (Cleaning=Blue, Maintenance=Orange). Show ''Conflict Alerts'' as visual warning icons on the calendar grid.',
    'TIER_0: Manual. TIER_1 (Bronze): Triggers. TIER_2 (Silver): Contextual rules. TIER_3 (Gold): Smart Lock integration.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_09',
    'OPS_08',
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Provider App',
    'Field Operations Terminal',
    'Mobile interface for staff. TIER 3 requires photo proof.',
    '1. Pedagogical Objective: Remote quality. Teaches ''Evidence-Based Reporting''. 2. Behavior Matrix: TIER_0: Email. TIER_1 (Bronze): WebApp. TIER_2 (Silver): Checklists. TIER_3 (Gold): Photo Proof. 3. User Journey & UI: Input: Tap. Logic: Geofence. Output: Certificate. Coach: ''After'' photos. 4. Business Logic: RG-01: Min 3 photos. RG-02: TIER_3 low-stock.

Functional Specification: Mobile PWA. TIER_1: Task view. TIER_2: Checklists. TIER_3: Photo Validation. VISUAL REQUIREMENT: A ''Photo Gallery Grid'' for every completed task. Allow the owner to swipe through ''Before'' and ''After'' images easily.',
    'TIER_0: Email. TIER_1 (Bronze): WebApp. TIER_2 (Silver): Checklists. TIER_3 (Gold): Photo Proof.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_10',
    'OPS_08',
    'DIM_OPS',
    'PH_4_OPS',
    'GLOBAL',
    'Ticketing System',
    'Property Maintenance & Incident Tracker',
    'Tracking maintenance. TIER 3 generates claim PDFs.',
    '1. Pedagogical Objective: Close the loop. Teaches ''Asset Maintenance''. 2. Behavior Matrix: TIER_1 (Bronze): List. TIER_2 (Silver): Assigned tickets. TIER_3 (Gold): Claim Bridge. 3. User Journey & UI: Input: Report. Logic: Priority. Output: ''Ticket Funnel''. Coach: Wear vs Damage. 4. Business Logic: RG-01: Link photos. RG-02: TIER_3 claim.

Functional Specification: Issue tracker. TIER_1: CRUD. TIER_2: Asset Linking. TIER_3: Resolution Agent. VISUAL REQUIREMENT: Display a ''Ticket Status Funnel'' (Open -> Assigned -> Resolved). Include a ''Maintenance Cost Bar Chart'' showing spend per month.',
    'TIER_1 (Bronze): List. TIER_2 (Silver): Assigned tickets. TIER_3 (Gold): Claim Bridge.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_08',
    NULL,
    'DIM_FINANCE',
    'PH_4_OPS',
    'GLOBAL',
    'Concierge Payout Engine',
    'Automated revenue reconciliation and investor transparency coach',
    'Automated reconciliation. TIER 3 automates payouts.',
    '1. Pedagogical Objective: Financial integrity. Teaches ''Net-to-Owner''. 2. Behavior Matrix: TIER_1 (Bronze): Calculator. TIER_2 (Silver): Monthly recon. TIER_3 (Gold): Stripe Payouts. 3. User Journey & UI: Input: %. Logic: Net calc. Output: ''Revenue Split'' Chart. Coach: Transparency premium. 4. Business Logic: RG-01: TIER_2 multi-owner. RG-02: TIER_3 auto-pay.

Functional Specification: Reconciliation engine. TIER_1: Calc. TIER_2: Deductions. TIER_3: Stripe Connect. VISUAL REQUIREMENT: A ''Revenue Split Stacked Bar Chart''. Show ''Gross Revenue'' as the total bar, broken down into segments: ''Platform Fee'', ''Management Commission'', ''Cleaning Costs'', and ''Net Owner Payout''.',
    'TIER_1 (Bronze): Calculator. TIER_2 (Silver): Monthly recon. TIER_3 (Gold): Stripe Payouts.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_07',
    NULL,
    'DIM_LEGAL',
    'PH_4_OPS',
    'LOC_PROPERTY',
    'Mandate Generator',
    'Legal Property Management Contract Suite',
    'Generates contracts. TIER 3 includes e-signatures.',
    '1. Pedagogical Objective: Secure delegation. Teaches legal boundaries. 2. Behavior Matrix: TIER_1 (Bronze): Templates. TIER_2 (Silver): Variable generator. TIER_3 (Gold): e-Signature. 3. User Journey & UI: Input: Fees. Logic: Text gen. Output: Digital contract. Coach: Liability. 4. Business Logic: RG-01: Termination clause. RG-02: TIER_3 e-sign.

Functional Specification: Doc generator. TIER_1: PDF. TIER_2: Dynamic clauses. TIER_3: e-Sign API. VISUAL REQUIREMENT: A ''Signature Status Tracker''—visual circles showing who has signed (Owner: Green, Manager: Green) and timestamp.',
    'TIER_1 (Bronze): Templates. TIER_2 (Silver): Variable generator. TIER_3 (Gold): e-Signature.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'EXP_03',
    NULL,
    'DIM_EXP',
    'PH_4_OPS',
    'GLOBAL',
    'Web Welcome Book',
    'Interactive Guest Experience Portal',
    'Digital welcome book. TIER 3 features Upsell Engine.',
    '1. Pedagogical Objective: Automate the obvious. Teaches ''Front-loading''. 2. Behavior Matrix: TIER_0: Text. TIER_1 (Bronze): Interactive Guide. TIER_2 (Silver): Global Templates. TIER_3 (Gold): Upsell Store. 3. User Journey & UI: Input: WiFi. Logic: Status-aware. Output: PWA. Coach: First 5 mins. 4. Business Logic: RG-01: QR. RG-02: TIER_3 Stripe.

Functional Specification: Guest PWA. TIER_1: HTML guide. TIER_2: Inheritance. TIER_3: Checkout. VISUAL REQUIREMENT: A ''Guest Interaction Heatmap'' for the host—showing which sections of the guide (e.g., ''WiFi'', ''Pool Rules'') are clicked the most.',
    'TIER_0: Text. TIER_1 (Bronze): Interactive Guide. TIER_2 (Silver): Global Templates. TIER_3 (Gold): Upsell Store.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'EXP_04',
    NULL,
    'DIM_EXP',
    'PH_4_OPS',
    'GLOBAL',
    'Contextual Hospitality Agent',
    'RAG-driven AI guest assistant for technical support',
    'AI guest assistant. TIER 3 uses RAG on manuals.',
    '1. Pedagogical Objective: Quality scales. Teaches ''Knowledge Base''. 2. Behavior Matrix: TIER_1 (Bronze): SMS triggers. TIER_2 (Silver): Rule-based FAQ. TIER_3 (Gold): Contextual RAG AI. 3. User Journey & UI: Input: Chat. Logic: Search. Output: Answer. Coach: Speed. 4. Business Logic: RG-01: Escalation. RG-02: Languages.

Functional Specification: Conversational AI. TIER_1: Keywords. TIER_2: Inbox. TIER_3: RAG. VISUAL REQUIREMENT: Display a ''Topic Frequency Word Cloud''—visualizing what guests are asking about most often (e.g., ''Parking'', ''Heating'').',
    'TIER_1 (Bronze): SMS triggers. TIER_2 (Silver): Rule-based FAQ. TIER_3 (Gold): Contextual RAG AI.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_05',
    NULL,
    'DIM_FINANCE',
    'PH_5_ANALYZE',
    'GLOBAL',
    'Occupancy Stats',
    'Market-Relative Performance Dashboard',
    'Occupancy tracking. TIER 3 benchmarks against comp-set.',
    '1. Pedagogical Objective: Context. Teaches RevPAR. 2. Behavior Matrix: TIER_1 (Bronze): Personal charts. TIER_2 (Silver): YoY comparison. TIER_3 (Gold): Comp-set Benchmark. 3. User Journey & UI: Input: Booking data. Logic: RevPAR calc. Output: ''Market Radar''. Coach: RevPAR Myth. 4. Business Logic: RG-01: Confirmed only. RG-02: TIER_3 comp-set.

Functional Specification: Analytics. TIER_1: Charts. TIER_2: Opportunity Gap. TIER_3: Public Data. VISUAL REQUIREMENT: A ''Market Performance Radar Chart'' comparing the user vs. the market average on 4 axes: Occupancy, ADR, Review Score, and Cancellations.',
    'TIER_1 (Bronze): Personal charts. TIER_2 (Silver): YoY comparison. TIER_3 (Gold): Comp-set Benchmark.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_06',
    NULL,
    'DIM_FINANCE',
    'PH_5_ANALYZE',
    'LOC_PROPERTY',
    'FEC Export',
    'FR Standardized Accounting Exporter',
    'French FEC generator. TIER 3 syncs software.',
    '1. Pedagogical Objective: Digital Record Keeping. 2. Behavior Matrix: TIER_1 (Bronze): CSV. TIER_2 (Silver): Shadow ledger. TIER_3 (Gold): FEC Sync. 3. User Journey & UI: Input: Receipts. Logic: Double-entry. Output: FEC file. Coach: Mandatory FEC. 4. Business Logic: RG-01: France. RG-02: Zero balance.

Functional Specification: Fiscal log. TIER_1: Flat file. TIER_2: Ledger. TIER_3: FEC. VISUAL REQUIREMENT: A ''Ledger Balance Scale''—visually showing Debit vs. Credit weight to confirm the books are balanced before export.',
    'TIER_1 (Bronze): CSV. TIER_2 (Silver): Shadow ledger. TIER_3 (Gold): FEC Sync.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_07',
    NULL,
    'DIM_FINANCE',
    'PH_5_ANALYZE',
    'LOC_HOST',
    'MTD Export',
    'UK HMRC Compliance Bridge',
    'UK MTD exporter. TIER 3 direct submission.',
    '1. Pedagogical Objective: Audit Trail. 2. Behavior Matrix: TIER_1 (Bronze): Excel. TIER_2 (Silver): Tax Tracker. TIER_3 (Gold): HMRC Bridge. 3. User Journey & UI: Input: Ledger. Logic: VAT calc. Output: Receipt. Coach: Digital Links. 4. Business Logic: RG-01: UK. RG-02: TIER_3 API.

Functional Specification: HMRC Bridge. TIER_1: Export. TIER_2: Forecast. TIER_3: Submission. VISUAL REQUIREMENT: A ''Tax Liability Line Chart''—showing the accumulated VAT/Income Tax due over the quarter so the user can save appropriately.',
    'TIER_1 (Bronze): Excel. TIER_2 (Silver): Tax Tracker. TIER_3 (Gold): HMRC Bridge.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_10',
    NULL,
    'DIM_FINANCE',
    'PH_5_ANALYZE',
    'LOC_HOST',
    'Double Tax Report',
    'Consolidated Cross-Border Tax Summary',
    'Double tax report. TIER 3 Filing Map.',
    '1. Pedagogical Objective: Double Tax Treaties. 2. Behavior Matrix: TIER_1 (Bronze): Summary. TIER_2 (Silver): FTC Calc. TIER_3 (Gold): Filing Map. 3. User Journey & UI: Input: Residency. Logic: OECD rules. Output: Filing Guide. Coach: Treaty. 4. Business Logic: RG-01: Treaty check. RG-02: TIER_2 FTC.

Functional Specification: Tax Advisor. TIER_1: Sum. TIER_2: Credit Formula. TIER_3: Filing Guide. VISUAL REQUIREMENT: A ''Tax Flow Sankey Diagram''—visualizing the flow of Gross Income -> Local Tax -> Repatriation -> Home Tax Credit -> Net Income.',
    'TIER_1 (Bronze): Summary. TIER_2 (Silver): FTC Calc. TIER_3 (Gold): Filing Map.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_03',
    'FIN_00',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'LOC_PROPERTY',
    'LMNP Tax Simulator',
    'French Fiscal Strategy Optimizer',
    'French tax simulator. TIER 3 15-year roadmap.',
    '1. Pedagogical Objective: Depreciation power. 2. Behavior Matrix: TIER_0: Guide. TIER_1 (Bronze): Comparison. TIER_2 (Silver): Components. TIER_3 (Gold): 15-Year Roadmap. 3. User Journey & UI: Input: Price. Logic: Amortization. Output: ''Tax Free Runway'' Chart. Coach: Ghost Expense. 4. Business Logic: RG-01: France. RG-02: TIER_3 Pivot.

Functional Specification: LMNP Logic. TIER_1: Compare. TIER_2: Components. TIER_3: Pivot Predictor. VISUAL REQUIREMENT: A ''Tax-Free Runway Bar Chart''—showing 15 years of future income. Green bars = Tax Free Income, Red bars = Taxable Income. Mark the ''Pivot Year'' clearly.',
    'TIER_0: Guide. TIER_1 (Bronze): Comparison. TIER_2 (Silver): Components. TIER_3 (Gold): 15-Year Roadmap.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_04',
    'FIN_00',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'LOC_HOST',
    'Section 24 Simulator',
    'UK Interest Relief Decision Matrix',
    'UK tax analyzer. TIER 3 Incorporation simulation.',
    '1. Pedagogical Objective: Structural shifts. 2. Behavior Matrix: TIER_0: Warning. TIER_1 (Bronze): Calc. TIER_2 (Silver): Portfolio agg. TIER_3 (Gold): Incorp Decision. 3. User Journey & UI: Input: Income. Logic: Tax delta. Output: ''Cross-over'' Chart. Coach: HMRC rules. 4. Business Logic: RG-01: UK. RG-02: TIER_3 Income.

Functional Specification: UK Matrix. TIER_1: Relief. TIER_2: Portfolio. TIER_3: Structural Engine. VISUAL REQUIREMENT: A ''Cross-Over Line Chart''—plotting ''Personal Tax Bill'' vs. ''Corporate Tax Bill'' over increasing revenue. Highlight the exact £ point where Incorporation becomes cheaper.',
    'TIER_0: Warning. TIER_1 (Bronze): Calc. TIER_2 (Silver): Portfolio agg. TIER_3 (Gold): Incorp Decision.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'FIN_09',
    'FIN_00',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'LOC_PROPERTY',
    'Non-Resident Tax Sim',
    'Cross-Border Fiscal Compliance Agent',
    'Intl tax calc. TIER 3 form gen.',
    '1. Pedagogical Objective: Double Taxation. 2. Behavior Matrix: TIER_0: Rates. TIER_1 (Bronze): Estimate. TIER_2 (Silver): Summary. TIER_3 (Gold): Form Mapper. 3. User Journey & UI: Input: Res. Logic: Treaty. Output: Summary. Coach: Withholding. 4. Business Logic: RG-01: Treaty DB. RG-02: TIER_3 Forms.

Functional Specification: Fiscal Agent. TIER_1: Local calc. TIER_2: Treaty. TIER_3: Mapper. VISUAL REQUIREMENT: A ''Global Tax Map''—highlighting property countries in color. Hovering shows the specific ''Effective Tax Rate'' for the non-resident user in that country.',
    'TIER_0: Rates. TIER_1 (Bronze): Estimate. TIER_2 (Silver): Summary. TIER_3 (Gold): Form Mapper.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_03',
    NULL,
    'DIM_LEGAL',
    'PH_3_LAUNCH',
    'LOC_PROPERTY',
    'Cerfa Generator',
    'French Administrative Automation Bot',
    'French admin bot. TIER 3 portal submission.',
    '1. Pedagogical Objective: Compliance. 2. Behavior Matrix: TIER_0: Link. TIER_1 (Bronze): PDF. TIER_2 (Silver): Tracking. TIER_3 (Gold): Submission. 3. User Journey & UI: Input: Host data. Logic: Map. Output: Receipt. Coach: Reg Number. 4. Business Logic: RG-01: France. RG-02: TIER_3 portal.

Functional Specification: PDF Map. TIER_1: Coords. TIER_2: Dashboard. TIER_3: Script. VISUAL REQUIREMENT: A ''Registration Status Traffic Light''—Red (Not Started), Orange (Submitted), Green (Approved/Number Issued).',
    'TIER_0: Link. TIER_1 (Bronze): PDF. TIER_2 (Silver): Tracking. TIER_3 (Gold): Submission.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_04',
    NULL,
    'DIM_LEGAL',
    'PH_3_LAUNCH',
    'LOC_PROPERTY',
    'VUT License Assistant',
    'Spanish Licensing Expert System',
    'Spanish license guide. TIER 3 Statute AI.',
    '1. Pedagogical Objective: Due diligence. 2. Behavior Matrix: TIER_0: Guide. TIER_1 (Bronze): Checklist. TIER_2 (Silver): Fee Calc. TIER_3 (Gold): Statute AI. 3. User Journey & UI: Input: PDF. Logic: Keyword. Output: Report. Coach: Moratoriums. 4. Business Logic: RG-01: Spain. RG-02: TIER_3 AI.

Functional Specification: Legal Analyzer. TIER_1: Tree. TIER_2: Fee. TIER_3: Scanner. VISUAL REQUIREMENT: A ''Risk Probability Gauge''—showing the likelihood of license rejection based on the analyzed statutes (Green = Low Risk, Red = High Risk).',
    'TIER_0: Guide. TIER_1 (Bronze): Checklist. TIER_2 (Silver): Fee Calc. TIER_3 (Gold): Statute AI.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_05',
    NULL,
    'DIM_LEGAL',
    'PH_3_LAUNCH',
    'LOC_PROPERTY',
    'Impressum Generator',
    'German Compliance Hosting Service',
    'German Impressum. TIER 3 auto-update.',
    '1. Pedagogical Objective: Transparency. 2. Behavior Matrix: TIER_0: Template. TIER_1 (Bronze): Host URL. TIER_2 (Silver): QR. TIER_3 (Gold): Legal Trigger. 3. User Journey & UI: Input: Data. Logic: Gen. Output: URL. Coach: Address. 4. Business Logic: RG-01: Germany. RG-02: TIER_3 update.

Functional Specification: Site Gen. TIER_1: HTML. TIER_2: QR. TIER_3: Sentinel. VISUAL REQUIREMENT: Show a ''Compliance Shield Icon'' that is Green when the legal text matches the latest database version, and Red if an update is pending.',
    'TIER_0: Template. TIER_1 (Bronze): Host URL. TIER_2 (Silver): QR. TIER_3 (Gold): Legal Trigger.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'LEG_06',
    NULL,
    'DIM_LEGAL',
    'PH_6_SCALE',
    'LOC_HOST',
    'Wealth Optimization Audit',
    'Structural asset and succession strategy coach',
    'Scaling advisor. TIER 3 Succession.',
    '1. Pedagogical Objective: Legacy. 2. Behavior Matrix: TIER_1 (Bronze): Tax comp. TIER_2 (Silver): Wealth Proj. TIER_3 (Gold): Inheritance Sentinel. 3. User Journey & UI: Input: Family. Logic: Succession. Output: Roadmap. Coach: Inheritance Trap. 4. Business Logic: RG-01: TIER_3 logic. RG-02: Net Worth.

Functional Specification: Wealth Sim. TIER_1: Compare. TIER_2: Equity. TIER_3: Succession. VISUAL REQUIREMENT: A ''Wealth Transfer Charts''. Chart A: ''Net Wealth Today''. Chart B: ''Net Wealth after Succession Tax'' (Personal). Chart C: ''Net Wealth after Succession Tax'' (Corporate). Show the delta clearly.',
    'TIER_1 (Bronze): Tax comp. TIER_2 (Silver): Wealth Proj. TIER_3 (Gold): Inheritance Sentinel.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_06',
    NULL,
    'DIM_OPS',
    'PH_6_SCALE',
    'GLOBAL',
    'Team Management',
    'Granular RBAC Operations Portal',
    'Access control. TIER 3 RBAC.',
    '1. Pedagogical Objective: Delegation. 2. Behavior Matrix: TIER_1 (Bronze): 1 Co-host. TIER_2 (Silver): Presets. TIER_3 (Gold): RBAC. 3. User Journey & UI: Input: Email. Logic: Mask. Output: Log. Coach: Passwords. 4. Business Logic: RG-01: Owner safe. RG-02: TIER_3 custom.

Functional Specification: RBAC. TIER_1: View all. TIER_2: Presets. TIER_3: Matrix. VISUAL REQUIREMENT: An ''Activity Heatmap'' showing which team members are active at what times of day/week.',
    'TIER_1 (Bronze): 1 Co-host. TIER_2 (Silver): Presets. TIER_3 (Gold): RBAC.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;

INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    'OPS_07',
    'OPS_06',
    'DIM_OPS',
    'PH_6_SCALE',
    'GLOBAL',
    'Investor Portal',
    'Transparency & ROI Reporting Dashboard',
    'Owner portal. TIER 3 Whitelabel.',
    '1. Pedagogical Objective: Professionalism. 2. Behavior Matrix: TIER_1 (Bronze): PDF. TIER_2 (Silver): Dashboard. TIER_3 (Gold): Whitelabel. 3. User Journey & UI: Input: Commentary. Logic: Filter. Output: View. Coach: Context. 4. Business Logic: RG-01: Read-only. RG-02: Review.

Functional Specification: Dashboard. TIER_1: Email. TIER_2: Login. TIER_3: Whitelabel. VISUAL REQUIREMENT: High-level ''KPI Cards'' (Revenue, Occupancy, Net Payout) at the top. Below, a ''Performance Trend Line'' comparing this year vs. last year.',
    'TIER_1 (Bronze): PDF. TIER_2 (Silver): Dashboard. TIER_3 (Gold): Whitelabel.'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
