import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

function Friends() {
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/friends/list');
      setFriends(res.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/friends/requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/friends/send-request', { email });
      setEmail('');
      alert('Friend request sent!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error sending request');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:5001/api/friends/accept/${requestId}`);
      fetchFriends();
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.error || 'Error accepting request');
    }
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <h1>Friends</h1>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="responsive-grid-2">
        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Add Friend</h2>
          <form onSubmit={sendRequest}>
            <input
              className="input"
              type="email"
              placeholder="Friend's Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '8px' }}>
              Send Request
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Friend Requests</h2>
          {requests.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No pending requests</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(req => (
                <div key={req._id} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: theme === 'light' ? '#f9fafb' : '#0f0f0f',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{req.userId.username}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{req.userId.email}</div>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => acceptRequest(req._id)}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>My Friends</h2>
        {friends.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No friends yet. Add some!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {friends.map(friend => (
              <div 
                key={friend.id}
                onClick={() => navigate(`/profile/${friend.id}`)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: theme === 'light' ? '#f9fafb' : '#0f0f0f',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontWeight: '500', fontSize: '16px' }}>{friend.username}</div>
                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>{friend.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;
