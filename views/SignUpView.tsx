
import React, { useState } from 'react';
import { User, Skill } from '../types';

interface SignUpViewProps {
  onSignUp: (newUserData: Omit<User, 'id' | 'avatar' | 'matches' | 'status' | 'level' | 'xp' | 'badges' | 'streak' | 'verifiedSkills'>) => void;
  onShowLogin: () => void;
  allSkills: Skill[];
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUp, onShowLogin, allSkills }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState<number[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleSkillToggle = (skillId: number, list: 'teach' | 'learn') => {
    const currentList = list === 'teach' ? skillsToTeach : skillsToLearn;
    const setter = list === 'teach' ? setSkillsToTeach : setSkillsToLearn;
    if (currentList.includes(skillId)) {
      setter(currentList.filter(id => id !== skillId));
    } else {
      setter([...currentList, skillId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim() || skillsToTeach.length === 0 || skillsToLearn.length === 0) {
        setError('Please fill out all fields and select at least one skill to teach and one to learn.');
        return;
    }
    const newUserData = {
      name,
      bio,
      skillsToTeach: allSkills.filter(s => skillsToTeach.includes(s.id)),
      skillsToLearn: allSkills.filter(s => skillsToLearn.includes(s.id)),
    };
    onSignUp(newUserData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create Your SkillSwap Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Bio
                </label>
                <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell others a bit about yourself and what you're passionate about."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills to Teach */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Skills You Can Teach</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                    {allSkills.map(skill => (
                        <label key={`teach-${skill.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={skillsToTeach.includes(skill.id)}
                            onChange={() => handleSkillToggle(skill.id, 'teach')}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        </label>
                    ))}
                    </div>
                </div>
                {/* Skills to Learn */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Skills You Want to Learn</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                    {allSkills.map(skill => (
                        <label key={`learn-${skill.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={skillsToLearn.includes(skill.id)}
                            onChange={() => handleSkillToggle(skill.id, 'learn')}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        </label>
                    ))}
                    </div>
                </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Create Profile & Start
                    </button>
                    <button
                        type="button"
                        onClick={onShowLogin}
                        className="w-full sm:w-auto text-blue-600 dark:text-blue-400 font-semibold py-2 px-4 rounded-lg hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </form>
            </div>
        </div>
    </div>
  );
};

export default SignUpView;