import { useState } from 'react';

export const Home = () => {
  const [title] = useState('Template app');

  return (
    <div>
      Welcome to your {title}.
    </div>
  );
};
