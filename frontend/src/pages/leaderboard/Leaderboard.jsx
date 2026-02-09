import React, { useState, useEffect, useContext } from 'react';
import { VariableContext } from '../../context/VariableContext';
import './Leaderboard.css';

// Trophy icons for top 3
const TrophyIcon = ({ rank }) => {
    const colors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
    const emojis = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return (
        <div className="trophy-icon" style={{ color: colors[rank] }}>
            <span className="trophy-emoji">{emojis[rank]}</span>
        </div>
    );
};

// Countdown timer component
const CountdownTimer = ({ resetTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(resetTimestamp).getTime();
            const diff = target - now;

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [resetTimestamp]);

    return (
        <div className="countdown-timer">
            <span className="countdown-icon">⏱️</span>
            <span>Challenge Reset in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
        </div>
    );
};

const Leaderboard = () => {
    const { host } = useContext(VariableContext);
    const [activeTab, setActiveTab] = useState('current');
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current leaderboard
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${host}/leaderboard`);
                if (!response.ok) throw new Error('Failed to fetch leaderboard');
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [host]);

    // Fetch history when tab changes
    useEffect(() => {
        if (activeTab === 'history' && historyData.length === 0) {
            const fetchHistory = async () => {
                try {
                    const response = await fetch(`${host}/leaderboard/history`);
                    if (!response.ok) throw new Error('Failed to fetch history');
                    const data = await response.json();
                    setHistoryData(data.history || []);
                } catch (err) {
                    console.error('History fetch error:', err);
                }
            };
            fetchHistory();
        }
    }, [activeTab, host, historyData.length]);

    if (loading) {
        return (
            <div className="leaderboard-container">
                <div className="loading-spinner">Loading leaderboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    const leaders = leaderboardData?.leaders || [];
    const top3 = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <div className="leaderboard-container">
            {/* Header */}
            <div className="leaderboard-header">
                <a href="/" className="back-button">←</a>
                <h1>Leaderboard</h1>
            </div>

            {/* Hero Section - Top 3 Podium */}
            <div className="podium-section">
                <div className="podium-container">
                    {/* 2nd Place */}
                    {top3[1] && (
                        <div className="podium-card second">
                            <TrophyIcon rank={2} />
                            <div className="podium-amount">₹{top3[1].totalSpend?.toLocaleString()}</div>
                            <div className="podium-name">{top3[1].userName}</div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {top3[0] && (
                        <div className="podium-card first">
                            <TrophyIcon rank={1} />
                            <div className="podium-amount">₹{top3[0].totalSpend?.toLocaleString()}</div>
                            <div className="podium-name">{top3[0].userName}</div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <div className="podium-card third">
                            <TrophyIcon rank={3} />
                            <div className="podium-amount">₹{top3[2].totalSpend?.toLocaleString()}</div>
                            <div className="podium-name">{top3[2].userName}</div>
                        </div>
                    )}
                </div>

                {/* Countdown Timer */}
                {leaderboardData?.resetIn?.timestamp && (
                    <CountdownTimer resetTimestamp={leaderboardData.resetIn.timestamp} />
                )}

                {/* Rewards Info */}
                {leaderboardData?.rewards && (
                    <div className="rewards-info">
                        <span>🏆 Rewards: 1st: {leaderboardData.rewards.first} pts | 2nd: {leaderboardData.rewards.second} pts | 3rd: {leaderboardData.rewards.third} pts</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                    onClick={() => setActiveTab('current')}
                >
                    ● Active Challenge ⚡
                </button>
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Past Reward 🏆
                </button>
            </div>

            {/* Current Leaderboard List */}
            {activeTab === 'current' && (
                <div className="leaderboard-list">
                    {rest.map((leader) => (
                        <div key={leader.rank} className="leader-row">
                            <div className="rank-badge">{leader.rank}</div>
                            <div className="leader-name">{leader.userName}</div>
                            <div className="leader-amount">₹ {leader.totalSpend?.toLocaleString()}</div>
                            <div className="arrow">›</div>
                        </div>
                    ))}
                    {rest.length === 0 && (
                        <div className="empty-list">No other participants yet</div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="history-section">
                    {historyData.length === 0 ? (
                        <div className="empty-list">No past rewards yet</div>
                    ) : (
                        historyData.map((month, idx) => (
                            <div key={idx} className="history-month">
                                <h3 className="history-month-title">{month.month}</h3>
                                {month.winners.map((winner) => (
                                    <div key={winner.rank} className="leader-row">
                                        <div className="rank-badge">{winner.rank}</div>
                                        <div className="leader-name">{winner.userName}</div>
                                        <div className="leader-amount">₹ {winner.totalSpend?.toLocaleString()}</div>
                                        <div className="reward-badge">+{winner.rewardPoints} pts</div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
