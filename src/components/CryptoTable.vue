<template>
  <div class="p-d-flex p-jc-center p-ai-center">
    <div class="p-card"></div>
    <h1 class="p-text-center">Cryptocurrency Dashboard</h1>

    <div class="card flex justify-center" style="margin: 20px 0 20px 0">
      <AutoComplete
        placeholder="Search Crypto"
        v-model="cryptoStore.searchQuery"
        optionLabel="name"
        :suggestions="cryptoStore.filteredCrypto"
        @complete="cryptoStore.search"
        @option-select="cryptoStore.fetchOneData"
        v-on:keyup.enter="cryptoStore.fetchOneData"
        @clear="cryptoStore.fetchData(true)"
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
        v-if="cryptoStore.searchQuery"
        @click.prevent="(cryptoStore.searchQuery = ''), cryptoStore.fetchData(true)"
        style="margin-left: 10px"
      >Clear</Button>
    </div>
    <div class="">
      <DataTable
        :value="testData?.length > 1 ? testData : cryptoStore.cryptos"
        size="normal"
        :loading="cryptoStore.loading"
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
                cryptoStore.toggleFavorite(slotProps.data),
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
            :disabled="cryptoStore.currentPage === 1"
            @click.prevent="changePage(-1)"
          />
          <div class="currentPage">
            <span>{{ cryptoStore.currentPage }}</span>
          </div>
          <Button label="Next Page" @click.prevent="changePage(1)" />
        </div>
        <!-- <div class="autoRefreshToggle">
          <Button
            :label="autoRefresh ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'"
            @click.prevent="toggleAutoRefresh"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import 'primeicons/primeicons.css';
import { Crypto } from '../../types/crypto';
import iconGenericCrypto from './icons/IconCrypto.vue';
import { icons } from '@phantasweng/vue-cryptocurrency-icons';
import { useCryptoStore } from '../stores/cryptoStore';

defineProps<{
  testData?: [Crypto];
}>();

const cryptoStore = useCryptoStore();
const router = useRouter();
const autoRefresh = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

const iconExists = (symbol: string) => {
  try {
    const icon = icons.find((e: any) => e.symbol == symbol);
    return icon.symbol;
  } catch {
    return false;
  }
};

const goToDetails = (id: string) => {
  router.push(`details/${id}`);
};

const changePage = (val: number) => {
  cryptoStore.currentPage += val;
  (cryptoStore.searchQuery = ''), cryptoStore.fetchData(true);
};

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  if (autoRefresh.value) {
    intervalId = setInterval(() => cryptoStore.fetchData(false), 10000);
  } else if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  cryptoStore.loadLocalStorage();
  cryptoStore.fetchData(false);
  // fetch every 10 seconds if auto-refresh is enabled
  if (autoRefresh.value) {
    intervalId = setInterval(() => cryptoStore.fetchData(false), 10000);
  }
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
