// pages/index.tsx
"use client";
import { useState } from "react";
import AIPanel from "@/components/AIPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function Chat() {
  const [isPanelOpen, setPanelOpen] = useState(false);

  const togglePanel = () => {
    setPanelOpen((prev) => !prev);
  };

  return (
    <main>
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 bg-green-800 text-white py-2 px-4 rounded-full shadow-lg"
      >
        <FontAwesomeIcon icon={faRobot} className="text-white" size="lg" />
      </button>
      <AIPanel isOpen={isPanelOpen} onClose={togglePanel}/>
    </main>
  );
}
