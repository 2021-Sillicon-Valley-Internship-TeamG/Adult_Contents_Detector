import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // For React-BootStrap default CSS ( 없으면 해당 strap 객체 렌더링 불가능 )
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import pirate_white from './images/pirate_white.png';
import pirate_white_red from './images/pirate_white_red.png';
import './App.css'
import Home from './components/Home'
import Detect from './components/Detect';
import Result from './components/Result';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'

class App extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
       img_state : ""
    };
  }
  render(){
    return (
      <div className="app">
        <AppBar position="static" style={{ background: 'rgba(46, 59, 85, 1)', padding:'10px', alignItems:'center'}}>
        <Toolbar>
          <img height="50" alt="pirate_white.png" src={pirate_white}></img>
        </Toolbar>
        </AppBar>
        <div id="main_body">
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                  <Home></Home>
                </Route>
                <Route path='/detect' component={Detect}/>
                <Route path='/result' component={Result}/>
            </Switch>
          </BrowserRouter>
          </div>
      </div>
    );
  }
}

export default App;