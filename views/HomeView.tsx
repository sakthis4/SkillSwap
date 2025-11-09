import React from 'react';
import { MOCK_USERS } from '../constants';

interface HomeViewProps {
  onLogin: () => void;
  onAdminLogin: () => void;
  onShowSignUp: () => void;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error.
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transform transition-transform hover:-translate-y-2 duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto mb-5">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ onLogin, onAdminLogin, onShowSignUp }) => {
    const imageGridAvatars = MOCK_USERS.slice(1, 10).map(u => u.avatar);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="absolute top-0 left-0 w-full p-6 z-10">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SkillSwap AI</h1>
            </header>

            <main className="pt-24">
                <section className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-fade-in-down">
                                Swap a Skill,
                                <br />
                                <span className="text-blue-600 dark:text-blue-400">Share a Passion.</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 animate-fade-in-down [animation-delay:0.2s]">
                                Join a global community where everyone is a teacher and a learner. Connect, grow, and transform your abilities.
                            </p>
                            <div className="flex space-x-4 animate-fade-in-down [animation-delay:0.4s]">
                               <button onClick={onShowSignUp} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                   Join Now
                               </button>
                               <button onClick={onLogin} className="bg-white text-gray-800 dark:bg-gray-700 dark:text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg">
                                   Explore Demo
                               </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-3 gap-4 p-4 animate-fade-in-up">
                           {imageGridAvatars.map((src, index) => (
                               <div key={index} className={`rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 duration-300 ${index % 2 === 0 ? 'mt-8' : ''}`} style={{animationDelay: `${index * 100}ms`}}>
                                   <img src={src} alt={`User ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                               </div>
                           ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold mb-3">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">Discover a new way of learning and teaching through our unique platform features.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                                title="AI-Powered Matching"
                                description="Our smart algorithm connects you with the perfect partner based on your skills and goals."
                            />
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                title="Skill Library"
                                description="Explore a vast library of skills, see who is teaching and learning, and find your next passion."
                            />
                             <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056A11.955 11.955 0 0021 8.618c0-2.31-.84-4.438-2.382-6.034z" /></svg>}
                                title="Verified Profiles"
                                description="Earn badges and verify your skills to build trust and showcase your expertise to the community."
                            />
                             <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-.75-1.663M7 20h10M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25.75-1.663m0 0A10.003 10.003 0 0112 11c1.657 0 3.18.52 4.477 1.342A5.003 5.003 0 0117 14.417M12 11c-1.657 0-3.18-.52-4.477-1.342A5.003 5.003 0 017 9.583M12 11V6m0 5a2 2 0 100-4 2 2 0 000 4z" /></svg>}
                                title="Community Feed"
                                description="Share your progress, discover what others are working on, and get inspired by the community."
                            />
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Create an account to build your profile, or log in as a demo user to see what SkillSwap AI is all about.
                    </p>
                    <div className="max-w-xs mx-auto space-y-4">
                       <button
                           onClick={onShowSignUp}
                           className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg"
                       >
                           Create a New Profile
                       </button>
                       <button
                           onClick={onLogin}
                           className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                       >
                           Log In as Demo User
                       </button>
                       <button
                           onClick={onAdminLogin}
                           className="w-full text-sm text-red-500 hover:underline pt-4"
                       >
                           Log In as Admin
                       </button>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-100 dark:bg-gray-800 py-8">
                <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-lg mb-2">SkillSwap AI</p>
                    <div className="flex justify-center items-center space-x-4">
                        <span>"Map Your Skill. Find Your Match."</span>
                        <span className="text-gray-400 dark:text-gray-600">&bull;</span>
                        <span>"A Living Library of Human Skills."</span>
                    </div>
                </div>
            </footer>
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                 @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default HomeView;