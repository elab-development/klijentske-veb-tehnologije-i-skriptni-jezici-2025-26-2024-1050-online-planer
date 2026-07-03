import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Planners from './pages/Planners';
import Stats from './pages/Stats';

function App() {
  return (
    <>
      <BrowserRouter>
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
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/planners' element={<Planners />} />
          <Route path='/stats' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
