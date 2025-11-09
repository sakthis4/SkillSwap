import React, { useState } from 'react';
import { User, Skill, UserSkill } from '../types';

interface ProfileEditViewProps {
  currentUser: User;
  onSave: (updatedUser: User) => void;
  allSkills: Skill[];
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({ currentUser, onSave, allSkills }) => {
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  // FIX: Store the full UserSkill object to preserve proficiency.
  const [skillsToTeach, setSkillsToTeach] = useState<UserSkill[]>(currentUser.skillsToTeach);
  const [skillsToLearn, setSkillsToLearn] = useState<number[]>(currentUser.skillsToLearn.map(s => s.id));

  const handleSkillToggle = (skillId: number, list: 'teach' | 'learn') => {
    // FIX: Handle 'teach' list separately as it contains UserSkill objects.
    if (list === 'teach') {
      if (skillsToTeach.some(s => s.id === skillId)) {
        setSkillsToTeach(skillsToTeach.filter(s => s.id !== skillId));
      } else {
        const skillToAdd = allSkills.find(s => s.id === skillId);
        if (skillToAdd) {
          const originalUserSkill = currentUser.skillsToTeach.find(s => s.id === skillId);
          const proficiency = originalUserSkill ? originalUserSkill.proficiency : 1;
          setSkillsToTeach([...skillsToTeach, { ...skillToAdd, proficiency }]);
        }
      }
    } else {
      if (skillsToLearn.includes(skillId)) {
        setSkillsToLearn(skillsToLearn.filter(id => id !== skillId));
      } else {
        setSkillsToLearn([...skillsToLearn, skillId]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name,
      bio,
      // FIX: Assign the state directly as it's now the correct type UserSkill[].
      skillsToTeach: skillsToTeach,
      skillsToLearn: allSkills.filter(s => skillsToLearn.includes(s.id)),
    };
    onSave(updatedUser);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="space-y-3 max-h-60 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
              {allSkills.map(skill => (
                <label key={skill.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    // FIX: Check for skill existence in the UserSkill array.
                    checked={skillsToTeach.some(s => s.id === skill.id)}
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
                <label key={skill.id} className="flex items-center space-x-3 cursor-pointer">
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditView;