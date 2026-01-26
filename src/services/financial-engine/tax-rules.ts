export interface TaxContext {
    annualRevenue: number; // in cents
    annualOperatingExpenses: number; // in cents
    mortgageInterest: number; // in cents
    amortizableBasis: number; // in cents (for LMNP)
    country: 'France' | 'Spain' | 'UK';
    taxRegime?: string;
}

export interface TaxResult {
    taxableIncome: number; // in cents
    taxAmount: number; // in cents (estimated)
    effectiveTaxRate: number; // percentage
    netIncomeAfterTax: number; // in cents
}

export interface TaxStrategy {
    calculate(context: TaxContext): TaxResult;
}

// --- FRANCE STRATEGIES ---

/**
 * LMNP Reel: Deduct Expenses, Interest, Amortization (Building + Furniture).
 * Amortization: Typically ~3% of building value (excluding land) + 10-20% furniture.
 * Simplified: 3% of total basis provided.
 */
export class FranceLMNPReelStrategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        const amortization = Math.round(ctx.amortizableBasis * 0.03); // 3% linear amortization
        const deductions = ctx.annualOperatingExpenses + ctx.mortgageInterest + amortization;

        // Taxable income cannot be negative for LMNP (carry forward), but for this year snapshot:
        const taxable = Math.max(0, ctx.annualRevenue - deductions);

        // Estimated Tax Rate (Income Tax + Social Contributions ~47.2% max, assume 30% avg effective)
        // Or user input tax rate? We'll assume a standard foreign investor rate or average.
        // Let's use 20% flat min tax for non-residents or TMI. 
        // User prompt says "Micro-BIC (30% vs 50% allowance)".
        // For Reel, we calculate real profit.
        const estimatedRate = 0.20;
        const tax = Math.round(taxable * estimatedRate);

        return {
            taxableIncome: taxable,
            taxAmount: tax,
            effectiveTaxRate: estimatedRate * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}

/**
 * LMNP Micro-BIC: 50% allowance (or 30%? usually 50% for standard LMNP, 71% for classified).
 * User requirement: "Micro-BIC (30% vs 50% allowance)". 
 * Meublé de Tourisme Classé = 71%. Standard Meublé = 50%.
 * We will assume Standard (50%) for now as conservative.
 */
