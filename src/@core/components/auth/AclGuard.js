// ** React Imports
import { useEffect } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can';

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl';

// ** Component Import
import NotAuthorized from 'src/pages/401';
import Spinner from 'src/@core/components/spinner';
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute';
import toast from 'react-hot-toast';

const AclGuard = (props) => {
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props;

  console.log('children', children);
  console.log('guestGuard', guestGuard);
  console.log('authGuard', authGuard);

  // ** Hooks
  const auth = useAuth();
  const { logout } = useAuth();
  const router = useRouter();
  console.log('auth', auth);
  console.log('router', router);

  const targetDate = new Date(auth?.user?.data?.expires_in);
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate > targetDate) {
      logout();
      toast.error('Token has expired. Please log in again.');
    }
  }, [targetDate]);

  // ** Vars
  let ability;
  useEffect(() => {
    if (auth.user && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(auth.user.role);
      router.replace(homeRoute);
    }
  }, [auth.user, guestGuard, router]);

  // User is logged in, build ability for the user based on his role
  if (auth.user) {
    // ability = buildAbilityFor(auth.user.role, aclAbilities.subject);
    // if (router.route === '/') {
    //   return <Spinner />;
    // }
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>;
    }
  }

  // Check the access of current user and render pages
  if (auth.user) {
    // if (router.route === '/') {
    //   return <Spinner />;
    // }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  );
};

export default AclGuard;
