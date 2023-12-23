<template>
  <!-- <div class="SAMO">
    Samo je kokot!
  </div>
  <div class="SAMO">
    Samo je kokot22222!
  </div>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
    <div> patove div</div>
    <div>push 3</div>
  </p> -->

  <!-- Divko s hrou -->
  <div id="game"></div>
</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';
import Menu from './Menu';

onMounted(() => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: [Menu], //Tu potom treba pridať ďalšiu classu do scene -> scene: [Menu, Game]
    parent: 'game' 
  };
  
  new Phaser.Game(config);
});
</script>



<style scoped>
#game {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
