<template>
    <div  v-if="userLoggedIn">
        <div class="q-pa-md">
          <div class="text-center q-mb-lg">
            <q-icon name="find_in_page" size="64px" color="primary" />
            <h2 class="q-mt-md">Create a Proof Request</h2>
            <p> Create a proof request with the following attributes/predicates</p>
            <q-list> 
  <q-item class="q-ma-sm" v-for="attrib in proofReq.requested_attributes" :key="attrib.name" style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.1);">
    <q-item-section>
        
    <!-- Display the name field -->
    <!-- Display the Credential Definition Name -->
     
    <q-item-label>
        {{ attrib.name }}: {{ attrib.restrictions[0]['attr::' + attrib.name + '::value'] }}
    </q-item-label>
    <!-- Display the attr::nameOfField::value field -->
    
</q-item-section>
  </q-item>
</q-list>

<q-list>
  <q-item class="q-ma-sm" v-for="predicate in proofReq.requested_predicates" :key="predicate.name" style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.1);">
    <q-item-section>

   
    <!-- Display the name -->
    <q-item-label>{{ predicate.name }}  {{ predicate.p_type }} {{ predicate.p_value }}</q-item-label>
        
    
    <!-- Display the restriction (DigitalDiploma part) -->
</q-item-section>
  </q-item>
</q-list>
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
  import createProofRequest from '../Requests/ProofRequests/createProofRequest';
  const $q = useQuasar();
  const password = ref('');
  const proofReq = ref();
  const jobId = ref();
  const userId = ref();
  const isPwd = ref(true);
  const inviMsgId = ref();
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



onMounted(async ()=> {
    chrome.storage.local.get('openCreateProofRequest', function(result){
        var data = JSON.parse(result.openCreateProofRequest);
        //set jobId userId and proofReq
        jobId.value = data.jobId;
        userId.value = data.userId;
        proofReq.value = data.proofRequest;
        inviMsgId.value = data.inviMsgIdRequester;
        console.log(data);


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

async function sendPopupResponse(response) {
    if(response){
        //res is true, this means user wants to create proof request. generate the proof request.

       
        var res = await createProofRequest(proofReq.value,inviMsgId.value,userId.value,jobId.value);
        
        await $q.bex.send('sendCreateProofRequestResponse',response);
    }
    else {
        await $q.bex.send('sendCreateProofRequestResponse',response);
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
  </style>
  