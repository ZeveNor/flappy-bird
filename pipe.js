class Pipe {
  constructor() {
    this.spacing = config.pipe_spacing;
    this.top = random(config.canvas_height / 6, (3 / 4) * config.canvas_height);
    this.bottom = config.canvas_height - (this.top + this.spacing);
    this.x = config.canvas_width; // ตำแหน่ง เสาเกิด ขวาสุด
    this.w = config.pipe_width; // ความกว้างเสา
    this.speed = config.pipe_speed;
    this.passed = false
  }

  // ถ้านกชนเสา คือ true ไม่ชนคืน false
  hits(bird) {
    if (bird.y < this.top || bird.y + bird.size > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // แสดงเสาบนเฟรม
  show() {
    fill(config.pipe_color);
    rectMode(CORNER);
    // เสาบน
    rect(this.x, 0, this.w, this.top);
    // เสาล่าง
    rect(this.x, config.canvas_height - this.bottom, this.w, this.bottom);
  }

  update() {
    // this.x -= this.speed ลดทีละ 6 ทุกครั้งที่วนลูป
    // ขวาสุดคือ ความยาวของ canvas 800 ลด x ทีละ 6 คือ 794 788 782 776..
    this.x -= this.speed;
  }

  // เสาหลุดจากจอมั้ย
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
  
  // มีนกผ่านเสามั้ย
  checkPassed(bird) {
    if (!this.passed && bird.x > this.x + this.w) {
      this.passed = true;
      return true;
    }
    return false;
  }
}