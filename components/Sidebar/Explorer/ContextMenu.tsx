import { RefObject } from "react";

export type ContextMenuPosition = {
  x: number,
  y: number;
};

export type ContextMenuField = {
  name: string,
  method: () => void;
};

/**
 * Custom right click menu component.
 */
export default function ContextMenu({ menuRef, position, fields, onClose }: { menuRef: RefObject<HTMLUListElement>, position: ContextMenuPosition, fields: ContextMenuField[], onClose: () => void; }) {
  const handleClick = (field: ContextMenuField) => {
    field.method();
    onClose();
  };

  return (
    <ul ref={menuRef} className="absolute bg-[#beb9b7] text-[#1c1b1b] p-[5px] w-44 rounded-md z-20" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {fields.map((field, key) => (
        <div key={key + "c"}>
          <li className="hover:bg-[#106cd0] hover:text-white text-[13px] py-1 px-2 rounded-md" key={key} onClick={() => handleClick(field)}>{field.name}</li>
        </div>
      ))}
    </ul>
  );
}