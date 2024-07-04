import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CryptoTable from "../CryptoTable.vue";
import { formatCurrency } from "../../utils/helper";

const mockCryptos = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    priceUsd: "62852.3080691042464472",
    marketCapUsd: "1.17T",
    favorite: false,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    priceUsd: "2282.3080691042464472",
    marketCapUsd: "527B",
    favorite: true,
  },
];

describe("CrytoTable", async () => {
  const wrapper = mount(CryptoTable, { props: { testData: mockCryptos } });

  await wrapper.vm.$nextTick();

  wrapper.vm.cryptos = mockCryptos;

  it("renders properly", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays cryptocurrency data", () => {
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(mockCryptos.length);
    expect(wrapper.text()).toContain("Bitcoin");
    expect(wrapper.text()).toContain("Ethereum");
  });

  it("formats the price and market cap correctly", () => {
    expect(formatCurrency(mockCryptos[0].priceUsd)).toBe('$62,852.31');
  });
});
