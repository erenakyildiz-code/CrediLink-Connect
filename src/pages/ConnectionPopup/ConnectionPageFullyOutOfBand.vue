<template>
    <div class="connection-page" v-if="userLoggedIn">
        <div class="q-pa-md">
          <div class="text-center q-mb-lg">
            <q-icon name="link" size="64px" color="primary" />
            <h2 class="q-mt-md">Connection Request</h2>
            <p>{{ receivedHost }} wants to connect to your wallet, do you accept ?</p>
          </div>
          <q-btn-group class="full-width">
            <q-btn color="primary" label="Decline" @click="sendPopupResponse(false)" class="full-width" />
            <q-btn color="primary" label="Accept" @click="sendPopupResponse(true)" class="full-width" />
          </q-btn-group>
        </div>
    </div>
    <q-card style="min-width: 300px; height: 100vh;" v-else>
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
  import receiveConnection from '../Requests/ConnectionRequests/ReceiveConnectionFullyOutOfBand';
  const $q = useQuasar();
  const password = ref('');
const isPwd = ref(true);
const receivedInviteData = ref({});
const receivedHost = ref('');
const userId = ref('');
const jobId = ref('');
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
    chrome.storage.local.get('connectionData', function(result){
        console.log(result);
        var x = JSON.parse(result.connectionData);
        receivedInviteData.value = x.invitation;
        receivedHost.value = x.companyName;
        jobId.value = x.jobId;
        userId.value = x.userId;

    });
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
async function sendPopupResponse(response) {
    if(response){

        var res = await receiveConnection(receivedInviteData.value,userId.value,jobId.value);
        console.log(res);
        await $q.bex.send('sendConnectionResponse',response);
    }
    else {
        await $q.bex.send('sendConnectionResponse',response);
    }
}
</script>

  
  <style scoped>
  .connection-page {
    height: 100vh;
  }
  </style>
  