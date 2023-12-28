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

let game; // Declare the game variable in the outer scope

onMounted(() => {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Set the game width to the window width
    height: window.innerHeight, // Set the game height to the window height
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 10 },
        debug: true // TODO toto zmen pri final release na false
      }
    },
    scene: [Menu , Manual ,Game, GameOver ], // TODO treba zmeniť poradie na [Menu, Game....] !! iba kvôli vytvaraniu hry
    parent: 'game', 
    scale: {
      mode: Phaser.Scale.RESIZE, // Set the scale mode to RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
  
  game = new Phaser.Game(config); // Assign the new Phaser game instance to the game variable
});

window.addEventListener('resize', () => {
  if (game && game.scale) { 
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});



</script>



<style scoped>



</style>
