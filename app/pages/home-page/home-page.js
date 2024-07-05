import { CellsPage } from '@cells/cells-page';
import { html } from 'lit-element';
import '../ui/pokemon-detail.js';
import '../ui/pokemon-edit.js';
import '../ui/pokemon-list.js';
import { CellsI18nMixin as cellsI18nMixin } from '@cells-components/cells-i18n-mixin';
import styles from './home-page-styles.js';
import { PokemonDataManager } from '../dm/pokemon-data-manager.js';

class HomePage extends cellsI18nMixin(CellsPage) {
  static get is() {
    return 'home-page';
  }

  static get properties() {
    return {
      pokemons: { type: Array },
      selectedPokemon: { type: Object },
      showDetail: { type: Boolean },
      editMode: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.pokemons = [];
    this.selectedPokemon = null;
    this.showDetail = false;
    this.editMode = false;
    this.dataManager = new PokemonDataManager(); // Instancia de PokemonDataManager
  }

  connectedCallback() {
    super.connectedCallback();
    this.dataManager.addEventListener('pokemons-loaded', this.handlePokemonsLoaded.bind(this));
    this.dataManager.fetchPokemons(); // Llama al método para cargar los datos
  }

  handlePokemonsLoaded(event) {
    this.pokemons = event.detail.pokemons;
    this.requestUpdate();
  }

  handleSelect(e) {
    this.selectedPokemon = e.detail;
    this.showDetail = true;
  }

  showList() {
    this.showDetail = false;
    this.selectedPokemon = null;
  }

  editPokemon() {
    this.editMode = true;
  }

  closeEdit() {
    this.editMode = false;
  }

  render() {
    return html`
      ${this.editMode
    ? html`<pokemon-edit .pokemon="${this.selectedPokemon}" @close-edit="${this.closeEdit}"></pokemon-edit>`
    : this.showDetail
      ? html`<pokemon-detail .pokemon="${this.selectedPokemon}" @back="${this.showList}" @edit="${this.editPokemon}"></pokemon-detail>`
      : html`<pokemon-list .pokemons="${this.pokemons}" @select="${this.handleSelect}"></pokemon-list>`
}
    `;
  }

  static get styles() {
    return [ styles ];
  }
}

window.customElements.define(HomePage.is, HomePage);
