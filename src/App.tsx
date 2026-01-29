import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Pokémon detail page */}
        <Route path="/pokemon/:name" element={<PokemonDetail />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
