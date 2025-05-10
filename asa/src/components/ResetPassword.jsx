import React, { useState, useEffect } from 'react';
import UserServices from './services/UserServices';
import { useLocation, useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('reset_password_token');

  // Check password strength whenever it changes
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak (must be at least "Good")';
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = 'Please confirm your password';
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-danger';
      case 1: return 'bg-danger';
      case 2: return 'bg-warning';
      case 3: return 'bg-info';
      case 4: return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await UserServices.changePassword({
        token,
        password,
        passwordConfirmation
      });
      
      setMessage(response.data.message || 'Password reset successfully');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loader component
  const Loader = ({ small = false }) => (
    <div className="d-flex justify-content-center align-items-center">
      <div 
        className={`spinner-border ${small ? 'spinner-border-sm' : ''} text-white`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2">Processing...</span>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Reset Password</h2>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password 
                    {password && (
                      <span className={`badge ${getPasswordStrengthColor()} ms-2`}>
                        {getPasswordStrengthText()}
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback">{validationErrors.password}</div>
                  )}
                  <div className="progress mt-2" style={{ height: '5px' }}>
                    <div
                      className={`progress-bar ${getPasswordStrengthColor()}`}
                      role="progressbar"
                      style={{ width: `${(passwordStrength + 1) * 25}%` }}
                      aria-valuenow={passwordStrength * 25}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted">
                    Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="passwordConfirmation" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${validationErrors.passwordConfirmation ? 'is-invalid' : ''}`}
                    id="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  {validationErrors.passwordConfirmation && (
                    <div className="invalid-feedback">{validationErrors.passwordConfirmation}</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading || !password || !passwordConfirmation}
                >
                  {isLoading ? <Loader small /> : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Full page loader overlay */}
      {isLoading && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ 
            zIndex: 9999, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            pointerEvents: 'none' 
          }}
        >
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
