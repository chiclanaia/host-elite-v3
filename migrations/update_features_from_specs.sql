-- Update Features from specs.csv (Auto-generated)
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_00',
        NULL,
        'DIM_FINANCE',
        'PH_1_INVEST',
        'GLOBAL',
        'Profitability Suite',
        'Financial Intelligence Command Center',
        'An advanced multi-dimensional financial hub. TIER 3 transforms it into a predictive command center.',
        '1. Pedagogical Objective: Strategic vision over simple math. This suite teaches the ''Portfolio mindset,'' showing how macro-trends and micro-decisions intersect. 2. Behavior Matrix: TIER_0 (Beginner): Static Sandbox with sample data. TIER_1 (Bronze): Single-property live dashboard. TIER_2 (Silver): Multi-property consolidation (up to 5 assets) with historical trend tracking. TIER_3 (Gold): Unlimited Portfolio Command Center with ''Global Risk'' scoring and 10-year market cycle simulations. 3. User Journey & UI: Input: Financial goals and asset types. Logic: Aggregation of sub-modules. Output: Heat map showing ROI and Equity growth. Coach: ''Diversification'' tooltip. 4. Business Logic: RG-01: Tier 0 locks ''Consolidated View''. RG-02: TIER_2 enables ''Custom Tags'' for property grouping. RG-03: TIER_3 allows ''Stress Test'' simulations.',
        'TIER_0 (Beginner): Static Sandbox with sample data. TIER_1 (Bronze): Single-property live dashboard. TIER_2 (Silver): Multi-property consolidation (up to 5 assets) with historical trend tracking. TIER_3 (Gold): Unlimited Portfolio Command Center with ''Global Risk'' scoring and 10-year market cycle simulations.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_01',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'GLOBAL',
        'ROI Simulator',
        'Real-time Yield & Cashflow Engine',
        'A high-precision engine calculating net cash flow with real-time adjustments.',
        '1. Pedagogical Objective: Beginners confuse revenue with profit. This tool focuses on net monthly liquidity. 2. Behavior Matrix: TIER_0 (Beginner): 3-field manual simulator. TIER_1 (Bronze): Full expense itemization (fixed charges). TIER_2 (Silver): Sensitivity Analysis (Optimistic/Pessimistic scenarios) and 5-year projection. TIER_3 (Gold): Real-time Ingestion via public bank APIs and national rental indices. 3. User Journey & UI: Input: Price, Rent, Loan. Logic: Net Cash-flow = Rent - (Loan + Charges + Reserves). Output: ''Traffic Light'' visual. Coach: 10% maintenance provision alert. 4. Business Logic: RG-01: TIER_1 required to save simulations. RG-02: TIER_2 required for ''Scenario Comparison'' view. RG-03: TIER_3 auto-populates vacancy rates based on public regional stats.',
        'TIER_0 (Beginner): 3-field manual simulator. TIER_1 (Bronze): Full expense itemization (fixed charges). TIER_2 (Silver): Sensitivity Analysis (Optimistic/Pessimistic scenarios) and 5-year projection. TIER_3 (Gold): Real-time Ingestion via public bank APIs and national rental indices.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_02',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'GLOBAL',
        'Renovation Budget',
        'Smart Capex & Furnishing Planner',
        'A strategic Capex tool to prevent budget overruns.',
        '1. Pedagogical Objective: Renovation creep kills profit. Teaches ''Dependency Management'' and budgeting. 2. Behavior Matrix: TIER_0 (Beginner): Generic room-by-room PDF. TIER_1 (Bronze): Interactive tracker for a single project. TIER_2 (Silver): Quote Comparison Engine (3 quotes per task) and variance tracking. TIER_3 (Gold): AI Quote Auditor comparing against public labor cost indices. 3. User Journey & UI: Input: Dimensions + Finish level. Logic: Dynamic total + 15% buffer. Output: Spend-per-room chart. Coach: Focus on ''Hero Amenities''. 4. Business Logic: RG-01: TIER_2 required for ''Vendor Management''. RG-02: TIER_3 triggers ''Cost Anomaly'' alerts.',
        'TIER_0 (Beginner): Generic room-by-room PDF. TIER_1 (Bronze): Interactive tracker for a single project. TIER_2 (Silver): Quote Comparison Engine (3 quotes per task) and variance tracking. TIER_3 (Gold): AI Quote Auditor comparing against public labor cost indices.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_03',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'LOC_PROPERTY',
        'LMNP Tax Simulator',
        'French Fiscal Strategy Optimizer',
        'Specialized French tax simulator (Micro-BIC vs. Réel).',
        '1. Pedagogical Objective: Tax as a yield booster. Teaches the power of depreciation. 2. Behavior Matrix: TIER_0 (Beginner): Static theory guide. TIER_1 (Bronze): Annual comparison simulator. TIER_2 (Silver): Component-based depreciation (Amortissement par composants) and 5-year tax-loss carryforward. TIER_3 (Gold): 15-year roadmap with ''Regime Switch'' alerts. 3. User Journey & UI: Input: Price, fees, renos. Logic: Component-based depreciation rules. Output: Cumulative tax savings. Coach: ''Ghost Expense'' concept. 4. Business Logic: RG-01: French scope only. RG-02: TIER_2 required for component breakdown. RG-03: TIER_3 predicts the ''Fiscal Pivot'' year.',
        'TIER_0 (Beginner): Static theory guide. TIER_1 (Bronze): Annual comparison simulator. TIER_2 (Silver): Component-based depreciation (Amortissement par composants) and 5-year tax-loss carryforward. TIER_3 (Gold): 15-year roadmap with ''Regime Switch'' alerts.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_04',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'LOC_HOST',
        'Section 24 Simulator',
        'UK Interest Relief Decision Matrix',
        'UK-specific interest relief analyzer.',
        '1. Pedagogical Objective: Strategic structural shifts. Teaches the impact of high-rate tax on interest. 2. Behavior Matrix: TIER_0 (Beginner): Section 24 warning card. TIER_1 (Bronze): Basic tax impact calculator. TIER_2 (Silver): Multi-property Section 24 impact across a portfolio. TIER_3 (Gold): Individual vs. Ltd Co Decision Matrix with SDLT/CGT transition simulation. 3. User Journey & UI: Input: Global income, mortgage interest. Logic: Net benefit calculation. Output: Incorporation break-even point. Coach: LAYMAN explanation of HMRC rules. 4. Business Logic: RG-01: UK scope only. RG-02: TIER_3 requires full income profile.',
        'TIER_0 (Beginner): Section 24 warning card. TIER_1 (Bronze): Basic tax impact calculator. TIER_2 (Silver): Multi-property Section 24 impact across a portfolio. TIER_3 (Gold): Individual vs. Ltd Co Decision Matrix with SDLT/CGT transition simulation.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_09',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'LOC_PROPERTY',
        'Non-Resident Tax Sim',
        'Cross-Border Fiscal Compliance Agent',
        'Calculates tax for international owners.',
        '1. Pedagogical Objective: Global mindset, local compliance. Teaches ''Double Taxation'' protection. 2. Behavior Matrix: TIER_0 (Beginner): Directory of foreign tax rates. TIER_1 (Bronze): Basic liability estimator for one country. TIER_2 (Silver): Multi-country tax summary and Treaty eligibility check. TIER_3 (Gold): Automated form generator (e.g., ES Modelo 210) from financial data. 3. User Journey & UI: Input: Residency, Property location, Income. Logic: Apply Bilateral Treaty rules. Output: Quarterly tax due. Coach: ''Withholding Tax'' explanation. 4. Business Logic: RG-01: Check Treaty DB. RG-02: TIER_3 for form generation.',
        'TIER_0 (Beginner): Directory of foreign tax rates. TIER_1 (Bronze): Basic liability estimator for one country. TIER_2 (Silver): Multi-country tax summary and Treaty eligibility check. TIER_3 (Gold): Automated form generator (e.g., ES Modelo 210) from financial data.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_00',
        NULL,
        'DIM_LEGAL',
        'PH_1_INVEST',
        'GLOBAL',
        'Compliance Checker',
        'Zoning & Regulatory Sentinel',
        'Compliance engine verifying property legality.',
        '1. Pedagogical Objective: Proactive safety. Teaches zoning laws. 2. Behavior Matrix: TIER_0 (Beginner): Generic law database. TIER_1 (Bronze): City-level compliance audit. TIER_2 (Silver): Address-specific zoning check and License application tracker. TIER_3 (Gold): ''Sentinel'' mode with automated public gazette monitoring and change alerts. 3. User Journey & UI: Input: Address. Logic: Geo-spatial check. Output: Legality Score. Coach: Moratoriums tooltip. 4. Business Logic: RG-01: TIER_3 for push alerts. RG-02: Zone restriction detection.',
        'TIER_0 (Beginner): Generic law database. TIER_1 (Bronze): City-level compliance audit. TIER_2 (Silver): Address-specific zoning check and License application tracker. TIER_3 (Gold): ''Sentinel'' mode with automated public gazette monitoring and change alerts.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_01',
        'LEG_00',
        'DIM_LEGAL',
        'PH_1_INVEST',
        'GLOBAL',
        'Regulatory Checklist',
        'Adaptive Compliance Workflow',
        'Interactive compliance management.',
        '1. Pedagogical Objective: Administrative discipline. Teaches professional operation. 2. Behavior Matrix: TIER_0 (Beginner): PDF Checklist. TIER_1 (Bronze): Single-unit interactive tracker. TIER_2 (Silver): Portfolio-wide compliance dashboard with document expiry tracking. TIER_3 (Gold): One-Click Audit Export (ZIP) and automated renewal workflows. 3. User Journey & UI: Input: Documents. Logic: Expiry validation. Output: Audit-Ready badge. Coach: Public Liability tip. 4. Business Logic: RG-01: Lock Launch phase if items missing. RG-02: TIER_2 for expiry alerts.',
        'TIER_0 (Beginner): PDF Checklist. TIER_1 (Bronze): Single-unit interactive tracker. TIER_2 (Silver): Portfolio-wide compliance dashboard with document expiry tracking. TIER_3 (Gold): One-Click Audit Export (ZIP) and automated renewal workflows.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_02',
        'LEG_00',
        'DIM_LEGAL',
        'PH_1_INVEST',
        'LOC_PROPERTY',
        'Zweckentfremdungsverbot',
        'DE Anti-Misuse Ban Analyzer',
        'Specific analyzer for German ''Misuse Ban'' laws.',
        '1. Pedagogical Objective: Navigating bureaucracy. Teaches ''Primary Residence'' exceptions. 2. Behavior Matrix: TIER_0 (Beginner): German city warning text. TIER_1 (Bronze): Interactive zone map (Berlin/Munich). TIER_2 (Silver): Permit probability score and local ''Registration Number'' tracker. TIER_3 (Gold): Legal Drafting Assistant (Bescheid style) using open-source LLMs. 3. User Journey & UI: Input: Address + Intent. Logic: GIS mapping. Output: Permit probability. Coach: ''Primary Residence'' exception. 4. Business Logic: RG-01: DE scope only. RG-02: TIER_3 for legal drafts.',
        'TIER_0 (Beginner): German city warning text. TIER_1 (Bronze): Interactive zone map (Berlin/Munich). TIER_2 (Silver): Permit probability score and local ''Registration Number'' tracker. TIER_3 (Gold): Legal Drafting Assistant (Bescheid style) using open-source LLMs.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_08',
        'LEG_00',
        'DIM_LEGAL',
        'PH_1_INVEST',
        'LOC_PROPERTY',
        'Foreign ID Assistant',
        'International Admin Onboarding Agent',
        'Step-by-step guide for non-residents (NIE/Siret).',
        '1. Pedagogical Objective: Breaking the entry barrier. Teaches administrative sequences. 2. Behavior Matrix: TIER_0 (Beginner): Required docs list. TIER_1 (Bronze): Interactive ''Stepper'' for one ID type. TIER_2 (Silver): Multi-ID tracking and pre-filled letter templates for appointment requests. TIER_3 (Gold): Concierge Bridge with automated status polling for partner files. 3. User Journey & UI: Input: Personal PII. Logic: Country delta workflow. Output: Application tracker. Coach: ''What is a NIE?''. 4. Business Logic: RG-01: Non-residents only. RG-02: TIER_3 for status polling.',
        'TIER_0 (Beginner): Required docs list. TIER_1 (Bronze): Interactive ''Stepper'' for one ID type. TIER_2 (Silver): Multi-ID tracking and pre-filled letter templates for appointment requests. TIER_3 (Gold): Concierge Bridge with automated status polling for partner files.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'EXP_01',
        NULL,
        'DIM_EXP',
        'PH_2_DESIGN',
        'GLOBAL',
        'Essentials List',
        'Dynamic Procurement Optimizer',
        'Curated procurement list for high-conversion.',
        '1. Pedagogical Objective: Invest in high-impact amenities. Teaches ''ADR Impact'' of items. 2. Behavior Matrix: TIER_0 (Beginner): Static PDF list. TIER_1 (Bronze): Interactive checklist with basic budget tracking. TIER_2 (Silver): Portfolio-wide inventory standards and room templates. TIER_3 (Gold): Live procurement engine with public price scraping and ROI impact scoring. 3. User Journey & UI: Input: Size + Level. Logic: Price-to-Value score. Output: Shopping cart with links. Coach: ''Coffee Rule''. 4. Business Logic: RG-01: Sync to FIN_02. RG-02: TIER_3 for price scraping.',
        'TIER_0 (Beginner): Static PDF list. TIER_1 (Bronze): Interactive checklist with basic budget tracking. TIER_2 (Silver): Portfolio-wide inventory standards and room templates. TIER_3 (Gold): Live procurement engine with public price scraping and ROI impact scoring.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'EXP_02',
        NULL,
        'DIM_EXP',
        'PH_2_DESIGN',
        'GLOBAL',
        'Inventory Generator',
        'Computer Vision Inventory Agent',
        'Digital inventory for insurance and asset tracking.',
        '1. Pedagogical Objective: Protect your assets. Teaches evidence-based reporting. 2. Behavior Matrix: TIER_0 (Beginner): Manual text table. TIER_1 (Bronze): Mobile-first photo inventory (10 items max). TIER_2 (Silver): Unlimited inventory with serial number logging and warranty alerts. TIER_3 (Gold): AI Vision Agent identifying items from a single 360° photo. 3. User Journey & UI: Input: Photo upload. Logic: Image label detection. Output: Digital Asset Register. Coach: ''Check-in Proof''. 4. Business Logic: RG-01: Detect safety equipment. RG-02: TIER_3 for AI detection.',
        'TIER_0 (Beginner): Manual text table. TIER_1 (Bronze): Mobile-first photo inventory (10 items max). TIER_2 (Silver): Unlimited inventory with serial number logging and warranty alerts. TIER_3 (Gold): AI Vision Agent identifying items from a single 360° photo.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_01',
        NULL,
        'DIM_OPS',
        'PH_2_DESIGN',
        'GLOBAL',
        'Construction Schedule',
        'Critical Path Operations Engine',
        'A timeline tool for property readiness.',
        '1. Pedagogical Objective: Operations are a sequence. Teaches ''Dependency Management''. 2. Behavior Matrix: TIER_0 (Beginner): Opening countdown. TIER_1 (Bronze): Single-project task list. TIER_2 (Silver): Portfolio-wide timeline and team assignment. TIER_3 (Gold): Self-healing Gantt Engine with dependency logic and delay alerts. 3. User Journey & UI: Input: Task list + Relationships. Logic: Critical Path Calculation. Output: Interactive Gantt chart. Coach: ''The Slack Factor''. 4. Business Logic: RG-01: Auto-reschedule on delay. RG-02: TIER_3 for Gantt dependency logic.',
        'TIER_0 (Beginner): Opening countdown. TIER_1 (Bronze): Single-project task list. TIER_2 (Silver): Portfolio-wide timeline and team assignment. TIER_3 (Gold): Self-healing Gantt Engine with dependency logic and delay alerts.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'MKT_00',
        NULL,
        'DIM_MKT',
        'PH_3_LAUNCH',
        'GLOBAL',
        'Listing Optimization',
        'AI-Driven Conversion Auditor',
        'Auditor for listing visibility.',
        '1. Pedagogical Objective: Perception is reality. Teaches CTR optimization. 2. Behavior Matrix: TIER_0 (Beginner): 10 ''Pro-tips''. TIER_1 (Bronze): Manual audit checklist. TIER_2 (Silver): Competitor amenities gap analysis. TIER_3 (Gold): AI Auditor benchmarking against ''Top 10%'' local public listing data. 3. User Journey & UI: Input: Listing URL. Logic: Multi-factor scoring. Output: Performance Score (0-100). Coach: ''Hero Photo'' tooltip. 4. Business Logic: RG-01: Min score < 60 warning. RG-02: TIER_3 for competitor scraping.',
        'TIER_0 (Beginner): 10 ''Pro-tips''. TIER_1 (Bronze): Manual audit checklist. TIER_2 (Silver): Competitor amenities gap analysis. TIER_3 (Gold): AI Auditor benchmarking against ''Top 10%'' local public listing data.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'MKT_01',
        'MKT_00',
        'DIM_MKT',
        'PH_3_LAUNCH',
        'GLOBAL',
        'Photo Guide',
        'AI Image Enhancement & Staging Suite',
        'Pro-level photography guidance with AI enhancement.',
        '1. Pedagogical Objective: Sell the dream. High visuals increase ADR. Teaches framing and lighting. 2. Behavior Matrix: TIER_0 (Beginner): Framing guides. TIER_1 (Bronze): Mobile camera overlay (Rule of Thirds). TIER_2 (Silver): ''Seasonality Staging'' advice and basic filter suite. TIER_3 (Gold): AI Enhancement Engine (HDR/Geometry correction) using open-source models. 3. User Journey & UI: Input: Raw photo. Logic: AI HDR + Lens correction. Output: Before/After view. Coach: ''Golden Hour'' tip. 4. Business Logic: RG-01: Resolution check. RG-02: TIER_3 for AI enhancement.',
        'TIER_0 (Beginner): Framing guides. TIER_1 (Bronze): Mobile camera overlay (Rule of Thirds). TIER_2 (Silver): ''Seasonality Staging'' advice and basic filter suite. TIER_3 (Gold): AI Enhancement Engine (HDR/Geometry correction) using open-source models.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'MKT_02',
        'MKT_00',
        'DIM_MKT',
        'PH_3_LAUNCH',
        'GLOBAL',
        'AI Listing Writer',
        'Semantic SEO Content Generator',
        'Copywriting engine for high-conversion.',
        '1. Pedagogical Objective: Copy that converts. Teaches ''Persona-Based Marketing''. 2. Behavior Matrix: TIER_0 (Beginner): Text templates. TIER_1 (Bronze): ''Mad-libs'' style generator. TIER_2 (Silver): Semantic SEO Keyword injection and platform-specific formatting. TIER_3 (Gold): Persona-Based LLM Generator (Luxury/Business/Family) with 10+ languages. 3. User Journey & UI: Input: Key features. Logic: Semantic mapping. Output: platform titles. Coach: ''The Hook'' tip. 4. Business Logic: RG-01: Multi-language TIER_3. RG-02: Mandatory disclosures.',
        'TIER_0 (Beginner): Text templates. TIER_1 (Bronze): ''Mad-libs'' style generator. TIER_2 (Silver): Semantic SEO Keyword injection and platform-specific formatting. TIER_3 (Gold): Persona-Based LLM Generator (Luxury/Business/Family) with 10+ languages.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_03',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'LOC_PROPERTY',
        'Cerfa Generator',
        'French Administrative Automation Bot',
        'Automated filler for French municipal declarations.',
        '1. Pedagogical Objective: Compliance is vital. Teaches ''Residence Principale'' vs ''Secondaire''. 2. Behavior Matrix: TIER_0 (Beginner): Link to portal. TIER_1 (Bronze): Interactive form generating PDF Cerfa. TIER_2 (Silver): Multi-property declaration management and status tracking. TIER_3 (Gold): Digital Admin Proxy with direct portal submission. 3. User Journey & UI: Input: Host + Property data. Logic: Mappings to Cerfa 14004*04. Output: Signed PDF. Coach: Registration number explanation. 4. Business Logic: RG-01: France only. RG-02: TIER_3 for portal submission.',
        'TIER_0 (Beginner): Link to portal. TIER_1 (Bronze): Interactive form generating PDF Cerfa. TIER_2 (Silver): Multi-property declaration management and status tracking. TIER_3 (Gold): Digital Admin Proxy with direct portal submission.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_04',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'LOC_PROPERTY',
        'VUT License Assistant',
        'Spanish Licensing Expert System',
        'Guide for Spanish VUT licenses.',
        '1. Pedagogical Objective: Due diligence. Teaches Building Statute checks. 2. Behavior Matrix: TIER_0 (Beginner): Regional guide. TIER_1 (Bronze): Interactive requirement checklist. TIER_2 (Silver): Province-specific document manager and fee calculator. TIER_3 (Gold): ''Statute Analyzer'' with AI-based prohibition detection in PDF docs. 3. User Journey & UI: Input: Province + Statutes PDF. Logic: Keyword extraction. Output: Licensability Report. Coach: Moratoriums explanation. 4. Business Logic: RG-01: Spain only. RG-02: TIER_3 for statute analysis.',
        'TIER_0 (Beginner): Regional guide. TIER_1 (Bronze): Interactive requirement checklist. TIER_2 (Silver): Province-specific document manager and fee calculator. TIER_3 (Gold): ''Statute Analyzer'' with AI-based prohibition detection in PDF docs.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_05',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'LOC_PROPERTY',
        'Impressum Generator',
        'German Compliance Hosting Service',
        'Generates and hosts German legal notices.',
        '1. Pedagogical Objective: Professional identity. Teaches commercial transparency (§5 TMG). 2. Behavior Matrix: TIER_0 (Beginner): Impressum template. TIER_1 (Bronze): Dynamic generator with hosted URL. TIER_2 (Silver): Adaptive Impressum (Multi-host/Company support) and QR Code generator. TIER_3 (Gold): Automated legal update monitoring (EU/TMG updates). 3. User Journey & UI: Input: VAT + Contact data. Logic: Legal text generation. Output: Permalink URL. Coach: Why physical address is required. 4. Business Logic: RG-01: Germany only. RG-02: TIER_3 for legal triggers.',
        'TIER_0 (Beginner): Impressum template. TIER_1 (Bronze): Dynamic generator with hosted URL. TIER_2 (Silver): Adaptive Impressum (Multi-host/Company support) and QR Code generator. TIER_3 (Gold): Automated legal update monitoring (EU/TMG updates).'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'PRI_01',
        NULL,
        'DIM_PRICING',
        'PH_3_LAUNCH',
        'GLOBAL',
        'Yield Setup',
        'Market-Adaptive Pricing Configurator',
        'Initial pricing based on cost-plus and market data.',
        '1. Pedagogical Objective: Pricing as a strategy. Teaches the ''New Listing Boost''. 2. Behavior Matrix: TIER_0 (Beginner): Base price calculator. TIER_1 (Bronze): Seasonal price grid. TIER_2 (Silver): Comp-set benchmarking and ''Price-per-Occupancy'' targets. TIER_3 (Gold): Demand-Adaptive Setup with ''Launch Discount'' strategy and live neighborhood indices. 3. User Journey & UI: Input: Costs + Desired profit. Logic: Cost-plus + Market delta. Output: 12-month calendar. Coach: 15% discount for first 3 reviews. 4. Business Logic: RG-01: Min price guardrail. RG-02: TIER_3 for market indices.',
        'TIER_0 (Beginner): Base price calculator. TIER_1 (Bronze): Seasonal price grid. TIER_2 (Silver): Comp-set benchmarking and ''Price-per-Occupancy'' targets. TIER_3 (Gold): Demand-Adaptive Setup with ''Launch Discount'' strategy and live neighborhood indices.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_02',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'iCal Sync',
        'Redundant Calendar Sync Engine',
        'Basic calendar sync to prevent double bookings.',
        '1. Pedagogical Objective: Trust is built on reliability. Teaches foundations of distribution. 2. Behavior Matrix: TIER_0 (Beginner): 1-way export. TIER_1 (Bronze): 2-way sync (1-hour refresh). TIER_2 (Silver): High-Frequency Sync (15m) and conflict resolution UI. TIER_3 (Gold): Near-real-time Sync (5m) with automated collision-detection and Push alerts. 3. User Journey & UI: Input: iCal URLs. Logic: Chronological merge. Output: Unified calendar. Coach: API vs iCal tip. 4. Business Logic: RG-01: Sync failure alert. RG-02: TIER_3 for high frequency.',
        'TIER_0 (Beginner): 1-way export. TIER_1 (Bronze): 2-way sync (1-hour refresh). TIER_2 (Silver): High-Frequency Sync (15m) and conflict resolution UI. TIER_3 (Gold): Near-real-time Sync (5m) with automated collision-detection and Push alerts.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_03',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Channel Manager',
        'API-Direct Distribution Engine',
        'Centralized hub for property distribution.',
        '1. Pedagogical Objective: Scale through automation. Teaches ''Single Source of Truth''. 2. Behavior Matrix: TIER_0 (Beginner): iCal Basic. TIER_1 (Bronze): API Connection for 1 platform. TIER_2 (Silver): API Connection for 3 platforms + Basic content/photo sync. TIER_3 (Gold): Unlimited API Distribution with advanced pricing rules and Instant Sync. 3. User Journey & UI: Input: API Keys. Logic: Direct API push/pull. Output: Sync Status Dashboard. Coach: Why API > iCal. 4. Business Logic: RG-01: TIER_2 for multi-channel. RG-02: ''Global Markup'' logic.',
        'TIER_0 (Beginner): iCal Basic. TIER_1 (Bronze): API Connection for 1 platform. TIER_2 (Silver): API Connection for 3 platforms + Basic content/photo sync. TIER_3 (Gold): Unlimited API Distribution with advanced pricing rules and Instant Sync.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_03_AIRBNB',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Airbnb Connector',
        'Official Airbnb API Agent',
        'Real-time direct connection with Airbnb.',
        '1. Pedagogical Objective: Channel-specific mastery. Teaches first-response ranking. 2. Behavior Matrix: TIER_1 (Bronze): Availability sync. TIER_2 (Silver): Guest Messaging and automated ''Saved Replies''. TIER_3 (Gold): Full Content Parity and AI-automated review response. 3. User Journey & UI: Input: Airbnb login. Logic: Content mapping. Output: Sync status. Coach: Response time importance. 4. Business Logic: RG-01: 90-day re-auth. RG-02: TIER_2 for messaging.',
        'TIER_1 (Bronze): Availability sync. TIER_2 (Silver): Guest Messaging and automated ''Saved Replies''. TIER_3 (Gold): Full Content Parity and AI-automated review response.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_03_BOOKING',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Booking.com Connector',
        'Booking.com XML Specialist',
        'Advanced XML connection for professional management.',
        '1. Pedagogical Objective: Professional rigor. Teaches ''Rate Plans'' and payment security. 2. Behavior Matrix: TIER_1 (Bronze): Availability sync. TIER_2 (Silver): Management of ''Flexible'' vs ''Non-refundable'' rates. TIER_3 (Gold): Automated Promotion management and VCC processing. 3. User Journey & UI: Input: Booking ID. Logic: Rate Plan mapping. Output: Policy dashboard. Coach: Non-refundable rates tip. 4. Business Logic: RG-01: TIER_3 for VCC capture.',
        'TIER_1 (Bronze): Availability sync. TIER_2 (Silver): Management of ''Flexible'' vs ''Non-refundable'' rates. TIER_3 (Gold): Automated Promotion management and VCC processing.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_03_VRBO',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Vrbo Connector',
        'Vrbo Multi-Unit Distribution Agent',
        'Direct connection for family-oriented bookings.',
        '1. Pedagogical Objective: Niche targeting. Teaches content adaptation for families. 2. Behavior Matrix: TIER_1 (Bronze): Basic sync. TIER_2 (Silver): Multi-unit grouping and family-amenity optimization. TIER_3 (Gold): Automated cross-platform content sync and guest vetting logic. 3. User Journey & UI: Input: Vrbo account. Logic: Content optimization. Output: Listing health check. Coach: Kitchen photos tip. 4. Business Logic: RG-01: Age limit sync.',
        'TIER_1 (Bronze): Basic sync. TIER_2 (Silver): Multi-unit grouping and family-amenity optimization. TIER_3 (Gold): Automated cross-platform content sync and guest vetting logic.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_04',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'LOC_PROPERTY',
        'Police Connection',
        'Automated Law Enforcement Reporter',
        'Automated reporting of guest IDs (Spain/Italy/Portugal).',
        '1. Pedagogical Objective: Legal peace of mind. Teaches ''Identity Management''. 2. Behavior Matrix: TIER_0 (Beginner): Police portal links. TIER_1 (Bronze): Manual CSV Export. TIER_2 (Silver): Automated ''Due Soon'' reminders and in-app ID collection portal. TIER_3 (Gold): Automated API Submission with mobile OCR scanning. 3. User Journey & UI: Input: Guest ID scan. Logic: XML formatting. Output: Submission receipt. Coach: 24-hour rule explanation. 4. Business Logic: RG-01: Non-reporting alert. RG-02: TIER_3 for mobile scan.',
        'TIER_0 (Beginner): Police portal links. TIER_1 (Bronze): Manual CSV Export. TIER_2 (Silver): Automated ''Due Soon'' reminders and in-app ID collection portal. TIER_3 (Gold): Automated API Submission with mobile OCR scanning.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_05',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'LOC_PROPERTY',
        '90-Day Counter',
        'Smart Regulatory Compliance Cap',
        'Automated tracking of London''s 90-day limit.',
        '1. Pedagogical Objective: Respect local limits. Teaches ''Short vs Mid-term'' balance. 2. Behavior Matrix: TIER_0 (Beginner): Manual night counter. TIER_1 (Bronze): Automated counter from connected calendars. TIER_2 (Silver): ''Remaining Capacity'' forecasting and ''Switch to 30+'' strategy alerts. TIER_3 (Gold): Smart Cap with automated multi-channel calendar blocking. 3. User Journey & UI: Input: Booking data. Logic: Nights calculation. Output: Progress bar. Coach: 30+ day strategy tip. 4. Business Logic: RG-01: London scope only. RG-02: TIER_3 for auto-blocking.',
        'TIER_0 (Beginner): Manual night counter. TIER_1 (Bronze): Automated counter from connected calendars. TIER_2 (Silver): ''Remaining Capacity'' forecasting and ''Switch to 30+'' strategy alerts. TIER_3 (Gold): Smart Cap with automated multi-channel calendar blocking.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_08',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Task Automation',
        'Event-Driven Operations Engine',
        'Automation of cleaning and maintenance.',
        '1. Pedagogical Objective: Efficiency through events. Teaches ''Workflow Automation''. 2. Behavior Matrix: TIER_0 (Beginner): Manual tasks. TIER_1 (Bronze): Basic triggers (e.g., ''Clean after Checkout''). TIER_2 (Silver): Complex logic (e.g., ''If guest < 2 nights, skip full laundry'') and provider assignment. TIER_3 (Gold): Intelligent Engine with Smart Lock integration and dynamic rescheduling. 3. User Journey & UI: Input: Rules. Logic: If $$Event$$ -> Action. Output: Automation log. Coach: Early Checkout tip. 4. Business Logic: RG-01: Sync with OPS_09. RG-02: TIER_3 for lock events.',
        'TIER_0 (Beginner): Manual tasks. TIER_1 (Bronze): Basic triggers (e.g., ''Clean after Checkout''). TIER_2 (Silver): Complex logic (e.g., ''If guest < 2 nights, skip full laundry'') and provider assignment. TIER_3 (Gold): Intelligent Engine with Smart Lock integration and dynamic rescheduling.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_09',
        'OPS_08',
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Provider App',
        'Field Operations Terminal',
        'Mobile-optimized interface for field staff.',
        '1. Pedagogical Objective: Remote quality control. Teaches ''Evidence-Based Reporting''. 2. Behavior Matrix: TIER_0 (Beginner): Email notification. TIER_1 (Bronze): WebApp with basic task list. TIER_2 (Silver): Multi-provider access and detailed ''Room-by-Room'' checklists. TIER_3 (Gold): Field Terminal with mandatory ''Photo Proof'' and instant Inventory alerts. 3. User Journey & UI: Input: Tap to start. Logic: Geofenced check-in. Output: Cleanliness Certificate. Coach: ''After'' photos tip. 4. Business Logic: RG-01: Min 3 photos. RG-02: TIER_3 for low-stock button.',
        'TIER_0 (Beginner): Email notification. TIER_1 (Bronze): WebApp with basic task list. TIER_2 (Silver): Multi-provider access and detailed ''Room-by-Room'' checklists. TIER_3 (Gold): Field Terminal with mandatory ''Photo Proof'' and instant Inventory alerts.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_10',
        'OPS_08',
        'DIM_OPS',
        'PH_4_OPS',
        'GLOBAL',
        'Ticketing System',
        'Property Maintenance & Incident Tracker',
        'Systematic tracking of maintenance issues.',
        '1. Pedagogical Objective: Close the loop on breakage. Teaches ''Asset Maintenance''. 2. Behavior Matrix: TIER_1 (Bronze): Basic incident list. TIER_2 (Silver): Assigned tickets with priority levels and cost tracking. TIER_3 (Gold): Damage-to-Claim bridge and automated security deposit claim generation. 3. User Journey & UI: Input: Report issue. Logic: Priority assignment. Output: Incident history. Coach: Wear and Tear vs Damage. 4. Business Logic: RG-01: Link photos to OPS_09. RG-02: TIER_3 for claim generation.',
        'TIER_1 (Bronze): Basic incident list. TIER_2 (Silver): Assigned tickets with priority levels and cost tracking. TIER_3 (Gold): Damage-to-Claim bridge and automated security deposit claim generation.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_08',
        NULL,
        'DIM_FINANCE',
        'PH_4_OPS',
        'GLOBAL',
        'Commission Splitter',
        'Concierge Revenue Distribution Engine',
        'Automated revenue sharing for property managers.',
        '1. Pedagogical Objective: Financial transparency. Teaches ''Net-to-Owner'' clarity. 2. Behavior Matrix: TIER_1 (Bronze): Manual % calculator per booking. TIER_2 (Silver): Automated monthly reconciliation for up to 3 owners. TIER_3 (Gold): Automated Distribution with Stripe Connect payouts and Whitelabel Reports. 3. User Journey & UI: Input: Commission %. Logic: Gross - Fees - Expenses = Net. Output: Statement of Account. Coach: Expense Proofs tip. 4. Business Logic: RG-01: TIER_2 for multi-owner. RG-02: TIER_3 for auto-payouts.',
        'TIER_1 (Bronze): Manual % calculator per booking. TIER_2 (Silver): Automated monthly reconciliation for up to 3 owners. TIER_3 (Gold): Automated Distribution with Stripe Connect payouts and Whitelabel Reports.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_07',
        NULL,
        'DIM_LEGAL',
        'PH_4_OPS',
        'LOC_PROPERTY',
        'Mandate Generator',
        'Legal Property Management Contract Suite',
        'Generates legally binding management contracts.',
        '1. Pedagogical Objective: Secure delegation. Teaches legal boundaries. 2. Behavior Matrix: TIER_1 (Bronze): Downloadable templates. TIER_2 (Silver): Variable-based generator for custom fee structures. TIER_3 (Gold): Mandate Generator with e-Signature integration and ''Legal Vault'' storage. 3. User Journey & UI: Input: Fees + Liability. Logic: Variable text generation. Output: Digital contract. Coach: Liability explanation. 4. Business Logic: RG-01: Termination clause mandatory. RG-02: TIER_3 for e-signature.',
        'TIER_1 (Bronze): Downloadable templates. TIER_2 (Silver): Variable-based generator for custom fee structures. TIER_3 (Gold): Mandate Generator with e-Signature integration and ''Legal Vault'' storage.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'EXP_03',
        NULL,
        'DIM_EXP',
        'PH_4_OPS',
        'GLOBAL',
        'Web Welcome Book',
        'Interactive Guest Experience Portal',
        'Digital welcome book reducing inquiries.',
        '1. Pedagogical Objective: Automate the obvious. Teaches ''Front-loading'' information. 2. Behavior Matrix: TIER_0 (Beginner): Text-only rules. TIER_1 (Bronze): Interactive Guide for 1 property. TIER_2 (Silver): Multi-property guides with shared ''Local Tips'' and neighborhood maps. TIER_3 (Gold): Experience Portal with ''Upsell Store'' and AI auto-translation. 3. User Journey & UI: Input: WiFi, Rules, Tips. Logic: Status-aware content. Output: PWA / QR Code. Coach: The first 5 mins tip. 4. Business Logic: RG-01: QR Code generation. RG-02: TIER_3 for Stripe upsells.',
        'TIER_0 (Beginner): Text-only rules. TIER_1 (Bronze): Interactive Guide for 1 property. TIER_2 (Silver): Multi-property guides with shared ''Local Tips'' and neighborhood maps. TIER_3 (Gold): Experience Portal with ''Upsell Store'' and AI auto-translation.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'EXP_04',
        NULL,
        'DIM_EXP',
        'PH_4_OPS',
        'GLOBAL',
        'Guest AI Chatbot',
        'Contextual AI Guest Assistant',
        '24/7 AI support for guest questions.',
        '1. Pedagogical Objective: 24/7 responsiveness. Teaches ''Knowledge Base'' management. 2. Behavior Matrix: TIER_1 (Bronze): Automated SMS triggers. TIER_2 (Silver): Rule-based FAQ triggers and ''Human Handover'' UI. TIER_3 (Gold): Contextual AI Assistant using RAG on property-specific PDF manuals and guides. 3. User Journey & UI: Input: Chat. Logic: Search within manuals. Output: Conversational answer. Coach: Speed of Response tip. 4. Business Logic: RG-01: Escalation if confidence < 80%. RG-02: 20+ languages.',
        'TIER_1 (Bronze): Automated SMS triggers. TIER_2 (Silver): Rule-based FAQ triggers and ''Human Handover'' UI. TIER_3 (Gold): Contextual AI Assistant using RAG on property-specific PDF manuals and guides.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_05',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'GLOBAL',
        'Occupancy Stats',
        'Market-Relative Performance Dashboard',
        'Basic occupancy and revenue tracking.',
        '1. Pedagogical Objective: Don''t celebrate in a vacuum. Teaches RevPAR. 2. Behavior Matrix: TIER_1 (Bronze): Personal occupancy charts. TIER_2 (Silver): Comparative year-on-year stats and ''Loss of Opportunity'' analysis. TIER_3 (Gold): Predictive Benchmarking against local Comp-set open data. 3. User Journey & UI: Input: Booking data. Logic: RevPAR = ADR x Occ%. Output: Market comparison graph. Coach: The RevPAR Myth. 4. Business Logic: RG-01: Confirmed bookings only. RG-02: TIER_3 for comp-set.',
        'TIER_1 (Bronze): Personal occupancy charts. TIER_2 (Silver): Comparative year-on-year stats and ''Loss of Opportunity'' analysis. TIER_3 (Gold): Predictive Benchmarking against local Comp-set open data.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_06',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'LOC_PROPERTY',
        'FEC Export',
        'FR Standardized Accounting Exporter',
        'French ''Fichier des Écritures Comptables'' (FEC) generator.',
        '1. Pedagogical Objective: Accounting as a habit. Teaches ''Digital Record Keeping''. 2. Behavior Matrix: TIER_1 (Bronze): Annual CSV export. TIER_2 (Silver): Quarterly shadow ledger and VAT pre-calculation. TIER_3 (Gold): Standardized FEC Exporter with direct accounting software sync. 3. User Journey & UI: Input: Receipts + Income. Logic: Double-entry bridge. Output: .txt FEC file. Coach: Why FEC is mandatory. 4. Business Logic: RG-01: France only. RG-02: Zero balance required.',
        'TIER_1 (Bronze): Annual CSV export. TIER_2 (Silver): Quarterly shadow ledger and VAT pre-calculation. TIER_3 (Gold): Standardized FEC Exporter with direct accounting software sync.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_07',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'LOC_HOST',
        'MTD Export',
        'UK HMRC Compliance Bridge',
        'UK HMRC ''Making Tax Digital'' (MTD) compliant data exporter.',
        '1. Pedagogical Objective: Compliance through digital links. Teaches ''Audit Trail''. 2. Behavior Matrix: TIER_1 (Bronze): Formatted spreadsheet export. TIER_2 (Silver): Quarterly tax liability tracker and ''Digital Link'' verification. TIER_3 (Gold): MTD Compliance Bridge with direct submission to HMRC API. 3. User Journey & UI: Input: Ledger data. Logic: Quarterly calculation. Output: HMRC receipt. Coach: Copy-pasting risk tip. 4. Business Logic: RG-01: UK only. RG-02: TIER_3 for API submission.',
        'TIER_1 (Bronze): Formatted spreadsheet export. TIER_2 (Silver): Quarterly tax liability tracker and ''Digital Link'' verification. TIER_3 (Gold): MTD Compliance Bridge with direct submission to HMRC API.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'FIN_10',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'LOC_HOST',
        'Double Tax Report',
        'Consolidated Cross-Border Tax Summary',
        'Report for declaring foreign income avoiding double taxation.',
        '1. Pedagogical Objective: Global profit, home protection. Teaches Double Taxation Treaties. 2. Behavior Matrix: TIER_1 (Bronze): Income summary per country. TIER_2 (Silver): Detailed Foreign Tax Credit (FTC) calculation for the home country return. TIER_3 (Gold): Tax Treaty Advisor with ''Filing Map'' using public OECD/Treaty data. 3. User Journey & UI: Input: Residency + Property locations. Logic: Apply OECD rules. Output: Filing Guide. Coach: Treaty explanation. 4. Business Logic: RG-01: Flag if no treaty. RG-02: TIER_2 for FTC calculation.',
        'TIER_1 (Bronze): Income summary per country. TIER_2 (Silver): Detailed Foreign Tax Credit (FTC) calculation for the home country return. TIER_3 (Gold): Tax Treaty Advisor with ''Filing Map'' using public OECD/Treaty data.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'PRI_02',
        NULL,
        'DIM_PRICING',
        'PH_5_ANALYZE',
        'GLOBAL',
        'RevPAR Optimizer',
        'AI-Driven Dynamic Pricing Algorithm',
        'Automated pricing algorithm maximizing total revenue.',
        '1. Pedagogical Objective: Pricing as a living strategy. Teaches ''Demand Elasticity''. 2. Behavior Matrix: TIER_1 (Bronze): Rule-based pricing (e.g., ''Last minute discount''). TIER_2 (Silver): Event-based pricing (Public holidays/School holidays) and 1x daily sync. TIER_3 (Gold): AI Dynamic Pricing with 20+ public variables (Weather, Events) and 4x daily updates. 3. User Journey & UI: Input: Min/Max Price. Logic: Demand Elasticity Modeling. Output: Price Forecast. Coach: Empty night vs cheap sell. 4. Business Logic: RG-01: Unlimited sync TIER_3. RG-02: Never below ''Min Price''.',
        'TIER_1 (Bronze): Rule-based pricing (e.g., ''Last minute discount''). TIER_2 (Silver): Event-based pricing (Public holidays/School holidays) and 1x daily sync. TIER_3 (Gold): AI Dynamic Pricing with 20+ public variables (Weather, Events) and 4x daily updates.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'MKT_03',
        NULL,
        'DIM_MKT',
        'PH_6_SCALE',
        'GLOBAL',
        'Direct Booking Site',
        'Conversion-Optimized Direct Booking Engine',
        'Commission-free website builder for direct bookings.',
        '1. Pedagogical Objective: Take back control. Teaches ''Direct Traffic'' value. 2. Behavior Matrix: TIER_1 (Bronze): Single property landing page with inquiry form. TIER_2 (Silver): Multi-property booking site with real-time calendar and ''Returning Guest'' discounts. TIER_3 (Gold): High-Performance Engine with Loyalty module, Referral tracking, and Whitelabel checkout. 3. User Journey & UI: Input: Logo + Domain. Logic: Real-time availability pull. Output: Hosted site. Coach: The Billboard Effect. 4. Business Logic: RG-01: Stripe required. RG-02: Auto SSL.',
        'TIER_1 (Bronze): Single property landing page with inquiry form. TIER_2 (Silver): Multi-property booking site with real-time calendar and ''Returning Guest'' discounts. TIER_3 (Gold): High-Performance Engine with Loyalty module, Referral tracking, and Whitelabel checkout.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_06',
        NULL,
        'DIM_OPS',
        'PH_6_SCALE',
        'GLOBAL',
        'Team Management',
        'Granular RBAC Operations Portal',
        'Multi-user access control for delegating operations.',
        '1. Pedagogical Objective: Delegation without risk. Teaches process isolation. 2. Behavior Matrix: TIER_1 (Bronze): 1 Co-host (Full access). TIER_2 (Silver): Preset roles (Cleaner, Accountant, Co-host) with restricted views. TIER_3 (Gold): Granular RBAC Portal with feature-level permissions and Security Audit Logging. 3. User Journey & UI: Input: Team email. Logic: Permission masking. Output: Activity log. Coach: Password sharing warning. 4. Business Logic: RG-01: Owner cannot be deleted. RG-02: TIER_3 for custom roles.',
        'TIER_1 (Bronze): 1 Co-host (Full access). TIER_2 (Silver): Preset roles (Cleaner, Accountant, Co-host) with restricted views. TIER_3 (Gold): Granular RBAC Portal with feature-level permissions and Security Audit Logging.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'OPS_07',
        'OPS_06',
        'DIM_OPS',
        'PH_6_SCALE',
        'GLOBAL',
        'Investor Portal',
        'Transparency & ROI Reporting Dashboard',
        'Read-only portal for property owners.',
        '1. Pedagogical Objective: Professionalism as a service. Teaches transparency. 2. Behavior Matrix: TIER_1 (Bronze): Monthly PDF reports. TIER_2 (Silver): Read-Only dashboard for 1 owner with live revenue stats. TIER_3 (Gold): Whitelabel Investor Portal with custom ROI commentary and portfolio performance narratives. 3. User Journey & UI: Input: Manager commentary. Logic: Operational noise filtering. Output: Investor view. Coach: Context over numbers. 4. Business Logic: RG-01: Read-only enforced. RG-02: Manager review mandatory.',
        'TIER_1 (Bronze): Monthly PDF reports. TIER_2 (Silver): Read-Only dashboard for 1 owner with live revenue stats. TIER_3 (Gold): Whitelabel Investor Portal with custom ROI commentary and portfolio performance narratives.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
