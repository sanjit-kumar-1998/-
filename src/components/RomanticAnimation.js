// src/components/RomanticAnimation.js
import { useState, useEffect, useRef } from "react";
import "../romanticAnimation.css";

// Voice Recording Component
const VoiceRecordingMessage = ({ animationAudioRef, clickAudioRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      // Stop all audio when starting recording
      if (animationAudioRef.current) {
        animationAudioRef.current.pause();
      }
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(blob);
        setAudioURL(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        // Resume animation music after recording stops
        if (animationAudioRef.current) {
          animationAudioRef.current.play().catch(() => {});
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert(
        "Microphone access denied. Please allow microphone access to record your voice.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const downloadRecording = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pageli-voice-for-you-${Date.now()}.webm`;
      a.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="message-box fade-in-scale voice-recording-box">
      <div className="message-icon">🎤</div>
      <h2 className="message-heading">One More Thing, My Love...</h2>
      <div className="message-content">
        <p className="message-text">
          I've shared my heart with you through these messages.
          <br />
          <br />
          Now, I have a small request...
          <br />
          <br />
          <strong>Would you record a voice message for me?</strong>
          <br />
          Just a few words, your voice, your thoughts...
          <br />
          Something I can listen to whenever I miss you.
          <br />
          <br />
          It would mean the world to me. 💕
        </p>

        <div className="voice-controls">
          {!isRecording && !recordedAudio && (
            <button
              className="record-button"
              onClick={(e) => {
                e.stopPropagation();
                startRecording();
              }}
            >
              <span className="mic-icon">🎤</span>
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <div className="recording-active">
              <div className="recording-indicator">
                <span className="pulse-dot"></span>
                <span className="recording-text">Recording...</span>
              </div>
              <div className="recording-timer">{formatTime(recordingTime)}</div>
              <button
                className="stop-button"
                onClick={(e) => {
                  e.stopPropagation();
                  stopRecording();
                }}
              >
                <span>⏹ Stop Recording</span>
              </button>
            </div>
          )}

          {recordedAudio && !isRecording && (
            <div className="recording-complete">
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span>Voice recorded successfully!</span>
              </div>
              <div className="audio-actions">
                <button
                  className="play-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playRecording();
                  }}
                >
                  <span>▶️ Play</span>
                </button>
                <button
                  className="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadRecording();
                  }}
                >
                  <span>💾 Download</span>
                </button>
                <button
                  className="re-record-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecordedAudio(null);
                    setAudioURL(null);
                    setRecordingTime(0);
                  }}
                >
                  <span>🔄 Record Again</span>
                </button>
              </div>
              <p className="save-instruction">
                Click "Download" to save your voice message!
                <br />
                I'll treasure it forever. ❤️
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="message-footer">
        <span className="message-hearts">💕 🎤 💕</span>
      </div>
    </div>
  );
};

