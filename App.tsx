
import React, { useState, useMemo } from 'react';
import { User, Message, Post } from './types';
import { MOCK_USERS, MOCK_MESSAGES, SKILLS, MOCK_POSTS } from './constants';
import Header from './components/Header';
import ExploreView from './views/ExploreView';
import MatchesView from './views/MatchesView';
import MessagesView from './views/MessagesView';
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';
import VideoCallModal from './components/VideoCallModal';
import ProfileEditView from './views/ProfileEditView';
import FeedView from './views/FeedView';
import CreatePostModal from './components/CreatePostModal';

export type View = 'explore' | 'matches' | 'messages' | 'profile' | 'feed';
type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('explore');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [videoCallPartner, setVideoCallPartner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [exploreIndex, setExploreIndex] = useState(0);

  const handleLogin = () => {
    const user = allUsers.find(u => u.id === 1); // Login as user with ID 1
    if(user) {
      setCurrentUser(user);
      const initialChatPartner = allUsers.find(u => u.id === 2);
      if(initialChatPartner) {
          setSelectedChatUser(initialChatPartner);
      }
    }
  };

  const handleSignUp = (newUserData: Omit<User, 'id' | 'avatar' | 'matches' | 'status' | 'level' | 'xp' | 'badges' | 'streak'>) => {
    const newUser: User = {
      ...newUserData,
      id: allUsers.length + 1,
      avatar: `https://picsum.photos/seed/${newUserData.name.split(' ')[0]}/200`,
      matches: [],
      status: 'online',
      level: 1,
      xp: 0,
      badges: ['Newbie'],
      streak: 0,
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('explore');
    setSelectedChatUser(null);
    setAuthView('login');
    setExploreIndex(0);
  };

  const initialMessages = useMemo(() => MOCK_MESSAGES, []);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);

  const handleSendMessage = (text: string) => {
    if (!currentUser || !selectedChatUser) return;
    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedChatUser.id,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      [selectedChatUser.id]: [...(prev[selectedChatUser.id] || []), newMessage],
    }));
  };
  
  const handleAddReaction = (messageId: number, reaction: string) => {
    if (!selectedChatUser) return;
    setMessages(prev => {
      const chatHistory = prev[selectedChatUser.id] || [];
      const updatedHistory = chatHistory.map(msg => 
        msg.id === messageId 
          ? { ...msg, reaction: msg.reaction === reaction ? undefined : reaction } 
          : msg
      );
      return { ...prev, [selectedChatUser.id]: updatedHistory };
    });
  };

  const handleStartVideoCall = (partner: User) => {
    setVideoCallPartner(partner);
  };

  const handleEndVideoCall = () => {
    setVideoCallPartner(null);
  };

  const handleConnect = (targetUserId: number) => {
    if (!currentUser) return;

    const xpGain = 25;
    const levelUpThreshold = 100;

    const updateUserXp = (user: User): Partial<User> => {
        const newXp = user.xp + xpGain;
        if (newXp >= levelUpThreshold) {
            return { level: user.level + 1, xp: newXp - levelUpThreshold, streak: user.streak + 1 };
        }
        return { xp: newXp, streak: user.streak + 1 };
    };

    const updatedCurrentUser = {
      ...currentUser,
      matches: [...currentUser.matches, targetUserId],
      ...updateUserXp(currentUser),
    };
    setCurrentUser(updatedCurrentUser);

    setAllUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === currentUser.id) return updatedCurrentUser;
        if (user.id === targetUserId) {
          return { 
              ...user, 
              matches: [...user.matches, currentUser.id],
              ...updateUserXp(user),
          };
        }
        return user;
      })
    );
  };

  const usersToExplore = useMemo(() => {
    if (!currentUser) return [];
    return allUsers.filter(user => user.id !== currentUser.id && !currentUser.matches.includes(user.id));
  }, [allUsers, currentUser]);

  const handleSwipe = (direction: 'left' | 'right', swipedUserId: number) => {
    if (direction === 'right') {
      handleConnect(swipedUserId);
    }
    setExploreIndex(prev => prev + 1);
  };
  
  const handleGoBack = () => {
    setExploreIndex(prev => Math.max(0, prev - 1));
  };

  const handleCreatePost = (caption: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: Date.now(),
      authorId: currentUser.id,
      thumbnailUrl: `https://picsum.photos/seed/newpost${Date.now()}/600/400`,
      caption,
      likes: 0,
      comments: 0,
    };
    setPosts(prev => [newPost, ...prev]);
    setCreatePostModalOpen(false);
  };

  const handleProfileSave = (updatedProfile: User) => {
    setCurrentUser(updatedProfile);
    setAllUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedProfile.id ? updatedProfile : u))
    );
    setCurrentView('explore');
  };


  if (!currentUser) {
    if (authView === 'signup') {
        return <SignUpView onSignUp={handleSignUp} onShowLogin={() => setAuthView('login')} allSkills={SKILLS} />
    }
    return <LoginView onLogin={handleLogin} onShowSignUp={() => setAuthView('signup')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header 
        currentUser={currentUser} 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'explore' && (
            <ExploreView 
                currentUser={currentUser}
                usersToExplore={usersToExplore}
                currentIndex={exploreIndex}
                onSwipe={handleSwipe}
                onGoBack={handleGoBack}
            />
        )}
        {currentView === 'matches' && <MatchesView currentUser={currentUser} allUsers={allUsers} />}
        {currentView === 'feed' && <FeedView currentUser={currentUser} allUsers={allUsers} posts={posts} onOpenCreatePost={() => setCreatePostModalOpen(true)} />}
        {currentView === 'profile' && <ProfileEditView currentUser={currentUser} onSave={handleProfileSave} allSkills={SKILLS} />}
        {currentView === 'messages' && (
          <MessagesView 
            currentUser={currentUser}
            allUsers={allUsers}
            selectedChatUser={selectedChatUser}
            setSelectedChatUser={setSelectedChatUser}
            messages={messages[selectedChatUser?.id ?? -1] || []}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onStartVideoCall={handleStartVideoCall}
          />
        )}
      </main>
      {videoCallPartner && <VideoCallModal partner={videoCallPartner} onClose={handleEndVideoCall} />}
      {isCreatePostModalOpen && <CreatePostModal onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} />}
    </div>
  );
};

export default App;
