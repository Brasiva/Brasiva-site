import { test, expect } from '@playwright/test'

const categories = {
  count: 1,
  total_pages: 1,
  results: [{ id: 7, nome: 'Salgados tradicionais', quantidade_opcoes: 1, quantidade_disponiveis: 1, publicada: true }],
}

const products = {
  count: 1,
  total_pages: 1,
  results: [{
    id: 31,
    nome: 'Coxinha de frango',
    descricao: 'Recheio de frango',
    valor: '4.50',
    unidade: 'unidade',
    sob_orcamento: false,
    disponivel: true,
  }],
}

async function mockCatalog(page) {
  await page.route('**/api/categoria-pratos/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(categories),
  }))
  await page.route('**/api/pratos/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(products),
  }))
}

test('home CTA opens the menu', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/')
  await page.getByRole('link', { name: /monte seu pedido/i }).click()
  await expect(page.getByRole('heading', { name: 'Nosso cardápio' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Salgados tradicionais' })).toBeVisible()
})

test('menu shows API categories and their availability count', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/cardapios')
  await expect(page.getByRole('heading', { name: 'Salgados tradicionais' })).toBeVisible()
  await expect(page.getByText(/1 item no card/)).toBeVisible()
  await expect(page.getByText(/1 dispon.* para pedido/)).toBeVisible()
})

test('customer selects a product and sees the item estimate', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/cardapios/7')
  await expect(page.getByRole('heading', { name: 'Coxinha de frango' })).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar Coxinha de frango' }).click()
  await expect(page.getByRole('link', { name: /revisar pedido/i })).toBeVisible()
  await page.getByRole('link', { name: /revisar pedido/i }).click()
  await expect(page.locator('.summary-total strong')).toContainText('4,50')
})

test('site order is submitted in four steps and opens confirmation', async ({ page }) => {
  await mockCatalog(page)
  let submittedOrder
  await page.route('**/api/pedidos-site/', async (route) => {
    submittedOrder = route.request().postDataJSON()
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 54, token_consulta: '550e8400-e29b-41d4-a716-446655440000', status: 'novo', total_estimado: '4.50' }),
    })
  })
  await page.route('**/api/pedidos-site/consulta-orcamento/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ id: 54, status: 'novo', orcamento_final: null }),
  }))

  await page.goto('/cardapios/7')
  await page.getByRole('button', { name: 'Adicionar Coxinha de frango' }).click()
  await page.getByRole('link', { name: /revisar pedido/i }).click()
  await page.getByRole('button', { name: /continuar para seus dados/i }).click()
  await page.getByLabel('Nome completo').fill('Ana Cliente')
  await page.getByLabel('E-mail').fill('ana@example.test')
  await page.getByLabel('Telefone / WhatsApp').fill('+5511999999999')
  await page.getByLabel('Tipo de evento').fill('Aniversário')
  await page.getByLabel('Data do evento').fill('2030-08-15')
  await page.getByLabel(/hor.rio do evento/i).fill('18:30')
  await page.getByLabel('Convidados').fill('20')
  await page.getByLabel('CEP').fill('88000-000')
  await page.getByLabel('UF').fill('SC')
  await page.getByLabel('Rua / avenida').fill('Rua das Flores')
  await page.getByLabel(/n.mero/i).fill('42')
  await page.getByLabel('Bairro').fill('Centro')
  await page.getByLabel('Cidade').fill('Florianópolis')
  await page.getByRole('button', { name: /revisar pedido/i }).click()
  await page.getByRole('button', { name: /confirmar e enviar pedido/i }).click()

  await expect(page.getByRole('heading', { name: /pedido foi recebido com sucesso/i })).toBeVisible()
  await expect(page.getByText('Pedido #54')).toBeVisible()
  await expect(page).toHaveURL(/pedido\/confirmado\/550e8400-e29b-41d4-a716-446655440000/)
  expect(submittedOrder).toMatchObject({
    nome: 'Ana Cliente',
    email: 'ana@example.test',
    horario_evento: '18:30',
    endereco_evento: { logradouro: 'Rua das Flores', numero: '42', estado: 'SC' },
    itens: [{ prato: 31, quantidade: 1 }],
  })
})
