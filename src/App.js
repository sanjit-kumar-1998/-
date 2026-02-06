import SpecialDay from "./components/SpecialDay";
import Locked from "./components/Locked";
import dayConfig from "./config/dayConfig";
import { getUnlockedDays } from "./utils/date";
import "./index.css";

function App() {
  const unlockedTill = getUnlockedDays();

  const unlockedDays = dayConfig
    .filter(d => d.day <= unlockedTill)
    .map(d => d.day);

  if (unlockedDays.length === 0) {
    return <Locked />;
  }

  return <SpecialDay unlockedDays={unlockedDays} />;
}

export default App;