<template>
  <div class="p-d-flex p-jc-center p-ai-center p-mt-5">
    <div class="p-card" style="max-width: 600px">
      <div class="p-card-title">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text"
          @click.prevent="goBack"
        ></Button>
      </div>
      <div class="center">
        <div class="p-card-subtitle p-text-center">
          <vue-cryptocurrency-icons
            :name="crypto?.symbol"
            style="height: 60px; width: 60px"
          />
          <br />
          {{ crypto?.name }}
        </div>
        <div class="p-card-content">
          <ul class="p-list p-list-none">
            <li><strong>Rank:</strong> {{ crypto?.rank }}</li>
            <li>
              <strong>Price (USD):</strong>
              {{ formatCurrency(crypto?.priceUsd) }}
            </li>
            <li>
              <strong>Market Cap (USD):</strong>
              {{ formatCurrency(crypto?.marketCapUsd) }}
            </li>
            <li>
              <strong>Website:</strong>
              <a
                :href="crypto?.explorer"
                target="_blank"
                style="word-break: break-all"
                >{{ crypto?.explorer }}</a
              >
            </li>
          </ul>
        </div>
        <i
          :class="[
            'pi',
            favorites?.has(crypto?.id) ? 'pi-star-fill' : 'pi-star',
          ]"
          @click.prevent="
            toggleFavorite(crypto), (crypto.favorite = !crypto.favorite)
          "
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { formatCurrency } from "../utils/helper";
import { Crypto } from "../../types/Crypto";
import Button from "primevue/button";

const props = defineProps<{
  testData?: Crypto;
}>();

const crypto = ref<Crypto | null>(null);
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const favorites = ref(new Set<string>());

const fetchDetails = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;
    const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
    crypto.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const loadFavorites = () => {
  const savedFavorites = localStorage.getItem("favorites");

  if (savedFavorites) {
    favorites.value = new Set(JSON.parse(savedFavorites));
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

onMounted(() => {
  if (props?.testData?.length > 0) {
    crypto.value = props.testData;
  }
  fetchDetails();
  loadFavorites();
});
</script>

<style scoped>
.p-card-title {
  display: flex;
  align-items: center;
}
.p-card-subtitle {
  font-size: 1.25rem;
  color: gray;
}
.p-list-item-title {
  font-weight: bold;
}

.center {
  width: 100vw;
  display: flex;
  justify-content: center;
}

@media screen and (max-width: 600px) {
  .center {
    display: ruby;
  }
}
</style>
