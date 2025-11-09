
import React, { useState } from 'react';
import { User, Skill, SkillSuggestion, UserSkill } from '../types';
import { getSkillSuggestions } from '../services/geminiService';


interface ProfileViewProps {
  currentUser: User;
  onSave: (updatedUser: User) => void;
  allSkills: Skill[];
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
    </div>
);

const VerifiedIcon: React.FC<{ className?: string }> = ({ className = ''}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`inline-block text-green-600 dark:text-green-400 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 18.333a11.954 11.954 0 007.834-13.334A1.995 1.995 0 0016 1c-2.31 0-4.438.78-6 2.053C8.438 1.78 6.31 1 4 1a1.995 1.995 0 00-1.834 3.999zM10 11.857l-3.218 1.692a.5.5 0 01-.725-.529l.614-3.582-2.6-2.534a.5.5 0 01.277-.852l3.598-.522L9.63 2.91a.5.5 0 01.894 0l1.608 3.268 3.598.522a.5.5 0 01.277.852l-2.6 2.534.614 3.582a.5.5 0 01-.725.529L10 11.857z" clipRule="evenodd" />
    </svg>
);

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

type TempUserSkill = {
    id: number;
    proficiency: 1 | 2 | 3;
};

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onSave, allSkills }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [skillsToTeach, setSkillsToTeach] = useState<TempUserSkill[]>(currentUser.skillsToTeach.map(s => ({id: s.id, proficiency: s.proficiency })));
  const [skillsToLearn, setSkillsToLearn] = useState<number[]>(currentUser.skillsToLearn.map(s => s.id));
  const [verifiedSkills, setVerifiedSkills] = useState<number[]>(currentUser.verifiedSkills);
  
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  
  const proficiencyLevels: { level: 1 | 2 | 3; name: string }[] = [
      { level: 1, name: 'Beginner'},
      { level: 2, name: 'Intermediate'},
      { level: 3, name: 'Expert'},
  ];

  const handleTeachSkillToggle = (skillId: number) => {
    const exists = skillsToTeach.some(s => s.id === skillId);
    if (exists) {
        setSkillsToTeach(skillsToTeach.filter(s => s.id !== skillId));
    } else {
        setSkillsToTeach([...skillsToTeach, { id: skillId, proficiency: 1 }]);
    }
  };

  const handleProficiencyChange = (skillId: number, proficiency: 1 | 2 | 3) => {
    setSkillsToTeach(skillsToTeach.map(s => s.id === skillId ? { ...s, proficiency } : s));
  };
  
  const handleLearnSkillToggle = (skillId: number) => {
    if (skillsToLearn.includes(skillId)) {
        setSkillsToLearn(skillsToLearn.filter(id => id !== skillId));
    } else {
        setSkillsToLearn([...skillsToLearn, skillId]);
    }
  };


  const handleVerifySkill = (skillId: number) => {
    if (window.confirm("This would normally open a file upload dialog to submit proof of your skill (e.g., certificate, portfolio). For this demo, we'll mark this skill as verified. Proceed?")) {
        setVerifiedSkills(prev => [...prev, skillId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name,
      bio,
      skillsToTeach: skillsToTeach.map(ts => {
          const skillInfo = allSkills.find(s => s.id === ts.id);
          return { ...skillInfo!, proficiency: ts.proficiency };
      }),
      skillsToLearn: allSkills.filter(s => skillsToLearn.includes(s.id)),
      verifiedSkills: verifiedSkills,
    };
    onSave(updatedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
      setName(currentUser.name);
      setBio(currentUser.bio);
      setSkillsToTeach(currentUser.skillsToTeach.map(s => ({id: s.id, proficiency: s.proficiency })));
      setSkillsToLearn(currentUser.skillsToLearn.map(s => s.id));
      setVerifiedSkills(currentUser.verifiedSkills);
      setIsEditing(false);
  }
  
  const handleAnalyzeSkills = async () => {
    setIsLoadingSuggestions(true);
    setSuggestionError(null);
    setSuggestions([]);
    try {
      const result = await getSkillSuggestions(currentUser.skillsToTeach, currentUser.skillsToLearn);
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching skill suggestions:", error);
      setSuggestionError("Sorry, we couldn't generate suggestions at this time. Please try again later.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Your Profile' : 'Your Profile'}
        </h1>
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
            </button>
        ) : (
             <button onClick={handleCancel} className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Cancel
            </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills to Teach */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Skills You Can Teach</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                  {allSkills.map(skill => (
                    <div key={`teach-edit-${skill.id}`}>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                            <input
                                type="checkbox"
                                checked={skillsToTeach.some(s => s.id === skill.id)}
                                onChange={() => handleTeachSkillToggle(skill.id)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                            {verifiedSkills.includes(skill.id) && <VerifiedIcon className="h-4 w-4" />}
                            </label>
                            {skillsToTeach.some(s => s.id === skill.id) && !verifiedSkills.includes(skill.id) && (
                                <button 
                                    type="button"
                                    onClick={() => handleVerifySkill(skill.id)}
                                    className="text-xs font-semibold px-2 py-0.5 rounded-md transition-colors bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                                >
                                Verify
                                </button>
                            )}
                        </div>
                        {skillsToTeach.some(s => s.id === skill.id) && (
                            <div className="pl-8 pt-2">
                                <div className="flex items-center space-x-2">
                                    {proficiencyLevels.map(p => (
                                         <label key={p.level} className="text-xs flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`proficiency-${skill.id}`}
                                                checked={skillsToTeach.find(s => s.id === skill.id)?.proficiency === p.level}
                                                onChange={() => handleProficiencyChange(skill.id, p.level)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="ml-1.5 text-gray-600 dark:text-gray-400">{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Skills to Learn */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Skills You Want to Learn</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                  {allSkills.map(skill => (
                    <label key={`learn-edit-${skill.id}`} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skillsToLearn.includes(skill.id)}
                        onChange={() => handleLearnSkillToggle(skill.id)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Save Profile
              </button>
            </div>
        </form>
      ) : (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500" />
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{currentUser.bio}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Progress</h3>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Level {currentUser.level}</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentUser.xp}/100 XP</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${currentUser.xp}%` }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Matches" value={currentUser.matches.length} />
                    <StatCard label="Current Streak" value={`${currentUser.streak} days`} />
                    <StatCard label="Skills Taught" value={currentUser.skillsToTeach.length} />
                    <StatCard label="Skills Learned" value={currentUser.skillsToLearn.length} />
                </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Skill Gap Analyzer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Discover new skills to enhance your profile. Our AI will suggest complementary skills based on what you can teach and what you want to learn.</p>
                <button onClick={handleAnalyzeSkills} disabled={isLoadingSuggestions} className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-wait">
                    {isLoadingSuggestions ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Analyze My Skills'}
                </button>
                <div className="mt-6">
                    {suggestionError && <p className="text-red-500 text-center">{suggestionError}</p>}
                    {suggestions.length > 0 && (
                        <div className="space-y-4">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{suggestion.skill}</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                 <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Badges</h3>
                 <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge, index) => (
                        <span key={index} className="text-sm font-semibold px-3 py-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                        🏅 {badge}
                        </span>
                    ))}
                 </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Skills to Teach</h3>
                    <ul className="space-y-2">
                        {currentUser.skillsToTeach.map(s => (
                            <li key={s.id} className="flex items-center p-2 rounded-md bg-blue-50 dark:bg-blue-900/50">
                                {currentUser.verifiedSkills.includes(s.id) && <VerifiedIcon className="h-5 w-5 mr-2" />}
                                <span className="flex-grow text-gray-800 dark:text-gray-200">{s.name}</span>
                                <span className="flex items-center text-sm" title={`Proficiency: ${s.proficiency}/3`}>
                                    {[1, 2, 3].map(star => <StarIcon key={star} filled={star <= s.proficiency} />)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Skills to Learn</h3>
                    <div className="flex flex-wrap gap-2">
                         {currentUser.skillsToLearn.map(s => <span key={s.id} className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">{s.name}</span>)}
                    </div>
                </div>
            </div>
        </div>
      )}
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfileView;