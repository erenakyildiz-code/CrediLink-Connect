<template>
    <q-card style="min-width: 300px;">
        <q-card-section >
            <div class="text-h5">CrediLink Connect
            </div>
            <div class="text-body2">
                No keys found, please register a new wallet, or import an existing wallet.
            </div>
        </q-card-section>
        <q-space></q-space>
        <q-card-actions align="right">
                <q-btn
                label="Register"
                color="primary"
                @click="router.push('/newWallet')">
                </q-btn>
                <q-space></q-space>
                <q-btn label="Import wallet" color="primary" @click="router.push('/importWallet')"></q-btn>
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
