
interface CalendarEvent {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', event.title);
    url.searchParams.set('dates', `${formatDate(event.startTime)}/${formatDate(event.endTime)}`);
    url.searchParams.set('details', event.description);
    return url.toString();
};

export const downloadIcsFile = (event: CalendarEvent): void => {
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `URL:${document.location.href}`,
        `DTSTART:${formatDate(event.startTime)}`,
        `DTEND:${formatDate(event.endTime)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'skillswap-session.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
