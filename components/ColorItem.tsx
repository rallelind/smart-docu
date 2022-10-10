import React, { MouseEventHandler } from "react";

interface ColorItem {
    color: string;
    onMouseDown: MouseEventHandler;
}

const ColorItem: React.FC<ColorItem> = ({ color, onMouseDown }) => {
    return (
        <div 
            style={{ backgroundColor: color }} 
            onMouseDown={onMouseDown} 
            className={`h-4 w-4 rounded-full cursor-pointer z-30`}>
        </div>
    )
}

export default ColorItem