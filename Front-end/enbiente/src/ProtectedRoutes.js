import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
const ProtectedRoute = ({
    isAuthenticated,
    redirectPath = '/login',
    children,
  }) => {
    if (!isAuthenticated) {
      return <Redirect to={redirectPath} replace />;
    }
  
    return children;
  };
export default ProtectedRoute;