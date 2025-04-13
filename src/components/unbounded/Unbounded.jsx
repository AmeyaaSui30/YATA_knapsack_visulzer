import React, { useState } from 'react';
import './Unbounded.css'; // Updated filename

const UnboundedTree = () => {
  const [items, setItems] = useState([
    { id: 1, value: 60, weight: 10 },
    { id: 2, value: 100, weight: 20 },
    { id: 3, value: 120, weight: 30 }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Calculation logic remains the same
  const calculateTree = () => {
    const treeData = [];
    const maxDepth = items.length;

    for (let i = 0; i <= maxDepth; i++) {
      const level = [];
      const numNodes = Math.pow(2, i);

      for (let j = 0; j < numNodes; j++) {
        const path = j.toString(2).padStart(i, '0');
        let totalValue = 0, totalWeight = 0, includedItems = [];

        for (let k = 0; k < path.length; k++) {
          if (path[k] === '1') {
            totalValue += items[k].value;
            totalWeight += items[k].weight;
            includedItems.push(items[k].id);
          }
        }

        level.push({
          id: `${i}-${j}`,
          path,
          includedItems,
          totalValue,
          totalWeight,
          isValid: totalWeight <= capacity,
          isBest: false
        });
      }

      treeData.push(level);
    }

    let bestValue = 0, bestNodeId = null;
    treeData[maxDepth].forEach(node => {
      if (node.isValid && node.totalValue > bestValue) {
        bestValue = node.totalValue;
        bestNodeId = node.id;
      }
    });

    if (bestNodeId) {
      const [level, index] = bestNodeId.split('-').map(Number);
      treeData[level][index].isBest = true;
      let pathBinary = treeData[level][index].path;

      for (let i = level - 1; i >= 0; i--) {
        const partialPath = pathBinary.substring(0, i);
        const nodeIndex = parseInt(partialPath || '0', 2);
        treeData[i][nodeIndex].isBest = true;
      }
    }

    return treeData;
  };

  const treeData = calculateTree();
  const maxSteps = treeData.length;

  return (
    <div className="app-container">
      <div className="header">
        <h1>YATA Unbounded Knapsack Visualizer</h1>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Unbounded Knapsack</h2>
          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-primary">
            {isEditing ? "Done Editing" : "Edit Problem"}
          </button>
        </div>

        {isEditing ? (
          <div className="edit-panel">
            <label>Capacity:</label>
            <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} />
            <button onClick={() => setCapacity(parseInt(newCapacity))}>Update</button>

            <label>New Item:</label>
            <input type="number" placeholder="Value" value={newItemValue} onChange={(e) => setNewItemValue(e.target.value)} />
            <input type="number" placeholder="Weight" value={newItemWeight} onChange={(e) => setNewItemWeight(e.target.value)} />
            <button onClick={() => setItems([...items, { id: items.length + 1, value: parseInt(newItemValue), weight: parseInt(newItemWeight) }])}>Add</button>
          </div>
        ) : (
          <div className="items-container">
            <p>Capacity: {capacity}</p>
            <h3>Items:</h3>
            {items.map(item => <p key={item.id}>📦 {item.id}: V={item.value}, W={item.weight}</p>)}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="panel">
          <h3>Step {currentStep} of {maxSteps}</h3>
          <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>Prev</button>
          <button onClick={() => setCurrentStep(currentStep + 1)} disabled={currentStep >= maxSteps}>Next</button>
          <button onClick={() => setCurrentStep(0)}>Reset</button>
          <button onClick={() => setShowSolution(true)}>Show Solution</button>

          <div className="tree-visualization">
            {treeData.slice(0, currentStep).map((level, idx) => (
              <div key={idx} className="tree-level">
                {level.map(node => (
                  <div key={node.id} className={`tree-node ${node.isBest && showSolution ? 'best-node' : ''}`}>
                    <p>Value: {node.totalValue}</p>
                    <p>Weight: {node.totalWeight}</p>
                    {node.isBest && showSolution && <p>✅ Best Choice</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnboundedTree;
