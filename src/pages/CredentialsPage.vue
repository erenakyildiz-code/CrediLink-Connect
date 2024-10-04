<template>
    <q-card style="min-width: 400px;">
        <q-card-section>
            <div class="row items-center align-center full-width">
                <div class="text-h5">CrediLink Connect
                </div>
                <q-space></q-space>
            <q-btn color="primary" @click="goBack" icon="arrow_back" dense flat round><q-tooltip>Go back</q-tooltip></q-btn>
            </div>
            <div class="text-body2" >Credentials for</div>
                <div class="text-body2">DID: {{ shorten(did) }}
                    <q-btn flat icon="content_copy" size="sm" @click="copyToClipboard(did)" /></div>
                <div class="text-body2">Verkey: {{ shorten(verkey) }}
                    <q-btn flat icon="content_copy" size="sm" @click="copyToClipboard(verkey)" /></div>

        </q-card-section>
        <q-card-section>
        </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const goBack = ()=> {
    router.back();
  }
  const shorten = (text) => {
  if (!text) return '';
  return text.length > 10 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
};
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      type: 'positive',
      message: 'Copied to clipboard!',
      timeout: 1000
    });
  }).catch(() => {
    $q.notify({
      type: 'negative',
      message: 'Failed to copy!',
      timeout: 1000
    });
  });
};
  // Define the props
  defineProps({
    did: {
      type: String,
      required: true
    },
    verkey: {
      type: String,
      required: true
    }
  });
  </script>
  