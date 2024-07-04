import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'
import CryptoTable from '../CryptoTable.vue'

const mockCryptos = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: '62852.3080691042464472',
    marketCapUsd: '1.17T',
    favorite: false,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: '2282.3080691042464472',
    marketCapUsd: '527B',
    favorite: true,
  },
];

// describe('CryptoTable', () => {
//   it('renders properly', () => {
//     const wrapper = mount(CryptoTable, { props: { msg: 'Hello Vitest' } })

//     wrapper.vm.cryptos = mockCryptos

//     console.log(wrapper.html());
    

//     expect(wrapper.text()).toContain('Hello Vitest')
//   })
// })
