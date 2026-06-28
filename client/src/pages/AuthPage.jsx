import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCheckCircle, FiLock, FiLogIn, FiMail, FiUser } from 'react-icons/fi';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const passwordHint =
  'Use 8+ characters with uppercase, lowercase, number, and symbol.';

const AuthPage = ({ mode }) => {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { isAuthenticated, login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  });

  const title = useMemo(
    () => (isSignup ? 'Create your workspace' : 'Welcome back'),
    [isSignup],
  );

  if (isAuthenticated) return <Navigate to="/" replace />;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignup && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(form);
        toast.success('Account created. Please log in.');
        navigate('/login', { replace: true });
        return;
      } else {
        await login({ email: form.email, password: form.password });
        toast.success('Logged in');
      }
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authShell">
      <section className="authPanel">
        <div className="authHero">
          <div>
            <span className="brandIcon">
              <FiCheckCircle />
            </span>
            <p className="eyebrow">Task Tracker</p>
            <h1>{title}</h1>
            <p>
              Plan your day, protect your priorities, and keep every deadline visible.
            </p>
          </div>
          <div className="authHighlights">
            <span>Private task workspace</span>
            <span>Due date alerts</span>
            <span>Analytics dashboard</span>
          </div>
        </div>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="authFormHeader">
            <p className="eyebrow">{isSignup ? 'Start free' : 'Secure access'}</p>
            <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>
          </div>

          {isSignup ? (
            <label>
              Full Name
              <span className="inputWithIcon">
                <FiUser />
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Your Name"
                  autoComplete="name"
                />
              </span>
            </label>
          ) : null}


          <label>
            Email
            <span className="inputWithIcon">
              <FiMail />
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </span>
          </label>

          <label>
            Password
            <span className="inputWithIcon">
              <FiLock />
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Enter your password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </span>
            {isSignup ? <span className="fieldHint">{passwordHint}</span> : null}
          </label>

          {isSignup ? (
            <label>
              Confirm Password
              <span className="inputWithIcon">
                <FiLock />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
              </span>
            </label>
          ) : null}

          {!isSignup ? (
            <div className="authExtras">
              <label className="checkLine">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => updateField('remember', event.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="textButton">
                Forgot Password?
              </button>
            </div>
          ) : null}

          <button className="primaryButton wideButton" type="submit" disabled={loading}>
            {isSignup ? <FiArrowRight /> : <FiLogIn />}
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>

          <p className="authSwitch">
            {isSignup ? 'Already have an account?' : 'New here?'}
            <Link to={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Log in' : 'Create account'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
