import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Home,
  Admin,
  Lobby,
  Gameplay,
  CreateQuestions,
  StartGame,
  PlayGame
} from 'app/views';

function App() {
  return (
    <div className='App'>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/admin' component={Admin}/>
          <Route exact path='/lobby/:gameId' component={Lobby}/>
          <Route exact path='/gameplay/:gameId' component={Gameplay}/>
          <Route exact path='/admin/create-questions' component={CreateQuestions}/>
          <Route exact path='/admin/start-game/:gameId' component={StartGame}/> 
          <Route exact path='/admin/play-game/:gameId' component={PlayGame}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
