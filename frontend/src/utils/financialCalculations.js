// Utility functions for Financial Calculations

// Helper to parse float safely
const val = (v) => parseFloat(v) || 0;

/**
 * Calculate 5-Year Projection based on Base Year and Growth Rate
 * @param {number} baseValue - Value in Year 0
 * @param {number} growthRate - Annual growth rate (percentage, e.g., 2.5 for 2.5%)
 * @returns {number[]} Array of 5 values
 */
export const projectValue = (baseValue, growthRate) => {
    const rate = val(growthRate) / 100;
    let current = val(baseValue);
    const projection = [];
    for (let i = 1; i <= 5; i++) {
        current = current * (1 + rate);
        projection.push(current);
    }
    return projection;
};

/**
 * Calculate Depreciation (Straight Line)
 * @param {Array} assets - List of assets { valor, vida_util (optional, default 10) }
 * @returns {number} Annual depreciation
 */
export const calculateDepreciation = (assets) => {
    return assets.reduce((sum, asset) => {
        // Default 10 years if not specified, or standard rates could be applied
        const years = asset.vida_util || 10;
        return sum + (val(asset.valor) / years);
    }, 0);
};

/**
 * Calculate Net Present Value (VAN)
 * @param {number} rate - Discount rate (percentage)
 * @param {number} initialInvestment - Initial outlay (positive number, will be subtracted)
 * @param {number[]} cashFlows - Array of net cash flows for years 1-5
 * @returns {number} VAN
 */
export const calculateVAN = (rate, initialInvestment, cashFlows) => {
    const r = val(rate) / 100;
    let van = -val(initialInvestment);

    cashFlows.forEach((flow, i) => {
        van += flow / Math.pow(1 + r, i + 1);
    });

    return van;
};

/**
 * Calculate Internal Rate of Return (TIR)
 * Uses Newton-Raphson approximation
 * @param {number} initialInvestment 
 * @param {number[]} cashFlows 
 * @returns {number} TIR (percentage)
 */
export const calculateTIR = (initialInvestment, cashFlows) => {
    let guess = 0.1; // 10% initial guess
    const maxIter = 1000;
    const tolerance = 0.00001;
    const investment = -val(initialInvestment);

    for (let i = 0; i < maxIter; i++) {
        let npv = investment;
        let dNpv = 0; // Derivative of NPV

        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + guess, t + 1);
            dNpv -= ((t + 1) * cashFlows[t]) / Math.pow(1 + guess, t + 2);
        }

        const newGuess = guess - npv / dNpv;

        if (Math.abs(newGuess - guess) < tolerance) {
            return newGuess * 100;
        }

        guess = newGuess;
    }

    return null; // Failed to converge
};

/**
 * Calculate Payback Period (Periodo de Recuperación)
 * @param {number} initialInvestment 
 * @param {number[]} cashFlows 
 * @returns {string} Text description
 */
export const calculatePayback = (initialInvestment, cashFlows) => {
    let cumulative = -val(initialInvestment);
    for (let i = 0; i < cashFlows.length; i++) {
        cumulative += cashFlows[i];
        if (cumulative >= 0) {
            return `${i} años y ${(1 - (cumulative / cashFlows[i])) * 12} meses`;
        }
    }
    return "Mayor a 5 años";
};
