

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  
  { path: '/popup', component: () => import('pages/PopupPage.vue') },
  {path: '/login', component: () => import('pages/LoginPage.vue')},
  {path : '/register', component: () => import('pages/RegisterPage.vue')},
  {path: '/importWallet', component: () => import('pages/ImportWallet.vue')},
  {path: '/newWallet', component: () => import('pages/NewWallet.vue')},
  {path: '/checkMnemonic', component: () => import('pages/CheckMnemonic.vue')},
  {path: '/home', component: () => import('pages/HomePage.vue')},
  {
    path: '/connection-popup',
    component: () => import('pages/ConnectionPopup/ConnectionPage.vue')
  },
  {
    path: '/credential-popup',
    component: () => import('pages/CredentialPopup/CredentialPopup.vue')
  },
  {
    path: '/proof-popup',
    component: () => import('pages/ProofPopup/ProofPopup.vue')
  },
  {path: '/connection-create',
    component: ()=> import('pages/ConnectionPopup/ConnectionInitiationPage.vue')
  },
  {path: '/connection-receive-fully-out-of-band',
    component: ()=> import('pages/ConnectionPopup/ConnectionPageFullyOutOfBand.vue')
  },

  {
    path: '/create-proof-request-OOB',
    component: ()=> import('pages/ProofPopup/CreateProofRequestFullyOutOfBand.vue')
  },
  {
    path: '/receive-proof-request-OOB',
    component: ()=> import('pages/ProofPopup/ProofPresentationFullyOutOfBand.vue')
  },
  {
    path: '/verify-proof-request-OOB',
    component: ()=> import('pages/ProofPopup/VerifyProof.vue')
  },
  {
    path: '/did/:did/verkey/:verkey',  // dynamic route with did and verkey as parameters
    component: () => import('pages/CredentialsPage.vue'),
    props: true // pass route params as props to the component
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
]

export default routes
