// // src/components/PrivateRoute.tsx
// import React from 'react';
// import { Route, Redirect, RouteProps } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// interface PrivateRouteProps extends Omit<RouteProps, 'component'> {
//   component: React.ComponentType<any>;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({
//   component: Component,
//   ...rest
// }) => {
//   const { user } = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         user ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: '/auth',
//               state: { from: props.location }
//             }}
//           />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;