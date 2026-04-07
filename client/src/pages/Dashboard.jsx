import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/rooms/my-rooms');
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/rooms/create', { name: roomName });
      setRoomName('');
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating room');
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/rooms/join', { roomId: joinRoomId });
      setJoinRoomId('');
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.error || 'Error joining room');
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/rooms/${roomId}`);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting room');
    }
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <h1>Study Dashboard</h1>
        <div className="header-actions">
          <span style={{ marginRight: '8px' }}>Welcome, {user?.username}</span>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
            My Profile
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/friends')}>
            Friends
          </button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Create Room</h2>
          <form onSubmit={createRoom}>
            <input
              className="input"
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <button className="btn btn-primary mobile-full-width" type="submit" style={{ width: '100%', marginTop: '8px' }}>
              Create
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Join Room</h2>
          <form onSubmit={joinRoom}>
            <input
              className="input"
              type="text"
              placeholder="Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              required
            />
            <button className="btn btn-primary mobile-full-width" type="submit" style={{ width: '100%', marginTop: '8px' }}>
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>My Rooms</h2>
        {rooms.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No rooms yet. Create or join one!</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {rooms.map(room => (
              <div key={room._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                background: theme === 'light' ? '#f9fafb' : '#0f0f0f'
              }}>
                <div>
                  <h3>{room.name}</h3>
                  <p style={{ fontSize: '14px', opacity: 0.6 }}>ID: {room.roomId}</p>
                </div>
                <div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigate(`/room/${room.roomId}`)}
                    style={{ marginRight: '8px' }}
                  >
                    Enter
                  </button>
                  {room.createdBy._id === user?.id && (
                    <button 
                      className="btn btn-danger" 
                      onClick={() => deleteRoom(room.roomId)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
