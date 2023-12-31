<template>

  <div id="game"></div>
  <div id="printable" style="display: none;">
    <h1>Happy Submarine</h1>
    <h2>About</h2>
    <p>
      Once upon a time, in the vast blue ocean, there was a little submarine named Bubbles. Bubbles was no ordinary submarine. She was vibrant and colorful, a stark contrast to the deep blues of the sea. She had a spirit of adventure and loved exploring the underwater world.
      Every day, Bubbles embarked on a journey through the ocean, gliding past coral reefs and venturing into the mysterious depths where sunlight couldn't reach. The ocean was filled with obstacles, but Bubbles was agile and quick. She could swiftly dodge the jagged rocks, mischievous octopuses, and mines that came her way.
      But what made Bubbles truly happy was not the thrill of the adventure or the joy of finding treasures. It was the friends she made along the way. From the playful dolphins that raced alongside her to the wise old turtle that shared tales of the sea, every creature added a unique color to her journey.
      In the world of "Happy Submarine", every day is a new adventure. So, come join Bubbles as she navigates the challenges of the ocean, and makes new friends. Remember, the ocean may be vast and unpredictable, but with a spirit like Bubbles, there's always a way to make it a happy journey!
    </p>
    <h2>Controls</h2>
    <p id="keys">Use arrow keys or gyroscope when you are using your mobile device to move with the submarine</p>
    <img id ="imageKeys" src="../assets/arrow_keys5.png" alt="arrowKeys" width="85" height="85">
    <p id="stars">You have to collect as many stars as you can during your adventure. Every level ends with finish !</p>
    <img id ="imageStars" src="../assets/star.png" alt="Star" width="80" height="80">
    <img id="finish" src="../assets/finish.png" alt="Finish" width="85" height="85">
    <p id="mines">You have to avoid the scary sea mines, because they will destroy your submarine. Avoid jellyfish because they stun the submarine.</p>
    <img id ="imageMines" src="../assets/sea_mine.png" alt="Sea Mine" width="85" height="85">
    <img id="jellyFish" src="../assets/jellyfish.png" alt="Jellyfish" width="85" height="85">
    <img id ="imageSubmarine" src="../assets/submarine.png" alt="Submarine" width="85" height="85">
    <p id="credits">This game was created by Patrik Pitka Kester and Samuel Kubala</p>
  </div>

</template>




<script setup>
import { onMounted } from 'vue';
import Phaser from 'phaser';
import Menu from './Menu';
import Game  from './Game';
import GameOver from './GameOver';
import Manual from './Manual';
import LevelComplete from './LevelComplete';
import Init from './Init';

let game; // Declare the game variable in the outer scope

onMounted(() => {
  const config = {
    type: Phaser.CANVAS,
    width: window.innerWidth, // Set the game width to the window width
    height: window.innerHeight, // Set the game height to the window height
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 10 },
        debug: true // TODO toto zmen pri final release na false
      }
    },
    scene: [ Init, Game, Menu, Manual, GameOver, LevelComplete ], // TODO treba zmeniť poradie na [Menu, Manual, Game....] !! iba kvôli vytvaraniu hry
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

window.onbeforeprint = function() {
    document.getElementById('printable').style.display = 'block';
    document.getElementById('game').style.display = 'none';

}

window.onafterprint = function() {
    document.getElementById('printable').style.display = 'none';
    document.getElementById('game').style.display = 'block';

}

</script>



<style scoped>

#game{
  margin: 0 !important; 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#printable {
    background-image: url('../assets/bcg_manual.png');
    background-repeat: no-repeat;
    background-size: cover;
    
}

@media print {
    #printable {
        height: 29.7cm;
        width: 21cm;
        background-size: 100% 100%;
        page-break-after: always;
        color: white;
        font-weight: 700;
    }

    #printable h1 {
      padding-top: 1em;
        text-align: center;
        font-weight: 900;
        font-size: 42px;
    }

    #printable h2 {
        text-indent: 1em;
        font-weight: 800;  
    }

    #printable p {
      padding-left: 2em;
      padding-right: 2em;
      font-weight: 600;
    }

    #keys, #stars, #mines{
      width: 80%;
      font-size: 22px;
      margin-bottom: 4em;
    }
    #imageKeys{
      position: absolute;
      top: 48%;
      left: calc(100% - 2em - 85px);
      transform: translate(-50%, -50%);
    }

    #imageStars{
      position: absolute;
      top: 60%;
      left: 79%;
      transform: translate(-50%, -50%);
    }

    #finish{
      position: absolute;
      top: 60%;
      left: 93%;
      transform: translate(-50%, -50%);
    }

    #imageMines{
      position: absolute;
      top: 74%;
      left: 79%;
      transform: translate(-50%, -50%);
    }

    #jellyFish{
      position: absolute;
      top: 74%;
      left: 93%;
      transform: translate(-50%, -50%);
    }


    #imageSubmarine{
      position: absolute;
      top: 87%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    #credits{
      position: absolute;
      bottom: 1%;
      text-align: center;
      left: 17%;
    }
}
</style>
