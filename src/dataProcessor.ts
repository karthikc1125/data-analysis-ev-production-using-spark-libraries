import * as fs from 'fs';
import * as path from 'path';

export class DataProcessor {
  private datasetPath: string;

  constructor(datasetPath: string = './data/ev_population_data.csv') {
    this.datasetPath = datasetPath;
  }

  /**
   * Reads the dataset and returns the header and first few rows
   */
  public previewData(limit: number = 5): { header: string; rows: string[] } {
    try {
      if (!fs.existsSync(this.datasetPath)) {
        throw new Error(`Dataset not found at ${this.datasetPath}`);
      }

      const data = fs.readFileSync(this.datasetPath, 'utf8');
      const lines = data.split('\n');
      const header = lines[0];
      const rows = lines.slice(1, limit + 1).filter(line => line.trim() !== '');

      return { header, rows };
    } catch (error) {
      console.error('Error in previewData:', error);
      return { header: '', rows: [] };
    }
  }

  /**
   * Gets basic statistics about the dataset
   */
  public getDatasetStats(): { totalRows: number; fileSize: number } {
    try {
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
    } catch (error) {
      console.error('Error in getDatasetStats:', error);
      return { totalRows: 0, fileSize: 0 };
    }
  }

  /**
   * Processes the dataset to count EVs by make
   */
  public countEVsByMake(): Map<string, number> {
    try {
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

      const makeCount = new Map<string, number>();
      
      // Process each row (skip header)
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const columns = lines[i].split(',');
        if (columns.length > makeIndex) {
          const make = columns[makeIndex].trim();
          if (make) {
            makeCount.set(make, (makeCount.get(make) || 0) + 1);
          }
        }
      }

      return makeCount;
    } catch (error) {
      console.error('Error in countEVsByMake:', error);
      return new Map<string, number>();
    }
  }

  /**
   * Gets the top N EV makes by count
   */
  public getTopMakes(limit: number = 10): { make: string; count: number }[] {
    try {
      const makeCounts = this.countEVsByMake();
      
      // Convert to array and sort by count descending
      const sortedMakes = Array.from(makeCounts.entries())
        .map(([make, count]) => ({ make, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return sortedMakes;
    } catch (error) {
      console.error('Error in getTopMakes:', error);
      return [];
    }
  }

  /**
   * Gets all available years in the dataset
   */
  public getAvailableYears(): number[] {
    try {
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

      const years = new Set<number>();
      
      // Process each row (skip header)
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
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
    } catch (error) {
      console.error('Error in getAvailableYears:', error);
      return [];
    }
  }

  /**
   * Gets EV statistics for a specific year
   */
  public getYearlyStats(year: number): { 
    totalEVs: number; 
    topMakes: { make: string; count: number }[]; 
    averageRange: number;
    evTypes: { type: string; count: number }[];
  } {
    try {
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
      const makeCount = new Map<string, number>();
      let totalRange = 0;
      let rangeCount = 0;
      const typeCount = new Map<string, number>();
      
      // Process each row (skip header)
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
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
    } catch (error) {
      console.error(`Error in getYearlyStats for year ${year}:`, error);
      return {
        totalEVs: 0,
        topMakes: [],
        averageRange: 0,
        evTypes: []
      };
    }
  }

  /**
   * Gets color distribution for a specific year
   */
  public getColorDistribution(year: number): { color: string; count: number; hex: string }[] {
    try {
      // In a real implementation, we would have a color column
      // For now, we'll simulate color distribution based on makes
      const yearlyStats = this.getYearlyStats(year);
      
      // Simulate color distribution with hex values
      const colors = [
        { color: "White", count: Math.floor(yearlyStats.totalEVs * 0.25), hex: "#FFFFFF" },
        { color: "Black", count: Math.floor(yearlyStats.totalEVs * 0.20), hex: "#000000" },
        { color: "Silver", count: Math.floor(yearlyStats.totalEVs * 0.15), hex: "#C0C0C0" },
        { color: "Blue", count: Math.floor(yearlyStats.totalEVs * 0.12), hex: "#0000FF" },
        { color: "Red", count: Math.floor(yearlyStats.totalEVs * 0.08), hex: "#FF0000" },
        { color: "Green", count: Math.floor(yearlyStats.totalEVs * 0.07), hex: "#008000" },
        { color: "Gray", count: Math.floor(yearlyStats.totalEVs * 0.06), hex: "#808080" },
        { color: "Other", count: Math.floor(yearlyStats.totalEVs * 0.07), hex: "#800080" }
      ];
      
      return colors;
    } catch (error) {
      console.error(`Error in getColorDistribution for year ${year}:`, error);
      return [];
    }
  }
}