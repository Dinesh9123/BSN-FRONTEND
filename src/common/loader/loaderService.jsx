import { createContext, useContext, useState } from "react";
import Loader from "./loader.jsx";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loaderState, setLoaderState] = useState({ show: false, message: "" });

  return (
    <LoaderContext.Provider value={setLoaderState}>
      {children}
      {loaderState.show && <Loader message={loaderState.message} />}
    </LoaderContext.Provider>
  );
};

// Hooks for any component
export const useLoader = () => {
  const setLoaderState = useContext(LoaderContext);
  if (!setLoaderState) throw new Error("useLoader must be used within LoaderProvider");

  return {
    showLoader: (message = "Please wait...") => setLoaderState({ show: true, message }),
    hideLoader: () => setLoaderState({ show: false, message: "" }),
  };
};
