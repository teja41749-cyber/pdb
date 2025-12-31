export interface Molecule {
  name: string;
  smiles: string;
  score: number;
  mol3d?: string; // SDF format string for 3D visualization
}

export interface ScreeningResult {
  hits: Molecule[];
}

export enum ViewMode {
  TABLE = 'TABLE',
  VISUALIZER = 'VISUALIZER'
}
