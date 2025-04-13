import React, { useState } from 'react';
import './KnapsackTree.css'; // We'll create this CSS file separately

const KnapsackTree = () => {
  // Initial items and capacity
  const [items, setItems] = useState([
    { id: 1, value: 60, weight: 10 },
    { id: 2, value: 100, weight: 20 },
    { id: 3, value: 120, weight: 30 }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  
  // For adding new items
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Tree structure calculation
  const calculateTree = () => {
    const treeData = [];
    const maxDepth = items.length;
    
    // Calculate all possible nodes (2^n possible combinations)
    for (let i = 0; i <= maxDepth; i++) {
      const level = [];
      const numNodes = Math.pow(2, i);
      
      for (let j = 0; j < numNodes; j++) {
        // Calculate which items are included in this path
        const path = j.toString(2).padStart(i, '0');
        
        let totalValue = 0;
        let totalWeight = 0;
        let includedItems = [];
        
        for (let k = 0; k < path.length; k++) {
          if (path[k] === '1') {
            totalValue += items[k].value;
            totalWeight += items[k].weight;
            includedItems.push(items[k].id);
          }
        }
        
        const isValid = totalWeight <= capacity;
        
        level.push({
          id: `${i}-${j}`,
          path,
          includedItems,
          totalValue,
          totalWeight,
          isValid,
          isBest: false // Will be calculated later
        });
      }
      
      treeData.push(level);
    }
    
    // Calculate best valid solution
    let bestValue = 0;
    let bestNodeId = null;
    
    treeData[maxDepth].forEach(node => {
      if (node.isValid && node.totalValue > bestValue) {
        bestValue = node.totalValue;
        bestNodeId = node.id;
      }
    });
    
    // Mark the best solution
    if (bestNodeId) {
      const [level, index] = bestNodeId.split('-').map(Number);
      treeData[level][index].isBest = true;
      
      // Mark the path to the best solution
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
  
  // Step controls
  const nextStep = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const reset = () => {
    setCurrentStep(0);
    setShowSolution(false);
  };
  
  const showFullSolution = () => {
    setCurrentStep(maxSteps);
    setShowSolution(true);
  };
  
  // Item management
  const addItem = () => {
    if (newItemValue && newItemWeight) {
      const value = parseInt(newItemValue);
      const weight = parseInt(newItemWeight);
      
      if (!isNaN(value) && !isNaN(weight) && value > 0 && weight > 0) {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems([...items, { id: newId, value, weight }]);
        setNewItemValue('');
        setNewItemWeight('');
        reset();
      }
    }
  };
  
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    reset();
  };
  
  const updateCapacity = () => {
    const cap = parseInt(newCapacity);
    if (!isNaN(cap) && cap > 0) {
      setCapacity(cap);
      setNewCapacity('');
      reset();
    }
  };
  
  const clearItems = () => {
    setItems([]);
    reset();
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setNewCapacity(capacity.toString());
  };
  
  return (
    <div className="app-container">
      <div className="header">
        <h1>YATA, The Knapsack Visualizer</h1>
        <p>Understand complex algorithms through interactive visualization.</p>
      </div>
      
      <div className="panel">
        <div className="panel-header">
          <h2>0/1 Knapsack Problem</h2>
          <button 
            onClick={toggleEditMode}
            className="btn btn-primary btn-sm"
          >
            {isEditing ? "Done Editing" : "Edit Problem"}
          </button>
        </div>
        
        {isEditing ? (
          <div className="edit-panel">
            <h3>Edit Problem</h3>
            
            <div className="form-group">
              <label>Knapsack Capacity</label>
              <div className="input-group">
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  placeholder="Enter capacity"
                  min="1"
                />
                <button 
                  onClick={updateCapacity}
                  className="btn btn-primary"
                >
                  Update
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Add New Item</label>
              <div className="input-group">
                <input
                  type="number"
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  placeholder="Value"
                  className="input-value"
                  min="1"
                />
                <input
                  type="number"
                  value={newItemWeight}
                  onChange={(e) => setNewItemWeight(e.target.value)}
                  placeholder="Weight"
                  className="input-weight"
                  min="1"
                />
                <button 
                  onClick={addItem}
                  className="btn btn-success"
                >
                  Add Item
                </button>
              </div>
            </div>
            
            {items.length > 0 && (
              <button 
                onClick={clearItems}
                className="btn btn-danger btn-sm"
              >
                Clear All Items
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="capacity-info">Capacity: {capacity} units</p>
            <div className="items-container">
              <h3>Items:</h3>
              {items.length > 0 ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Value</th>
                      <th>Weight</th>
                      {isEditing && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>Item {item.id}</td>
                        <td>{item.value}</td>
                        <td>{item.weight}</td>
                        {isEditing && (
                          <td>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="btn btn-danger btn-xs"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-items-message">No items added yet. Click "Edit Problem" to add items.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {items.length > 0 ? (
        <div className="panel">
          <div className="tree-header">
            <h3>Decision Tree - Step {currentStep} of {maxSteps}</h3>
            <div className="tree-controls">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className={`btn btn-primary ${currentStep === 0 ? 'btn-disabled' : ''}`}
              >
                Previous
              </button>
              <button 
                onClick={nextStep} 
                disabled={currentStep >= maxSteps}
                className={`btn btn-primary ${currentStep >= maxSteps ? 'btn-disabled' : ''}`}
              >
                Next
              </button>
              <button 
                onClick={reset}
                className="btn btn-secondary"
              >
                Reset
              </button>
              <button 
                onClick={showFullSolution} 
                className="btn btn-success"
              >
                Show Solution
              </button>
            </div>
          </div>
          
          <div className="tree-visualization">
            {currentStep === 0 ? (
              <div className="start-message">
                <p className="start-title">Click "Next" to start exploring the decision tree</p>
                <p className="start-subtitle">We'll build the tree step by step, showing all possible choices at each level</p>
              </div>
            ) : (
              <div className="tree-scroll-container">
                <div className="tree-container">
                  {treeData.slice(0, currentStep).map((level, levelIndex) => (
                    <div key={levelIndex} className="tree-level">
                      {level.map(node => {
                        
                        const isIncluded = node.path.endsWith('1');
                        
                        const nodeStyle = {
                          width: `${Math.max(100, 240 / Math.pow(2, levelIndex))}px`,
                          opacity: currentStep > 0 ? 1 : 0.5,
                          backgroundColor: node.isValid ? 'white' : '#FFEBEE'
                        };
                        
                        const nodeClassName = `tree-node ${node.isBest && showSolution ? 'best-node' : ''}`;
                        
                        return (
                          <div 
                            key={node.id} 
                            className={nodeClassName}
                            style={nodeStyle}
                          >
                            <div className="node-title">
                              {levelIndex === 0 ? 'Start' : levelIndex === items.length ? 'Final' : `Level ${levelIndex}`}
                            </div>
                            {levelIndex > 0 && (
                              <div className={`node-decision ${isIncluded ? 'included' : 'excluded'}`}>
                                {isIncluded ? `Include Item ${levelIndex}` : `Exclude Item ${levelIndex}`}
                              </div>
                            )}
                            <div className="node-details">
                              <div>Items: {node.includedItems.length ? node.includedItems.join(', ') : 'None'}</div>
                              <div>Value: {node.totalValue}</div>
                              <div>Weight: {node.totalWeight}/{capacity}</div>
                              {!node.isValid && <div className="over-capacity">Over capacity!</div>}
                              {node.isBest && showSolution && <div className="optimal-solution">Optimal Solution!</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="explanation-box">
            <h4>Current Step Explanation:</h4>
            {currentStep === 0 && (
              <p>Starting with an empty knapsack. We'll make a decision for each item: include it (1) or exclude it (0).</p>
            )}
            {currentStep === 1 && (
              <p>At the root, we have no items selected yet. Total value: 0, Weight: 0/{capacity}</p>
            )}
            {currentStep > 1 && currentStep <= items.length + 1 && (
              <p>For Item {currentStep - 1} (value: {items[currentStep - 2].value}, weight: {items[currentStep - 2].weight}), we have two choices for each previous state: include (right branch) or exclude (left branch).</p>
            )}
            {currentStep === maxSteps && (
              <div>
                <p>We've built the complete decision tree with all 2^{items.length} = {Math.pow(2, items.length)} possible combinations.</p>
                {showSolution && <p className="solution-highlight">The optimal solution is highlighted in green - the best valid combination that maximizes total value.</p>}
                <p className="explanation-note">The 0/1 knapsack problem is solved by finding the maximum value that doesn't exceed the weight capacity.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-title">Add items to see the decision tree visualization</p>
          <p className="empty-subtitle">Click the "Edit Problem" button to get started</p>
        </div>
      )}
      
      <div className="footer">
        Thank U
      </div>
    </div>
  );
};

export default KnapsackTree;