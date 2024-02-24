import React from 'react';
import Schedule from '../components/Schedule/Schedule';

const SchedulePage: React.FC = () => {
  // Ваш логика получения данных для расписания

  const doctorName = "Dr. Smith";
  const days = ["Monday", "Wednesday", "Friday"];
  const hours = ["9:00 AM - 12:00 PM", "1:00 PM - 3:00 PM", "9:00 AM - 11:00 AM"];
  const roomNumber = "101";

  return (
    <div>
      <Schedule doctorName={doctorName} days={days} hours={hours} roomNumber={roomNumber} />
    </div>
  );
}

export default SchedulePage;