import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Planners from './pages/Planners';
import Stats from './pages/Stats';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position='bottom-right'
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              color: '#ffffff',
              background: '#1e1b4b',
              fontWeight: 500,
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
          }}
        />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route
            path='/planners'
            element={
              <ProtectedRoute>
                <Planners />
              </ProtectedRoute>
            }
          />
          <Route
            path='/stats'
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
