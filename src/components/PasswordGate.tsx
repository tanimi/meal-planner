'use client';

import { useState, useEffect } from 'react';
import styles from './PasswordGate.module.css';

const STORAGE_KEY = 'meal-planner-authenticated';

// This is a simple client-side gate. Not meant for high-security use cases,
// but sufficient for keeping random internet visitors out.
// The password is checked client-side against an env variable.

interface PasswordGateProps {
  children: React.ReactNode;
  password: string;
}

export default function PasswordGate({ children, password }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(stored === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue === password) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInputValue('');
    }
  };

  // Still checking localStorage
  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Meal Planner</h1>
        <p className={styles.subtitle}>Enter password to continue</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Password"
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
        
        {error && (
          <p className={styles.error}>Incorrect password</p>
        )}
      </div>
    </div>
  );
}
