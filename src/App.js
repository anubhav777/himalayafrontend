import React from 'react';
import Himalayatry from './components/files_codes/Himalayatry'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import AlbumFIle from './components/files_codes/Albumfile'
import Himalayahome from './components/files_codes/Himalayahome'
import './App.css';
import './css/main.css'
import './css/style2.css'

import '../node_modules/noty/lib/noty.css'
import '../node_modules/noty/lib/themes/mint.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" render={(props)=>(
                    <React.Fragment>
                       <Himalayahome/>
                    </React.Fragment>
        )}>


        </Route>
        <Switch>
          <Route path='/try'><Himalayatry/></Route>
    
          <Route path='/filealbum'><AlbumFIle/></Route>
         
        </Switch>
      </Router>
     
    </div>
  );
}

export default App;
