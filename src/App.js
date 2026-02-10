import { useState } from "react";
import SpecialDay from "./components/SpecialDay";
import Locked from "./components/Locked";
import PasswordModal from "./components/PasswordModal";
import dayConfig from "./config/dayConfig";
import { getUnlockedDays } from "./utils/date";
import "./index.css";

function App() {
  const unlockedTill = getUnlockedDays();
  const [valentineUnlocked, setValentineUnlocked] = useState(false);

  const unlockedDays = dayConfig
    .filter(d => d.day <= unlockedTill)
    .map(d => d.day);

  // Check if it's Valentine's Day (day 14)
  const isValentineDay = unlockedDays.includes(14);

  // If no days unlocked yet
  if (unlockedDays.length === 0) {
    return <Locked />;
  }

  // If Valentine's Day is unlocked but password not entered yet
  if (isValentineDay && !valentineUnlocked) {
    return (
      <>
        <SpecialDay unlockedDays={unlockedDays} />
        <PasswordModal onUnlock={() => setValentineUnlocked(true)} />
      </>
    );
  }

  // Normal flow
  return <SpecialDay unlockedDays={unlockedDays} />;
}

export default App;
