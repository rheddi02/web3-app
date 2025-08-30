"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "./ui/switch";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true); // Start with dark theme

  useEffect(() => {
    setMounted(true);
    // Set initial theme state
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  // Always render the same structure to prevent hydration mismatch
  return (
    <div className="flex items-center justify-between gap-2 text-sm pb-2">
      {isDark ? (
        <div className="flex items-center gap-2">
          <MoonIcon size={16} />
          <div>Dark Mode</div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <SunIcon size={16} />
          <div>Light Mode</div>
        </div>
      )}
    
      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
      />
    </div>
  );
}
