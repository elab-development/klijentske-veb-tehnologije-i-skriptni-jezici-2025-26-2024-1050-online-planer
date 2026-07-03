import { useState, type SyntheticEvent } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from 'react-icons/fa';

import { useAuth } from '../contexts/useAuth';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate replace to='/' />;
  }

  const handleLogin = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Unesite email adresu i lozinku pre prijave.');
      return;
    }

    const loggedInUser = login(email, password);

    if (!loggedInUser) {
      toast.error('Korisnik sa unetim podacima ne postoji.');
      return;
    }

    toast.success(`Dobrodošli, ${loggedInUser.name}!`);
    navigate('/');
  };

  return (
    <main className='flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-500 via-violet-500 to-amber-100 px-4 py-6 text-slate-900 sm:px-6'>
      <form
        onSubmit={handleLogin}
        className='w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-2xl shadow-indigo-900/20 sm:p-8 lg:p-10'
      >
        <div className='mb-8 flex items-center gap-3'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 text-lg text-white shadow-lg shadow-indigo-200'>
            <FaCalendarCheck />
          </div>
          <span className='font-display text-3xl text-slate-900'>PlanIt</span>
        </div>

        <div className='mb-7'>
          <h1 className='font-display mb-2 text-3xl font-normal text-slate-900 sm:text-4xl'>
            Dobrodošli nazad!
          </h1>
          <p className='text-sm leading-6 text-slate-500 sm:text-base'>
            Prijavite se na vaš nalog i nastavite gde ste stali.
          </p>
        </div>

        <div className='space-y-5'>
          <label className='block' htmlFor='login-email'>
            <span className='mb-2 block text-sm font-semibold text-slate-900'>
              Email adresa
            </span>
            <span className='relative block'>
              <FaEnvelope className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400' />
              <input
                id='login-email'
                type='email'
                name='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='Unesite email adresu'
                className='h-12 w-full rounded-xl border-2 border-slate-200 bg-indigo-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base'
              />
            </span>
          </label>

          <label className='block' htmlFor='login-password'>
            <span className='mb-2 block text-sm font-semibold text-slate-900'>
              Lozinka
            </span>
            <span className='relative block'>
              <FaLock className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400' />
              <input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder='Unesite lozinku'
                className='h-12 w-full rounded-xl border-2 border-slate-200 bg-indigo-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:text-base'
              />
              <button
                type='button'
                onClick={() => setShowPassword((current) => !current)}
                className='absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600'
                aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </span>
          </label>
        </div>

        <button
          type='submit'
          className='mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 sm:text-base'
        >
          Prijavi se
          <FaArrowRight className='text-sm' />
        </button>
      </form>
    </main>
  );
};

export default Login;
