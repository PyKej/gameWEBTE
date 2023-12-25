<template>

  <div id="game"></div>
  
</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';
import Menu from './Menu';
import Game  from './Game';

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
    scene: [Menu, Game], //Tu potom treba pridať ďalšiu classu do scene -> scene: [Menu, Game]
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
