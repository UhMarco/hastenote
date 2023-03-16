import { RefObject, useState } from "react";

export type ContextMenuPosition = {
  x: number,
  y: number;
};

export type ContextMenuField = {
  name: string,
  subitems?: ContextMenuField[],
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
    <ul ref={menuRef} className="absolute bg-[#beb9b7] text-[#1c1b1b] p-[5px] w-[176px] rounded-md z-20" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {fields.map((field, key) => (
        <div key={key}>
          {field.subitems?.length
            ?
            <ContextMenuDropdown field={field} propKey={key} />
            :
            <li className="hover:bg-[#106cd0] hover:text-white text-[13px] py-1 px-2 rounded-md" key={key} onClick={() => handleClick(field)}>
              {field.name}
            </li>
          }
        </div>
      ))}
    </ul>
  );
}

function ContextMenuDropdown({ field, propKey }: { field: ContextMenuField, propKey: number; }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <li onMouseOver={handleOpen} onMouseLeave={handleClose} className="hover:bg-[#106cd0] hover:text-white hover:fill-white fill-black hover:stroke-none text-[13px] py-1 px-2 rounded-md flex justify-between items-center">
        {field.name}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="mt-0.5 -mr-1 w-5 h-5">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </li>
      {open &&
        <ul onMouseEnter={handleOpen} onMouseLeave={handleClose} className="absolute bg-[#beb9b7] border-[1px] border-gray-400 text-[#1c1b1b] p-[5px] w-44 rounded-md z-20" style={{ left: "170px", top: `${propKey * 26}px` }}>
          {field.subitems?.map((item, key) => (
            <li className="hover:bg-[#106cd0] hover:text-white text-[13px] py-1 px-2 rounded-md" key={key} onClick={() => item.method()}>{item.name}</li>
          ))}
        </ul>
      }
    </>
  );
}