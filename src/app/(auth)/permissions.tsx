import { Redirect } from 'expo-router';

import { ROUTES } from '@/constants/routes';

/** Legacy route — permissions screen removed from onboarding. */
export default function PermissionsRedirect() {
  return <Redirect href={ROUTES.home} />;
}
