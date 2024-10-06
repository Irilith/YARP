import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

export const checkAuthLoader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie');

  const url = new URL(request.url);
  if (cookieHeader?.includes('auth=')) {
    if (!url.pathname.includes('/dashboard')) {
      return redirect('/dashboard/ad');
    } else {
      return null;
    }
  } else if (url.pathname !== '/login' && url.pathname !== '/signup') {
    return redirect('/login');
  }
  return null;
};
