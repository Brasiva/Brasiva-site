<template>
  <main class="order-page">
    <template v-if="etapa < 4">
      <header class="order-heading"><span class="kicker">BRASIVA · EVENTOS</span><h1>Faça seu pedido</h1><p>Conte o que você está planejando. Nossa equipe prepara um orçamento sob medida.</p></header>
      <nav class="progress" aria-label="Etapas do pedido">
        <div v-for="(label, index) in nomesEtapas" :key="label" class="progress-step" :class="{ active: etapa === index + 1, complete: etapa > index + 1 }"><span>{{ String(index + 1).padStart(2, '0') }}</span><small>{{ label }}</small></div>
        <div class="progress-track"><span :style="{ width: `${((etapa - 1) / 3) * 100}%` }"></span></div>
      </nav>

      <section v-if="etapa === 1" class="step-panel">
        <div class="step-title"><span>ETAPA 01</span><h2>Escolha seu pedido</h2><p>Selecione uma categoria e ajuste as quantidades dos itens.</p></div>
        <p v-if="erroCatalogo" class="notice error">{{ erroCatalogo }}</p>
        <p v-else-if="carregandoCatalogo" class="notice">Carregando cardápio…</p>
        <template v-else>
          <nav class="category-tabs" aria-label="Categorias do cardápio"><button v-for="categoria in categorias" :key="categoria.id" :class="{ selected: String(categoria.id) === String(categoriaAtiva) }" @click="categoriaAtiva = categoria.id">{{ categoria.nome }}</button></nav>
          <div class="selection-layout">
            <section class="product-list"><p v-if="!produtosCategoria.length" class="notice">Esta categoria não tem itens disponíveis para pedido no momento.</p><article v-for="produto in produtosCategoria" :key="produto.id" class="selectable-product"><img v-if="produto.imagem_url" :src="produto.imagem_url" :alt="produto.nome" class="product-image"><div><h3>{{ produto.nome }}</h3><p v-if="produto.descricao">{{ produto.descricao }}</p><strong>{{ produto.sob_orcamento ? 'Sob orçamento' : `${moeda(produto.valor)} / ${produto.unidade}` }}</strong></div><div class="quantity-control"><button :aria-label="`Remover ${produto.nome}`" @click="pedido.alterar(produto, -1)">−</button><span>{{ quantidade(produto.id) }}</span><button :aria-label="`Adicionar ${produto.nome}`" @click="pedido.alterar(produto, 1)">+</button></div></article></section>
            <aside class="order-summary"><h3>Seu pedido</h3><p v-if="!pedido.itens.length" class="muted">Seus itens aparecerão aqui.</p><div v-for="item in pedido.itens" :key="item.id" class="summary-line"><span>{{ item.quantidade }} × {{ item.nome }}</span><b>{{ item.sob_orcamento ? 'Sob orçamento' : moeda(Number(item.valor) * item.quantidade) }}</b></div><div class="summary-total"><span>Estimativa dos itens</span><strong>{{ moeda(pedido.total) }}</strong></div><small>O orçamento final será preparado pela equipe.</small></aside>
          </div>
        </template>
        <footer class="step-actions"><span></span><button class="primary" :disabled="!pedido.itens.length" @click="avancarParaDados">Continuar para seus dados <span aria-hidden="true">→</span></button></footer>
      </section>

      <form v-else-if="etapa === 2" ref="formDados" class="step-panel" @submit.prevent="avancarParaRevisao">
        <div class="step-title"><span>ETAPA 02</span><h2>Seus dados</h2><p>Precisamos dessas informações para organizar o atendimento do evento.</p></div>
        <div class="form-grid">
          <label>Nome completo<input v-model.trim="form.nome" autocomplete="name" required></label>
          <label>E-mail<input v-model.trim="form.email" type="email" autocomplete="email" required></label>
          <label>Telefone / WhatsApp<input v-model.trim="form.telefone" type="tel" autocomplete="tel" required></label>
          <label>Tipo de evento<input v-model.trim="form.tipo_evento" placeholder="Ex.: aniversário" required></label>
          <label>Data do evento<input v-model="form.data_evento" type="date" :min="dataMinima" required></label>
          <label>Horário do evento<input v-model="form.horario_evento" type="time" required></label>
          <label>Convidados<input v-model.number="form.convidados" type="number" min="1" required></label>
          <fieldset class="address-fields"><legend>Endereço do evento</legend><label>CEP<input v-model.trim="form.endereco_evento.cep" autocomplete="postal-code" inputmode="numeric" required></label><label>UF<input v-model.trim="form.endereco_evento.estado" maxlength="2" required></label><label class="wide">Rua / avenida<input v-model.trim="form.endereco_evento.logradouro" autocomplete="street-address" required></label><label>Número<input v-model.trim="form.endereco_evento.numero" required></label><label>Complemento <small>(opcional)</small><input v-model.trim="form.endereco_evento.complemento"></label><label>Bairro<input v-model.trim="form.endereco_evento.bairro" required></label><label>Cidade<input v-model.trim="form.endereco_evento.cidade" autocomplete="address-level2" required></label></fieldset>
          <label class="wide">Observações <small>(opcional)</small><textarea v-model.trim="form.observacoes" rows="3"></textarea></label>
        </div>
        <footer class="step-actions"><button class="secondary" type="button" @click="etapa = 1">Voltar ao cardápio</button><button class="primary" type="submit">Revisar pedido <span aria-hidden="true">→</span></button></footer>
      </form>

      <section v-else class="step-panel">
        <div class="step-title"><span>ETAPA 03</span><h2>Revise seu pedido</h2><p>Confira os dados antes de enviar a solicitação para a equipe.</p></div>
        <div class="review-grid"><section class="review-block"><h3>Produtos selecionados</h3><div v-for="item in pedido.itens" :key="item.id" class="summary-line"><span>{{ item.quantidade }} × {{ item.nome }} <small v-if="item.unidade">({{ item.unidade }})</small></span><b>{{ item.sub_orcamento ? 'Sob orçamento' : moeda(Number(item.valor) * item.quantidade) }}</b></div><div class="summary-total"><span>Estimativa dos itens</span><strong>{{ moeda(pedido.total) }}</strong></div></section><section class="review-block"><h3>Seus dados</h3><p><strong>{{ form.nome }}</strong></p><p>{{ form.email }} · {{ form.telefone }}</p></section><section class="review-block"><h3>Informações do evento</h3><p>{{ form.tipo_evento }} · {{ dataFormatada }} às {{ form.horario_evento }}</p><p>{{ form.convidados }} convidados</p><p>{{ enderecoFormatado }}</p><p v-if="form.observacoes">{{ form.observacoes }}</p></section></div>
        <p class="quote-note">Os valores exibidos são apenas uma estimativa dos itens. A equipe Brasiva confirmará o orçamento final após analisar os detalhes do evento.</p>
        <p v-if="erroEnvio" class="notice error">{{ erroEnvio }}</p>
        <footer class="step-actions"><button class="secondary" @click="etapa = 2">Voltar e editar</button><button class="primary" :disabled="enviando" @click="confirmarPedido">{{ enviando ? 'Enviando…' : 'Confirmar e enviar pedido' }}</button></footer>
      </section>
    </template>
    <section v-else class="confirmation"><span class="confirmation-mark" aria-hidden="true">✓</span><span class="kicker">ETAPA 04 · PEDIDO CONFIRMADO</span><h1>Seu pedido foi recebido com sucesso!</h1><p>Agradecemos por escolher o BRASIVA. Nossa equipe recebeu sua solicitação e vai analisar os detalhes para preparar um orçamento personalizado.</p><p v-if="pedidoConfirmado?.orcamento_final == null">Assim que o orçamento ficar pronto, entraremos em contato pelos dados informados.</p><section v-else class="quote-note final-quote"><strong>Orçamento final: {{ moeda(pedidoConfirmado.orcamento_final) }}</strong><p>Este é o valor definido pela equipe Brasiva para o seu evento.</p></section><strong v-if="pedidoConfirmado?.id">Pedido #{{ pedidoConfirmado.id }}</strong><RouterLink class="primary" to="/cardapios">Voltar ao cardápio</RouterLink></section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { cardapioApi } from '../services/api'
