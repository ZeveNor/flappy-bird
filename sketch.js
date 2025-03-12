let summonL;
let config;
let birds = [];
let savedBirds = [];
let pipes = [];
let count_pipe = 0;
let slider = 1;
let score = 0;
let highest = 0;

function setup() {
  // load config from loadJson.js
  const configLoad = JsonLoader.getConfig();
  config = configLoad;

  // create canvas
  createCanvas(
    config.canvas_width,
    config.canvas_height
  );

  // use cpu as a processer or use webgl(GPU)
  tf.setBackend(config.tensor_engine);

  // setup slider for get user speed interact
  $('#slider').val(config.start_speed);
  $("#slider").on("input", function () {
    slider = $('#slider').val();
  });

  // summon bird amount same as bird_summon
  for (let i = 0; i < config.bird_summon; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  // background color set
  background('#E4E4E4');

  // adjust how pipe gen or pipe move by get data from slider
  for (let n = 0; n < slider; n++) {
    
    // PIPE GENERATE
    // summon pipe rate if create pipe every 1.25 second 
    // 60 / 75 = 1.25 sec. อันนี้ได้สูตรจาก chatGPT
    // u will see pipe in frame 75% of all frame.
    // two pipe per frame
    if (count_pipe % (60 * config.summon_rate) == 0) {
      pipes.push(new Pipe());
    }
    count_pipe++;

    // PIPE MOVE
    for (let i = pipes.length - 1; i >= 0; i--) {
      // update pipe location in แกน x 
      // this.x -= this.speed ลดทีละ 6 ทุกครั้งที่วนลูป
      // ขวาสุดคือ ความยาวของ canvas 800 ลด x ทีละ 6 คือ 794 788 782 776..
      // ไปเรื่อยๆ จนน้อยกว่า 0 อันนี้คือ offscreen ออกจากเฟรม
      pipes[i].update();

      // save bird progress one by one to improve model.
      // ลูปเช็คแต่ละตัวว่าตัวไหนตายไม่ตาย ถ้าตายแยกออกจาก รายการนก birds และเอาไปเก็บใน saveBirds
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          // splice คือการเอาออกจาก array. เราเอานกตายออกจาก array ของ Birds
          // เก็บนกที่ตายใน saveBirds ว่ามันตายยังไง
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      // loop each bird to update score.
      // ทำลูปโดยไม่มีเงื่อนไข เพื่อจะได้ทุกตัว
      for (let bird of birds) {
        // if one of bird pass it will return true
        // อันนี้ทำเพราะต้องการนกแค่ตัวเดียว ตัวไหนก็ได้ขอแค่ผ่าน เพื่อใช้อ้างอิงคะแนนจะได้ + ทีละ 1 ตอนผ่าน 1 เสา
        // ไม่ใช่ +1 กับทุกตัวที่ผ่านเสา
        if (pipes[i].checkPassed(bird)) {
          score++;
          $("#score-box").val(score);

          if (score > highest) {
            highest = score;
          }
          $("#highest-box").val(highest);
        }
      }

      // check pipe that fall over the screen
      // ท่อไหนต่ำกว่า 0 ให้เอาออกโดยใช้คำสั่ง splice
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    // save bird that die cause fall off the screen
    // อันบนคือเก็บตัวที่ตายเพราะเสา แต่อันนี้เก็บ ตัวที่ร่วงจากจอ แกน y
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    // predict bird way to win
    // ส่งรายละเอียดตำแหน่งท่อไปให้ โมเดลคิด
    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    // update alived bird to scoreboard
    $("#alive-box").val(birds.length);

    // reset birds and pipe in screen set score to 0
    if (birds.length === 0) {
      count_pipe = 0;
      nextGeneration();
      pipes = [];
      
      score = 0; 
      $("#score-box").val(score);
    }
  }

  // create birds on canvas by read all bird that it have in birds array. 
  for (let bird of birds) {
    bird.show();
  }

  // create pipes on canvas by read all pipe that it have in pipes array.
  for (let pipe of pipes) {
    pipe.show();
  }
}
