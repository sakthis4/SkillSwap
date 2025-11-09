
import React, { useState, useMemo } from 'react';
import { Skill, User } from '../types';

interface LibraryViewProps {
  allSkills: Skill[];
  allUsers: User[];
}

const LibraryView: React.FC<LibraryViewProps> = ({ allSkills, allUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const skillData = useMemo(() => {
    return allSkills.map(skill => {
      const teachers = allUsers.filter(user => user.skillsToTeach.some(s => s.id === skill.id)).length;
      const learners = allUsers.filter(user => user.skillsToLearn.some(s => s.id === skill.id)).length;
      return { ...skill, teachers, learners };
    });
  }, [allSkills, allUsers]);

  const filteredSkills = useMemo(() => {
    return skillData.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skillData, searchTerm]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Skill Library</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">A Living Library of Human Skills.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a skill..."
          className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">Skill</th>
                <th scope="col" className="px-6 py-3 text-center">Teachers</th>
                <th scope="col" className="px-6 py-3 text-center rounded-r-lg">Learners</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map(skill => (
                <tr key={skill.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {skill.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{skill.teachers}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{skill.learners}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No skills found for "{searchTerm}".</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;