import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CryptoDetail from "../CryptoDetail.vue";
import { formatCurrency } from "../../utils/helper";

const mockCrypto = {
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  priceUsd: '62852.3080691042464472',
  marketCapUsd: '1.17T',
  rank: 1,
  explorer: 'https://www.bitcoin.com'
};

describe("CrytoDetail", async () => {
  const wrapper = mount(CryptoDetail, { props: { testData: mockCrypto } });

  await wrapper.vm.$nextTick();

  wrapper.vm.crypto = mockCrypto;
  console.log(wrapper.html());

  it("renders properly", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays cryptocurrency data", () => {
    expect(wrapper.html()).toContain(mockCrypto.name);
    expect(wrapper.html()).toContain('Rank:');
    expect(wrapper.html()).toContain('Price (USD):');
    expect(wrapper.html()).toContain('Market Cap (USD):');
    expect(wrapper.html()).toContain('Website:');
    expect(wrapper.html()).toContain(mockCrypto.explorer);

    // const price = wrapper.find('Price (USD)').text();
    // const marketCap = wrapper.find('li:contains("Market Cap (USD):")').text();

    // expect(price).toContain('$62,852.31'); // Adjust based on your formatCurrency function
    // expect(marketCap).toContain('$1.17T');
  });

  // it("formats the price and market cap correctly", () => {
  //   expect(formatCurrency(mockCryptos[0].priceUsd)).toBe('$62,852.31');
  // });
});
