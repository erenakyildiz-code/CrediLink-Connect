<template>
    <div class="connection-page" v-if="userLoggedIn">
        <div class="q-pa-md">
          <div class="text-center q-mb-lg">
            <q-icon name="link" size="64px" color="primary" />
            <h2 class="q-mt-md">Connection Page</h2>
            <p>Welcome to the connection popup page!</p>
          </div>
          <q-btn color="primary" label="Close" @click="sendPopupResponse" class="full-width" />
        </div>
    </div>
    <q-card style="min-width: 300px;" v-else>
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
        </q-card-actions>
    </q-card>
  </template>
  
  <script setup>
  //if logintime is less than 5 minutes, then show the connection page
  //else show the login page, then route to connection page
  import { onMounted, ref } from 'vue';
  import { useQuasar } from 'quasar';
  const $q = useQuasar();
  const password = ref('');
const isPwd = ref(true);

const userLoggedIn = ref(false);
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
                userLoggedIn.value = true;
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
        userLoggedIn.value = true;
    }
});
    });
  //defineOptions are already imported
defineOptions({
  name: 'ConnectionPage'
})

function closePopup() {
}
async function sendPopupResponse() {
    console.log("logger")
    await $q.bex.send('sendTestMessage');
}
</script>

  
  <style scoped>
  .connection-page {
    height: 100vh;
  }
  </style>
  