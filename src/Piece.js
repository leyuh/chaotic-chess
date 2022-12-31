import "./styles/Piece.css";
import React, {useState} from 'react';

const pieceImages = {
    pawn: require("./images/pawn.png"),
    rook: require("./images/rook.png"),
    knight: require("./images/knight.png"),
    bishop: require("./images/bishop.png"),
    king: require("./images/king.png"),
    queen: require("./images/queen.png"),
}

const Piece = (props) => {
    const {type, color, pos, currentBoard, setCurrentBoard, turn, setTurn, setPossMoves, selectedPiece, setSelectedPiece, getPossibleNewPositions, MovePiece} = props;

    let row = parseInt(pos.substring(0, 1));
    let col = parseInt(pos.substring(2, 3));

    

    return <div className={`piece-div ${type}`} style={{top: `${row*100+14}px`, left: `${col*100+14}px`}} onClick={() => {

        if (turn == "white" && color == "white") {
            setSelectedPiece([row, col]);
            let possPos = getPossibleNewPositions(row, col, color, type);
            setPossMoves(possPos);
        } else if (turn == "white" && color == "black") {
            if (document.getElementById(`tile-${row}-${col}`).style.border == "5px solid white") {
                MovePiece(selectedPiece, [row, col]);
            }
        }
    }}>
        <img className={`piece-img ${type}-img`}  src={pieceImages[type]} style={
            color == "black" ? {filter: "brightness(30%) contrast(140%)"} : {}
        }/>
    </div>
}

export default Piece;