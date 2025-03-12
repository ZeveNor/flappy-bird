class JsonLoader {
  static getConfig() {
    const config = {
      model_input: 5,
      model_hidden: 8,
      model_output: 2,
      canvas_width: 800,
      canvas_height: 500,
      bird_summon: 200,
      tensor_engine: "cpu",
      start_speed: 1,
      summon_rate: 1.10,
      bird_start_y: 250,
      bird_start_x: 50,
      bird_gravity: 0.8,
      bird_lift: -12,
      bird_velocity: 0, // ไม่ต้องปรับ
      bird_size: 15, 
      bird_color: "rgba(93, 14, 65, 0.3)",
      bird_mutation: 0.2, // ทำให้นกมีวิวัฒนาการโดยใช้ Gussian Gradient
      pipe_spacing: 120, // ความกว้างของช่อง
      pipe_width: 60,
      pipe_speed: 6,
      pipe_color: '#FF204E',
    };
    return config;
  }
}