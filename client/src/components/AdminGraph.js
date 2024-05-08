import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import AdminLogin from './AdminLogin'; // Ensure this is correctly imported

function ContactGraph() {
    const [contacts, setContacts] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        validateToken(); // Validate the admin token before fetching data
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchContacts(); // Fetch the contacts only if the user is an admin
        }
    }, [isAdmin]);

    const validateToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('/api/validateToken', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Adjust the admin validation based on your API response structure
                setIsAdmin(response.data.isAdmin); // Assuming the response has an isAdmin property
            } catch (error) {
                console.error('Error validating token:', error);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get('/contacts');
            console.log('API returned:', response.data); // Log the raw API response
            if (Array.isArray(response.data)) {
                setContacts(response.data); // Assumes the data is an array of contacts
            } else {
                console.error('Received data is not an array:', response.data);
                setContacts([]); // Set to an empty array if not an array
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            setContacts([]);
        }
    };

    const transformDataForRecharts = (contactsData) => {
        if (!Array.isArray(contactsData)) {
            console.error('Invalid contactsData type:', typeof contactsData);
            return [];
        }

        const dataMap = {};

        // Initialize dataMap with empty objects for each month
        for (let i = 0; i < 12; i++) {
            const month = i + 1;
            dataMap[month] = {};
        }

        contactsData.forEach(contact => {
            const dateCreated = new Date(contact.date_created * 1000);
            const month = dateCreated.getMonth() + 1;
            const sourceName = contact.source_name || 'Unknown';

            if (!dataMap[month][sourceName]) {
                dataMap[month][sourceName] = 0;
            }
            dataMap[month][sourceName]++;
        });

        const chartData = [];

        // Transform dataMap into chartData array
        for (const month in dataMap) {
            const monthData = dataMap[month];
            const dataEntry = { month: parseInt(month) };
            for (const sourceName in monthData) {
                dataEntry[sourceName] = monthData[sourceName];
            }
            chartData.push(dataEntry);
        }

        return chartData;
    };

    const chartData = transformDataForRecharts(contacts);

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Get unique source names
    const sourceNames = [...new Set(contacts.map(contact => contact.source_name))];

    if (!isAdmin) {
        return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Simply update the state to reflect the user is logged out
        window.scrollTo(0, 0); // Scroll to the top of the page
      };
    
      if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
      }

    return (
        <div>
            <div style={{ width: '100%', height: 400 }}>
                <h2>Contact Count by Source Name for Each Month in 2024</h2>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={(month) => monthNames[month - 1]} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {sourceNames.map((sourceName, index) => (
                            <Line key={index} type="monotone" dataKey={sourceName} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div style={{ width: '100%', height: 400, marginTop: '100px' }}>
                <h2>Contact Count by Source Name for Each Month in 2024 (Bar Chart)</h2>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={(month) => monthNames[month - 1]} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {sourceNames.map((sourceName, index) => (
                            <Bar key={index} dataKey={sourceName} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ width: '100%', height: 400, marginTop: '100px' }}>
                <h2>Contact Count by Source Name for Each Month in 2024 (Area Chart)</h2>
                <ResponsiveContainer>
                    <AreaChart data={chartData}>
                        <XAxis dataKey="month" tickFormatter={(month) => monthNames[month - 1]} />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {sourceNames.map((sourceName, index) => (
                            <Area key={index} type="monotone" dataKey={sourceName} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <button onClick={handleLogout} className="btn btn-warning">Logout</button>
        </div>
    );
}

export default ContactGraph;
