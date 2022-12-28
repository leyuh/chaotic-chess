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
    const {type, color, pos} = props;

    let row = parseInt(pos.substring(0, 1));
    let col = parseInt(pos.substring(2, 3));

    return <div className={`piece-div ${type}`} style={{top: `${row*100+14}px`, left: `${col*100+14}px`}}>
        <img className={`piece-img ${type}-img`}  src={pieceImages[type]} style={
            color == "black" ? {filter: "brightness(30%) contrast(140%)"} : {}
        }/>
    </div>
}

export default Piece;