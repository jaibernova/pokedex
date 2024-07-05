import { LitElement, html, css } from 'lit';
import { PokemonEvolutionsDataManager } from '../dm/pokemon-evolutions-data-manager.js';


class PokemonDetail extends LitElement {
  static properties = {
    pokemon: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #333;
    }

    .pokemon-details {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .pokemon-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-right: 24px;
    }

    .pokemon-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .pokemon-type {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .evolutions {
      margin-top: 24px;
    }

    .evolution {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .evolution img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 16px;
    }

    .evolution-name {
      font-size: 16px;
      font-weight: bold;
    }

    .buttons {
      margin-top: 16px;
    }

    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  constructor() {
    super();
    this.dataManager = new PokemonEvolutionsDataManager();
    this.evolutions = [];
  }

  async updated(changedProperties) {
    if (changedProperties.has('pokemon') && this.pokemon) {
      await this.loadEvolutions();
    }
  }

  async loadEvolutions() {
    try {
      if (!this.pokemon || !this.pokemon.name) {
        return;
      }


      const evolutions = await this.dataManager.fetchPokemonEvolutions(this.pokemon.name);

      // Actualizar estado del componente
      this.evolutions = evolutions;
      this.requestUpdate();
    } catch (error) {
      console.error('Error loading evolutions:', error);
    }
  }

  render() {
    if (!this.pokemon) {
      return html`<p>Cargando...</p>`;
    }

    return html`
      <div class="pokemon-details">
        <img class="pokemon-img" src="${this.pokemon.sprites.front_default}" alt="${this.pokemon.name}">
        <div>
          <h1>${this.pokemon.name}</h1>
          <p class="pokemon-type">Type: ${this.pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        </div>
      </div>

      <div class="buttons">
        <button @click="${this.back}">Volver</button>
        <button @click="${this.edit}">Editar</button>
      </div>

      <h2>Evoluciones</h2>
      <div class="evolutions">
        ${this.evolutions ? this.renderEvolutions(this.evolutions) : html`<p>No evolutions found.</p>`}
      </div>
    `;
  }

  renderEvolutions(evolutions) {
    return html`
      ${evolutions.map(evolution => html`
        <div class="evolution">
          <img src="${evolution.image}" alt="${evolution.name}">
          <p class="evolution-name">${evolution.name}</p>
        </div>
      `)}
    `;
  }

  back() {
    this.dispatchEvent(new CustomEvent('back'));
  }

  edit() {
    this.dispatchEvent(new CustomEvent('edit'));
  }
}

customElements.define('pokemon-detail', PokemonDetail);