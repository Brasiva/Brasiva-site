import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://brasiva-backend.class.fabricadesoftware.ifc.edu.br' : 'http://localhost:8000')).replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
})

async function buscarTodas(path) {
  const itens = []
  let pagina = 1
  while (true) {
    const { data } = await api.get(path, { params: { page: pagina } })
    itens.push(...(Array.isArray(data) ? data : data.results || []))
    if (Array.isArray(data)) break
    if (data.total_pages && pagina < data.total_pages) { pagina += 1; continue }
    if (data.next) { pagina += 1; continue }
    break
  }
  return { data: itens }
}

export const cardapioApi = {
  categorias: () => buscarTodas('/api/categoria-pratos/'),
  pratos: async (categoria) => buscarTodas(categoria ? `/api/pratos/?categoria=${encodeURIComponent(categoria)}` : '/api/pratos/'),
  enviarPedido: (pedido) => api.post('/api/pedidos-site/', pedido),
  consultarPedido: (token) => api.get('/api/pedidos-site/consulta-orcamento/', { params: { token } }),
}

export default api
