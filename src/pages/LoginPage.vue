<template>
    <q-card style="min-width: 300px;">
        <q-card-section >
            <div class="text-h5">CrediLink Connect
            </div>
            <q-input class="q-mt-sm" dense v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Enter password">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
        
        </q-card-section>
        <q-card-actions>
            <q-btn
            label="Login"
            color="primary"
            @click="login">
            </q-btn>
            <q-space></q-space>
            <q-btn label="Exit current wallet" color="primary" @click="exitWallet"></q-btn>
        </q-card-actions>
    </q-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const password = ref('');
const isPwd = ref(true);

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
const login = ()=> {
    chrome.storage.local.get('password', function(result) {
        if(result.password === password.value){
          let currentTime = Date.now(); // Current time in milliseconds
          chrome.storage.local.set({ 'lastLoginTime': currentTime }, function() {
                console.log('Last login time has been saved.');
            });
          chrome.storage.local.get('WalletInfo', function(result) {
            console.log(result);
            if(result.WalletInfo){
                router.push('/home');
            }
            else{
                router.push('/register');
            }
          });
        }
        else{
            $q.notify({
                type: 'negative',
                message: 'Incorrect password!',
                timeout: 1000
              });
        }
    })
}
onMounted(()=> {
  chrome.storage.local.get('lastLoginTime', function(result) {
    let lastLoginTime = result.lastLoginTime || 0;
    let currentTime = Date.now();
    let timeDifference = currentTime - lastLoginTime;

    // Define 5 minutes in milliseconds
    let fiveMinutes = 5 * 60 * 1000;

    if (timeDifference <= fiveMinutes) {
        // User has logged in within the last 5 minutes
        chrome.storage.local.get('WalletInfo', function(result) {
            console.log(result);
            if(result.WalletInfo){
                router.push('/home');
            }
            else{
                router.push('/register');
            }
          });
    } else {
        // Prompt the user for their password
    }
});
});
</script>
