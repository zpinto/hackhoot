import React, { useState, useEffect } from "react";
import "./StartGame.scss";
import * as api from "utils/api";

function StartGame(props) {
  const gameId = props.match.params.gameId;
  const [initialGet, setInitialGet] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);

  function findTimeLimit() {
    setInitialGet(true);
    api
      .get("/game/" + gameId, {})
      .then(res => {
        console.log(res.data["cur_time"], res.data["next_question_start_time"]);
        setTimeLimit(60);
      })
      .catch(err => {
        console.log("Failed to GET /game");
      });
  }

  useEffect(() => {
    if (!initialGet) findTimeLimit();
    if (!timeLimit) {
      api
        .put("/game/" + gameId, {})
        .then(res => {
          props.history.push("/admin/play-game/" + gameId);
        })
        .catch(err => {
          console.log("Failed to update gamestate");
        });
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
          <div className="timer"> {timeLimit} </div>
          <div className="game-title">
            <h1> HackHoot </h1> <p> Administrative Portal </p>
          </div>
          <div className="game-form">
            <p className="game-id"> {gameId} </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartGame;
