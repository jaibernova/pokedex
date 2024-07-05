import { LitElement } from 'lit-element';

export class PokemonDataManager extends LitElement {
  static get properties() {
    return {
      pokemons: { type: Array },
    };
  }

  async fetchPokemons() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10'); 
      const data = await response.json();
      const pokemonPromises = data.results.map(async(pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return await pokemonResponse.json();
      });
      this.pokemons = await Promise.all(pokemonPromises);
      this.dispatchEvent(new CustomEvent('pokemons-loaded', {
        bubbles: true,
        composed: true,
        detail: {
          pokemons: this.pokemons
        }
      }));
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    }
  }

}

customElements.define('pokemon-data-manager', PokemonDataManager);