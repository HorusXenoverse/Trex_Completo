//Variables globales del juego del Trex
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Crear variable de objetos del programa
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;

//Crear variable del puntaje
var score;


function preload(){
  //Precargar imagen de trex corriendo
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  //Precargar imagen de trex colisionando
  trex_collided = loadAnimation("trex_collided.png");
  
  //Precargar imagen de suelo
  groundImage = loadImage("ground2.png");
  
  //Precargar imagen de nubes
  cloudImage = loadImage("cloud.png");
  
  //Precargar imagen de obstaculos
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  
  //Precargar imagen de gameOver y restart
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
  
  //Precargar sonidos
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Crea el sprite de trex
  trex = createSprite(50,heigth-10,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  //Crear radio de Colision al trex
  trex.setCollider("Circle",0,10,40);
  trex.debug = false;
  
  //Crea el sprite de suelo
  ground = createSprite(width/2,heigth-10,width,20);
  ground.addImage("ground",groundImage);
  
  //Crea el sprite de suelo invisible
  invisibleGround = createSprite(width/2,heigth,width,20);
  invisibleGround.visible = false;
  
  //Crea grupos de obstaculos y de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //Sprites de GameOver y Restart
  gameOver = createSprite(width/2,heigth/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.6;
  
  
  restart = createSprite(width/2,heigth/2 +50);
  restart.addImage(restartImg);
  restart.scale = 0.6;

  
  //Variable de score
  score = 0
}

function draw() {
  background("white");
  
  //Mostrar la puntuacion
  text("SCORE: " + score, 480, 50);
 
  //Reproducir sonido cada que lleguemos a 100 puntos
  if (score > 0 && score % 100 === 0){
      checkPointSound.play();
  }
  
//Condiciones para estado de juego PLAY
  if (gameState === PLAY){
    
      //Hacer invisibles gameOver y restart
      gameOver.visible = false;
      restart.visible = false;
    
      //Mover el suelo
      ground.velocityX = -(6 + score/200); 
    
      //Puntuación
      score = score + Math.round(getFrameRate()/60);
    
      //restablecer el suelo
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
    
      //Trex salta cuando se presiona la tecla de espacio y reproduce sonido de salto
      if(touches.length>0 || keyDown("space") && trex.y>=160){
        trex.velocityY = -10;
        touches = [];
        jumpSound.play();
      }

      //Gravedad del trex
      trex.velocityY = trex.velocityY + 0.8

      //Aparece las nubes
      spawnClouds();

      //aparecer los obstaculos
      spawnObstacles();

      //Cambiar estado de juego si trex toca los obstaculos y reproduce sonido de muerte
      if (obstaclesGroup.isTouching(trex)){    
       gameState = END;
       dieSound.play();
      }
  }  
//Condiciones para estado de juego END  
  else if (gameState === END){
      //Detener el suelo
      ground.velocityX = 0;

      //Detener el salto del trex
      trex.velocityY = 0;

      //Detener grupo de nubes y obstaculos
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);

      //Cambia la animacion del Trex
      trex.changeAnimation("collided", trex_collided);

      //Establece tiempo de vida a los objetos para que nunca sean destruidos.
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      //Mostrar gameOver y restart
      gameOver.visible = true;
      restart.visible = true;
    
     if (mousePressedOver(restart)){
        reset();
     }
    
    }
  
  //Evita que el Trex caiga
  trex.collide(invisibleGround);

 
  
  drawSprites();
}

function spawnClouds() {
  //Escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,heigth-20);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.6;
    cloud.velocityX = -(6 + score/200);
    cloud.lifetime = 220;
    
    //Ajusta la profundidad
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    //Añade cada nube al grupo
    cloudsGroup.add(cloud);
    }
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    //Aparecer los obstaculos
    obstacle = createSprite(width,heigth-20);
    obstacle.velocityX = -(6 + score/100); 
    obstacle.scale = 0.5;

    
    //Dar tiempo de vida a los obstáculos
    obstacle.lifetime = 170;
    
    //Añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
    
    //Generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle1);
        break;
      case 3: obstacle.addImage(obstacle1);
        break;
      case 4: obstacle.addImage(obstacle1);
        break;
      case 5: obstacle.addImage(obstacle1);
        break;
      case 6: obstacle.addImage(obstacle1);
        break;
      default: break;
    }
  }
}

//Para reiniciar el juego
function reset(){
  gameState = PLAY
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0
}