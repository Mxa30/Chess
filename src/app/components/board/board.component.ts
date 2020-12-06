// import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  board = Array();
  pawns = {
    bischop: 'bishop.svg',
    king: 'king.svg',
    knight: 'knight.svg',
    pawn: 'pawn.svg',
    queen: 'queen.svg',
    rok: 'rok.svg',
  };

  columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
            pawn = pawn + "black/" + this.pawns.bischop;
            color = "b";
            type = 'bishop';
            break;
          case (tileCoordinate == '1c' || tileCoordinate == '1f'):
            pawn = pawn + "white/" + this.pawns.bischop;
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

  selectPawn(clickedTile: any) {
    // Event: Er wordt geklikt op een tile "clickedTile : any"
    // Loop door alle tiles en vind welke tile geklikt is
    // Tile gevonden? : STOP LOOP?
    var notFoundClickedTile = true;
    var i = 0;
    while (notFoundClickedTile && i < this.board.length) {
      if (this.board[i].tileNum == clickedTile.tileNum) { // Geklikte tile gevonden? Laatste regel is foundClickedTile = true;
        // Check of tile een witte pion heeft : Ja?
        if (clickedTile.color == 'w') {
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
            this.board.forEach(tile => {
              if (tile.highlighted) { tile.highlighted = false }
              if (tile.selected) { tile.selected = false }
            });
            // Selecteer de tile : ACTIE
            clickedTile.selected = true;
            // Check wat voor soort pion is geselecteerd : IF
            // Highlight omliggende tiles waar de pion heen mag : LOOP/NIEUWE FUNCTIE
            // Sla tiles op in een array : ACTIE

            switch (clickedTile.type) {
              case 'pawn':
                var allowedMoves = this.pawnMove(clickedTile);
                break;
              case 'king':
                var allowedMoves = this.kingMove(clickedTile);
                break;
            }
            this.board.forEach(tile => {
              allowedMoves.forEach(allowedTile => {
                if (allowedTile == tile.tileNum) { tile.highlighted = true; }
              });
            });
          }
        } else if (clickedTile.highlighted) { // Check of geklikte tile gehightlightet is : Ja?
          this.board.forEach(tile => { // Loop door alle tiles heen en vind geselecteerde tile.
            if (tile.selected) { // Gevonden? : Verplaats geselecteerde tile naar geklikte tile
              this.movePawn(tile, clickedTile);
            }
          });
        }

        // Check of geklikte tile een lege tile is of een zwarte pion heeft : Ja?
        // Check of er een speler is geselecteerd : Ja? : LOOP & STOP WANNEER GEVONDEN
        // Check of de speler mag verplaatsen naar geklikte tile (check array) : Ja? : LOOP & STOP WANNEER GEVONDEN
        // Check of geklikte tile een zwarte pion heeft : Ja?
        // Tel punt op : ACTIE
        // Verplaats speler naar geklikte tile : ACTIE
        // Deselecteer tile : ACTIE (GESELECTEERDE TILE IS AL GEVONDEN)
        // Verwijder alle highlights : LOOP
        // Maak de gebruikte array leeg : ACTIE

        notFoundClickedTile = false; // Stop Loop
      }
      i++;
    }

  }

  movePawn(from: any, to: any) {
    var fromSplit = from.tileNum.split('');
    var toSplit = to.tileNum.split('');
    
    if (Math.abs(fromSplit[0] - toSplit[0]) > 1 && from.type == 'pawn') { // If pawn moves 2 tiles in one move make en passant possible
      to.en_passant = true;
      this.board.forEach((tile, index) => {
        if (tile.tileNum == to.tileNum) {
          if((this.board[index-1].type == 'pawn' && this.board[index-1].color == 'b') || (this.board[index+1].type == 'pawn' && this.board[index+1].color == 'b')){

            console.log(this.board[index-1].tileNum);
            console.log(this.board[index+1].tileNum);
            console.log('en passant possible');
          }
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
        if (tile.tileNum == coordinate && tile.color != 'w' && coordinate && y > 0 && y < 9) {
          allowedTiles.push(coordinate);
        }
      });
    }
    // Mid
    this.board.forEach(tile => {
      if (tile.tileNum == (y - 1) + this.columns[this.columns.indexOf(splitArray[1]) - 1] && tile.color != 'w') {
        allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) - 1]);
      }
      if (tile.tileNum == (y - 1) + this.columns[this.columns.indexOf(splitArray[1]) + 1] && tile.color != 'w') {
        allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) + 1]);
      }
    });
    // Bottom
    for (let i = -1; i < 2; i++) {
      var y = parseInt(splitArray[0]) - 1;
      var x = this.columns[this.columns.indexOf(splitArray[1]) + i]
      var coordinate = y + x;
      this.board.forEach(tile => {
        if (tile.tileNum == coordinate && tile.color != 'w' && coordinate && y > 0 && y < 9) {
          allowedTiles.push(coordinate);
        }
      });
    }
    return allowedTiles;
  }

  pawnMove(currentPos: any) {
    var splitArray = currentPos.tileNum.split('');
    var allowedTiles: Array<any> = [];
    var y = parseInt(splitArray[0]);
    var x = this.columns[this.columns.indexOf(splitArray[1])]

    var leftDiagonal = y + 1 + this.columns[this.columns.indexOf(splitArray[1]) - 1];
    var rightDiagonal = y + 1 + this.columns[this.columns.indexOf(splitArray[1]) + 1];

    this.board.forEach((tile,index) => {
      if (tile.tileNum == y + 1 + x && tile.color == '') { // Pawn may move 1 tile forward if there isn't any other pawn in front of it
        allowedTiles.push(tile.tileNum);
      }
      if (tile.tileNum == y + 2 + x && currentPos.moves < 1 && tile.color != 'w' && this.board[index+8].color == '') { // Pawn may only move 2 tiles foward in their first move
        allowedTiles.push(tile.tileNum);
      }
      if (tile.tileNum == leftDiagonal && tile.color == 'b') { // Pawn may capture other player if it is 1 tile diagional to itself
        allowedTiles.push(tile.tileNum);
      }
      if (tile.tileNum == rightDiagonal && tile.color == 'b') { // Pawn may capture other player if it is 1 tile diagional to itself
        allowedTiles.push(tile.tileNum);
      }
    });
    return allowedTiles;
  }
}
