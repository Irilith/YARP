import { useState, FormEvent } from 'react';
import { MetaFunction } from '@remix-run/node';
import { checkAuthLoader } from '~/data/loader';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login' },
    { name: 'description', content: 'Login to the Panel' },
  ];
};
export const loader = checkAuthLoader;

export default function Index() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(
        `http://127.0.0.1:8081/users?username=${encodeURIComponent(
          username,
        )}&password=${encodeURIComponent(password)}`,
      );

      if (response.ok) {
        const key = await response.text();
        if (key) {
          document.cookie = `auth=${key}; path=/`;
          window.location.href = '/dashboard/ad';
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
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
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
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Login
              </button>
            </div>
          </form>

          {error && (
            <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-sm text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <a
              href="/signup"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
