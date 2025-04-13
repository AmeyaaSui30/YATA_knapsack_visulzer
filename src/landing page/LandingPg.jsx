import React from 'react';
import '../landing page/Landingpage.css';
import { useNavigate } from 'react-router-dom';
import KnapsackTree from '../components/KnapsackTree.jsx';

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Navigate to the selected knapsack problem type
  const navigateToProblem = (problemType) => {
    console.log(`Navigating to ${problemType} page`);
    if (problemType === 'KnapsackTree') {
      navigate('/KnapsackTree'); // Navigate to the KnapsackTree route
    } else if (problemType === 'unbounded') {
      navigate('/unbounded'); // Navigate to the Unbounded Knapsack route
    } else if (problemType === 'multiple') {
      navigate('/multiple'); // Navigate to the Multiple Knapsack route
    } else if (problemType === 'fractional') {
      navigate('/fractional'); // Navigate to the Fractional Knapsack route
    }
    // Add other routes as needed for different problem types
  };

  return (
    <div className="lp-landing-page">
      {/* Hero Section */}
      <div className="lp-hero-section">
        <h1 className="lp-main-title"> YATA📊, The Knapsack Visualizer</h1>
        <p className="lp-subtitle">Understand complex algorithms through interactive visualization.</p>
      </div>
      {/* Problem Options */}
      <div className="lp-options-container">
        {/* 0/1 Knapsack */}
        <button className="lp-option-card" onClick={() => navigateToProblem('KnapsackTree')}>
          <div className="lp-icon-container lp-blue">🎒</div>
          <div className="lp-option-details">
            <h2 className="lp-option-title">0/1 Knapsack</h2>
            <p className="lp-option-desc">Choose each item either once or not at all.</p>
            <p className="lp-option-desc">➡️Each item can either be included or excluded (0 or 1), solved using dynamic programming..</p>
          </div>
        </button>
        {/* Fractional Knapsack */}
        <button className="lp-option-card" onClick={() => navigateToProblem('fractional')}>
          <div className="lp-icon-container lp-green"> ✂️ </div>
          <div className="lp-option-details">
            <h2 className="lp-option-title">Fractional Knapsack</h2>
            <p className="lp-option-desc">Items can be divided into smaller parts.</p>
            <p className="lp-option-desc">➡️Fractional Knapsack: Items can be divided into fractions, solved greedily by maximizing value/weight ratio.</p>
          </div>
        </button>
        {/* Unbounded Knapsack */}
        <button className="lp-option-card" onClick={() => navigateToProblem('unbounded')}>
          <div className="lp-icon-container lp-purple">🔄</div>
          <div className="lp-option-details">
            <h2 className="lp-option-title">Unbounded Knapsack</h2>
            <p className="lp-option-desc">Select items multiple times as needed.</p>
            <p className="lp-option-desc">➡️Items can be taken multiple times, uses dynamic programming.</p>
          </div>
        </button>
        {/* Multiple Knapsack */}
        <button className="lp-option-card" onClick={() => navigateToProblem('multiple')}>
          <div className="lp-icon-container lp-orange">👜</div>
          <div className="lp-option-details">
            <h2 className="lp-option-title">Multiple Knapsack</h2>
            <p className="lp-option-desc">Use multiple knapsacks with varying capacities.</p>
            <p className="lp-option-desc">➡️Items are distributed among multiple knapsacks with different capacities, solved using DP or branch & bound.</p>
          </div>
        </button>
      </div>
      {/* Footer Note */}
      <div className="lp-footer-note">
        <p></p>
      </div>
      Thank U
    </div>
  );
};

export default LandingPage;