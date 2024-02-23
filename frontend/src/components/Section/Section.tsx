import React from 'react';

interface SectionProps {
  name: string;
  address: string;
  doctorName: string;
}

const Section: React.FC<SectionProps> = ({ name, address, doctorName }) => {
  return (
    <div className="section">
      <h2>{name}</h2>
      <p>Address: {address}</p>
      <p>Doctor: {doctorName}</p>
    </div>
  );
}

export default Section;