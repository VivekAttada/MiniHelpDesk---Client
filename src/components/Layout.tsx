import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/tickets" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Mini Helpdesk</h1>
            </Link>
            <nav>
              <Link
                to="/tickets"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                All Tickets
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
