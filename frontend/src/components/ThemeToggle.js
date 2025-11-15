import React from 'react';
import { Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-light"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      style={{
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
};

export default ThemeToggle;

