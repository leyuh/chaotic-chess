import React, { useState, useEffect } from 'react';
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

  const [turn, setTurn] = useState("white");

  const [selectedPiece, setSelectedPiece] = useState(null);

  const [possMoves, setPossMoves] = useState([]);

  // highlight possible movement tiles
  useEffect(() => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        let tile = document.getElementById(`tile-${r}-${c}`);
        tile.style.border = "0px";
      }
    }

    for (let i = 0; i < possMoves.length; i++) {
      let tile = document.getElementById(`tile-${possMoves[i][0]}-${possMoves[i][1]}`);
      tile.style.border = "5px solid white";
    }
  }, [possMoves]);

  // black movement
  useEffect(() => {
    if (turn == "black") {
      let allPossibleMoves = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          let pos = currentBoard[r][c];
          if (pos != "" && pos.substring(0, 4) == "opp-") {
            let possibles = getPossibleNewPositions(r, c, "black", pos.substring(4));
            for (let i = 0; i < possibles.length; i++) {
              allPossibleMoves.push([[r, c], [possibles[i][0], possibles[i][1]]]);
            }
          }
        }
      }

      let random = Math.floor(Math.random() * allPossibleMoves.length);
      MovePiece(allPossibleMoves[random][0], allPossibleMoves[random][1]);

    }
  }, [turn])

const InBounds = (pos) => {
    let rowPos = pos[0];
    let colPos = pos[1];

    if (rowPos >= 0 && rowPos <= 7) {
        if (colPos >= 0 && colPos <= 7) {
            return true;
        }
    }

    return false;
}

const Occupant = (pos) => {
    // Check if position on board is empty
    let rowPos = pos[0];
    let colPos = pos[1];

    if (currentBoard[rowPos][colPos] == "") {
        return null;
    }
    if (currentBoard[rowPos][colPos].substring(0, 4) == "opp-") {
        return "black";
    }
    return "white";
}

const GetSlope = (pos, newPos) => {

    let rowPos = pos[0];
    let colPos = pos[1];

    let newRowPos = newPos[0];
    let newColPos = newPos[1];

    // get slope

    let rowChange = (newRowPos - rowPos);
    let colChange = (newColPos - colPos);

    if (pos == newPos) {
        return "none";
    }
    if (rowChange == 0) {
        return "horizontal";
    }
    if (colChange == 0) {
        return "vertical";
    }
    if (rowChange == colChange) {
        return "diagonal"
    }
    return "unclassified";
}

const PathClear = (pos, newPos) => {
    let rowPos = pos[0];
    let colPos = pos[1];

    let newRowPos = newPos[0];
    let newColPos = newPos[1];

    // get slope
    let slope = GetSlope(pos, newPos);

    let rowRange = [Math.min(newRowPos, rowPos), Math.max(newRowPos, rowPos)];
    let colRange = [Math.min(newColPos, colPos), Math.max(newColPos, colPos)];

    // make sure every spot with slope between pos and newPos is available

    for (let r = rowRange[0]; r <= rowRange[1]; r++) {
        for (let c = colRange[0]; c <= colRange[1]; c++) {
            if (GetSlope(pos, [r, c]) == slope && GetSlope([r, c], newPos) == slope) {
                if (Occupant([r, c]) != null) {
                    return false;
                }
            }
        }
    }
    return true;
}

const GetForward = (num, color) => {
    return (color == "black" ? num : (num * -1));
}

const PawnMoves = (row, col, color, newPos, possibleNewPositions) => {
     // if piece is in original place, can move forward 2
     if ((color == "white" && row == 6) || (color == "black" && row == 1)) {
        newPos = [(row + (GetForward(2, color))), col];
        if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }

    // normal move forward 1
    newPos = [(row + (GetForward(1, color))), col];
    if (InBounds(newPos) && Occupant(newPos) == null) {
        possibleNewPositions.push(newPos);
    }

    // right diagonal
    newPos = [row + (GetForward(1, color)), (col + 1)];
    if (InBounds(newPos) && Occupant(newPos) != color && Occupant(newPos) != null) {
        possibleNewPositions.push(newPos);
    }

    // left diagonal
    newPos = [(row + (GetForward(1, color))), (col - 1)];
    if (InBounds(newPos) && Occupant(newPos) != color && Occupant(newPos) != null) {
        possibleNewPositions.push(newPos);
    }

}

