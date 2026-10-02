import { createAnimations } from "./animations.js"

// Mobil tuşların ve menü tuşunun durumunu tutacağımız değişkenler
let isLeftDown = false;
let isRightDown = false;
let isJumpDown = false;

// HTML'deki butonları JavaScript'e bağlıyoruz
document.getElementById('btn-left').addEventListener('pointerdown', () => isLeftDown = true);
document.getElementById('btn-left').addEventListener('pointerup', () => isLeftDown = false);

document.getElementById('btn-right').addEventListener('pointerdown', () => isRightDown = true);
document.getElementById('btn-right').addEventListener('pointerup', () => isRightDown = false);

document.getElementById('btn-jump').addEventListener('pointerdown', () => isJumpDown = true);
document.getElementById('btn-jump').addEventListener('pointerup', () => isJumpDown = false);

// Yeni Oyun butonuna basılınca ekranı kapatma
document.getElementById('start-btn').addEventListener('pointerdown', () => {
    document.getElementById('start-screen').style.display = 'none';
});

const config = {
  type: Phaser.AUTO,
  width: 900,  
  height: 500, 
  backgroundColor: '#5c94fc',
  parent: 'game', 
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 }, 
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)

function preload () {
  this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png') 
  this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 }) 
  this.load.image('ozelBlok', 'assets/blocks/block.png')
}

function create () {
  this.floor = this.physics.add.staticGroup()
  
  for(let i=0; i<30; i++) {
     this.floor.create(i * 32, 480, 'floorbricks').setOrigin(0, 0.5).refreshBody()
  }

  this.floor.create(200, 350, 'ozelBlok').refreshBody()
  this.floor.create(250, 350, 'ozelBlok').refreshBody()
  this.floor.create(300, 350, 'ozelBlok').refreshBody()

  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setScale(2)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys()
}

function update () {
  if (this.mario.isDead) return

  if (this.keys.left.isDown || isLeftDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.setVelocityX(-160)
    this.mario.flipX = true
  } else if (this.keys.right.isDown || isRightDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.setVelocityX(160)
    this.mario.flipX = false
  } else {
    this.mario.anims.play('mario-idle', true)
    this.mario.setVelocityX(0)
  }

  if ((this.keys.up.isDown || isJumpDown) && this.mario.body.touching.down) {
    this.mario.setVelocityY(-400)
    this.mario.anims.play('mario-jump', true)
  }
}
