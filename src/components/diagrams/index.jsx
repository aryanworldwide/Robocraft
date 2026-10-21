import React from 'react';
import * as R from './robotics';
import * as A from './ai';
import * as C from './code';
import * as E from './electronics';

// Every textbook diagram, with the caption shown under it.
export const DIAGRAMS = {
  robotFields: { C: R.RobotFields, title: 'Robotics is interdisciplinary', topic: 'Robotics' },
  sensePlanAct: { C: R.SensePlanAct, title: 'The Sense–Plan–Act cycle', topic: 'Robotics' },
  robotBlock: { C: R.RobotBlock, title: 'General block diagram of a robot', topic: 'Robotics' },
  robotTimeline: { C: R.RobotTimeline, title: 'Timeline of robotics', topic: 'Robotics' },
  robotClassification: { C: R.RobotClassification, title: 'Classification of robots', topic: 'Robotics' },
  robotArmAnatomy: { C: R.RobotArmAnatomy, title: 'Anatomy of an industrial robot arm', topic: 'Robotics' },
  jointTypes: { C: R.JointTypes, title: 'Types of joints', topic: 'Robotics' },
  dof6: { C: R.Dof6, title: 'Six degrees of freedom', topic: 'Robotics' },
  motionTypes: { C: R.MotionTypes, title: 'Linear, angular and circular motion', topic: 'Robotics' },
  fourBar: { C: R.FourBar, title: 'Four-bar linkage', topic: 'Robotics' },
  actuatorTypes: { C: R.ActuatorTypes, title: 'Electric, hydraulic and pneumatic actuators', topic: 'Robotics' },
  openClosedLoop: { C: R.OpenClosedLoop, title: 'Open-loop vs closed-loop control', topic: 'Robotics' },
  gearRatio: { C: R.GearRatio, title: 'Gear ratio', topic: 'Robotics' },
  gearTypes: { C: R.GearTypes, title: 'Types of gears', topic: 'Robotics' },
  sensorTypes: { C: R.SensorTypes, title: 'Classification of sensors', topic: 'Robotics' },
  rrMechanism: { C: R.RRMechanism, title: 'RR mechanism and its forward kinematics', topic: 'Robotics' },
  robotIdentify: { C: R.RobotIdentify, title: 'Is it a robot?', topic: 'Robotics' },
  cobotVsRobot: { C: R.CobotVsRobot, title: 'Industrial robot vs cobot', topic: 'Robotics' },
  fourWheelRobot: { C: R.FourWheelRobot, title: 'Four-wheeled mobile robot (top view)', topic: 'Robotics' },
  workspace: { C: R.Workspace, title: 'Workspace of a robot arm', topic: 'Robotics' },
  accuracyRepeat: { C: R.AccuracyRepeat, title: 'Accuracy vs repeatability', topic: 'Robotics' },
  quadcopter: { C: R.Quadcopter, title: 'Quadcopter layout', topic: 'Robotics' },
  wheelTypes: { C: R.WheelTypes, title: 'Wheel types', topic: 'Robotics' },
  coordSystems: { C: R.CoordSystems, title: 'Coordinate systems', topic: 'Robotics' },
  frames: { C: R.Frames, title: 'Reference frames', topic: 'Robotics' },
  vectorRotation: { C: R.VectorRotation, title: 'Rotating a vector with a matrix', topic: 'Robotics' },
  projectLifecycle: { C: R.ProjectLifecycle, title: 'Project lifecycle and Gantt chart', topic: 'Robotics' },
  planarSpatial: { C: R.MechanismPlanarSpatial, title: 'Planar vs spatial mechanisms', topic: 'Robotics' },

  aiVenn: { C: A.AiVenn, title: 'AI, machine learning and deep learning', topic: 'AI' },
  aiProjectCycle: { C: A.AiProjectCycle, title: 'AI project cycle', topic: 'AI' },
  fourWs: { C: A.FourWs, title: '4Ws problem canvas', topic: 'AI' },
  dataSplit: { C: A.DataSplit, title: 'Training vs testing data', topic: 'AI' },
  graphTypes: { C: A.GraphTypes, title: 'Graphs for data exploration', topic: 'AI' },
  linearRegression: { C: A.LinearRegression, title: 'Linear regression', topic: 'AI' },
  mlTypes: { C: A.MlTypes, title: 'Types of machine learning', topic: 'AI' },
  fruitSorting: { C: A.FruitSorting, title: 'Machine learning: sorting fruit', topic: 'AI' },
  turingTest: { C: A.TuringTest, title: 'The Turing test', topic: 'AI' },
  aiDomains: { C: A.AiDomains, title: 'The three domains of AI', topic: 'AI' },
  cvPixels: { C: A.CvPixels, title: 'Images are numbers', topic: 'AI' },
  cvTasks: { C: A.CvTasks, title: 'Computer vision tasks', topic: 'AI' },
  nlpPipeline: { C: A.NlpPipeline, title: 'NLP pipeline', topic: 'AI' },
  neuralNet: { C: A.NeuralNet, title: 'Neural network layers', topic: 'AI' },
  neuron: { C: A.Neuron, title: 'An artificial neuron', topic: 'AI' },
  detVsProb: { C: A.DetVsProb, title: 'Deterministic vs probabilistic', topic: 'AI' },
  dataToInfo: { C: A.DataToInfo, title: 'From data to information', topic: 'AI' },
  cyberThreats: { C: A.CyberThreats, title: 'Cyber threats and defences', topic: 'AI' },

  ifElseFlow: { C: C.IfElseFlow, title: 'if – elif – else flowchart', topic: 'Python' },
  loopFlow: { C: C.LoopFlow, title: 'while loop flowchart', topic: 'Python' },
  pythonMemory: { C: C.PythonMemory, title: 'Variables as labelled boxes', topic: 'Python' },
  stringIndex: { C: C.StringIndex, title: 'String indexing and slicing', topic: 'Python' },
  listVsTuple: { C: C.ListVsTuple, title: 'List vs tuple', topic: 'Python' },
  functionAnatomy: { C: C.FunctionAnatomy, title: 'Parts of a function', topic: 'Python' },
  pythonTypes: { C: C.PythonTypes, title: 'Python data types', topic: 'Python' },
  operatorPrecedence: { C: C.OperatorPrecedence, title: 'Operator precedence', topic: 'Python' },
  flowchartSymbols: { C: C.FlowchartSymbols, title: 'Flowchart symbols', topic: 'Computing' },
  logicGates: { C: C.LogicGates, title: 'Logic gate symbols', topic: 'Computing' },
  truthTable2: { C: C.TruthTable2, title: 'Truth table for every 2-input gate', topic: 'Computing' },
  binaryPlace: { C: C.BinaryPlace, title: 'Binary place values', topic: 'Computing' },
  decToBin: { C: C.DecToBin, title: 'Decimal to binary', topic: 'Computing' },
  numberSystems: { C: C.NumberSystems, title: 'Number systems', topic: 'Computing' },
  computingGenerations: { C: C.ComputingGenerations, title: 'Generations of computers', topic: 'Computing' },
  mcuBlock: { C: C.McuBlock, title: 'Microcontroller block diagram', topic: 'Computing' },

  ledCircuit: { C: E.LedCircuit, title: 'LED with a resistor', topic: 'Electronics' },
  ohmTriangle: { C: E.OhmTriangle, title: "Ohm's law", topic: 'Electronics' },
  pwm: { C: E.Pwm, title: 'PWM duty cycle', topic: 'Electronics' },
  hBridge: { C: E.HBridge, title: 'H-bridge motor driver', topic: 'Electronics' },
  ultrasonic: { C: E.Ultrasonic, title: 'How an ultrasonic sensor measures distance', topic: 'Electronics' },
  pidLoop: { C: E.PidLoop, title: 'PID control loop', topic: 'Electronics' },
  commProtocols: { C: E.CommProtocols, title: 'UART, I2C, SPI and CAN', topic: 'Electronics' },
  batteryCompare: { C: E.BatteryCompare, title: 'Lithium-ion vs lead-acid', topic: 'Electronics' },
  powerBudget: { C: E.PowerBudget, title: 'Power budget for a robot', topic: 'Electronics' },
};

export function Diagram({ name, caption, compact = false }) {
  const d = DIAGRAMS[name];
  if (!d) return null;
  const Comp = d.C;
  return (
    <figure className={`rounded-xl bg-background/60 border border-border ${compact ? 'p-2' : 'p-3'}`}>
      <Comp />
      <figcaption className="text-[11px] text-muted-foreground text-center mt-1.5">
        <span className="font-semibold text-foreground/80">Fig.</span> {caption || d.title}
      </figcaption>
    </figure>
  );
}

export default Diagram;
