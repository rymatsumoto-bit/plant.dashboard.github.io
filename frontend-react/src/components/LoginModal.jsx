import { useState } from 'react';
import '../css/main.css';
import { signIn } from '../services/supabase';

export default function LoginModal({ onClose, onSuccess }) {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(''); // Clear any previous errors
    setIsLoading(true);

    try {
      // Call your existing Supabase signIn function
      await signIn(email, password);
      
      // Success! Call the success handler
      onSuccess();
      
    } catch (err) {
      // Show error to user
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal backdrop - clicking it closes modal */}
      <div 
        className="modal-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        {/* Modal content - clicking inside doesn't close */}
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Modal header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.75rem',
              color: '#2C5530'
            }}>
              Login
            </h2>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555'
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Password input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555'
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <p style={{
              fontSize: '0.85rem',
              color: '#666',
              marginBottom: '1.5rem',
              fontStyle: 'italic'
            }}>
              Forgot your password?
            </p>

            {/* Button group */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ddd',
                  backgroundColor: 'var(--c-moss)',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  backgroundColor: '#5A8A4A',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}