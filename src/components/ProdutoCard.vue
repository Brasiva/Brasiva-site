<template>
  <article class="product-card">
    <div><h3>{{ produto.nome }}</h3><p>{{ produto.descricao || 'Descrição não informada.' }}</p><strong>{{ produto.sob_orcamento ? 'Sob orçamento' : `${moeda(produto.valor)} / ${produto.unidade}` }} <small v-if="produto.sob_orcamento && produto.unidade">/ {{ produto.unidade }}</small></strong></div>
    <div class="quantity"><button type="button" :aria-label="`Remover ${produto.nome}`" @click="pedido.alterar(produto, -1)">−</button><span>{{ quantidade }}</span><button type="button" :aria-label="`Adicionar ${produto.nome}`" @click="pedido.alterar(produto, 1)">+</button></div>
  </article>
</template>
<script setup>
import { computed } from 'vue'
import { usePedidoStore } from '../stores/pedido'
const props = defineProps({ produto: { type: Object, required: true } })
const pedido = usePedidoStore()
const quantidade = computed(() => pedido.itens.find((item) => item.id === props.produto.id)?.quantidade || 0)
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0)
</script>
<style scoped>
.product-card{display:flex;justify-content:space-between;align-items:center;gap:20px;background:#fff;border:1px solid #f0e5dd;border-radius:18px;padding:22px}.product-card h3{font-size:1.08rem;color:#45251e}.product-card p{margin:7px 0 13px;color:#76645b;line-height:1.5}.product-card strong{color:#8c3428}.product-card small{font-size:.8rem;font-weight:500;color:#76645b}.quantity{display:flex;align-items:center;gap:13px;white-space:nowrap}.quantity button{width:38px;height:38px;border:0;border-radius:50%;background:#8c3428;color:white;font-size:1.3rem;cursor:pointer}.quantity span{min-width:18px;text-align:center;font-weight:700}@media(max-width:520px){.product-card{padding:17px;align-items:flex-start}.quantity{gap:8px}.quantity button{width:34px;height:34px}}
</style>
