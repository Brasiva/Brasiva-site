<template>
  <RouterLink class="category-card" :to="`/cardapios/${categoria.id}`">
    <span class="category-card__eyebrow">CARD&Aacute;PIO BRASIVA</span>
    <h2>{{ categoria.nome }}</h2>
    <span class="category-card__count">{{ categoria.quantidade_opcoes }} {{ categoria.quantidade_opcoes === 1 ? 'item no card&aacute;pio' : 'itens no card&aacute;pio' }}</span>
    <small class="category-card__available">{{ categoria.quantidade_disponiveis || 0 }} dispon&iacute;veis para pedido</small>
    <span class="category-card__action">Ver op&ccedil;&otilde;es <span aria-hidden="true">&#8599;</span></span>
  </RouterLink>
</template>

<script setup>
defineProps({ categoria: { type: Object, required: true } })
</script>

<style scoped>
.category-card{min-height:190px;padding:26px;border-radius:22px;background:linear-gradient(145deg,#fff4df,#f8d9bc);display:flex;flex-direction:column;justify-content:space-between;color:#47251d;text-decoration:none;transition:transform .2s,box-shadow .2s}.category-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px #552d241a}.category-card h2{font-family:Georgia,serif;font-size:1.65rem}.category-card__eyebrow{font-size:.68rem;letter-spacing:.14em;color:#995840}.category-card__count{font-size:.84rem;color:#5c4036;font-weight:700}.category-card__available{font-size:.78rem;color:#76645b}.category-card__action{font-weight:700}
</style>
