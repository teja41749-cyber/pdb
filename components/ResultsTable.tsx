import React from 'react';
import { Molecule } from '../types';
import { BarChart, Activity, Cuboid } from 'lucide-react';

interface ResultsTableProps {
  hits: Molecule[];
  onSelect: (mol: Molecule) => void;
  selectedMol: Molecule | null;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ hits, onSelect, selectedMol }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-400" />
          Screening Hits
        </h3>
        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-full">
          {hits.length} molecules found
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs uppercase text-slate-400 font-semibold bg-slate-900/50 sticky top-0">
            <tr>
              <th className="p-3 rounded-tl-lg">Rank</th>
              <th className="p-3">Molecule</th>
              <th className="p-3">Similarity</th>
              <th className="p-3 rounded-tr-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {hits.map((mol, idx) => {
              const isSelected = selectedMol?.smiles === mol.smiles;
              const scorePercent = (mol.score * 100).toFixed(1);
              
              return (
                <tr 
                  key={idx}
                  onClick={() => onSelect(mol)}
                  className={`
                    cursor-pointer transition-colors border-b border-slate-700/50 last:border-0
                    ${isSelected ? 'bg-indigo-600/20 hover:bg-indigo-600/30' : 'hover:bg-slate-700/30'}
                  `}
                >
                  <td className="p-3 text-slate-400 font-mono">#{idx + 1}</td>
                  <td className="p-3">
                    <div className="font-medium text-white">{mol.name}</div>
                    <div className="text-xs text-slate-500 font-mono truncate max-w-[150px]" title={mol.smiles}>
                      {mol.smiles}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${mol.score > 0.7 ? 'bg-green-500' : mol.score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${mol.score * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-mono">{mol.score.toFixed(3)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    >
                      <Cuboid className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {hits.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No hits found. Try running a screening.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