const RomanticAnimation = ({ onClose, audioRef }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [effects, setEffects] = useState([]);
  const animationAudioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const timerRef = useRef(null);
  const nextMessageTimeRef = useRef(0);

  useEffect(() => {
    // Pause the main background music when animation opens
    if (audioRef && audioRef.current) {
      audioRef.current.pause();
    }

    // Start animation background music
    animationAudioRef.current = new Audio("/music/valentine.mp3"); // You can use any romantic music file
    animationAudioRef.current.loop = true;
    animationAudioRef.current.volume = 0.5;
    animationAudioRef.current.play().catch(() => {});

    // Show first message immediately
    setCurrentMessage(1);
    nextMessageTimeRef.current = Date.now() + 10000; // 10 seconds

    return () => {
      if (animationAudioRef.current) {
        animationAudioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Resume main music when animation closes
      if (audioRef && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
  }, [audioRef]);

  // Timer to advance messages
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused && currentMessage < 8) {
        if (Date.now() >= nextMessageTimeRef.current) {
          setCurrentMessage((prev) => prev + 1);
          nextMessageTimeRef.current = Date.now() + 10000; // Next message in 10 seconds
        }
      }
    }, 100); // Check every 100ms

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentMessage, isPaused]);

  const handleClose = (e) => {
    e.stopPropagation();
    // Stop animation music and resume main music
    if (animationAudioRef.current) {
      animationAudioRef.current.pause();
    }
    if (audioRef && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    onClose();
  };

  // Touch/Mouse hold to pause
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    // Reset next message time when releasing
    nextMessageTimeRef.current = Date.now() + 10000;
  };

  // Click effect with voice and visuals
  const handleClick = (e) => {
    // Lower animation background music
    if (animationAudioRef.current) {
      animationAudioRef.current.volume = 0.2;
    }

    // Play voice clip
    if (clickAudioRef.current) {
      clickAudioRef.current.pause();
      clickAudioRef.current.currentTime = 0;
    }

    clickAudioRef.current = new Audio("/sounds/pageli.mp3");
    clickAudioRef.current.volume = 1;
    clickAudioRef.current.play().catch(() => {});

    // Restore music volume after voice ends
    clickAudioRef.current.onended = () => {
      if (animationAudioRef.current) {
        animationAudioRef.current.volume = 0.5;
      }
    };

    // Create click effect burst
    const x = e.clientX;
    const y = e.clientY;

    const burst = Array.from({ length: 10 }).map(() => ({
      id: Math.random(),
      x,
      y,
      size: 18 + Math.random() * 26,
      offsetX: (Math.random() - 0.5) * 120,
      type: Math.random() > 0.5 ? "❤️" : "🌹",
    }));

    setEffects((prev) => [...prev, ...burst]);

    setTimeout(() => {
      setEffects((prev) => prev.slice(burst.length));
    }, 1600);
  };

  return (
    <div
      className="animation-overlay"
      onClick={handleClick}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="close-animation" onClick={handleClose}>
        ✕
      </button>

      {/* Click effects */}
      {effects.map((e) => (
        <span
          key={e.id}
          className="click-effect-animation"
          style={{
            left: e.x + e.offsetX,
            top: e.y,
            fontSize: e.size,
          }}
        >
          {e.type}
        </span>
      ))}

      <div className="animation-scene">
        {/* Floating romantic elements */}
        <div className="bg-floating-elements">
          {[...Array(30)].map((_, i) => {
            const elements = ["❤️", "💕", "🌹", "✨", "💖", "💝"];
            return (
              <div
                key={i}
                className="float-element"
                style={{
                  "--float-delay": `${Math.random() * 5}s`,
                  "--float-duration": `${4 + Math.random() * 3}s`,
                  "--float-x": `${Math.random() * 100}%`,
                }}
              >
                {elements[Math.floor(Math.random() * elements.length)]}
              </div>
            );
          })}
        </div>

        {/* Message 1: Opening Love Letter */}
        {currentMessage >= 1 && currentMessage === 1 && (
          <div className="message-box fade-in-scale">
            <div className="message-icon">💌</div>
            <h2 className="message-heading">To My Dearest Pageli</h2>
            <div className="message-content">
              <p className="message-text">
                Every moment I spend with you feels like a beautiful dream I
                never want to wake up from.
                <br />
                <br />
                You are the reason behind my smiles, my laughter, and my
                happiness.
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">💕 ❤️ 💕</span>
            </div>
          </div>
        )}

        {/* Message 2: Why I Love You */}
        {currentMessage >= 2 && currentMessage === 2 && (
          <div className="message-box fade-in-scale">
            <div className="message-icon">💖</div>
            <h2 className="message-heading">Why I Love You</h2>
            <div className="message-content">
              <p className="message-text">
                I love the way you make me feel safe.
                <br />
                I love how your smile lights up my entire world.
                <br />
                I love every little thing about you.
                <br />
                <br />
                You are my comfort, my peace, my everything.
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">✨ 💗 ✨</span>
            </div>
          </div>
        )}

        {/* Message 3: Our Love Story - UPDATED */}
        {currentMessage >= 3 && currentMessage === 3 && (
          <div className="message-box fade-in-scale">
            <div className="message-icon">📖</div>
            <h2 className="message-heading">Our Love Story</h2>
            <div className="message-content">
              <p className="message-text">
                In a world full of billions of people, somehow we found each
                other.
                <br />
                <br />
                It wasn't luck. It wasn't coincidence.
                <br />
                It was destiny bringing one soul together in two different
                bodies.
                <br />
                <br />
                And I thank the universe every single day for you.
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">🌟 💫 🌟</span>
            </div>
          </div>
        )}

        {/* Message 4: Romantic Promise */}
        {currentMessage >= 4 && currentMessage === 4 && (
          <div className="message-box fade-in-scale">
            <div className="message-icon">💍</div>
            <h2 className="message-heading">My Promise to You</h2>
            <div className="message-content">
              <p className="message-text">
                I promise to love you in the sunshine and in the rain.
                <br />
                I promise to hold your hand through every storm.
                <br />
                I promise to be your biggest cheerleader.
                <br />
                I promise to choose you, every single day, for the rest of my
                life.
                <br />
                <br />
                <strong>You are my forever.</strong>
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">💕 💖 💕</span>
            </div>
          </div>
        )}

        {/* Message 5: What You Mean to Me */}
        {currentMessage >= 5 && currentMessage === 5 && (
          <div className="message-box fade-in-scale">
            <div className="message-icon">🌹</div>
            <h2 className="message-heading">What You Mean to Me</h2>
            <div className="message-content">
              <p className="message-text">
                You are my sunrise after the darkest night.
                <br />
                You are my calm in the middle of chaos.
                <br />
                You are my home, no matter where we are.
                <br />
                <br />
                With you, I am complete.
                <br />
                With you, I am home.
                <br />
                With you, I am ME.
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">❤️ 🌹 ❤️</span>
            </div>
          </div>
        )}

        {/* Message 6: Valentine's Declaration - SCROLLABLE */}
        {currentMessage >= 6 && currentMessage === 6 && (
          <div className="message-box message-box-6 fade-in-scale">
            <div className="message-icon">💝</div>
            <h2 className="message-heading">Happy Valentine's Day</h2>
            <div className="message-content">
              <h3 className="special-name">Mo Pageli 💕</h3>
              <p className="message-text">
                On this special day, I want you to know:
                <br />
                <br />
                You are my greatest blessing, my sweetest dream, my answered
                prayer.
                <br />
                <br />
                Out of all the people in this world, my heart chose YOU.
                <br />
                And it will choose you again and again, in every lifetime.
                <br />
                <br />
                <strong>Forever My Valentine ❤️</strong>
              </p>
            </div>
            <div className="message-footer">
              <span className="message-hearts">💖 💝 💗 💕 ❤️</span>
            </div>
          </div>
        )}

        {/* Message 7: Final Message with Fireworks */}
        {currentMessage >= 7 && currentMessage === 7 && (
          <>
            <div className="message-box fade-in-scale final-box">
              <div className="message-icon big-heart">❤️</div>
              <h2 className="message-heading final-heading">I Love You</h2>
              <div className="message-content">
                <h3 className="special-name glowing-name">Mo Pageli</h3>
                <p className="message-text final-text">
                  Today, tomorrow, and forever...
                  <br />
                  You are my always.
                  <br />
                  <br />
                  <strong className="golden-text">
                    You Are My Everything 💫
                  </strong>
                </p>
              </div>
              <div className="message-footer">
                <span className="signature-love">— Yours Forever ❤️</span>
              </div>
            </div>

            {/* Heart fireworks only */}
            <div className="heart-fireworks">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="firework-heart"
                  style={{
                    "--firework-angle": `${(360 / 30) * i}deg`,
                    "--firework-distance": `${250 + Math.random() * 100}px`,
                    "--firework-delay": `${0.5 + Math.random() * 0.5}s`,
                  }}
                >
                  💖
                </div>
              ))}
            </div>
          </>
        )}

        {/* Message 8: Voice Recording Request */}
        {currentMessage >= 8 && (
          <VoiceRecordingMessage
            animationAudioRef={animationAudioRef}
            clickAudioRef={clickAudioRef}
          />
        )}

        {/* Music notes floating throughout */}
        {currentMessage >= 1 && (
          <div className="music-notes">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="music-note"
                style={{
                  "--note-delay": `${i * 0.7}s`,
                  "--note-x": `${10 + i * 11}%`,
                }}
              >
                🎵
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <div className="tap-to-close">
        {isPaused ? "⏸ Paused - Release to continue" : "Hold screen to pause | Click ✕ to close"}
      </div> */}
    </div>
  );
};

export default RomanticAnimation;
