import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Planners from './pages/Planners';
import Stats from './pages/Stats';

function App() {
  return (
    <>
      <BrowserRouter>
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
