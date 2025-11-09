import React, { useState, useMemo } from 'react';
import { User, ManualCalendarEvent, Skill, UserSkill } from '../types';
import Avatar from '../components/Avatar';
import { generateGoogleCalendarLink, downloadIcsFile } from '../utils/calendar';

interface CalendarViewProps {
  currentUser: User;
  allUsers: User[];
  onNavigateToChat: (partner: User) => void;
  manualEvents: ManualCalendarEvent[];
  onManualAddEvent: (title: string, date: string) => void;
  allSkills: Skill[];
  onStartVideoCall: (partner: User) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentUser, allUsers, onNavigateToChat, manualEvents, onManualAddEvent, onStartVideoCall }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const scheduledSwapEvents = useMemo(() => {
    return currentUser.matches
      .filter(match => match.scheduledSession)
      .map(match => {
        const partner = allUsers.find(u => u.id === match.userId);
        if (!partner) return null;

        // Find a skill the current user can teach the partner
        const userSkill = currentUser.skillsToTeach.find(s => partner.skillsToLearn.some(ps => ps.id === s.id));
        // Find a skill the partner can teach the current user
        const partnerSkill = partner.skillsToTeach.find(s => currentUser.skillsToLearn.some(cs => cs.id === s.id));
        
        return {
          id: `swap-${match.userId}-${match.scheduledSession}`,
          date: new Date(match.scheduledSession!),
          title: `Session with ${partner.name}`,
          type: 'swap' as const,
          partner,
          userSkill,
          partnerSkill,
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);
  }, [currentUser, allUsers]);
  
  const personalGoalEvents = useMemo(() => {
      return manualEvents.map(event => ({
          ...event,
          date: new Date(event.date),
          type: 'personal' as const,
      }));
  }, [manualEvents]);

  const allEvents = useMemo(() => {
      return [...scheduledSwapEvents, ...personalGoalEvents].sort((a,b) => a.date.getTime() - b.date.getTime());
  }, [scheduledSwapEvents, personalGoalEvents]);
  
  const handleAddEventSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newEventTitle.trim() && newEventDate) {
          onManualAddEvent(newEventTitle, new Date(newEventDate).toISOString());
          setNewEventTitle('');
          setNewEventDate('');
      }
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + offset);
        return newDate;
    });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, () => null);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventsByDate = useMemo(() => {
      const map = new Map<string, any[]>();
      allEvents.forEach(event => {
          const dateString = event.date.toDateString();
          if (!map.has(dateString)) {
              map.set(dateString, []);
          }
          map.get(dateString)!.push(event);
      });
      return map;
  }, [allEvents]);

  const selectedDayEvents = eventsByDate.get(selectedDate.toDateString()) || [];
  const today = new Date();

  return (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Previous month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Next month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
                    {weekdays.map(day => <div key={day} className="font-semibold py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 mt-1">
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isToday = dayDate.toDateString() === today.toDateString();
                        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
                        const dayEvents = eventsByDate.get(dayDate.toDateString());
                        const hasEvents = dayEvents && dayEvents.length > 0;

                        return (
                            <div key={day} onClick={() => setSelectedDate(dayDate)} className={`relative p-1 aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <span className={`flex items-center justify-center h-8 w-8 rounded-full font-semibold ${isToday && !isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' : ''} ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {day}
                                </span>
                                {hasEvents && (
                                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-0.5">
                                    {dayEvents.slice(0, 3).map((event, i) => (
                                      <div key={i} className={`h-1.5 w-1.5 rounded-full ${event.type === 'swap' ? (isSelected ? 'bg-white' : 'bg-blue-500') : (isSelected ? 'bg-white' : 'bg-green-500')}`}></div>
                                    ))}
                                  </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Agenda & Form */}
            <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        {selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 -mr-2">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onNavigateToChat={onNavigateToChat}
                                onStartVideoCall={onStartVideoCall}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No events scheduled for this day.</p>
                        </div>
                    )}
                    </div>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add Personal Goal</h2>
                    <form onSubmit={handleAddEventSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title</label>
                            <input
                                type="text"
                                id="event-title"
                                value={newEventTitle}
                                onChange={e => setNewEventTitle(e.target.value)}
                                placeholder="e.g., Practice Guitar"
                                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                            <input
                                type="datetime-local"
                                id="event-date"
                                value={newEventDate}
                                onChange={e => setNewEventDate(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
                            disabled={!newEventTitle.trim() || !newEventDate}
                        >
                            Add Goal
                        </button>
                    </form>
                </div>
            </div>
        </div>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
         `}</style>
    </div>
  );
};


type EventType = ReturnType<typeof useMemo<any[], any>>[0];

const EventCard: React.FC<{
    event: EventType,
    onNavigateToChat: (partner: User) => void,
    onStartVideoCall: (partner: User) => void
}> = ({ event, onNavigateToChat, onStartVideoCall }) => {

    const handleAddToCalendar = (type: 'google' | 'ics') => {
        let description = `A session for ${event.title}.`;
        if (event.type === 'swap') {
            description = `A SkillSwap session with ${event.partner.name}.`;
            if(event.partnerSkill) description += `\nYou are learning: ${event.partnerSkill.name}.`;
            if(event.userSkill) description += `\nYou are teaching: ${event.userSkill.name}.`;
        }

        const calendarEvent = {
            title: event.title,
            description: description,
            startTime: event.date,
            endTime: new Date(event.date.getTime() + 60 * 60 * 1000), // Assume 1 hour
        };
        if (type === 'google') {
            window.open(generateGoogleCalendarLink(calendarEvent), '_blank');
        } else {
            downloadIcsFile(calendarEvent);
        }
    };

    const isToday = event.date.toDateString() === new Date().toDateString();
    const isPast = event.date < new Date() && !isToday;

    return (
        <div className={`p-4 rounded-lg border-l-4 transition-opacity ${isPast ? 'opacity-60' : ''} ${event.type === 'swap' ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500' : 'bg-green-50 dark:bg-green-900/50 border-green-500'}`}>
            <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900 dark:text-white text-base pr-2">{event.title}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {event.date.toLocaleString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
            </div>

            {event.type === 'swap' && (
                <div className="mt-4 space-y-4">
                    {/* Skill Details */}
                    <div className="space-y-2">
                        {event.partnerSkill && <SkillInfo type="learn" skill={event.partnerSkill} />}
                        {event.userSkill && <SkillInfo type="teach" skill={event.userSkill} />}
                        {!event.partnerSkill && event.userSkill && (
                           <p className="text-xs text-gray-500 dark:text-gray-400 italic">This is a one-way session (e.g., for points or pro-bono).</p>
                        )}
                    </div>

                    {/* Partner & Actions */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <Avatar user={event.partner} size="sm" />
                                <span className="text-sm font-medium ml-2">{event.partner.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {isToday && (
                                    <button onClick={() => onStartVideoCall(event.partner)} className="flex items-center space-x-1.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md transition-colors" title="Start Video Call">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M3.75 3.75A.75.75 0 003 4.5v11a.75.75 0 00.75.75h12.5a.75.75 0 00.75-.75v-11a.75.75 0 00-.75-.75h-1.25a.75.75 0 00-.75.75v1.25H5.5V4.5a.75.75 0 00-.75-.75H3.75z" /><path d="M17 6.75a.75.75 0 00-1.13-.648l-3.56 2.135V12l3.56 2.136A.75.75 0 0017 13.5v-6.75z" /></svg>
                                        <span>Start Call</span>
                                    </button>
                                )}
                                <button onClick={() => onNavigateToChat(event.partner)} className="text-sm font-semibold text-blue-600 hover:underline">
                                    Chat
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleAddToCalendar('google')} className="flex-1 text-xs font-semibold py-1 px-2 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">Add to Google</button>
                            <button onClick={() => handleAddToCalendar('ics')} className="flex-1 text-xs font-semibold py-1 px-2 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">Download .ics</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SkillInfo: React.FC<{ type: 'learn' | 'teach', skill: Skill | UserSkill }> = ({ type, skill }) => {
    const isLearning = type === 'learn';
    const Icon = isLearning ?
        (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L9 9.48l-4.148 2.24a1 1 0 00-.54 1.838L9 16.48l4.148-2.24a1 1 0 00.54-1.838L9 10.162l6.606-3.242a1 1 0 000-1.84l-7-3z" /></svg>) :
        (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>);

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            {Icon}
            <span>
                <span className="font-semibold">{isLearning ? 'You are learning' : 'You are teaching'}:</span> {skill.name}
            </span>
        </div>
    );
}

export default CalendarView;