import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import './StartGame.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Timer from "../../components/timer/Timer";

function Admin(props) {

  const lobbyId = props.match.params.lobbyId;
  const [timeLimit, setTimeLimit] = useState(60);
  const [curQuestion, setCurQuestion] = useState(
    {
      "question": "",
      "A": "",
      "B": "",
      "C": "",
      "D": "",
      "answer": ""
    }
  );
  
  // TODO: get time_limit from GET /game/ --> setTimeLimit(time_limit)
  // setCurQuestion(response.questions[response.cur_question])
  // should this be rerendered on the same page?? 

  return (
    <div className="Admin">
      <div className="admin-card">
        <div>
          <div className="timer"><Timer seconds={timeLimit}></Timer></div>
          <div className="game-title">
            <h1>HackHoot</h1>
            <p> Administrative Portal </p>
          </div>
          <div className="game-form">
            <p className="game-id">{lobbyId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
