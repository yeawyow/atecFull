// AppRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectRoute from '../routes';
import DefaultLayout from '../layout/DefaultLayout';
import BlankLayout from '../layout/BlankLayout';
import Loader from '../common/Loader';
import verifyToken from '../utils/verifyToken'; // ฟังก์ชันที่ใช้ตรวจสอบ token
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setAuthenticated } from "../features/auth/authSlice";

// 🔹 Import JSON Routes
import routesData from './routes.json';


import SignIn from '../pages/Authentication/SignIn';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Profile';
import PageTitle from '../components/PageTitle';
import PageAceess from '../components/PageAceess';

const componentsMap: { [key: string]: React.ElementType } = {
  SignIn,
  Dashboard,
  Profile,
  PageAceess,
};


const layoutMap: { [key: string]: React.ElementType } = {
  DefaultLayout,
  BlankLayout,
};

const AppRoutes = ({ loading }: { loading: boolean }) => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false); // ตรวจสอบว่าแอปพร้อมหรือยัง
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValidToken = await verifyToken(dispatch); // ตรวจสอบ token
        dispatch(setAuthenticated(isValidToken)); 

      } else {
        dispatch(setAuthenticated(false)); 

      }
      setIsReady(true); 
    };

    checkToken();
  }, [dispatch]);

  if (!isReady || loading) return <Loader />; 

  return (
    <Routes>
      {routesData.map(
        ({ path, element, layout, title, protected: isProtected }) => {
          const Component = componentsMap[element] || PageAceess;
          const Layout = layout ? layoutMap[layout] : React.Fragment;

          const RouteElement = (
            <Layout>
              {title && <PageTitle title={title} />}
              <Component />
            </Layout>
          );

          return (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  isAuthenticated ? (
                    <ProtectRoute>{RouteElement}</ProtectRoute>
                  ) : (
                    <SignIn /> 
                  )
                ) : (
                  RouteElement
                )
              }
            />
          );
        }
      )}
    </Routes>
  );
};

export default AppRoutes;
