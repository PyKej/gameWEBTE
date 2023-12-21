<template>
  <div class="SAMO">
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
  </p>
</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';

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
    scene: {
      preload() {
        // Load assets
      },
      create() {
        // Create game objects
      },
      update() {
        // Game loop
      }
    }
  };

  new Phaser.Game(config);
});
</script>



<style scoped>
.read-the-docs {
  color: #888;
}
</style>
