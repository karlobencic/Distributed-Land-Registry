import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Map from './components/Map';
import InfoPanel from './components/InfoPanel';
import { StoreProvider } from "./store";
import reducers from "./reducers"
import initialState from "./store/initialState"

function App() {
    return (
        <StoreProvider initialState={initialState} reducer={reducers}>
            <div className="App">
                <div style={{height: '100vh', width: '100%'}}>
                    <div style={{position: 'absolute', left: 0, top: 0, width: '64%', height: '100%'}}>
                        <Map/>
                    </div>
                    <div style={{position: 'absolute', right: 0, top: 0, width: '36%', height: '100%'}}>
                        <InfoPanel/>
                    </div>
                </div>
            </div>
        </StoreProvider>
    );
}

export default App;
