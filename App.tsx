

import React, { useState, useMemo } from 'react';
import { User, Message, Post, Match, ManualCalendarEvent, SessionProposal, TFunction } from './types';
import { MOCK_USERS, MOCK_MESSAGES, SKILLS, MOCK_POSTS } from './constants';
import Header from './components/Header';
import ExploreView from './views/ExploreView';
import MatchesView from './views/MatchesView';
import MessagesView from './views/MessagesView';
import HomeView from './views/HomeView';
import SignUpView from './views/SignUpView';
import VideoCallModal from './components/VideoCallModal';
import ProfileView from './views/ProfileView';
import FeedView from './views/FeedView';
import CreatePostModal from './components/CreatePostModal';
import AdminView from './views/AdminView';
import LibraryView from './views/LibraryView';
import CalendarView from './views/CalendarView';
import MarketplaceView from './views/MarketplaceView';
import { Language, translations } from './utils/translations';


export type View = 'explore' | 'matches' | 'messages' | 'profile' | 'feed' | 'admin' | 'library' | 'calendar' | 'marketplace';
type AuthView = 'home' | 'signup';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('matches');
  const [authView, setAuthView] = useState<AuthView>('home');
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [videoCallPartner, setVideoCallPartner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [exploreIndex, setExploreIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [manualCalendarEvents, setManualCalendarEvents] = useState<ManualCalendarEvent[]>([]);


  const t: TFunction = (key, replacements) => {
    let translation = translations[language][key] || translations.en[key];
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const regex = new RegExp(`{${rKey}}`, 'g');
            translation = translation.replace(regex, String(replacements[rKey]));
        });
    }
    return translation;
  };
  
  const updateBadges = (user: User): string[] => {
    const newBadges = new Set(user.badges);

    // Connection Badges
    if (user.matches.length >= 1) newBadges.add('First Match');
    if (user.matches.length >= 5) newBadges.add('Social Butterfly');
    if (user.matches.length >= 10) newBadges.add('Super Connector');

    // Teaching Badges
    if (user.skillsToTeach.length >= 1) newBadges.add('First Lesson');
    if (user.skillsToTeach.length >= 3) newBadges.add('Mentor');
    if (user.skillsToTeach.length >= 5) newBadges.add('Guru');
    
    // Learning Badges
    if (user.skillsToLearn.length >= 1) newBadges.add('Curious Learner');
    if (user.skillsToLearn.length >= 3) newBadges.add('Skill Seeker');
    if (user.skillsToLearn.length >= 5) newBadges.add('Polymath');

    // Streak Badges
    if (user.streak >= 3) newBadges.add('Consistent');
    if (user.streak >= 7) newBadges.add('Dedicated');
    if (user.streak >= 14) newBadges.add('Unstoppable');

    return Array.from(newBadges);
  };

  const handleLogin = () => {
    const user = allUsers.find(u => u.id === 1); // Login as user with ID 1
    if(user) {
      setCurrentUser(user);
      setCurrentView('matches');
      const initialChatPartner = allUsers.find(u => u.id === 2);
      if(initialChatPartner) {
          setSelectedChatUser(initialChatPartner);
      }
    }
  };
  
  const handleAdminLogin = () => {
    const adminUser = allUsers.find(u => u.isAdmin);
    if (adminUser) {
      setCurrentUser(adminUser);
      setCurrentView('admin');
    }
  };

  const handleSignUp = (newUserData: Omit<User, 'id' | 'avatar' | 'matches' | 'status' | 'level' | 'xp' | 'badges' | 'streak' | 'verifiedSkills'>) => {
    let newUser: User = {
      ...newUserData,
      id: allUsers.length + 1,
      avatar: `https://ui-avatars.com/api/?name=${newUserData.name.split(' ').join('+')}&background=random&color=fff&size=200`,
      matches: [],
      status: 'online',
      level: 1,
      xp: 0,
      badges: ['Newbie'],
      streak: 0,
      verifiedSkills: [],
      teacherRating: 0,
      totalRatings: 0,
    };
    newUser.badges = updateBadges(newUser);
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('matches');
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('matches');
    setSelectedChatUser(null);
    setAuthView('home');
    setExploreIndex(0);
  };

  const initialMessages = useMemo(() => MOCK_MESSAGES, []);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);

  const handleSendMessage = (text: string, isSystemMessage = false) => {
    if (!currentUser || !selectedChatUser) return;
    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedChatUser.id,
      text,
      timestamp: new Date().toISOString(),
      isSystemMessage,
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

    const getUpdatedUser = (user: User, connectedToId: number): User => {
        const totalXp = user.xp + xpGain;
        const newMatch: Match = { userId: connectedToId, status: 'not-started' };
        const updatedUser = {
            ...user,
            matches: [...user.matches, newMatch],
            level: user.level + Math.floor(totalXp / levelUpThreshold),
            xp: totalXp % levelUpThreshold,
            streak: user.streak + 1,
        };
        updatedUser.badges = updateBadges(updatedUser);
        return updatedUser;
    };

    const updatedCurrentUser = getUpdatedUser(currentUser, targetUserId);
    setCurrentUser(updatedCurrentUser);

    setAllUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === currentUser.id) return updatedCurrentUser;
        if (user.id === targetUserId) {
          return getUpdatedUser(user, currentUser.id);
        }
        return user;
      })
    );
  };

  const usersToExplore = useMemo(() => {
    if (!currentUser) return [];
    const matchedUserIds = currentUser.matches.map(m => m.userId);
    return allUsers
      .filter(user => user.id !== currentUser.id && !matchedUserIds.includes(user.id) && !user.isAdmin)
      .sort((a, b) => (b.teacherRating || 0) - (a.teacherRating || 0));
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
      thumbnailUrl: `https://placehold.co/600x400/EEE/31343C?text=New+Post`,
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
  };

  const handleUpdateMatchStatus = (partnerId: number, status: Match['status']) => {
    const xpGainOnComplete = 50;
    const levelUpThreshold = 100;

    const updateUser = (user: User): User => {
      let finalUser = {
        ...user,
        matches: user.matches.map(m => m.userId === partnerId ? { ...m, status } : m)
      };

      if (status === 'completed') {
        const totalXp = finalUser.xp + xpGainOnComplete;
        finalUser = {
            ...finalUser,
            level: finalUser.level + Math.floor(totalXp / levelUpThreshold),
            xp: totalXp % levelUpThreshold,
        };
        finalUser.badges = updateBadges(finalUser);
      }
      return finalUser;
    };
    
    if (currentUser) {
        const updatedCurrentUser = updateUser(currentUser);
        setCurrentUser(updatedCurrentUser);

        setAllUsers(prevUsers => prevUsers.map(u => {
            if (u.id === currentUser.id) return updatedCurrentUser;
            if (u.id === partnerId) return updateUser(u);
            return u;
        }));
    }
  };
  
    const handleRateSession = (partnerId: number, rating: number) => {
        if (!currentUser) return;

        // Update the partner's rating
        setAllUsers(prevUsers => prevUsers.map(user => {
            if (user.id === partnerId) {
                const oldTotalRatings = user.totalRatings || 0;
                const oldRatingTotal = (user.teacherRating || 0) * oldTotalRatings;
                const newTotalRatings = oldTotalRatings + 1;
                const newTeacherRating = (oldRatingTotal + rating) / newTotalRatings;
                return {
                    ...user,
                    teacherRating: newTeacherRating,
                    totalRatings: newTotalRatings,
                };
            }
            return user;
        }));

        // Update the current user's match to show they have rated
        const updatedCurrentUser = {
            ...currentUser,
            matches: currentUser.matches.map(match =>
                match.userId === partnerId ? { ...match, rating } : match
            ),
        };
        setCurrentUser(updatedCurrentUser);
    };

  const handleScheduleSession = (partnerId: number, sessionDate: string) => {
      if (!currentUser) return;
      const proposal: SessionProposal = {
          proposerId: currentUser.id,
          date: sessionDate,
          status: 'pending',
      };
      
      const updateUser = (user: User, partnerIdToUpdate: number): User => ({
          ...user,
          matches: user.matches.map(m => m.userId === partnerIdToUpdate ? { ...m, sessionProposal: proposal, scheduledSession: undefined } : m)
      });
      
      const updatedCurrentUser = updateUser(currentUser, partnerId);
      setCurrentUser(updatedCurrentUser);
      setAllUsers(prev => prev.map(u => {
          if (u.id === currentUser.id) return updatedCurrentUser;
          if (u.id === partnerId) return updateUser(u, currentUser.id);
          return u;
      }));
      
      if (selectedChatUser?.id === partnerId) {
          const formattedDate = new Date(sessionDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
          const systemMessage = t('systemSessionProposed', { name: currentUser.name, date: formattedDate });
          handleSendMessage(systemMessage, true);
      }
  };

  const handleSessionProposalResponse = (partnerId: number, response: 'accepted' | 'declined') => {
      if (!currentUser) return;

      const currentMatch = currentUser.matches.find(m => m.userId === partnerId);
      if (!currentMatch || !currentMatch.sessionProposal) return;
      
      const proposalDate = currentMatch.sessionProposal.date;
      const formattedDate = new Date(proposalDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      if (response === 'accepted') {
          const updateUser = (user: User, partnerIdToUpdate: number): User => ({
              ...user,
              matches: user.matches.map(m => m.userId === partnerIdToUpdate ? { ...m, scheduledSession: proposalDate, sessionProposal: undefined } : m)
          });
          const updatedCurrentUser = updateUser(currentUser, partnerId);
          setCurrentUser(updatedCurrentUser);
          setAllUsers(prev => prev.map(u => {
              if (u.id === currentUser.id) return updatedCurrentUser;
              if (u.id === partnerId) return updateUser(u, currentUser.id);
              return u;
          }));
          if (selectedChatUser?.id === partnerId || (allUsers.find(u => u.id === partnerId) && selectedChatUser?.id === partnerId)) {
            handleSendMessage(t('systemSessionConfirmed', { date: formattedDate }), true);
          }
      } else { // declined
          const updateUser = (user: User, partnerIdToUpdate: number): User => ({
              ...user,
              matches: user.matches.map(m => m.userId === partnerIdToUpdate ? { ...m, sessionProposal: undefined } : m)
          });
          const updatedCurrentUser = updateUser(currentUser, partnerId);
          setCurrentUser(updatedCurrentUser);
          setAllUsers(prev => prev.map(u => {
              if (u.id === currentUser.id) return updatedCurrentUser;
              if (u.id === partnerId) return updateUser(u, currentUser.id);
              return u;
          }));
           if (selectedChatUser?.id === partnerId) {
            handleSendMessage(t('systemSessionDeclined', { date: formattedDate }), true);
          }
      }
  };

  const handleDeleteUser = (userIdToDelete: number) => {
    if (!window.confirm(t('deleteUserConfirm'))) {
      return;
    }

    setPosts(prev => prev.filter(p => p.authorId !== userIdToDelete));

    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[userIdToDelete];
      for (const partnerId in newMessages) {
        newMessages[partnerId] = newMessages[partnerId].filter(
          msg => msg.senderId !== userIdToDelete && msg.receiverId !== userIdToDelete
        );
      }
      return newMessages;
    });

    setAllUsers(prevUsers =>
      prevUsers
        .filter(user => user.id !== userIdToDelete)
        .map(user => ({
          ...user,
          matches: user.matches.filter(match => match.userId !== userIdToDelete)
        }))
    );
    
    if (currentUser && currentUser.id !== userIdToDelete) {
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          matches: prevUser.matches.filter(match => match.userId !== userIdToDelete),
        }
      });
    }

    if (selectedChatUser && selectedChatUser.id === userIdToDelete) {
        setSelectedChatUser(null);
    }
  };

  const handleDeletePost = (postIdToDelete: number) => {
      if (!window.confirm(t('deletePostConfirm'))) {
          return;
      }
      setPosts(prev => prev.filter(p => p.id !== postIdToDelete));
  };
  
  const handleNavigateToChat = (partner: User) => {
    setSelectedChatUser(partner);
    setCurrentView('messages');
  };
  
  const handleManualAddEvent = (title: string, date: string) => {
      const newEvent: ManualCalendarEvent = {
          id: Date.now(),
          title,
          date,
      };
      setManualCalendarEvents(prev => [...prev, newEvent]);
  };


  if (!currentUser) {
    if (authView === 'signup') {
        return <SignUpView onSignUp={handleSignUp} onShowLogin={() => setAuthView('home')} allSkills={SKILLS} t={t} />
    }
    return <HomeView onLogin={handleLogin} onAdminLogin={handleAdminLogin} onShowSignUp={() => setAuthView('signup')} t={t} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header 
        currentUser={currentUser} 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'explore' && (
            <ExploreView 
                currentUser={currentUser}
                usersToExplore={usersToExplore}
                currentIndex={exploreIndex}
                onSwipe={handleSwipe}
                onGoBack={handleGoBack}
                allSkills={SKILLS}
                t={t}
            />
        )}
        {currentView === 'matches' && <MatchesView currentUser={currentUser} allUsers={allUsers} onUpdateStatus={handleUpdateMatchStatus} onSessionProposalResponse={handleSessionProposalResponse} allSkills={SKILLS} onRateSession={handleRateSession} t={t} />}
        {currentView === 'feed' && <FeedView currentUser={currentUser} allUsers={allUsers} posts={posts} onOpenCreatePost={() => setCreatePostModalOpen(true)} t={t} />}
        {currentView === 'profile' && <ProfileView currentUser={currentUser} onSave={handleProfileSave} allSkills={SKILLS} t={t} />}
        {currentView === 'library' && <LibraryView allSkills={SKILLS} allUsers={allUsers} t={t} />}
        {currentView === 'calendar' && <CalendarView currentUser={currentUser} allUsers={allUsers} onNavigateToChat={handleNavigateToChat} manualEvents={manualCalendarEvents} onManualAddEvent={handleManualAddEvent} allSkills={SKILLS} onStartVideoCall={handleStartVideoCall} t={t} />}
        {currentView === 'marketplace' && <MarketplaceView t={t} />}
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
            onScheduleSession={handleScheduleSession}
            onSessionProposalResponse={handleSessionProposalResponse}
            t={t}
          />
        )}
        {currentView === 'admin' && currentUser.isAdmin && (
            <AdminView
                currentUser={currentUser}
                allUsers={allUsers}
                posts={posts}
                onDeleteUser={handleDeleteUser}
                onDeletePost={handleDeletePost}
                t={t}
            />
        )}
      </main>
      {videoCallPartner && currentUser && <VideoCallModal currentUser={currentUser} partner={videoCallPartner} onClose={handleEndVideoCall} t={t} />}
      {isCreatePostModalOpen && <CreatePostModal onClose={() => setCreatePostModalOpen(false)} onCreatePost={handleCreatePost} t={t} />}
    </div>
  );
};

export default App;