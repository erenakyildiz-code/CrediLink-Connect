<template>
    <q-card style="min-width: 400px;">
        <q-card>
            <q-card-section  v-if="walletInfoExists">
                <div class="text-h5">CrediLink Connect</div>
                <div class="text-body2">Credentials in your wallet</div>
                <q-expansion-item v-for="item in userCreds" :label=" getName(item.schema_id) " :caption="getVersion(item.schema_id)" :key="item">

                  <q-card>
          <q-card-section>
            <div class="text-h6">Attributes</div>
            <q-list>
              <q-scroll-area style="height: 250px;">
              <q-item v-for="(val,key) in item.attrs" :key="key">
                <q-item-section>
                  <q-item-label>{{ key }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ val }}</q-item-label>
                </q-item-section>
              </q-item>
                
              </q-scroll-area>
            </q-list>
          </q-card-section>
        </q-card>
                </q-expansion-item>

                </q-card-section>
                <q-card-section v-else>
                <div class="text-h5">CrediLink Connect
                </div>
                    <div class="text-body2">
                        Generating your wallet, please wait.
                    </div>
                </q-card-section>
        </q-card>
          <q-card-actions>
            <q-btn label="Exit wallet" @click="exitWallet" color="primary"></q-btn>
          </q-card-actions>
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
import { useRouter } from 'vue-router';
import getCredentials from './Requests/CredentialIssuenceRequests/GetCredentials';

const router = useRouter();
const exitWallet = ()=> {
    
    chrome.storage.local.remove('fixedMnemonic', function() {
      });
      chrome.storage.local.remove('password', function() {
      });
      chrome.storage.local.remove('mnemonic', function() {
      });
      chrome.storage.local.remove('WalletInfo', function() {
      });
      
      router.push('/popup');
}
const getName = (schemaID)=> {
    return schemaID.split(':')[2];
}
const getVersion = (schemaID)=> {
    return schemaID.split(':')[3];
}

const userCreds = ref([]);
const walletInfoExists = ref(false);

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
    chrome.storage.local.get('WalletInfo', async function(result) {
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
            });
        }
        else{
            walletInfoExists.value = true;
            //get users credentials if user has a wallet
            var res = await getCredentials();
            userCreds.value = res.results;
            console.log(res);
        }

    });


});

</script>
