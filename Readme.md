

# 🚗 EV Production Data Analysis Using Spark Libraries (TypeScript)

This project performs large-scale **Electric Vehicle (EV) production and sales data analysis** using **Apache Spark integrated with TypeScript libraries**.  
The goal is to process, clean, transform, and analyze EV datasets and visualize insights through a dashboard.

The project demonstrates how Spark’s distributed computing power can be used inside the **TypeScript ecosystem**, enabling fast and scalable data pipelines.

---

## 📌 Features

### 🔹 Data Processing (TypeScript + Spark)
- Load CSV/JSON EV datasets  
- Clean and preprocess raw EV production data  
- Perform transformations using Spark DataFrames  
- Generate insights such as:
  - Top EV manufacturers  
  - EV type distribution (BEV/PHEV)  
  - Year-wise production trends  
  - Range comparisons  
  - State/region-wise statistics  

### 🔹 Dashboard (React)
- Visualizes processed Spark output  
- Interactive charts & tables  
- Manufacturer ranking  
- Year-wise analytics  
- Color/type distribution  

---

## 🛠️ Tech Stack

### **Backend / Data Processing**
- TypeScript  
- Apache Spark (JavaScript/TypeScript Spark bindings)  
- Node.js  
- CSV/JSON data loaders  

### **Frontend**
- React  
- TypeScript  
- Charting libraries (Bar, Line, Pie charts)

### **Other**
- GitHub  
- VS Code  
- Node Package Manager (npm)

---

## 📁 Project Structure

data-analysis-ev-production-using-spark-libraries/ │ ├── src/ │   ├── processing/       # Spark transformation logic │   ├── utils/            # Helper functions │   ├── index.ts          # Main Spark pipeline entry point │ ├── data/ │   ├── ev_data.csv       # Raw EV dataset │   ├── sample.json       # Test dataset │ ├── dist/                 # Compiled TypeScript output │ ├── spark-react-dashboard/ │   ├── src/              # React dashboard source code │   ├── public/ │   ├── package.json │   └── README.md │ ├── package.json ├── tsconfig.json └── README.md

---

## 🚀 How to Run the Project

### **1️⃣ Clone the repository**
```bash
git clone https://github.com/karthikc1125/data-analysis-ev-production-using-spark-libraries
cd data-analysis-ev-production-using-spark-libraries

2️⃣ Install dependencies

npm install

3️⃣ Compile TypeScript

npm run build

4️⃣ Run Spark Data Processing

(Command may vary depending on Spark wrapper used)

Example:

node dist/index.js

or

spark-submit --master local[4] dist/index.js

5️⃣ Run the Dashboard

cd spark-react-dashboard
npm install
npm start

Dashboard runs at:

http://localhost:3000


---

📊 Output & Insights

After running the pipeline, you will get:

Processed JSON/CSV files ready for visualization

Manufacturer ranking

EV type breakdown

Range comparisons

Yearly EV production growth trends

Clean dashboard visualizations



---

🧠 What This Project Demonstrates

Using Spark with TypeScript instead of Python/Scala

End-to-end data engineering pipeline

Working with large datasets efficiently

Integrating processed data into a React dashboard

Type-safe data transformations



---

📌 Future Enhancements

Add ML-based predictions using Spark MLlib

Deploy dashboard to cloud (Vercel/Netlify)

Add Delta Lake / Parquet storage

Add unit tests for processing pipeline

Introduce CI/CD workflows



---

🤝 Contributions

Contributions are welcome!
Feel free to submit issues or pull requests.


---

📄 License

This project is open-source under the MIT License.


---

