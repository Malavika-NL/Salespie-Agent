import React from 'react';
import AdminStyleHome from '../../../AdminHomePage/components/MainComponent/MainComponent';

const MainComponent: React.FC = () => {
  return (
    <AdminStyleHome routePrefix="/user" isUserMode />
  );
};

export default MainComponent;
