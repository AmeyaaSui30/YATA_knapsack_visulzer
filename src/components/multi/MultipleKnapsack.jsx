import React, { useState } from 'react';
import './MultipleKnapsack.css';

const MultipleKnapsack = () => {
  // Sample items and knapsacks
  const [items] = useState([
    { id: 1, value: 60, weight: 10 },
    { id: 2, value: 100, weight: 20 },
    { id: 3, value: 120, weight: 30 }
  ]);

  const [knapsacks] = useState([
    { id: 1, capacity: 50 },
    { id: 2, capacity: 40 }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Generate tree structure for multiple knapsacks
  const calculateTree = () => {
    const treeData = [];
    const numKnapsacks = knapsacks.length;
    const maxDepth = items.length;

    for (let i = 0; i <= maxDepth; i++) {
      const level = [];
      const numNodes = Math.pow(numKnapsacks + 1, i);

      for (let j = 0; j < numNodes; j++) {
        const path = j.toString(numKnapsacks + 1).padStart(i, '0');
        let totalValue = 0;
        let totalWeight = Array(numKnapsacks).fill(0);
        let includedItems = [];

        for (let k = 0; k < path.length; k++) {
          const knapsackIndex = parseInt(path[k]) - 1;
          if (knapsackIndex >= 0 && knapsackIndex < numKnapsacks) {
            totalValue += items[k].value;
            totalWeight[knapsackIndex] += items[k].weight;
            includedItems.push(`Item ${items[k].id} → K${knapsackIndex + 1}`);
          }
        }

        const isValid = totalWeight.every((w, index) => w <= knapsacks[index].capacity);

        level.push({
          id: `${i}-${j}`,
          path,
          includedItems,
          totalValue,
          totalWeight,
          isValid,
          isBest: false
        });
      }

      treeData.push(level);
    }

    // Find the best valid solution
    let bestValue = 0;
    let bestNodeId = null;

    treeData[maxDepth].forEach(node => {
      if (node.isValid && node.totalValue > bestValue) {
        bestValue = node.totalValue;
        bestNodeId = node.id;
      }
    });

    // Mark the best path in the tree
    if (bestNodeId) {
      const [level, index] = bestNodeId.split('-').map(Number);
      treeData[level][index].isBest = true;

      let path = treeData[level][index].path;
      for (let i = level - 1; i >= 0; i--) {
        const partialPath = path.substring(0, i);
        const nodeIndex = parseInt(partialPath || '0', numKnapsacks + 1);
        treeData[i][nodeIndex].isBest = true;
      }
    }

    return treeData;
  };

  const treeData = calculateTree();
  const maxSteps = treeData.length;

  // Step controls
  const nextStep = () => {
    if (currentStep < maxSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setShowSolution(false);
  };

  const showFullSolution = () => {
    setCurrentStep(maxSteps);
    setShowSolution(true);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1> YATA Multiple Knapsack Visualizer</h1>
        <p>See how items are distributed across multiple knapsacks.</p>
      </div>

      <div className="panel">
        <h2>Knapsack Setup</h2>
        <p>Total Knapsacks: {knapsacks.length}</p>
        {knapsacks.map((ks, index) => (
          <p key={index}>Knapsack {index + 1}: Capacity {ks.capacity}</p>
        ))}
      </div>

      <div className="panel">
        <h3>Items:</h3>
        <ul>
          {items.map(item => (
            <li key={item.id}>Item {item.id} - Value: {item.value}, Weight: {item.weight}</li>
          ))}
        </ul>
      </div>

      <div className="tree-header">
        <h3>Decision Tree - Step {currentStep} of {maxSteps}</h3>
        <div className="tree-controls">
          <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
          <button onClick={nextStep} disabled={currentStep >= maxSteps}>Next</button>
          <button onClick={reset}>Reset</button>
          <button onClick={showFullSolution}>Show Solution</button>
        </div>
      </div>

      <div className="tree-visualization">
        {treeData.slice(0, currentStep).map((level, levelIndex) => (
          <div key={levelIndex} className="tree-level">
            {level.map(node => (
              <div
                key={node.id}
                className={`tree-node ${node.isBest && showSolution ? 'best-node' : ''}`}
                style={{ backgroundColor: node.isValid ? 'white' : '#FFEBEE' }}
              >
                <p>{node.includedItems.length > 0 ? node.includedItems.join(', ') : 'No Items'}</p>
                <p>Value: {node.totalValue}</p>
                <p>Weight: {node.totalWeight.join(', ')}</p>
                {!node.isValid && <p>Over Capacity!</p>}
                {node.isBest && showSolution && <p>Optimal Solution!</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleKnapsack;
