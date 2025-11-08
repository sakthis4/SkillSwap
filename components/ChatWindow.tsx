
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { getConversationStarters } from '../services/geminiService';
import Avatar from './Avatar';

interface ChatWindowProps {
  currentUser: User;
  partner: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onAddReaction: (messageId: number, reaction: string) => void;
  onStartVideoCall: (partner: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, partner, messages, onSendMessage, onAddReaction, onStartVideoCall }) => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reactionEmojis = ['👍', '❤️', '😂', '🎉'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    const userSkill = currentUser.skillsToTeach.find(s => partner.skillsToLearn.some(ps => ps.id === s.id));
    const partnerSkill = partner.skillsToTeach.find(s => currentUser.skillsToLearn.some(cs => cs.id === s.id));
    
    if (userSkill && partnerSkill) {
        const result = await getConversationStarters(userSkill, partnerSkill);
        setSuggestions(result);
    } else {
        setSuggestions(["Could not find a perfect match to generate suggestions."]);
    }
    setIsLoadingSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-r-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
            <Avatar user={partner} size="md" showStatus={true} />
            <div className="ml-4">
                <h2 className="text-xl font-bold">{partner.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{partner.status}</p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <button disabled title="Start Group Call (Coming Soon!)" className="p-2 rounded-full text-gray-400 dark:text-gray-500 cursor-not-allowed" >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.001 3.001 0 015.688 0M12 14a4 4 0 100-8 4 4 0 000 8z" /></svg>
            </button>
            <button onClick={() => onStartVideoCall(partner)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-blue-500 transition-colors" title="Join Live Session (Zoom-integrated)">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end mb-4 group ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== currentUser.id && <Avatar user={partner} size="sm" />}
            <div className="relative mx-2">
                <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
                    {msg.text}
                </div>
                <div className={`absolute -top-8 rounded-full shadow-lg p-1 flex space-x-1 border bg-white dark:bg-gray-700 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${msg.senderId === currentUser.id ? 'right-2' : 'left-2'}`}>
                    {reactionEmojis.map(emoji => (
                        <button key={emoji} onClick={() => onAddReaction(msg.id, emoji)} className="text-lg p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-transform hover:scale-125">
                            {emoji}
                        </button>
                    ))}
                </div>
                {msg.reaction && (
                    <div className={`absolute -bottom-3 rounded-full shadow-md text-sm p-0.5 border bg-white dark:bg-gray-700 dark:border-gray-600 ${msg.senderId === currentUser.id ? 'left-2' : 'right-2'}`}>
                        {msg.reaction}
                    </div>
                )}
            </div>
             {msg.senderId === currentUser.id && <Avatar user={currentUser} size="sm" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">Suggested Replies:</h4>
              <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                      <button key={i} onClick={() => { onSendMessage(s); setSuggestions([]); }} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          "{s}"
                      </button>
                  ))}
              </div>
          </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <button 
              type="button" 
              onClick={fetchSuggestions} 
              disabled={isLoadingSuggestions}
              className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 transition-colors"
              title="Generate Conversation Starters"
            >
             {isLoadingSuggestions ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             )}
            </button>
          <button type="submit" className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
