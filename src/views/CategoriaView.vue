<template>
  <main class="page"><RouterLink class="back" to="/cardapios">← Todas as categorias</RouterLink><span class="kicker">CARDÁPIO BRASIVA</span><h1>{{ categoria?.nome || 'Opções do cardápio' }}</h1><p class="lead">Escolha as opções para o seu evento. Quantidades e valores serão confirmados pela nossa equipe.</p><p v-if="erro" class="notice">{{ erro }}</p><p v-else-if="carregando" class="notice">Carregando opções...</p><div v-else-if="produtos.length" class="products"><ProdutoCard v-for="produto in produtos" :key="produto.id" :produto="produto" /></div><p v-else class="notice">Ainda não há opções disponíveis nesta categoria.</p><RouterLink v-if="pedido.itens.length" class="review" to="/pedido">Revisar pedido · {{ moeda(pedido.total) }} →</RouterLink></main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import ProdutoCard from '../components/ProdutoCard.vue'
import { cardapioApi } from '../services/api'
import { usePedidoStore } from '../stores/pedido'
const route = useRoute(); const categoria = ref(null); const produtos = ref([]); const erro = ref(''); const carregando = ref(true); const pedido = usePedidoStore()
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
onMounted(async () => { try { const [categoriasResponse, pratosResponse] = await Promise.all([cardapioApi.categorias(), cardapioApi.pratos(route.params.id)]); const categorias = categoriasResponse.data.results || categoriasResponse.data; categoria.value = categorias.find((item) => String(item.id) === String(route.params.id)); produtos.value = pratosResponse.data.results || pratosResponse.data } catch { erro.value = 'Não foi possível carregar as opções. Tente novamente.' } finally { carregando.value = false } })
</script>
<style scoped>
.page{max-width:900px;margin:auto;padding:125px 24px 110px}.back{display:block;color:#8c3428;text-decoration:none;font-weight:700;margin-bottom:35px}.kicker{font-size:.72rem;letter-spacing:.15em;color:#a2533d;font-weight:800}.page h1{font:500 clamp(2.5rem,5vw,4rem) Georgia,serif;color:#41241d;margin:15px 0}.lead{color:#76645b;line-height:1.7;margin-bottom:30px}.products{display:grid;gap:12px}.notice{padding:26px;background:#fff4df;border-radius:16px;color:#63473c}.review{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);border-radius:40px;background:#8c3428;color:#fff;padding:15px 24px;text-decoration:none;font-weight:700;white-space:nowrap}
</style>
