import React, {useState} from 'react';
import "./styles/App.css";

import Piece from './Piece';

function Board() {

  const [currentBoard, setCurrentBoard] = useState([
    ["opp-rook", "opp-knight", "opp-bishop", "opp-queen", "opp-king", "opp-bishop", "opp-knight", "opp-rook"],
    ["opp-pawn", "opp-pawn", "opp-pawn", "opp-pawn", "opp-pawn", "opp-pawn", "opp-pawn", "opp-pawn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
    ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
  ])

  return (
    <>
      <div id="board">
        {currentBoard.map((row, r) => {
          return row.map((val, c) => {
            return <div className="tile" style={r % 2 == 0 ? c % 2 == 0 ? {backgroundColor: "white"} : {backgroundColor: "gray"} : c % 2 == 0 ? {backgroundColor: "gray"} : {backgroundColor: "white"}} key={`${r}-${c}`}></div>
          })
        })}

        {currentBoard.map((row, r) => {
          return row.map((val, c) => {
            if (val == "") {
              return "";
            }
            if (val.substring(0, 4) == "opp-") {
              return <Piece type={val.substring(4)} color="black" pos={`${r}-${c}`} key={`${r}-${c}`}/>
            } else {
              return <Piece type={val} color="white" pos={`${r}-${c}`} key={`${r}-${c}`}/>
            }
          })
        })}
      </div>

      <div id="info">
        <h1>Chaotic Chess</h1>
        <ul>
          <li>
            <h3>King - Elon Musk</h3>
            <h6>There is none more deserving of the title of King than the Musketeer himself. Protect him at all costs.</h6>
          </li>
          <li>
            <h3>Queen - Lex Fridman</h3>
            <h6>Like the queen, Lex Fridman gets stuff done. Also, he is a simp for Musk.</h6>
          </li>
          <li>
            <h3>Bishop - David Goggins</h3>
            <h6>Goggins moves fast and stealthily. You won't see him coming.</h6>
          </li>
          <li>
            <h3>Knight - Ben Shapiro</h3>
            <h6>Ben will knock down anyone in his path, because facts don't care about your feelings.</h6>
          </li>
          <li>
            <h3>Rook - Jordan Peterson</h3>
            <h6>Jordan is a straight-forward, hard-hitting guy.</h6>
          </li>
          <li>
            <h3>Pawn - Joe Rogan</h3>
            <h6>Joe is an essential asset (kind of). His height is the only thing in his way.</h6>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Board;
