import type { FC } from "react";
import {
  Activity,
  AlertTriangle,
  Database,
  Lock,
  Terminal,
} from "lucide-react";

export const Step2: FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview with warning box */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Understanding CAN Bus
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed mb-4">
          The Controller Area Network (CAN) bus is your vehicle's nervous
          system. Every sensor, actuator, and ECU communicates through this
          network. To achieve autonomous control, we need to decode these
          messages and inject our own commands.
        </p>
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 shrink-0 mt-1" />
            <p className="text-yellow-300">
              <strong>Legal Notice:</strong> Only perform these operations on
              vehicles you own. Always test in safe, controlled environments.
              Never compromise safety systems.
            </p>
          </div>
        </div>
      </section>

      {/* CAN Message Structure - Rich component */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          CAN Message Anatomy
        </h3>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <div className="font-mono text-sm">
            <div className="mb-4 text-green-400">
              <pre>{`# Standard CAN frame structure
   CAN ID   | DLC |  DATA BYTES (0-8)
   0x1D2    |  8  |  01 02 03 04 05 06 07 08`}</pre>
            </div>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-blue-400">CAN ID:</span> Message
                identifier (11 or 29 bits)
              </p>
              <p>
                <span className="text-blue-400">DLC:</span> Data Length Code
                (0-8 bytes)
              </p>
              <p>
                <span className="text-blue-400">Data:</span> Actual message
                payload
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step by step with rich cards */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Reverse Engineering Process
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Passive Monitoring
                </h4>
                <p className="text-gray-300 mb-4">
                  Start by observing the CAN traffic without sending any messages.
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{`# Capture all CAN messages
candump -l can0

# Filter specific IDs
candump can0,0x1D2:0x7FF

# Monitor with timestamps
candump -ta can0 | tee can_log_$(date +%Y%m%d_%H%M%S).txt`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 with colored boxes */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Correlate with Vehicle Actions
                </h4>
                <p className="text-gray-300 mb-4">
                  Perform specific actions and observe CAN message changes.
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                    <h5 className="text-blue-400 font-semibold mb-2">
                      Steering Wheel Angle
                    </h5>
                    <code className="block bg-black/50 p-3 rounded text-sm text-green-400">
                      candump can0 | grep -E "0x0[0-9A-F]4"
                    </code>
                  </div>
                  <div className="bg-green-900/20 border border-green-600 rounded p-4">
                    <h5 className="text-green-400 font-semibold mb-2">
                      Speed Signals
                    </h5>
                    <code className="block bg-black/50 p-3 rounded text-sm text-green-400">
                      candump can0 | python3 find_speed.py --target-speed 50
                    </code>
                  </div>
                  <div className="bg-orange-900/20 border border-orange-600 rounded p-4">
                    <h5 className="text-orange-400 font-semibold mb-2">
                      Brake Pressure
                    </h5>
                    <code className="block bg-black/50 p-3 rounded text-sm text-green-400">
                      candump can0,0x200:0x7FF | grep -v "00 00 00"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturer protocols in grid */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Common Protocols by Manufacturer
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              Toyota/Lexus
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Safety Connect: 0x283, 0x2C1</li>
              <li>• Steering: 0x025, 0x0E4</li>
              <li>• ACC Commands: 0x343, 0x344</li>
              <li>• Checksum: XOR-based</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-lg font-semibold text-green-400 mb-2">
              Honda/Acura
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• LKAS: 0x0E4, 0x194</li>
              <li>• ACC: 0x1FA, 0x200</li>
              <li>• VSA: 0x1A4, 0x1A6</li>
              <li>• Counter: 4-bit rolling</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-lg font-semibold text-purple-400 mb-2">GM</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Steering: 0x180, 0x184</li>
              <li>• Regen Braking: 0x1C6</li>
              <li>• Park Assist: 0x320-0x340</li>
              <li>• Authentication: Rolling code</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-lg font-semibold text-orange-400 mb-2">
              Hyundai/Kia
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• SCC: 0x420, 0x421</li>
              <li>• LKAS11: 0x340</li>
              <li>• CLU11: 0x4F1</li>
              <li>• Checksum: CRC8</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security with danger box */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Security & Safety
        </h3>
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <Lock className="w-6 h-6 text-red-400 mr-3 shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-3">
                Critical Security Measures
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Implement rate limiting on all control messages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Add sanity checks for all sensor values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Use hardware interlocks for critical systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Log all commands for forensic analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Implement watchdog timers for fault detection</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-orange-400">
            <pre>{`# Safety monitor daemon
while true; do
  if [ $(canbusload can0 | cut -d' ' -f3) -gt 80 ]; then
    echo "CAN bus overload detected!"
    systemctl stop adas-control
  fi
  sleep 0.1
done`}</pre>
          </div>
        </div>
      </section>

      {/* Tools with icons */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">Essential Tools</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <Terminal className="w-8 h-8 text-blue-400 mb-2" />
            <h4 className="text-lg font-semibold text-white mb-1">can-utils</h4>
            <p className="text-gray-400 text-sm">Basic CAN tools for Linux</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <Database className="w-8 h-8 text-green-400 mb-2" />
            <h4 className="text-lg font-semibold text-white mb-1">CANalyze</h4>
            <p className="text-gray-400 text-sm">GUI for message analysis</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <Activity className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="text-lg font-semibold text-white mb-1">Wireshark</h4>
            <p className="text-gray-400 text-sm">
              Protocol analysis with CAN plugin
            </p>
          </div>
        </div>
      </section>

      {/* Python code example */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Python Implementation
        </h3>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`#!/usr/bin/python3
import can
import struct

def decode_steering_angle(data):
    """Decode steering angle from CAN message"""
    # Extract 16-bit signed value (big-endian)
    raw = struct.unpack('>h', data[0:2])[0]
    # Convert to degrees (scale factor 0.1)
    angle = raw * 0.1
    return angle

# Setup CAN interface
bus = can.interface.Bus('can0', bustype='socketcan')

# Listen for steering messages
for msg in bus:
    if msg.arbitration_id == 0x025:
        angle = decode_steering_angle(msg.data)
        print(f"Steering: {angle:.1f}°")`}</pre>
        </div>
      </section>
    </div>
  );
};