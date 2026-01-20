import { FinancialCalculator } from './src/services/financial-engine/engine';
import { TierLevel, FinancialInput } from './src/services/financial-engine/types';

const calculator = new FinancialCalculator();

console.log('--- STARTING VALIDATION ---');

// SCENARIO 1: BASIC
const basicInput: FinancialInput = {
    tier: TierLevel.BASIC,
    grossMonthlyRevenue: 500000, // $5,000.00
    fixedCosts: [100000, 50000], // $1,500.00
    variableCosts: [20000]       // $200.00
};
// Expected: 5000 - 1500 - 200 = 3300 ($3,300.00)
const basicRes = calculator.calculate(basicInput);
console.log(`[Basic] Net Cash Flow: ${basicRes.netMonthlyCashFlow} (Expected: 330000) -> ${basicRes.netMonthlyCashFlow === 330000 ? 'PASS' : 'FAIL'}`);


// SCENARIO 2: LOW (ROI)
const lowInput: FinancialInput = {
    ...basicInput,
    tier: TierLevel.LOW,
    initialInvestment: 10000000 // $100,000.00
};
// Annual Net = 3300 * 12 = 39,600
// ROI = (39,600 / 100,000) * 10 = 39.6%
// Payback = 100,000 / 3,300 = 30.30 months
const lowRes = calculator.calculate(lowInput);
console.log(`[Low] ROI: ${lowRes.annualizedROI}% (Expected: 39.6) -> ${lowRes.annualizedROI === 39.6 ? 'PASS' : 'FAIL'}`);
console.log(`[Low] Payback: ${lowRes.paybackPeriodMonths?.toFixed(2)} (Expected: 30.30) -> ${lowRes.paybackPeriodMonths?.toFixed(2) === '30.30' ? 'PASS' : 'FAIL'}`);


// SCENARIO 3: MEDIUM (KPIs)
const medInput: FinancialInput = {
    ...lowInput,
    tier: TierLevel.MEDIUM,
    totalBookedDays: 200,
    totalAvailableDays: 365
};
// Revenue Annual (simulated) = 5000 * 12 = 60,000 (Wait, basicInput monthly was 5000, so annual is 60000)
// ADR = 60,000 / 200 = 300
// Occupancy = (200 / 365) * 100 = 54.79...
// RevPAR = 300 * (54.79... / 100) = 164.38
const medRes = calculator.calculate(medInput);
console.log(`[Medium] ADR: ${medRes.adr} (Expected: 30000 - assuming cents)`);
// Note: verify logic. basicInput revenue 500000 cents ($5000). Annual = 6,000,000 cents ($60,000).
// Booked days 200. ADR = 6,000,000 / 200 = 30,000 cents ($300). Correct.

console.log(`[Medium] Occupancy: ${medRes.occupancyRate?.toFixed(2)}% (Expected: 54.79)`);


// SCENARIO 4: EXPERT (Investment)
const expertInput: FinancialInput = {
    ...medInput,
    tier: TierLevel.EXPERT,
    purchasePrice: 20000000, // $200,000.00
    depreciationYearType: 'RESIDENTIAL_27_5'
};
// NOI (Annual) = Revenue (60,000) - OpEx(1700 * 12 = 20,400) = 39,600 ($39,600.00)
// Cap Rate = 39,600 / 200,000 = 19.8%
// Depr = 200,000 / 27.5 = 7,272.72...
const expertRes = calculator.calculate(expertInput);
console.log(`[Expert] NOI: ${expertRes.noi} (Expected: 3960000)`);
console.log(`[Expert] Cap Rate: ${expertRes.capRate}% (Expected: 19.8)`);


console.log('--- END VALIDATION ---');
