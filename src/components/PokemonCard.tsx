import React from 'react';
import { getPokemonColor } from '../utils/typeColors';

interface Pokemon {
  name: string;
  id: number;
  type: string;
}

interface Props {
  pokemon: Pokemon;
  onSelect: (name: string) => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, onSelect }) => {
  const colors = getPokemonColor(pokemon.type);

  return (
    <div 
      className="card"
      onClick={() => onSelect(pokemon.name)}
      style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.border} 100%)`,
        borderColor: colors.border,
      }}
    >
      <div className="card-image">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          alt={pokemon.name}
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
          }}
        />
      </div>
      <div className="card-number" style={{ color: colors.text }}>#{String(pokemon.id).padStart(3, '0')}</div>
      <h2 style={{ color: colors.text }}>{pokemon.name}</h2>
      <span className="card-type" style={{ color: colors.text, borderColor: colors.text }}>
        {pokemon.type}
      </span>
    </div>
  );
};

export default PokemonCard;
