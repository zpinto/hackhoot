import React, { useState } from "react";
import './Gameplay.scss';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faLinkedInIn, faReddit, faSnapchat, faVine } from '@fortawesome/fontawesome-svg-core'

import { Trail } from 'react-spring/renderprops';

const colors = [
  {
    title: 'red',
    hex: '#fc3835',
    icon: 'reddit'
  },
  { 
    title: 'blue',
    hex: '#5567f2',
    icon: 'linkedin-in'
  },
  {
    title: 'green',
    hex: '#42d458',
    icon: 'vine'
  },
  {
    title: 'yellow',
    hex: '#f5e236',
    icon: 'snapchat'
  }
];

function Gameplay(props) {
  // Get questions through unique id
  
  const [allQuestions, setAllQuestions] = useState([]);
  const [currQuestion, setCurrQuestion] = useState(
    {
      "question": "",
      "A": "answer1",
      "B": "answer2",
      "C": "answer3",
      "D": "answer4",
      "answer": ""
    }
  );

  const lobbyId = props.match.params.lobbyId;

  const answers = colors.map(
    (value, index) => {
      const answer = currQuestion["ABCD"[index]]
      return {...value, answer}
    }
  )
  console.log(answers)
  return (
    <div className="Gameplay">
      <div className="gameplay-content">
        <div>
          <Trail 
            items={answers} 
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
              >
                 <span>{item.answer}</span> 
              </div>
            }
          </Trail>
        </div>
      </div>
    </div>
  );
}

export default Gameplay;
