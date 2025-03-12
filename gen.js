let genCount = 1;

function nextGeneration() {
  // อัปเดตค่ารุ่นที่สร้างไปทั้งหมด
  $("#gen-box").val(genCount++);

  // คำนวณค่า Fitness สำหรับนกที่รอดชีวิต
  calculateFitness();

  // สร้างนกใหม่โดยเลือกจากนกที่รอดชีวิต (จากฟังก์ชัน pickOne)
  for (let i = 0; i < config.bird_summon; i++) {
    birds[i] = pickOne();
  }

  // ลบโมเดลของนกที่ตายไป (dispose) เพื่อคืนหน่วยความจำ
  for (let i = 0; i < config.bird_summon; i++) {
    savedBirds[i].dispose();
  }

  // เคลียร์รายการนกที่ตายไป (savedBirds)
  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);

  // ใช้ค่า fitness เพื่อเลือกนกที่เหมาะสมจาก savedBirds
  while (r > 0) {
    r = r - savedBirds[index].fitness; 
    index++;
  }
  index--;

  // คัดลอกข้อมูลของนกที่ถูกเลือกมาเพื่อสร้างรุ่นลูก
  let bird = savedBirds[index];
  let child = new Bird(bird.brain);

  // กลายพันธุ์ลูกนก (mutation)
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;

  // หาผลรวมคะแนนทั้งหมดของนกที่รอดชีวิต
  for (let bird of savedBirds) {
    sum += bird.score;
  }

  // คำนวณค่า fitness สำหรับแต่ละนก โดยใช้คะแนนที่ได้หารด้วยผลรวม
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}