<template>
    <q-card style="min-width: 400px;">
        <q-card-section >
            <div class="text-h5">CrediLink Connect
            </div>
            <div class="text-body2">
                Import an existing wallet by entering the mnemonic generated from the previous wallet.
            </div>
        </q-card-section>
        <q-card-section class="row full-width">
            <div class="col-4" :key="'MNEMONIC0'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[0]">
    <template v-slot:prepend>1</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC1'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[1]">
    <template v-slot:prepend>2</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC2'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[2]">
    <template v-slot:prepend>3</template>
  </q-input>
</div>
<div class="col-4" :key="'MNEMONIC3'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[3]">
    <template v-slot:prepend>4</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC4'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[4]">
    <template v-slot:prepend>5</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC5'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[5]">
    <template v-slot:prepend>6</template>
  </q-input>
</div>
<div class="col-4" :key="'MNEMONIC6'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[6]">
    <template v-slot:prepend>7</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC7'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[7]">
    <template v-slot:prepend>8</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC8'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[8]">
    <template v-slot:prepend>9</template>
  </q-input>
</div>
<div class="col-4" :key="'MNEMONIC9'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[9]">
    <template v-slot:prepend>10</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC10'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[10]">
    <template v-slot:prepend>11</template>
  </q-input>
</div>

<div class="col-4" :key="'MNEMONIC11'">
  <q-input dense filled class="q-ma-sm" v-model:model-value="mnemonic[11]">
    <template v-slot:prepend>12</template>
  </q-input>
</div>
            
        </q-card-section>
        <q-card-section  class="full-width">
            <div class="text-body2">
                For ease of use, set a secure password to enter your wallet.
            </div>
            <q-input 
                filled 
                dense 
                v-model="userPassord" 
                :type="isPwd ? 'password' : 'text'" 
                hint="Enter password"
            >
                <template v-slot:append>
                    <q-icon 
                        :name="isPwd ? 'visibility_off' : 'visibility'" 
                        class="cursor-pointer" 
                        @click="isPwd = !isPwd"
                    />
                </template>
            </q-input>
        </q-card-section>
        <q-card-actions align="right">
                <q-btn
                label="Import wallet"
                color="primary"
                @click="importWallet">
                </q-btn>
                
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {ref, onMounted} from 'vue';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import getExistingWalletsByName from './Requests/DIDgenerationRequests/GetExistingWalletFromWalletName';
import bs58 from 'bs58';
import { Buffer } from 'buffer';  // Import Buffer from the buffer package
import CryptoJS from 'crypto-js'; // Use crypto-js for hashing
import GetJWT from './Requests/DIDgenerationRequests/GetJWT';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const mnemonic = ref(["","","","","","","","","","","","",""]);

//user puts in the mnemonic, we store it in the local storage

const isPwd = ref(true);

const userPassord = ref('');

const router = useRouter();

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

const importWallet = async()=> {
    const mn = mnemonic.value.join(' ').trim();
    console.log(mn);
    //from imported wallet, check if it is in aca-py's wallets.
    //first we need 
    const seed = bip39.mnemonicToSeedSync(mn).slice(0,32);
    //from seed generate wallet name and key / just random parts of the seed
    var walletKey = seed.slice(0,32);
    var walletName = seed.slice(16,26);
    var walletName = getPublicWalletName(walletName.toString());
    const  res = await getExistingWalletsByName(walletName);
    //if there is no such wallet, res will be empty array.
    if(res.results.length === 0){
       $q.notify({message:"No such wallet exists in the aca-py wallets", color: 'red'});
    }
    else{
        //wallet exists, get wallets info from acapy. As much as possible.
        const wallet_id = res.results[0].wallet_id;
        const wallet_key = await generateBase58Key(walletKey);
        const jwt = await GetJWT({ wallet_key: wallet_key},wallet_id);
        console.log(jwt);
        console.log(jwt.token);
        //store wallet info in local storage
        chrome.storage.local.set({WalletInfo: {token: jwt.token, wallet_id: wallet_id}});
        chrome.storage.local.set({fixedMnemonic: mn});
        chrome.storage.local.set({password: userPassord.value});
        router.push('/home');
    }

    
}
</script>
