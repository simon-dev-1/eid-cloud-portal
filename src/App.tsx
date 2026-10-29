import { BrowserRouter, Route, Routes } from 'react-router';
import { UnlockProvider } from './context/UnlockProvider';
import { Landing } from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { Unlock } from './pages/Unlock';
import { Vault } from './pages/Vault';

export default function App() {
  return (
    <BrowserRouter>
      <UnlockProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UnlockProvider>
    </BrowserRouter>
  );
}