INSERT INTO features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        scope,
        name,
        description,
        detailed_description,
        dev_prompt,
        behavior_matrix
    )
VALUES (
        'LEG_06',
        NULL,
        'DIM_LEGAL',
        'PH_6_SCALE',
        'LOC_HOST',
        'Company Audit',
        'Structural Wealth Optimization Simulator',
        'Simulation for transitioning to corporate ownership.',
        '1. Pedagogical Objective: Long-term legacy. Teaches ''Succession'' and ''Exit taxes''. 2. Behavior Matrix: TIER_1 (Bronze): Basic IR vs IS calculator. TIER_2 (Silver): Multi-year wealth projection (10 years) including maintenance Capex. TIER_3 (Gold): Structural Wealth Optimization with 20-year exit strategy and Inheritance tax planning. 3. User Journey & UI: Input: Portfolio value. Logic: Wealth Impact simulation. Output: Transition Roadmap. Coach: ''The Trap'' warning. 4. Business Logic: RG-01: Country-specific tax rules. RG-02: Legal disclaimer mandatory.',
        'TIER_1 (Bronze): Basic IR vs IS calculator. TIER_2 (Silver): Multi-year wealth projection (10 years) including maintenance Capex. TIER_3 (Gold): Structural Wealth Optimization with 20-year exit strategy and Inheritance tax planning.'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;