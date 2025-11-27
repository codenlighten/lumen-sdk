// dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

/**
 * Dashboard component that displays portfolio overview metrics.
 * @param {Object} props - Component props.
 * @param {string} props.userId - The ID of the user whose dashboard is to be displayed.
 * @returns {JSX.Element} The rendered Dashboard component.
 */
const Dashboard = ({ userId }) => {
    const [dashboardMetrics, setDashboardMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches the dashboard metrics from the API.
     * @async
     * @function fetchDashboardMetrics
     */
    const fetchDashboardMetrics = async () => {
        try {
            const response = await axios.get(`/api/dashboard/${userId}`);
            setDashboardMetrics(response.data);
        } catch (err) {
            setError('Failed to fetch dashboard metrics.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchDashboardMetrics();
        } else {
            setError('Invalid user ID.');
            setLoading(false);
        }
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Portfolio Overview</h1>
            <Bar
                data={{
                    labels: dashboardMetrics.labels,
                    datasets: [{
                        label: 'Metrics',
                        data: dashboardMetrics.data,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    }],
                }}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
            {/* Additional components for documents, deadlines, and annotations can be added here */}
        </div>
    );
};

export default Dashboard;

// dashboard.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';
import axios from 'axios';

jest.mock('axios');

describe('Dashboard Component', () => {
    it('renders loading state', () => {
        render(<Dashboard userId="123" />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders error message on fetch failure', async () => {
        axios.get.mockRejectedValue(new Error('Fetch error'));
        render(<Dashboard userId="123" />);
        expect(await screen.findByText(/Failed to fetch dashboard metrics/i)).toBeInTheDocument();
    });

    it('renders dashboard metrics', async () => {
        axios.get.mockResolvedValue({ data: { labels: ['Metric1', 'Metric2'], data: [10, 20] } });
        render(<Dashboard userId="123" />);
        expect(await screen.findByText(/Portfolio Overview/i)).toBeInTheDocument();
    });
});