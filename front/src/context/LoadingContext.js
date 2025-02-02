import React, { createContext, useContext, useState } from 'react';
import Loading from '../components/common/Loading';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  return (
    <LoadingContext.Provider value={{ setLoading, setLoadingMessage }}>
      {loading && <Loading message={loadingMessage} />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext); 