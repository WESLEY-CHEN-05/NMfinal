import { useState, useEffect, createContext, useContext } from "react";
import { lightTheme, darkTheme } from "../Theme";
const PageContext = createContext();

const PageProvider = (props) => {
  const [theme, setTheme] = useState(lightTheme);
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme mode'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userID, setUserID] = useState(localStorage.getItem('userID') || '');
  const [userEmail, setUserEmail] = useState('');
  const [identity, setIdentity] = useState('guest');
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [gameStage, setGameStage] = useState('idle');

  useEffect(() => {
    localStorage.setItem('theme mode', themeMode);
    setTheme(() => themeMode === 'dark'? darkTheme : lightTheme);
  }, [themeMode])

  return (
    <PageContext.Provider
        value={{
          theme, themeMode, setThemeMode,
          userName, setUserName, 
          userID, setUserID, 
          userEmail, setUserEmail, 
          signedIn, setSignedIn, 
          open, setOpen,
          gameStage, setGameStage,
          identity, setIdentity,
        }}
        {...props}
    ></PageContext.Provider>
  )
}

const usePage = () => useContext(PageContext);

export {PageProvider, usePage};