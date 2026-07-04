import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/useAuth';
import NavigationMenu from './NavigationMenu';

interface ProtectedRouteProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  '/': 'Početna',
  '/planners': 'Planeri',
  '/stats': 'Statistika',
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();

  if (!currentUser) {
    return <Navigate replace to='/login' />;
  }

  return (
    <div className='min-h-screen bg-[#f8f7ff] text-indigo-950 lg:flex'>
      <NavigationMenu />

      <main className='min-h-screen flex-1 lg:ml-[260px]'>
        <header className='sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-5 shadow-[0_2px_16px_rgba(99,102,241,0.05)] sm:px-8'>
          <h1 className='text-lg font-bold text-indigo-950'>
            {pageTitles[pathname] ?? 'PlanIt'}
          </h1>
        </header>

        <div className='p-5 sm:p-8'>{children}</div>
      </main>
    </div>
  );
};

export default ProtectedRoute;
