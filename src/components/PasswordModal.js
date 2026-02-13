// src/components/PasswordModal.js
import { useState } from "react";

const PasswordModal = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // 💝 Password: "Mopagelitapa"
  const correctAnswer = "Mopagelitapa"; // Stored in lowercase for comparison

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userAnswer = password.toLowerCase().trim();
    
    if (userAnswer === correctAnswer) {
      // Correct password! 🎉
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword("");
      
      // Auto-unlock after 5 attempts
      if (newAttempts >= 5) {
        setTimeout(() => {
          onUnlock();
        }, 2000); // Wait 2 seconds before unlocking
        setError("Okay my love, let me unlock it for you... 💕");
      } else if (newAttempts === 1) {
        setError("Not quite... try again my love ❤️");
      } else if (newAttempts === 2) {
        setError("Think about what we both love to eat on our birthdays! 🎂");
      } else if (newAttempts === 3) {
        setError("Hint: It's a sweet Indian dessert we share together! 🍬");
      } else if (newAttempts === 4) {
        setError("Last try! Think: Round, orange, sweet... our favorite! 🧡");
      }
    }
  };

  return (
    <div className="password-overlay">
      <div className="password-modal">
        <div className="password-icon">❤️</div>
        <h2>Happy Valentine's Day!</h2>
        <div className="password-question">
          Before we celebrate together, answer this:
          <br /><br />
          <strong>What's our favorite sweet that we love to eat on our birthdays? 🎂</strong>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder="Type your answer..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              🔑
            </button>
          </div>
          <button type="submit" className="password-submit">
            Unlock My Valentine 💕
          </button>
        </form>
        
        {error && <div className="password-error">{error}</div>}
        
        <div className="password-hint">
          💡 Think about our special moments together
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;