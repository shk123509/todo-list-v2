import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <div className={`scroll-to-top animate-fade-in-up`}>
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn hover-glow btn-animated ripple"
            aria-label="Scroll to top"
            title="Back to top"
          >
            <span className="scroll-icon animate-bounce-in">⬆️</span>
            <span className="scroll-text">Top</span>
            <div className="scroll-progress-ring">
              <svg className="progress-ring" width="60" height="60">
                <circle
                  className="progress-ring-circle"
                  stroke="rgba(78, 84, 200, 0.2)"
                  strokeWidth="2"
                  fill="transparent"
                  r="28"
                  cx="30"
                  cy="30"
                />
                <circle
                  className="progress-ring-circle-progress"
                  stroke="#4e54c8"
                  strokeWidth="2"
                  fill="transparent"
                  r="28"
                  cx="30"
                  cy="30"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 28}`,
                    strokeDashoffset: `${2 * Math.PI * 28 * (1 - (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)))}`
                  }}
                />
              </svg>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
