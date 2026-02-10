import { useState, useRef, useEffect } from "react";
import dayConfig from "../config/dayConfig";

const SpecialDay = ({ unlockedDays }) => {
  const [index, setIndex] = useState(unlockedDays.length - 1);
  const [effects, setEffects] = useState([]);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);

  const data = dayConfig.find(d => d.day === unlockedDays[index]);

  /* ---------- MUSIC (HOOK MUST BE HERE) ---------- */
  useEffect(() => {
    if (!musicStarted || !data || !data.music) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(data.music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;

    audioRef.current.play().catch(() => {});
  }, [index, musicStarted, data]);

  /* ---------- SWIPE ---------- */
  let startX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50 && index < unlockedDays.length - 1) {
      setIndex(index + 1);
    }
    if (endX - startX > 50 && index > 0) {
      setIndex(index - 1);
    }
  };

  /* ---------- CLICK EFFECT + AUDIO DUCKING ---------- */
  const handleClick = (e) => {
    // Start background music on first interaction
    if (!musicStarted) setMusicStarted(true);

    /* 🔉 LOWER BACKGROUND MUSIC */
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // reduce volume
    }

    /* 🎤 PLAY VOICE */
    if (data?.clickSound) {
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current.currentTime = 0;
      }

      clickAudioRef.current = new Audio(data.clickSound);
      clickAudioRef.current.volume = 1;
      clickAudioRef.current.play().catch(() => {});

      // 🔊 Restore background music after voice ends
      clickAudioRef.current.onended = () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.6; // back to normal
        }
      };
    }

    /* 🌹 EMOJI BURST AT CLICK POSITION */
    const x = e.clientX;
    const y = e.clientY;

    const burst = Array.from({ length: 10 }).map(() => ({
      id: Math.random(),
      x,
      y,
      size: 18 + Math.random() * 26,
      offsetX: (Math.random() - 0.5) * 120
    }));

    setEffects(prev => [...prev, ...burst]);

    setTimeout(() => {
      setEffects(prev => prev.slice(burst.length));
    }, 1600);
  };

  /* ---------- SAFE RETURN ---------- */
  if (!data) return null;

  return (
    <div
      className={`page ${data.bgClass}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ "--heart-color": data.heartColor }}
    >
      {/* Floating hearts bottom */}
      <div className="bg-hearts">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            style={{
              "--pos": Math.random(),
              "--time": Math.random(),
              "--delay": Math.random()
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Falling icons from top */}
      <div className="bg-roses">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            style={{
              "--pos": Math.random(),
              "--time": Math.random(),
              "--delay": Math.random()
            }}
          >
            {data.icon}
          </span>
        ))}
      </div>

      {/* ✨ SPARKLES for romantic days (10-14) */}
      {data.day >= 10 && (
        <div className="sparkle-container">
          {[...Array(25)].map((_, i) => (
            <span
              key={i}
              className="sparkle"
              style={{
                "--sparkle-pos-x": Math.random(),
                "--sparkle-pos-y": Math.random(),
                "--sparkle-time": Math.random(),
                "--sparkle-delay": Math.random()
              }}
            />
          ))}
        </div>
      )}

      {/* 🎊 CONFETTI for Valentine's Day (day 14) */}
      {data.day === 14 && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => {
            const colors = ["#ff0844", "#ff6b9d", "#ffa8c5", "#ffeb3b", "#fff"];
            return (
              <span
                key={i}
                className="confetti"
                style={{
                  "--confetti-color": colors[Math.floor(Math.random() * colors.length)],
                  "--confetti-pos": Math.random(),
                  "--confetti-time": Math.random(),
                  "--confetti-delay": Math.random()
                }}
              />
            );
          })}
        </div>
      )}

      {/* Click burst */}
      {effects.map(e => (
        <span
          key={e.id}
          className="click-effect"
          style={{
            left: e.x + e.offsetX,
            top: e.y,
            fontSize: e.size,
            color: data.heartColor
          }}
        >
          {data.icon}
        </span>
      ))}

      {/* CARD */}
      <div className="canva-card fade-in">
        <div className="day-icon">{data.icon}</div>
        <h1 className="title">{data.title}</h1>

        <p className="dear">❤️ ମୋ ପାଗେଳୀ ❤️</p>

        <p className="main-text">{data.message}</p>

        <div className="highlight-box">{data.quote}</div>

        <p className="signature">
          With all my love <br />
          <span>— Yours Forever ❤️</span>
        </p>

        <div className="countdown">
          Day {data.day} of Valentine Week
        </div>

        <p className="swipe-hint">
          Tap anywhere 💖 | Swipe ← →
        </p>
      </div>
    </div>
  );
};

export default SpecialDay;
