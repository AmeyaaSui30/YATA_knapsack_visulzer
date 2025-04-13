import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import LandingPg from "../src/landing page/LandingPg.jsx";
import KnapsackTree from "../src/components/KnapsackTree.jsx";
import FractionalKnapsack from "./components/frational/FractionalKnapsack.jsx";
import UnboundedTree from "./components/unbounded/Unbounded.jsx";
import MultipleKnapsackMatrix from "./components/multi/MultipleKnapsack.jsx";

const App = () => {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LandingPg />} />
                <Route path="/knapsacktree" element={<KnapsackTree />} />
                <Route path="/fractional" element={<FractionalKnapsack />} />
                <Route path="/unbounded" element={<UnboundedTree />} />
                <Route path="/multiple" element={<MultipleKnapsackMatrix />} />

          </Routes>
      </BrowserRouter>
  );
};

export default App;