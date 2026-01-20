import { TierLevel } from './types';

/**
 * Calculates the Net Monthly Cash Flow (Tier 1).
 * Formula: Revenue - (Fixed Costs + Variable Costs)
 * @param revenue Gross Monthly Revenue in cents
 * @param fixed Total Fixed Costs in cents
 * @param variable Total Variable Costs in cents
 * @returns Net Monthly Cash Flow in cents
 */
export function calculateNetMonthlyCashFlow(revenue: number, fixed: number, variable: number): number {
    return revenue - (fixed + variable);
}

/**
 * Calculates Annualized ROI (Tier 2).
 * Formula: (Annual Net Profit / Total Investment) * 100
 * @param annualNetProfit Annual Net Profit in cents
 * @param totalInvestment Initial Investment in cents
 * @returns ROI as a percentage (e.g., 15.5 for 15.5%)
 */
export function calculateAnnualizedROI(annualNetProfit: number, totalInvestment: number): number {
    if (totalInvestment === 0) return 0;
    return (annualNetProfit / totalInvestment) * 100;
}

/**
 * Calculates Payback Period in Months (Tier 2).
 * Formula: Total Investment / Monthly Net Cash Flow
 * @param totalInvestment Initial Investment in cents
 * @param monthlyNetCashFlow Average Monthly Net Cash Flow in cents
 * @returns Payback Period in months
 */
export function calculatePaybackPeriod(totalInvestment: number, monthlyNetCashFlow: number): number {
    if (monthlyNetCashFlow <= 0) return -1; // Never pays back if flow is negative or zero
    return totalInvestment / monthlyNetCashFlow;
}

/**
 * Calculates Average Daily Rate (ADR) (Tier 3).
 * Formula: Total Revenue / Total Booked Days
 * @param totalRevenue Total Revenue in cents
 * @param bookedDays Total Booked Days
 * @returns ADR in cents
 */
export function calculateADR(totalRevenue: number, bookedDays: number): number {
    if (bookedDays === 0) return 0;
    return Math.round(totalRevenue / bookedDays);
}

/**
 * Calculates Occupancy Rate (Tier 3).
 * Formula: (Booked Days / Available Days) * 100
 * @param bookedDays Total Booked Days
 * @param availableDays Total Available Days
 * @returns Occupancy Rate as a percentage
 */
export function calculateOccupancyRate(bookedDays: number, availableDays: number): number {
    if (availableDays === 0) return 0;
    return (bookedDays / availableDays) * 100;
}

/**
 * Calculates RevPAR (Revenue Per Available Rental) (Tier 3).
 * Formula: ADR * (Occupancy Rate / 100)
 * @param adr Average Daily Rate in cents
 * @param occupancyRate Occupancy Rate percentage
 * @returns RevPAR in cents
 */
export function calculateRevPAR(adr: number, occupancyRate: number): number {
    return Math.round(adr * (occupancyRate / 100));
}

/**
 * Calculates Sinking Fund Contribution (Tier 3).
 * Recommended: 1-5% of Gross Revenue for maintenance.
 * @param grossRevenue Gross Revenue in cents
 * @param percentage Percentage relative to revenue (default 3%)
 * @returns Recommended monthly reserve in cents
 */
export function calculateSinkingFund(grossRevenue: number, percentage: number = 3): number {
    return Math.round(grossRevenue * (percentage / 100));
}

/**
 * Calculates Net Operating Income (NOI) (Tier 4).
 * Formula: Gross Income - Operating Expenses (excluding debt service & dep)
 * @param grossIncome Gross Annual Income in cents
 * @param operatingExpenses Annual Operating Expenses in cents
 * @returns NOI in cents
 */
export function calculateNOI(grossIncome: number, operatingExpenses: number): number {
    return grossIncome - operatingExpenses;
}

/**
 * Calculates Cap Rate (Tier 4).
 * Formula: (NOI / Purchase Price) * 100
 * @param noi Net Operating Income in cents
 * @param purchasePrice Purchase Price in cents
 * @returns Cap Rate as a percentage
 */
export function calculateCapRate(noi: number, purchasePrice: number): number {
    if (purchasePrice === 0) return 0;
    return (noi / purchasePrice) * 100;
}

/**
 * Calculates Cash-on-Cash Return (Tier 4).
 * Formula: (Annual Pre-Tax Cash Flow / Total Cash Invested) * 100
 * @param annualPreTaxCashFlow Annual Cash Flow before taxes in cents
 * @param totalCashInvested Total Cash Outlay (Downpayment + Closing + Reno) in cents
 * @returns Cash-on-Cash Return as a percentage
 */
export function calculateCashOnCash(annualPreTaxCashFlow: number, totalCashInvested: number): number {
    if (totalCashInvested === 0) return 0;
    return (annualPreTaxCashFlow / totalCashInvested) * 100;
}

