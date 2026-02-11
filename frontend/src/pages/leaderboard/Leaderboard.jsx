import React, { useState, useEffect, useContext } from 'react';
import { VariableContext } from '../../context/VariableContext';
import {
    ArrowLeft,
    Crown,
    Medal,
    Trophy,
    Zap,
    History,
    Clock,
    ChevronRight,
    Award,
    Loader2,
    AlertTriangle,
    Users,
} from 'lucide-react';

// Countdown timer with individual digit boxes
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

    const TimeBlock = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="
                bg-gray-100 dark:bg-dark-bg-card
                border border-gray-200 dark:border-dark-border
                rounded-lg w-14 h-14 sm:w-16 sm:h-16
                flex items-center justify-center
                shadow-sm dark:shadow-lg
            ">
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-dark-accent-primary font-mono tabular-nums">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 dark:text-dark-text-muted mt-1.5 uppercase tracking-wider font-medium">
                {label}
            </span>
        </div>
    );

    return (
        <div className="my-6">
            <div className="flex items-center justify-center gap-1.5 mb-3">
                <Clock className="w-4 h-4 text-gray-500 dark:text-dark-text-muted" />
                <span className="text-xs font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">
                    Challenge resets in
                </span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
                <TimeBlock value={timeLeft.days} label="Days" />
                <span className="text-emerald-600 dark:text-dark-accent-primary text-xl font-bold mb-5">:</span>
                <TimeBlock value={timeLeft.hours} label="Hrs" />
                <span className="text-emerald-600 dark:text-dark-accent-primary text-xl font-bold mb-5">:</span>
                <TimeBlock value={timeLeft.minutes} label="Min" />
                <span className="text-emerald-600 dark:text-dark-accent-primary text-xl font-bold mb-5">:</span>
                <TimeBlock value={timeLeft.seconds} label="Sec" />
            </div>
        </div>
    );
};

