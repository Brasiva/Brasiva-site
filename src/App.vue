<template>
  <NavBar />
  <router-view />
  <footer class="footer"><RouterLink to="/" class="brand">BRASIVA</RouterLink><span>Celebrar bem começa à mesa.</span><a href="https://wa.me/" aria-label="WhatsApp Brasiva">Fale com a gente ↗</a></footer>
</template>

<script setup>
import NavBar from './layouts/NavBar.vue';
import { RouterLink } from 'vue-router'
//import OfflineBanner from './components/OfflineBanner.vue';
</script>

<style>.footer{background:#41241d;color:#f7e8d7;padding:36px max(24px,calc((100vw - 1120px)/2));display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{font:700 1.1rem Georgia;letter-spacing:.16em;color:inherit;text-decoration:none}.footer span{color:#e2c7b5}.footer a:last-child{color:#f7e8d7;text-decoration:none;font-weight:700}@media(max-width:600px){.footer{flex-direction:column;align-items:flex-start}}</style>
