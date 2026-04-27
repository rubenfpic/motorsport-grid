import { RouterLinkStub, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FavoritesCard from './FavoritesCard.vue'

describe('FavoritesCard', () => {
  it('muestra estado de carga', () => {
    const wrapper = mount(FavoritesCard, {
      props: {
        isLoading: true,
        error: '',
        teamName: '',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
  })

  it('muestra el mensaje de error cuando existe', () => {
    const wrapper = mount(FavoritesCard, {
      props: {
        isLoading: false,
        error: 'Could not load favorite',
        teamName: '',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Could not load favorite')
    expect(wrapper.find('h4').exists()).toBe(false)
  })

  it('muestra equipo favorito y link al detalle cuando hay teamId', () => {
    const wrapper = mount(FavoritesCard, {
      props: {
        isLoading: false,
        error: '',
        teamId: 148152,
        teamName: 'ABT Sportsline',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const teamLink = wrapper.getComponent(RouterLinkStub)

    expect(wrapper.text()).toContain('Favorite team:')
    expect(wrapper.text()).toContain('ABT Sportsline')
    expect(teamLink.props('to')).toEqual({
      name: 'TeamDetails',
      params: { teamId: 148152 },
    })
  })

  it('muestra fallback sin favorito y link para explorar equipos', () => {
    const wrapper = mount(FavoritesCard, {
      props: {
        isLoading: false,
        error: '',
        teamName: '',
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const browseLink = wrapper.getComponent(RouterLinkStub)

    expect(wrapper.text()).toContain('No favorite selected')
    expect(wrapper.text()).toContain('Browse teams')
    expect(browseLink.props('to')).toEqual({ name: 'Teams' })
  })
})
