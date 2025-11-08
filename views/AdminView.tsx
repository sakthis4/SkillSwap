
import React, { useState } from 'react';
import { User, Post } from '../types';
import Avatar from '../components/Avatar';

interface AdminViewProps {
  allUsers: User[];
  posts: Post[];
  onDeleteUser: (userId: number) => void;
  onDeletePost: (postId: number) => void;
  currentUser: User;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase mt-1">{label}</p>
    </div>
);

const AdminView: React.FC<AdminViewProps> = ({ allUsers, posts, onDeleteUser, onDeletePost }) => {
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    const totalUsers = allUsers.length;
    const totalPosts = posts.length;
    const totalConnections = Math.floor(allUsers.reduce((acc, user) => acc + user.matches.length, 0) / 2);

    const regularUsers = allUsers.filter(u => !u.isAdmin);
    const findUserById = (id: number) => allUsers.find(u => u.id === id);

    const handleRowClick = (userId: number) => {
        setExpandedUserId(prevId => (prevId === userId ? null : userId));
    };

    const statusConfig = {
        'not-started': { text: 'Not Started', color: 'text-gray-500 dark:text-gray-400' },
        'in-progress': { text: 'In Progress', color: 'text-yellow-500 dark:text-yellow-400' },
        'completed': { text: 'Completed', color: 'text-green-500 dark:text-green-400' },
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Platform overview and management tools.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Users" value={totalUsers} />
                    <StatCard label="Total Posts" value={totalPosts} />
                    <StatCard label="Total Connections" value={totalConnections} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Level</th>
                                <th scope="col" className="px-6 py-3">Completed</th>
                                <th scope="col" className="px-6 py-3">In Progress</th>
                                <th scope="col" className="px-6 py-3">Scheduled</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {regularUsers.map(user => {
                                const completedSwaps = user.matches.filter(m => m.status === 'completed').length;
                                const inProgressSwaps = user.matches.filter(m => m.status === 'in-progress').length;
                                const scheduledSessions = user.matches.filter(m => m.scheduledSession).length;
                                return (
                                <React.Fragment key={user.id}>
                                    <tr 
                                        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                        onClick={() => handleRowClick(user.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar user={user} size="md" />
                                                <span className="ml-3">{user.name}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-auto text-gray-400 transition-transform ${expandedUserId === user.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.level}</td>
                                        <td className="px-6 py-4">{completedSwaps}</td>
                                        <td className="px-6 py-4">{inProgressSwaps}</td>
                                        <td className="px-6 py-4">{scheduledSessions}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                    {expandedUserId === user.id && (
                                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                                            <td colSpan={6} className="p-4">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-base">Swap Details for {user.name}</h4>
                                                    {user.matches.length > 0 ? (
                                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                            {user.matches.map(match => {
                                                                const partner = findUserById(match.userId);
                                                                if (!partner) return null;
                                                                return (
                                                                    <li key={match.userId} className="py-3 flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <Avatar user={partner} size="sm" />
                                                                            <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">{partner.name}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p><span className={`font-semibold ${statusConfig[match.status].color}`}>{statusConfig[match.status].text}</span></p>
                                                                            {match.scheduledSession && <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled: {new Date(match.scheduledSession).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>}
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500 dark:text-gray-400">No matches to display.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Content Moderation</h2>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Post ID</th>
                                <th scope="col" className="px-6 py-3">Author</th>
                                <th scope="col" className="px-6 py-3">Caption</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => {
                                const author = findUserById(post.authorId);
                                return (
                                <tr key={post.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{post.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{author?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 max-w-sm truncate">{post.caption}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onDeletePost(post.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminView;
