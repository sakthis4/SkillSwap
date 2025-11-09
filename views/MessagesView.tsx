

import React from 'react';
import { User, Message, Match, TFunction } from '../types';
import ChatWindow from '../components/ChatWindow';
import Avatar from '../components/Avatar';

interface MessagesViewProps {
  currentUser: User;
  allUsers: User[];
  selectedChatUser: User | null;
  setSelectedChatUser: (user: User) => void;
  messages: Message[];
  onSendMessage: (text: string, isSystemMessage?: boolean) => void;
  onAddReaction: (messageId: number, reaction: string) => void;
  onStartVideoCall: (partner: User) => void;
  onScheduleSession: (partnerId: number, sessionDate: string) => void;
  onSessionProposalResponse: (partnerId: number, response: 'accepted' | 'declined') => void;
  t: TFunction;
}

const MessagesView: React.FC<MessagesViewProps> = ({ 
    currentUser, 
    allUsers, 
    selectedChatUser,
    setSelectedChatUser,
    messages,
    onSendMessage,
    onAddReaction,
    onStartVideoCall,
    onScheduleSession,
    onSessionProposalResponse,
    t
}) => {
  const chatPartners = allUsers.filter(user => currentUser.matches.some(m => m.userId === user.id));
  const matchDetails = currentUser.matches.find(m => m.userId === selectedChatUser?.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('messagesTitle')}</h1>
      <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{t('conversations')}</h2>
          </div>
          <ul>
            {chatPartners.map(partner => (
              <li key={partner.id}>
                <button
                  onClick={() => setSelectedChatUser(partner)}
                  className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedChatUser?.id === partner.id ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}
                >
                    <Avatar user={partner} size="md" showStatus={true}/>
                    <div>
                        <p className="font-semibold">{partner.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('tapToChat')}</p>
                    </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-2/3">
          {selectedChatUser ? (
            <ChatWindow 
                currentUser={currentUser}
                partner={selectedChatUser}
                messages={messages}
                onSendMessage={onSendMessage}
                onAddReaction={onAddReaction}
                onStartVideoCall={onStartVideoCall}
                onScheduleSession={onScheduleSession}
                onSessionProposalResponse={onSessionProposalResponse}
                matchDetails={matchDetails}
                t={t}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{t('selectAConversation')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('selectAConversationCTA')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;