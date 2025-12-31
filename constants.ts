import { Molecule } from './types';

// Fallback data to simulate backend response when Python server isn't running
export const MOCK_HITS: Molecule[] = [
  {
    name: "Aspirin (Query Match)",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    score: 1.0000,
    // Simple 2D representation fallback or pre-calculated 3D block would go here
    mol3d: "" 
  },
  {
    name: "Salicylic Acid",
    smiles: "OC1=CC=CC=C1C(=O)O",
    score: 0.6521,
    mol3d: ""
  },
  {
    name: "Paracetamol",
    smiles: "CC(=O)NC1=CC=C(O)C=C1",
    score: 0.1245,
    mol3d: ""
  },
  {
    name: "Ibuprofen",
    smiles: "CC(C)CC1=CC=C(C(C)C(=O)O)C=C1",
    score: 0.1102,
    mol3d: ""
  },
  {
    name: "Caffeine",
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    score: 0.0450,
    mol3d: ""
  }
];

export const DEFAULT_QUERY = "CC(=O)OC1=CC=CC=C1C(=O)O";
