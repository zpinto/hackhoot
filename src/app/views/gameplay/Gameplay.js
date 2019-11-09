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
  const [displayChoices, setDisplayChoices] = useState(true)
  const [answer, setAnswer] = useState("e")
  const [isCorrect, setIsCorrect] = useState(false)
  const [init, setInit] = useState(false);

  const gameId = props.match.params.gameId;
  console.log(props.match.params);
  
  useEffect(()=>{
    if (!init) {
      cycle();
      setInit(true);
    }
  })

  function cycle() {
    setIsCorrect(false)
    setAnswer("e")
    setDisplayChoices(true);

    axios.get("/game/"+ gameId).then(res => {
      // const currentTime = res.data["cur_time"]["$date"]
      const now = new Date();
      const currentTime = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
      const nextQuestionStartTime = res.data["next_question_start_time"]["$date"]
      const submitAnswerDeadline = nextQuestionStartTime - currentTime - 10 * 1000;
      // const submitAnswerDeadline = res.data["time_limit"]

      setTimeout(function(){
        
        if(answer == "e"){
          let player = JSON.parse(localStorage.getItem("player"));
          axios.put("/player/" + player._id["$oid"], {"answer": answer}).then((res) => {
            setDisplayChoices(false);
          }).catch((e)=>{
            console.log("wat")
          })
        }

        setDisplayChoices(false);
        
        setTimeout(function() {
          cycle();
        }, 13 * 1000)
        // milliseconds, 10 seconds for displaying correct/incorrect
      }, submitAnswerDeadline);
    })
  }

  async function submitAnswer(fanswer){
    let player = JSON.parse(localStorage.getItem("player"));
    console.log(player)
    axios.put("/player/" + player._id["$oid"], {"answer": fanswer}).then((res) => {

      console.log(res.data)
      setAnswer(fanswer)
      setIsCorrect(res.data["is_correct"])
    }).catch((err)=>{
      console.log("wat")
    })
  }

  console.log(isCorrect);

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
            isCorrect ? 
            <div>right</div>
            :
            <div>wrong</div>
          }
        </div>
      }
      </div>
    </div>
  );
}

export default Gameplay;
