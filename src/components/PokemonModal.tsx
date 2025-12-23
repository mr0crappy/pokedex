import React, { useEffect, useState } from 'react';
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
  pokemon: PokemonDetail | null;
  onClose: () => void;
}

const PokemonModal: React.FC<Props> = ({ pokemon, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [loadingDesc, setLoadingDesc] = useState(false);

  useEffect(() => {
    if (!pokemon) return;

    const fetchDescription = async () => {
      setLoadingDesc(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
        const data = await response.json();
        
        // Get English flavor text
        const englishEntry = data.flavor_text_entries?.find(
          (entry: any) => entry.language.name === 'en'
        );
        
        if (englishEntry) {
          const cleanedText = englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
          setDescription(cleanedText);
        }
      } catch (err) {
        console.error('Failed to fetch description:', err);
        setDescription(`A ${pokemon.types.join('/')} type Pokémon.`);
      } finally {
        setLoadingDesc(false);
      }
    };

    fetchDescription();
  }, [pokemon]);

  if (!pokemon) return null;

  const primaryType = pokemon.types?.[0] || 'normal';
  const colors = getPokemonColor(primaryType);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="modal-content"
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
              width: '150px',
              height: '150px',
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
        <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.5, color: colors.text, minHeight: '3rem' }}>
          {loadingDesc ? 'Loading description...' : description}
        </p>
      </div>
    </div>
  );
};

export default PokemonModal;
