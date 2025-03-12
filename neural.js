class NeuralNetwork {
  // a b c d คือขนาดของ neural ที่เราเซ็ตไว้ใน bird.js
  constructor(a, b, c, d) {
    
    // กรณีที่พบว่า a ถูกสร้างโดย tensorflow
    if (a instanceof tf.Sequential) {
      this.model = a;           // ตัวก็อปปี้ สร้างโดย tensorflow ดูบรรทัดที่ 33 ประกอบ
      this.input_nodes = b;     // input 5 node
      this.hidden_nodes = c;    // hidden 8 node
      this.output_nodes = d;    // output 2 node
    }
    // กรณีที่ เพิ่งเริ่มเกม ใช้ node เบื้องต้น ข้อมูลเริ่มต้น
    else {
      this.input_nodes = a;  // input 5 node
      this.hidden_nodes = b; // hiddent 8 node
      this.output_nodes = c; // output 2 node
      this.model = this.createModel(); // สร้าง โมเดลแรก โดยใช้ tensorflow
    }
  }

  // สร้างตัวก็อปปี้
  // การสร้างตัวก็อปปี้ ทั้งโมเดลและน้ำหนักของโมเดล
  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  // กลายพันธุ์น้ำหนักของโมเดล โดยใช้ Gaussian noise เพื่อเพิ่มความหลากหลาย
  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  // ลบโมเดล
  dispose() {
    this.model.dispose();
  }

  // พยากรณ์ค่าผลลัพธ์จากโมเดล โดยใช้ข้อมูลเข้า (`inputs`) และคืนค่าออกมา
  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      return outputs;
    });
  }

  // สร้างโมเดล Neural Network โดยใช้ Dense layers พร้อมกับ activation functions: 
  // - hidden layer ใช้ `sigmoid` สำหรับ non-linearity
  // - output layer ใช้ `softmax` สำหรับการคาดเดาค่าความน่าจะเป็น
  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: 'sigmoid'
    });
    model.add(hidden);
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'softmax'
    });
    model.add(output);
    return model;
  }
}