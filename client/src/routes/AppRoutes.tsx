import { Routes, Route } from 'react-router-dom';
import ProtectRoute from '../routes';
import DefaultLayout from '../layout/DefaultLayout';
import BlankLayout from '../layout/BlankLayout';
import Loader from '../common/Loader';

// 🔹 Import JSON Routes
import routesData from './routes.json';

// ✅ Pages
import SignIn from '../pages/Authentication/SignIn';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Profile';
import PageTitle from '../components/PageTitle';
import PageAceess from '../components/PageAceess';

// 🔹 สร้างตัวแมปหน้า Component
const componentsMap: { [key: string]: React.ElementType } = {
  SignIn,
  Dashboard,
  Profile,
  PageAceess,
};

// 🔹 สร้างตัวแมป Layout
const layoutMap: { [key: string]: React.ElementType } = {
  DefaultLayout,
  BlankLayout,
};

const AppRoutes = ({ loading }: { loading: boolean }) => {
  if (loading) return <Loader />;

  return (
    <Routes>
      {routesData.map(
        ({ path, element, layout, title, protected: isProtected }) => {
          const Component = componentsMap[element] || PageAceess;
          const EmptyLayout = ({ children }: { children: React.ReactNode }) => (
            <>{children}</>
          );

          const Layout = layout ? layoutMap[layout] : EmptyLayout;

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
                  <ProtectRoute>{RouteElement}</ProtectRoute>
                ) : (
                  RouteElement
                )
              }
            />
          );
        },
      )}
    </Routes>
  );
};

export default AppRoutes;
