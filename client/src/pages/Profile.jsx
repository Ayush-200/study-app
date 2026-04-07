import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [friends, setFriends] = useState([]);

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = isOwnProfile ? user?.id : userId;

  useEffect(() => {
    fetchStats();
    fetchFriends();
    if (!isOwnProfile) {
      fetchUserInfo();
    }
  }, [targetUserId]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/stats/user/${targetUserId}`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const friendsRes = await axios.get('http://localhost:5001/api/friends/list');
      const friend = friendsRes.data.find(f => f.id === userId);
      if (friend) {
        setProfileUser(friend);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchFriends = async () => {
    if (isOwnProfile) {
      try {
        const res = await axios.get('http://localhost:5001/api/friends/list');
        setFriends(res.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    }
  };

  const getDayLabel = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getChartData = () => {
    if (!stats?.dailyStats) return null;

    const labels = Object.keys(stats.dailyStats).map(date => getDayLabel(date));
    const data = Object.values(stats.dailyStats).map(minutes => (minutes / 60).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: 'Study Hours',
          data,
          backgroundColor: theme === 'light' 
            ? 'rgba(99, 102, 241, 0.8)' 
            : 'rgba(99, 102, 241, 0.9)',
          borderColor: theme === 'light' 
            ? 'rgba(99, 102, 241, 1)' 
            : 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 50,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme === 'light' ? '#fff' : '#000',
        bodyColor: theme === 'light' ? '#fff' : '#000',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} hours`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 12,
        ticks: {
          stepSize: 1,
          color: theme === 'light' ? '#1a1a1a' : '#e0e0e0',
          callback: function(value) {
            return value + 'h';
          }
        },
        grid: {
          color: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: theme === 'light' ? '#1a1a1a' : '#e0e0e0',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <h1>{isOwnProfile ? 'My Profile' : `${profileUser?.username || 'User'}'s Profile`}</h1>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="responsive-grid-profile">
        <div>
          <div className="card">
            <h2 style={{ marginBottom: '24px' }}>Study Statistics (Last 7 Days)</h2>
            
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
              <div className="stat-card">
                <div className="stat-value">{stats?.totalHours || 0}</div>
                <div className="stat-label">Total Hours</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats?.sessions?.length || 0}</div>
                <div className="stat-label">Study Sessions</div>
              </div>
            </div>

            {stats?.dailyStats && getChartData() && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>Daily Study Hours</h3>
                <div style={{ 
                  height: '350px',
                  padding: '20px',
                  borderRadius: '12px',
                  background: theme === 'light' ? '#f9fafb' : '#0f0f0f'
                }}>
                  <Bar data={getChartData()} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Friends</h2>
            {friends.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No friends yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {friends.map(friend => (
                  <div 
                    key={friend.id}
                    onClick={() => navigate(`/profile/${friend.id}`)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: theme === 'light' ? '#f9fafb' : '#0f0f0f',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontWeight: '500' }}>{friend.username}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{friend.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
