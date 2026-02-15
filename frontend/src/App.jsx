import React, { useEffect } from "react";
import Routes from "./Routes";

function App() {
  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <Routes />;
}

export default App;
