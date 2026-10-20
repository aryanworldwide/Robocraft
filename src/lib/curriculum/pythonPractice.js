// "Try it" Python exercises for the Python lessons. Each one runs in the
// in-app Python (Pyodide). `task` is a small challenge to change the code.
export const PYTHON_PRACTICE = {
  c9_p_1: {
    task: 'Change the sensor readings and see how the average changes. Can you also print the highest reading?',
    code: `# Data -> information: turn raw sensor readings into something useful
readings = [23, 25, 22, 30, 28]

average = sum(readings) / len(readings)
print("Raw data:", readings)
print("Average temperature:", average)

if average > 25:
    print("Information: the room is warm")
else:
    print("Information: the room is cool")
`,
  },
  c9_p_2: {
    task: 'Type your name in the Input box below, then run. Try removing the indentation on line 6 to see the error Python gives.',
    code: `# Script mode: the whole program runs at once
# Comments start with # and are ignored by Python
name = input("Enter your name: ")
print("Hello,", name)
if len(name) > 5:
    print("That's a long name!")
print("Python is case-sensitive: Name and name are different")
`,
    input: 'Asha',
  },
  c9_p_3: {
    task: 'Add a complex number (like 3+4j) and a list, and print their types too.',
    code: `age = 15
pi = 3.14
name = "RoboCraft"
is_robot = True

for value in [age, pi, name, is_robot]:
    print(value, "->", type(value).__name__)

# Type conversion
print(int("42") + 8)
print(float("2.5") * 2)
print(str(100) + " points")
`,
  },
  c9_p_4: {
    task: 'Swap the values of x and y in one line, then print them.',
    code: `robot_name = "Atlas"
sensor_count = 12
MAX_SPEED = 100   # capitals = treat as a constant

x, y, z = 10, 20, 30   # multiple assignment
print(robot_name, "has", sensor_count, "sensors")
print("x, y, z =", x, y, z)

speed = 40
speed = speed + 25   # variables can change
print("Speed:", speed, "/", MAX_SPEED)
`,
  },
  c9_p_5: {
    task: 'Predict each answer before you run. Then add an example using % (remainder).',
    code: `print("10 / 3  =", 10 / 3)
print("10 // 3 =", 10 // 3)
print("2 ** 8  =", 2 ** 8)
print("True and False =", True and False)
print("'bot' in 'robot' =", 'bot' in 'robot')

speed = 50
speed += 10
print("speed after += 10:", speed)
print("speed > 55 ?", speed > 55)
`,
  },
  c9_p_6: {
    task: 'Change distance and battery to test every branch. Add a new rule: if distance < 5, print "EMERGENCY STOP".',
    code: `distance = 15   # cm to the nearest obstacle
battery = 60    # percent

if distance < 20:
    print("Obstacle close -> turn left")
elif battery < 20:
    print("Battery low -> go to charger")
else:
    print("Path clear -> move forward")

status = "active" if battery > 20 else "low"
print("Status:", status)
`,
  },
  c9_p_7: {
    task: 'Make the robot count down from 10 to 1 using range(10, 0, -1). Then use break to stop at 5.',
    code: `# for loop over a range
for i in range(5):
    print("Step", i)

# while loop: drain the battery
battery = 30
while battery > 0:
    print("Battery:", battery)
    battery -= 10
print("Battery empty, robot stops")

# continue skips odd numbers
for n in range(1, 8):
    if n % 2 == 1:
        continue
    print("Even:", n)
`,
  },
  c9_p_8: {
    task: 'Write a function cm_to_inch(cm) that returns cm / 2.54 and test it with 30.',
    code: `def area_of_rectangle(length, width):
    return length * width

def greet_robot(name, mood="happy"):
    print(f"Hello {name}! You look {mood} today.")

print("Area:", area_of_rectangle(4, 6))
greet_robot("Robo")
greet_robot("Atlas", "busy")

# A function that decides what a robot should do
def decide(distance):
    if distance < 20:
        return "turn"
    return "forward"

for d in [50, 30, 10]:
    print(d, "cm ->", decide(d))
`,
  },
  c10_p_1: {
    task: 'Add a new sensor with append(), remove "gyro", and print the sorted list.',
    code: `sensors = ["ultrasonic", "IR", "gyro", "LDR"]
print("All sensors:", sensors)
print("First:", sensors[0], "| Last:", sensors[-1])
print("Slice [1:3]:", sensors[1:3])

readings = [42, 17, 88, 63, 25]
print("Max:", max(readings), "Min:", min(readings))
print("Sorted:", sorted(readings))

squares = [n * n for n in range(1, 6)]   # list comprehension
print("Squares:", squares)
`,
  },
  c10_p_2: {
    task: 'Try to change position[0] = 5 and read the error. Why are tuples useful for fixed coordinates?',
    code: `position = (10, 20)          # a tuple cannot be changed
x, y = position              # unpacking
print("x =", x, "y =", y)

colours = ("red", "green", "blue", "green")
print("Count of green:", colours.count("green"))
print("Index of blue:", colours.index("blue"))

# A function can return several values as a tuple
def min_max(values):
    return min(values), max(values)

low, high = min_max([7, 3, 9, 1])
print("Low:", low, "High:", high)
`,
  },
  c10_p_3: {
    task: 'Count how many vowels are in the message. Hint: loop over the letters and check "aeiou".',
    code: `message = "Robots Are Fun To Build"
print(message.upper())
print(message.lower())
print("Length:", len(message))
print("First word:", message.split()[0])
print("Reversed:", message[::-1])
print("Replace:", message.replace("Fun", "Awesome"))
print("Starts with 'Rob'?", message.startswith("Rob"))

name = "atlas"
print(f"Robot name: {name.title()} ({len(name)} letters)")
`,
  },
  c10_p_4: {
    task: 'Use random.randint to simulate rolling a dice 5 times.',
    code: `import math
import random
from datetime import date

print("Square root of 144:", math.sqrt(144))
print("Pi:", round(math.pi, 4))
print("Angle 90° in radians:", math.radians(90))

random.seed(1)
print("Random sensor noise:", random.uniform(-0.5, 0.5))
print("Today is", date.today())
`,
  },
  c10_p_5: {
    task: 'A package is a folder of modules. Print statistics.mean and statistics.median of your own list of scores.',
    code: `# Packages group related modules. 'json' and 'statistics' come with Python.
import json
import statistics

robot = {"name": "Atlas", "sensors": ["IR", "ultrasonic"], "speed": 40}
text = json.dumps(robot)
print("As JSON text:", text)
print("Back to Python:", json.loads(text)["name"])

scores = [72, 85, 90, 66, 85]
print("Mean:", statistics.mean(scores))
print("Mode:", statistics.mode(scores))
`,
  },
  c10_p_6: {
    task: 'Create a 3×3 array with np.arange(9).reshape(3, 3) and print its transpose (.T).',
    code: `import numpy as np

readings = np.array([20, 22, 25, 23, 30])
print("Array:", readings)
print("Mean:", readings.mean(), "Std:", round(readings.std(), 2))
print("Readings above 22:", readings[readings > 22])
print("In Fahrenheit:", readings * 9 / 5 + 32)

matrix = np.array([[1, 2], [3, 4]])
print("Matrix x 2:\\n", matrix * 2)
print("Dot product:\\n", matrix @ matrix)
`,
    note: 'First run downloads NumPy (a few MB).',
  },
  c10_p_7: {
    task: 'Change the equation to solve x² − 5x + 6 = 0 (answer: 2 and 3).',
    code: `from scipy import optimize, stats
import numpy as np

# Find where x^2 - 4 = 0, starting near x = 1
root = optimize.fsolve(lambda x: x**2 - 4, 1)
print("Root:", root)

data = np.array([12, 15, 14, 10, 18, 16])
print("Mean:", data.mean())
print("Mode result:", stats.mode(data, keepdims=False))
`,
    note: 'First run downloads SciPy (large, about 30 MB). Use Wi-Fi.',
  },
  c10_p_8: {
    task: 'Add a "Marks" column and print only students with Marks above 80.',
    code: `import pandas as pd

data = {
    "Robot": ["Atlas", "Spot", "Pepper", "Nao"],
    "Legs": [2, 4, 0, 2],
    "Battery_h": [1.0, 1.5, 12.0, 1.5],
}
df = pd.DataFrame(data)
print(df)
print()
print("Average battery:", df["Battery_h"].mean())
print()
print("Robots with legs:")
print(df[df["Legs"] > 0])
`,
    note: 'First run downloads pandas (a few MB).',
  },
  c10_p_9: {
    task: 'Change the chart to a bar chart with plt.bar(days, temps) and add a title.',
    code: `import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
temps = [24, 27, 26, 30, 28]

plt.plot(days, temps, marker="o")
plt.xlabel("Day")
plt.ylabel("Temperature (°C)")
plt.title("Robot weather station")
plt.grid(True)
plt.show()
`,
    note: 'First run downloads Matplotlib (a few MB).',
  },
};

export const PLAYGROUND_STARTER = `# Welcome to the RoboCraft Python playground!
# Write any Python code and press Run.

robot = "RoboCraft"
for i in range(3):
    print(f"{robot} says hello #{i + 1}")
`;
