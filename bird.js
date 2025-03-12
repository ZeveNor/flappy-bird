class Bird {
  constructor(info) {
    this.y = config.bird_start_y;       // ตำแหน่งแนวตั้งเริ่มต้น
    this.x = config.bird_start_x;       // ตำแหน่งแนวนอนคงที่
    this.gravity = config.bird_gravity; // ค่าความเร่งของแรงโน้มถ่วง
    this.lift = config.bird_lift;       // แรงยกเมื่อนกกระโดด
    this.velocity = config.bird_velocity;     // ความเร็วแนวตั้ง (เริ่มต้นที่ 0)
    this.size = config.bird_size; 

    this.score = 0; 
    this.fitness = 0;

    if (info) {
      // ใช้ info เริ่มต้น
      this.info = info.copy();
    } else {
      // สร้าง Neural ที่มี input 5 node, hidden 8 layer, output 2 node
      // output จำนวน 2 node คือ
      // output แรก ความมั่นใจที่นกจะกระโดด
      // output สอง ความมั่นใจที่นกจะไม่กระโดด
      // ถ้า มั่นใจว่าจะกระโดดมากกว่า ไม่กระโดด ให้นก กระโดด
      // ถ้า มั่นใจว่าจะไม่กระโดดมากกว่า กระโดด ให้นก ไม่กระโดด
      this.info = new NeuralNetwork(
        config.model_input,
        config.model_hidden,
        config.model_output
      );
    }
  }

  // ลบโมเดลนกทิ้ง
  dispose() {
    this.info.dispose();
  }

  // แสดงผลนก
  show() { 
    // edit color bird
    fill(config.bird_color);  
    // คำสั่งวาดวงกลม นก ในตำแหน่ง x,y ขนาด bird_size
    ellipse(this.x, this.y, this.size * 2, this.size * 2);
  }

  // jump
  up() {
    this.velocity += this.lift;
  }

  // ทำให้นกมีวิวัฒนาการโดยใช้ Gussian Gradient
  mutate() {
    this.info.mutate(config.bird_mutation);
  }

  think(pipes) {
    // Find the closest pipe to add into input layer of Neural
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x + pipes[i].w - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    // Neural จะมีข้อมูลขาเข้า ทั้งหมด 5 โหนด
    // 1 ความสูงของนก
    // 2 ระยะเสาบน
    // 3 ระยะเสาล่าง
    // 4 ระยะของเสาใกล้นกเท่าไหร่แล้ว
    // 5 ความเร็วที่นกกระโดดขึ้นข้างบน เช่นเรากด spacebar ถี่ๆ นกมันก็จะบินขึ้นบนเร็ว
    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10;
    let output = this.info.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }
  }

  // หลุดจากจอ ออกนอกเฟรมแนวแกน y
  offScreen() {
    return this.y > height || this.y < 0;
  }

  update() {
    this.score++;
    this.velocity += this.gravity;
    this.y += this.velocity;
  }
}