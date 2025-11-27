import React from 'react';

const localStore = { getState: () => ({}), dispatch: () => { }, subscribe: () => () => { } };
export const ReactReduxContext = React.createContext(null);
export const ReduxProvider = ({ children }: { children: React.ReactNode }) => (
  <ReactReduxContext.Provider value={{ store: localStore }}>{children}</ReactReduxContext.Provider>
);
