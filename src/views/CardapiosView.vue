<template>
  <main class="page"><span class="kicker">ESCOLHA SEUS FAVORITOS</span><h1>Nosso cardápio</h1><p class="lead">Explore as categorias e monte uma seleção para o seu evento.</p>
    <p v-if="erro" class="notice notice--error">{{ erro }} <button type="button" @click="carregarCategorias">Tentar novamente</button></p><div v-else-if="carregando" class="notice">Carregando cardápio...</div><div v-else-if="categorias.length" class="categories"><CategoriaCard v-for="categoria in categorias" :key="categoria.id" :categoria="categoria" /></div><div v-else class="notice"><b>Estamos preparando nosso cardápio.</b><br>Entre em contato com a Brasiva para montar sua proposta.</div>
    <div class="cart" v-if="pedido.itens.length"><b>{{ pedido.itens.length }} {{ pedido.itens.length === 1 ? 'opção' : 'opções' }}</b><span>{{ moeda(pedido.total) }}</span><RouterLink to="/pedido">Revisar pedido →</RouterLink></div>
  </main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CategoriaCard from '../components/CategoriaCard.vue'
import { cardapioApi } from '../services/api'
import { usePedidoStore } from '../stores/pedido'
const categorias = ref([]); const carregando = ref(true); const erro = ref(''); const pedido = usePedidoStore()
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
async function carregarCategorias() { carregando.value = true; erro.value = ''; try { const { data } = await cardapioApi.categorias(); categorias.value = data.results || data } catch { erro.value = 'Não conseguimos acessar o cardápio agora. Verifique a conexão e tente novamente.' } finally { carregando.value = false } }
onMounted(carregarCategorias)
</script>
<style scoped>
.page{max-width:1120px;margin:auto;padding:125px 24px 100px}.kicker{font-size:.72rem;letter-spacing:.15em;color:#a2533d;font-weight:800}.page h1{font:500 clamp(2.6rem,5vw,4.4rem) Georgia,serif;color:#41241d;margin:16px 0}.lead{color:#76645b;margin-bottom:38px}.categories{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.notice{padding:30px;background:#fff4df;border-radius:18px}.cart{position:fixed;z-index:4;bottom:20px;left:50%;transform:translateX(-50%);background:#fff;box-shadow:0 8px 35px #3c231b33;border-radius:50px;padding:14px 22px;display:flex;align-items:center;gap:18px;white-space:nowrap}.cart span{color:#8c3428;font-weight:800}.cart a{background:#8c3428;color:white;padding:10px 15px;border-radius:30px;text-decoration:none}@media(max-width:700px){.categories{grid-template-columns:1fr 1fr}}@media(max-width:440px){.categories{grid-template-columns:1fr}.cart{width:calc(100% - 24px);justify-content:space-between;gap:8px;padding:12px 15px}.cart a{font-size:.84rem}}
</style>
