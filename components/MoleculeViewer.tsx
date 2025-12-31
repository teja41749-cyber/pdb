import React, { useEffect, useRef } from 'react';
import { Molecule } from '../types';

// Declare 3Dmol global from the CDN
declare const $3Dmol: any;

interface MoleculeViewerProps {
  molecule: Molecule | null;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Initialize viewer
    const config = { backgroundColor: 'black' };
    viewerInstance.current = $3Dmol.createViewer(viewerRef.current, config);

    return () => {
      // Cleanup if needed (3Dmol doesn't strictly require explicit destroy usually)
    };
  }, []);

  useEffect(() => {
    if (!viewerInstance.current || !molecule) return;

    const viewer = viewerInstance.current;
    viewer.clear();

    if (molecule.mol3d) {
      // If we have a 3D SDF block from the backend
      viewer.addModel(molecule.mol3d, "sdf");
      viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { radius: 0.4 } });
      viewer.zoomTo();
      viewer.render();
    } else {
      // Fallback: Use PubChem or just 2D layout logic if supported by a plugin, 
      // but standard 3Dmol needs coords. We will attempt to use the SMILES directly
      // Note: 3Dmol can visualize SMILES via an external service implicitly if configured,
      // but for this demo, if no mol3d is provided (mock mode), we might display a placeholder or attempt a basic parse.
      
      // Attempt to load from PubChem via 3Dmol helper (requires network)
      // This is a "best effort" for the frontend-only mock mode.
      try {
        // @ts-ignore
        jQuery.ajax({
            url: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(molecule.smiles)}/record/SDF/?record_type=3d`,
            success: (data: any) => {
                viewer.addModel(data, "sdf");
                viewer.setStyle({}, { stick: {colorscheme: "Jmol"}, sphere: { radius: 0.3 } });
                viewer.zoomTo();
                viewer.render();
            },
            error: () => {
                 // Fallback text if PubChem fails
                 viewer.addLabel("3D Structure Unavailable\n(Backend Required)", {position: {x:0, y:0, z:0}, fontColor:'white', backgroundColor: 'black'});
                 viewer.render();
            }
        });
      } catch (e) {
          console.error("Viewer error", e);
      }
    }

  }, [molecule]);

  if (!molecule) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-900 rounded-lg border border-gray-700">
        <p>Select a molecule to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-700 shadow-xl bg-black">
      <div ref={viewerRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {molecule.name}
      </div>
    </div>
  );
};

export default MoleculeViewer;
