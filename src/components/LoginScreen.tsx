import { useState, type FormEvent, type CSSProperties, type MouseEvent } from 'react';
import { LayoutDashboard, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color var(--transition)',
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      // Clean up Firebase error messages
      if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
        setError('Invalid email or password.');
      } else if (message.includes('auth/user-not-found')) {
        setError('No account found with this email.');
      } else if (message.includes('auth/too-many-requests')) {
        setError('Too many attempts. Please try again later.');
      } else if (message.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError('Login failed. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          padding: 36,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <LayoutDashboard size={28} color="var(--text-inverse)" />
          </div>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Job Tracker
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>
            Sign in to manage your tasks
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--danger)',
              marginBottom: 20,
            }}
          >
            <AlertCircle size={16} color="var(--danger)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              autoFocus
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 0',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
              fontWeight: 600,
              fontSize: 15,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              transition: 'all var(--transition)',
              marginTop: 4,
            }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
              if (!submitting) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
            }}
          >
            {submitting ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid var(--text-inverse)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>
    </div>
  );
}
