import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiImage,
  FiLock,
  FiMail,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('en', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(date))
    : 'Recently';

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { user, updateProfile, changePassword } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('task-theme') === 'dark');
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('task-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
    });
  }, [user]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await taskApi.getAll();
        setTasks(response.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load profile stats');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'Completed').length;
    const pending = tasks.filter((task) => task.status === 'Pending').length;
    const productivity = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    return [
      { label: 'Total Tasks', value: tasks.length, icon: FiUser, key: 'total' },
      { label: 'Completed', value: completed, icon: FiCheckCircle, key: 'completed' },
      { label: 'Pending', value: pending, icon: FiClock, key: 'pending' },
      { label: 'Productivity', value: `${productivity}%`, icon: FiTrendingUp, key: 'progress' },
    ];
  }, [tasks]);

  const activeSection = searchParams.get('section') || 'profile';
  const displayName = user?.fullName || user?.name || 'User';

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      await updateProfile(profileForm);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile could not be updated');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSavingPassword(true);

    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password could not be changed');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <main className="appShell">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
        tasks={tasks}
      />

      <section className="profileHero">
        <Link className="backLink" to="/">
          <FiArrowLeft /> Dashboard
        </Link>
        <div className="profileIdentity">
          <span className="profileAvatar">
            {user?.avatar ? <img src={user.avatar} alt="" /> : getInitials(displayName)}
          </span>
          <div>
            <p className="eyebrow">My Profile</p>
            <h2>{displayName}</h2>
            <p>{user?.bio || 'Add a short bio to personalize your workspace.'}</p>
            <span className="profileEmail">
              <FiMail /> {user?.email}
            </span>
          </div>
        </div>
        <p className="profileCreated">Member since {formatDate(user?.createdAt)}</p>
      </section>

      <section className="statsGrid">
        {stats.map(({ key, label, value, icon: Icon }) => (
          <article className="statCard" key={key}>
            <span className={`statIcon statIcon-${key}`}>
              <Icon />
            </span>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="profileGrid">
        <form
          className={`profilePanel ${activeSection === 'edit' ? 'panelAccent' : ''}`}
          onSubmit={handleProfileSubmit}
        >
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Edit Profile</p>
              <h2>Account details</h2>
            </div>
            <span className="panelIcon">
              <FiEdit3 />
            </span>
          </div>

          <label>
            Profile Picture URL
            <span className="inputWithIcon">
              <FiImage />
              <input
                value={profileForm.avatar}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, avatar: event.target.value }))
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </span>
          </label>
          <div className="formGrid">
            <label>
              Full Name
              <input
                value={profileForm.fullName}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, fullName: event.target.value }))
                }
              />
            </label>
            <label>
              Username
              <input
                value={profileForm.username}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, username: event.target.value }))
                }
              />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label>
            Bio
            <textarea
              value={profileForm.bio}
              maxLength={240}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, bio: event.target.value }))
              }
            />
          </label>
          <button className="primaryButton" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <form
          className={`profilePanel ${activeSection === 'password' ? 'panelAccent' : ''}`}
          onSubmit={handlePasswordSubmit}
        >
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Security</p>
              <h2>Change password</h2>
            </div>
            <span className="panelIcon">
              <FiLock />
            </span>
          </div>
          <label>
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
              }
            />
            <span className="fieldHint">
              Use 8+ characters with uppercase, lowercase, number, and symbol.
            </span>
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
            />
          </label>
          <button className="primaryButton" type="submit" disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
