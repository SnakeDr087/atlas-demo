import React, { useState } from 'react';
import type { InPersonReview } from '../types.ts';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents.tsx';

interface InteractiveCalendarProps {
    events: InPersonReview[];
    onDateSelect?: (date: Date) => void;
}

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({ events, onDateSelect }) => {
    const [date, setDate] = useState(new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const handlePrevMonth = () => {
        setDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDate(new Date(year, month + 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const eventsByDate: { [key: number]: InPersonReview[] } = events.reduce((acc, event) => {
        const eventDate = new Date(event.reviewDate + 'T00:00');
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            const day = eventDate.getDate();
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(event);
        }
        return acc;
    }, {} as { [key: number]: InPersonReview[] });

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="h-6 w-6 text-gray-600"/>
                </button>
                <h2 className="text-lg font-semibold text-gray-800">{monthNames[month]} {year}</h2>
                <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronRightIcon className="h-6 w-6 text-gray-600"/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-2 font-medium text-gray-500">{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dayDate = new Date(year, month, day);
                    const isToday = isSameDay(today, dayDate);
                    const dayEvents = eventsByDate[day] || [];
                    
                    return (
                        <div 
                            key={day} 
                            className={`py-1 rounded-lg relative ${isToday ? 'bg-atlas-light-blue' : ''} ${onDateSelect ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                            onClick={() => onDateSelect && onDateSelect(dayDate)}
                        >
                            <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${isToday ? 'font-bold text-atlas-blue' : 'text-gray-700'}`}>
                                {day}
                            </span>
                            <div className="flex justify-center items-center space-x-1 mt-1 h-2">
                                {dayEvents.map(event => (
                                     <div key={event.id} className={`w-2 h-2 rounded-full ${event.status === 'Completed' ? 'bg-green-500' : 'border-2 border-blue-500'}`} title={`${event.status}: ${event.officer.lastName}`}></div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default InteractiveCalendar;