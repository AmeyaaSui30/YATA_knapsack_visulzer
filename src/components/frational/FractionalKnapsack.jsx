import React, { useState, useEffect } from 'react';
import './FractionalKnapsack.css';

const FractionalKnapsack = () => {
  // Initial items and capacity
  const [items, setItems] = useState([
    { id: 1, value: 60, weight: 10, ratio: 6 },
    { id: 2, value: 100, weight: 20, ratio: 5 },
    { id: 3, value: 120, weight: 30, ratio: 4 }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [matrixData, setMatrixData] = useState([]);
  const [solutionPath, setSolutionPath] = useState([]);
  
  // For adding new items
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Calculate value-to-weight ratio
  const calculateRatio = (value, weight) => {
    return parseFloat((value / weight).toFixed(2));
  };
  
  // Sort items by ratio in descending order
  const sortItemsByRatio = (itemList) => {
    return [...itemList].sort((a, b) => b.ratio - a.ratio);
  };
  
  // Calculate fractional knapsack matrix data
  const calculateMatrix = () => {
    // Sort items by value-to-weight ratio (descending)
    const sortedItems = sortItemsByRatio(items);
    
    // Initialize the matrix
    const matrix = [];
    let remainingCapacity = capacity;
    let totalValue = 0;
    let usedCapacity = 0;
    
    // Generate steps for visualization
    // Step 0: Initial state
    matrix.push({
      step: 0,
      items: sortedItems.map(item => ({
        ...item,
        fraction: 0,
        included: false,
        considered: false
      })),
      remainingCapacity,
      totalValue,
      usedCapacity,
      message: "Starting with empty knapsack. Items sorted by value-to-weight ratio (descending)."
    });
    
    // Process each item
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const updatedItems = [...matrix[i].items];
      
      // Mark the current item as being considered
      updatedItems[i] = { ...updatedItems[i], considered: true };
      
      // Calculate how much of this item can be included
      let fraction = 0;
      if (remainingCapacity >= item.weight) {
        // Include the whole item
        fraction = 1;
        remainingCapacity -= item.weight;
        totalValue += item.value;
        usedCapacity += item.weight;
      } else if (remainingCapacity > 0) {
        // Include a fraction of the item
        fraction = parseFloat((remainingCapacity / item.weight).toFixed(2));
        totalValue += item.value * fraction;
        usedCapacity += remainingCapacity;
        remainingCapacity = 0;
      }
      
      // Update the item's fraction
      updatedItems[i] = { 
        ...updatedItems[i], 
        fraction, 
        included: fraction > 0,
        considered: true
      };
      
      // Add this step to the matrix
      matrix.push({
        step: i + 1,
        items: updatedItems,
        remainingCapacity,
        totalValue: parseFloat(totalValue.toFixed(2)),
        usedCapacity,
        message: fraction === 1 
          ? `Added the entire Item ${item.id} (value: ${item.value}, weight: ${item.weight}).`
          : fraction > 0 
            ? `Added ${(fraction * 100).toFixed(0)}% of Item ${item.id} (value: ${(item.value * fraction).toFixed(2)}, weight: ${(item.weight * fraction).toFixed(2)}).`
            : `Cannot add Item ${item.id} (weight: ${item.weight}) as it exceeds remaining capacity.`
      });
      
      // Stop if knapsack is full
      if (remainingCapacity === 0) break;
    }
    
    // Final step summary
    if (matrix.length > 1) {
      const lastStep = matrix[matrix.length - 1];
      
      // Calculate the optimal solution path
      const path = [];
      for (let i = 0; i < lastStep.items.length; i++) {
        if (lastStep.items[i].included) {
          path.push({
            itemIndex: i,
            itemId: lastStep.items[i].id,
            fraction: lastStep.items[i].fraction
          });
        }
      }
      
      setSolutionPath(path);
    }
    
    return matrix;
  };
  
  // Calculate matrix data when items or capacity changes
  useEffect(() => {
    const newMatrix = calculateMatrix();
    setMatrixData(newMatrix);
    setCurrentStep(0);
  }, [items, capacity]);
  
  // Step controls
  const nextStep = () => {
    if (currentStep < matrixData.length - 1) {
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
    setCurrentStep(matrixData.length - 1);
    setShowSolution(true);
  };
  
  // Item management
  const addItem = () => {
    if (newItemValue && newItemWeight) {
      const value = parseInt(newItemValue);
      const weight = parseInt(newItemWeight);
      
      if (!isNaN(value) && !isNaN(weight) && value > 0 && weight > 0) {
        const ratio = calculateRatio(value, weight);
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems([...items, { id: newId, value, weight, ratio }]);
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
  
  // Get cell background color based on item state
  const getCellColor = (item, showOptimal) => {
    if (!item.considered) return 'transparent';
    
    if (showOptimal && item.included) {
      // Different blue shades based on fraction (darker = higher fraction)
      const intensity = Math.round(180 + (1 - item.fraction) * 75);
      return `rgb(${intensity}, ${intensity}, 255)`;
    } else if (item.considered && !item.included) {
      return '#E6F0FF'; // Very light blue for considered but not included
    }
    
    return 'transparent';
  };
  
  return (
    <div className="app-container">
      <div className="header">
        <h1>YATA Fractional Knapsack Visualizer</h1>
        <p>Understand greedy algorithms through interactive visualization</p>
      </div>
      
      <div className="panel">
        <div className="panel-header">
          <h2>  Fractional Knapsack Problem</h2>
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
                      <th>Value/Weight</th>
                      {isEditing && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>Item {item.id}</td>
                        <td>{item.value}</td>
                        <td>{item.weight}</td>
                        <td>{item.ratio}</td>
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
          <div className="panel-header">
            <h3>Fractional Knapsack Solution - Step {currentStep} of {matrixData.length - 1}</h3>
            <div className="control-buttons">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className={`btn btn-primary ${currentStep === 0 ? 'btn-disabled' : ''}`}
              >
                Previous
              </button>
              <button 
                onClick={nextStep} 
                disabled={currentStep >= matrixData.length - 1}
                className={`btn btn-primary ${currentStep >= matrixData.length - 1 ? 'btn-disabled' : ''}`}
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
          
          {currentStep === 0 ? (
            <div className="start-message">
              <p className="start-title">Click "Next" to start solving the fractional knapsack problem</p>
              <p className="start-subtitle">We'll add items in order of their value-to-weight ratio</p>
            </div>
          ) : (
            <div className="solution-visualization">
              {matrixData[currentStep] && (
                <div className="matrix-container">
                  <table className="matrix-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Value</th>
                        <th>Weight</th>
                        <th>Value/Weight</th>
                        <th>Fraction Used</th>
                        <th>Value Added</th>
                        <th>Weight Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrixData[currentStep].items.map((item) => {
                        const cellColor = getCellColor(item, showSolution);
                        const cellStyle = { backgroundColor: cellColor };
                        
                        return (
                          <tr key={item.id} className={item.considered ? 'considered-row' : ''}>
                            <td style={cellStyle}>Item {item.id}</td>
                            <td style={cellStyle}>{item.value}</td>
                            <td style={cellStyle}>{item.weight}</td>
                            <td style={cellStyle}>{item.ratio}</td>
                            <td style={cellStyle} className={item.included ? 'included-cell' : ''}>
                              {item.considered ? `${(item.fraction * 100).toFixed(0)}%` : '-'}
                            </td>
                            <td style={cellStyle}>
                              {item.considered && item.included 
                                ? (item.value * item.fraction).toFixed(2) 
                                : '-'}
                            </td>
                            <td style={cellStyle}>
                              {item.considered && item.included 
                                ? (item.weight * item.fraction).toFixed(2) 
                                : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="stats-container">
                <div className="stat-box used-capacity">
                  <div className="stat-label">Used Capacity</div>
                  <div className="stat-value">
                    {matrixData[currentStep]?.usedCapacity} / {capacity}
                  </div>
                  <div className="capacity-bar-container">
                    <div 
                      className="capacity-bar" 
                      style={{ width: `${(matrixData[currentStep]?.usedCapacity / capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="stat-box total-value">
                  <div className="stat-label">Total Value</div>
                  <div className="stat-value">{matrixData[currentStep]?.totalValue}</div>
                </div>
                
                <div className="stat-box remaining-capacity">
                  <div className="stat-label">Remaining Capacity</div>
                  <div className="stat-value">{matrixData[currentStep]?.remainingCapacity}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="explanation-box">
            <h4>Current Step Explanation:</h4>
            {currentStep === 0 && (
              <p>Items are sorted by value-to-weight ratio in descending order. This greedy approach ensures we pick the most valuable items per unit weight first.</p>
            )}
            {currentStep > 0 && matrixData[currentStep] && (
              <p>{matrixData[currentStep].message}</p>
            )}
            {showSolution && currentStep === matrixData.length - 1 && (
              <div className="solution-summary">
                <h4>Optimal Solution:</h4>
                <ul className="solution-list">
                  {solutionPath.map(item => (
                    <li key={item.itemId}>
                      Item {item.itemId}: {item.fraction < 1 
                        ? `${(item.fraction * 100).toFixed(0)}% used` 
                        : 'Fully used'}
                    </li>
                  ))}
                </ul>
                <p className="solution-note">
                  The fractional knapsack solution involves taking items with the highest value-to-weight ratio first, 
                  and taking fractional parts when needed to maximize total value.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-title">Add items to see the fractional knapsack solution</p>
          <p className="empty-subtitle">Click the "Edit Problem" button to get started</p>
        </div>
      )}
      
      <div className="footer">
        Thank U
      </div>
    </div>
  );
};

export default FractionalKnapsack;