import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HmrcService {
    /**
     * Simulate HMRC Tax calculation for UK Furnished Holiday Let (FHL)
     * This is a simplified "dummy" API behavior for the ROI Predictor.
     */
    async calculateTax(annualIncome: number, expenses: number): Promise<{
        taxableProfit: number;
        estimatedTax: number;
        effectiveRate: number;
        allowancesApplied: string[];
    }> {
        // Artificial delay to simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1000));

        const profit = Math.max(0, annualIncome - expenses);

        // 2024/25 UK Personal Allowance: £12,570
        const personalAllowance = 12570;
        const basicRateLimit = 37700; // Above 12570

        let tax = 0;
        const allowances = ['FHL Business Expense Deduction'];

        if (profit > personalAllowance) {
            allowances.push('Standard Personal Allowance Applied');

            const taxableAtBasic = Math.min(profit - personalAllowance, basicRateLimit);
            tax += taxableAtBasic * 0.20;

            if (profit > (personalAllowance + basicRateLimit)) {
                const taxableAtHigher = Math.min(profit - (personalAllowance + basicRateLimit), 74730);
                tax += taxableAtHigher * 0.40;
            }
        } else {
            allowances.push('Income within Personal Allowance');
        }

        return {
            taxableProfit: profit,
            estimatedTax: tax,
            effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
            allowancesApplied: allowances
        };
    }
}
