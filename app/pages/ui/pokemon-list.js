import { LitElement, html, css } from 'lit';


class PokemonList extends LitElement {
  static properties = {
    pokemons: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .header img {
      max-width: 100%;
      height: auto;
    }

    .pokemon-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .pokemon {
      cursor: pointer;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease-in-out;
    }

    .pokemon:hover {
      transform: translateY(-5px);
    }

    .pokemon img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-right: 16px;
    }

    .pokemon-details {
      flex: 1;
    }

    .pokemon-name {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .pokemon-type {
      font-size: 14px;
      color: #666;
    }
  `;

  render() {
    return html`
      <div class="header">
       <img src="../../app/resources/pokemon-logo.png" alt="Pokedex">  
      </div>
      <div class="pokemon-list">
        ${this.pokemons.map(pokemon => html`
          <div class="pokemon" @click="${() => this.selectPokemon(pokemon)}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div class="pokemon-details">
              <p class="pokemon-name">${pokemon.name}</p>
              <p class="pokemon-type">Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  selectPokemon(pokemon) {
    this.dispatchEvent(new CustomEvent('select', { detail: pokemon }));
  }
}

customElements.define('pokemon-list', PokemonList);