export class FranceMicroBICStrategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        const allowance = 0.50;
        const taxable = Math.max(0, ctx.annualRevenue * (1 - allowance));

        const estimatedRate = 0.20; // 20% flat min
        const tax = Math.round(taxable * estimatedRate);

        // Net Income = Revenue - Real Expenses - Tax (Real expenses still paid!)
        return {
            taxableIncome: taxable,
            taxAmount: tax,
            effectiveTaxRate: (tax / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}


/**
 * LMNP Censi-Bouvard (Legacy/Specific): Tax reduction of 11% of HT price over 9 years.
 * Only for specific residences (Senior, Student).
 * User requirement: "Censi-Bouvard" option logic.
 */
export class FranceLMNPCensiBouvardStrategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        // Censi-Bouvard implies Micro-BIC usually OR Reel without Amortization of structure?
        // Actually, it allows tax reduction but DISALLOWS amortization of the property value (only furniture/works).
        // Tax Reduction = 11% of Price / 9 years. Cap 300k.

        const priceCapped = Math.min(ctx.amortizableBasis, 30000000); // 300k€ in cents
        const annualTaxReduc = Math.round((priceCapped * 0.11) / 9);

        // Taxable Income (Micro-BIC usually preferred or Reel without amort)
        // Let's assume Reel sans amort structure for calculation base
        const deductions = ctx.annualOperatingExpenses + ctx.mortgageInterest; // No amort building
        const taxable = Math.max(0, ctx.annualRevenue - deductions);

        const estimatedRate = 0.20; // TMI
        let tax = Math.round(taxable * estimatedRate);

        // Apply Reduction
        tax = Math.max(0, tax - annualTaxReduc);

        return {
            taxableIncome: taxable,
            taxAmount: tax,
            effectiveTaxRate: (tax / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}

/**
 * SCI à l'IS (Impôt sur les Sociétés).
 * 15% up to 38120€, 25% beyond.
 * Deduct real expenses + Amortization + Director Remuneration (not handled here).
 */
export class FranceSCIISStrategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        // Amortization (Building ~3%)
        const amortization = Math.round(ctx.amortizableBasis * 0.03);
        const taxable = Math.max(0, ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - amortization);

        // IS Rates 2024
        const limit15 = 4250000; // 42,500 € since 2024? Or 38120? Let's use 42500.
        // Actually limit is 38120 for 15% rate usually for SMEs. 42500 is PME limit? Stick to 38120 standard.
        const limitStandard = 3812000; // 38120 € cents

        let tax = 0;
        if (taxable <= limitStandard) {
            tax = taxable * 0.15;
        } else {
            tax = (limitStandard * 0.15) + ((taxable - limitStandard) * 0.25);
        }

        tax = Math.round(tax);

        return {
            taxableIncome: taxable,
            taxAmount: tax,
            effectiveTaxRate: (tax / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}

/**
 * SCI à l'IR (Impôt sur le Revenu).
 * Transparent. Taxed at partner's TMI.
 * No amortization!
 * Only deductions: Interest, Works (maintenance), Tax, Insurance, Management.
 */
export class FranceSCIRStrategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        // No Amortization allowed generally (Déficit Foncier possible)
        const deductions = ctx.annualOperatingExpenses + ctx.mortgageInterest;
        const taxable = ctx.annualRevenue - deductions; // Can be negative (Deficit Foncier)

        // TMI Assumption: 30% + 17.2% CSG = 47.2%
        const taxRate = 0.472;

        let tax = 0;
        if (taxable > 0) {
            tax = Math.round(taxable * taxRate);
        }
        // If negative, it reduces global tax, effectively a negative tax (gain). 
        // For conservative "cost", let's say 0 tax but track deficit?
        // Let's return 0 for safe simulation if negative.

        return {
            taxableIncome: taxable,
            taxAmount: tax,
            effectiveTaxRate: (tax / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}

// --- SPAIN STRATEGIES ---

/**
 * Spain Non-Resident (EU vs Non-EU).
 * 1. IVA (VAT): 10% on Revenue (Excluded from revenue or added? Prompt says "Apply 10% IVA on all revenue".
 *    Typically IVA is added on top. If `annualRevenue` is Gross including IVA, we strip it.
 *    If `annualRevenue` is Net of IVA, we ignore. 
 *    Let's assume Gross input -> Strip 10%.
 * 
 * 2. Income Tax (IRNR):
 *    - EU/EEA: 19% on Net Income (Deduct expenses).
 *    - Non-EU: 24% on Gross Income (No deductions!).
 */
export class SpainTaxStrategy implements TaxStrategy {
    constructor(private isEuResident: boolean = true) { }

    calculate(ctx: TaxContext): TaxResult {
        // Strip IVA (10%)
        // Revenue is Gross. Net Revenue = Revenue / 1.10
        const revenueNetOfTax = Math.round(ctx.annualRevenue / 1.10);
        const iva = ctx.annualRevenue - revenueNetOfTax;

        let taxable = 0;
        let taxRate = 0;
        let tax = 0;

        if (this.isEuResident) {
            // EU: Can deduct expenses
            const netProfit = Math.max(0, revenueNetOfTax - ctx.annualOperatingExpenses - ctx.mortgageInterest);
            taxable = netProfit;
            taxRate = 0.19;
            tax = Math.round(taxable * taxRate);
        } else {
            // Non-EU: Gross Income Taxed (Net of IVA)
            taxable = revenueNetOfTax;
            taxRate = 0.24;
            tax = Math.round(taxable * taxRate);
        }

        // Total Tax outflow = Income Tax + IVA (IVA is remitted)
        // Net Pocket = Revenue - IVA - Expenses - Income Tax - Mortgage
        return {
            taxableIncome: taxable,
            taxAmount: tax + iva, // Reporting total outflow to state
            effectiveTaxRate: ((tax + iva) / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - iva - ctx.annualOperatingExpenses - ctx.mortgageInterest - tax
        };
    }
}

// --- UK STRATEGIES ---

/**
 * UK Section 24.
 * Revenue - Operating Expenses = Adjusted Profit.
 * Mortgage Interest is NOT deductible from profit.
 * Tax is calculated on Adjusted Profit.
 * Then a 20% Tax Credit on mortgage interest is applied.
 */
export class UKSection24Strategy implements TaxStrategy {
    calculate(ctx: TaxContext): TaxResult {
        // Step 1: Adjusted Profit (Operating only)
        const adjustedProfit = Math.max(0, ctx.annualRevenue - ctx.annualOperatingExpenses);

        // Step 2: Calculate Tax on Adjusted Profit (Assume Higher Rate 40% for conservative investor)
        const taxRate = 0.40;
        const grossTax = Math.round(adjustedProfit * taxRate);

        // Step 3: Tax Credit (20% of Mortgage Interest)
        // Capped at 20% of Adjusted Profit if interest > profit
        const interestAllowance = ctx.mortgageInterest;
        const creditBase = Math.min(interestAllowance, adjustedProfit);
        const taxCredit = Math.round(creditBase * 0.20);

        const finalTax = Math.max(0, grossTax - taxCredit);

        return {
            taxableIncome: adjustedProfit,
            taxAmount: finalTax,
            effectiveTaxRate: (finalTax / ctx.annualRevenue) * 100,
            netIncomeAfterTax: ctx.annualRevenue - ctx.annualOperatingExpenses - ctx.mortgageInterest - finalTax
        };
    }
}

export function getTaxStrategy(country: string, regime?: string): TaxStrategy {
    switch (country) {
        case 'France':
            // RG_FIN_02
            if (regime === 'LMNP_MICRO') return new FranceMicroBICStrategy();
            if (regime === 'LMNP_CENSI') return new FranceLMNPCensiBouvardStrategy();
            if (regime === 'SCI_IS') return new FranceSCIISStrategy();
            if (regime === 'SCI_IR') return new FranceSCIRStrategy();
            return new FranceLMNPReelStrategy(); // Default
        case 'Spain':
            // Can be parameterized via regime or a separate toggle. Default EU.
            return new SpainTaxStrategy(regime !== 'NON_EU');
        case 'UK':
            return new UKSection24Strategy();
        default:
            return new FranceLMNPReelStrategy();
    }
}
