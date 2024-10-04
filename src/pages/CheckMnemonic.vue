<template>
    <q-card style="min-width: 400px;">
        <q-card-section>
            <div class="text-h5">CrediLink Connect</div>
            <div class="text-body2">
                Please confirm seed phrase by writing 3 of them by shown indexes below.
            </div>
        </q-card-section>
        <q-card-section class="row full-width">
            <!-- Loop through random indices -->
            <div class="col-4" v-for="index in randomIntegerArrayStatic" :key="index">
                <q-input 
                    dense 
                    filled 
                    class="q-ma-sm" 
                    v-model="checker[index]"
                >
                    <template v-slot:prepend>
                        {{ index }}
                    </template>
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
            <q-btn label="Finalise" color="primary" :disable="isDisabled" @click="success"></q-btn>
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const isPwd = ref(true);
const mnemonic = ref([]); // Full 12-word mnemonic
const checker = ref({}); // User's input for specific indices
const userPassord =  ref(''); // User's password
// Function to generate 3 unique random integers, sorted in ascending order
const getUniqueSortedRandomIntegers = (min, max, length) => {
  const set = new Set();
  while (set.size < length) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(set).sort((a, b) => a - b);
};

const randomIntegerArrayStatic = getUniqueSortedRandomIntegers(1, 12, 3); // Generate random indices between 1 and 12

const isDisabled = computed(() => {
  // Loop through the 3 random indices and check if the user's input matches the actual mnemonic values
  return randomIntegerArrayStatic.some(index => checker.value[index] !== mnemonic.value[index - 1]);
});

onMounted(() => {
  // Simulate getting the mnemonic from storage
  chrome.storage.local.get('mnemonic', (result) => {
    mnemonic.value = result.mnemonic.split(' '); // Assuming mnemonic is a string of words
  });
});

const router = useRouter();

const success = ()=> {
    chrome.storage.local.get('mnemonic', (result) => {
        chrome.storage.local.set({fixedMnemonic: result.mnemonic}); // Assign fixedMnemonic
  });
    chrome.storage.local.set({password: userPassord.value});
    // Redirect to home page
    router.push('/home');
}
</script>
