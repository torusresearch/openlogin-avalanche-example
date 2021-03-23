/* eslint-disable no-undef */
import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./containers/login";
import Avalanche from "./containers/avalanche";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/avalanche" exact>
          <Avalanche />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