import { usePedidoStore } from '../stores/pedido'

const nomesEtapas = ['Escolha', 'Seus dados', 'Revisão', 'Confirmação']
const pedido = usePedidoStore()
const route = useRoute()
const router = useRouter()
const etapa = ref(1)
const categorias = ref([])
const produtos = ref([])
const categoriaAtiva = ref(null)
const carregandoCatalogo = ref(true)
const erroCatalogo = ref('')
const formDados = ref(null)
const enviando = ref(false)
const erroEnvio = ref('')
const pedidoConfirmado = ref(null)
const agora = new Date()
const dataMinima = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
const form = reactive({ nome: '', email: '', telefone: '', tipo_evento: '', data_evento: '', horario_evento: '', convidados: 1, observacoes: '', endereco_evento: { cep: '', estado: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '' } })
const produtosCategoria = computed(() => produtos.value.filter((produto) => String(produto.categoria) === String(categoriaAtiva.value)))
const dataFormatada = computed(() => form.data_evento ? new Date(`${form.data_evento}T12:00:00`).toLocaleDateString('pt-BR') : '')
const enderecoFormatado = computed(() => [form.endereco_evento.logradouro, form.endereco_evento.numero, form.endereco_evento.complemento, form.endereco_evento.bairro, form.endereco_evento.cidade, form.endereco_evento.estado, form.endereco_evento.cep].filter(Boolean).join(', '))
const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor || 0))
const quantidade = (id) => pedido.itens.find((item) => item.id === id)?.quantidade || 0

