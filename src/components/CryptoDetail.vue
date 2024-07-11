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
      <div class="center" v-if="!cryptoStore.loading">
        <div class="p-card-subtitle p-text-center">
          <vue-cryptocurrency-icons
            :name="cryptoStore.cryptos[0]?.symbol"
            style="height: 60px; width: 60px"
          />
          <br />
          {{ cryptoStore.cryptos[0]?.name }}
        </div>
        <div class="p-card-content">
          <ul class="p-list p-list-none">
            <li><strong>Rank:</strong> {{ cryptoStore.cryptos[0]?.rank }}</li>
            <li>
              <strong>Price (USD):</strong>
              {{ cryptoStore.cryptos[0]?.priceUsd }}
            </li>
            <li>
              <strong>Market Cap (USD):</strong>
              {{ cryptoStore.cryptos[0]?.marketCapUsd }}
            </li>
            <li>
              <strong>Website:</strong>
              <a
                :href="cryptoStore.cryptos[0]?.explorer"
                target="_blank"
                style="word-break: break-all"
                >{{ cryptoStore.cryptos[0]?.explorer }}</a
              >
            </li>
          </ul>
        </div>
        <i
          :class="[
            'pi',
            favorites?.has(cryptoStore.cryptos[0]?.id)
              ? 'pi-star-fill'
              : 'pi-star',
          ]"
          @click.prevent="
            cryptoStore.toggleFavorite(cryptoStore.cryptos[0]),
              (cryptoStore.cryptos[0].favorite =
                !cryptoStore.cryptos[0].favorite)
          "
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Crypto } from "../../types/Crypto";
import Button from "primevue/button";
import { useCryptoStore } from "../stores/cryptoStore";

const props = defineProps<{
  testData?: Crypto;
}>();

const cryptoStore = useCryptoStore();
const router = useRouter();
const route = useRoute();
const favorites = ref(new Set<string>());

const goBack = () => {
  router.back();
  cryptoStore.searchQuery = {};
};

onMounted(() => {
  if (props?.testData?.length > 0) {
    cryptoStore.cryptos.values = props.testData;
  }
  const id = route.params.id as string;
  cryptoStore.fetchOneData(id);
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
