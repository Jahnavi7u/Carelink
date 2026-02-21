import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodGroupSelector = ({ register }) => {
    const [selected, setSelected] = useState("A+");
    const [positions, setPositions] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            const buttons = containerRef.current.querySelectorAll("button");
            const newPositions = Array.from(buttons).map((btn) => ({
                width: btn.offsetWidth,
                offset: btn.offsetLeft,
            }));
            setPositions(newPositions);
        }
    }, []);

    const handleSelect = (group) => {
        setSelected(group);
    };

    // Ensure initial position is set correctly
    const selectedIndex = bloodGroups.indexOf(selected);
    const selectedPos = positions[selectedIndex] || { width: 50, offset: 0 };

    return (
        <div className="w-full flex justify-center my-4">
            <div
                ref={containerRef}
                className="relative flex bg-white border rounded-full shadow-md p-1 w-fit overflow-hidden"
            >
                {bloodGroups.map((group) => (
                    <button
                        key={group}
                        type="button"
                        onClick={() => handleSelect(group)}
                        className={`relative z-10 px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full ${selected === group ? "text-white" : "text-black"
                            }`}
                    >
                        {group}
                    </button>
                ))}
                {positions.length > 0 && (
                    <motion.div
                        className="absolute top-0 bottom-0 bg-indigo-600 rounded-full"
                        initial={{ x: positions[0]?.offset || 0, width: positions[0]?.width || 50 }}
                        animate={{ x: selectedPos.offset, width: selectedPos.width }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                )}
            </div>
            <input type="hidden" {...register("blood")} value={selected} />
        </div>
    );
};

export default BloodGroupSelector;
