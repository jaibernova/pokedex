import { LitElement } from 'lit-element';

export class PokemonEvolutionsDataManager extends LitElement {

  async fetchPokemonEvolutions(pokemonName) {
    try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const speciesData = await speciesResponse.json();

      const evolutionChainUrl = speciesData.evolution_chain.url;
      const chainResponse = await fetch(evolutionChainUrl);
      const chainData = await chainResponse.json();

      const evolutions = await this.parseEvolutionChain(chainData);
      return evolutions;
    } catch (error) {
      console.error('Error fetching evolutions:', error);
      throw error;
    }
  }

  async parseEvolutionChain(chainData) {
    const evolutions = [];

    let currentStep = chainData.chain;
    do {
      const pokemonId = await this.getPokemonId(currentStep.species.url);
      const pokemonData = await this.getPokemonData(pokemonId);
      const pokemon = {
        name: currentStep.species.name,
        image: pokemonData.sprites.front_default,
      };
      evolutions.push(pokemon);

      currentStep = currentStep.evolves_to.length > 0 ? currentStep.evolves_to[0] : null;
    } while (currentStep !== null);

    return evolutions;
  }

  async getPokemonId(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.id;
  }

  async getPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    return await response.json();
  }
}

customElements.define('pokemon-evolutions-data-manager', PokemonEvolutionsDataManager);