
import React from 'react';

interface LoginViewProps {
  onLogin: () => void;
  onAdminLogin: () => void;
  onShowSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onAdminLogin, onShowSignUp }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          Welcome to SkillSwap AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Peer-to-peer skill sharing with AI matching, gamified rewards, and a social community.
        </p>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Get Started</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
                Log in as the demo user to explore features, or create your own profile to begin your journey.
            </p>
            <div className="space-y-4">
                <button
                    onClick={onLogin}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Log In as Demo User
                </button>
                 <button
                    onClick={onShowSignUp}
                    className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                >
                    Create a New Profile
                </button>
                 <button
                    onClick={onAdminLogin}
                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 mt-4"
                >
                    Log In as Admin
                </button>
            </div>
        </div>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
            No personal information is collected. This is a static prototype.
        </p>
      </div>
    </div>
  );
};

export default LoginView;