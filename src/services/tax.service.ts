import { Injectable } from '@angular/core';

export interface TaxContext {
    country: string;
    ownerCountry?: string;
    revenue: number;
    expenses: number;
}

export interface TaxResult {
    authority: string;
    taxableProfit: number;
    estimatedTax: number;
    effectiveRate: number;
    regime: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaxService {

    async calculateTax(ctx: TaxContext): Promise<TaxResult> {
        // Artificial delay simulation
        await new Promise(resolve => setTimeout(resolve, 800));

        const propertyCountry = ctx.country.toLowerCase().trim();
        const ownerCountry = (ctx.ownerCountry || 'France').toLowerCase().trim();

        // ---------------------------------------------------------
        // MATRIX: PROPERTY IN FRANCE
        // ---------------------------------------------------------
        if (propertyCountry === 'france') {
            if (ownerCountry === 'france') {
                // Resident: LMNP Micro-BIC
                // 50% Abatement, Taxed at TMI (30% est) + Social (17.2%) = ~47.2% on taxable
                const abatement = 0.50;
                const taxable = ctx.revenue * (1 - abatement);
                const tax = taxable * 0.472;
                return this.result('DGFiP (France)', 'LMNP Micro-BIC (Resident)', taxable, tax, ctx.revenue);
            } else {
                // Non-Resident: LMNP
                // 50% Abatement, Min Tax Rate 20% + Social (17.2% often applies or substituted)
                // Simplified: 20% flat min rate on taxable base
                const abatement = 0.50;
                const taxable = ctx.revenue * (1 - abatement);
                const tax = taxable * 0.20; // + Social contributions often apply but let's stick to min tax
                return this.result('DGFiP (France)', 'LMNP (Non-Resident)', taxable, tax, ctx.revenue);
            }
        }

        // ---------------------------------------------------------
        // MATRIX: PROPERTY IN SPAIN
        // ---------------------------------------------------------
        else if (propertyCountry === 'spain' || propertyCountry === 'espagne') {
            const isOwnerEU = ['france', 'germany', 'italy', 'belgium', 'portugal', 'ireland', 'austria', 'netherlands'].includes(ownerCountry);

            if (ownerCountry === 'spain' || ownerCountry === 'espagne') {
                // Resident: Standard Income Tax
                const profit = Math.max(0, ctx.revenue - ctx.expenses);
                const tax = profit * 0.19;
                return this.result('Agencia Tributaria', 'IRPF (Resident)', profit, tax, ctx.revenue);
            } else if (isOwnerEU) {
                // EU Non-Resident (IRNR): 19% on Net Profit
                const profit = Math.max(0, ctx.revenue - ctx.expenses);
                const tax = profit * 0.19;
                return this.result('Agencia Tributaria (Source Tax)', 'IRNR (EU Non-Resident)', profit, tax, ctx.revenue);
            } else {
                // Non-EU Non-Resident (IRNR): 24% on GROSS REVENUE (Severe!)
                const tax = ctx.revenue * 0.24;
                return this.result('Agencia Tributaria (Source Tax)', 'IRNR (Non-EU) - 24% on Gross', ctx.revenue, tax, ctx.revenue);
            }
        }

        // ---------------------------------------------------------
        // MATRIX: PROPERTY IN UK
        // ---------------------------------------------------------
        else if (propertyCountry === 'uk' || propertyCountry === 'united kingdom') {
            // Logic is roughly same for residents vs non-residents mostly due to personal allowance
            // Non-Residents (NRLS) get Personal Allowance too generally.
            // FHL Logic
            const profit = Math.max(0, ctx.revenue - ctx.expenses);
            const personalAllowance = 12570;
            let tax = 0;

            if (profit > personalAllowance) {
                tax = (profit - personalAllowance) * 0.20; // Basic rate
            }

            const label = ownerCountry === 'uk' || ownerCountry === 'united kingdom'
                ? 'HMRC (Resident)'
                : 'HMRC (Non-Resident)';

            return this.result(label, 'Furnished Holiday Let', profit, tax, ctx.revenue);
        }

        // ---------------------------------------------------------
        // GENERIC FALLBACK
        // ---------------------------------------------------------
        else {
            const profit = Math.max(0, ctx.revenue - ctx.expenses);
            const tax = profit * 0.20;
            return this.result('International Estimate', 'Standard Flat Rate', profit, tax, ctx.revenue);
        }
    }

    private result(authority: string, regime: string, taxableProfit: number, estimatedTax: number, revenue: number): TaxResult {
        return {
            authority,
            regime,
            taxableProfit,
            estimatedTax,
            effectiveRate: revenue > 0 ? (estimatedTax / revenue) * 100 : 0
        };
    }
}
