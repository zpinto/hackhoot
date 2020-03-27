import React, { useState, useEffect } from "react";
import * as api from "utils/api";
import "./EndGame.scss";

function EndGame(props) {
  const gameId = props.match.params.gameId;
  const [playersArr, setPlayersArr] = useState([]);

  function renderScores() {
    api
      .get("/player/game/" + gameId, {})
      .then(res => {
        setPlayersArr(res.data);
      })
      .catch(err => {
        console.log("failed to GET /game");
      });
  }

  useEffect(() => {
    renderScores();
  });

  return (
    <div className="Admin">
      <div className="admin-card">
        <div>
          <div className="game-title">
            <h1> HackHoot </h1>{" "}
          </div>

          <div>
            <p className="question"> Scores </p>{" "}
            <div>
              {" "}
              {playersArr.map((p, i) => (
                <div index={i} key={i}>
                  <p>
                    {" "}
                    {p.name}: {p.score}{" "}
                  </p>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default EndGame;
