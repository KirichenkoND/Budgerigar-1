import React from 'react';

interface ScheduleProps {
  doctorName: string;
  days: string[];
  hours: string[];
  roomNumber: string;
}

const Schedule: React.FC<ScheduleProps> = ({ doctorName, days, hours, roomNumber }) => {
  return (
    <div className="schedule">
      <h2>{doctorName}'s Schedule</h2>
      <p>Room Number: {roomNumber}</p>
      <ul>
        {days.map((day, index) => (
          <li key={index}>{day}: {hours[index]}</li>
        ))}
      </ul>
    </div>
  );
}

export default Schedule;
