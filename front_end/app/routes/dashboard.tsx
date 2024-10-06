import { Outlet } from '@remix-run/react';
import { checkAuthLoader } from '~/data/loader';
import { MetaFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';
// Check the dashboard.ad.tsx file for setup example.

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard' },
    { name: 'description', content: 'Dashboard for the Panel' },
  ];
};

export const loader = checkAuthLoader;

export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-white font-bold">Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button
                variant="ghost"
                className="text-white hover:text-blue-400"
              >
                Anime Defender
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Dashboard content area */}
      <Card className="flex-grow bg-gray-800 p-6">
        <Outlet />
      </Card>

      {/* Footer */}
      <footer className="bg-gray-800 mt-8 py-6 text-center text-gray-400 rounded-lg">
        <p className="mb-4">
          Copyright © {new Date().getFullYear()} Lilith Iris.{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Irilith/YARP/blob/main/LICENSE"
          >
            {' '}
            GNU General Public License v3.0
          </a>
        </p>
        <p className="mb-4">
          <strong>YARP</strong> is a web-based panel for tracking your game the
          Roblox game. It is designed to be easy to use and customizable,
          allowing you to track your game statistics and view your account
          information.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            asChild
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            <a
              href="https://github.com/Irilith/YARP"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            <a
              href="https://discord.gg/QfpGHB87jK"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord Server
            </a>
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                More Info
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-gray-800 text-white rounded-lg p-4 w-full">
              <DrawerHeader>
                <DrawerTitle>YARP</DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500">
                  YARP (Yet Another Roblox Panel) is a comprehensive tool for
                  Roblox game developers.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <p>
                  YARP provides detailed analytics, player management tools, and
                  customizable dashboards to help you optimize your Roblox
                  game's performance and player engagement.
                </p>
              </div>
              <DrawerFooter>
                <DrawerClose
                  asChild
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </footer>
    </div>
  );
}
