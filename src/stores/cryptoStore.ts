import { defineStore } from "pinia";
import axios from "axios";
import { formatCurrency } from "../utils/helper";
import type { Crypto } from "../../types/crypto";
import { ref } from "vue";

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    cryptos: [] as Crypto[],
    favorites: new Set<string>(),
    loading: false,
    currentPage: 1,
    totalItems: 0,
    limit: 10,
    offsetLocal: 0,
    searchQuery: ref({}) as any,
    filteredCrypto: [] as Crypto[],
  }),
  getters: {
    pageCount: (state) => Math.ceil(state.totalItems / state.limit),
  },
  actions: {
    async fetchOneData(id?: string) {
      const cryptoId = this.searchQuery.id ? this.searchQuery.id : id;
      this.loading = true;
      try {
        const response = await axios.get(
          `https://api.coincap.io/v2/assets/${cryptoId}`
        );

        if (response.data.data.id) {
          let item = response.data.data;

          this.cryptos = [
            {
              id: item.id,
              symbol: item.symbol,
              name: item.name,
              priceUsd: formatCurrency(item.priceUsd),
              marketCapUsd: formatCurrency(item.marketCapUsd),
              favorite: this.favorites.has(item.id),
              rank: item.rank,
              explorer: item.explorer,
            },
          ];
        }
      } catch (error) {
        console.error(error);
        this.cryptos = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchData(command: boolean) {
      this.loading = true;
      try {
        const response = await axios.get(`https://api.coincap.io/v2/assets/`, {
          params: {
            limit: this.limit,
            offset: command ? (this.currentPage - 1) * 10 : this.offsetLocal,
          },
        });

        this.cryptos = response.data.data.map((item: any) => ({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          priceUsd: formatCurrency(item.priceUsd),
          marketCapUsd: formatCurrency(item.marketCapUsd),
          favorite: this.favorites.has(item.id),
        }));
      } catch (error) {
        console.error(error);
        this.cryptos = [];
      } finally {
        localStorage.setItem(
          "offset",
          JSON.stringify((this.currentPage - 1) * 10)
        );
        this.loading = false;
      }
    },

    async fetchFavoritesData() {
      this.loading = true;
      this.cryptos = [];
      try {
        for (const id of this.favorites) {
          const response = await axios.get(
            `https://api.coincap.io/v2/assets/${id}`
          );
          if (response.data.data.id) {
            let item = response.data.data;
            this.cryptos.push({
              id: item.id,
              symbol: item.symbol,
              name: item.name,
              priceUsd: formatCurrency(item.priceUsd),
              marketCapUsd: formatCurrency(item.marketCapUsd),
              favorite: this.favorites.has(item.id),
              rank: item.rank,
              explorer: item.explorer,
            });
          }
        }
      } catch (error) {
        console.error(error);
        this.cryptos = [];
      } finally {
        this.loading = false;
      }
    },

    toggleFavorite(item: Crypto) {
      if (this.favorites.has(item.id)) {
        this.favorites.delete(item.id);
      } else {
        this.favorites.add(item.id);
      }
      this.saveFavorites();
    },

    saveFavorites() {
      localStorage.setItem(
        "favorites",
        JSON.stringify(Array.from(this.favorites))
      );
    },

    loadLocalStorage() {
      const savedFavorites = localStorage.getItem("favorites");
      const offsetData = Number(localStorage.getItem("offset"));

      if (savedFavorites) {
        this.favorites = new Set(JSON.parse(savedFavorites));
      }

      if (offsetData) {
        this.offsetLocal = offsetData;
        this.currentPage = offsetData / 10 + 1;
      }
    },

    search(event: any) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.filteredCrypto = [];
        } else {
          this.filteredCrypto = this.cryptos.filter((crypto: any) => {
            return crypto.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },
  },
});
