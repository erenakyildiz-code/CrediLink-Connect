<template>
  <div v-if="userLoggedIn">
    <q-card style="height: 100vh">
      <div class="text-center q-mb-lg">
        <q-icon name="fact_check" size="64px" color="primary" />
        <h2 class="q-mt-md">Proof requested</h2>
      </div>
      <q-card-section>
        <q-scroll-area style="height: 250px">
          <div class="text-body2">Exact values :</div>
          <q-list>
            <q-item v-for="attrib in attribMapper" :key="attrib.name">
              <q-item-section avatar>
                <q-icon color="green" name="check" v-if="attrib.fulfills"
                  ><q-tooltip
                    >Attribute value and expected value matches!</q-tooltip
                  ></q-icon
                >
                <q-icon color="negative" name="clear" v-else
                  ><q-tooltip
                    >No valid credential found with expected value</q-tooltip
                  ></q-icon
                >
              </q-item-section>
              <q-item-section>
                <q-item-label overline>{{
                  attrib.schemaName.split(":")[2]
                }}</q-item-label>
                <q-item-label>{{ attrib.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label
                  >{{ attrib.expectedValue
                  }}<q-tooltip>Expected value</q-tooltip></q-item-label
                >
                <q-item-label
                  >{{ attrib.value
                  }}<q-tooltip>Value in wallet</q-tooltip></q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
          <div class="text-body2">Predicated values :</div>
          <q-list>
            <q-item
              v-for="attrib in proofReq.by_format.pres_request.anoncreds
                .requested_predicates"
              :key="attrib.name"
            >
              <q-item-section>
                <q-item-label>{{ attrib.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>{{ attrib.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions>
        <q-btn-group class="full-width">
          <q-btn
            color="primary"
            label="Decline"
            @click="sendPopupResponse(false)"
            class="full-width"
          />
          <q-btn
            color="primary"
            label="Accept"
            @click="sendPopupResponse(true)"
            class="full-width"
          />
        </q-btn-group>
      </q-card-actions>
    </q-card>
  </div>
  <q-card style="min-width: 300px; height: 100vh" v-else>
    <q-card-section>
      <div class="text-h5">CrediLink Connect</div>
      <q-input
        class="q-mt-sm"
        dense
        v-model="password"
        filled
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
    <q-card-actions>
      <q-btn label="Login" color="primary" @click="login"> </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
//if logintime is less than 5 minutes, then show the connection page
//else show the login page, then route to connection page
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import generateProof from "../Requests/ProofRequests/generateProof";
import getCredentials from "../Requests/CredentialIssuenceRequests/GetCredentials";
const $q = useQuasar();
const password = ref("");
const attributes = ref([]);
const proofReq = ref();
const selectedDIDPair = ref();
const walletCredentials = ref();
const step = ref(1);
const isPwd = ref(true);
const attribMapper = ref([]);
const predicateMapper = ref([]);
const userLoggedIn = ref(false);
const login = () => {
  chrome.storage.local.get("password", function (result) {
    if (result.password === password.value) {
      let currentTime = Date.now(); // Current time in milliseconds
      chrome.storage.local.set({ lastLoginTime: currentTime }, function () {
        console.log("Last login time has been saved.");
      });
      chrome.storage.local.get("WalletInfo", function (result) {
        console.log(result);
        if (result.WalletInfo) {
          userLoggedIn.value = true;
        }
      });
    } else {
      $q.notify({
        type: "negative",
        message: "Incorrect password!",
        timeout: 1000,
      });
    }
  });
};
// Function to check if a result satisfies the restrictions
function checkAttribRestrictions() {
  // Initialize attribMapper as an array to store mapping results

  // Get the requested attributes from proofReq
  const requestedAttributes =
    proofReq.value.by_format.pres_request.anoncreds.requested_attributes;

  // Loop through the requested attributes
  for (const [attrReferent, attrInfo] of Object.entries(requestedAttributes)) {
    // attrReferent is the attribute key (e.g., 'ssn')
    // attrInfo contains 'name' and 'restrictions'

    // Get the attribute name (e.g., 'ssn')
    const attrName = attrInfo.name;

    // Get the restrictions array
    const restrictions = attrInfo.restrictions || [];

    // Loop through each restriction for this attribute
    for (const restriction of restrictions) {
      // Loop through the credentials
      for (const cred of walletCredentials.value.results) {
        // Check if the credential has the requested attribute
        if (cred.attrs && cred.attrs[attrName]) {
          let fulfills = true;

          // Check each key-value pair in the restriction
          for (const [key, expectedValue] of Object.entries(restriction)) {
            if (key.startsWith("attr::")) {
              // Key format is 'attr::attribute_name::value'
              const parts = key.split("::");
              const attributeInRestriction = parts[1]; // e.g., 'ssn'

              // Get the actual value from the credential
              const actualValue = cred.attrs[attributeInRestriction];

              if (actualValue !== expectedValue) {
                fulfills = false;
                break;
              }
            } else {
              // Other keys like 'cred_def_id', 'schema_id', etc.
              const actualValue = cred[key];
              if (actualValue !== expectedValue) {
                fulfills = false;
                break;
              }
            }
          }

          // Build the attribMapper object
          attribMapper.value.push({
            name: attrName,
            value: cred.attrs[attrName],
            expectedValue: restriction[`attr::${attrName}::value`],
            referent: cred.referent,
            schemaName: cred.schema_id,
            fulfills: fulfills,
          });
        }
      }
    }
  }

  // Return the mapping results
  return attribMapper;
}

onMounted(async () => {
  //first fetch all credentials from wallet.
  walletCredentials.value = await getCredentials();
  chrome.storage.local.get("proofData", function (result) {
    proofReq.value = JSON.parse(result.proofData);
    console.log(proofReq.value, walletCredentials.value);
    checkAttribRestrictions();
  });
  chrome.storage.local.get("lastLoginTime", function (result) {
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
  name: "ConnectionPage",
});

async function sendPopupResponse(response) {
  if (response) {
    //from walletCredentials, find the credential-ids from the proofReq's attributes and predicates fields,
    //accept the proof request
    let attributes = {};

    // Iterate over each item in the array and build the attributes object
    attribMapper.value.forEach((item) => {
      attributes[item.name] = {
        cred_id: item.referent,
        revealed: true,
      };
    });

    var res = await generateProof({
      attributes: attributes,
      predicates: {},
      selfAttested: {},
    });
    console.log(res);
    await $q.bex.send("sendProofResponse", response);
  } else {
    await $q.bex.send("sendProofResponse", response);
  }
  chrome.windows.getCurrent(function (windowInfo) {
    chrome.windows.remove(windowInfo.id);
  });
}
</script>

<style scoped>
.connection-page {
  height: 100vh;
}
</style>
