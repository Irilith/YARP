import { MetaFunction, LoaderFunction, redirect } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Home' }, { name: 'description', content: 'Go Home' }];
};

export const loader: LoaderFunction = () => {
  return redirect('/dashboard/ad');
};

export default function Index() {
  return <p>Go home darling.</p>;
}
