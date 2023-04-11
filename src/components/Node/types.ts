import { RefObject } from "react";

export interface INode {
  column: number;
  row: number;
  isInitial: boolean;
  isFinal: boolean;
  distance?: number | typeof Infinity;
  isVisited?: boolean;
  isWall: boolean;
  previousNode?: INode;
  mouseIsPressed?: boolean;
  onmouseout: (row: number, column: number) => void;
  onmouseenter: (row: number, column: number) => void;
  onmouseup: () => void;
}