const RookMoves = (row, col, color, newPos, possibleNewPositions) => {
    // can move all spaces forward
    for (let i = 1; i < 8; i++) {
        newPos = [(row + i), col];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
    // can move all spaces backward
    for (let i = 1; i < 8; i++) {
        newPos = [(row - i), col];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
    // can move all spaces left
    for (let i = 1; i < 8; i++) {
      newPos = [row, (col - i)];
      if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
          possibleNewPositions.push(newPos);
      }
  }
    // can move all spaces right
    for (let i = 1; i < 8; i++) {
        newPos = [row, col + i];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
}

const KnightMoves = (row, col, color, newPos, possibleNewPositions) => {
    // move in Ls (8 possible moves)
    let moves = [[2, 1], [1, 2], [-2, 1], [-2, -1], [2, -1], [1, -2], [-1, 2], [-1, -2]];

    for (let i = 0; i < moves.length; i++) {
        newPos = [(row + moves[i][0]), (col + moves[i][1])];
        if (InBounds(newPos) && Occupant(newPos) != color) {
            possibleNewPositions.push(newPos);
        }
    }
}

const BishopMoves = (row, col, color, newPos, possibleNewPositions) => {
    // can move all spaces down-right
    for (let i = 1; i < 8; i++) {
        newPos = [(row + i), col + i];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
    // can move all spaces up-left
    for (let i = 1; i < 8; i++) {
        newPos = [(row - i), col - i];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
    // can move all spaces down-left
    for (let i = 1; i < 8; i++) {
        newPos = [(row + i), col - i];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
    // can move all spaces up-right
    for (let i = 1; i < 8; i++) {
        newPos = [(row - i), col + i];
        if (InBounds(newPos) && Occupant(newPos) != color && PathClear([row, col], newPos)) {
            possibleNewPositions.push(newPos);
        }
    }
}

const KingMoves = (row, col, color, newPos, possibleNewPositions) => {
    // (8 possible moves)
    let moves = [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, -1], [0, 1], [1, 0], [-1, 0]];

    for (let i = 0; i < moves.length; i++) {
        newPos = [(row + moves[i][0]), (col + moves[i][1])];
        if (InBounds(newPos) && Occupant(newPos) != color) {
            possibleNewPositions.push(newPos);
        }
    }
}

const getPossibleNewPositions = (row, col, color, type) => {
    let possibleNewPositions = [];
    let newPos;
    switch (type){
        case "pawn":
            PawnMoves(row, col, color, newPos, possibleNewPositions);
            break;
        case "rook":
            RookMoves(row, col, color, newPos, possibleNewPositions);
            break;
        case "knight":
            KnightMoves(row, col, color, newPos, possibleNewPositions);
            break;
        case "bishop":
            BishopMoves(row, col, color, newPos, possibleNewPositions);
            break;
        case "queen":
            RookMoves(row, col, color, newPos, possibleNewPositions);
            BishopMoves(row, col, color, newPos, possibleNewPositions);
            break;
        case "king":
            KingMoves(row, col, color, newPos, possibleNewPositions);
            break;
    }

    return possibleNewPositions;
}

  const MovePiece = (oldPos, newPos) => {

    setCurrentBoard((prev) => {
      let newBoard = [...prev];
      let piece = prev[oldPos[0]][oldPos[1]];
     
      newBoard[oldPos[0]][oldPos[1]] = "";
      newBoard[newPos[0]][newPos[1]] = piece;
      return newBoard;
    })
    setTurn(prev => {
      if (prev == "white") {
        return "black";
      }
      return "white";
    })
    setPossMoves([]);
    setSelectedPiece(null);
  }

  return (
    <>
      <div id="board">
        
        {currentBoard.map((row, r) => {
          return row.map((val, c) => {
            return <div id={`tile-${r}-${c}`} className="tile" style={r % 2 == 0 ? c % 2 == 0 ? {backgroundColor: "#9c2525"} : {backgroundColor: "#18191a"} : c % 2 == 0 ? {backgroundColor: "#18191a"} : {backgroundColor: "#9c2525"}} onClick={() => {

              if (turn == "white" && document.getElementById(`tile-${r}-${c}`).style.border == "5px solid white") {
                MovePiece(selectedPiece, [r, c]);
                
              }
            }} key={`${r}-${c}`}></div>
          })
        })}

        {currentBoard.map((row, r) => {
          return row.map((val, c) => {
            if (val == "") {
              return "";
            }
            if (val.substring(0, 4) == "opp-") {
              return <Piece
                type={val.substring(4)}
                color="black"
                pos={`${r}-${c}`}
                currentBoard={currentBoard}
                setCurrentBoard={setCurrentBoard}
                turn={turn}
                setTurn={turn}
                setPossMoves={setPossMoves}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                getPossibleNewPositions={getPossibleNewPositions}
                MovePiece={MovePiece}
                key={`${r}-${c}`}
              />
            } else {
              return <Piece
                type={val}
                color="white"
                pos={`${r}-${c}`}
                currentBoard={currentBoard}
                setCurrentBoard={setCurrentBoard}
                turn={turn}
                setTurn={turn}
                setPossMoves={setPossMoves}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                getPossibleNewPositions={getPossibleNewPositions}
                MovePiece={MovePiece}
                key={`${r}-${c}`}
              />
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
