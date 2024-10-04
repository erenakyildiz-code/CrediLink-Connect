<template>
    <q-card style="min-width: 400px;">
        <q-card-section >
            <div class="text-h5">CrediLink Connect
            </div>
            <div class="text-body2">
                Creating a new wallet, do not forget to write down your seed phrase.
            </div>
        </q-card-section>
        <q-card-section class="row full-width">
            <div  class="col-4" :key="'MNEMONIC'+index" v-for="(mnem,index) in mnemonic">

                <q-input dense filled class="q-ma-sm"  :model-value="mnem" readonly>
                <template v-slot:prepend>
                    {{ index + 1 }}
        </template>
            </q-input>
            </div>
            
        </q-card-section>
        <q-card-actions align="right">
            <q-btn label="Create" color="primary" @click="router.push('/checkMnemonic')"></q-btn>
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { onMounted,ref } from 'vue';
const mnemonic = ref([]);
// Generate x random words. Uses Cryptographically-Secure Random Number Generator.
onMounted(() => {
    const mn = bip39.generateMnemonic(wordlist);
    chrome.storage.local.set({mnemonic: mn});
    console.log(mn);
    mnemonic.value = mn.split(' ');
});

const router = useRouter();
</script>
