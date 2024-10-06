import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Wrong' }, { name: 'description', content: 'Go Home' }];
};

export default function CatchAll() {
  return <div>Darling, wrong pages</div>;
}
