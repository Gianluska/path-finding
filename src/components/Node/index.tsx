import "./node.css";

import * as T from "./types";

export const Node: React.FC<T.INode> = ({
  isInitial,
  isFinal,
  column,
  isWall,
  row,
  onmouseout,
  onmouseup,
  onmouseenter,
  ...props
}) => {
  return (
    <div
      className={`node ${isInitial && "initial"} ${isFinal && "final"} ${isWall && "wall"}`}
      id={`node-${row}-${column}`}
      onMouseDown={() => onmouseout(row, column)}
      onMouseEnter={() => onmouseenter(row, column)}
      onMouseUp={() => onmouseup()}
    ></div>
  );
};
