<template>
  <div class="p-d-flex p-jc-center p-ai-center">
    <div class="p-card"></div>
    <h1 class="p-text-center">Cryptocurrency Dashboard</h1>

    <div class="card flex justify-center" style="margin: 20px 0 20px 0">
      <AutoComplete
        placeholder="Search Crypto"
        v-model="searchQuery"
        optionLabel="name"
        :suggestions="filteredCrypto"
        @complete="search"
        @option-select="fetchData(true)"
        v-on:keyup.enter="fetchData(true)"
        @clear="fetchData(true)"
      >
        <template #option="slotProps">
          <div style="display: flex; align-items: center">
            <vue-cryptocurrency-icons
              :name="slotProps.option.symbol"
              style="height: 18px; width: 18px; margin-right: 8px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </AutoComplete>

      <Button
        v-if="searchQuery"
        @click.prevent="(searchQuery = ''), fetchData(true)"
        style="margin-left: 10px"
        >Clear</Button
      >
    </div>
    <div class="">
      <DataTable
        :value="testData?.length > 1 ? testData : cryptos"
        size="normal"
        :loading="loading"
        class="p-datatable-sm"
      >
        <template #empty> No crypto found. </template>
        <template #loading> Loading crypto data. Please wait. </template>
        <Column field="symbol" sortable header="Symbol">
          <template #body="slotProps">
            <vue-cryptocurrency-icons
              v-if="iconExists(slotProps.data.symbol)"
              type="png"
              :name="slotProps.data.symbol"
              style="height: 30px; width: 30px"
            />
            <iconGenericCrypto v-else />
            <!-- <div v-else>ini</div> -->
          </template>
        </Column>
        <Column field="name" sortable header="Name">
          <template #body="slotProps">
            <span
              @click.prevent="goToDetails(slotProps.data.id)"
              class="clickable"
            >
              {{ slotProps.data.name }}
            </span>
          </template>
        </Column>
        <Column field="priceUsd" header="Price (USD)"></Column>
        <Column field="marketCapUsd" header="Market Cap (USD)"></Column>
        <Column header="Favorite">
          <template #body="slotProps">
            <i
              :class="[
                'pi',
                slotProps.data.favorite ? 'pi-star-fill' : 'pi-star',
              ]"
              @click="
                toggleFavorite(slotProps.data),
                  (slotProps.data.favorite = !slotProps.data.favorite)
              "
            ></i>
          </template>
        </Column>
      </DataTable>

      <div class="footer">
        <div class="footerIn">
          <Button
            label="Prev Page"
            :disabled="currentPage === 1"
            @click.prevent="changePage(-1)"
          />
          <div class="currentPage">
            <span>{{ currentPage }}</span>
          </div>
          <Button label="Next Page" @click.prevent="changePage(1)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { formatCurrency } from "../utils/helper";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AutoComplete from "primevue/autocomplete";
import "primeicons/primeicons.css";
import { Crypto } from "../../types/crypto";
import iconGenericCrypto from "./icons/IconCrypto.vue";
import { icons } from "@phantasweng/vue-cryptocurrency-icons";
defineProps<{
  testData?: [Crypto];
}>();

const cryptos = ref<Crypto[]>([]);
const favorites = ref(new Set<string>());
const loading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const limit = 10;
const offsetLocal = ref(0);
const router = useRouter();
const searchQuery = ref();
const filteredCrypto = ref();

const iconExists = (symbol: string) => {
  try {
    const icon = icons.find((e: any) => e.symbol == symbol);
    return icon.symbol;
  } catch {
    return false;
  }
};
const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCrypto.value = icons;
    } else {
      filteredCrypto.value = icons.filter((crypto: any) => {
        return crypto.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};

const fetchData = async (command: boolean) => {
  loading.value = true;
  try {
    let response: any = {};

    if (searchQuery.value?.name || searchQuery.value) {
      let name = searchQuery.value?.name || searchQuery.value;
      name = name.replace(/\s+/g, "-").toLowerCase();
      response = await axios.get(`https://api.coincap.io/v2/assets/${name}`, {
        params: {
          limit,
          offset: command ? (currentPage.value - 1) * 10 : offsetLocal.value,
        },
      });
    } else {
      response = await axios.get(`https://api.coincap.io/v2/assets/`, {
        params: {
          limit,
          offset: command ? (currentPage.value - 1) * 10 : offsetLocal.value,
        },
      });
    }

    if (response.data.data.id) {
      let item = response.data.data;

      cryptos.value = [
        {
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          priceUsd: formatCurrency(item.priceUsd),
          marketCapUsd: formatCurrency(item.marketCapUsd),
          favorite: favorites.value.has(item.id),
        },
      ];
    } else {
      cryptos.value = response.data.data.map((item: any) => ({
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        priceUsd: formatCurrency(item.priceUsd),
        marketCapUsd: formatCurrency(item.marketCapUsd),
        favorite: favorites.value.has(item.id),
      }));
    }
  } catch (error) {
    console.error(error);
    cryptos.value = [];
  } finally {
    localStorage.setItem(
      "offset",
      JSON.stringify((currentPage.value - 1) * 10)
    );
    loading.value = false;
  }
};

const toggleFavorite = (item: Crypto) => {
  if (favorites.value.has(item.id)) {
    favorites.value.delete(item.id);
  } else {
    favorites.value.add(item.id);
  }
  saveFavorites();
};

const saveFavorites = () => {
  localStorage.setItem(
    "favorites",
    JSON.stringify(Array.from(favorites.value))
  );
};

const loadLocalStorage = () => {
  const savedFavorites = localStorage.getItem("favorites");
  const offsetData = Number(localStorage.getItem("offset"));

  if (savedFavorites) {
    favorites.value = new Set(JSON.parse(savedFavorites));
  }

  if (offsetData) {
    offsetLocal.value = offsetData;
    currentPage.value = offsetData / 10 + 1;
  }
};

const goToDetails = (id: string) => {
  router.push(`details/${id}`);
};

const changePage = (val: number) => {
  currentPage.value += val;
  (searchQuery.value = ""), fetchData(true);
};

onMounted(() => {
  loadLocalStorage();
  fetchData(false);
  // fetch every 10 seconds
  setInterval(fetchData, 10000); 
});
</script>

<style scoped>
.clickable {
  cursor: pointer;
  color: #42a5f5;
}

.footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.footerIn {
  width: 300px;
  display: flex;
  justify-content: space-between;
}

.currentPage {
  display: flex;
  align-items: center;
}
</style>
