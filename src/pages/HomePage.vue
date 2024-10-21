<template>
    <q-card style="min-width: 400px;">
        <q-card>
            <q-card-section  v-if="walletInfoExists">
                <div class="text-h5">CrediLink Connect
                </div>
                <div class="text-caption" v-if="selectedDIDPair == ''">You have not selected any DID/verkey pair as primary DID/verkey pair.</div>
                <div class="text-caption" v-else>You have a selected DID/Verkey pair.</div>
                    <q-scroll-area style="height: 300px;" class="q-my-sm">
                        <q-item dense clickable v-ripple class="q-my-sm"  style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.1);" v-for="did in userDIDs" :key="did.did" @click="routeToCredentials(did.did,did.verkey)">
                            <q-item-section side>
                              <q-radio dense v-model="selectedDIDPair" :val="did.did" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"/>
                            </q-item-section>
                            <q-item-section>
                            <!-- Shortened DID -->
                            <q-item-label>DID: {{ shorten(did.did) }}
                                
                            </q-item-label>
                            <!-- Shortened Verkey with copy button -->
                            <q-item-label caption>
                                Verkey: {{ shorten(did.verkey) }}
                            </q-item-label>
                            </q-item-section>

                            <q-item-section side top>
                            <!-- Icon logic -->
                            <q-icon class="q-mt-sm" size="1.3em" :color="did.posture == 'wallet_only' ? did.posture == 'posted' ? 'green' : 'red' : 'black'" :name="did.posture == 'wallet_only' ? did.posture == 'posted' ? 'public' : 'public_off' : 'unknown_document'">
                                <q-tooltip style="font-size: xx-small;"> {{ did.posture == 'wallet_only' ? did.posture == 'posted' ? 'Published' : 'Wallet only' : 'Unknown' }} </q-tooltip>

                            </q-icon>
                            
                        </q-item-section>
                            
                        </q-item>
                    </q-scroll-area>
                    
                    <q-btn label="Generate New DID" color="primary" @click="generateNewDid"></q-btn>
                </q-card-section>
                <q-card-section v-else>
                <div class="text-h5">CrediLink Connect
                </div>
                    <div class="text-body2">
                        Generating your wallet, please wait.
                    </div>
                </q-card-section>
        </q-card>
    </q-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { useQuasar } from 'quasar';
import * as bip39 from '@scure/bip39';
import generateNewWallet from './Requests/DIDgenerationRequests/GenerateNewWallet';
import bs58 from 'bs58';
import { Buffer } from 'buffer';  // Import Buffer from the buffer package
import CryptoJS from 'crypto-js'; // Use crypto-js for hashing
import generateNewDID from './Requests/DIDgenerationRequests/GenerateNewDID';
import getExistingDIDs from './Requests/DIDgenerationRequests/GetExistingDIDs';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedDIDPair = ref('');
const userDIDs = ref([]);
const walletInfoExists = ref(false);

const routeToCredentials = (did,verkey) => {
    router.push({
    path: `/did/${did}/verkey/${verkey}`
  });
}

const shorten = (text) => {
  if (!text) return '';
  return text.length > 10 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
};

// Method to copy text to clipboard
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

const generateNewDid = async ()=> {
    var res = await generateNewDID();
    getDids();
}
const getDids = async ()=> {
    var res = await getExistingDIDs();
    userDIDs.value = res.results;
    //add true,false to each did pair to show as selected. all will be false at first.
    userDIDs.value.forEach(element => {
        element.selected = false;
    });
  
  }
// Function to generate a public wallet name from the wallet key
function getPublicWalletName(walletKey) {
  // Create a SHA-256 hash of the walletKey using crypto-js
  const hash = CryptoJS.SHA256(walletKey).toString(CryptoJS.enc.Hex);
  
  // Return a truncated version (e.g., first 12 characters) to use as wallet name
  return `wallet-${hash.slice(0, 12)}`; // Prefix with 'wallet-' to make it identifiable
}
// Function to generate a Base58-encoded key from 32-byte raw data
const generateBase58Key = async (walletKey) => {
  // Ensure the walletKey is exactly 32 characters long
  if (walletKey.length !== 32) {
    throw new Error('walletKey must be exactly 32 characters long');
  }

  // Convert the walletKey string into a byte array (use 'latin1' or 'hex' if it's meant to be raw bytes)
  const keyBytes = Buffer.from(walletKey, 'latin1'); // 'latin1' treats it as raw bytes

  // Encode the key using Base58
  const base58Key = bs58.encode(keyBytes);

  return base58Key.toString(); // Return the Base58-encoded key
};

onMounted(()=> {
    //if user has no DID set up generate one for them.
    chrome.storage.local.get('WalletInfo', function(result) {
        if(result.WalletInfo === undefined){
            //generate a new seed for DID creation using the mnemonic, the seed must be 32 chars long.
            chrome.storage.local.get('fixedMnemonic',async function(result) {
                const mnemonic = result.fixedMnemonic;
                const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0,32);
                //from seed generate wallet name and key / just random parts of the seed
                var walletKey = seed.slice(0,32);
                var walletName = seed.slice(16,26);
                var walletName = getPublicWalletName(walletName.toString());
                const base58Key = await generateBase58Key(walletKey);
                const res = await generateNewWallet({
                            "key_management_mode": "managed",
                            "label": walletName,
                            "wallet_dispatch_type": "default",
                            "wallet_key": base58Key,
                            "wallet_key_derivation": "RAW",
                            "wallet_name": walletName,
                            "wallet_type": "askar-anoncreds"});
                //generated seed will be used in a request to Aca-py
                var wallet_id = res.wallet_id;
                var token = res.token;
                chrome.storage.local.set({WalletInfo: {token: token, wallet_id: wallet_id}});
                walletInfoExists.value = true;
                getDids();
            });
        }
        else{
            walletInfoExists.value = true;
            getDids();
        }

    });
});

</script>
