import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonColor } from '../utils/typeColors';

interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  baseExp: number;
  image: string | null;
  types: string[];
}

interface Props {
  pokemonName: string | null;
  onClose: () => void;
}

const DetailModal: React.FC<Props> = ({ pokemonName, onClose }) => {
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pokemonName) return;

    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();

        const pokemonData = {
          name: data.name,
          height: data.height,
          weight: data.weight,
          baseExp: data.base_experience,
          image: data.sprites.front_default,
          types: data.types?.map((t: any) => t.type.name) || ['normal'],
        };

        setPokemon(pokemonData);

        // Fetch description
        try {
          const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
          const speciesData = await speciesResponse.json();
          
          const englishEntry = speciesData.flavor_text_entries?.find(
            (entry: any) => entry.language.name === 'en'
          );
          
          if (englishEntry) {
            const cleanedText = englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
            setDescription(cleanedText);
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
  }, [pokemonName]);

  if (!pokemonName) return null;

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error">Pokémon not found</div>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types?.[0] || 'normal';
  const colors = getPokemonColor(primaryType);

  const handleViewFullPage = () => {
    navigate(`/pokemon/${pokemonName}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.border} 100%)`,
          borderColor: colors.border,
        }}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 style={{ textTransform: 'capitalize', marginBottom: '1rem', fontSize: '2rem', color: colors.text }}>
          {pokemon.name}
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
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
              width: '200px',
              height: '200px',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          />
        )}

        <div 
          className="modal-stats"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${colors.text === '#fff' ? '0.3' : '0.1'})`,
          }}
        >
          <p style={{ color: colors.text }}>
            <strong>Height:</strong> {(pokemon.height * 0.1).toFixed(1)} m
          </p>
          <p style={{ color: colors.text }}>
            <strong>Weight:</strong> {(pokemon.weight * 0.1).toFixed(1)} kg
          </p>
          <p style={{ color: colors.text }}>
            <strong>Base XP:</strong> {pokemon.baseExp}
          </p>
        </div>

        <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.5, color: colors.text, marginBottom: '1rem' }}>
          {description}
        </p>

        <button 
          onClick={handleViewFullPage}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.2' : '0.3'})`,
            border: `2px solid rgba(255, 255, 255, ${colors.text === '#fff' ? '0.4' : '0.5'})`,
            borderRadius: '8px',
            color: colors.text,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.3' : '0.4'})`;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, ${colors.text === '#fff' ? '0.2' : '0.3'})`;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          View Full Page →
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
