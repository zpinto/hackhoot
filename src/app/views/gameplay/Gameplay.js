import React, { useState, useEffect } from "react";
import './Gameplay.scss';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faLinkedInIn, faReddit, faSnapchat, faVine } from '@fortawesome/fontawesome-svg-core'

import { Trail } from 'react-spring/renderprops';
import axios from "axios";

const colors = [
  {
    title: 'a',
    hex: '#fc3835',
    icon: 'reddit'
  },
  { 
    title: 'b',
    hex: '#5567f2',
    icon: 'linkedin-in'
  },
  {
    title: 'c',
    hex: '#42d458',
    icon: 'vine'
  },
  {
    title: 'd',
    hex: '#f5e236',
    icon: 'snapchat'
  }
];

//create questions
function Gameplay(props) {
  // Get questions through unique id
  const [displayChoices, setDisplayChoices] = useState(false)
  const [answer, setAnswer] = useState("e")
  const [isCorrect, setIsCorrect] = useState("e")

  const lobbyId = props.match.params.lobbyId;
  
  useEffect(()=>{
    axios.get("/game/"+ lobbyId).then(res => {
      const currentTime = res.data["curr_time"]
      const nextQuestionStartTime = res.data["next_question_start_time"]
      const submitAnswerDeadline = nextQuestionStartTime - currentTime
      setDisplayChoices(true);

      setTimeout(function(){
        setDisplayChoices(false);
        if(answer == "e"){
          axios.put("/player", {"_id": player._id, "answer": answer}).then((res) => {
            setIsCorrect(res.data["is_correct"])
          }).catch((e)=>{
            console.log("wat")
          })
        }
        // milliseconds, 10 seconds for displaying correct/incorrect
      }, submitAnswerDeadline/1000 - 10);
    })
  })

  async function submitAnswer(answer){
    let player = localStorage.getItem("player");
    axios.put("/player", {"_id": player._id, "answer": answer}).then((res) => {
      setAnswer(answer)
      setIsCorrect(res.data["is_correct"])
    }).catch((err)=>{
      console.log("wat")
    })
  }

  return (
    <div className="Gameplay">
      <div className="gameplay-content">
      { displayChoices ?
        <div>
          <Trail 
            items={colors} 
            keys={item => item} 
            from={{opacity: 0}} 
            to={{opacity: 1}}
            duration={1000}
          >
            {
              item => props => 
              <div 
                className="flex-center" 
                style={{...props, 'backgroundColor': item.hex}}
                onClick={
                  ()=>{answer == "e" && submitAnswer(item.title)}
                }
              >
                 <span>{item.title}</span> 
              </div>
            }
          </Trail>
        </div>
        :
        <div>
          {
            //show green or red screen for right or wrong like the traffic lights 
          }
          qpwoeiryqpwoeiryqwpoy
        </div>
      }
      </div>
    </div>
  );
}

export default Gameplay;
