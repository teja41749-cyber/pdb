# BioScreen Virtual Screening App

A full-stack bioinformatics application for virtual screening of drug candidates using Tanimoto similarity (RDKit) and 3D visualization.

## Project Structure

- `frontend/`: React + TypeScript application (This is the root of the generated files).
- `backend/`: Python FastAPI server with RDKit.

## Setup Instructions

### 1. Backend Setup (Python)

Navigate to the `backend/` directory (created in the file output) or move `backend/main.py` and `backend/requirements.txt` to a new folder.

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The server will start at `http://localhost:8000`.

### 2. Frontend Setup (React)

If running locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Usage

1. Open the web app.
2. Enter a valid SMILES string (e.g., `CC(=O)OC1=CC=CC=C1C(=O)O` for Aspirin).
3. Click "Run Screening".
4. If the Backend is running, it performs real Tanimoto calculations using RDKit.
5. If the Backend is NOT running, the app gracefully falls back to a "Demo Mode" with mock data.
6. Click on a result to see the 3D structure.
7. Click "Generate Insights" to use Gemini AI to analyze the molecule (Requires API Key).
