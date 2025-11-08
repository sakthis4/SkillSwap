
import React from 'react';
import { User, Post } from '../types';
import Avatar from '../components/Avatar';

interface FeedViewProps {
  currentUser: User;
  allUsers: User[];
  posts: Post[];
  onOpenCreatePost: () => void;
}

const FeedView: React.FC<FeedViewProps> = ({ allUsers, posts, onOpenCreatePost }) => {
  const findUserById = (id: number) => allUsers.find(u => u.id === id);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Feed</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">See what skills others are sharing and working on.</p>
        </div>
        <button 
          onClick={onOpenCreatePost}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <span>Post Skill Clip</span>
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {posts.map(post => {
          const author = findUserById(post.authorId);
          if (!author) return null;

          return (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center">
                <Avatar user={author} size="md" />
                <span className="ml-3 font-semibold text-gray-800 dark:text-gray-200">{author.name}</span>
              </div>

              {/* Post Image/Video Thumbnail */}
              <div className="bg-black">
                <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-auto max-h-[600px] object-contain" />
              </div>

              {/* Post Actions & Caption */}
              <div className="p-4">
                 <div className="flex items-center space-x-4 mb-3">
                     <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                         <span>{post.comments}</span>
                    </button>
                 </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold mr-2">{author.name}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedView;
