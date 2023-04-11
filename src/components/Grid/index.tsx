import "./grid.css";

import { RefObject, useEffect, useRef, useState } from "react";
import { Node } from "../Node";
import { INode } from "../Node/types";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../algorithms/dijkstra";

export const Grid = () => {
  const [grid, setGrid] = useState<INode[][]>([[]]);
  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const maxColumns = Math.floor(
    Math.min(document.body.clientWidth * 0.8, 1280) / 30
  );
  const maxRows = Math.floor((document.body.clientHeight * 0.7) / 30);

  const INITIAL_NODE_ROW = Math.floor(maxColumns / 3.3);
  const INITIAL_NODE_COLUMN = Math.floor(maxColumns / 4);
  const FINAL_NODE_ROW = Math.floor(maxColumns / 3.3);
  const FINAL_NODE_COLUMN = Math.floor(maxColumns / 1.4);

  const handleMouseDown = (row: number, column: number) => {
    const newGrid = getNewGridWithWallToggled(grid, row, column);
    setGrid(newGrid);
    setMousePressed(true);
  };

  const handleMouseEnter = (row: number, column: number) => {
    if (!mousePressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, column);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMousePressed(false);
  };

  const initGrid = () => {
    const grid = [];
    for (let row = 0; row < maxRows; row++) {
      const currentRow: Array<any> = [];
      for (let column = 0; column < maxColumns; column++) {
        currentRow.push(createNode(row, column));
      }
      grid.push(currentRow);
    }

    gridRef.current?.style.setProperty("--columns", `${maxColumns}`);
    gridRef.current?.style.setProperty("--row", `${maxRows}`);

    return grid;
  };

  const createNode = (row: number, column: number) => {
    return {
      column,
      row,
      isInitial: row === INITIAL_NODE_ROW && column === INITIAL_NODE_COLUMN,
      isFinal: row === FINAL_NODE_ROW && column === FINAL_NODE_COLUMN,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const animateShortestPath = (nodesInShortestPathOrder: INode[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        //@ts-ignore
        document
          .querySelector(`#node-${node.row}-${node.column}`)
          .classList.add("node-shortest-path");
      }, 50 * i);
    }
  };

  const animateDijkstra = (
    visitedNodesInOrder: INode[],
    nodesInShortestPathOrder: INode[]
  ) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];

        //@ts-ignore
        document
          .querySelector(`#node-${node.row}-${node.column}`)
          ?.classList.add("node-visited");
      }, 10 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid[INITIAL_NODE_ROW][INITIAL_NODE_COLUMN];
    const finishNode = grid[FINAL_NODE_ROW][FINAL_NODE_COLUMN];
    const visitedNodesInOrder: INode[] | any = dijkstra(
      grid,
      startNode,
      finishNode
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const getNewGridWithWallToggled = (
    grid: INode[][],
    row: number,
    column: number
  ) => {
    const newGrid = grid.slice();
    const node = newGrid[row][column];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][column] = newNode;
    return newGrid;
  };

  const clearGrid = () => {
    location.reload();
  };

  useEffect(() => {
    setGrid(initGrid());
  }, []);

  return (
    <>
      <div>
        <button className="btn" onClick={() => visualizeDijkstra()}>
          DIJKSTRA!
        </button>
        <button className="btn" onClick={() => clearGrid()}>
          CLEAR
        </button>
      </div>
      <div className="grid" ref={gridRef}>
        {grid.map((row, rowIndex) =>
          row.map((node, columnIndex) => {
            const { row, column, isFinal, isInitial, isWall } = node;
            return (
              <Node
                key={columnIndex}
                column={column}
                row={row}
                isFinal={isFinal}
                isInitial={isInitial}
                isWall={isWall}
                mouseIsPressed={mousePressed}
                onmouseenter={() => handleMouseEnter(row, column)}
                onmouseup={() => handleMouseUp()}
                onmouseout={() => handleMouseDown(row, column)}
              />
            );
          })
        )}
      </div>
    </>
  );
};
