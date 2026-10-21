// Textbook notes + exam questions for the chapters added to complete the syllabus.
export default {
  c9_r_14: {
    figs: ['robotArmAnatomy'],
    sections: [
      { h: 'Position vs orientation', b: `Placing a tool correctly needs two things:
• **Position** — where the tool is (x, y, z). The big joints of the **arm** (waist, shoulder, elbow) do this.
• **Orientation** — which way the tool points (roll, pitch, yaw). The small joints of the **wrist** do this.
That is why a typical industrial robot has 3 arm joints + 3 wrist joints = 6 DOF.` },
      { h: 'Types of end-effectors', b: `**Grippers** (hold objects):
• Mechanical two- or three-finger grippers.
• Vacuum (suction) grippers — for flat objects such as glass sheets, boxes, phone screens.
• Magnetic grippers — for steel sheets.
• Soft grippers — for fruit, eggs, delicate items.
**Tools** (do work): welding torch, spray-paint gun, screwdriver, drill, glue dispenser, laser cutter, camera.` },
      { h: 'Anatomy of a mobile robot', b: `A mobile robot has the same functional parts arranged differently:
• **Chassis/body** instead of a fixed base.
• **Locomotion system** — wheels, tracks, legs or propellers with their motors.
• **Sensors** — distance, camera, IMU, GPS, bump switches.
• **Controller** — microcontroller or SBC.
• **Power** — rechargeable battery.
• Optional **manipulator** — e.g. the robotic arm on a Mars rover.

[fig:fourWheelRobot]` },
      { h: 'Robot anatomy and the human body', b: `• Base / trunk — supports everything
• Links — bones
• Joints — human joints (shoulder, elbow, wrist)
• Drives/actuators — muscles
• End-effector — hand
• Sensors — eyes, ears, skin
• Controller — brain
• Wiring/communication — nerves
• Power supply — food and energy` },
    ],
    exam: {
      short: [
        { q: 'What is meant by robot anatomy?', a: 'The study of the physical construction of a robot — its parts (base, links, joints, wrist, end-effector, drives, sensors, controller, power supply) and how they are arranged and connected.' },
        { q: 'Differentiate between the arm and the wrist of a manipulator.', a: 'The arm (waist, shoulder, elbow joints) positions the tool in space; the wrist joints orient the tool (roll, pitch, yaw).' },
        { q: 'Name three types of grippers.', a: 'Mechanical finger grippers, vacuum/suction grippers and magnetic grippers (also soft grippers).' },
      ],
      long: [
        { q: 'Draw a labelled diagram of an industrial robot arm and explain the function of each part.', a: 'Diagram labels: base, waist joint, shoulder joint, upper arm (link), elbow joint, forearm (link), wrist, end-effector, controller with teach pendant.\nBase — fixed support. Waist — rotates the whole arm. Shoulder and elbow — raise/lower and extend the arm to position the wrist. Links — rigid members. Wrist — orients the tool. End-effector — gripper/tool that does the job. Drives — motors that move joints. Controller — stores programs and controls motion. Sensors — encoders and cameras give feedback.' },
        { q: 'Compare the anatomy of a robot with the human body.', a: 'Base ↔ trunk; links ↔ bones; joints ↔ shoulder/elbow/wrist joints; actuators ↔ muscles; end-effector ↔ hand; sensors ↔ eyes, ears, skin; controller ↔ brain; wires/communication ↔ nerves; power supply ↔ food/energy. Both systems sense, decide and act, but the robot does only what it is designed and programmed for.' },
      ],
    },
  },

  c9_p_9: {
    figs: ['stringIndex'],
    sections: [
      { h: 'Creating and traversing strings', b: `~~~
s1 = 'robot'
s2 = "It's a robot"         # double quotes allow an apostrophe
s3 = """Line one
Line two"""                  # triple quotes for many lines

for ch in "ROBO":
    print(ch, end="-")      # R-O-B-O-

for i in range(len(s1)):
    print(i, s1[i])         # index and character
~~~` },
      { h: 'Useful methods with outputs', b: `~~~
msg = "  hello robocraft  "
msg.strip()             # 'hello robocraft'
msg.strip().title()     # 'Hello Robocraft'
"banana".count("a")     # 3
"banana".find("n")      # 2  (first index; -1 if not found)
"a-b-c".split("-")      # ['a', 'b', 'c']
"-".join(["2026", "10", "21"])   # '2026-10-21'
"Robot".replace("R", "B")        # 'Bobot'
"2026".isdigit()        # True
"R2D2".isalnum()        # True
"robot".startswith("ro")         # True
~~~` },
      { h: 'Programs you should practise', b: `Count vowels:
~~~
s = input("Enter text: ").lower()
v = 0
for ch in s:
    if ch in "aeiou":
        v += 1
print("Vowels:", v)
~~~
Palindrome check:
~~~
w = input("Word: ").lower()
print("Palindrome" if w == w[::-1] else "Not a palindrome")
~~~
Initials from a full name:
~~~
name = "Aarav Kumar Sharma"
print("".join(part[0] for part in name.split()))   # AKS
~~~` },
    ],
    exam: {
      short: [
        { q: 'Give the output: s = "COMPUTER"; print(s[2:5], s[-3:])', a: 'MPU TER' },
        { q: 'What is meant by "strings are immutable"?', a: 'The characters of a string cannot be changed after it is created; s[0] = "X" gives a TypeError. Methods such as upper() return a new string.' },
        { q: 'Differentiate between find() and count().', a: 'find(x) returns the index of the first occurrence of x (or -1 if absent); count(x) returns how many times x occurs.' },
      ],
      long: [
        { q: 'Write a program to input a sentence and print: number of words, number of uppercase letters, and the sentence with every word capitalised.', a: '~~~\ns = input("Sentence: ")\nwords = s.split()\nupper = 0\nfor ch in s:\n    if ch.isupper():\n        upper += 1\nprint("Words:", len(words))\nprint("Uppercase letters:", upper)\nprint(s.title())\n~~~' },
        { q: 'Explain indexing and slicing of strings with the example "ROBOTICS".', a: 'Positive indices 0–7 from the left (R=0 … S=7); negative indices -1 to -8 from the right (S=-1 … R=-8). Indexing: s[0] → "R", s[-1] → "S". Slicing s[start:stop:step]: s[0:5] → "ROBOT", s[5:] → "ICS", s[::2] → "RBTC", s[::-1] → "SCITOBOR". The stop index is excluded.' },
      ],
    },
  },

  c9_a_9: {
    figs: ['cvPixels', 'cvTasks'],
    sections: [
      { h: 'Resolution and colour channels', b: `• **Resolution** = width × height in pixels. A 640 × 480 image has 307,200 pixels.
• **Greyscale** images store 1 number per pixel (0–255) → 1 byte.
• **Colour (RGB)** images store 3 numbers per pixel (R, G, B, each 0–255) → 3 bytes. Pure red = (255, 0, 0); white = (255, 255, 255); black = (0, 0, 0).
So a 640 × 480 colour image needs 640 × 480 × 3 = 921,600 bytes ≈ 0.9 MB before compression.` },
      { h: 'How a CV model learns', b: `1. Collect thousands of labelled images (e.g. "healthy leaf" / "diseased leaf").
2. The model (usually a **convolutional neural network**) first learns simple patterns — edges and colours — then shapes, then whole objects, layer by layer.
3. It is tested on new images it has never seen.
4. Once accurate, it is put into an app or robot camera.` },
      { h: 'Computer vision in robots', b: `• Line-following with a camera instead of IR sensors.
• Pick-and-place robots locating parts on a conveyor.
• Drones recognising landing pads and counting crops.
• Humanoids recognising faces and gestures.
• Quality-inspection robots spotting scratches and cracks.` },
    ],
    exam: {
      short: [
        { q: 'Define computer vision.', a: 'Computer vision is the domain of AI that enables machines to see, identify and interpret images and videos and act on that understanding.' },
        { q: 'How is a colour image stored in a computer?', a: 'As a grid of pixels where each pixel has three numbers (Red, Green, Blue) from 0 to 255.' },
        { q: 'Differentiate between image classification and object detection.', a: 'Classification gives one label for the whole image ("dog"); object detection finds each object and its location with a bounding box.' },
      ],
      long: [
        { q: 'Explain any four applications of computer vision.', a: 'Face recognition — phone unlock and attendance. Self-driving cars — detect lanes, signs, pedestrians. Medical imaging — find tumours or fractures in X-rays/MRI. Agriculture — detect crop disease and count fruit. (Also OCR, number-plate recognition, retail checkout.)' },
        { q: 'How does a computer "see" an image? Explain pixels, resolution and RGB, and describe how a CV model is trained.', a: 'An image is a grid of pixels; resolution is width × height (e.g. 1920 × 1080). Each pixel stores numbers — one (0–255) for greyscale or three for RGB colour. A CV model is trained on many labelled images; layers of a neural network learn edges, textures, shapes and objects. It is then tested on unseen images and deployed.' },
      ],
    },
  },

  c9_a_10: {
    figs: ['nlpPipeline'],
    sections: [
      { h: 'Worked example of text processing', b: `Text: "The robots are learning to play football!"
1. **Tokenisation:** [The, robots, are, learning, to, play, football, !]
2. **Lower-case:** [the, robots, are, learning, to, play, football, !]
3. **Remove stopwords and punctuation:** [robots, learning, play, football]
4. **Stemming:** [robot, learn, play, football]
5. **Bag of Words:** {robot: 1, learn: 1, play: 1, football: 1}
These counts are the numbers the model actually uses.` },
      { h: 'Stemming vs lemmatisation', b: `• **Stemming** chops word endings by rules and may give non-words: "studies" → "studi".
• **Lemmatisation** uses a dictionary to give a real root word (lemma): "studies" → "study", "better" → "good".
Lemmatisation is more accurate but slower.` },
      { h: 'Chatbots: two kinds', b: `• **Script/rule-based bots** follow fixed menus or keyword rules — good for simple FAQs, cannot handle unexpected questions.
• **Smart (AI) bots** use NLP models to understand varied questions and give flexible answers — e.g. voice assistants and modern AI chat apps.` },
    ],
    exam: {
      short: [
        { q: 'What is tokenisation?', a: 'Breaking text into smaller units (tokens) such as words, numbers and punctuation marks.' },
        { q: 'What are stopwords? Give examples.', a: 'Very common words that add little meaning and are usually removed in NLP, e.g. is, the, a, an, and, to.' },
        { q: 'Give two applications of NLP.', a: 'Machine translation (Google Translate) and chatbots/voice assistants (also sentiment analysis, spam filtering, speech recognition).' },
      ],
      long: [
        { q: 'Explain the steps of text normalisation with an example sentence.', a: 'Example: "Robots ARE helping Farmers!" → sentence segmentation (one sentence) → tokenisation [Robots, ARE, helping, Farmers, !] → lower-casing [robots, are, helping, farmers, !] → stopword and punctuation removal [robots, helping, farmers] → stemming/lemmatisation [robot, help, farmer] → Bag of Words counts {robot:1, help:1, farmer:1}.' },
        { q: 'Why is NLP difficult? Explain with examples.', a: 'Human language is ambiguous ("I saw her duck"); words have multiple meanings ("bank"); the same idea can be said many ways; sarcasm and emotion change meaning ("Great, another test!"); spelling mistakes, slang and mixed languages (Hinglish) are common; there are thousands of languages and dialects.' },
      ],
    },
  },

  c9_a_11: {
    figs: ['neuron', 'neuralNet'],
    sections: [
      { h: 'Biological vs artificial neuron', b: `• Dendrites (receive signals) ↔ inputs x₁, x₂, x₃
• Synapse strength ↔ weights w₁, w₂, w₃
• Cell body (adds signals) ↔ weighted sum + bias
• Firing threshold ↔ activation function
• Axon (sends signal) ↔ output` },
      { h: 'A tiny worked example', b: `A neuron decides "Go outside?" from two inputs: sunny (x₁ = 1) and homework done (x₂ = 0).
Weights: w₁ = 0.6, w₂ = 0.8, bias b = −0.5. Activation: output 1 if the sum > 0, else 0.
Sum = 1 × 0.6 + 0 × 0.8 − 0.5 = 0.1 → greater than 0 → output **1 (Go)**.
If it were not sunny (x₁ = 0): sum = −0.5 → output 0 (stay in). Training would adjust w₁, w₂ and b using many examples.` },
      { h: 'Where neural networks are used', b: `• **CNNs** (convolutional neural networks) → images and video (computer vision).
• **RNNs and transformers** → text and speech (NLP, translation, chatbots).
• Recommendation engines, fraud detection, weather prediction, game-playing AI, robot control.` },
    ],
    exam: {
      short: [
        { q: 'What is an artificial neural network?', a: 'A computing model inspired by the brain, made of layers of connected artificial neurons whose weights are adjusted during training to learn patterns.' },
        { q: 'Name the three types of layers in a neural network.', a: 'Input layer, hidden layer(s) and output layer.' },
        { q: 'What is the role of weights in a neural network?', a: 'Weights show how important each input is; learning means adjusting the weights to reduce errors.' },
      ],
      long: [
        { q: 'Draw a labelled diagram of a neural network and explain the function of each layer.', a: 'Diagram: 3 input nodes → 4 hidden nodes → 2 output nodes, every node connected to every node in the next layer. Input layer — receives features (e.g. pixel values). Hidden layer — combines inputs with weights and activation to detect patterns. Output layer — gives the result (e.g. probability of cat or dog). Many hidden layers = deep learning.' },
        { q: 'Explain how a single artificial neuron works and how a network learns.', a: 'Each input is multiplied by its weight, the products are added with a bias, and the total passes through an activation function to give the output: y = f(Σxw + b). Learning: start with random weights → predict → compare with the correct label → calculate error → adjust weights slightly to reduce the error (backpropagation) → repeat over thousands of examples until predictions are accurate.' },
      ],
    },
  },

  c9_c_7: {
    figs: ['detVsProb'],
    sections: [
      { h: 'Why rules are not enough', b: `Try writing exact rules to recognise a cat in a photo: "has two pointed ears, whiskers, fur…". But cats can be photographed from behind, in the dark, half hidden, or as cartoons — and some dogs also have pointed ears. The list of rules and exceptions never ends. Instead, AI is shown 10,000 cat photos and **learns** the pattern itself, giving an answer like "cat — 94% confident".` },
      { h: 'Probability in everyday language', b: `• "There is a **70% chance** of rain tomorrow."
• "This email is **probably** spam."
• "Customers who bought this **often** buy that."
• "This X-ray **likely** shows pneumonia — please confirm."
These are all outputs of probabilistic AI systems. Because answers are not certain, important decisions (medical, legal, financial) keep a human in the loop.` },
      { h: 'Robots face both kinds of problems', b: `• **Deterministic:** convert encoder counts into distance travelled; compute a servo angle from a formula; follow a fixed timed sequence.
• **Probabilistic:** is that dark patch on the floor a shadow or a hole? Where exactly am I in this room (localisation)? Is that a person or a mannequin? Robots combine both: exact rules for control, AI for perception and uncertain decisions.` },
    ],
    exam: {
      short: [
        { q: 'Define a deterministic problem with an example.', a: 'A problem where the same input always produces the same, exact output — e.g. calculating the area of a circle.' },
        { q: 'Define a probabilistic problem with an example.', a: 'A problem where the outcome is uncertain and can only be predicted as a likelihood — e.g. forecasting rain or detecting spam.' },
        { q: 'Why is AI needed for probabilistic problems?', a: 'Exact rules cannot cover all situations; AI learns patterns from data and gives answers with probabilities, improving with more data.' },
      ],
      long: [
        { q: 'Differentiate between deterministic and probabilistic problems (any four points) with two examples each.', a: 'Deterministic: same input → same output; exact rules can be written; no uncertainty; no learning needed — e.g. calculator, payroll. Probabilistic: outcome uncertain; answer is a likelihood; patterns learned from data; output may change as data grows — e.g. weather forecasting, face recognition.' },
        { q: 'Explain how pre-AI computing worked and why it was not enough for real-world problems.', a: 'Pre-AI computers used binary logic and logic gates to follow fixed IF-THEN rules written by programmers. They were perfect for deterministic tasks (arithmetic, sorting, timers). Real-world problems such as understanding speech, recognising faces or predicting weather are uncertain, noisy and have endless exceptions, so fixed rules fail. AI handles them by learning from examples and giving probabilistic answers.' },
      ],
    },
  },

  c10_r_15: {
    figs: ['fourWheelRobot', 'hBridge', 'ultrasonic'],
    sections: [
      { h: 'Arduino code: obstacle-avoiding four-wheeler', b: `~~~
// L298N: IN1,IN2 = left motors, IN3,IN4 = right motors
const int IN1=7, IN2=6, IN3=5, IN4=4, ENA=9, ENB=10;
const int TRIG=12, ECHO=11;

void drive(int l, int r) {          // -255..255 for each side
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l < 0);
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r < 0);
  analogWrite(ENA, abs(l)); analogWrite(ENB, abs(r));
}

long distanceCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);   // timeout 30 ms
  return t * 0.0343 / 2;
}

void setup() {
  int pins[] = {IN1,IN2,IN3,IN4,ENA,ENB,TRIG};
  for (int p : pins) pinMode(p, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  long d = distanceCm();
  if (d > 25 || d == 0) drive(180, 180);   // clear path
  else { drive(0, 0); delay(150);
         drive(-160, -160); delay(300);    // back up
         drive(170, -170); delay(350); }   // spin right
}
~~~` },
      { h: 'Python on a Raspberry Pi (gpiozero)', b: `~~~
from gpiozero import Robot, DistanceSensor
from time import sleep

robot = Robot(left=(17, 18), right=(22, 23))
eye = DistanceSensor(echo=24, trigger=25)   # echo via voltage divider!

while True:
    if eye.distance * 100 > 25:
        robot.forward(0.7)
    else:
        robot.backward(0.6); sleep(0.3)
        robot.right(0.7); sleep(0.35)
~~~` },
      { h: 'Troubleshooting checklist', b: `• Robot spins instead of going straight → one side's motor wires are reversed; swap them.
• Motors buzz but don't turn → battery too weak or PWM too low.
• Controller resets when motors start → battery voltage dips; use a separate supply or bigger battery, add a capacitor.
• Distance reads 0 always → Trig/Echo swapped or no common ground.
• Robot drifts → motors are not identical; adjust left/right PWM.` },
      { h: 'Designing the RR mechanism in Tinkercad', b: `Your syllabus also asks you to build an **RR mechanism** (two revolute joints) in Tinkercad:
1. Make a base block and a first link (a long box) with a hole at each end.
2. Place a cylinder as a pin through the base and link 1 → first revolute joint.
3. Add link 2 joined to link 1 with a second pin → second revolute joint.
4. Use Tinkercad's "Sim Lab" or rotate the links by hand to visualise the reachable area (the workspace).
[fig:rrMechanism]` },
    ],
    exam: {
      short: [
        { q: 'Why is a motor driver used in a four-wheeled robot?', a: 'The controller pins cannot supply motor current; the driver (H-bridge) switches the large battery current and lets the controller change motor speed (PWM) and direction.' },
        { q: 'How does a skid-steer robot spin on the spot?', a: 'Wheels on one side run forward while wheels on the other side run backward at the same speed.' },
        { q: 'What is the purpose of a common ground?', a: 'It gives all parts the same 0 V reference so control and sensor signals are read correctly.' },
      ],
      long: [
        { q: 'List the components needed to build a four-wheeled obstacle-avoiding robot and explain how they are integrated.', a: 'Chassis, 4 DC gear motors + wheels, L298N motor driver, Arduino/Raspberry Pi, HC-SR04 ultrasonic sensor, battery pack with switch, jumper wires. Integration: left and right motor pairs to driver outputs; driver IN1–IN4 to digital pins and ENA/ENB to PWM pins; sensor Trig/Echo to controller pins; battery to driver and (regulated) to controller; all grounds common. Code: measure distance → forward if clear, else stop–reverse–turn → repeat.' },
        { q: 'Write an algorithm and draw a flowchart for an obstacle-avoiding robot.', a: 'Algorithm: 1 Start. 2 Measure distance d. 3 If d > 25 cm move forward. 4 Else stop, reverse 0.3 s, turn right 0.35 s. 5 Go to step 2.\nFlowchart: Start → Measure d → decision d > 25? Yes → Forward → back to Measure; No → Stop → Reverse → Turn right → back to Measure.' },
      ],
    },
  },

  c10_a_7: {
    figs: ['dataSplit', 'graphTypes'],
    sections: [
      { h: 'Data cleaning before exploration', b: `Real data is messy. Common problems and fixes:
• **Missing values** → remove the row or fill with the average/most common value.
• **Duplicates** → delete repeated rows.
• **Outliers** (e.g. a height of 1700 cm) → check and correct or remove.
• **Inconsistent formats** ("Delhi", "delhi", "New Delhi") → standardise.
• **Wrong units** (cm and m mixed) → convert to one unit.` },
      { h: 'Exploring data with Python', b: `~~~
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("students.csv")     # columns: hours, marks, house
print(df.head())                      # first rows
print(df.describe())                  # mean, min, max…
df["marks"].plot(kind="hist", bins=8, title="Marks distribution")
plt.show()
df.plot(kind="scatter", x="hours", y="marks")
plt.show()
df["house"].value_counts().plot(kind="bar")
plt.show()
~~~` },
      { h: 'Reading graphs correctly', b: `• Check the **axis labels and units** first.
• A scatter plot rising from left to right shows a **positive relationship** (more hours → more marks).
• A histogram with one tall peak in the middle shows most values are near the average.
• A sudden spike in a line graph may be an **outlier** or a real event — investigate before deleting it.` },
    ],
    exam: {
      short: [
        { q: 'What is data acquisition?', a: 'The stage of the AI project cycle where relevant, reliable and sufficient data is collected from suitable sources for the problem.' },
        { q: 'Why is data split into training and testing sets?', a: 'Training data teaches the model; separate testing data checks how well it works on new, unseen data so we know it generalises.' },
        { q: 'Which graph would you use to show the share of students using each mode of transport?', a: 'A pie chart (parts of a whole). A bar graph is also acceptable.' },
      ],
      long: [
        { q: 'Explain five sources of data for an AI project with an example each.', a: 'Surveys — feedback forms from students; Sensors/IoT — temperature readings in a greenhouse; Open datasets — Kaggle or data.gov.in crop-yield data; APIs — live weather data from a weather service; Organisational records — school attendance registers; Web scraping (where allowed) — product prices from websites; Cameras — images of leaves for disease detection.' },
        { q: 'Describe the purpose of bar graphs, histograms, line graphs, scatter plots and pie charts in data exploration.', a: 'Bar graph — compares quantities across categories. Histogram — shows the distribution/frequency of numerical values in ranges. Line graph — shows change over time/trends. Scatter plot — shows the relationship (correlation) between two numerical variables and outliers. Pie chart — shows proportions of a whole.' },
      ],
    },
  },

  c10_a_8: {
    figs: ['linearRegression', 'fruitSorting'],
    sections: [
      { h: 'Linear regression worked example', b: `Data (hours studied → marks): (1, 30), (2, 38), (3, 45), (4, 52), (5, 61).
The marks rise by about 7.5 for every extra hour, so slope **m ≈ 7.5**. When hours = 0 the line meets the y-axis near **c ≈ 22.5**.
Model: **marks = 7.5 × hours + 22.5**
Prediction for 6 hours: 7.5 × 6 + 22.5 = **67.5 marks**.
In Python:
~~~
import numpy as np
hours = np.array([1, 2, 3, 4, 5])
marks = np.array([30, 38, 45, 52, 61])
m, c = np.polyfit(hours, marks, 1)
print(round(m, 2), round(c, 2))   # 7.6 22.2
print(m * 6 + c)                  # about 67.8
~~~` },
      { h: 'Confusion matrix worked example', b: `A spam filter is tested on 100 emails:
• True Positive (spam correctly flagged) = 40
• True Negative (normal email correctly passed) = 45
• False Positive (normal email wrongly flagged) = 5
• False Negative (spam that got through) = 10
**Accuracy** = (40 + 45) ÷ 100 = **85%**
**Precision** = 40 ÷ (40 + 5) = **88.9%**
**Recall** = 40 ÷ (40 + 10) = **80%**` },
      { h: 'Rule-based vs learning-based: when to use which', b: `• Rule-based: few, clear rules; must be fully explainable; little data available (e.g. "fan ON if temp > 30").
• Learning-based: patterns too complex to write by hand; lots of examples available (e.g. recognising handwriting, predicting demand).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between classification and regression.', a: 'Classification predicts a category/label (spam or not); regression predicts a continuous number (price, temperature).' },
        { q: 'In the line y = 4x + 10, predict y when x = 7.', a: 'y = 4 × 7 + 10 = 38.' },
        { q: 'Define accuracy of a model.', a: 'Accuracy = (number of correct predictions ÷ total predictions) × 100%.' },
      ],
      long: [
        { q: 'Compare rule-based and learning-based approaches to AI modelling with examples.', a: 'Rule-based: rules written by humans; transparent; cannot learn or adapt; needs little data; e.g. thermostat rule "temp > 30 → fan on". Learning-based: model learns rules from data; adapts to new data; handles complex patterns; needs lots of data and may be less explainable; e.g. spam filter or fruit-sorting classifier.' },
        { q: 'A model tested on 200 images gives TP = 90, TN = 80, FP = 10, FN = 20. Calculate accuracy, precision and recall.', a: 'Accuracy = (90 + 80) ÷ 200 = 85%. Precision = 90 ÷ (90 + 10) = 90%. Recall = 90 ÷ (90 + 20) ≈ 81.8%.' },
      ],
    },
  },

  c11_m_9: {
    figs: ['wheelTypes'],
    sections: [
      { h: 'Material selection table', b: `• **MDF** — density ~0.75 g/cm³, low cost, easy laser cutting; weak in moisture. Best for: prototypes, classroom robots.
• **Acrylic** — ~1.18 g/cm³, transparent, precise laser cutting; brittle. Best for: display models, light chassis.
• **Aluminium** — ~2.7 g/cm³, high strength-to-weight, corrosion resistant; costlier. Best for: competition robots, arms, drones.
• **Steel** — ~7.85 g/cm³, very strong and stiff, cheap per kg; heavy, rusts unless coated. Best for: industrial bases, heavy-duty frames.` },
      { h: 'Mecanum wheel motion rules', b: `With four mecanum wheels (front-left FL, front-right FR, rear-left RL, rear-right RR):
• **Forward:** all four forward.
• **Sideways right (strafe):** FL forward, FR backward, RL backward, RR forward.
• **Rotate clockwise:** left wheels forward, right wheels backward.
• **Diagonal:** only two diagonal wheels turn.
Each wheel needs its own motor and driver channel.` },
      { h: 'Precision manufacturing', b: `• **Laser cutting** — fast, accurate 2-D parts from MDF/acrylic sheets.
• **CNC machining** — cuts aluminium/steel parts accurately from blocks.
• **3D printing** — custom shapes (brackets, sensor mounts) in PLA/ABS.
• **Sheet-metal bending** — chassis plates.
Tolerances (allowed size error) of ±0.1 mm keep bearings and shafts aligned.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between omni and mecanum wheels.', a: 'Omni wheels have rollers at 90° to the wheel axis; mecanum wheels have rollers at 45°. Both allow sideways motion; mecanum robots can move in any direction with all four wheels parallel.' },
        { q: 'State one advantage and one disadvantage of aluminium for robot frames.', a: 'Advantage: light, strong and corrosion-resistant. Disadvantage: costlier and needs tools to machine.' },
        { q: 'What is a holonomic robot?', a: 'A robot that can move in any direction in the plane (forward, sideways, diagonally) without needing to turn first, e.g. with mecanum wheels.' },
      ],
      long: [
        { q: 'Compare MDF, acrylic, aluminium and steel as materials for robot frames.', a: 'MDF — cheap, easy to cut, weak against moisture; prototypes. Acrylic — transparent, laser-cut, brittle; light chassis. Aluminium — light, strong, rust-free, costly; competition/industrial arms. Steel — strongest, cheap per kg, heavy, may rust; large industrial robots. Selection depends on load, budget, weight limit and manufacturing method.' },
        { q: 'Describe standard, castor, omni and mecanum wheels with diagrams and uses.', a: 'Standard — fixed, rolls forward/back, turning by differential speed; most robot cars. Castor — swivels freely, passive support; third wheel of a 2WD robot. Omni — rollers at 90° allow sideways sliding; three-wheel holonomic bases. Mecanum — rollers at 45°; with four driven wheels the robot moves in any direction; warehouse and competition robots. Diagrams: top views showing roller angles.' },
      ],
    },
  },

  c11_c_2: {
    figs: ['flowchartSymbols', 'loopFlow'],
    sections: [
      { h: 'Worked example: largest of three numbers', b: `Algorithm:
1. Start.
2. Input A, B, C.
3. If A ≥ B and A ≥ C, then Max = A.
4. Else if B ≥ C, then Max = B.
5. Else Max = C.
6. Output Max. Stop.
Pseudocode:
~~~
BEGIN
  INPUT A, B, C
  IF A >= B AND A >= C THEN
    SET Max = A
  ELSE IF B >= C THEN
    SET Max = B
  ELSE
    SET Max = C
  ENDIF
  OUTPUT Max
END
~~~` },
      { h: 'Dry run (trace table)', b: `Algorithm: sum the readings until a reading of 0 arrives. Input: 4, 7, 2, 0
~~~
reading | sum | reading == 0?
   4    |  4  |   No
   7    | 11  |   No
   2    | 13  |   No
   0    | 13  |   Yes → output 13
~~~
A dry run proves the logic before you upload code to hardware.` },
      { h: 'From pseudocode to embedded C', b: `~~~
// IF light < 300 THEN LED ON ELSE LED OFF  (repeat forever)
void loop() {
  int light = analogRead(A0);
  if (light < 300) digitalWrite(13, HIGH);
  else             digitalWrite(13, LOW);
  delay(100);
}
~~~` },
    ],
    exam: {
      short: [
        { q: 'State any four characteristics of a good algorithm.', a: 'Input, output, definiteness (clear steps), finiteness (ends), effectiveness (each step can be carried out).' },
        { q: 'Draw/name the flowchart symbols for decision and input/output.', a: 'Decision — diamond; input/output — parallelogram.' },
        { q: 'Differentiate between an algorithm and pseudocode.', a: 'An algorithm is the step-by-step method itself (often in plain numbered steps); pseudocode writes the algorithm in structured, code-like English using keywords like IF, WHILE, INPUT.' },
      ],
      long: [
        { q: 'Write an algorithm, pseudocode and draw a flowchart to find the factorial of a number N.', a: 'Algorithm: 1 Start 2 Input N 3 Set F = 1, i = 1 4 While i ≤ N: F = F × i, i = i + 1 5 Output F 6 Stop.\nPseudocode: BEGIN; INPUT N; SET F = 1; FOR i = 1 TO N: SET F = F * i; NEXT i; OUTPUT F; END.\nFlowchart: Start → Input N → F=1, i=1 → decision i ≤ N? Yes → F = F×i → i = i+1 → back to decision; No → Output F → Stop.' },
        { q: 'Explain sequence, selection and iteration with a robotics example of each.', a: 'Sequence — steps one after another: read sensor, calculate distance, display it. Selection — choose a path based on a condition: IF distance < 20 THEN turn ELSE go forward. Iteration — repeat steps: WHILE battery > 10% keep following the line. Every program is built by combining these three structures.' },
      ],
    },
  },
};
