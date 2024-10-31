<template>
    <div  v-if="userLoggedIn">
        <q-card style="height: 100vh;">
            <div class="text-center q-mb-lg">
            <q-icon name="verified" size="64px" color="primary" />
            <h2 class="q-mt-md">Proof received</h2>
            <p>You can verify the proof by clicking the button below.</p>
          </div>
          <q-btn class="full-width gradient-background" style="" label="Verify" @click="sendPopupResponse()" />
          </q-card>
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
import verifyProof from '../Requests/ProofRequests/verifyProof';
import JSConfetti from 'js-confetti';
const jsConfetti = new JSConfetti()
  const $q = useQuasar();
  const password = ref('');
const isPwd = ref(true);
const userLoggedIn = ref(false);
const inviMsgId = ref();
const jobId = ref();
const userId = ref();

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



onMounted(async ()=> {
    //first fetch all credentials from wallet.
    chrome.storage.local.get('verificationData', function(result){
        var data = JSON.parse(result.verificationData);
        inviMsgId.value = data.inviMsgIdRequester;
        jobId.value = data.jobId;
        userId.value = data.userId;
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

async function sendPopupResponse() {
    //using inviMsgId
    var response = await verifyProof(inviMsgId.value);
    console.log(response);
    if(response.verified){
        $q.notify({
            type: 'positive',
            message: 'Proof verified!',
            timeout: 1000
          });
          jsConfetti.addConfetti({
   emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
})
//wait for 2 second so that the users can see the confetti
await new Promise(r => setTimeout(r, 2000));
await $q.bex.send('sendProofVerificationResponse',response.verified);
    }
    else{
        $q.notify({
            type: 'negative',
            message: 'Proof not verified!',
            timeout: 1000
          });
          await $q.bex.send('sendProofVerificationResponse',response.verified);
    }
    chrome.windows.getCurrent(function(windowInfo) {
            chrome.windows.remove(windowInfo.id);
        });
}

</script>

  
  <style scoped>
  .connection-page {
    height: 100vh;
  }
  .gradient-background {
  background: linear-gradient(123deg,#db7a0e,#152bc7,#d16691);
  background-size: 180% 180%;
  animation: gradient-animation 3s ease infinite;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
  </style>
  