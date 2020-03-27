import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Home,
  Admin,
  Gameplay,
  CreateQuestions,
  StartGame,
  PlayGame,
  EndGame
} from 'app/views';

function App() {
  return (
    <div className='App'>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/admin' component={Admin}/>
          <Route exact path='/gameplay/:gameId' component={Gameplay}/>
          <Route exact path='/admin/create-questions' component={CreateQuestions}/>
          <Route exact path='/admin/start-game/:gameId' component={StartGame}/> 
          <Route exact path='/admin/play-game/:gameId' component={PlayGame}/>
          <Route exact path='/admin/end-game/:gameId' component={EndGame}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
