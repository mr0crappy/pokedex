import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemonColor } from '../utils/typeColors';
import '../App.css';

interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  baseExp: number;
  image: string | null;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: string[];
  evolutionChain: string[];
}

function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!name) return;

      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();

        // Parse stats
        const stats = data.stats?.map((stat: any) => ({
          name: stat.stat.name.replace('-', ' '),
          value: stat.base_stat,
        })) || [];

        const abilities = data.abilities?.map((ability: any) => ability.ability.name) || [];

        const pokemonData: PokemonDetail = {
          name: data.name,
          height: data.height,
          weight: data.weight,
          baseExp: data.base_experience,
          image: data.sprites.front_default,
          types: data.types?.map((t: any) => t.type.name) || ['normal'],
          stats,
          abilities,
          evolutionChain: [], 
        };

        setPokemon(pokemonData);

        try {
          const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
          const speciesData = await speciesResponse.json();
          
          const englishEntry = speciesData.flavor_text_entries?.find(
            (entry: any) => entry.language.name === 'en'
          );
          
          if (englishEntry) {
            const cleanedText = englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
            setDescription(cleanedText);
          }

          // Fetch evolution chain
          if (speciesData.evolution_chain) {
            try {
              const evolutionResponse = await fetch(speciesData.evolution_chain.url);
              const evolutionData = await evolutionResponse.json();
              
              const evolutions: string[] = [];
              let current = evolutionData.chain;
              
              while (current) {
                evolutions.push(current.species.name);
                if (current.evolves_to.length > 0) {
                  current = current.evolves_to;
                } else {
                  break;
                }
              }
              
              pokemonData.evolutionChain = evolutions;
              setPokemon({ ...pokemonData }); 
            } catch (err) {
              console.error('Failed to fetch evolution:', err);
            }
          }
        } catch (err) {
          console.error('Failed to fetch description:', err);
          setDescription(`A ${pokemonData.types.join('/')} type Pokémon.`);
        }
      } catch (err) {
        console.error('Error fetching pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!pokemon) {
    return <div className="error">Pokémon not found</div>;
  }

  const primaryType = pokemon.types?.[0] || 'normal';
  const colors = getPokemonColor(primaryType);

  return (
    <>
      <div className="app-header">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <h1>✨ PokéDex</h1>
        </Link>
        <p>Discover amazing creatures with smooth animations</p>
      </div>

      <div className="container detail-container">
        <Link to="/" className="back-button">← Back to List</Link>
        
        <div 
          className="detail-card"
          style={{
            background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.border} 100%)`,
            borderColor: colors.border,
          }}
        >
          <h2 style={{ textTransform: 'capitalize', marginBottom: '0.5rem', fontSize: '2.5rem', color: colors.text }}>
            {pokemon.name}
          </h2>

          <p style={{ fontSize: '0.9rem', color: colors.text, marginBottom: '1.5rem', opacity: 0.9 }}>
            #{String(pokemon.types).toUpperCase()} Type
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {pokemon.types.map((type) => (
              <span 
                key={type} 
                className="modal-type-badge"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.3' : '0.2'})`,
                  borderColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.6' : '0.4'})`,
                  color: colors.text,
                }}
              >
                {type}
              </span>
            ))}
          </div>

          {pokemon.image && (
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{
                width: '250px',
                height: '250px',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              }}
            />
          )}

          <p style={{ opacity: 0.95, fontSize: '1rem', lineHeight: 1.6, color: colors.text, marginBottom: '1.5rem' }}>
            {description}
          </p>

          <div 
            className="detail-section"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${colors.text === '#fff' ? '0.3' : '0.1'})`,
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem' }}>Physical Attributes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: colors.text, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Height</strong>
                </p>
                <p style={{ color: colors.text, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {(pokemon.height * 0.1).toFixed(1)} m
                </p>
              </div>
              <div>
                <p style={{ color: colors.text, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Weight</strong>
                </p>
                <p style={{ color: colors.text, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {(pokemon.weight * 0.1).toFixed(1)} kg
                </p>
              </div>
              <div>
                <p style={{ color: colors.text, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Base XP</strong>
                </p>
                <p style={{ color: colors.text, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {pokemon.baseExp}
                </p>
              </div>
              <div>
                <p style={{ color: colors.text, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Pokédex ID</strong>
                </p>
                <p style={{ color: colors.text, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  #{String(pokemon.baseExp).padStart(3, '0')}
                </p>
              </div>
            </div>
          </div>

          {pokemon.abilities.length > 0 && (
            <div 
              className="detail-section"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${colors.text === '#fff' ? '0.3' : '0.1'})`,
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem' }}>Abilities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability}
                    style={{
                      backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.2' : '0.15'})`,
                      border: `1px solid rgba(255, 255, 255, ${colors.text === '#fff' ? '0.4' : '0.3'})`,
                      color: colors.text,
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      textTransform: 'capitalize',
                      fontWeight: '500',
                    }}
                  >
                    {ability.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pokemon.stats.length > 0 && (
            <div 
              className="detail-section"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${colors.text === '#fff' ? '0.3' : '0.1'})`,
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem' }}>Base Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {pokemon.stats.map((stat) => (
                  <div key={stat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: colors.text, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                        {stat.name}
                      </span>
                      <span style={{ color: colors.text, fontWeight: 'bold' }}>
                        {stat.value}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.2' : '0.15'})`,
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(stat.value / 150) * 100}%`,
                          height: '100%',
                          backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.6' : '0.5'})`,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pokemon.evolutionChain.length > 1 && (
            <div 
              className="detail-section"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${colors.text === '#fff' ? '0.3' : '0.1'})`,
                borderRadius: '12px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem' }}>Evolution Chain</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {pokemon.evolutionChain.map((evo, idx) => (
                  <div key={evo} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.2' : '0.15'})`,
                        border: `1px solid rgba(255, 255, 255, ${colors.text === '#fff' ? '0.4' : '0.3'})`,
                        color: colors.text,
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        textTransform: 'capitalize',
                        fontWeight: '500',
                      }}
                    >
                      {evo}
                    </span>
                    {idx < pokemon.evolutionChain.length - 1 && (
                      <span style={{ color: colors.text, fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PokemonDetail;
