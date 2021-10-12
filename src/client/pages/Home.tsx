import { useState } from 'react';
import { useCustomUtilHook } from '~/hooks';

export const Home = () => {
  const [title] = useState('Template app');
  const services = useCustomUtilHook();

  return (
    <div>
      Welcome to your {title} {services.key}.
    </div>
  );
};