/**
 * Calculates Annual Tax Depreciation (Tier 4 - MACRS/Straight-line).
 * Formula: (Cost Basis - Land Value) / Useful Life
 * Note: Simplified here as Cost Basis / Useful Life for the prompt, neglecting Land Value split unless input provided.
 * @param costBasis Allowable Cost Basis in cents (Purchase + Reno + Closings - Land)
 * @param usefulLifeYears 27.5 or 39
 * @returns Annual Depreciation Deduction in cents
 */
export function calculateTaxDepreciation(costBasis: number, usefulLifeYears: number): number {
    if (usefulLifeYears === 0) return 0;
    return Math.round(costBasis / usefulLifeYears);
}

/**
 * Calculates EBITDA (Tier 4).
 * Formula: Net Income + Interest + Taxes + Depreciation + Amortization
 * Or simplified: NOI - Non-Operating Expenses (if any)
 * In Real Estate context: NOI is effectively EBITDA in many simple models before debt service.
 * But strictly: EBITDA = Revenue - Expenses (excluding Interest, Tax, Depr, Amort).
 * So actually, NOI is extremely close to EBITDA for property level analysis.
 * We will return NOI as EBITDA proxy unless specific non-operating costs exist.
 * @param noi Net Operating Income
 * @returns EBITDA proxy
 */
export function calculateEBITDA(noi: number): number {
    return noi;
}

/**
 * Calculates Monthly Mortgage Payment (Principal + Interest).
 * Formula: P * (r(1+r)^n) / ((1+r)^n - 1)
 * @param principal Loan Amount in cents
 * @param annualRate Annual Interest Rate (percentage)
 * @param years Loan Term in years
 * @returns Monthly Payment in cents
 */
export function calculateMonthlyLoanPayment(principal: number, annualRate: number, years: number): number {
    if (principal <= 0 || years <= 0) return 0;
    if (annualRate === 0) return Math.round(principal / (years * 12));

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

    return Math.round(principal * (numerator / denominator));
}

/**
 * Generates an Amortization Schedule.
 */
export function generateAmortizationSchedule(principal: number, annualRate: number, years: number) {
    const monthlyPayment = calculateMonthlyLoanPayment(principal, annualRate, years);
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    const schedule = [];

    // Aggregate by year for the interface, or return monthly? 
    // Requirement is "number of graph to display performance", assuming yearly is cleaner.

    let totalInterest = 0;

    // We'll return a yearly summary
    // Typically loop months
    const totalMonths = years * 12;

    let currentYearInterest = 0;
    let currentYearPrincipal = 0;

    for (let m = 1; m <= totalMonths; m++) {
        const interestPayment = Math.round(balance * monthlyRate);
        const principalPayment = monthlyPayment - interestPayment;

        // Handle last payment adjustments
        const actualPrincipal = (balance - principalPayment < 0) ? balance : principalPayment;

        balance -= actualPrincipal;
        totalInterest += interestPayment;

        currentYearInterest += interestPayment;
        currentYearPrincipal += actualPrincipal;

        if (m % 12 === 0 || m === totalMonths) {
            schedule.push({
                year: Math.ceil(m / 12),
                interest: currentYearInterest,
                principal: currentYearPrincipal,
                balance: Math.max(0, Math.round(balance))
            });
            currentYearInterest = 0;
            currentYearPrincipal = 0;
        }
    }

    return {
        monthlyPayment,
        totalInterest,
        yearlyAmortization: schedule
    };
}

/**
 * Generates 10-Year Projections.
 */
export function generateProjections(
    startRevenue: number,
    startExpenses: number,
    annualRevenueIncrease: number, // percentage
    annualExpenseIncrease: number, // percentage
    initialInvestment: number,
    mortgageDetails?: { monthlyPayment: number; yearlyAmortization: any[] }
) {
    const projections = [];
    let currentRevenue = startRevenue;
    let currentExpenses = startExpenses;
    let totalEquity = initialInvestment; // Simplified equity tracking

    for (let year = 1; year <= 10; year++) {
        // Apply growth
        if (year > 1) {
            currentRevenue = Math.round(currentRevenue * (1 + annualRevenueIncrease / 100));
            currentExpenses = Math.round(currentExpenses * (1 + annualExpenseIncrease / 100));
        }

        const noi = currentRevenue - currentExpenses;

        let debtService = 0;
        let principalPaid = 0;

        if (mortgageDetails) {
            debtService = mortgageDetails.monthlyPayment * 12;
            const amortYear = mortgageDetails.yearlyAmortization.find(a => a.year === year);
            if (amortYear) {
                principalPaid = amortYear.principal;
            }
        }

        const cashFlow = noi - debtService;
        totalEquity += principalPaid; // Equity grows by principal paydown (ignoring appreciation for now to keep it simpler)

        projections.push({
            year,
            revenue: currentRevenue,
            expenses: currentExpenses,
            noi,
            cashFlow,
            equity: totalEquity,
            roi: (cashFlow / initialInvestment) * 100 // Cash ROI
        });
    }

    return projections;
}