// Podium card for top 3
const PodiumCard = ({ leader, rank }) => {
    const config = {
        1: {
            Icon: Crown,
            gradient: 'from-amber-50 to-yellow-50 dark:from-yellow-500/20 dark:to-amber-600/10',
            border: 'border-yellow-400 dark:border-yellow-500/60',
            ring: 'ring-yellow-300/40 dark:ring-yellow-500/30',
            iconColor: 'text-yellow-500',
            amountColor: 'text-yellow-600 dark:text-yellow-400',
            height: 'h-48 sm:h-56',
            iconSize: 'w-8 h-8 sm:w-10 sm:h-10',
            order: 'order-2',
            glow: 'shadow-md dark:shadow-[0_0_30px_rgba(234,179,8,0.15)]',
            label: '1st',
        },
        2: {
            Icon: Medal,
            gradient: 'from-gray-50 to-slate-50 dark:from-gray-400/20 dark:to-slate-500/10',
            border: 'border-gray-300 dark:border-gray-400/50',
            ring: 'ring-gray-200/50 dark:ring-gray-400/20',
            iconColor: 'text-gray-400',
            amountColor: 'text-gray-600 dark:text-gray-300',
            height: 'h-40 sm:h-48',
            iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
            order: 'order-1',
            glow: 'shadow-md dark:shadow-[0_0_20px_rgba(156,163,175,0.1)]',
            label: '2nd',
        },
        3: {
            Icon: Award,
            gradient: 'from-orange-50 to-amber-50 dark:from-orange-600/20 dark:to-amber-700/10',
            border: 'border-orange-300 dark:border-orange-500/50',
            ring: 'ring-orange-200/50 dark:ring-orange-500/20',
            iconColor: 'text-orange-500',
            amountColor: 'text-orange-600 dark:text-orange-400',
            height: 'h-36 sm:h-44',
            iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
            order: 'order-3',
            glow: 'shadow-md dark:shadow-[0_0_20px_rgba(249,115,22,0.1)]',
            label: '3rd',
        },
    };

    const c = config[rank];
    if (!leader) return null;
    const { Icon } = c;

    return (
        <div className={`${c.order} ${c.height} flex-1 max-w-[140px] sm:max-w-[160px]`}>
            <div
                className={`
                    h-full rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center
                    bg-gradient-to-b ${c.gradient}
                    border ${c.border} ${c.ring} ring-1
                    backdrop-blur-sm
                    ${c.glow}
                    transition-all duration-300 ease-out
                    hover:scale-[1.04] hover:-translate-y-1
                    cursor-default
                `}
            >
                <Icon className={`${c.iconSize} ${c.iconColor} mb-2 drop-shadow`} strokeWidth={2} />
                <span className={`text-lg sm:text-xl font-extrabold ${c.amountColor} tracking-tight`}>
                    ₹{leader.totalSpend?.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary font-medium mt-1 text-center truncate w-full">
                    {leader.userName}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-dark-text-muted mt-0.5 font-medium">
                    #{rank}
                </span>
            </div>
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
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-500 dark:text-dark-accent-primary animate-spin" />
                    <span className="text-gray-400 dark:text-dark-text-muted text-sm">Loading leaderboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
                <div className="text-red-500 dark:text-red-400 text-center px-6">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-80" />
                    <p className="font-medium">Error: {error}</p>
                </div>
            </div>
        );
    }

    const leaders = leaderboardData?.leaders || [];
    const top3 = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary pb-8 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center px-4 py-4 sm:py-5">
                <a
                    href="/"
                    className="
                        w-10 h-10 rounded-full
                        bg-white dark:bg-dark-bg-card
                        border border-gray-200 dark:border-dark-border
                        flex items-center justify-center
                        text-gray-600 dark:text-dark-accent-primary
                        hover:bg-gray-100 dark:hover:bg-dark-bg-hover
                        transition-colors duration-200 no-underline
                        shadow-sm dark:shadow-none
                    "
                >
                    <ArrowLeft className="w-5 h-5" />
                </a>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-dark-accent-primary" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text-primary tracking-tight">
                        Leaderboard
                    </h1>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Podium Section */}
            <div className="px-4 sm:px-6 max-w-xl mx-auto">
                <div className="flex items-end justify-center gap-2 sm:gap-3 mb-2">
                    <PodiumCard leader={top3[1]} rank={2} />
                    <PodiumCard leader={top3[0]} rank={1} />
                    <PodiumCard leader={top3[2]} rank={3} />
                </div>

                {/* Countdown Timer */}
                {leaderboardData?.resetIn?.timestamp && (
                    <CountdownTimer resetTimestamp={leaderboardData.resetIn.timestamp} />
                )}

                {/* Rewards Info */}
                {leaderboardData?.rewards && (
                    <div className="
                        flex items-center justify-center gap-4 sm:gap-6 mb-6
                        bg-white dark:bg-dark-bg-card
                        border border-gray-200 dark:border-dark-border
                        rounded-xl py-3 px-4
                        shadow-sm dark:shadow-none
                    ">
                        <Trophy className="w-4 h-4 text-emerald-500 dark:text-dark-accent-primary shrink-0 hidden sm:block" />
                        {[
                            { label: '1st', pts: leaderboardData.rewards.first, color: 'text-yellow-500 dark:text-yellow-400' },
                            { label: '2nd', pts: leaderboardData.rewards.second, color: 'text-gray-500 dark:text-gray-400' },
                            { label: '3rd', pts: leaderboardData.rewards.third, color: 'text-orange-500 dark:text-orange-400' },
                        ].map(({ label, pts, color }, i, arr) => (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center">
                                    <span className={`text-sm sm:text-base font-bold ${color}`}>{pts}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-dark-text-muted uppercase tracking-wider">
                                        {label} pts
                                    </span>
                                </div>
                                {i < arr.length - 1 && (
                                    <div className="w-px h-6 bg-gray-200 dark:bg-dark-border" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs + List */}
            <div className="mx-4 sm:mx-6 max-w-xl sm:mx-auto">
                {/* Tabs */}
                <div className="
                    flex
                    bg-white dark:bg-dark-bg-card
                    rounded-t-xl border border-b-0
                    border-gray-200 dark:border-dark-border
                    overflow-hidden
                    shadow-sm dark:shadow-none
                ">
                    <button
                        className={`
                            flex-1 py-3 sm:py-3.5 text-sm font-semibold
                            transition-all duration-200
                            flex items-center justify-center gap-1.5
                            ${activeTab === 'current'
                                ? 'bg-emerald-50 dark:bg-dark-accent-primary/10 text-emerald-600 dark:text-dark-accent-primary border-b-2 border-emerald-500 dark:border-dark-accent-primary'
                                : 'text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg-hover/50'
                            }
                        `}
                        onClick={() => setActiveTab('current')}
                    >
                        <Zap className="w-4 h-4" />
                        Active Challenge
                    </button>
                    <button
                        className={`
                            flex-1 py-3 sm:py-3.5 text-sm font-semibold
                            transition-all duration-200
                            flex items-center justify-center gap-1.5
                            ${activeTab === 'history'
                                ? 'bg-emerald-50 dark:bg-dark-accent-primary/10 text-emerald-600 dark:text-dark-accent-primary border-b-2 border-emerald-500 dark:border-dark-accent-primary'
                                : 'text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg-hover/50'
                            }
                        `}
                        onClick={() => setActiveTab('history')}
                    >
                        <History className="w-4 h-4" />
                        Past Rewards
                    </button>
                </div>

                {/* Current Leaderboard List */}
                {activeTab === 'current' && (
                    <div className="
                        bg-white dark:bg-dark-bg-secondary
                        border border-t-0
                        border-gray-200 dark:border-dark-border
                        rounded-b-xl
                        max-h-[400px] overflow-y-auto
                        shadow-sm dark:shadow-none
                    ">
                        {rest.length === 0 ? (
                            <div className="py-12 text-center">
                                <Users className="w-8 h-8 text-gray-300 dark:text-dark-text-muted mx-auto mb-2" />
                                <span className="text-gray-400 dark:text-dark-text-muted text-sm">No other participants yet</span>
                            </div>
                        ) : (
                            rest.map((leader) => (
                                <div
                                    key={leader.rank}
                                    className="
                                        flex items-center px-4 sm:px-5 py-3 sm:py-3.5
                                        border-b border-gray-100 dark:border-dark-border/50 last:border-b-0
                                        hover:bg-gray-50 dark:hover:bg-dark-bg-hover/40
                                        transition-colors duration-150
                                    "
                                >
                                    <div className="
                                        w-9 h-9 rounded-full
                                        bg-gray-100 dark:bg-dark-bg-card
                                        border border-gray-200 dark:border-dark-border
                                        flex items-center justify-center
                                        text-sm font-bold text-gray-500 dark:text-dark-text-secondary
                                        shrink-0
                                    ">
                                        {leader.rank}
                                    </div>
                                    <span className="ml-3 flex-1 text-sm font-medium text-gray-800 dark:text-dark-text-primary truncate">
                                        {leader.userName}
                                    </span>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-dark-accent-primary ml-2">
                                        ₹{leader.totalSpend?.toLocaleString()}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-dark-text-muted ml-1.5 shrink-0" />
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="
                        bg-white dark:bg-dark-bg-secondary
                        border border-t-0
                        border-gray-200 dark:border-dark-border
                        rounded-b-xl
                        max-h-[400px] overflow-y-auto
                        shadow-sm dark:shadow-none
                    ">
                        {historyData.length === 0 ? (
                            <div className="py-12 text-center">
                                <History className="w-8 h-8 text-gray-300 dark:text-dark-text-muted mx-auto mb-2" />
                                <span className="text-gray-400 dark:text-dark-text-muted text-sm">No past rewards yet</span>
                            </div>
                        ) : (
                            historyData.map((month, idx) => (
                                <div key={idx} className="border-b-2 border-gray-100 dark:border-dark-border/60 last:border-b-0">
                                    <div className="px-4 sm:px-5 py-2.5 bg-gray-50 dark:bg-dark-bg-card/50">
                                        <h3 className="text-sm font-bold text-emerald-600 dark:text-dark-accent-primary tracking-wide">
                                            {month.month}
                                        </h3>
                                    </div>
                                    {month.winners.map((winner) => (
                                        <div
                                            key={winner.rank}
                                            className="
                                                flex items-center px-4 sm:px-5 py-3
                                                border-b border-gray-50 dark:border-dark-border/30 last:border-b-0
                                                hover:bg-gray-50 dark:hover:bg-dark-bg-hover/40
                                                transition-colors duration-150
                                            "
                                        >
                                            <div className="
                                                w-9 h-9 rounded-full
                                                bg-gray-100 dark:bg-dark-bg-card
                                                border border-gray-200 dark:border-dark-border
                                                flex items-center justify-center
                                                text-sm font-bold text-gray-500 dark:text-dark-text-secondary
                                                shrink-0
                                            ">
                                                {winner.rank}
                                            </div>
                                            <span className="ml-3 flex-1 text-sm font-medium text-gray-800 dark:text-dark-text-primary truncate">
                                                {winner.userName}
                                            </span>
                                            <span className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary mr-3">
                                                ₹{winner.totalSpend?.toLocaleString()}
                                            </span>
                                            <span className="
                                                text-xs font-semibold
                                                text-emerald-600 dark:text-dark-accent-primary
                                                bg-emerald-50 dark:bg-dark-accent-primary/10
                                                border border-emerald-200 dark:border-dark-accent-primary/20
                                                px-2.5 py-1 rounded-full
                                            ">
                                                +{winner.rewardPoints} pts
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
