import React from 'react';
import './App.css';
import Layout from "./components/Layout";
import Menu from './components/Menu';
import {pathContext} from './state/PathContext'
import {usePath} from "./hooks/PathHook";


function App() {
    const path = usePath()
    return (
        <pathContext.Provider value={path}>
            <div className="App">
                <header className="App-header">
                    <Menu/>
                    <Layout/>
                </header>
            </div>
        </pathContext.Provider>
    );
}

export default App;
