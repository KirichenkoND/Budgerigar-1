import React from 'react';

interface NotFoundProps {
  message: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <div className="not-found">
      <h2>{message}</h2>
    </div>
  );
}

export default NotFound;