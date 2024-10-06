import { useState, FormEvent } from 'react';
import { checkAuthLoader } from '~/data/loader';
import { MetaFunction } from '@remix-run/node';

export const loader = checkAuthLoader;
export const meta: MetaFunction = () => {
  return [
    { title: 'Register' },
    { name: 'description', content: 'Register for the Panel' },
  ];
};
export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    try {
      const response = await fetch('http://127.0.0.1:8081/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.text();
        if (result) {
          window.location.href = '/login';
        } else {
          setError('Unexpected response format.');
        }
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/3.jpg)' }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Register
              </button>
            </div>
          </form>

          {error && (
            <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <a
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
