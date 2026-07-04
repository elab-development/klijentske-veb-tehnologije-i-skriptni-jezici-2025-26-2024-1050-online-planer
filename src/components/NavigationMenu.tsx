import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaChartBar,
  FaHome,
  FaSignOutAlt,
  FaThLarge,
  FaUser,
} from 'react-icons/fa';

import { useAuth } from '../contexts/useAuth';

const navItems = [
  {
    label: 'Početna',
    to: '/',
    end: true,
    icon: FaHome,
  },
  {
    label: 'Planeri',
    to: '/planners',
    icon: FaThLarge,
  },
  {
    label: 'Statistika',
    to: '/stats',
    icon: FaChartBar,
  },
];

const NavigationMenu = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className='flex w-full shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-[4px_0_24px_rgba(99,102,241,0.06)] lg:fixed lg:left-0 lg:top-0 lg:z-50 lg:h-screen lg:w-[260px]'>
      <div className='mb-4 flex items-center gap-3 border-b border-slate-200 px-2 pb-7'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white'>
          <FaCalendarCheck aria-hidden='true' />
        </div>
        <span className='font-display text-2xl text-indigo-950'>PlanIt</span>
      </div>

      <nav className='py-2'>
        <div className='px-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400'>
          Glavni meni
        </div>

        <div className='mt-2 space-y-1'>
          {navItems.map(({ end, icon: Icon, label, to }) => (
            <NavLink
              key={to}
              end={end}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-indigo-100 text-indigo-500'
                    : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-500',
                ].join(' ')
              }
            >
              <Icon
                aria-hidden='true'
                className='w-5 text-center text-[15px]'
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className='mt-auto flex flex-col items-center gap-3 border-t border-slate-200 pt-5'>
        <div className='flex items-center gap-3'>
          <div
            aria-label='Ulogovani korisnik'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-white'
            title='Ulogovani korisnik'
          >
            <FaUser aria-hidden='true' />
          </div>
          <div className='flex flex-col text-sm'>
            <span>{currentUser?.name}</span>
            <span className='font-bold'>{currentUser?.email}</span>
          </div>
        </div>

        <button
          type='button'
          onClick={handleLogout}
          className='cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-100'
        >
          <FaSignOutAlt aria-hidden='true' />
          Odjavi se
        </button>
      </div>
    </aside>
  );
};

export default NavigationMenu;
