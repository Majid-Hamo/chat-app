import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [role, setRole] = useState('student');

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5291/chathub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', (user, message, role) => {
                        console.log("📩 Mottaget meddelande:", user, message, role);
                        setMessages(messages => [...messages.slice(-19), { user, message, role }]);
                    });

                    connection.on('ReceiveAnnouncement', (user, message) => {
                        console.log("📢 Mottaget tillkännagivande:", user, message);
                        setAnnouncements(prev => [...prev, { user, message }]);
                    });

                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (message && user && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke('SendMessage', user, message, role);
                setMessage('');
            } catch (e) {
                console.error('Sending failed: ', e);
            }
        }
    };

    const sendAnnouncement = async () => {
        if (role === "teacher" && message && user && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke('SendAnnouncement', user, message, role);
                setMessage('');
            } catch (e) {
                console.error('Announcement sending failed: ', e);
            }
        }
    };

    return (
        <div>
            <h2>Chat Room</h2>
            <input placeholder="Name" value={user} onChange={e => setUser(e.target.value)} />
            <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>

            <button onClick={sendMessage}>Send</button>
            {role === "teacher" && (
                <button onClick={sendAnnouncement}>Send Announcement</button>
            )}

            <h3>📨 Chat Messages</h3>
            <ul>
                {messages.map((m, i) => (
                    <li key={i}><b>{m.user} ({m.role})</b>: {m.message}</li>
                ))}
            </ul>

            <h3>📢 Announcements</h3>
            <ul>
                {announcements.map((a, i) => (
                    <li key={i}><b>{a.user}:</b> {a.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;
