<template>
  <section class="navbar">
    <nav class="navbar-menu">
            <router-link to="/#quiz" class="menu-item">
              <span>Monte seu Evento</span>
            </router-link>

            <router-link to="/#pedidos" class="menu-item">
              <span>Mais pedidos</span>
            </router-link>

            <router-link to="/eventos" class="menu-item">
              <span>Eventos</span>
            </router-link>

            <router-link to="/#sobrenos" class="menu-item">
              <span>Sobre Nós</span>
            </router-link>
    </nav>
    <router-link to="/#quiz" class="button">
      <button type="button">PEÇA AGORA</button>
    </router-link>
  </section>
</template>
<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: hsl(30 40% 97% / 0.95);
  padding: 20px 12px 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  z-index: 1000;
  border-color: hsl(30 30% 85% / .95);
  align-items: center;
  font-family: Coolvetica, Outfit, system-ui, sans-serif;
}

.navbar-menu {
  display: flex;
  gap: 25px;
}

.menu-item {
  display: flex;
  align-items: center;
  color: #760c0c;
  text-decoration: none;
  font-size: 0.73rem;
  font-weight: 500;
  position: relative;
}

.menu-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  top: 20px;
  width: 0;
  height: 2px;
  background-color: #760c0c;
  transition: width 0.3s;
}

.menu-item:hover::after {
  width: 100%;
}

.button {
  position: absolute;
  right: 220px;
}

button {
  color: white;
  background-color: #8f0e0e;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 15px;
  border: none;
  padding: 7px 14px;
  cursor: pointer;
}
</style>
