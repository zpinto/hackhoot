import React, { useState, useEffect }  from "react";
import './StartGame.scss';

import axios from "axios";

function StartGame(props) {

  const gameId = props.match.params.gameId;
  const [initialGet, setInitialGet] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);

  function findTimeLimit () {
    setInitialGet(true);
    axios.get('/game/' + gameId).then(res => {
      setTimeLimit(res.data["time_limit"]);
    }).catch(err => {
      console.log("Failed to GET /game");
    });
  }

  useEffect(() => {
    if (!initialGet) findTimeLimit();
    if (!timeLimit) {
      axios.post('/game/' + gameId).catch(err => {
        console.log("Failed to update gamestate");
      });
      props.history.push('/admin/play-game/' + gameId);
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLimit(timeLimit - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLimit]);

  return (
    <div className="Admin">
      <div className="admin-card">
        <div>
          <div className="timer">{timeLimit}</div>
          <div className="game-title">
            <h1>HackHoot</h1>
            <p> Administrative Portal </p>
          </div>
          <div className="game-form">
            <p className="game-id">{gameId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartGame;
