import { useState, useRef, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import DetailModal from '../components/DetailModal';
import '../App.css';

function Home() {
  const { pokemon, loading, error, hasMore, loadMore } = usePokemon();
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 } 
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  return (
    <>
      <div className="app-header">
        <h1>🐦‍🔥PokéDex</h1>
      </div>

      <div className="container">
        {error && <div className="error">Error: {error}</div>}
        
        {pokemon.length > 0 && (
          <>
            <div className="pokemon-grid">
              {pokemon.map((p) => (
                <PokemonCard
                  key={p.name}
                  pokemon={p}
                  onSelect={setSelectedPokemon}
                />
              ))}
            </div>

            {hasMore && (
              <div 
                ref={loaderRef}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#fff',
                }}
              >
                {loading ? (
                  <div className="loading">Loading more Pokémon...</div>
                ) : (
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Scroll to load more
                  </div>
                )}
              </div>
            )}

            {!hasMore && pokemon.length > 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
                <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  ✨ You've reached the end! Displaying {pokemon.length} Pokémon.
                </p>
              </div>
            )}
          </>
        )}

        {loading && pokemon.length === 0 && <div className="loading">Loading Pokémon...</div>}
      </div>

      <DetailModal 
        pokemonName={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </>
  );
}

export default Home;
