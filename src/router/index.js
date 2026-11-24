import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CardapiosView from '../views/CardapiosView.vue'
import CategoriaView from '../views/CategoriaView.vue'
import PedidoView from '../views/PedidoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() { return { top: 0 } },
  routes: [
    { path: '/', name: 'inicio', component: HomeView },
    { path: '/cardapios', name: 'cardapios', component: CardapiosView },
    { path: '/cardapios/:id', name: 'categoria', component: CategoriaView, props: true },
    { path: '/pedido', name: 'pedido', component: PedidoView },
    { path: '/pedido/confirmado/:token', name: 'pedido-confirmado', component: PedidoView },
  ],
})

export default router
