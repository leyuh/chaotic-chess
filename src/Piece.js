import "./styles/Piece.css";

const pieceImages = {
    pawn: require("./images/pawn.png"),
    rook: require("./images/rook.png"),
    knight: require("./images/knight.png"),
    bishop: require("./images/bishop.png"),
    king: require("./images/king.png"),
    queen: require("./images/queen.png"),
}

const Piece = (props) => {
    const {type, color, pos, currentBoard, setCurrentBoard, turn, setTurn} = props;

    let row = parseInt(pos.substring(0, 1));
    let col = parseInt(pos.substring(2, 3));

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

    const PathClear = (pos, newPos, type) => {
        let rowPos = pos[0];
        let colPos = pos[1];

        let newRowPos = newPos[0];
        let newColPos = newPos[1];

        if (type == "knight") {
            return true;
        }

        // get slope
        let slope = GetSlope(pos, newPos);

        let rowRange = [Math.min(newRowPos, rowPos), Math.max(newRowPos, rowPos)];
        let colRange = [Math.min(newColPos, colPos), Math.max(newColPos, colPos)];

        
        // make sure every spot with slope between pos and newPos is available

        for (let r = rowRange[0]; r <= rowRange[1]; r++) {
            for (let c = colRange[0]; c <= colRange[1]; c++) {
                if (GetSlope(pos, [r, c]) != slope || GetSlope([r, c], newPos) != slope) {
                    return false;
                }
            }
        }

        return true;
    }

    const GetForward = (num, color) => {
        return (color == "black" ? num : (num * -1));
    }

    const getPossibleNewPositions = () => {
        let possibleNewPositions = [];
        let newPos;
        switch (type){
            case "pawn":
                 // if piece is in original place, can move forward 2
                if ((color == "white" && row == 6) || (color == "black" && row == 2)) {
                    newPos = [(row + (GetForward(2, color))), col];
                    if (InBounds(newPos) && Occupant(newPos) == null && PathClear(pos, newPos, type)) {
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

                break;
            case "rook":
                // can move all spaces forward
                // can move all spaces sideways
                break;
            case "knight":
                // 2 forward, 1 sideways (8 possible moves)
                break;
            case "bishop":
                // diagonal all spaces
                break;
            case "queen":
                // all spaces diagonal, forward, back, sideways
                break;
            case "king":
                // diagonal, forward, back, sideways 1 space
                break;
        }

        return possibleNewPositions;
    }

    return <div className={`piece-div ${type}`} style={{top: `${row*100+14}px`, left: `${col*100+14}px`}} onClick={() => {
        let possPos = getPossibleNewPositions();
        console.log(possPos);
        for (let i = 0; i < possPos.length; i++) {
            console.log("ping");
            document.getElementById(`tile-${possPos[i][0]}-${possPos[i][1]}`).style = {backgroundColor : "#0000ff"};
        }
    }}>
        <img className={`piece-img ${type}-img`}  src={pieceImages[type]} style={
            color == "black" ? {filter: "brightness(30%) contrast(140%)"} : {}
        }/>
    </div>
}

export default Piece;