/**
 * Calculates Internal Rate of Return (IRR) using Newton-Raphson approximation.
 * @param cashFlows Array of cash flows [Initial Investment (negative), Year 1, Year 2, ..., Final Year + Sale Proceeds]
 * @returns IRR as a percentage (e.g. 12.5)
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
    const maxIterations = 1000;
    const tolerance = 0.000001;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0;

        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + guess, t);
            dNpv -= (t * cashFlows[t]) / Math.pow(1 + guess, t + 1);
        }

        const newGuess = guess - npv / dNpv;

        if (Math.abs(newGuess - guess) < tolerance) {
            return newGuess * 100;
        }

        guess = newGuess;
    }

    return 0; // Failed to converge
}

/**
 * Calculates Break-Even Occupancy Percentage.
 * Formula: (Total Fixed Costs + Debt Service) / (Gross Potential Revenue - Variable Cost % * Gross Potential Revenue)
 * Simplified: (Fixed Costs + Annual Loan Payment) / (Gross Annual Potential Revenue - Variable Costs that are occupancy dependent)
 * 
 * Better heuristic for short-term rental: 
 * Required Revenue to Break Even = Fixed Costs + Loan Payment
 * Break Even Occupancy = Required Revenue / (ADR * 365)
 * @param annualFixedCosts Total Annual Fixed Costs
 * @param annualDebtService Total Annual Loan Payments
 * @param adr Average Daily Rate
 * @returns Break Even Occupancy % (e.g. 55.4)
 */
export function calculateBreakEvenOccupancy(annualFixedCosts: number, annualDebtService: number, adr: number): number {
    const requiredRevenue = annualFixedCosts + annualDebtService;
    const potentialRevenue = adr * 365;

    if (potentialRevenue === 0) return 0;

    return (requiredRevenue / potentialRevenue) * 100;
}

import { MarketType } from './types';

/**
 * Returns a 12-month seasonality factor array based on Market Type.
 * 1.0 = Average Month. >1.0 = Peak. <1.0 = Low.
 */
export function getSeasonalityFactors(type: MarketType): number[] {
    // Default Flat
    const flat = Array(12).fill(1.0);

    switch (type) {
        case MarketType.SEASONAL_HIGH: // Ski: High Dec-Mar, Low Summer (maybe some hike)
            // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
            return [1.5, 1.6, 1.4, 0.8, 0.5, 0.6, 0.9, 1.0, 0.6, 0.5, 0.6, 1.8];

        case MarketType.LUXURY_COASTAL: // Summer Peak
        case MarketType.URBAN_COASTAL:
        case MarketType.PREMIUM_COASTAL:
        case MarketType.BOUTIQUE_COASTAL:
        case MarketType.WEEKEND_COASTAL:
        case MarketType.SPORTS_COASTAL:
        case MarketType.NATURE_COASTAL:
            return [0.5, 0.5, 0.7, 0.9, 1.1, 1.4, 1.8, 1.7, 1.3, 0.8, 0.6, 0.7];

        case MarketType.URBAN_STRICT: // Paris/London year round with slight dips/peaks
        case MarketType.GLOBAL_HUB:
        case MarketType.URBAN_BUSINESS:
        case MarketType.CITY_CENTRAL:
        case MarketType.URBAN_GROWTH:
        case MarketType.URBAN_VALUE:
            return [0.8, 0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 0.9, 1.1, 1.0, 0.9, 1.2]; // Dec peak for holidays

        case MarketType.URBAN_FESTIVAL: // Edinburgh (August Peak)
            return [0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.9, 1.0, 0.9, 0.8, 1.0];

        case MarketType.HERITAGE_RURAL:
        case MarketType.FAMILY_RURAL:
        case MarketType.LUXURY_RURAL:
        case MarketType.WINE_TOURISM: // Sep/Oct Harvest
            return [0.4, 0.4, 0.6, 0.8, 1.0, 1.1, 1.3, 1.3, 1.4, 0.9, 0.5, 0.6];

        case MarketType.HIGH_END_ISLAND: // Balearic / Canary (Canary is steadier, but balearic is peaky)
            // Assuming Balearic profile for "High End Island" as typical summer destination
            return [0.3, 0.4, 0.6, 0.9, 1.2, 1.5, 1.8, 1.8, 1.4, 0.9, 0.5, 0.4];

        case MarketType.STEADY_STATE: // Canary Islands (Warm Winter)
            return [1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 0.9, 1.0, 1.1, 1.3];

        default:
            return flat;
    }
}
