import React, { useState, useEffect } from "react";
import "./PlayGame.scss";
import * as api from "utils/api";

function PlayGame(props) {
  const gameId = props.match.params.gameId;
  const [initialGet, setInitialGet] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [curQuestion, setCurQuestion] = useState({
    _id: {
      $oid: " "
    },
    question: " ",
    A: " ",
    B: " ",
    C: " ",
    D: " ",
    answer: " "
  });
  const [displayQuestion, setDisplayQuestion] = useState(true);
  const [playersArr, setPlayersArr] = useState([]);

  function renderQuestion() {
    setInitialGet(true);
    api
      .get("/game/" + gameId, {})
      .then(res => {
        setTimeLimit(res.data["time_limit"]);
        setCurQuestion(res.data["questions"][res.data["cur_question"]]);
      })
      .catch(err => {
        console.log("Failed to GET /game");
      });
  }

  function renderScores() {
    api
      .get("/player/game/" + gameId, {})
      .then(res => {
        setTimeLimit(10);
        console.log(res.data);
        setPlayersArr(res.data);
      })
      .catch(err => {
        console.log("failed to GET /game");
      });
  }

  useEffect(() => {
    if (!initialGet) {
      setInitialGet(true);
      renderQuestion();
    }
    if (!timeLimit || timeLimit < 1) {
      if (displayQuestion) {
        renderScores();
      } else {
        api
          .put("/game/" + gameId, {})
          .then(res => {
            if (res.data["game_state"] !== "done") {
              renderQuestion();
            } else {
              props.history.push("/admin/end-game/" + gameId);
            }
          })
          .catch(err => {
            console.log("Failed to update gamestate");
          });
      }
      setDisplayQuestion(!displayQuestion);
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
          </div>

          {displayQuestion ? (
            <div>
              <p className="question">{curQuestion.question}</p>
              <div className="choices">
                <div>A: {curQuestion.A}</div>
                <div>B: {curQuestion.B}</div>
                <div>C: {curQuestion.C}</div>
                <div>D: {curQuestion.D}</div>
              </div>
            </div>
          ) : (
            <div>
              <p className="question">Scores</p>
              <div>
                {playersArr.map((p, i) => (
                  <div index={i} key={i}>
                    <p>
                      {p.name}: {p.points}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayGame;
