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
    const {type, color, pos, currentBoard, setCurrentBoard, turn, setTurn, setPossMoves, setSelectedPiece} = props;

    let row = parseInt(pos.substring(0, 1));
    let col = parseInt(pos.substring(2, 3));

    const SelectTile = (val, r, c) => {

        let tile = document.getElementById(`tile-${r}-${c}`);
        if (val) {
            tile.style.border = "3px solid blue";
        } else {
            tile.style.border = "0px";
        }
    }
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

    const PawnMoves = (newPos, possibleNewPositions) => {
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
        if (InBounds(newPos) && (Occupant(newPos) != null && Occupant(newPos) != color)) {
            possibleNewPositions.push(newPos);
        }

        // left diagonal
        newPos = [(row + (GetForward(1, color))), (col - 1)];
        if (InBounds(newPos) && (Occupant(newPos) != null && Occupant(newPos) != color)) {
            possibleNewPositions.push(newPos);
        }

    }
    
    const RookMoves = (newPos, possibleNewPositions) => {
        // can move all spaces forward
        for (let i = 1; i < 8; i++) {
            newPos = [(row + i), col];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces backward
        for (let i = 1; i < 8; i++) {
            newPos = [(row - i), col];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces left
        for (let i = 1; i < 8; i++) {
            newPos = [(row, col + i)];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces right
        for (let i = 1; i < 8; i++) {
            newPos = [(row, col - i)];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
    }

    const KnightMoves = (newPos, possibleNewPositions) => {
        // move in Ls (8 possible moves)
        let moves = [[2, 1], [1, 2], [-2, 1], [-2, -1], [2, -1], [1, -2], [-1, 2], [-1, -2]];

        for (let i = 0; i < moves.length; i++) {
            newPos = [(row + moves[i][0]), (col + moves[i][1])];
            if (InBounds(newPos) && Occupant(newPos) == null) {
                possibleNewPositions.push(newPos);
            }
        }
    }

    const BishopMoves = (newPos, possibleNewPositions) => {
        // can move all spaces up-right
        for (let i = 1; i < 8; i++) {
            newPos = [(row + i), col + i];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces down-left
        for (let i = 1; i < 8; i++) {
            newPos = [(row - i), col - i];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces up-left
        for (let i = 1; i < 8; i++) {
            newPos = [(row + i, col - i)];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
        // can move all spaces down-right
        for (let i = 1; i < 8; i++) {
            newPos = [(row - i, col + i)];
            if (InBounds(newPos) && Occupant(newPos) == null && PathClear([row, col], newPos)) {
                possibleNewPositions.push(newPos);
            }
        }
    }

    const KingMoves = (newPos, possibleNewPositions) => {
        // (8 possible moves)
        let moves = [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, -1], [0, 1], [1, 0], [-1, 0]];

        for (let i = 0; i < moves.length; i++) {
            newPos = [(row + moves[i][0]), (col + moves[i][1])];
            if (InBounds(newPos) && Occupant(newPos) == null) {
                possibleNewPositions.push(newPos);
            }
        }
    }

    const getPossibleNewPositions = () => {
        let possibleNewPositions = [];
        let newPos;
        switch (type){
            case "pawn":
                PawnMoves(newPos, possibleNewPositions);
                break;
            case "rook":
                RookMoves(newPos, possibleNewPositions);
                break;
            case "knight":
                KnightMoves(newPos, possibleNewPositions);
                break;
            case "bishop":
                BishopMoves(newPos, possibleNewPositions);
                break;
            case "queen":
                RookMoves(newPos, possibleNewPositions);
                BishopMoves(newPos, possibleNewPositions);
                break;
            case "king":
                KingMoves(newPos, possibleNewPositions);
                break;
        }

        return possibleNewPositions;
    }

    return <div className={`piece-div ${type}`} style={{top: `${row*100+14}px`, left: `${col*100+14}px`}} onClick={() => {
        if (turn == color) {
            setSelectedPiece([row, col]);
            let possPos = getPossibleNewPositions();
            setPossMoves(possPos);
        }
    }}>
        <img className={`piece-img ${type}-img`}  src={pieceImages[type]} style={
            color == "black" ? {filter: "brightness(30%) contrast(140%)"} : {}
        }/>
    </div>
}

export default Piece;