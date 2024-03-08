import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-content";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElement/LoadingSpinner";

const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const App = () => {
  const { token, userId, login, logout } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} exact="true" />
        <Route path="/:userId/places" element={<UserPlaces />} exact="true" />
        <Route path="/places/new" element={<NewPlace />} exact="true" />
        <Route path="/places/:placeId" element={<UpdatePlace />} exact="true" />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} exact="true" />
        <Route path="/:userId/places" element={<UserPlaces />} exact="true" />
        <Route path="/auth" element={<Auth />} exact="true" />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