onMounted(async () => {
  if (route.name === 'pedido-confirmado') {
    etapa.value = 4
    try { pedidoConfirmado.value = (await cardapioApi.consultarPedido(route.params.token)).data } catch { pedidoConfirmado.value = null }
    return
  }
  try {
    const [categoriasResponse, produtosResponse] = await Promise.all([cardapioApi.categorias(), cardapioApi.pratos()])
    categorias.value = categoriasResponse.data
    produtos.value = produtosResponse.data
    categoriaAtiva.value = categorias.value[0]?.id ?? null
  } catch { erroCatalogo.value = 'Não foi possível carregar o cardápio. Tente novamente.' }
  finally { carregandoCatalogo.value = false }
})

function avancarParaDados() {
  if (!pedido.itens.length) return
  etapa.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function avancarParaRevisao() {
  const formElement = formDados.value
  if (!formElement?.reportValidity()) return
  if (!pedido.itens.length) { etapa.value = 1; return }
  etapa.value = 3
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function confirmarPedido() {
  if (enviando.value) return
  enviando.value = true
  erroEnvio.value = ''
  try {
    const result = await pedido.enviar(form)
    pedidoConfirmado.value = result
    await router.replace({ name: 'pedido-confirmado', params: { token: result.token_consulta } })
    etapa.value = 4
  } catch (error) {
    const data = error.response?.data
    erroEnvio.value = data ? Object.values(data).flat().join(' ') : 'Não foi possível enviar agora. Confira sua conexão e tente novamente.'
  } finally { enviando.value = false }
}
</script>

<style scoped>
.order-page{max-width:1160px;margin:auto;padding:124px 24px 90px;color:#452a22}.order-heading{text-align:center;margin-bottom:34px}.kicker{font-size:.72rem;letter-spacing:.16em;color:#a35c43;font-weight:800}.order-heading h1,.confirmation h1{margin:12px 0;font:500 clamp(2.45rem,6vw,4rem) Georgia,serif}.order-heading>p,.step-title>p,.confirmation>p{max-width:650px;margin:0 auto;color:#76655f;line-height:1.7}.progress{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:0 auto 24px;max-width:900px}.progress-step{position:relative;z-index:1;display:flex;align-items:center;gap:9px;color:#9b8b83}.progress-step>span{display:grid;place-items:center;width:38px;height:38px;border:1px solid #ded1c9;border-radius:50%;background:#fff;font-size:.75rem;font-weight:800}.progress-step small{font-size:.78rem}.progress-step.active,.progress-step.complete{color:#813c2c}.progress-step.active>span,.progress-step.complete>span{border-color:#8b4432;background:#8b4432;color:#fff}.progress-track{position:absolute;top:18px;left:5%;right:5%;height:2px;background:#e5dbd4}.progress-track span{display:block;height:100%;background:#8b4432;transition:width .25s}.step-panel{padding:clamp(18px,4vw,34px);border:1px solid #eee6e0;border-radius:22px;background:#fff;box-shadow:0 12px 38px #40261c0d}.step-title{margin-bottom:22px}.step-title>span{font-size:.7rem;font-weight:800;letter-spacing:.12em;color:#a35c43}.step-title h2{margin:7px 0;font:500 2rem Georgia,serif}.step-title>p{margin:0;max-width:none}.category-tabs{display:flex;gap:8px;overflow:auto;padding:2px 0 16px}.category-tabs button{flex:none;border:1px solid #e4d8d1;border-radius:30px;background:#fff;padding:10px 15px;color:#5f4840;font:inherit;cursor:pointer}.category-tabs button.selected{background:#813c2c;border-color:#813c2c;color:#fff}.selection-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(230px,.8fr);gap:20px;align-items:start}.product-list{display:grid;gap:10px}.selectable-product{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px;border:1px solid #eee5df;border-radius:15px}.product-image{width:76px;height:76px;flex:none;border-radius:12px;object-fit:cover}.selectable-product h3{margin:0 0 5px;font-size:1rem}.selectable-product p{margin:0 0 7px;color:#77675f;font-size:.87rem}.selectable-product strong{color:#8b4432;font-size:.88rem}.quantity-control{display:flex;align-items:center;gap:12px}.quantity-control button{width:36px;height:36px;border:0;border-radius:50%;background:#8b4432;color:#fff;font-size:1.15rem;cursor:pointer}.quantity-control span{min-width:16px;text-align:center;font-weight:700}.order-summary{position:sticky;top:20px;padding:18px;border-radius:15px;background:#faf4ef}.order-summary h3{margin:0 0 12px;font:500 1.35rem Georgia,serif}.order-summary>small,.muted{color:#85766f;font-size:.8rem}.summary-line,.summary-total{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid #eaded6;font-size:.84rem}.summary-total{margin-top:8px;border:0;color:#793b2e;font-weight:700}.summary-total strong{white-space:nowrap}.step-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:24px}.primary,.secondary{display:inline-flex;justify-content:center;align-items:center;gap:12px;min-height:46px;padding:0 20px;border:0;border-radius:28px;text-decoration:none;font:700 .92rem inherit;cursor:pointer}.primary{background:#813c2c;color:#fff}.primary:disabled{opacity:.55;cursor:not-allowed}.secondary{border:1px solid #d9ccc4;background:#fff;color:#62463b}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.form-grid>label,.address-fields label{display:grid;gap:7px;color:#503c34;font-size:.85rem;font-weight:700}.form-grid input,.form-grid textarea{width:100%;box-sizing:border-box;border:1px solid #dfd3cc;border-radius:10px;background:#fff;padding:12px;font:inherit}.wide{grid-column:1/-1}.address-fields{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:2px 0 0;padding:17px;border:1px solid #e9dfd9;border-radius:14px}.address-fields legend{padding:0 7px;font-weight:800}.review-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.review-block{padding:16px;border:1px solid #eee5df;border-radius:14px}.review-block:first-child{grid-row:span 2}.review-block h3{margin:0 0 10px;font:500 1.2rem Georgia,serif}.review-block p{margin:6px 0;color:#685950;font-size:.88rem;line-height:1.5}.review-block small{color:#85766f}.quote-note,.notice{padding:14px;border-radius:12px;background:#faf4ef;color:#73564a;line-height:1.6}.error{background:#fff0ed;color:#982f20}.confirmation{max-width:720px;margin:45px auto;padding:clamp(25px,6vw,56px);border:1px solid #eee6e0;border-radius:24px;background:#fff;text-align:center;box-shadow:0 12px 38px #40261c0d}.confirmation-mark{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 20px;border-radius:50%;background:#eaf2e8;color:#426a43;font-size:2rem}.confirmation>p{margin:12px auto}.confirmation>strong{display:block;margin:20px 0;color:#813c2c}.confirmation .primary{margin-top:16px}@media(max-width:760px){.progress-step{flex-direction:column;gap:5px;text-align:center}.progress-step small{font-size:.67rem}.selection-layout{grid-template-columns:1fr}.order-summary{position:static}.review-grid{grid-template-columns:1fr}.review-block:first-child{grid-row:auto}}@media(max-width:560px){.order-page{padding:110px 14px 60px}.form-grid,.address-fields{grid-template-columns:1fr}.wide{grid-column:auto}.step-actions{align-items:stretch;flex-direction:column-reverse}.step-actions>*{width:100%}.selectable-product{align-items:flex-start;padding:13px}.quantity-control{gap:7px}.quantity-control button{width:32px;height:32px}.progress{gap:4px}.progress-step>span{width:34px;height:34px}.progress-track{top:16px}}
</style>
