import { test, expect } from '@playwright/test'

const categories = {
  count: 1,
  total_pages: 1,
  results: [{ id: 7, nome: 'Salgados tradicionais', quantidade_opcoes: 1, publicada: true }],
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
  await expect(page.getByText('1 opção disponível')).toBeVisible()
})

test('customer selects a product and sees the item estimate', async ({ page }) => {
  await mockCatalog(page)
  await page.goto('/cardapios/7')
  await expect(page.getByRole('heading', { name: 'Coxinha de frango' })).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar Coxinha de frango' }).click()
  await expect(page.getByRole('link', { name: /revisar pedido/i })).toBeVisible()
  await page.getByRole('link', { name: /revisar pedido/i }).click()
  await expect(page.locator('.total b')).toContainText('4,50')
})

test('site order is submitted to the backend with selected products', async ({ page }) => {
  await mockCatalog(page)
  let submittedOrder
  await page.route('**/api/pedidos-site/', async (route) => {
    submittedOrder = route.request().postDataJSON()
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 54, status: 'novo', total_estimado: '4.50' }),
    })
  })

  await page.goto('/cardapios/7')
  await page.getByRole('button', { name: 'Adicionar Coxinha de frango' }).click()
  await page.getByRole('link', { name: /revisar pedido/i }).click()
  await page.getByLabel('Seu nome').fill('Ana Cliente')
  await page.getByLabel('E-mail').fill('ana@example.test')
  await page.getByLabel('Telefone / WhatsApp').fill('+5511999999999')
  await page.getByLabel('Tipo de evento').fill('Aniversário')
  await page.getByLabel('Data do evento').fill('2030-08-15')
  await page.getByLabel('Número de convidados').fill('20')
  await page.getByRole('button', { name: /enviar solicitação/i }).click()

  await expect(page.getByText(/solicitação enviada/i)).toBeVisible()
  expect(submittedOrder).toMatchObject({
    nome: 'Ana Cliente',
    email: 'ana@example.test',
    itens: [{ prato: 31, quantidade: 1 }],
  })
})
