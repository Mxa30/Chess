import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
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

        switch (true) {
          // IF TILE IS FOR PAWN
          case (i == 7):
            pawn = pawn + "black/" + this.pawns.pawn;
            color = "b";
            break;
          case (i == 2):
            pawn = pawn + "white/" + this.pawns.pawn;
            color = "w";
            break;
          // IF TILE IS FOR BISHOP
          case (tileCoordinate == '8c' || tileCoordinate == '8f'):
            pawn = pawn + "black/" + this.pawns.bischop;
            color = "b";
            break;
          case (tileCoordinate == '1c' || tileCoordinate == '1f'):
            pawn = pawn + "white/" + this.pawns.bischop;
            color = "w";
            break;
          // IF TILE IS FOR KING
          case (tileCoordinate == '8e'):
            pawn = pawn + "black/" + this.pawns.king;
            color = "b";
            break;
          case (tileCoordinate == '1e'):
            pawn = pawn + "white/" + this.pawns.king;
            color = "w";
            break;
          // IF TILE IS FOR QUEEN
          case (tileCoordinate == '8d'):
            pawn = pawn + "black/" + this.pawns.queen;
            color = "b";
            break;
          case (tileCoordinate == '1d'):
            pawn = pawn + "white/" + this.pawns.queen;
            color = "w";
            break;
          // IF TILE IS FOR KNIGHT
          case (tileCoordinate == '8b' || tileCoordinate == '8g'):
            pawn = pawn + "black/" + this.pawns.knight;
            color = "b";
            break;
          case (tileCoordinate == '1b' || tileCoordinate == '1g'):
            pawn = pawn + "white/" + this.pawns.knight;
            color = "w";
            break;
          // IF TILE IS FOR ROK
          case (tileCoordinate == '8a' || tileCoordinate == '8h'):
            pawn = pawn + "black/" + this.pawns.rok;
            color = "b";
            break;
          case (tileCoordinate == '1a' || tileCoordinate == '1h'):
            pawn = pawn + "white/" + this.pawns.rok;
            color = "w";
            break;
          default:
            pawn = '';
            break;
        }

        var tileInfo = {
          tileNum: tileCoordinate,
          pawn: pawn,
          color: color,
          selected: false
        };

        this.board.push(tileInfo);
      }
    }
  }

  selectPawn(clickedTile: any) {
    if (clickedTile.tileNum != '' && clickedTile.color == 'w') {//only select a tile if it is one with a white pawn 
      // select the clicked tile
      this.board.forEach(tile => {
        if (tile.selected && tile == clickedTile) { //deselect the tile if it is the same tile as the previously selected tile
          tile.selected = false;
        }
        else if (tile.selected) { //deselect any other previously selected tile
          tile.selected = false;
        }
        else if (tile == clickedTile) { //select the clicked tile
          tile.selected = true;

          this.board.forEach(checkTile => {
            this.kingMove(checkTile.tileNum).forEach(allowedTile => {
              if(allowedTile == checkTile.tileNum) {
                console.log("WORKS");
                checkTile.selected = true;
              }
            });
          })
        }
      });
    } else { //else try to move to clicked tile

      this.board.forEach(tile => {
        if (tile.selected && tile.pawn != '' && clickedTile.color != tile.color) { // only move tile if it has found the selected tile, that tile has a pawn and the pawn is the players own color
          // change data of clicked tile
          clickedTile.pawn = tile.pawn;
          clickedTile.color = tile.color;
          // remove data from old selected tile
          tile.pawn = '';
          tile.color = '';
          tile.selected = false;
          // this.kingMove(clickedTile.tileNum);
        }
      });

    }
  }

  kingMove(currentPos: string) { //TODO: KING CANT BE PLACED WHERE HE CAN BE CAPTURED
    var splitArray = currentPos.split('');
    var allowedTiles = [];
    // console.log(splitArray);

    // King may only move one square around it's own tile in any direction
    // Top
    for (let i = -1; i < 2; i++) {
      var y = parseInt(splitArray[0]) + 1;
      var x = this.columns[this.columns.indexOf(splitArray[1]) + i]
      var coordinate = y + x;
      if (coordinate && y > 0 && y < 9) { // Check if coordinate is valid within bounds of the board
        // console.log(coordinate);
        allowedTiles.push(coordinate);
      }
    }
    // Mid
    if (this.columns[this.columns.indexOf(splitArray[1]) - 1]) {
      allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) - 1]);
    }
    if (this.columns[this.columns.indexOf(splitArray[1]) + 1]) {
      allowedTiles.push(splitArray[0] + this.columns[this.columns.indexOf(splitArray[1]) + 1]);
    }
    // Bottom

    for (let i = -1; i < 2; i++) {
      var y = parseInt(splitArray[0]) - 1;
      var x = this.columns[this.columns.indexOf(splitArray[1]) + i]
      var coordinate = y + x;
      if (coordinate && y > 0 && y < 9) { // Check if coordinate is valid within bounds of the board
        // console.log(coordinate);
        allowedTiles.push(coordinate);
      }
    }

    // console.log(allowedTiles);
    return allowedTiles;
  }
}
