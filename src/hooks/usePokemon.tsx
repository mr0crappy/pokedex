import { useState, useEffect } from 'react';

export interface Pokemon {
  name: string;
  id: number;
  type: string;
}

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20; // Load 20 pokemon at a time

  const loadPokemon = async (currentOffset: number) => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      const pokemonWithTypes = await Promise.all(
        data.results.map(async (p: any) => {
          try {
            const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
            const pokeData = await pokeResponse.json();
            const primaryType = pokeData.types?.[0]?.type?.name || 'normal';
            return {
              name: p.name,
              id: pokeData.id,
              type: primaryType,
            };
          } catch (err) {
            console.error(`Failed to fetch ${p.name}:`, err);
            return {
              name: p.name,
              id: 1,
              type: 'normal',
            };
          }
        })
      );

      setPokemon((prevPokemon) => [...prevPokemon, ...pokemonWithTypes]);

      setHasMore(data.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon(0);
  }, []);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    loadPokemon(newOffset);
  };

  return { pokemon, loading, error, hasMore, loadMore };
};
