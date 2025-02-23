import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAccessToken } from "../redux/slices/authSlice";

import { isEmpty } from "lodash";

// import { usersApi } from "../redux/services/users";
import Loader from "../components/Loader";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const {
    data: sessionData,
    isLoading,
    isFetching,
    error,
  } = useGetSessionQuery();

  const [logout] = useLogoutMutation();
  const authState = useSelector((store) => store?.auth);

  const handleLogin = () => {};
  const handleLogout = async () => {
    await logout();
    dispatch(setAccessToken(null));
  };

  useEffect(() => {
    if (sessionData?.data?.access_token) {
      dispatch(setAccessToken(sessionData?.data?.access_token));
      dispatch(usersApi.endpoints.getMe.initiate());
    }
  }, [sessionData, dispatch]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        isAuthenticated:
          !isEmpty(authState?.accessToken) || error === undefined,
        handleLogin,
        handleLogout,
      }}
    >
      {isLoading || isFetching ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
