// Real-world application examples for lesson topics
// Maps lesson IDs and subject keywords to real-world usage examples

export function getRealWorldExamples(lesson) {
  if (!lesson) return [];

  // Check for specific lesson ID matches first
  const idMap = {
    'c9_r_1': [
      { icon: '🏭', context: 'Factories', desc: 'Industrial robotic arms assemble cars and electronics' },
      { icon: '🏥', context: 'Hospitals', desc: 'Da Vinci surgical robot performs minimally invasive surgery' },
      { icon: '🚀', context: 'Space (NASA/ISRO)', desc: 'Mars rovers like Perseverance explore other planets' },
      { icon: '🚗', context: 'Self-Driving Cars', desc: 'Autonomous vehicles sense and navigate traffic' },
      { icon: '🏠', context: 'Homes', desc: 'Roomba vacuum robots clean floors autonomously' },
    ],
    'c9_r_2': [
      { icon: '🚗', context: 'Self-Driving Cars', desc: 'Sense traffic, plan lane changes, and act by steering' },
      { icon: '📦', context: 'Warehouses', desc: 'Amazon robots navigate aisles using LIDAR sensors' },
      { icon: '🚁', context: 'Drones', desc: 'Adjust flight path based on wind and obstacle sensors' },
      { icon: '🤖', context: 'Manufacturing', desc: 'Robotic arms sense, plan welds, and act with precision' },
    ],
    'c9_r_6': [
      { icon: '🏭', context: 'Manufacturing', desc: 'Robotic arms weld, paint, and assemble in factories' },
      { icon: '🏥', context: 'Healthcare', desc: 'Da Vinci robot enables precise minimally invasive surgery' },
      { icon: '🌾', context: 'Agriculture', desc: 'Drones monitor crops and robots harvest produce' },
      { icon: '📦', context: 'Logistics', desc: 'Amazon uses 200,000+ warehouse robots for shipping' },
      { icon: '🚀', context: 'Space', desc: 'Perseverance rover explores Mars and collects samples' },
    ],
    'c9_r_8': [
      { icon: '🤖', context: 'Robotics', desc: 'Arduino Uno serves as the brain of DIY robots' },
      { icon: '🏠', context: 'Smart Home', desc: 'ESP32 controls lights, fans, and sensors via WiFi' },
      { icon: '🚁', context: 'Drones', desc: 'Flight controllers integrate motors, IMU, and GPS' },
      { icon: '🏭', context: 'Industry', desc: 'PLCs control assembly lines and manufacturing' },
    ],
  };

  if (idMap[lesson.id]) return idMap[lesson.id];

  // Subject-based fallbacks
  const subject = lesson.subject || '';
  const title = (lesson.title || '').toLowerCase();
  const concepts = (lesson.keyConcepts || []).join(' ').toLowerCase();

  if (subject === 'Robotics' || title.includes('robot') || concepts.includes('robot')) {
    return [
      { icon: '🏭', context: 'Factories', desc: 'Industrial robots assemble, weld, and paint products' },
      { icon: '🏥', context: 'Hospitals', desc: 'Surgical robots perform precise operations' },
      { icon: '🚀', context: 'Space (ISRO/NASA)', desc: 'Rovers explore planets and satellites' },
      { icon: '🚗', context: 'Self-Driving Cars', desc: 'Autonomous vehicles navigate using sensors' },
      { icon: '🏠', context: 'Homes', desc: 'Cleaning robots and smart home automation' },
    ];
  }

  if (subject === 'Python Programming' || title.includes('python') || title.includes('variable') || title.includes('programming')) {
    return [
      { icon: '🤖', context: 'Robotics', desc: 'Python controls robots via Raspberry Pi' },
      { icon: '🧠', context: 'AI & Machine Learning', desc: 'Python powers TensorFlow, PyTorch, and ChatGPT' },
      { icon: '🎮', context: 'Game Development', desc: 'Python scripts game logic and automation' },
      { icon: '🌐', context: 'Web Apps', desc: 'Instagram, YouTube, and Spotify use Python' },
      { icon: '🔬', context: 'Data Science', desc: 'Python analyzes scientific and business data' },
    ];
  }

  if (subject === 'Artificial Intelligence' || title.includes('ai') || concepts.includes('neural') || concepts.includes('learning')) {
    return [
      { icon: '📱', context: 'Smartphones', desc: 'Face ID, Siri, and Google Assistant use AI' },
      { icon: '🚗', context: 'Self-Driving Cars', desc: 'AI detects obstacles and plans routes' },
      { icon: '🏥', context: 'Healthcare', desc: 'AI diagnoses diseases from X-rays and MRIs' },
      { icon: '🎬', context: 'Entertainment', desc: 'Netflix and YouTube use AI for recommendations' },
      { icon: '💬', context: 'Chatbots', desc: 'ChatGPT and virtual assistants use NLP' },
    ];
  }

  if (subject === 'Computing Fundamentals' || subject === 'Computing' || title.includes('binary') || title.includes('logic gate')) {
    return [
      { icon: '📱', context: 'Smartphones', desc: 'Every app runs on binary logic gates' },
      { icon: '💻', context: 'Computers', desc: 'CPUs process billions of logic operations per second' },
      { icon: '🚦', context: 'Traffic Lights', desc: 'Logic circuits control traffic signal timing' },
      { icon: '🌀', context: 'Washing Machines', desc: 'Logic gates control wash cycles and timing' },
      { icon: '🎮', context: 'Gaming', desc: 'Game physics and AI use binary logic' },
    ];
  }

  if (subject === 'Microcontrollers' || title.includes('arduino') || title.includes('esp') || title.includes('sensor')) {
    return [
      { icon: '🏠', context: 'Smart Home', desc: 'ESP32 controls lights, temperature, and security' },
      { icon: '🚗', context: 'Automotive', desc: 'Microcontrollers manage engines, brakes, and airbags' },
      { icon: '🤖', context: 'Robotics', desc: 'Arduino controls motors, sensors, and actuators' },
      { icon: '📱', context: 'IoT Devices', desc: 'Microcontrollers power smart wearables and gadgets' },
      { icon: '🏭', context: 'Industry', desc: 'PLCs automate manufacturing processes' },
    ];
  }

  if (subject === 'Mechanical Systems' || title.includes('motor') || title.includes('gear') || title.includes('linkage')) {
    return [
      { icon: '🚁', context: 'Drones', desc: 'Brushless motors provide thrust and stability' },
      { icon: '💨', context: 'Fans', desc: 'Electric motors power ceiling and table fans' },
      { icon: '🚗', context: 'Electric Cars', desc: 'Motors drive EVs like Tesla and Tata Nexon EV' },
      { icon: ' elevator', context: 'Lifts', desc: 'Motors and gears move elevators safely' },
      { icon: '🏭', context: 'Industry', desc: 'Motors power conveyor belts, pumps, and machinery' },
    ];
  }

  // Generic fallback
  return [
    { icon: '🏭', context: 'Industry', desc: 'Used in manufacturing and automation systems' },
    { icon: '🏠', context: 'Daily Life', desc: 'Found in household devices and appliances' },
    { icon: '🚀', context: 'Cutting Edge', desc: 'Applied in space, defense, and research' },
    { icon: '📱', context: 'Technology', desc: 'Powers modern gadgets and smart devices' },
  ];
}