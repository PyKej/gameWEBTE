<template>

  <div id="game"></div>

</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';
import Menu from './Menu';
import Game  from './Game';
import GameOver from './GameOver';
import Manual from './Manual';

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
    scene: [Menu , Manual ,Game, GameOver], // TODO treba zmeniť poradie na [Menu, Game....] !! iba kvôli vytvaraniu hry
    parent: 'game', 

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
     
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
