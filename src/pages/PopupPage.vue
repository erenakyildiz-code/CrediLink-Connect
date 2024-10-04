<template>
      <q-card>
        <q-card-section class="column items-center">
            <q-spinner-gears size="xl"></q-spinner-gears>
        </q-card-section>
      </q-card>
  </template>
  
  <script setup>
  import {onMounted} from 'vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  const $q = useQuasar();
  const router = useRouter();
  //this is the welcome page of the popup.
  //the user will register from here if they have no key in local storage.
  //local storage MUST persist even after browser is closed, or even in cache clears.
 //the user will be sent to register page when button is clicked, and if user already has a key, he will be asked for their password.
 onMounted(()=> {
// Retrieving data
//if there is a key, route to login page, do this in index page.

chrome.storage.local.get('fixedMnemonic', function(result) {
    if(result.fixedMnemonic)
{
    router.push('/login');
}
else
{
    //route to register page
    router.push('/register');
}
});
 });
  </script>
  