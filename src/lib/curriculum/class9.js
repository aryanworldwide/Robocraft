export const class9Data = {
  id: "class_9", name: "Class 9",
  description: "Foundation of Robotics, Python, AI & Computing",
  gradient: "from-cyan-500/20 to-blue-600/20",
  subjects: [
    {
      id: "robotics", name: "Robotics", icon: "Bot", color: "#00D2FF",
      lessons: [
        { id:"c9_r_1", title:"Introduction to Robotics", subject:"Robotics", difficulty:"Beginner", readingTime:12, objectives:["Understand what robotics is","Identify the interdisciplinary nature of robotics","Recognize robotics in modern society"],
          theory:"What is Robotics?\nRobotics is a branch of engineering and science. It brings together three main fields: mechanical engineering (building and moving things), electrical engineering (electronics and circuits), and computer science (programming and software). Robotics deals with the design, construction, operation, and use of robots.\n\nWhere does the word 'robot' come from?\nThe word 'robot' comes from the Czech word 'robota', which means 'forced labor'. It was first used by the writer Karel Čapek in his 1920 play called R.U.R. (Rossum's Universal Robots).\n\nWhat is a robot?\nA robot is a machine capable of carrying out complex actions automatically. Unlike a simple machine, a robot can sense its surroundings, process information, and act on its own. Robotics is not only about physical robots — it also includes software robots (called 'bots') that automate tasks on computers. So robotics also encompasses AI and software automation.\n\nWhat fields make up robotics?\nRobotics combines mechanical engineering, electrical engineering, and computer science. Note that culinary arts (cooking) is NOT a part of robotics.\n\nReal-world examples of robots:\n• The Da Vinci system is a surgical robot used for minimally invasive surgery.\n• The Perseverance rover is a robot that NASA sent to explore Mars (landed in 2021).\n• The Roomba is a domestic (home) robot that cleans floors.\n• Industrial robotic arms are used in car manufacturing.\n\nWho built the first industrial robot?\nGeorge Devol invented Unimate, the first industrial robot. It was installed at a General Motors (GM) factory in 1961.\n\nSummary of robot examples:\n• Mars exploration → Perseverance Rover\n• Surgery → Da Vinci\n• Floor cleaning → Roomba\n\nModern robotics uses sensors (to perceive), actuators (to move), and intelligent algorithms (to make decisions).",
          keyConcepts:["Robotics definition","Interdisciplinary field","Robot vs Machine","Karel Čapek","Modern applications"],
          examples:["Industrial robotic arms in car manufacturing","Surgical robots like Da Vinci","Mars Rover exploring space","Roomba vacuum cleaning robots"],
          summary:"Robotics is a multidisciplinary field combining mechanics, electronics, and programming to build intelligent machines that interact with the physical world.",
          activity:"Research and list 5 robots used in everyday life. For each, identify what sensors, actuators, and programming they might use.",
          miniProject:"Create a poster showing the evolution of robots from ancient automatons to modern AI-powered machines.",
          notes:"Robotics is not just about building physical robots — it also encompasses software robots (bots) used in automation.",
          videoUrl:"https://www.youtube.com/watch?v=3XkL0qQ21Oo", videoTitle:"Introduction to Robotics",
          relatedLessons:["c9_r_2","c9_r_3"] },
        { id:"c9_r_2", title:"Understanding Robotics", subject:"Robotics", difficulty:"Beginner", readingTime:15,
          objectives:["Differentiate between robots and machines","Understand core principles of robotics","Identify key components of a robotic system"],
          theory:"Three Fundamental Pillars of Robotics:\nTo understand robotics, you need to know three fundamental pillars:\n1. Sensing — the robot perceives (sees/feels) its environment using sensors.\n2. Processing — the robot's brain (computer/microcontroller) makes decisions based on sensor data.\n3. Acting — the robot carries out physical actions using actuators (motors, etc.).\n\nThe Sense-Plan-Act Cycle:\nThis is the fundamental operating principle of all robots. The cycle works like this:\n• Sense: Sensors gather data from the environment (e.g., distance, temperature, light).\n• Plan: The processor analyzes the data and decides what to do.\n• Act: Actuators carry out the physical action based on the decision.\nThis cycle repeats continuously while the robot operates.\n\nRobot vs Simple Machine:\nA robot differs from a simple machine because a robot can sense its environment, process information, and act autonomously (on its own). A washing machine is automated but not a full robot. The degree of autonomy (how independently it operates) is what distinguishes a robot from a simple machine.\n\nExamples:\n• A self-driving car senses traffic and makes lane-change decisions.\n• A warehouse robot navigates aisles using LIDAR sensors.\n• A drone adjusts its flight path based on wind sensors.",
          keyConcepts:["Sense-Plan-Act cycle","Autonomy levels","Robot vs automated machine","Feedback loops","Control systems basics"],
          examples:["A self-driving car sensing traffic and making lane-change decisions","A warehouse robot navigating aisles using LIDAR","A drone adjusting flight path based on wind sensors"],
          summary:"Robotics operates on the Sense-Plan-Act cycle where robots perceive, process, and act autonomously.",
          activity:"Observe a simple automated device at home (like a washing machine) and compare it to a robot. List the differences in sensing, processing, and acting.",
          notes:"The degree of autonomy distinguishes a robot from a simple machine.",
          videoUrl:"https://www.youtube.com/watch?v=UR6eC-hz-1c", videoTitle:"How Robots Work",
          relatedLessons:["c9_r_1","c9_r_3"] },
        { id:"c9_r_3", title:"Evolution of Robots", subject:"Robotics", difficulty:"Beginner", readingTime:14,
          objectives:["Trace the history of robotics","Identify key milestones","Understand how robotics evolved with technology"],
          theory:"How Robots Evolved Over Time:\nThe evolution of robots spans thousands of years. Here are the key milestones:\n\nAncient Times:\n• Ancient civilizations created automatons — mechanical devices that mimicked living beings.\n• In 250 BC, Ctesibius built water clocks with moving figures.\n\n1495 — Leonardo da Vinci:\nLeonardo da Vinci designed a mechanical knight — a human-like machine made of gears and pulleys.\n\n1954-1961 — The First Industrial Robot:\nGeorge Devol invented Unimate, the first industrial robot. It was installed at a General Motors (GM) factory in 1961. This was a major milestone in robotics history.\n\nModern Era — AI-Powered Robots:\nToday's robots are powered by Artificial Intelligence (AI). They can learn and adapt to new situations. Examples include:\n• Boston Dynamics' Atlas (2013) — a humanoid robot that can walk, run, and do backflips.\n• Sophia (2016) — a humanoid robot that can hold conversations and express emotions.\n\nKey Takeaway:\nRobots evolved from ancient mechanical automatons to modern AI-powered machines that can think, learn, and adapt.",
          keyConcepts:["Ancient automatons","Industrial Revolution","Unimate - first industrial robot","Modern AI robots","Future of robotics"],
          examples:["Ctesibius's water clock (250 BC)","Da Vinci's mechanical knight (1495)","Unimate at GM factory (1961)","Boston Dynamics Atlas (2013)","Sophia the humanoid (2016)"],
          summary:"Robots evolved from ancient mechanical automatons to modern AI-powered machines.",
          activity:"Create a timeline of robotics history with at least 10 major milestones.",
          videoUrl:"https://www.youtube.com/watch?v=xh-3dBCjSBE", videoTitle:"History of Robotics",
          relatedLessons:["c9_r_1","c9_r_4"] },
        { id:"c9_r_4", title:"Laws of Robotics", subject:"Robotics", difficulty:"Beginner", readingTime:10,
          objectives:["Learn Asimov's Three Laws","Understand ethical implications","Discuss modern ethical frameworks"],
          theory:"Asimov's Three Laws of Robotics:\nIsaac Asimov, a famous science fiction writer, proposed the Three Laws of Robotics in 1942. These are rules that robots must follow to ensure safety:\n\nFirst Law: A robot may not injure a human or, through inaction, allow a human to come to harm.\n→ This means robots must never hurt people, and they must also not let people get hurt if they can prevent it.\n\nSecond Law: A robot must obey orders given by humans, except where those orders conflict with the First Law.\n→ Robots must follow human instructions, but not if it would hurt someone.\n\nThird Law: A robot must protect its own existence, as long as it doesn't conflict with the First or Second Law.\n→ Robots should avoid being damaged, but human safety always comes first.\n\nThe Zeroth Law:\nLater, Asimov added a Zeroth Law: A robot may not harm humanity as a whole. This law is even more important than the first three.\n\nWhy Do These Laws Matter?\nWhile these laws were written for fiction (stories), they have influenced real-world discussions about AI safety and robot ethics. Today, engineers and ethicists discuss how to make autonomous systems (like self-driving cars) safe and ethical.\n\nModern Ethical Questions:\n• Self-driving cars: What should the car do in an unavoidable accident?\n• Military drones: Should robots be allowed to make life-or-death decisions?\n• Medical robots: Who is responsible if a surgical robot makes a mistake?",
          keyConcepts:["Asimov's Three Laws","Zeroth Law","Robot ethics","AI safety","Autonomous decision-making"],
          examples:["Self-driving car ethical dilemmas","Military drone ethics","Medical robot decision-making","AI content moderation"],
          summary:"Asimov's Laws of Robotics form the foundation of modern discussions about robot ethics and AI safety.",
          activity:"Write a short essay discussing how Asimov's Laws might apply to modern AI systems like self-driving cars.",
          videoUrl:"https://www.youtube.com/watch?v=7PKx3kS7f4A", videoTitle:"Asimov's Laws of Robotics",
          relatedLessons:["c9_r_3","c9_r_5"] },
        { id:"c9_r_5", title:"Classification of Robots", subject:"Robotics", difficulty:"Intermediate", readingTime:15,
          objectives:["Classify robots by application","Classify by locomotion","Classify by intelligence level"],
          theory:"How Are Robots Classified?\nRobots can be classified in three main ways:\n\n1. Classification by Application (what the robot does):\n• Industrial robots — assemble cars and electronics in factories (e.g., SCARA robots).\n• Service robots — serve people in homes, hotels, and offices (e.g., a delivery robot in a hotel, or Roomba for cleaning).\n• Medical robots — assist in surgery (e.g., Da Vinci surgical system).\n• Military robots — do reconnaissance and bomb disposal (e.g., Predator drone).\n• Space robots — explore planets (e.g., Mars rovers).\n\n2. Classification by Locomotion (how the robot moves):\n• Wheeled robots — move on wheels.\n• Legged robots — walk on legs. A quadruped has 4 legs (like Boston Dynamics' Spot). A hexapod has six legs ('hexa' means six).\n• Flying robots — drones and UAVs.\n• Swimming robots — underwater vehicles.\n• Stationary robots — fixed in one place (like industrial arms).\n\n3. Classification by Intelligence (how independent the robot is):\n• Pre-programmed robots — follow fixed instructions.\n• Autonomous robots — make independent decisions on their own (they do NOT require human control).\n• Teleoperated robots — remotely controlled by a human operator.\n• Augmenting robots — enhance human capabilities (e.g., exoskeletons).\n\nKey Points:\n• Locomotion-based classification groups robots by how they move.\n• An exoskeleton is an augmenting robot.\n• A teleoperated robot is remotely controlled.\n• Autonomous robots make independent decisions without human control.\n• Drones are classified as flying robots.\n• SCARA robots are used in industrial manufacturing.\n• A hotel delivery robot is a service robot.\n• Boston Dynamics' Spot is a quadruped (legged) robot.",
          keyConcepts:["Application-based classification","Locomotion-based classification","Intelligence-based classification","Industrial vs service robots","Autonomous vs teleoperated"],
          examples:["SCARA robot (industrial)","Spot by Boston Dynamics (legged)","Predator drone (flying, military)","Da Vinci surgical system (medical)","Exoskeletons (augmenting)"],
          summary:"Robots are classified by application, locomotion, and intelligence level, guiding different design approaches.",
          activity:"Create a classification chart categorizing 10 different robots by application, locomotion, and intelligence level.",
          videoUrl:"https://www.youtube.com/watch?v=B4PlSQ0pjmg", videoTitle:"Types of Robots",
          relatedLessons:["c9_r_4","c9_r_6"] },
        { id:"c9_r_6", title:"Real World Robots", subject:"Robotics", difficulty:"Beginner", readingTime:12,
          objectives:["Explore real-world applications","Understand industry impact","Analyze benefits and challenges"],
          theory:"Robots in the Real World:\nRobots are transforming industries all over the world. Here is how robots are used in different fields:\n\nManufacturing:\nIn factories, robots assemble cars and electronics. Industrial robotic arms can weld, paint, and move heavy parts with precision.\n\nHealthcare:\nThe Da Vinci system is a surgical robot that performs minimally invasive surgery. This means smaller cuts, less pain, and faster recovery for patients.\n\nAgriculture:\nRobots harvest crops, monitor soil health, and spray pesticides. Agricultural drones fly over fields to check crop health from above.\n\nLogistics:\nAmazon uses over 200,000 warehouse robots to move packages and sort products. These robots make shipping faster and more efficient.\n\nSpace Exploration:\nThe Perseverance rover explores Mars. It collects rock samples, takes photos, and searches for signs of ancient life.\n\nHome and Daily Life:\nAt home, robots like Roomba (vacuum cleaning) and Alexa (voice assistant) help with daily tasks. The NAO robot is used in education to teach students about robotics.\n\nKey Takeaway:\nRobots are deployed across manufacturing, healthcare, agriculture, logistics, education, and space exploration. They improve efficiency, safety, and capabilities in every industry.",
          keyConcepts:["Industrial automation","Healthcare robotics","Agricultural robots","Logistics automation","Educational robots"],
          examples:["Amazon warehouse robots","Da Vinci surgical robot","Agricultural drones","Mars Perseverance rover","NAO educational robot"],
          summary:"Robots are deployed across manufacturing, healthcare, agriculture, logistics, education, and space exploration.",
          activity:"Visit a local factory or watch a documentary about robotic automation. Write a report on how robots improve efficiency.",
          videoUrl:"https://www.youtube.com/watch?v=iAKTj4rG3DM", videoTitle:"Robots in the Real World",
          relatedLessons:["c9_r_5","c9_r_7"] },
        { id:"c9_r_7", title:"Robot as a System", subject:"Robotics", difficulty:"Intermediate", readingTime:14,
          objectives:["Understand the systems approach","Identify subsystems within a robot","Learn how subsystems interact"],
          theory:"A Robot as a System:\nA robot is not just one thing — it is a complex system made of interconnected subsystems. Each subsystem has a specific job, and they all work together through communication protocols (rules for exchanging data).\n\nThe Five Subsystems of a Robot:\n\n1. Mechanical Subsystem:\nIncludes the physical structure, joints, and end-effectors (grippers, tools). This is the robot's body — the frame, arms, and moving parts.\n\n2. Electrical Subsystem:\nIncludes motors, batteries, and wiring. This provides the power and electrical connections that make the robot work.\n\n3. Sensing Subsystem:\nIncludes various sensors (cameras, distance sensors, touch sensors). This is how the robot perceives its environment.\n\n4. Computing Subsystem:\nIncludes microcontrollers and processors (like Arduino or Raspberry Pi). This is the robot's brain — it processes data and makes decisions.\n\n5. Software Subsystem:\nIncludes the operating system, control algorithms, and application programs. This is the code that tells the robot what to do.\n\nHow They Work Together:\nAll five subsystems communicate and coordinate. For example:\n• A drone's flight controller integrates GPS, IMU, and motor control.\n• A robotic arm coordinates joint motors with vision sensors.\n• An autonomous car integrates LIDAR, cameras, and GPS.\n\nSystems Thinking:\nUnderstanding a robot as a system means looking at how all parts interact, not just each part alone. This approach is called 'systems thinking.'",
          keyConcepts:["Systems thinking","Mechanical subsystem","Electrical subsystem","Sensing subsystem","Computing and software subsystems"],
          examples:["A drone's flight controller integrating GPS, IMU, and motor control","A robotic arm coordinating joint motors with vision sensors","An autonomous car integrating LIDAR, cameras, and GPS"],
          summary:"A robot is a system of interconnected subsystems — mechanical, electrical, sensing, computing, and software.",
          activity:"Choose a robot and create a system diagram showing all its subsystems and their interactions.",
          videoUrl:"https://www.youtube.com/watch?v=k_S5fnKjO8E", videoTitle:"Robot Systems",
          relatedLessons:["c9_r_6","c9_r_8"] },
        { id:"c9_r_8", title:"Building Blocks of Robots", subject:"Robotics", difficulty:"Intermediate", readingTime:16,
          objectives:["Identify essential components","Understand each building block's function","Learn how components work together"],
          theory:"Building Blocks of a Robot:\nEvery robot is built from fundamental building blocks. Each block has a specific job:\n\n1. Structural Frame:\nThe physical body of the robot. It holds everything together. Made from materials like aluminum, plastic, or 3D-printed parts.\n\n2. Actuators (Motors and Servos):\nThese create movement. They are the 'muscles' of the robot. Examples: DC motors for wheels, servo motors for precise arm movements.\n\n3. Sensors:\nThese perceive (sense) the environment. They are the 'eyes and ears' of the robot. Examples: HC-SR04 ultrasonic sensor (measures distance), IR sensors, cameras.\n\n4. Controllers:\nThese process data and control the actuators. They are the 'brain' of the robot. Examples: Arduino Uno, Raspberry Pi.\n\n5. Power Supply:\nBatteries provide energy. Examples: Li-Po batteries for drones, AA batteries for simple robots.\n\n6. Communication Modules:\nThese enable data exchange between the robot and other devices. Examples: HC-05 Bluetooth module, WiFi modules.\n\n7. End-Effectors:\nThese interact with the environment. Examples: grippers (to grab objects), wheels (to move), tools (to cut or weld).\n\n8. Software:\nThe code that ties everything together and tells the robot what to do.\n\nSummary:\nRobots are built from: frame, actuators, sensors, controllers, power supply, communication modules, end-effectors, and software.",
          keyConcepts:["Structural frame","Actuators and motors","Sensors and perception","Controllers and processors","Power supply","Communication modules","End-effectors"],
          examples:["Arduino Uno as a controller","HC-SR04 ultrasonic sensor","Servo motors for precise control","Li-Po batteries for power","HC-05 Bluetooth module"],
          summary:"Robots are built from frames, actuators, sensors, controllers, power supplies, communication modules, and end-effectors.",
          activity:"Gather basic electronic components (LED, resistor, battery, switch) and build a simple circuit. Document each component's role.",
          miniProject:"Design a block diagram of a line-following robot, labeling all building blocks.",
          videoUrl:"https://www.youtube.com/watch?v=z437yxuYbQY", videoTitle:"Robot Building Blocks",
          relatedLessons:["c9_r_7","c9_r_9"] },
        { id:"c9_r_9", title:"Identification of Robots", subject:"Robotics", difficulty:"Beginner", readingTime:10,
          objectives:["Learn to identify robots in everyday life","Distinguish robots from automated machines","Recognize robot characteristics"],
          theory:"How to Identify a Robot:\nNot every automated device is a robot. A device qualifies as a robot if it has ALL four of these capabilities:\n\n1. Sensing Capability: It can perceive (sense) its environment using sensors.\n2. Processing Capability: It can make decisions based on sensor data.\n3. Actuation Capability: It can act physically (move, grab, etc.).\n4. Some Degree of Autonomy: It can operate on its own without constant human control.\n\nRobot vs Automated Machine:\n• A vending machine is automated but NOT a robot. Why? Because it lacks sensing and autonomous decision-making. It just follows a fixed sequence when you press a button.\n• A Roomba IS a robot. Why? Because it senses obstacles, plans paths, and moves autonomously.\n• A remote-control car is NOT a robot. Why? Because it has no autonomy — a human controls every movement.\n• A drone with autonomous flight IS a robot. Why? Because it can fly on its own using sensors and programming.\n• A self-driving car IS a robot. Cruise control is just automation (not a full robot).\n\nKey Rule:\nIf a device can sense, process (think), act, and operate with some autonomy, it is a robot. If it just follows fixed steps without sensing or thinking, it is an automated machine, not a robot.",
          keyConcepts:["Robot identification criteria","Sensing capability","Processing capability","Actuation capability","Degree of autonomy"],
          examples:["Roomba (robot) vs vending machine (not a robot)","Self-driving car (robot) vs cruise control (automation)","Drone with autonomous flight (robot) vs remote-control car (not a robot)"],
          summary:"A device is a robot if it can sense, process, act, and operate with some autonomy.",
          activity:"Walk around your home or school and identify 5 devices. Determine if each is a robot, automated machine, or simple machine.",
          relatedLessons:["c9_r_8","c9_r_10"] },
        { id:"c9_r_10", title:"Concepts in Robotics", subject:"Robotics", difficulty:"Intermediate", readingTime:18,
          objectives:["Understand fundamental robotics concepts","Learn about feedback and control","Explore workspace and payload"],
          theory:"Key Concepts in Robotics:\nHere are the fundamental concepts every roboticist should know:\n\n1. Workspace:\nThe workspace is the volume (area/space) that a robot's end-effector (hand/gripper) can reach. It defines the robot's working area.\n\n2. Payload:\nThe payload is the maximum weight a robot can carry or lift. If a robot's payload is 5kg, it cannot safely lift more than 5kg.\n\n3. Accuracy:\nAccuracy is how close the robot gets to a target position. If you tell the robot to go to point (10, 20), accuracy measures how close it actually gets.\n\n4. Repeatability:\nRepeatability is how consistently the robot returns to the same position. If you ask the robot to go to the same point 100 times, repeatability measures how close each attempt is to the others. A robot with 0.1mm repeatability is very precise.\n\n5. Degrees of Freedom (DOF):\nDOF describes the number of independent movements a robot can make. More DOF means more flexibility but also more complexity in control.\n\n6. Open-Loop vs Closed-Loop Control:\n• Open-loop control: The robot executes commands without checking the results. Example: a conveyor belt runs at a set speed without checking if items are placed correctly.\n• Closed-loop control (feedback control): The robot uses sensor data to correct errors in real-time. Example: a thermostat measures room temperature and turns the heater on/off to maintain the target temperature.\n\n7. Speed and Acceleration:\nHow fast the robot moves and how quickly it can speed up or slow down.",
          keyConcepts:["Workspace and reach","Payload capacity","Accuracy vs repeatability","Speed and acceleration","Degrees of freedom","Open-loop vs closed-loop control"],
          examples:["An industrial arm with 6 DOF reaching all points in its workspace","A conveyor belt (open-loop) vs a thermostat (closed-loop)","A robot with 0.1mm repeatability in precision manufacturing"],
          summary:"Core concepts include workspace, payload, accuracy, repeatability, DOF, and feedback control.",
          activity:"Calculate the workspace of your arm by measuring your reach in different directions.",
          videoUrl:"https://www.youtube.com/watch?v=ZM0qHYPE0SQ", videoTitle:"Key Robotics Concepts",
          relatedLessons:["c9_r_9","c9_r_11"] },
        { id:"c9_r_11", title:"Actuators", subject:"Robotics", difficulty:"Intermediate", readingTime:15,
          objectives:["Understand what actuators are","Learn types of actuators","Compare electric, hydraulic, and pneumatic"],
          theory:"What Are Actuators?\nActuators convert energy into physical motion. They are the 'muscles' of a robot — they make the robot move. Without actuators, a robot would be completely still.\n\nThree Main Types of Actuators:\n\n1. Electric Actuators:\nThese use electricity to create motion. They are the most common type in robotics.\n• DC motors: Provide continuous rotation. The speed is controlled by voltage. Good for wheels and fans.\n• Servo motors: Provide precise angular control (e.g., 0-180°). Good for robotic arm joints.\n• Stepper motors: Move in precise, fixed steps (e.g., 1.8° per step). Good for 3D printers and CNC machines.\n\n2. Hydraulic Actuators:\nThese use pressurized fluid (usually oil) to create powerful motion. They provide high force (strength). Good for heavy-duty applications like excavators and industrial presses.\n\n3. Pneumatic Actuators:\nThese use compressed air to create fast, lightweight motion. They are good for quick, repetitive actions like grippers on assembly lines.\n\nComparing the Three Types:\n• Electric actuators are precise and easy to control.\n• Hydraulic actuators provide the highest force (power).\n• Pneumatic actuators offer speed and are lightweight.\n\nExamples:\n• Servo motor in a robotic arm joint\n• Hydraulic pistons in an excavator\n• Pneumatic grippers on assembly lines\n• Stepper motors in 3D printers",
          keyConcepts:["Electric actuators (DC, servo, stepper)","Hydraulic actuators","Pneumatic actuators","Torque and speed","Motor control"],
          examples:["Servo motor in a robotic arm joint","Hydraulic pistons in an excavator","Pneumatic grippers on assembly lines","Stepper motors in 3D printers"],
          summary:"Actuators convert energy into motion. The three main types — electric, hydraulic, pneumatic — excel in different applications.",
          activity:"Compare three actuator types in a table: advantages, disadvantages, applications, and specifications.",
          miniProject:"Build a simple mechanism using a servo motor controlled by Arduino.",
          videoUrl:"https://www.youtube.com/watch?v=VxFGVFE7eCE", videoTitle:"Types of Actuators",
          relatedLessons:["c9_r_10","c9_r_12"] },
        { id:"c9_r_12", title:"Using Lines and Joints to Create Specific Motion", subject:"Robotics", difficulty:"Intermediate", readingTime:16,
          objectives:["Understand linkage mechanisms","Learn about joint types","Design simple mechanisms for specific motions"],
          theory:"What Are Mechanical Linkages?\nMechanical linkages are assemblies of rigid bodies (called 'links') connected by joints. They convert one type of motion into another. For example, a rotating motor can be converted into a back-and-forth pushing motion using a linkage.\n\nThe Four-Bar Linkage:\nThe four-bar linkage is the simplest closed-chain mechanism. It has four links connected in a loop. It is used in many everyday devices:\n• Windshield wipers on cars use a four-bar linkage to sweep back and forth.\n• An excavator arm uses multiple linkages to dig.\n\nTypes of Joints:\nJoints connect links and allow movement. The main types are:\n• Revolute joint: Allows rotation (spinning). Example: a door hinge.\n• Prismatic joint: Allows linear (straight-line) sliding. Example: a drawer slider.\n• Cylindrical joint: Allows both rotation and sliding.\n• Spherical joint: Allows rotation in all directions (like a ball-and-socket joint in your shoulder).\n• Planar joint: Allows sliding on a flat surface.\n\nGrashof's Law:\nGrashof's law helps determine if a link in a four-bar mechanism can rotate fully (360°). This is important when designing mechanisms.\n\nWhy Are Linkages Important?\nUnderstanding linkages and joints is crucial for designing robot arms, legs, and grippers. Every robot joint uses some type of linkage mechanism.",
          keyConcepts:["Linkage mechanisms","Four-bar linkage","Revolute joints","Prismatic joints","Crank-rocker mechanism","Grashof's law"],
          examples:["Windshield wiper (four-bar linkage)","Excavator arm (multiple linkages)","Scissors mechanism (revolute joint)","Car suspension"],
          summary:"Linkages and joints convert one type of motion into another, enabling complex robot movements.",
          activity:"Build a four-bar linkage using cardboard strips and brass fasteners. Experiment with different link lengths.",
          videoUrl:"https://www.youtube.com/watch?v=9FkXdJqxaGU", videoTitle:"Mechanical Linkages",
          relatedLessons:["c9_r_11","c9_r_13"] },
        { id:"c9_r_13", title:"Degree of Freedom in Robots", subject:"Robotics", difficulty:"Intermediate", readingTime:14,
          objectives:["Define Degree of Freedom (DOF)","Calculate DOF for simple mechanisms","Understand DOF in robotic arms"],
          theory:"What is Degree of Freedom (DOF)?\nDegree of Freedom (DOF) refers to the number of independent ways a system can move. Think of it as the number of directions or rotations something can do.\n\nDOF in 3D Space:\nA free body floating in 3D space has 6 DOF:\n• 3 Translational DOF: Moving along x (left/right), y (forward/backward), and z (up/down) axes.\n• 3 Rotational DOF: Rotating around x (roll), y (pitch), and z (yaw) axes.\nSo: 3 translational (x, y, z) + 3 rotational (roll, pitch, yaw) = 6 DOF total.\n\nHow Many DOF Do Robots Need?\nA robot arm needs at least 6 DOF to reach any position AND any orientation in 3D space. This means it can point the end-effector (gripper) in any direction.\n\nExamples of DOF:\n• A door hinge has 1 DOF — it can only rotate in one direction.\n• A SCARA robot has 4 DOF.\n• An industrial robot arm typically has 6 DOF.\n• The human arm has about 7 DOF (shoulder: 3, elbow: 1, wrist: 3). This is more than 6, making it a 'redundant' system.\n\nRedundant Robots:\nRobots with more than 6 DOF are called 'redundant robots.' They have extra flexibility to avoid obstacles and reach around things.\n\nGrübler's Formula:\nGrübler's formula is used to calculate the DOF of a mechanism:\nDOF = 3(n-1) - 2j₁ - j₂ (for planar mechanisms)\nwhere n = number of links, j₁ = number of lower pairs (1-DOF joints), j₂ = number of higher pairs (2-DOF joints).\n\nKey Takeaway:\nMore DOF means more flexibility, but also more complexity in control. At least 6 DOF is needed for full 3D positioning.",
          keyConcepts:["DOF definition","Translational vs rotational DOF","Grübler's formula","6-DOF for full positioning","Redundant robots"],
          examples:["Human arm has 7 DOF (shoulder: 3, elbow: 1, wrist: 3)","SCARA robot has 4 DOF","Industrial robot arm has 6 DOF","A door hinge has 1 DOF"],
          summary:"DOF defines a robot's independent movement capabilities. At least 6 DOF is needed for full 3D positioning.",
          activity:"Count the degrees of freedom in your arm from shoulder to fingertip.",
          miniProject:"Build a 3-DOF robotic arm model using cardboard and servo motors.",
          videoUrl:"https://www.youtube.com/watch?v=dekMbm7WtDQ", videoTitle:"Degrees of Freedom in Robotics",
          relatedLessons:["c9_r_12","c9_r_11"] }
      ]
    },
    {
      id: "python", name: "Python Programming", icon: "Code", color: "#4ADE80",
      lessons: [
        { id:"c9_p_1", title:"Introduction to Data and Programming with Python", subject:"Python Programming", difficulty:"Beginner", readingTime:12,
          objectives:["Understand the role of programming in robotics","Learn why Python is used","Set up Python environment"],
          theory:"What is Programming?\nProgramming is writing instructions that tell a computer what to do. In robotics, programming is used to:\n• Control sensors (read data from the environment)\n• Process data (make decisions)\n• Command actuators (make the robot move)\n\nWhy Python for Robotics?\nPython is one of the most popular programming languages for robotics because of its simplicity, readability, and extensive libraries. Python is popular due to its simplicity — NOT its complexity. It is easy to learn and use.\n\nWho Created Python?\nPython was created by Guido van Rossum in 1991. It was first released in that year.\n\nIs Python Interpreted or Compiled?\nPython is an interpreted language. This means the code is executed line by line by an interpreter (not compiled all at once into machine code).\n\nWhat Programming Paradigms Does Python Support?\nPython supports multiple programming paradigms (styles of programming):\n• Procedural programming\n• Object-oriented programming (OOP)\n• Functional programming\nSo Python does NOT support only object-oriented programming — it supports all three.\n\nKey Python Functions:\n• print() — outputs (displays) text on the screen. This is the command used to output text in Python.\n• input() — gets input from the user\n\nPython Indentation:\nPython uses whitespace (spaces/tabs) for code indentation instead of braces { } like other languages. This makes the code look clean and organized.\n\nPython Libraries:\nPython has a huge ecosystem of libraries:\n• TensorFlow — used for AI and machine learning\n• NumPy, Pandas — used for data science\n• ROS (Robot Operating System) — used for robotics. ROS stands for Robot Operating System.\n\nIDEs (where you write Python code):\nVS Code is a popular IDE that supports Python. Other options include PyCharm, IDLE, and Jupyter Notebook.",
          keyConcepts:["Programming fundamentals","Why Python for robotics","Python installation","IDE setup","Python philosophy"],
          examples:["print('Hello, Robot!') — first Python program","Using Python to control an LED on Arduino","Python script to process sensor data"],
          summary:"Python is ideal for robotics due to its simplicity, readability, and powerful libraries.",
          activity:"Install Python and an IDE. Write your first program that prints 'Hello, RoboCraft!'",
          videoUrl:"https://www.youtube.com/watch?v=kqtD5dpn9C8", videoTitle:"Python for Beginners",
          relatedLessons:["c9_p_2","c9_p_3"] },
        { id:"c9_p_2", title:"Familiarisation with Python", subject:"Python Programming", difficulty:"Beginner", readingTime:14,
          objectives:["Navigate the Python interpreter","Write and run Python scripts","Understand Python syntax basics"],
          theory:"Two Modes of Python:\nPython has two modes you can work in:\n\n1. Interactive Mode (REPL):\nIn interactive mode, you type one line at a time and Python executes it immediately. This is great for testing small snippets quickly. You can type '2 + 3' and Python immediately shows '5'.\n\n2. Script Mode:\nIn script mode, you write a complete program in a file (with .py extension) and run it all at once. This is used for real programs.\n\nPython Syntax Basics:\n• Indentation: Python uses indentation (whitespace) instead of braces { } to group code into blocks. This is very important — wrong indentation causes errors.\n• Comments: Comments start with the # symbol. Anything after # on a line is ignored by Python. Example: # This is a comment\n• Case Sensitivity: Python is case-sensitive. This means 'name', 'Name', and 'NAME' are three different variables.\n• Dynamic Typing: You don't need to declare the type of a variable. Python figures it out automatically. Example: x = 10 makes x an integer, x = 'hello' makes x a string.\n\nKey Functions:\n• print() — outputs (displays) text or values on the screen.\n• input() — gets text input from the user. Example: name = input('Enter your name: ')\n\nExample:\n>>> 2 + 3  # In interactive mode, this returns 5\nname = input('Enter name: ')  # Gets user input\n# This is a comment",
          keyConcepts:["Interactive vs script mode","Indentation rules","Comments","print() function","input() function","Case sensitivity"],
          examples:[">>> 2 + 3  # Interactive mode returns 5","name = input('Enter name: ')","# This is a comment"],
          summary:"Python offers interactive and script modes, uses indentation for blocks, and provides print() and input().",
          activity:"Open Python IDLE and experiment with the interactive mode. Try arithmetic and string operations.",
          videoUrl:"https://www.youtube.com/watch?v=rfscVS0vtbw", videoTitle:"Python Full Course",
          relatedLessons:["c9_p_1","c9_p_3"] },
        { id:"c9_p_3", title:"Data Types", subject:"Python Programming", difficulty:"Beginner", readingTime:16,
          objectives:["Identify Python data types","Understand type conversion","Use appropriate data types"],
          theory:"Python Data Types:\nPython has several built-in data types. Each type stores a different kind of data:\n\n1. Numeric Types:\n• int (integer): Whole numbers. Example: age = 15 (15 is an int)\n• float: Decimal numbers. Example: pi = 3.14 (3.14 is a float)\n• complex: Numbers with real and imaginary parts. Example: 2+3j\n\n2. Text Type:\n• str (string): Text. Written in quotes. Example: name = 'RoboCraft' ('RoboCraft' is a str)\n\n3. Boolean Type:\n• bool: True or False. Example: is_robot = True (True is a bool)\n\n4. Sequence Types:\n• list: Ordered, changeable collection. Written with []. Example: [1, 2, 3]\n• tuple: Ordered, unchangeable collection. Written with (). Example: (1, 2, 3)\n• range: A sequence of numbers. Example: range(5) gives 0,1,2,3,4\n\n5. Mapping Type:\n• dict (dictionary): Key-value pairs. Written with {}. Example: {'name': 'Robot', 'age': 5}\n\n6. Set Type:\n• set: Unordered collection of unique items. Written with {}. Example: {1, 2, 3}\n\nType Checking and Conversion:\n• Check a type using type(). Example: type(42) returns <class 'int'>\n• Convert between types: int('42') converts the string '42' to the integer 42. Similarly: float(), str(), bool().\n\nExample:\nage = 15  # int\npi = 3.14  # float\nname = 'RoboCraft'  # str\nis_robot = True  # bool\nint('42') → 42  # converts string to int",
          keyConcepts:["int, float, complex","str (strings)","bool (boolean)","list, tuple, range","dict (dictionary)","Type conversion","type() function"],
          examples:["age = 15  # int","pi = 3.14  # float","name = 'RoboCraft'  # str","is_robot = True  # bool","int('42') → 42"],
          summary:"Python provides numeric, text, boolean, and collection data types with built-in conversion functions.",
          activity:"Create variables of each data type and use type() to verify. Experiment with type conversions.",
          videoUrl:"https://www.youtube.com/watch?v=gCCVsvgR2KU", videoTitle:"Python Data Types",
          relatedLessons:["c9_p_2","c9_p_4"] },
        { id:"c9_p_4", title:"Variables", subject:"Python Programming", difficulty:"Beginner", readingTime:12,
          objectives:["Declare and use variables","Understand naming rules","Learn about variable scope"],
          theory:"What Are Variables?\nVariables are named storage locations. Think of a variable as a labeled box where you store data. In Python, you create a variable by assigning a value using the = sign.\n\nExample:\nrobot_name = 'Atlas'  # A variable storing text\nsensor_count = 12  # A variable storing a number\nis_active = True  # A variable storing a boolean\n\nDynamic Typing:\nPython uses dynamic typing. This means you don't need to declare the type of a variable — Python figures it out automatically based on the value you assign. You can even change the type later.\n\nMultiple Assignment:\nYou can assign multiple variables at once:\nx, y, z = 10, 20, 30  # x=10, y=20, z=30\n\nNaming Rules:\n• Must start with a letter or underscore (_)\n• Can contain letters, numbers, and underscores\n• Cannot use Python keywords (like 'if', 'for', 'while')\n• Case-sensitive: 'name' and 'Name' are different variables\n\nNaming Conventions:\n• Use snake_case for variable names (lowercase with underscores). Example: robot_name, sensor_count\n• Use UPPER_CASE for constants (values that don't change). Example: MAX_SPEED = 100\n\nVariable Scope:\nScope refers to where a variable is accessible. Variables created inside a function are local (only available inside that function). Variables created outside are global (available everywhere).",
          keyConcepts:["Variable declaration","Dynamic typing","Naming rules and conventions","Multiple assignment","Constants","Variable scope"],
          examples:["robot_name = 'Atlas'","sensor_count = 12","is_active = True","x, y, z = 10, 20, 30","MAX_SPEED = 100"],
          summary:"Variables in Python are dynamically typed. Follow snake_case naming conventions.",
          activity:"Write a program that uses variables to store a robot's name, speed, battery level, and status.",
          relatedLessons:["c9_p_3","c9_p_5"] },
        { id:"c9_p_5", title:"Operators", subject:"Python Programming", difficulty:"Beginner", readingTime:14,
          objectives:["Use arithmetic operators","Use comparison and logical operators","Understand operator precedence"],
          theory:"What Are Operators?\nOperators perform operations on values. Python has several types of operators:\n\n1. Arithmetic Operators (math):\n• + : Addition (10 + 3 = 13)\n• - : Subtraction (10 - 3 = 7)\n• * : Multiplication (10 * 3 = 30)\n• / : Division (10 / 3 = 3.333...)\n• // : Floor division — gives the whole number part only. Example: 10 // 3 = 3\n• % : Modulus — gives the remainder. Example: 10 % 3 = 1\n• ** : Exponent (power). Example: 2 ** 8 = 256 (2 to the power of 8)\n\n2. Comparison Operators (compare values, return True/False):\n• == : Equal to\n• != : Not equal to\n• > : Greater than\n• < : Less than\n• >= : Greater than or equal to\n• <= : Less than or equal to\n\n3. Logical Operators (combine True/False values):\n• and : True only if BOTH are True. Example: True and False → False\n• or : True if at least one is True\n• not : Inverts the value. Example: not True → False\n\n4. Assignment Operators:\n• = : Assigns a value. Example: x = 10\n• += : Adds and assigns. Example: speed += 10 is the same as speed = speed + 10\n• -= : Subtracts and assigns\n• *= : Multiplies and assigns\n• /= : Divides and assigns\n\n5. Membership Operators:\n• in : Checks if something is inside a collection. Example: 'bot' in 'robot' → True\n• not in : Checks if something is NOT inside\n\nOperator Precedence (order of operations):\nFrom highest to lowest: ** > (*, /, //, %) > (+, -) > comparison operators > not > and > or\nUse parentheses () to change the order. Example: (2 + 3) * 4 = 20",
          keyConcepts:["Arithmetic operators","Comparison operators","Logical operators","Assignment operators","Operator precedence","Bitwise operators"],
          examples:["10 // 3 → 3","2 ** 8 → 256","True and False → False","'bot' in 'robot' → True","speed += 10"],
          summary:"Python provides arithmetic, comparison, logical, assignment, and membership operators with defined precedence.",
          activity:"Write a program that calculates a robot's remaining battery time using arithmetic operators.",
          videoUrl:"https://www.youtube.com/watch?v=v5MR5JnKcZI", videoTitle:"Python Operators",
          relatedLessons:["c9_p_4","c9_p_6"] },
        { id:"c9_p_6", title:"Conditional Statements", subject:"Python Programming", difficulty:"Intermediate", readingTime:14,
          objectives:["Use if, elif, and else","Write nested conditions","Implement decision-making"],
          theory:"What Are Conditional Statements?\nConditional statements allow programs to make decisions. They let the program choose different actions based on conditions. This is essential for robot behavior — a robot needs to decide what to do based on its sensors.\n\nThe Three Types:\n\n1. if Statement:\nExecutes code only if a condition is True.\nExample: if distance < 20: stop()\nThis means: if the distance to an obstacle is less than 20, stop the robot.\n\n2. elif (else if) Statement:\nProvides additional conditions to check if the first 'if' was False.\nExample: if obstacle: turn() elif path_clear: move_forward()\n\n3. else Statement:\nExecutes when NO conditions are True.\nExample: if battery > 20: move() else: charge()\n\nIndentation:\nPython uses indentation (spaces) to group code into blocks. The code inside an if/elif/else must be indented.\n\nTernary Operator (one-line conditional):\nvalue_if_true if condition else value_if_false\nExample: status = 'active' if battery > 20 else 'low'\nThis sets status to 'active' if battery is above 20, otherwise 'low'.\n\nNested Conditions:\nYou can put conditions inside other conditions:\nif temp > 80:\n    if humidity > 60:\n        activate_cooling()\n\nExample in Robotics:\nif distance < 20: turn()  # obstacle close → turn\nelif path_clear: move_forward()  # path is clear → go forward\nelse: stop()  # otherwise → stop",
          keyConcepts:["if statement","elif statement","else statement","Nested conditions","Ternary operator","Logical operators in conditions"],
          examples:["if distance < 20: stop()","status = 'active' if battery > 20 else 'low'","if temp > 80 and humidity > 60: activate_cooling()"],
          summary:"Conditional statements (if/elif/else) enable decision-making essential for robot behavior.",
          activity:"Write a program that simulates a robot's decision-making based on battery, obstacles, and temperature.",
          miniProject:"Create a text-based robot controller using conditional statements.",
          videoUrl:"https://www.youtube.com/watch?v=Zp5MuPOtsSY", videoTitle:"Python If Statements",
          relatedLessons:["c9_p_5","c9_p_7"] },
        { id:"c9_p_7", title:"Control Statements", subject:"Python Programming", difficulty:"Intermediate", readingTime:16,
          objectives:["Use for and while loops","Understand loop control","Apply loops to robotics"],
          theory:"What Are Control Statements (Loops)?\nControl statements manage the flow of a program. Loops let you repeat code multiple times. This is essential in robotics — a robot needs to keep checking sensors and running continuously.\n\n1. for Loop:\nIterates (loops) over a sequence like a list, tuple, or range.\nExample: for i in range(5): print(i)\nThis prints: 0, 1, 2, 3, 4\n\nThe range() function generates sequences of numbers:\n• range(5) → 0, 1, 2, 3, 4\n• range(2, 8) → 2, 3, 4, 5, 6, 7\n• range(0, 10, 2) → 0, 2, 4, 6, 8\n\n2. while Loop:\nRepeats while a condition is True.\nExample: while battery > 0: check_sensors()\nThis keeps checking sensors as long as the battery is above 0.\n\nIn robotics, 'while True:' is very common. This creates an infinite loop that keeps the robot running forever (until you turn it off).\n\n3. Loop Control Statements:\n• break: Exits (stops) the loop immediately.\n• continue: Skips the rest of the current iteration and moves to the next one.\n• pass: Does nothing — it's a placeholder. Useful when you need a statement but don't want to do anything yet.\n\nExamples:\nfor i in range(5): print(i)  # Prints 0,1,2,3,4\nwhile battery > 0: check_sensors()  # Keeps checking sensors\nfor sensor in sensor_list: read(sensor)  # Loops through a list of sensors\n\nNested Loops:\nYou can put a loop inside another loop. Example: a for loop inside another for loop to go through a 2D grid.",
          keyConcepts:["for loop","while loop","break, continue, pass","range() function","Nested loops","Infinite loops in robotics"],
          examples:["for i in range(5): print(i)","while battery > 0: check_sensors()","for sensor in sensor_list: read(sensor)"],
          summary:"Loops (for, while) enable repetitive execution essential for continuous sensor monitoring and navigation.",
          activity:"Write a program that simulates a robot moving through 10 waypoints using a for loop.",
          videoUrl:"https://www.youtube.com/watch?v=0ZvaDa8eT5s", videoTitle:"Python Loops",
          relatedLessons:["c9_p_6","c9_p_8"] },
        { id:"c9_p_8", title:"Functions", subject:"Python Programming", difficulty:"Intermediate", readingTime:15,
          objectives:["Define and call functions","Understand parameters and return values","Use built-in and user-defined functions"],
          theory:"What Are Functions?\nFunctions are reusable blocks of code. Instead of writing the same code over and over, you write it once as a function and call it whenever you need it. Functions promote code reusability — you can use the same function many times.\n\nDefining a Function:\nUse the 'def' keyword to define a function:\ndef function_name(parameters):\n    # function body\n\nExample:\ndef move_forward(speed):\n    motor.run(speed)\n\nCalling a Function:\nTo call (use) a function, write its name followed by parentheses:\nmove_forward(150)  # Calls the function with speed=150\n\nParameters and Arguments:\n• Parameters are variables listed in the function definition.\n• Arguments are the actual values you pass when calling the function.\n\nDefault Parameters:\nFunctions can have default parameter values. If you don't provide an argument, the default is used.\nExample: def greet(name='Robot'): print(f'Hello, {name}!')\nIf you call greet() without arguments, name defaults to 'Robot'.\nIf you call greet('Atlas'), name becomes 'Atlas'.\nSo 'def move(speed=50)' means speed defaults to 50 if no argument is provided.\n\nReturn Values:\nFunctions can return values using the 'return' statement:\ndef read_distance():\n    return sensor.read()\nThe returned value can be used: dist = read_distance()\nPython functions can also return multiple values (as a tuple).\n\nBuilt-in Functions:\nPython has many built-in functions:\n• print() — outputs text\n• len() — returns the length of something\n• type() — returns the type of something\n• range() — generates a sequence of numbers\n\nFunctions in Robotics:\nIn robotics, functions encapsulate (group together) specific behaviors:\n• move_forward(), turn_left(), turn_right(), stop(), read_sensor()\nThis modular approach makes complex programs easier to understand and manage.\n\nCorrect Function Syntax:\nPython uses 'def name():' syntax. NOT 'function name():' or 'func name():' or 'define name():'.",
          keyConcepts:["Function definition (def)","Parameters and arguments","Return values","Default parameters","Built-in functions","Modular programming"],
          examples:["def move_forward(speed): motor.run(speed)","def read_distance(): return sensor.read()","def greet(name='Robot'): print(f'Hello, {name}!')"],
          summary:"Functions are reusable code blocks that organize robot programs into manageable modules.",
          activity:"Write functions for a virtual robot: move_forward(), turn_left(), turn_right(), stop(), read_sensor().",
          miniProject:"Create a Python program with functions that simulates a robot navigating a grid.",
          videoUrl:"https://www.youtube.com/watch?v=9Os0o3wzS_I", videoTitle:"Python Functions",
          relatedLessons:["c9_p_7","c9_p_6"] }
      ]
    },
    {
      id: "ai", name: "Artificial Intelligence", icon: "Brain", color: "#A78BFA",
      lessons: [
        { id:"c9_a_1", title:"Introduction to AI", subject:"Artificial Intelligence", difficulty:"Beginner", readingTime:12,
          objectives:["Define Artificial Intelligence","Understand AI vs human intelligence","Recognize AI in everyday life"],
          theory:"What is Artificial Intelligence (AI)?\nArtificial Intelligence (AI) is the simulation of human intelligence by computer systems. AI tries to make computers think and act like humans. The three main processes of AI are:\n1. Learning — acquiring knowledge from data\n2. Reasoning — using knowledge to make decisions\n3. Self-correction — improving over time by fixing mistakes\n\nWho Proposed the Turing Test?\nAlan Turing proposed the Turing Test in 1950. He asked the famous question 'Can machines think?' His paper was published in 1950. The Turing Test checks if a computer can imitate human intelligence so well that a person can't tell if they're talking to a human or a machine.\n\nWhen Was AI Founded?\nAI was officially founded at the Dartmouth Conference in 1956. This is where the term 'Artificial Intelligence' was first used.\n\nNarrow AI vs General AI:\n• Narrow AI (also called Weak AI): Handles specific, limited tasks. It cannot perform any intellectual task like humans. Examples: Siri, Alexa, Netflix recommendations, chess AI, Google Translate.\n• General AI (also called Strong AI): Matches human-level intelligence across ALL domains. This is still hypothetical (does not exist yet).\n\nCan AI Only Work with Numbers?\nNo! AI can work with text, images, audio, and numerical data. AI is not limited to numbers.\n\nSubfields of AI:\n• Machine Learning — computers learn from data\n• Natural Language Processing (NLP) — computers understand human language. NLP is a subfield of AI.\n• Computer Vision — computers interpret images\n• Robotics — AI-powered robots\n\nExamples of AI in Daily Life:\n• Siri and Alexa (voice assistants) — these are examples of Narrow AI\n• Netflix recommendations — AI suggests what to watch\n• Google Translate — AI translates languages\n• Face recognition on phones\n• Self-driving cars\n\nKey Takeaway:\nSiri is an example of Narrow AI (task-specific). AI processes learning, reasoning, and self-correction. AI was founded at the Dartmouth Conference in 1956.",
          keyConcepts:["AI definition","Turing Test","Narrow AI vs General AI","AI subfields","Intelligence simulation"],
          examples:["Siri and Alexa (voice assistants)","Netflix recommendations","Google Translate","Face recognition on phones","Self-driving cars"],
          summary:"AI simulates human intelligence through learning, reasoning, and self-correction, ranging from narrow to general intelligence.",
          activity:"List 10 AI applications you use daily. Identify whether each uses pattern recognition, NLP, or recommendation systems.",
          videoUrl:"https://www.youtube.com/watch?v=ad79nYk2keg", videoTitle:"What is AI?",
          relatedLessons:["c9_a_2","c9_a_3"] },
        { id:"c9_a_2", title:"Evolution of AI", subject:"Artificial Intelligence", difficulty:"Beginner", readingTime:14,
          objectives:["Trace the history of AI","Identify AI winters and breakthroughs","Understand the current state of AI"],
          theory:"How AI Evolved Over Time:\nAI's evolution spans several decades, with ups and downs:\n\n1950s-1960s — Early Optimism:\nScientists were very excited about AI. They created programs like ELIZA (1966), one of the first chatbots that could simulate a conversation.\n\n1970s — First AI Winter:\nResearchers had made big promises but couldn't deliver. Funding was cut, and this period of disappointment is called the 'AI Winter.'\n\n1980s — Expert Systems Revival:\nExpert systems (programs that mimic human experts in specific fields) revived interest in AI. But they were expensive and hard to maintain.\n\nLate 1980s-1990s — Second AI Winter:\nExpert systems failed to live up to expectations, leading to a second AI Winter with more funding cuts.\n\n2000s-Present — Modern Renaissance:\nAI came back stronger than ever, thanks to three things: big data (lots of data available), powerful GPUs (fast computers), and improved algorithms (better methods).\n\nKey AI Milestones:\n• ELIZA (1966) — early chatbot\n• Deep Blue (1997) — IBM's chess AI beat world champion Garry Kasparov\n• Watson (2011) — IBM's AI won the quiz show Jeopardy!\n• AlphaGo (2016) — Google's AI beat the world champion at the game Go\n• ChatGPT (2022) — AI chatbot that could converse naturally with humans\n\nKey Takeaway:\nAI evolved through cycles of optimism (excitement) and setbacks (AI Winters), leading to today's powerful AI powered by big data and deep learning.",
          keyConcepts:["AI history timeline","AI Winters","Expert systems era","Deep learning revolution","Modern AI renaissance"],
          examples:["ELIZA (1966)","Deep Blue (1997)","Watson (2011)","AlphaGo (2016)","ChatGPT (2022)"],
          summary:"AI evolved through cycles of optimism and setbacks, culminating in today's renaissance powered by big data and deep learning.",
          activity:"Create a timeline showing 15+ milestones in AI history from 1950 to today.",
          videoUrl:"https://www.youtube.com/watch?v=056v4OxKwlI", videoTitle:"History of AI",
          relatedLessons:["c9_a_1","c9_a_3"] },
        { id:"c9_a_3", title:"Applications of AI", subject:"Artificial Intelligence", difficulty:"Beginner", readingTime:14,
          objectives:["Explore AI applications across industries","Understand how AI transforms sectors","Evaluate AI's impact on society"],
          theory:"AI Applications Across Industries:\nAI is used in almost every industry today. Here are the main areas:\n\nHealthcare:\n• AI helps diagnose diseases by analyzing medical images\n• Drug discovery — AI finds new medicines faster\n• Google's DeepMind can detect eye diseases\n\nFinance:\n• Fraud detection — AI spots suspicious transactions\n• Automated trading — AI buys and sells stocks\n\nTransportation:\n• Self-driving cars (Tesla Autopilot)\n• Traffic optimization — AI manages traffic lights and routes\n\nEducation:\n• Adaptive learning — programs like Duolingo adjust to each student's level\n• Automated grading — AI grades assignments\n\nAgriculture:\n• Crop monitoring — AI analyzes satellite images to check crop health\n• Yield prediction — AI predicts how much food will be harvested\n• John Deere's autonomous tractors use AI to farm\n\nEntertainment:\n• Content recommendations — Amazon and Netflix use AI to suggest what to watch or buy\n• Game AI — NPCs (non-player characters) in video games use AI\n\nManufacturing:\n• Quality control — AI inspects products for defects\n• Predictive maintenance — AI predicts when machines will break down\n\nKey Takeaway:\nAI transforms healthcare, finance, transportation, education, agriculture, entertainment, and manufacturing. It makes processes faster, more accurate, and more efficient.",
          keyConcepts:["Healthcare AI","Financial AI","Autonomous transportation","EdTech AI","Agricultural AI","Entertainment AI"],
          examples:["Google's DeepMind detecting eye diseases","Tesla Autopilot","Duolingo's adaptive learning","Amazon's recommendation engine","John Deere's autonomous tractors"],
          summary:"AI transforms healthcare, finance, transportation, education, agriculture, and entertainment.",
          activity:"Choose an industry. Research 3 specific AI applications and present their impact.",
          videoUrl:"https://www.youtube.com/watch?v=JMUxmLyrhSk", videoTitle:"Applications of AI",
          relatedLessons:["c9_a_2","c9_a_4"] },
        { id:"c9_a_4", title:"Benefits of AI", subject:"Artificial Intelligence", difficulty:"Beginner", readingTime:10,
          objectives:["Identify key benefits of AI","Understand AI's role in efficiency","Recognize AI's potential for solving global challenges"],
          theory:"Benefits of AI:\nAI offers many benefits that make our lives better:\n\n1. Efficiency:\nAI automates repetitive tasks. This frees humans to do more creative and important work.\n\n2. Accuracy:\nAI reduces human error. For example, AI can reduce medical diagnosis errors by up to 40%.\n\n3. Availability:\nAI works 24/7. It doesn't need breaks, sleep, or vacations. Chatbots can handle customer service at any time of day or night.\n\n4. Speed:\nAI processes vast amounts of data in seconds. What would take a human weeks, AI can do in minutes.\n\n5. Personalization:\nAI tailors experiences to each person. For example, personalized learning paths in education, or personalized product recommendations.\n\n6. Discovery:\nAI accelerates scientific research. It can analyze millions of data points to find patterns humans would miss.\n\n7. Safety:\nAI improves safety through predictive maintenance — predicting when machines will fail before they actually break.\n\n8. Accessibility:\nAI enables tools for people with disabilities. For example, voice-to-text for people who can't type, or text-to-speech for people who can't see.\n\n9. Problem-Solving:\nAI tackles global challenges like climate change, disease, and poverty.\n\nExamples:\n• AI reducing medical diagnosis errors by 40%\n• Chatbots handling customer service 24/7\n• AI processing millions of fraud transactions to protect your money\n• Personalized learning paths that adapt to each student",
          keyConcepts:["Automation efficiency","Error reduction","24/7 availability","Data processing speed","Personalization","Scientific discovery"],
          examples:["AI reducing medical diagnosis errors by 40%","Chatbots handling customer service 24/7","AI processing millions of fraud transactions","Personalized learning paths"],
          summary:"AI enhances efficiency, accuracy, availability, and personalization while accelerating scientific discovery.",
          activity:"Interview family members about how AI has improved their daily lives. Document 5 examples.",
          relatedLessons:["c9_a_3","c9_a_5"] },
        { id:"c9_a_5", title:"Ethical Considerations", subject:"Artificial Intelligence", difficulty:"Intermediate", readingTime:14,
          objectives:["Understand AI bias and fairness","Discuss privacy concerns","Explore job displacement issues"],
          theory:"Ethical Considerations in AI:\nAs AI becomes more common, we need to think about ethics (what is right and wrong). Here are the main ethical issues:\n\n1. Bias:\nAI can perpetuate (continue) existing biases found in training data. For example, a biased hiring algorithm might filter out qualified candidates based on gender or race.\n\n2. Privacy:\nAI systems collect vast amounts of personal data. Who has access to this data? How is it used? This is a major privacy concern. For example, surveillance cameras with facial recognition can track people everywhere.\n\n3. Job Displacement:\nAutomation threatens certain jobs. If AI can do a job cheaper and faster, people may lose their jobs. For example, automated customer service replacing human workers.\n\n4. Transparency:\nMany AI systems are 'black boxes' — their decisions are hard to explain. Even the creators don't always know exactly why the AI made a particular decision.\n\n5. Accountability:\nWho is responsible when AI causes harm? If a self-driving car crashes, who is at fault — the car owner, the manufacturer, or the AI programmer?\n\n6. Deepfakes:\nAI-generated fake media (deepfakes) can create realistic videos of people saying things they never said. This threatens truth and can spread misinformation.\n\nHow to Address These Issues:\n• Build diverse teams (different perspectives reduce bias)\n• Create regulations and laws for AI\n• Have public dialogue about AI ethics\n• Ensure AI systems are transparent and explainable",
          keyConcepts:["AI bias","Data privacy","Job displacement","Algorithmic transparency","Accountability","Deepfakes"],
          examples:["Biased hiring algorithms filtering qualified candidates","Surveillance cameras with facial recognition","Automated customer service replacing humans","Deepfake videos"],
          summary:"AI ethics involves addressing bias, privacy, job displacement, transparency, and accountability.",
          activity:"Hold a class debate: 'Should AI be allowed to make decisions that affect human lives without oversight?'",
          videoUrl:"https://www.youtube.com/watch?v=UG_X_7g63rY", videoTitle:"Ethics of AI",
          relatedLessons:["c9_a_4","c9_a_6"] },
        { id:"c9_a_6", title:"Role of Data & Information", subject:"Artificial Intelligence", difficulty:"Intermediate", readingTime:12,
          objectives:["Understand data as fuel for AI","Differentiate data types","Learn about data collection and processing"],
          theory:"The Role of Data in AI:\nData is the foundation of AI. Without data, AI cannot learn. Think of data as the 'fuel' that powers AI — without fuel, the engine can't run.\n\nTypes of Data:\n1. Structured Data: Organized in tables (like spreadsheets). Easy for computers to process.\n2. Semi-structured Data: Partially organized (like JSON or XML files).\n3. Unstructured Data: No specific format (like images, audio, text). This is the most common type of data.\n\nThe Data Pipeline (How Data is Prepared for AI):\n1. Collection: Gather data from various sources.\n2. Cleaning: Remove errors, duplicates, and incorrect data.\n3. Preprocessing: Convert data into a format the AI can use.\n4. Feature Engineering: Select the most important features (characteristics) of the data.\n5. Splitting: Divide data into training data (to teach the AI) and test data (to check if it learned correctly).\n\nData Quality:\nData quality is crucial. There's a famous saying: 'Garbage in, garbage out.' If you train AI with bad data, you get bad results. Large, diverse, and representative datasets produce better AI models.\n\nData Labeling:\nFor supervised learning, data must be labeled. This means each piece of data has a correct answer attached. For example, a photo of a cat is labeled 'cat.' The AI learns from these labeled examples.\n\nExamples of Data for AI:\n• Labeled images for image recognition\n• Customer purchase data for recommendations\n• Sensor data for predictive maintenance\n• Text data for natural language processing (NLP)",
          keyConcepts:["Structured vs unstructured data","Data pipeline","Data cleaning","Feature engineering","Data quality","Training/test split"],
          examples:["Labeled images for image recognition","Customer purchase data for recommendations","Sensor data for predictive maintenance","Text data for NLP"],
          summary:"Quality data is AI's foundation. The pipeline — collection, cleaning, preprocessing, splitting — determines model performance.",
          activity:"Collect data about your classroom in a spreadsheet. Clean the data and identify patterns.",
          relatedLessons:["c9_a_5","c9_a_7"] },
        { id:"c9_a_7", title:"AI Concepts", subject:"Artificial Intelligence", difficulty:"Intermediate", readingTime:16,
          objectives:["Understand machine learning basics","Learn about neural networks conceptually","Explore NLP"],
          theory:"Key AI Concepts:\n\n1. Machine Learning (ML):\nMachine Learning enables computers to learn from data without being explicitly programmed. Instead of writing rules for the computer, you give it data and it finds patterns on its own. There are three types:\n\n• Supervised Learning: The AI learns from labeled examples. Example: an email spam filter learns from emails labeled 'spam' or 'not spam.'\n• Unsupervised Learning: The AI finds patterns in unlabeled data (no labels). Example: grouping customers into segments based on buying behavior.\n• Reinforcement Learning: The AI learns by trial and error with rewards. It tries different actions and gets rewards for good ones. Example: a game-playing AI that learns by playing millions of games.\n\n2. Neural Networks:\nNeural Networks are computing systems inspired by the human brain. They consist of connected 'neurons' (nodes) that process information, similar to how brain cells work.\n\n3. Deep Learning:\nDeep Learning uses many-layered (deep) neural networks. The more layers, the 'deeper' the network. Deep learning powers many modern AI systems like ChatGPT and image recognition.\n\n4. Natural Language Processing (NLP):\nNLP enables computers to understand human language. It's how AI can read text, understand speech, and generate human-like responses. Examples: ChatGPT, Google Translate, Siri.\n\n5. Computer Vision:\nComputer Vision allows AI to interpret and understand images. Examples: face recognition, self-driving cars seeing the road, medical image analysis.\n\nSummary:\n• Supervised learning uses labeled data\n• Unsupervised learning finds patterns in unlabeled data\n• Reinforcement learning uses trial and error with rewards\n• Neural networks are inspired by the brain\n• Deep learning uses many-layered neural networks\n• NLP understands language; Computer Vision understands images",
          keyConcepts:["Machine Learning types","Neural networks","Deep learning","Natural Language Processing","Computer vision","Supervised vs unsupervised"],
          examples:["Email spam filter (supervised)","Customer segmentation (unsupervised)","Game-playing AI (reinforcement)","ChatGPT (NLP + deep learning)"],
          summary:"Core AI concepts include ML (supervised, unsupervised, reinforcement), neural networks, deep learning, NLP, and computer vision.",
          activity:"Use Google's Teachable Machine to train a simple image classifier.",
          videoUrl:"https://www.youtube.com/watch?v=z-EtmaFJieY", videoTitle:"Machine Learning Basics",
          relatedLessons:["c9_a_6","c9_a_8"] },
        { id:"c9_a_8", title:"AI Project Framework", subject:"Artificial Intelligence", difficulty:"Intermediate", readingTime:14,
          objectives:["Learn a structured approach to AI projects","Understand each phase","Apply the framework to a real problem"],
          theory:"The AI Project Framework:\nThe AI Project Framework is a step-by-step approach to building AI projects. It has 6 phases:\n\nPhase 1 — Problem Scoping:\nDefine the problem clearly. What are you trying to solve? Who are the stakeholders (people affected)? What are the objectives and success metrics? This is the FIRST phase — you must understand the problem before doing anything else.\n\nPhase 2 — Data Acquisition:\nCollect relevant data for your problem. This might involve surveys, sensors, web scraping, or using existing datasets. You need enough good-quality data to train your AI.\n\nPhase 3 — Data Exploration:\nAnalyze the data using statistics and visualization. Look for patterns, trends, and outliers (unusual data points). This helps you understand your data before building models. This phase uses statistics and visualization tools.\n\nPhase 4 — Modelling:\nSelect algorithms (methods) and train models on your data. This is where the actual machine learning happens. You choose the best algorithm for your problem and train it using your data.\n\nPhase 5 — Evaluation:\nTest the model on unseen data (data it hasn't seen before). Measure how well it performs using metrics like accuracy and precision. This checks if the AI actually learned correctly and can generalize to new situations.\n\nPhase 6 — Deployment:\nIntegrate the AI model into real-world applications. This is the FINAL phase. The model is put into production where people can use it. After deployment, you monitor the model and improve it over time.\n\nKey Points:\n• The framework has 6 phases total.\n• Problem Scoping is the first phase.\n• Data Acquisition is where you collect data.\n• Modelling involves training algorithms.\n• Evaluation tests on unseen data.\n• Deployment is the final phase.\n• The AI project cycle is iterative — it repeats and improves over time.\n• Evaluation uses metrics like accuracy and precision.",
          keyConcepts:["Problem scoping","Data acquisition","Data exploration","Model selection and training","Evaluation metrics","Deployment"],
          examples:["Predicting crop yields: scope → collect data → explore → train model → evaluate → deploy","Spam detection: scope → collect emails → analyze → train → measure → integrate"],
          summary:"The AI Project Framework follows six phases: Problem Scoping, Data Acquisition, Data Exploration, Modelling, Evaluation, Deployment.",
          activity:"Choose a problem in your school and write a plan following all six phases.",
          miniProject:"Design an AI project proposal addressing a real school problem.",
          videoUrl:"https://www.youtube.com/watch?v=nKW8Ndu7Mjw", videoTitle:"AI Project Cycle",
          relatedLessons:["c9_a_7","c9_a_1"] }
      ]
    },
    {
      id: "computing", name: "Computing Fundamentals", icon: "Cpu", color: "#F59E0B",
      lessons: [
        { id:"c9_c_1", title:"Evolution of Computing", subject:"Computing Fundamentals", difficulty:"Beginner", readingTime:14,
          objectives:["Trace the history of computing","Identify generations of computers","Understand Moore's Law"],
          theory:"Evolution of Computing:\nComputing has evolved over centuries through five generations:\n\nFirst Generation (1940s-1950s) — Vacuum Tubes:\nUsed vacuum tubes for processing. These were huge, hot, and used a lot of electricity. Example: ENIAC (1945) weighed 30 tons and had 18,000 vacuum tubes.\n\nSecond Generation (1950s-1960s) — Transistors:\nTransistors replaced vacuum tubes. They were smaller, faster, and more reliable. Example: IBM 7094 (1962).\n\nThird Generation (1960s-1970s) — Integrated Circuits:\nIntegrated circuits (ICs) combined many transistors on a single chip. This made computers even smaller and cheaper.\n\nFourth Generation (1970s-Present) — Microprocessors:\nThe microprocessor put an entire CPU on a single chip. The Intel 4004 (1971) was the first microprocessor. This is the generation we still use today. Modern computers and phones are fourth-generation.\n\nFifth Generation (Present-Future) — AI and Quantum:\nFocuses on artificial intelligence and quantum computing. These computers can think and solve problems in new ways.\n\nMoore's Law:\nMoore's Law observes that the number of transistors on a chip doubles roughly every two years. This means computers get about twice as powerful every two years.\n\nFun Fact:\nAn iPhone (2007) has more computing power than the computers that sent astronauts to the Moon during the Apollo missions!",
          keyConcepts:["Computing generations","Vacuum tubes to microprocessors","Moore's Law","Abacus to quantum computers","Key milestones"],
          examples:["ENIAC (1945) — 30 tons, 18,000 vacuum tubes","IBM 7094 (1962) — transistor-based","Intel 4004 (1971) — first microprocessor","iPhone (2007) — more power than Apollo computers"],
          summary:"Computing evolved through five generations: vacuum tubes, transistors, ICs, microprocessors, and AI/quantum computing.",
          activity:"Create a comparison table of the five computer generations.",
          videoUrl:"https://www.youtube.com/watch?v=O5nskjZ_GoI", videoTitle:"History of Computing",
          relatedLessons:["c9_c_2","c9_c_3"] },
        { id:"c9_c_2", title:"Data and Information", subject:"Computing Fundamentals", difficulty:"Beginner", readingTime:10,
          objectives:["Differentiate data and information","Understand data processing","Learn data storage units"],
          theory:"Data vs Information:\n• Data: Raw, unprocessed facts. Example: the number '37' by itself is just data.\n• Information: Processed data that has meaning. Example: '37°C body temperature' is information because it has context and meaning.\n\nData Processing:\nData processing transforms raw data into useful information. The steps are:\n1. Collection: Gather raw data\n2. Sorting: Organize the data\n3. Calculation: Do math on the data\n4. Analysis: Find patterns and meaning\n5. Presentation: Show the results in a useful format (charts, graphs, reports)\n\nStorage Units (how computers measure data):\nComputers store data in binary (0s and 1s). Here are the units from smallest to largest:\n• bit: The smallest unit. A single 0 or 1.\n• byte: 8 bits. Can store one character like 'A'.\n• kilobyte (KB): 1,024 bytes\n• megabyte (MB): 1,024 KB (about one photo)\n• gigabyte (GB): 1,024 MB (about one movie)\n• terabyte (TB): 1,024 GB (about 500 hours of video)\n\nData in Robotics:\nIn robotics, sensors collect raw data from the environment. For example, an ultrasonic sensor gives a raw number like '45'. The robot's computer processes this into information: 'Object is 45cm away.' The robot then uses this information to make decisions (like stopping or turning).\n\nExample:\n• Sensor reading '45' (data) → 'Object is 45cm away' (information)\n• Temperature readings over time → weather forecast (information)",
          keyConcepts:["Data vs information","Data processing cycle","Storage units (bit to petabyte)","Binary system","Data in robotics"],
          examples:["Sensor reading '45' (data) → 'Object is 45cm away' (information)","Temperature readings over time → weather forecast"],
          summary:"Data is raw facts; information is processed data with meaning. Computing uses binary storage from bits to petabytes.",
          activity:"Collect 20 random numbers. Process them to find mean, median, mode, and range.",
          relatedLessons:["c9_c_1","c9_c_3"] },
        { id:"c9_c_3", title:"Logic Gates", subject:"Computing Fundamentals", difficulty:"Intermediate", readingTime:20,
          objectives:["Understand basic logic gates","Draw logic gate symbols","Create truth tables for all gates"],
          theory:"What Are Logic Gates?\nLogic gates are the building blocks of all digital circuits. Every digital device — computers, phones, calculators — is built from logic gates. Logic gates process binary inputs (0 and 1) and produce a binary output (0 or 1).\n\nThe Seven Logic Gates:\n\n1. AND Gate:\nOutput is 1 only when ALL inputs are 1. If any input is 0, the output is 0.\nExample: An alarm sounds only when the door is open AND the system is armed.\n\n2. OR Gate:\nOutput is 1 when ANY (at least one) input is 1. Output is 0 only when ALL inputs are 0.\nExample: A light turns on from switch A OR switch B.\n\n3. NOT Gate (Inverter):\nOutput is the OPPOSITE of the input. If input is 0, output is 1. If input is 1, output is 0. It is also called an inverter because it inverts the input.\nExample: If a sensor detects nothing (0), the alert is on (1).\n\n4. NAND Gate:\nThe opposite of AND. NAND = NOT + AND. It gives the opposite output of an AND gate.\n\n5. NOR Gate:\nThe opposite of OR. NOR = OR followed by NOT. It gives the opposite output of an OR gate.\n\n6. XOR Gate (Exclusive OR):\nOutput is 1 when the inputs are DIFFERENT (one is 0 and the other is 1). If both inputs are the same, output is 0.\nExample: A toggle switch (changes state each time you press it).\n\n7. XNOR Gate (Exclusive NOR):\nOutput is 1 when the inputs are the SAME (both 0 or both 1). This is the opposite of XOR.\n\nUniversal Gates:\nNAND and NOR are called 'universal gates.' This means ANY other gate can be built using only NAND gates or only NOR gates. This is very useful in circuit design.\n\nTruth Tables:\nA truth table shows all possible input combinations and their outputs. For n inputs, there are 2^n rows. For example, a 3-input gate has 2^3 = 8 rows.\n\nKey Points:\n• Logic gates process binary (0 and 1) inputs.\n• AND outputs 1 only when all inputs are 1.\n• OR outputs 1 when at least one input is 1.\n• NOT inverts the input.\n• XOR outputs 1 when inputs are different.\n• XNOR outputs 1 when inputs are the same.\n• NAND is the opposite of AND; NOR is the opposite of OR.\n• NAND and NOR are universal gates.\n• Every digital device uses logic gates.",
          keyConcepts:["AND, OR, NOT gates","NAND, NOR gates","XOR, XNOR gates","Truth tables","Gate symbols","Universal gates (NAND, NOR)"],
          examples:["AND: alarm sounds only when door is open AND system armed","OR: light turns on from switch A OR switch B","NOT: if sensor detects nothing (0), alert is on (1)","XOR: toggle switch"],
          summary:"Seven logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) form the foundation of all digital circuits.",
          activity:"Draw symbols and truth tables for all seven gates. Design a simple security system using combinations.",
          miniProject:"Use Tinkercad to build circuits implementing AND, OR, and NOT gates with LEDs.",
          videoUrl:"https://www.youtube.com/watch?v=INEtYZqtjTo", videoTitle:"Logic Gates Explained",
          relatedLessons:["c9_c_2","c9_c_4"] },
        { id:"c9_c_4", title:"Truth Tables", subject:"Computing Fundamentals", difficulty:"Intermediate", readingTime:14,
          objectives:["Construct truth tables","Evaluate Boolean expressions","Simplify logical expressions"],
          theory:"What Is a Truth Table?\nA truth table is a table that shows the output of a logical expression for EVERY possible combination of inputs. It helps you understand how a logic circuit works.\n\nHow Many Rows?\nFor n inputs, there are 2^n (2 to the power of n) rows. This means:\n• 1 input → 2^1 = 2 rows\n• 2 inputs → 2^2 = 4 rows\n• 3 inputs → 2^3 = 8 rows\n• 4 inputs → 2^4 = 16 rows\n\nHow to Build a Truth Table:\n1. List all input variables as columns.\n2. List ALL possible combinations of 0s and 1s for the inputs.\n3. Evaluate the expression step by step for each combination.\n4. Write the output for each combination.\n\nExample — AND Gate with 2 inputs (A and B):\nA=0, B=0 → Output=0\nA=0, B=1 → Output=0\nA=1, B=0 → Output=0\nA=1, B=1 → Output=1\n(4 rows total)\n\nBoolean Algebra:\nBoolean algebra is the math of logic. It has laws that help simplify logical expressions:\n\n• Identity Law: A AND 1 = A (anything ANDed with 1 stays the same)\n• Null Law: A AND 0 = 0 (anything ANDed with 0 becomes 0)\n• Idempotent Law: A AND A = A\n• Commutative Law: A AND B = B AND A (order doesn't matter)\n• De Morgan's Theorem: NOT(A AND B) = (NOT A) OR (NOT B). This is one of the most important laws — it lets you convert AND to OR (and vice versa) using NOT.\n\nWhy Simplify?\nSimplification reduces the number of gates needed in a circuit. Fewer gates means simpler, cheaper, and faster circuits.\n\nExample:\nNOT(A AND B) = NOT A OR NOT B (De Morgan's Theorem)",
          keyConcepts:["Truth table construction","2^n rows formula","Step-by-step evaluation","Boolean algebra laws","De Morgan's theorem","Expression simplification"],
          examples:["A AND B: 4 rows (00→0, 01→0, 10→0, 11→1)","NOT(A AND B) = NOT A OR NOT B (De Morgan's)"],
          summary:"Truth tables systematically evaluate logical expressions, while Boolean algebra simplifies them.",
          activity:"Construct truth tables for: A AND (B OR C), (A AND B) OR (NOT C), NOT(A OR B) AND C.",
          relatedLessons:["c9_c_3","c9_c_5"] },
        { id:"c9_c_5", title:"Binary Number System", subject:"Computing Fundamentals", difficulty:"Intermediate", readingTime:14,
          objectives:["Understand the binary system","Convert between binary and decimal","Perform binary arithmetic"],
          theory:"What Is the Binary Number System?\nBinary (also called base-2) is a number system that uses only two digits: 0 and 1. It is the native language of computers because electronic circuits have two states: ON (1) and OFF (0). Computers use binary internally — NOT decimal.\n\nWhy Do Computers Use Binary?\nComputers use binary because their circuits can only be in two states: on (1) or off (0). This makes binary the natural language of computers. Every piece of data in a computer — text, images, videos — is stored as binary (0s and 1s).\n\nPlace Values in Binary:\nEach position in a binary number represents a power of 2:\n• Position 0 (rightmost): 2^0 = 1\n• Position 1: 2^1 = 2\n• Position 2: 2^2 = 4\n• Position 3: 2^3 = 8\n• Position 4: 2^4 = 16\n• And so on: 1, 2, 4, 8, 16, 32, 64, 128...\n\nBinary to Decimal Conversion:\nMultiply each binary digit by its positional value and add them up.\nExample: 1011₂\n= (1 × 8) + (0 × 4) + (1 × 2) + (1 × 1)\n= 8 + 0 + 2 + 1\n= 11₁₀\n\nMore examples:\n• 1010₂ = 8 + 0 + 2 + 0 = 10₁₀\n• 25₁₀ = 16 + 8 + 1 = 11001₂\n\nDecimal to Binary Conversion:\nRepeatedly divide the decimal number by 2 and collect the remainders.\nExample: Convert 25 to binary:\n25 ÷ 2 = 12 remainder 1\n12 ÷ 2 = 6 remainder 0\n6 ÷ 2 = 3 remainder 0\n3 ÷ 2 = 1 remainder 1\n1 ÷ 2 = 0 remainder 1\nRead remainders from bottom to top: 11001₂\n\nBinary Addition:\n• 0 + 0 = 0\n• 0 + 1 = 1\n• 1 + 0 = 1\n• 1 + 1 = 10 (write 0, carry 1 to the next column)\nSo 1 + 1 in binary equals 10 (not 2).\n\n8-Bit Byte:\nAn 8-bit byte can represent values from 0 to 255 (that's 2^8 = 256 different values, from 0 to 255).\n\nKey Points:\n• Binary uses only 0 and 1\n• Each position represents a power of 2\n• 1011₂ = 11₁₀\n• 1010₂ = 10₁₀\n• 1 + 1 in binary = 10\n• An 8-bit byte represents 0 to 255\n• To convert decimal to binary, repeatedly divide by 2",
          keyConcepts:["Base-2 system","Place values (powers of 2)","Binary to decimal","Decimal to binary","Binary addition","2's complement"],
          examples:["1010₂ = 10₁₀","25₁₀ = 11001₂","1011 + 0110 = 10001 (11+6=17)","An 8-bit byte represents 0-255"],
          summary:"Binary (base-2) is computing's fundamental number system.",
          activity:"Convert: 42₁₀ to binary, 11010110₂ to decimal. Add 10110₂ and 01101₂.",
          videoUrl:"https://www.youtube.com/watch?v=LpuPe81bc2w", videoTitle:"Binary Number System",
          relatedLessons:["c9_c_4","c9_c_6"] },
        { id:"c9_c_6", title:"Number System Conversion", subject:"Computing Fundamentals", difficulty:"Intermediate", readingTime:16,
          objectives:["Convert between binary, decimal, octal, and hexadecimal","Understand the importance of different systems","Apply conversions in computing"],
          theory:"Four Number Systems:\nThere are four number systems used in computing:\n\n1. Decimal (Base-10):\nUses 10 digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. This is the number system humans use every day.\n\n2. Binary (Base-2):\nUses 2 digits: 0 and 1. This is the language of computers.\n\n3. Octal (Base-8):\nUses 8 digits: 0, 1, 2, 3, 4, 5, 6, 7. Used in some computer systems and file permissions.\n\n4. Hexadecimal (Base-16):\nUses 16 symbols: 0-9 and A, B, C, D, E, F (where A=10, B=11, C=12, D=13, E=14, F=15). Used for memory addresses, color codes, and MAC addresses.\n\nConversion Methods:\n\nDecimal to Any Base:\nRepeatedly divide by the base and collect remainders.\nExample: 255 to binary: divide by 2 repeatedly → 11111111₂\n\nAny Base to Decimal:\nMultiply each digit by its positional value (power of the base) and add them up.\n\nBinary to Octal:\nGroup binary digits in groups of three (from right to left), then convert each group.\nExample: 11111111₂ → 011 111 111 → 3 7 7 → 377₈\n\nBinary to Hexadecimal:\nGroup binary digits in groups of four (from right to left), then convert each group.\nExample: 11111111₂ → 1111 1111 → F F → FF₁₆\n\nReal-World Examples:\n• 255₁₀ = 11111111₂ = 377₈ = FF₁₆\n• Color #00D2FF = RGB(0, 210, 255) — colors use hexadecimal\n• Memory address 0x7FFF = 32767₁₀\n• File permissions like 755₈ (used in Linux)\n\nWhy Different Systems?\n• Decimal is for humans\n• Binary is for computers (internal processing)\n• Octal is for some computing tasks (like file permissions)\n• Hexadecimal is for programmers — it's a compact way to represent binary (one hex digit = four binary digits)",
          keyConcepts:["Decimal (base-10)","Binary (base-2)","Octal (base-8)","Hexadecimal (base-16)","Inter-conversion methods","Practical applications"],
          examples:["255₁₀ = 11111111₂ = 377₈ = FF₁₆","Color #00D2FF = RGB(0, 210, 255)","Memory address 0x7FFF = 32767₁₀","File permissions 755₈"],
          summary:"Four number systems (decimal, binary, octal, hexadecimal) serve different computing purposes.",
          activity:"Convert 200₁₀ to binary, octal, and hex. Convert A3F₁₆ to decimal, binary, and octal.",
          miniProject:"Write a Python program that converts numbers between all four bases.",
          videoUrl:"https://www.youtube.com/watch?v=RSWsFe-S4OI", videoTitle:"Number System Conversions",
          relatedLessons:["c9_c_5","c9_c_1"] }
      ]
    }
  ],
  projects: [
    { id:"c9_proj_1", title:"Line Following Robot", subject:"Robotics", difficulty:"Intermediate", estimatedTime:"3-4 hours", estimatedCost:"$25-35",
      description:"Build a robot that follows a black line using IR sensors and Arduino.",
      components:["Arduino Uno","2x IR Sensors (TCRT5000)","2x DC Motors","L298N Motor Driver","Robot Chassis Kit","Battery Pack (4xAA)","Jumper Wires","Black Tape"],
      steps:["Assemble the robot chassis with motors and wheels","Mount the Arduino Uno on the chassis","Connect the L298N motor driver to the Arduino","Wire the DC motors to the motor driver","Mount IR sensors at the front, facing downward","Connect IR sensors to Arduino analog pins A0 and A1","Upload the line-following code","Create a track using black tape on white paper","Calibrate sensor thresholds","Test and adjust motor speeds"],
      arduinoCode:`// Line Following Robot
const int leftSensor = A0, rightSensor = A1;
const int ENA = 5, IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9, ENB = 10;
int threshold = 500;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT); pinMode(ENB, OUTPUT);
}

void loop() {
  int leftVal = analogRead(leftSensor);
  int rightVal = analogRead(rightSensor);
  if (leftVal < threshold && rightVal < threshold) moveForward();
  else if (leftVal > threshold) turnLeft();
  else if (rightVal > threshold) turnRight();
  else stopMotors();
  delay(50);
}

void moveForward() {
  analogWrite(ENA, 150); analogWrite(ENB, 150);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}
void turnLeft() {
  analogWrite(ENA, 100); analogWrite(ENB, 150);
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}
void turnRight() {
  analogWrite(ENA, 150); analogWrite(ENB, 100);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}
void stopMotors() {
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}`,
      troubleshooting:["Robot not following line → Adjust sensor threshold values","Robot moving erratically → Check sensor alignment","Motors not spinning → Verify motor driver connections","Robot going in circles → Swap motor wires"],
      testingChecklist:["Sensors detect black vs white","Robot moves forward on white surface","Robot turns left when left sensor detects line","Robot turns right when right sensor detects line","Speed is consistent on straight sections"] },
    { id:"c9_proj_2", title:"Obstacle Avoiding Robot", subject:"Robotics", difficulty:"Intermediate", estimatedTime:"3-4 hours", estimatedCost:"$30-40",
      description:"Build a robot that detects obstacles using an ultrasonic sensor and navigates around them.",
      components:["Arduino Uno","HC-SR04 Ultrasonic Sensor","SG90 Servo Motor","2x DC Motors","L298N Motor Driver","Robot Chassis Kit","Battery Pack","Jumper Wires"],
      steps:["Assemble chassis with DC motors","Mount Arduino and motor driver","Attach servo motor at the front","Mount ultrasonic sensor on servo","Wire ultrasonic sensor (Trig→pin 2, Echo→pin 3)","Wire servo to pin 4","Connect motor driver to Arduino and motors","Upload obstacle avoidance code","Test with various obstacles","Adjust thresholds and turning angles"],
      arduinoCode:`#include <Servo.h>
Servo myServo;
const int trigPin = 2, echoPin = 3, servoPin = 4;
const int ENA = 5, IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9, ENB = 10;

long getDistance() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH) * 0.034 / 2;
}

void setup() {
  myServo.attach(servoPin); myServo.write(90);
  pinMode(trigPin, OUTPUT); pinMode(echoPin, INPUT);
  for (int i = 5; i <= 10; i++) pinMode(i, OUTPUT);
  delay(1000);
}

void loop() {
  long dist = getDistance();
  if (dist > 25) moveForward();
  else { stopMotors(); delay(200);
    myServo.write(0); delay(500); long right = getDistance();
    myServo.write(180); delay(500); long left = getDistance();
    myServo.write(90); delay(300);
    if (right > left) turnRight(); else turnLeft();
  }
  delay(50);
}

void moveForward() {
  analogWrite(ENA, 150); analogWrite(ENB, 150);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}
void turnRight() { digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH); delay(400); }
void turnLeft() { digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); delay(400); }
void stopMotors() { analogWrite(ENA, 0); analogWrite(ENB, 0); }`,
      troubleshooting:["Sensor wrong readings → Check wiring","Servo not rotating → Verify power supply","Robot not turning enough → Increase turn delay","Inconsistent detection → Add delay between readings"],
      testingChecklist:["Ultrasonic sensor reads distances","Servo sweeps left and right","Robot moves forward when clear","Robot stops when obstacle within 25cm","Robot looks left and right to choose path"] },
    { id:"c9_proj_3", title:"Smart Traffic Light System", subject:"Computing Fundamentals", difficulty:"Beginner", estimatedTime:"1-2 hours", estimatedCost:"$10-15",
      description:"Build a traffic light system using LEDs and Arduino with pedestrian crossing.",
      components:["Arduino Uno","3x Red LEDs","3x Yellow LEDs","3x Green LEDs","9x 220Ω Resistors","1x Push Button","Breadboard","Jumper Wires"],
      steps:["Set up breadboard with LED groups","Connect resistors to each LED","Wire LEDs to Arduino digital pins","Add push button for pedestrian crossing","Write traffic light sequence code","Test each LED individually","Run full traffic light cycle","Add pedestrian crossing interrupt","Test complete system"],
      arduinoCode:`// Smart Traffic Light
const int redPin = 2, yellowPin = 3, greenPin = 4;
const int pedButton = 5, pedRed = 6, pedGreen = 7;

void setup() {
  for (int i = 2; i <= 7; i++) pinMode(i, OUTPUT);
  pinMode(pedButton, INPUT_PULLUP);
  digitalWrite(pedRed, HIGH);
}

void loop() {
  digitalWrite(redPin, LOW); digitalWrite(greenPin, HIGH);
  delay(5000);
  digitalWrite(greenPin, LOW); digitalWrite(yellowPin, HIGH);
  delay(2000);
  digitalWrite(yellowPin, LOW); digitalWrite(redPin, HIGH);
  digitalWrite(pedRed, LOW); digitalWrite(pedGreen, HIGH);
  delay(5000);
  for (int i = 0; i < 5; i++) { digitalWrite(pedGreen, !digitalRead(pedGreen)); delay(500); }
  digitalWrite(pedGreen, LOW); digitalWrite(pedRed, HIGH);
  delay(1000);
}`,
      troubleshooting:["LEDs not lighting → Check polarity","Wrong sequence → Verify pin assignments","Button not working → Check pull-up configuration","LEDs too dim → Reduce resistor value"],
      testingChecklist:["All LEDs light individually","Traffic sequence: Green→Yellow→Red","Pedestrian green activates during red","Pedestrian green flashes before turning off","Cycle repeats"] }
  ],
  quizzes: {
    "c9_r_1": [
      { q:"What is the origin of the word 'robot'?", type:"mcq", options:["A Greek myth","A Czech play by Karel Čapek","A Japanese invention","An English term"], answer:1, explanation:"The word comes from the Czech 'robota' meaning forced labor, first used in Čapek's 1920 play R.U.R." },
      { q:"Robotics is a multidisciplinary field.", type:"tf", answer:true, explanation:"Robotics combines mechanical, electrical, and computer engineering." },
      { q:"A _____ is a machine capable of carrying out complex actions automatically.", type:"fill", answer:"robot", explanation:"A robot is a machine capable of complex autonomous actions." },
      { q:"Which is NOT a component of robotics?", type:"mcq", options:["Mechanical Engineering","Electrical Engineering","Culinary Arts","Computer Science"], answer:2, explanation:"Culinary Arts is not a core robotics discipline." },
      { q:"The Da Vinci system is a surgical robot.", type:"tf", answer:true, explanation:"Da Vinci is a robotic surgical system for minimally invasive surgery." },
      { q:"Which robot explored Mars?", type:"mcq", options:["Roomba","Atlas","Perseverance","ASIMO"], answer:2, explanation:"NASA's Perseverance rover landed on Mars in 2021." },
      { q:"Robotics only involves building physical hardware.", type:"tf", answer:false, explanation:"Robotics also encompasses software robots (bots) and AI." },
      { q:"The first industrial robot was named _____.", type:"fill", answer:"Unimate", explanation:"Unimate was installed at GM in 1961." },
      { q:"Which is a domestic robot?", type:"mcq", options:["KUKA industrial arm","Mars Rover","Roomba vacuum cleaner","Da Vinci system"], answer:2, explanation:"Roomba is a domestic robot for floor cleaning." },
      { q:"Match: Mars→?, Surgery→?, Cleaning→?", type:"mcq", options:["Rover, Da Vinci, Roomba","ASIMO, Atlas, Drone","Alexa, Siri, Cortana","Arduino, Pi, ESP32"], answer:0, explanation:"Mars Rover, Da Vinci, and Roomba match exploration, surgery, and cleaning." }
    ],
    "c9_r_5": [
      { q:"Which classification groups robots by how they move?", type:"mcq", options:["Application-based","Locomotion-based","Intelligence-based","Size-based"], answer:1, explanation:"Locomotion-based classification groups by movement method." },
      { q:"An exoskeleton is an augmenting robot.", type:"tf", answer:true, explanation:"Exoskeletons enhance human capabilities, classifying them as augmenting." },
      { q:"A remotely controlled robot is called _____.", type:"fill", answer:"teleoperated", explanation:"Teleoperated robots are controlled remotely by human operators." },
      { q:"Which robot type makes independent decisions?", type:"mcq", options:["Pre-programmed","Teleoperated","Autonomous","Manual"], answer:2, explanation:"Autonomous robots make independent decisions." },
      { q:"Drones are classified as flying robots.", type:"tf", answer:true, explanation:"Drones are UAVs classified as flying robots." },
      { q:"SCARA robots are used in which sector?", type:"mcq", options:["Healthcare","Agriculture","Industrial manufacturing","Entertainment"], answer:2, explanation:"SCARA robots are used in industrial assembly." },
      { q:"A hexapod robot has _____ legs.", type:"fill", answer:"six", explanation:"'Hexa' means six; hexapods have six legs." },
      { q:"All robots require human control.", type:"tf", answer:false, explanation:"Autonomous robots function independently." },
      { q:"Which is a service robot?", type:"mcq", options:["Welding arm","Delivery robot in hotel","CNC machine","Conveyor belt"], answer:1, explanation:"A hotel delivery robot is a service robot." },
      { q:"Boston Dynamics' Spot is what locomotion type?", type:"mcq", options:["Wheeled","Legged (quadruped)","Flying","Swimming"], answer:1, explanation:"Spot is a quadruped robot." }
    ],
    "c9_p_1": [
      { q:"Who created Python?", type:"mcq", options:["Linus Torvalds","James Gosling","Guido van Rossum","Dennis Ritchie"], answer:2, explanation:"Guido van Rossum created Python in 1991." },
      { q:"Python is an interpreted language.", type:"tf", answer:true, explanation:"Python code is executed line by line by the interpreter." },
      { q:"Python was created in the year _____.", type:"fill", answer:"1991", explanation:"Python was first released in 1991." },
      { q:"Which library is used for AI in Python?", type:"mcq", options:["NumPy","Flask","TensorFlow","BeautifulSoup"], answer:2, explanation:"TensorFlow is a popular AI/ML library by Google." },
      { q:"Python supports only object-oriented programming.", type:"tf", answer:false, explanation:"Python supports procedural, OOP, and functional paradigms." },
      { q:"Which command outputs text in Python?", type:"mcq", options:["echo()","console.log()","print()","System.out.println()"], answer:2, explanation:"print() is Python's output function." },
      { q:"Python uses _____ for code indentation.", type:"fill", answer:"whitespace", explanation:"Python uses whitespace instead of braces." },
      { q:"Which IDE supports Python?", type:"mcq", options:["Android Studio","Xcode","VS Code","Unity"], answer:2, explanation:"VS Code supports Python with extensions." },
      { q:"Python is popular in robotics due to its complexity.", type:"tf", answer:false, explanation:"Python is popular due to its simplicity, not complexity." },
      { q:"ROS stands for Robot _____ System.", type:"fill", answer:"Operating", explanation:"ROS = Robot Operating System." }
    ],
    "c9_c_3": [
      { q:"An AND gate outputs 1 only when:", type:"mcq", options:["Any input is 1","All inputs are 1","All inputs are 0","Inputs are different"], answer:1, explanation:"AND gate outputs 1 only when ALL inputs are 1." },
      { q:"A NOT gate is also called an inverter.", type:"tf", answer:true, explanation:"NOT gate inverts its input." },
      { q:"XOR gate outputs 1 when inputs are _____.", type:"fill", answer:"different", explanation:"XOR outputs 1 when inputs differ." },
      { q:"Which gate is the opposite of AND?", type:"mcq", options:["OR","NOR","NAND","XOR"], answer:2, explanation:"NAND is the opposite of AND." },
      { q:"NAND and NOR are universal gates.", type:"tf", answer:true, explanation:"Any gate can be built using only NAND or NOR." },
      { q:"OR gate output is 0 only when:", type:"mcq", options:["All inputs are 1","All inputs are 0","Any input is 1","Inputs are different"], answer:1, explanation:"OR outputs 0 only when all inputs are 0." },
      { q:"XNOR gate outputs 1 when inputs are _____.", type:"fill", answer:"same", explanation:"XNOR outputs 1 when inputs are the same." },
      { q:"How many rows for a 3-input truth table?", type:"mcq", options:["3","6","8","9"], answer:2, explanation:"2^3 = 8 rows." },
      { q:"NOR = OR followed by NOT.", type:"tf", answer:true, explanation:"NOR inverts the OR output." },
      { q:"Logic gates process _____ inputs.", type:"fill", answer:"binary", explanation:"Logic gates process binary (0 and 1) inputs." },
      { q:"Which gate outputs 1 when at least one input is 1?", type:"mcq", options:["AND","OR","NOT","NAND"], answer:1, explanation:"OR outputs 1 when any input is 1." },
      { q:"Every digital device uses logic gates.", type:"tf", answer:true, explanation:"All digital circuits are built from logic gates." }
    ],
    "c9_a_1": [
      { q:"Who proposed the Turing Test?", type:"mcq", options:["John McCarthy","Alan Turing","Marvin Minsky","Geoffrey Hinton"], answer:1, explanation:"Alan Turing proposed it in 1950." },
      { q:"AI stands for Artificial _____.", type:"fill", answer:"Intelligence", explanation:"AI = Artificial Intelligence." },
      { q:"Narrow AI can perform any intellectual task like humans.", type:"tf", answer:false, explanation:"Narrow AI is task-specific; General AI is hypothetical." },
      { q:"Which is an example of AI in daily life?", type:"mcq", options:["A calculator","Netflix recommendations","A light switch","A bicycle"], answer:1, explanation:"Netflix uses AI for recommendations." },
      { q:"AI was founded at the _____ Conference in 1956.", type:"fill", answer:"Dartmouth", explanation:"The Dartmouth Conference founded AI as a field." },
      { q:"AI can only work with numerical data.", type:"tf", answer:false, explanation:"AI works with text, images, audio, and numerical data." },
      { q:"Which is a subfield of AI?", type:"mcq", options:["Thermodynamics","Natural Language Processing","Organic Chemistry","Civil Engineering"], answer:1, explanation:"NLP is an AI subfield." },
      { q:"Siri is an example of Narrow AI.", type:"tf", answer:true, explanation:"Siri is designed for specific tasks." },
      { q:"AI processes: learning, _____, and self-correction.", type:"fill", answer:"reasoning", explanation:"Learning, reasoning, and self-correction are the three AI processes." },
      { q:"When did Alan Turing propose 'Can machines think?'", type:"mcq", options:["1920","1950","1975","2000"], answer:1, explanation:"Turing's paper was published in 1950." }
    ],
    "c9_c_5": [
      { q:"Binary uses which two digits?", type:"mcq", options:["0 and 1","1 and 2","0 and 9","A and B"], answer:0, explanation:"Binary (base-2) uses only 0 and 1." },
      { q:"1011₂ = _____₁₀", type:"fill", answer:"11", explanation:"8+0+2+1 = 11." },
      { q:"Binary is the native language of computers.", type:"tf", answer:true, explanation:"Computers use binary because circuits have two states." },
      { q:"25₁₀ in binary is:", type:"mcq", options:["10100","11001","11000","10011"], answer:1, explanation:"25 = 16+8+1 = 11001₂." },
      { q:"Each binary position represents a power of _____.", type:"fill", answer:"2", explanation:"Positions are powers of 2: 1, 2, 4, 8..." },
      { q:"1 + 1 in binary equals 10.", type:"tf", answer:true, explanation:"In binary, 1+1 = 10 (carry the 1)." },
      { q:"An 8-bit byte can represent values from:", type:"mcq", options:["0 to 100","0 to 255","0 to 128","0 to 999"], answer:1, explanation:"2^8 = 256 values (0-255)." },
      { q:"To convert decimal to binary, you repeatedly divide by _____.", type:"fill", answer:"2", explanation:"Divide by 2 and collect remainders." },
      { q:"Computers use decimal numbers internally.", type:"tf", answer:false, explanation:"Computers use binary internally." },
      { q:"1010₂ equals:", type:"mcq", options:["8","10","12","15"], answer:1, explanation:"8+0+2+0 = 10." }
    ],
    "c9_r_13": [
      { q:"DOF stands for Degree of _____.", type:"fill", answer:"Freedom", explanation:"DOF = Degree of Freedom." },
      { q:"A free body in 3D space has how many DOF?", type:"mcq", options:["3","4","6","9"], answer:2, explanation:"3 translational + 3 rotational = 6 DOF." },
      { q:"A robot arm needs at least 6 DOF for full positioning.", type:"tf", answer:true, explanation:"6 DOF allows reaching any position and orientation." },
      { q:"A door hinge has how many DOF?", type:"mcq", options:["1","2","3","6"], answer:0, explanation:"A hinge allows only rotation = 1 DOF." },
      { q:"More DOF means more flexibility.", type:"tf", answer:true, explanation:"More DOF enables more movement options." },
      { q:"The human arm has approximately how many DOF?", type:"mcq", options:["5","7","9","12"], answer:1, explanation:"Shoulder (3) + elbow (1) + wrist (3) = 7 DOF." },
      { q:"SCARA robots typically have how many DOF?", type:"fill", answer:"4", explanation:"SCARA robots have 4 DOF." },
      { q:"Grübler's formula calculates _____.", type:"mcq", options:["Torque","Degrees of Freedom","Speed","Accuracy"], answer:1, explanation:"Grübler's formula calculates DOF." },
      { q:"Redundant robots have more than 6 DOF.", type:"tf", answer:true, explanation:"Redundant robots have extra DOF for flexibility." },
      { q:"Translational DOF includes x, y, and _____.", type:"fill", answer:"z", explanation:"Translational DOF are x, y, and z." }
    ],
    "c9_p_8": [
      { q:"Functions are defined using which keyword?", type:"mcq", options:["function","def","func","define"], answer:1, explanation:"Python uses 'def' to define functions." },
      { q:"Functions promote code reusability.", type:"tf", answer:true, explanation:"Functions allow code to be reused multiple times." },
      { q:"The _____ statement returns a value from a function.", type:"fill", answer:"return", explanation:"return sends a value back from a function." },
      { q:"Which is a built-in Python function?", type:"mcq", options:["printf()","console.log()","print()","echo()"], answer:2, explanation:"print() is Python's built-in output function." },
      { q:"Default parameters are allowed in Python functions.", type:"tf", answer:true, explanation:"def greet(name='Robot') uses a default parameter." },
      { q:"To call a function, you use its name followed by _____.", type:"fill", answer:"parentheses", explanation:"Functions are called with name()." },
      { q:"What does def move(speed=50) mean?", type:"mcq", options:["Speed must be provided","Speed defaults to 50","Speed is 50 always","Invalid syntax"], answer:1, explanation:"50 is the default if no argument is provided." },
      { q:"Functions can return multiple values.", type:"tf", answer:true, explanation:"Python functions can return tuples of multiple values." },
      { q:"In robotics, functions encapsulate specific _____.", type:"fill", answer:"behaviors", explanation:"Functions encapsulate behaviors like move(), sense()." },
      { q:"Which correctly defines a function?", type:"mcq", options:["function myFunc():","def myFunc():","func myFunc():","define myFunc():"], answer:1, explanation:"Python uses 'def name():' syntax." }
    ],
    "c9_a_8": [
      { q:"What is the first phase of the AI Project Framework?", type:"mcq", options:["Data Acquisition","Problem Scoping","Modelling","Evaluation"], answer:1, explanation:"Problem Scoping is the first phase." },
      { q:"The AI Project Framework has 6 phases.", type:"tf", answer:true, explanation:"Scoping, Acquisition, Exploration, Modelling, Evaluation, Deployment." },
      { q:"_____ is the phase where you collect relevant data.", type:"fill", answer:"Data Acquisition", explanation:"Data Acquisition involves collecting data." },
      { q:"Which phase involves training ML algorithms?", type:"mcq", options:["Problem Scoping","Data Acquisition","Modelling","Deployment"], answer:2, explanation:"Modelling involves selecting and training algorithms." },
      { q:"Evaluation tests models on unseen data.", type:"tf", answer:true, explanation:"Evaluation uses test data the model hasn't seen." },
      { q:"The final phase is _____.", type:"fill", answer:"Deployment", explanation:"Deployment integrates the model into real applications." },
      { q:"Which phase uses statistics and visualization?", type:"mcq", options:["Data Exploration","Problem Scoping","Deployment","Evaluation"], answer:0, explanation:"Data Exploration uses statistics and visualization." },
      { q:"Problem scoping defines objectives and stakeholders.", type:"tf", answer:true, explanation:"Scoping identifies the problem, objectives, and stakeholders." },
      { q:"What metric is used in the Evaluation phase?", type:"mcq", options:["Only speed","Accuracy and precision","Only cost","Only time"], answer:1, explanation:"Accuracy, precision, recall are common evaluation metrics." },
      { q:"The AI project cycle is iterative.", type:"tf", answer:true, explanation:"The cycle repeats as models are improved over time." }
    ]
  }
};