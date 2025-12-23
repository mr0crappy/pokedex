export const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: '#A8A878', text: '#fff', border: '#8B8B5F' },
  fire: { bg: '#F08030', text: '#fff', border: '#CC5500' },
  water: { bg: '#6890F0', text: '#fff', border: '#4A6FA5' },
  electric: { bg: '#F8D030', text: '#000', border: '#C49E0E' },
  grass: { bg: '#78C850', text: '#fff', border: '#5BA03D' },
  ice: { bg: '#98D8D8', text: '#000', border: '#73A8A8' },
  fighting: { bg: '#C03028', text: '#fff', border: '#8B1F1F' },
  poison: { bg: '#A040A0', text: '#fff', border: '#702A70' },
  ground: { bg: '#E0C068', text: '#000', border: '#A89850' },
  flying: { bg: '#A890F0', text: '#fff', border: '#7A68B8' },
  psychic: { bg: '#F85888', text: '#fff', border: '#C43A63' },
  bug: { bg: '#A8B820', text: '#fff', border: '#808620' },
  rock: { bg: '#B8A038', text: '#fff', border: '#8B7A2A' },
  ghost: { bg: '#705898', text: '#fff', border: '#504070' },
  dragon: { bg: '#7038F8', text: '#fff', border: '#5628CC' },
  dark: { bg: '#705848', text: '#fff', border: '#504030' },
  steel: { bg: '#B8B8D0', text: '#000', border: '#8B8BA8' },
  fairy: { bg: '#EE99AC', text: '#000', border: '#C47A8E' },
};

export const getPokemonColor = (type: string) => {
  return typeColors[type.toLowerCase()] || typeColors.normal;
};
