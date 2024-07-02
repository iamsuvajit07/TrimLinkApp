/* eslint-disable react/prop-types */

import {createContext, useContext, useEffect} from "react";
import useFetch from "./hooks/use-fetch";
import { getCurrentUser } from "./db/apiAuth";

const UrlContext = createContext();

const UrlProvider = ({children}) => { //we will wrap our whole app in this urlProvider
  
  const {data: user, loading, fn: fetchUser} = useFetch(getCurrentUser);//fetch our get current user that we have created

  const isAuthenticated = user?.role === "authenticated";//to checked that the user is currently logged in(boolean)

  //whenever our app loads for the very first time this will run every single time in every single page just to take the session of the user
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UrlContext.Provider value={{user, fetchUser, loading, isAuthenticated}}>
      {children}
    </UrlContext.Provider>
  );
};

//to access the data user should have to this useContext hook
export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;
