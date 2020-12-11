// import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { unescapeIdentifier } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  board = Array();
  pawns = {
    bishop: 'bishop.svg',
    king: 'king.svg',
    knight: 'knight.svg',
    pawn: 'pawn.svg',
    queen: 'queen.svg',
    rok: 'rok.svg',
  };

  columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  pawnPromoteBoxVisible = Array();

  turn = 'w'; // white always starts

  constructor() { }

  ngOnInit(): void {
    // Push 64 tiles into board (8*8) with coordinates and starting positions
    for (let i = 8; i >= 1; i--) {
      var res = i.toString();
      for (let j = 0; j < this.columns.length; j++) {
        var tileCoordinate = res + this.columns[j]
        var pawn = 'assets/pawns/';
        var color = '';
        var type = '';
        var moves = 0;

        switch (true) {
          // IF TILE IS FOR PAWN
          case (i == 7):
            pawn = pawn + "black/" + this.pawns.pawn;
            color = "b";
            type = 'pawn';
            break;
          case (i == 2):
            pawn = pawn + "white/" + this.pawns.pawn;
            color = "w";
            type = 'pawn';
            break;
          // IF TILE IS FOR BISHOP
          case (tileCoordinate == '8c' || tileCoordinate == '8f'):
            pawn = pawn + "black/" + this.pawns.bishop;
            color = "b";
            type = 'bishop';
            break;
          case (tileCoordinate == '1c' || tileCoordinate == '1f'):
            pawn = pawn + "white/" + this.pawns.bishop;
            color = "w";
            type = 'bishop';
            break;
          // IF TILE IS FOR KING
          case (tileCoordinate == '8e'):
            pawn = pawn + "black/" + this.pawns.king;
            color = "b";
            type = 'king';
            break;
          case (tileCoordinate == '1e'):
            pawn = pawn + "white/" + this.pawns.king;
            color = "w";
            type = 'king';
            break;
          // IF TILE IS FOR QUEEN
          case (tileCoordinate == '8d'):
            pawn = pawn + "black/" + this.pawns.queen;
            color = "b";
            type = 'queen';
            break;
          case (tileCoordinate == '1d'):
            pawn = pawn + "white/" + this.pawns.queen;
            color = "w";
            type = 'queen';
            break;
          // IF TILE IS FOR KNIGHT
          case (tileCoordinate == '8b' || tileCoordinate == '8g'):
            pawn = pawn + "black/" + this.pawns.knight;
            color = "b";
            type = 'knight';
            break;
          case (tileCoordinate == '1b' || tileCoordinate == '1g'):
            pawn = pawn + "white/" + this.pawns.knight;
            color = "w";
            type = 'knight';
            break;
          // IF TILE IS FOR ROK
          case (tileCoordinate == '8a' || tileCoordinate == '8h'):
            pawn = pawn + "black/" + this.pawns.rok;
            color = "b";
            type = 'rok';
            break;
          case (tileCoordinate == '1a' || tileCoordinate == '1h'):
            pawn = pawn + "white/" + this.pawns.rok;
            color = "w";
            type = 'rok';
            break;
          default:
            pawn = '';
            color = '';
            type = '';
            break;
        }

        var tileInfo = {
          tileNum: tileCoordinate,
          pawn: pawn,
          color: color,
          type: type,
          moves: moves,
          selected: false,
          highlighted: false
        };

        this.board.push(tileInfo);
      }
    }
  }

  selectPawn(clickedTile: any) { // TODO: RENAME TO selectTile
    if (this.getTurn() == clickedTile.color || clickedTile.highlighted || clickedTile.selected) {
      // Event: Er wordt geklikt op een tile "clickedTile : any"
      // Loop door alle tiles en vind welke tile geklikt is
      // Tile gevonden? : STOP LOOP?
      var notFoundClickedTile = true;
      var i = 0;
      while (notFoundClickedTile && i < this.board.length) {
        if (this.board[i].tileNum == clickedTile.tileNum) { // Geklikte tile gevonden? Laatste regel is foundClickedTile = true;
          // Check of tile een witte pion heeft : Ja?
          if (clickedTile.highlighted) { // Check of geklikte tile gehightlightet is : Ja?
            this.board.forEach(tile => { // Loop door alle tiles heen en vind geselecteerde tile.
              if (tile.selected) { // Gevonden? : Verplaats geselecteerde tile naar geklikte tile
                this.movePawn(tile, clickedTile);
                clickedTile.color == 'w' ? this.setTurn('b') : this.setTurn('w'); // Change turn
              }
            });
          }
          else if (clickedTile.color != '') {
            // Check of tile al geselecteerd is : Ja?
            if (clickedTile.selected) {
              // Deselecteer tile : ACTIE
              // clickedTile.selected = false;
              // Verwijder alle highlights/selecties : LOOP
              this.board.forEach(tile => {
                if (tile.highlighted) { tile.highlighted = false }
                if (tile.selected) { tile.selected = false }
              });
              // Maak de gebruikte array leeg : ACTIE 
            } else { // Check of tile al geselecteerd is : Nee?  
              // Loop opnieuw door het gehele bord om mogelijke nog geselecteerde tiles te deselecteren : INEFFICIIËNT
              if (!clickedTile.highlighted) {

              }
              this.board.forEach(tile => {
                if (tile.highlighted) { tile.highlighted = false }
                if (tile.selected) { tile.selected = false }
              });
              // Selecteer de tile : ACTIE
              clickedTile.selected = true;
              // Check wat voor soort pion is geselecteerd : IF
              // Highlight omliggende tiles waar de pion heen mag : LOOP/NIEUWE FUNCTIE
              // Sla tiles op in een array : ACTIE

              var allowedMoves = this.getAllowedMoves(clickedTile); // Get the allowed moves

              this.board.forEach(tile => { // Select all tiles that player may move to
                allowedMoves.forEach(allowedTile => {
                  if (allowedTile == tile.tileNum) { tile.highlighted = true; }
                });
              });
            }
          }
          notFoundClickedTile = false; // Stop Loop
        }
        i++;
      }
    }

  }

  movePawn(from: any, to: any) {
    var fromSplit = from.tileNum.split('');
    var toSplit = to.tileNum.split('');

    if (Math.abs(fromSplit[0] - toSplit[0]) > 1 && from.type == 'pawn') { // If pawn moves 2 tiles in one move make en passant possible
      this.board.forEach((tile, index) => {
        if (tile.tileNum == to.tileNum) {
          // DECLUTTER THIS
          if (this.board[index - 1].type == 'pawn' && this.board[index - 1].color == 'b' && from.color != 'b') { // If there is a pawn next to destination tile with color black, make en_passant possible 
            to.en_passant = (parseInt(toSplit[0]) - 1) + toSplit[1];
            this.board[index + 8].en_passant = true; // Set tile behind destination tile to en_passant = true;
            console.log('en passant possible: on white at %s', to.en_passant);
            console.log(this.board[index + 8].tileNum);
          }
          if (this.board[index + 1].type == 'pawn' && this.board[index + 1].color == 'b' && from.color != 'b') { // If there is a pawn next to destination tile with color black, make en_passant possible 
            to.en_passant = (parseInt(toSplit[0]) - 1) + toSplit[1];
            this.board[index + 8].en_passant = true; // Set tile behind destination tile to en_passant = true;
            console.log('en passant possible: on white at %s', to.en_passant);
            console.log(this.board[index + 8].tileNum);
          }
          if (this.board[index - 1].type == 'pawn' && this.board[index - 1].color == 'w' && from.color != 'w') { // If there is a pawn next to destination tile with color white, make en_passant possible 
            to.en_passant = (parseInt(toSplit[0]) + 1) + toSplit[1];
            this.board[index - 8].en_passant = true; // Set tile behind destination tile to en_passant = true;
            console.log('en passant possible: on black at %s', to.en_passant);
            console.log(this.board[index - 8].tileNum);
          }
          if (this.board[index + 1].type == 'pawn' && this.board[index + 1].color == 'w' && from.color != 'w') { // If there is a pawn next to destination tile with color white, make en_passant possible 
            to.en_passant = (parseInt(toSplit[0]) + 1) + toSplit[1];
            this.board[index - 8].en_passant = true; // Set tile behind destination tile to en_passant = true;
            console.log('en passant possible: on black at %s', to.en_passant);
            console.log(this.board[index - 8].tileNum);
          }
        }
      });
    }

    this.board.forEach((tile, index) => {
      if (tile.en_passant == true && to.tileNum != tile.tileNum && this.board[index + 8].color == 'b') {
        tile.en_passant = '';
        this.board[index + 8].en_passant = '';
      } else if (tile.en_passant == true && to.tileNum != tile.tileNum && this.board[index - 8].color == 'w') {
        tile.en_passant = '';
        this.board[index - 8].en_passant = '';
      }
    });

    if (to.en_passant) {
      this.board.forEach(tile => {
        if (tile.en_passant === to.tileNum) {
          tile.pawn = '';
          tile.color = '';
          tile.type = '';
          tile.moves = 0;
          tile.en_passant = '';
          to.en_passant = '';
          console.log(to);
          console.log(tile);
        }
      });
    }

    to.pawn = from.pawn;
    to.color = from.color;
    to.type = from.type;
    to.moves = from.moves + 1
    from.pawn = '';
    from.color = '';
    from.type = '';
    from.moves = 0;

    from.selected = false;

    this.board.forEach(tile => {
      tile.highlighted = false;
    });

    // Check for pawn promotion
    if (to.type == 'pawn') {
      if (to.color == 'w' && toSplit[0] == 8) {
        this.drawPawnPromoteBox(to);
      } else if (to.color == 'b' && toSplit[0] == 1) {
        this.drawPawnPromoteBox(to);
      }
    }
  }

  kingMove(currentPos: any) { //TODO: KING CANT BE PLACED WHERE HE CAN BE CAPTURED & CASTLING
    var splitArray = currentPos.tileNum.split('');
    var allowedTiles: Array<any> = [];

    // King may only move one square around it's own tile in any direction
    // Top
    var y = parseInt(splitArray[0]) + 1;
    for (let i = -1; i < 2; i++) {
      var x = this.columns[this.columns.indexOf(splitArray[1]) + i]
      var coordinate = y + x;
      this.board.forEach(tile => {
        if (tile.tileNum == coordinate && tile.color != currentPos.color && coordinate && y > 0 && y < 9) {
          allowedTiles.push(coordinate);
        }
      });
    }
    // Mid
    this.board.forEach(tile => {
      if (tile.tileNum == (y - 1) + this.columns[this.columns.indexOf(splitArray[1]) - 1] && tile.color != currentPos.color) {
        allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) - 1]);
      }
      if (tile.tileNum == (y - 1) + this.columns[this.columns.indexOf(splitArray[1]) + 1] && tile.color != currentPos.color) {
        allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) + 1]);
      }
    });
    // Bottom
    for (let i = -1; i < 2; i++) {
      var y = parseInt(splitArray[0]) - 1;
      var x = this.columns[this.columns.indexOf(splitArray[1]) + i]
      var coordinate = y + x;
      this.board.forEach(tile => {
        if (tile.tileNum == coordinate && tile.color != currentPos.color && coordinate && y > 0 && y < 9) {
          allowedTiles.push(coordinate);
        }
      });
    }
    return allowedTiles;
  }

  pawnMove(currentPos: any) { //TODO: PAWN CAN CHANGE INTO ANY PIECE WHEN IT REACHES ENEMY BORDER
    var splitArray = currentPos.tileNum.split('');
    var allowedTiles: Array<any> = [];
    var y = parseInt(splitArray[0]);
    var x = this.columns[this.columns.indexOf(splitArray[1])]

    if (currentPos.color == 'w') { // IF WHITE MOVES
      var leftDiagonal = y + 1 + this.columns[this.columns.indexOf(splitArray[1]) - 1];
      var rightDiagonal = y + 1 + this.columns[this.columns.indexOf(splitArray[1]) + 1];
    } else { // IF BLACK MOVES
      var leftDiagonal = y - 1 + this.columns[this.columns.indexOf(splitArray[1]) - 1];
      var rightDiagonal = y - 1 + this.columns[this.columns.indexOf(splitArray[1]) + 1];
    }

    this.board.forEach((tile, index) => {
      if (currentPos.color == 'w') { // IF WHITE MOVES
        if (tile.tileNum == y + 1 + x && tile.color == '') { // Pawn may move 1 tile forward if there isn't any other pawn in front of it
          allowedTiles.push(tile.tileNum);
        }
        if (tile.tileNum == y + 2 + x && currentPos.moves < 1 && tile.color == '' && this.board[index + 8].color == '') { // Pawn may only move 2 tiles foward in their first move
          allowedTiles.push(tile.tileNum);
        }
      } else { // IF BLACK MOVES
        if (tile.tileNum == y - 1 + x && tile.color == '') { // Pawn may move 1 tile forward if there isn't any other pawn in front of it
          allowedTiles.push(tile.tileNum);
        }
        if (tile.tileNum == y - 2 + x && currentPos.moves < 1 && tile.color == '' && this.board[index - 8].color == '') { // Pawn may only move 2 tiles foward in their first move
          allowedTiles.push(tile.tileNum);
        }
      }
      // console.log('tile %s',tile.en_passant);
      console.log(rightDiagonal);
      if (tile.tileNum == leftDiagonal && (tile.color != currentPos.color && tile.color != '' || tile.en_passant)) { // Pawn may capture other player if it is 1 tile diagional to itself
        allowedTiles.push(tile.tileNum);
        console.log('diagonal %s', tile.tileNum);
        console.log(tile.color);
        console.log(currentPos.color);
        console.log(tile.en_passant);
      }
      if (tile.tileNum == rightDiagonal) {
        console.log(tile.color);
        console.log(currentPos.color);
        console.log(tile.en_passant); //RAAR
      }
      if (tile.tileNum == rightDiagonal && (tile.color != currentPos.color && tile.color != '' || tile.en_passant)) { // Pawn may capture other player if it is 1 tile diagional to itself
        allowedTiles.push(tile.tileNum);
        console.log('diagonal %s', tile.tileNum);

      }
    });
    return allowedTiles;
  }


  /*
  WHEN:
  movePawn will call this function when a pawn reaches the opposite side of the board
  It will be executed after the initial move is done by the movePawn function
  
  WHAT:
  The function will pop up a box that lets the user decide what piece they want to be.
  When the user clicks on a piece the pawn will be transformed into the new piece before the opponets turn
  
  VARS:
  currentPos = The tile to which the pawn will move
  */
  drawPawnPromoteBox(currentPos: any) {
    currentPos.color == 'w' ? this.pawnPromoteBoxVisible = [true, 'white', currentPos] : this.pawnPromoteBoxVisible = [true, 'black', currentPos]
  }

  pawnPromote(currentPos: any, color: string, pieceChoice: string) {
    var pawn = 'assets/pawns/';
    var goWhile = true;
    var i = 0;
    if (currentPos.type == 'pawn') {
      switch (pieceChoice) {
        case 'queen':
          while (goWhile && i < this.board.length) {
            if (this.board[i].tileNum == currentPos.tileNum) {
              this.board[i].type = pieceChoice;
              this.board[i].pawn = pawn + color + "/" + this.pawns.queen;
              goWhile = false;
            }
            i++
          }
          break;
        case 'knight':
          while (goWhile && i < this.board.length) {
            if (this.board[i].tileNum == currentPos.tileNum) {
              this.board[i].type = pieceChoice;
              this.board[i].pawn = pawn + color + "/" + this.pawns.knight;
              goWhile = false;
            }
            i++
          }
          break;
        case 'rok':
          while (goWhile && i < this.board.length) {
            if (this.board[i].tileNum == currentPos.tileNum) {
              this.board[i].type = pieceChoice;
              this.board[i].pawn = pawn + color + "/" + this.pawns.rok;
              goWhile = false;
            }
            i++
          }
          break;
        case 'bishop':
          while (goWhile && i < this.board.length) {
            if (this.board[i].tileNum == currentPos.tileNum) {
              this.board[i].type = pieceChoice;
              this.board[i].pawn = pawn + color + "/" + this.pawns.bishop;
              goWhile = false;
            }
            i++
          }
          break;
        default:
          break;
      }
    }
    this.pawnPromoteBoxVisible = [];
  }

  getAllowedMoves(clickedTile: any){ // Determine what type the clicked tile is and call the corresponding function to give back the allowed moves
    var allowedMoves = [];
    if (clickedTile) {
      switch (clickedTile.type) {
        case 'pawn':
          allowedMoves = this.pawnMove(clickedTile);
          break;
        case 'king':
          allowedMoves = this.kingMove(clickedTile);
          break;
        default:
          break;
      }
    }
    return allowedMoves;
  }

  getTurn() {
    return this.turn;
  }

  setTurn(turn: string) { // var turn is either 'w' or 'b'
    if (turn == 'w' || turn == 'b') { // ensure that string is either 'white' or 'black'
      this.turn = turn;
    }
  }
}