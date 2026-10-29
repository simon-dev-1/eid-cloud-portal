import { BrowserRouter, Route, Routes } from 'react-router';
import { Landing } from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { Vault } from './pages/Vault';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
