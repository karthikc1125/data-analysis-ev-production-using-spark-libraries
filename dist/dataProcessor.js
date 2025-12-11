"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProcessor = void 0;
const fs = __importStar(require("fs"));
class DataProcessor {
    constructor(datasetPath = './data/ev_population_data.csv') {
        this.datasetPath = datasetPath;
    }
    /**
     * Reads the dataset and returns the header and first few rows
     */
    previewData(limit = 5) {
        if (!fs.existsSync(this.datasetPath)) {
            throw new Error(`Dataset not found at ${this.datasetPath}`);
        }
        const data = fs.readFileSync(this.datasetPath, 'utf8');
        const lines = data.split('\n');
        const header = lines[0];
        const rows = lines.slice(1, limit + 1).filter(line => line.trim() !== '');
        return { header, rows };
    }
    /**
     * Gets basic statistics about the dataset
     */
    getDatasetStats() {
        if (!fs.existsSync(this.datasetPath)) {
            throw new Error(`Dataset not found at ${this.datasetPath}`);
        }
        const stats = fs.statSync(this.datasetPath);
        const data = fs.readFileSync(this.datasetPath, 'utf8');
        const lines = data.split('\n');
        const totalRows = lines.length - 1; // Subtract 1 for header
        return {
            totalRows,
            fileSize: stats.size
        };
    }
    /**
     * Processes the dataset to count EVs by make
     */
    countEVsByMake() {
        if (!fs.existsSync(this.datasetPath)) {
            throw new Error(`Dataset not found at ${this.datasetPath}`);
        }
        const data = fs.readFileSync(this.datasetPath, 'utf8');
        const lines = data.split('\n');
        const header = lines[0].split(',');
        // Find the index of the "Make" column
        const makeIndex = header.indexOf('Make');
        if (makeIndex === -1) {
            throw new Error('Make column not found in dataset');
        }
        const makeCount = new Map();
        // Process each row (skip header)
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '')
                continue;
            const columns = lines[i].split(',');
            if (columns.length > makeIndex) {
                const make = columns[makeIndex].trim();
                if (make) {
                    makeCount.set(make, (makeCount.get(make) || 0) + 1);
                }
            }
        }
        return makeCount;
    }
    /**
     * Gets the top N EV makes by count
     */
    getTopMakes(limit = 10) {
        const makeCounts = this.countEVsByMake();
        // Convert to array and sort by count descending
        const sortedMakes = Array.from(makeCounts.entries())
            .map(([make, count]) => ({ make, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        return sortedMakes;
    }
    /**
     * Gets all available years in the dataset
     */
    getAvailableYears() {
        if (!fs.existsSync(this.datasetPath)) {
            throw new Error(`Dataset not found at ${this.datasetPath}`);
        }
        const data = fs.readFileSync(this.datasetPath, 'utf8');
        const lines = data.split('\n');
        const header = lines[0].split(',');
        // Find the index of the "Model Year" column
        const yearIndex = header.indexOf('Model Year');
        if (yearIndex === -1) {
            throw new Error('Model Year column not found in dataset');
        }
        const years = new Set();
        // Process each row (skip header)
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '')
                continue;
            const columns = lines[i].split(',');
            if (columns.length > yearIndex) {
                const year = parseInt(columns[yearIndex].trim());
                if (!isNaN(year)) {
                    years.add(year);
                }
            }
        }
        // Convert to sorted array
        return Array.from(years).sort((a, b) => a - b);
    }
    /**
     * Gets EV statistics for a specific year
     */
    getYearlyStats(year) {
        if (!fs.existsSync(this.datasetPath)) {
            throw new Error(`Dataset not found at ${this.datasetPath}`);
        }
        const data = fs.readFileSync(this.datasetPath, 'utf8');
        const lines = data.split('\n');
        const header = lines[0].split(',');
        // Find column indices
        const yearIndex = header.indexOf('Model Year');
        const makeIndex = header.indexOf('Make');
        const rangeIndex = header.indexOf('Electric Range');
        const typeIndex = header.indexOf('Electric Vehicle Type');
        if (yearIndex === -1) {
            throw new Error('Model Year column not found in dataset');
        }
        let totalEVs = 0;
        const makeCount = new Map();
        let totalRange = 0;
        let rangeCount = 0;
        const typeCount = new Map();
        // Process each row (skip header)
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '')
                continue;
            const columns = lines[i].split(',');
            if (columns.length > Math.max(yearIndex, makeIndex, rangeIndex, typeIndex)) {
                const rowYear = parseInt(columns[yearIndex].trim());
                // Filter by year
                if (rowYear === year) {
                    totalEVs++;
                    // Count makes
                    if (makeIndex !== -1) {
                        const make = columns[makeIndex].trim();
                        if (make) {
                            makeCount.set(make, (makeCount.get(make) || 0) + 1);
                        }
                    }
                    // Calculate average range
                    if (rangeIndex !== -1) {
                        const range = parseInt(columns[rangeIndex].trim());
                        if (!isNaN(range) && range > 0) {
                            totalRange += range;
                            rangeCount++;
                        }
                    }
                    // Count EV types
                    if (typeIndex !== -1) {
                        const type = columns[typeIndex].trim();
                        if (type) {
                            typeCount.set(type, (typeCount.get(type) || 0) + 1);
                        }
                    }
                }
            }
        }
        // Get top makes
        const topMakes = Array.from(makeCount.entries())
            .map(([make, count]) => ({ make, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        // Get EV types
        const evTypes = Array.from(typeCount.entries())
            .map(([type, count]) => ({ type, count }));
        return {
            totalEVs,
            topMakes,
            averageRange: rangeCount > 0 ? Math.round(totalRange / rangeCount) : 0,
            evTypes
        };
    }
    /**
     * Gets color distribution for a specific year
     */
    getColorDistribution(year) {
        // In a real implementation, we would have a color column
        // For now, we'll simulate color distribution based on makes
        const yearlyStats = this.getYearlyStats(year);
        // Simulate color distribution
        const colors = [
            { color: "White", count: Math.floor(yearlyStats.totalEVs * 0.25) },
            { color: "Black", count: Math.floor(yearlyStats.totalEVs * 0.20) },
            { color: "Silver", count: Math.floor(yearlyStats.totalEVs * 0.15) },
            { color: "Blue", count: Math.floor(yearlyStats.totalEVs * 0.12) },
            { color: "Red", count: Math.floor(yearlyStats.totalEVs * 0.08) },
            { color: "Green", count: Math.floor(yearlyStats.totalEVs * 0.07) },
            { color: "Gray", count: Math.floor(yearlyStats.totalEVs * 0.06) },
            { color: "Other", count: Math.floor(yearlyStats.totalEVs * 0.07) }
        ];
        return colors;
    }
}
exports.DataProcessor = DataProcessor;
