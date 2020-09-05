import React from 'react';
import logo from './logo.svg';
import './App.css';

import Dashboard from './components/Dashboard.component'

function App() {
  return (
    <div className="App">
      <h1 className="py-2 mt-2" style={{fontSize: '6em'}}> Aniket </h1>
      <Dashboard /> 
    </div>
  );
}

export default App;
