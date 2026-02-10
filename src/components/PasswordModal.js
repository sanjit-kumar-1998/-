// src/components/PasswordModal.js
import { useState } from "react";

const PasswordModal = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // 💝 You can customize these - choose what's special to both of you!
  const correctAnswers = [
    "pageli",      // Your nickname for her
    "pagli",       // Alternative spelling
    "forever",     // Romantic answer
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userAnswer = password.toLowerCase().trim();
    
    if (correctAnswers.includes(userAnswer)) {
      // Correct password! 🎉
      onUnlock();
    } else {
      setAttempts(attempts + 1);
      setPassword("");
      
      if (attempts === 0) {
        setError("Not quite... try again my love ❤️");
      } else if (attempts === 1) {
        setError("Think about what I always call you 💕");
      } else {
        setError("Hint: It's my favorite nickname for you! 😊");
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
          <strong>What do I call you when I want to make you smile?</strong>
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