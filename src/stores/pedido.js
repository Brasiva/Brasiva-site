import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cardapioApi } from '../services/api'

export const usePedidoStore = defineStore('pedido-site', () => {
  const itens = ref([])
  const total = computed(() => itens.value.reduce((soma, item) => soma + Number(item.valor) * item.quantidade, 0))
  function alterar(prato, delta) {
    const atual = itens.value.find((item) => item.id === prato.id)
    if (atual) {
      atual.quantidade += delta
      if (atual.quantidade <= 0) itens.value = itens.value.filter((item) => item.id !== prato.id)
    } else if (delta > 0) {
      itens.value.push({ ...prato, quantidade: 1 })
    }
  }
  async function enviar(dados) {
    const resposta = await cardapioApi.enviarPedido({
      ...dados,
      itens: itens.value.map(({ id, quantidade }) => ({ prato: id, quantidade })),
    })
    itens.value = []
    return resposta.data
  }
  return { itens, total, alterar, enviar }
})
