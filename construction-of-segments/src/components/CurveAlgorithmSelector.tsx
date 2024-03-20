import React from 'react';
import CurveAlgorithm from '../enums/CurveAlgorithm'

interface CurveAlgorithmSelectorProps {
  selectedAlgorithm: CurveAlgorithm;
  setSelectedAlgorithm: (React.Dispatch<React.SetStateAction<CurveAlgorithm>>);
}

const CurveAlgorithmSelector: React.FC<CurveAlgorithmSelectorProps> = ({ selectedAlgorithm, setSelectedAlgorithm }) => {

  const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedAlgorithm(selectedValue as CurveAlgorithm);
  };
  
  return (
    <div className="Input">
        <label>Algorithm: </label>
        <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
            <option value="Hermite">Hermite</option>
            <option value="Bezier">Bezier</option>
            <option value="BSpline">B Spline</option>
        </select>
    </div>
  );
};

export default CurveAlgorithmSelector;