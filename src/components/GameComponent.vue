<template>

  <div id="game"></div>

</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';
import Menu from './Menu';
import Game  from './Game';
import GameOver from './GameOver';

onMounted(() => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 10 },
        debug: true // TODO toto zmen pri final release na false
            }
    },
    scene: [ Game, Menu, GameOver], // TODO treba zmeniť poradie na [Menu, Game....] !! iba kvôli vytvaraniu hry
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
