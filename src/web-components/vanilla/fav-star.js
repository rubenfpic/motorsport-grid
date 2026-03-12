class FavStar extends HTMLElement {
  constructor() {
    // Inicializa la base del custom element.
    //
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    // Define estilos encapsulados dentro del Shadow DOM.
    //
    const style = document.createElement('style')
    style.textContent = `
      button {
        all: unset;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `

    // Crea los nodos interactivos y listeners del componente.
    //
    this.button = document.createElement('button')
    this.button.textContent = '★'
    this.button.addEventListener('click', () => {
      this.toggleAttribute('active')
      const active = this.hasAttribute('active')
      this.dispatchEvent(
        new CustomEvent('toggle', {
          detail: { active },
        }),
      )
    })

    // Inserta estilos y nodos en el árbol del Shadow DOM.
    //
    shadow.append(style, this.button)
  }

  // Renderiza la UI a partir del estado/atributos actuales.
  //
  render() {
    const active = this.hasAttribute('active')
    // itemName puede venir o no venir
    const itemName = this.getAttribute('item-name')?.trim() ?? ''
    this.button.textContent = active ? '★' : '☆'
    const actionLabel = itemName
      ? active
        ? `Remove ${itemName} from favorites`
        : `Mark ${itemName} as favorite`
      : active
        ? 'Remove from favorites'
        : 'Mark as favorite'
    this.button.setAttribute('aria-label', actionLabel)
    this.button.setAttribute('title', actionLabel)
    this.button.setAttribute('aria-pressed', String(active))
  }

  // Ejecuta lógica al montar el componente en el DOM.
  //
  connectedCallback() {
    this.render()
  }

  // Declara los atributos observables para cambios reactivos.
  //
  static get observedAttributes() {
    return ['active', 'item-name']
  }

  // Sincroniza la vista cuando cambian atributos observados.
  //
  attributeChangedCallback() {
    this.render()
  }
}

// Registra el tag una única vez en el navegador.
//
customElements.define('fav-star', FavStar)
export { FavStar }
