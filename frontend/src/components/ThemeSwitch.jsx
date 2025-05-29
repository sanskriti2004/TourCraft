import React from "react";
import { useTheme } from "../context/ThemeContext";
import dayMode from "/dayMode.png";
import nightMode from "/nightMode.png";

function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-8 right-8 cursor-pointer">
      <div onClick={toggleTheme}>
        {theme === "light" ? (
          <img src={dayMode} alt="day mode" className="w-8 h-auto" />
        ) : (
          <img src={nightMode} alt="night mode" className="w-8 h-auto" />
        )}
      </div>
    </div>
  );
}

export default ThemeSwitch;
