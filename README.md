# Gies Sustainability Dashboard

## Introduction

The Gies Sustainability Dashboard is an interactive web application designed to visualize and analyze sustainability-related research data. It provides insights into various sustainability metrics, including contributions to the United Nations Sustainable Development Goals (SDGs), faculty engagement, and publication trends. This dashboard is built using modern web technologies to ensure a responsive and user-friendly experience.

## Features

- **Interactive Charts and Graphs:** Visualize data through dynamic charts that provide insights into sustainability metrics.
- **SDG Relevance Classification:** Automatically classify research articles based on their relevance to the UN SDGs.
- **Faculty and Department Analysis:** Analyze contributions from different faculties and departments within the organization.
- **Journal Type Distribution:** Understand the distribution of articles across different journal types, including top journals and business journals.
- **Growth Rate Analysis:** Track the growth rate of publications over time, with a focus on sustainability-related articles.

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Python, Pandas, Selenium, Requests
- **Data Processing:** Langchain, FAISS for vector similarity search
- **Deployment:** Compatible with platforms like Netlify or Vercel

## Getting Started

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js and npm installed. You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for managing Node.js versions.
- **Python:** Make sure Python is installed for running data processing scripts.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install Frontend Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Python Environment:**

   Create a virtual environment and install Python dependencies:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

5. **Run Data Processing Scripts:**

   Execute the Python scripts as needed for data processing:

   ```bash
   python data/determine.py
   python data/data.py
   python data/main.py
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
