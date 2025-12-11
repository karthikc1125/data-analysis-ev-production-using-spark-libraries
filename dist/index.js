"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataProcessor_1 = require("./dataProcessor");
async function main() {
    console.log('Spark TypeScript Project Initialization');
    try {
        // Initialize the data processor
        const dataProcessor = new dataProcessor_1.DataProcessor('./data/ev_population_data.csv');
        // Get dataset statistics
        const stats = dataProcessor.getDatasetStats();
        console.log(`\nDataset Statistics:`);
        console.log(`Total Rows: ${stats.totalRows}`);
        console.log(`File Size: ${stats.fileSize} bytes`);
        // Preview the data
        console.log(`\nDataset Preview:`);
        const preview = dataProcessor.previewData(5);
        console.log('Header:', preview.header);
        console.log('First 5 rows:');
        preview.rows.forEach((row, index) => {
            console.log(`${index + 1}: ${row.substring(0, 100)}...`);
        });
        // Get top EV makes
        console.log(`\nTop 10 EV Makes:`);
        const topMakes = dataProcessor.getTopMakes(10);
        topMakes.forEach((item, index) => {
            console.log(`${index + 1}. ${item.make}: ${item.count} vehicles`);
        });
        // Get available years
        console.log(`\nAvailable Years:`);
        try {
            const years = dataProcessor.getAvailableYears();
            console.log(years.join(', '));
            // Get stats for a specific year (e.g., 2020)
            if (years.length > 0) {
                const year = years[years.length - 1]; // Use the most recent year
                console.log(`\nStatistics for ${year}:`);
                const yearlyStats = dataProcessor.getYearlyStats(year);
                console.log(`Total EVs: ${yearlyStats.totalEVs}`);
                console.log(`Average Range: ${yearlyStats.averageRange} miles`);
                console.log(`Top Makes:`);
                yearlyStats.topMakes.forEach((item, index) => {
                    console.log(`  ${index + 1}. ${item.make}: ${item.count} vehicles`);
                });
            }
        }
        catch (yearError) {
            console.error('Error processing yearly data:', yearError);
        }
        console.log('\nProject setup complete. Ready to process datasets with Spark.');
        // TODO: Initialize Spark client with appropriate configuration for actual Spark processing
        // const spark = new SparkClient({ 
        //   env: 'your-env', 
        //   tenant: 'your-tenant', 
        //   apiKey: 'your-api-key' 
        // });
    }
    catch (error) {
        console.error('Error processing data:', error);
    }
}
main().catch(console.error);
