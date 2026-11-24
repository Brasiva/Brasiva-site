<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">BRASIVA</RouterLink>
    <nav class="navbar-menu" aria-label="Navegação principal">
      <RouterLink to="/" class="menu-item">Início</RouterLink>
      <a href="/#sobrenos" class="menu-item">Sobre nós</a>
      <RouterLink to="/cardapios" class="menu-item">Cardápios</RouterLink>
    </nav>
    <RouterLink to="/pedido" class="order-button">Faça seu pedido</RouterLink>
  </header>
</template>
<style scoped>
.navbar{position:fixed;top:0;left:0;right:0;width:100%;height:66px;background:#fbf8f3ed;padding:10px max(20px,calc((100vw - 1120px)/2));display:flex;justify-content:space-between;align-items:center;z-index:1000;border-bottom:1px solid #eadfd5;font-family:system-ui,sans-serif}.brand{font:700 1rem Georgia;letter-spacing:.16em;color:#760c0c;text-decoration:none}.navbar-menu{display:flex;gap:27px}.menu-item{color:#55271e;text-decoration:none;font-size:.82rem;font-weight:600}.order-button{background:#8c3428;color:white;border-radius:30px;padding:11px 16px;text-decoration:none;font-size:.82rem;font-weight:700}.menu-item:hover{color:#a2533d}@media(max-width:550px){.navbar{padding:10px 13px}.navbar-menu{gap:11px}.menu-item{font-size:.68rem}.order-button{font-size:.68rem;padding:9px 10px}.brand{font-size:.8rem}}
</style>
