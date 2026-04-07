import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Room() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [sessionId, setSessionId] = useState(null);
  const [isStudying, setIsStudying] = useState(false);
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [roomStats, setRoomStats] = useState(null);
  const [studyTime, setStudyTime] = useState(0);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.emit('join-room', { roomId, userId: user.id });

    newSocket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('user-joined', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('user-left', ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    newSocket.on('user-status', ({ userId, online }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (online) newSet.add(userId);
        else newSet.delete(userId);
        return newSet;
      });
    });

    fetchRoomMembers();
    fetchRoomStats();

    return () => {
      newSocket.emit('leave-room', { roomId, userId: user.id });
      newSocket.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomId, user.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isStudying) {
      timerRef.current = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStudying]);

  const fetchRoomStats = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/rooms/my-rooms');
      const room = res.data.find(r => r.roomId === roomId);
      if (room) {
        const statsRes = await axios.get(`http://localhost:5001/api/stats/room/${room._id}`);
        setRoomStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching room stats:', error);
    }
  };

  const fetchRoomMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/rooms/my-rooms');
      const room = res.data.find(r => r.roomId === roomId);
      if (room) {
        setRoomData(room);
        const memberStats = await Promise.all(
          room.members.map(async (memberId) => {
            try {
              const userRes = await axios.get('http://localhost:5001/api/friends/list');
              const statsRes = await axios.get(`http://localhost:5001/api/stats/user/${memberId}`);
              return { userId: memberId, ...statsRes.data };
            } catch (err) {
              return { userId: memberId, totalHours: 0, sessions: [] };
            }
          })
        );
        setRoomMembers(memberStats);
      }
    } catch (error) {
      console.error('Error fetching room members:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit('chat-message', { roomId, message, userId: user.id, username: user.username });
    setMessage('');
  };

  const startStudySession = async () => {
    try {
      if (!roomData) {
        alert('Room data not loaded yet');
        return;
      }
      const res = await axios.post('http://localhost:5001/api/stats/start-session', { roomId: roomData._id });
      setSessionId(res.data._id);
      setIsStudying(true);
      setStudyTime(0);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session: ' + (error.response?.data?.error || error.message));
    }
  };

  const endStudySession = async () => {
    try {
      await axios.post(`http://localhost:5001/api/stats/end-session/${sessionId}`);
      setIsStudying(false);
      setSessionId(null);
      setStudyTime(0);
      fetchRoomStats();
      fetchRoomMembers();
    } catch (error) {
      alert('Error ending session');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>{roomData?.name || 'Study Room'}</h1>
          <p style={{ fontSize: '14px', opacity: 0.6 }}>Room ID: {roomId}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="responsive-grid-room">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ 
            background: isStudying 
              ? (theme === 'light' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)')
              : (theme === 'light' ? 'white' : '#1a1a1a'),
            color: isStudying ? 'white' : 'inherit',
            textAlign: 'center',
            padding: '48px 24px'
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>
              {isStudying ? 'Study Session Active' : 'Ready to Study?'}
            </h2>
            
            {isStudying && (
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                marginBottom: '32px',
                fontFamily: 'monospace',
                letterSpacing: '4px'
              }}>
                {formatTime(studyTime)}
              </div>
            )}

            <button 
              className="btn mobile-full-width"
              onClick={isStudying ? endStudySession : startStudySession}
              style={{
                padding: '16px 48px',
                fontSize: '18px',
                fontWeight: '600',
                background: isStudying ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                width: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              {isStudying ? '⏹ End Session' : '▶ Start Studying'}
            </button>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Room Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{roomStats?.totalSessions || 0}</div>
                <div className="stat-label">Total Sessions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{roomStats?.hoursToday || 0}</div>
                <div className="stat-label">Hours Today</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Chat</h2>
            <div className="chat-container">
              {messages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ margin: 0 }}
              />
              <button className="btn btn-primary" type="submit">Send</button>
            </form>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Members ({roomMembers.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roomMembers.map((member, idx) => (
              <div key={idx} style={{ 
                padding: '12px', 
                borderRadius: '8px',
                background: theme === 'light' ? '#f9fafb' : '#0f0f0f'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={`online-indicator ${onlineUsers.has(member.userId) ? 'online' : 'offline'}`} />
                    <strong>Member {idx + 1}</strong>
                  </div>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>
                    {onlineUsers.has(member.userId) ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', opacity: 0.7, marginLeft: '18px' }}>
                  {member.totalHours || 0} hours studied
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
