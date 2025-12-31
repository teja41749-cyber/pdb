
import React, { useState } from 'react';
import { Molecule, ScreeningResult } from './types';
import { DEFAULT_QUERY } from './constants';
import { calculateSimilarity } from './services/bioService';
import { analyzeMolecule } from './services/geminiService';
import ResultsTable from './components/ResultsTable';
import MoleculeViewer from './components/MoleculeViewer';
import { Dna, Search, Zap, FlaskConical, Bot, Check, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [querySmiles, setQuerySmiles] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<Molecule[]>([]);
  const [selectedMol, setSelectedMol] = useState<Molecule | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!querySmiles.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedMol(null);
    setAiAnalysis(null);

    try {
      const data: ScreeningResult = await calculateSimilarity(querySmiles);
      setResults(data.hits);
      if (data.hits.length > 0) {
        setSelectedMol(data.hits[0]);
      }
    } catch (err) {
      setError("Failed to complete virtual screening.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalysis = async () => {
    if (!selectedMol) return;
    setAiLoading(true);
    const text = await analyzeMolecule(selectedMol.name, selectedMol.smiles);
    setAiAnalysis(text);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              BioScreen <span className="text-xs font-normal text-slate-500 ml-1 border border-slate-700 px-1.5 py-0.5 rounded">v1.0</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Datasets</a>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Ready
            </span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Search Section */}
        <section className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleScreening} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Query Molecule (SMILES)
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FlaskConical className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={querySmiles}
                  onChange={(e) => setQuerySmiles(e.target.value)}
                  placeholder="Enter SMILES string (e.g., CC(=O)OC1=CC=CC=C1C(=O)O)"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto min-w-[160px]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Screening...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Run Screening
                  </>
                )}
              </button>
            </div>
            {error && (
               <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-900/20 p-2 rounded border border-red-900/50">
                 <AlertCircle className="w-4 h-4" />
                 {error}
               </div>
            )}
          </form>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px] lg:h-[600px]">
          
          {/* Left: Results List */}
          <div className="lg:col-span-5 h-full min-h-[300px]">
            <ResultsTable 
              hits={results} 
              onSelect={setSelectedMol} 
              selectedMol={selectedMol}
            />
          </div>

          {/* Right: Visualization & Details */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            {/* 3D Viewer Panel */}
            <div className="flex-1 bg-black rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden group">
              <MoleculeViewer molecule={selectedMol} />
              
              {/* Overlay Controls */}
              {selectedMol && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                   <div className="bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs shadow-lg font-mono">
                      Score: {selectedMol.score.toFixed(4)}
                   </div>
                </div>
              )}
            </div>

            {/* AI Analysis Panel */}
            <div className="h-[200px] bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  AI Analysis
                </h3>
                {selectedMol && (
                  <button 
                    onClick={handleAiAnalysis}
                    disabled={aiLoading}
                    className="text-xs flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? <span className="animate-spin">⟳</span> : <Zap className="w-3 h-3" />}
                    {aiAnalysis ? 'Re-analyze' : 'Generate Insights'}
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {!selectedMol ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                    <FlaskConical className="w-8 h-8 mb-2 opacity-20" />
                    Select a molecule to view details
                  </div>
                ) : aiAnalysis ? (
                  <p className="text-slate-300 text-sm leading-relaxed animate-fadeIn">
                    {aiAnalysis}
                  </p>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm italic border-2 border-dashed border-slate-700/50 rounded-lg">
                    Click "Generate Insights" to analyze {selectedMol.name} with Gemini
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
