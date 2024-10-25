<template>
    <div  v-if="userLoggedIn">
        <q-stepper
        style="height: 100vh;"
      v-model="step"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Preview credential"
        icon="badge"
        :done="step > 1"
      >
      <div class="q-pa-md">
          <div class="text-center">
            <p>Do you accept the following credential ?</p>
            <q-scroll-area style="height: 250px;">
                <q-input class="full-width q-ma-sm" disable rounded outlined v-for="attrib in attributes" :label="attrib.name" v-model:model-value="attrib.value" :key="attrib.name"></q-input>
            </q-scroll-area>
          </div>
        </div>

        <q-stepper-navigation>
            <q-btn-group class="full-width">
                
            <q-btn color="primary" label="Decline" @click="sendPopupResponse(false)" class="full-width" />
            <q-btn @click="step = 2" color="primary" label="Accept" class="full-width"  />
            </q-btn-group>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Choose DID that will hold the credential"
        icon="download"
        :done="step > 2"
      >
        Select a DID to hold this credential from the list below, or create a new one.
        <q-scroll-area style="height: 250px;">
            <q-item dense v-ripple class="q-my-sm"  style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.1);" v-for="did in userDIDs" :key="did.did" >
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
<q-btn-group class="full-width"  dense>
    
    <q-btn dense color="primary" label="Generate DID" @click="generateDid()" class="full-width"></q-btn>
          <q-btn dense :disable="!selectedDIDPair" @click="sendPopupResponse(true)" color="primary" label="Receive credential" class="full-width" ><q-tooltip v-if="!selectedDIDPair">Select a did/verkey pair</q-tooltip></q-btn>
</q-btn-group>
        <q-stepper-navigation>
          <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

    </q-stepper>
        
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
  import receiveCredential from '../Requests/CredentialIssuenceRequests/GetIssuedCredential';
  import getExistingDIDs from '../Requests/DIDgenerationRequests/GetExistingDIDs';
import generateNewDID from '../Requests/DIDgenerationRequests/GenerateNewDID';
  const $q = useQuasar();
  const password = ref('');
  const attributes = ref([]);
  const credential = ref();
  const userDIDs = ref([]);
  const selectedDIDPair = ref();
  const step = ref(1);
const isPwd = ref(true);
const userLoggedIn = ref(false);
const shorten = (text) => {
  if (!text) return '';
  return text.length > 10 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
};
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
    chrome.storage.local.get('credentialData', function(result){
        credential.value = JSON.parse(result.credentialData);
        console.log(credential.value);
        attributes.value = credential.value.cred_preview.attributes;

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
getDids();
    });
  //defineOptions are already imported
defineOptions({
  name: 'ConnectionPage'
})

async function sendPopupResponse(response) {
    if(response){
        var res = await receiveCredential(credential.value,selectedDIDPair.value);
        console.log(res);
        await $q.bex.send('sendCredentialResponse',response);
    }
    else {
        await $q.bex.send('sendCredentialResponse',response);
    }
    chrome.windows.getCurrent(function(windowInfo) {
            chrome.windows.remove(windowInfo.id);
        });
}
const getDids = async ()=> {
    var res = await getExistingDIDs();
    //only accept did:key dids
    //did:key dids start with did:key prefix.
    userDIDs.value = res.results.filter(did => did.did.startsWith('did:key'));
    //add true,false to each did pair to show as selected. all will be false at first.
    userDIDs.value.forEach(element => {
        element.selected = false;
    });
  
  }
  const generateDid = async ()=> {
    var res = await generateNewDID();
    getDids();
}
</script>

  
  <style scoped>
  .connection-page {
    height: 100vh;
  }
  </style>
  