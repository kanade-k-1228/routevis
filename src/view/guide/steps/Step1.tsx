import {
  AlertTriangle,
  Battery,
  Camera,
  CheckCircle2,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
} from "lucide-react";
import type { FC } from "react";

export const Step1: FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          Building an autonomous vehicle starts with the right hardware
          foundation. You'll need sensors to perceive the environment, compute
          units to process data in real-time, and interfaces to communicate with
          your vehicle's existing systems.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-white mb-4">Components</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <Camera className="w-8 h-8 text-blue-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">
                Yamori (Camera Module)
              </h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Minimum 120° FOV wide-angle lens</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>1080p @ 30fps or higher resolution</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Global shutter preferred for motion blur reduction</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>HDR support for varying light conditions</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Budget: Logitech C920 (~$70)
              <br />
              Pro: See3CAM_CU135 (~$300)
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <Cpu className="w-8 h-8 text-purple-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">
                EAC-5000 (Computer)
              </h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Minimum 8 TOPS AI performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>CUDA-capable GPU for neural networks</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>16GB+ RAM for model inference</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>NVMe SSD for logging and caching</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Recommended: NVIDIA Jetson Orin NX or AGX
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <Wifi className="w-8 h-8 text-green-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">
                Panda (CAN Interface)
              </h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>Dual-channel CAN FD support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>5Mbps+ data rate capability</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>Hardware timestamping for synchronization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>Galvanic isolation for safety</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Recommended: Comma.ai Panda
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <HardDrive className="w-8 h-8 text-orange-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">
                Ohkami (IMU/GNSS Module)
              </h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>9-DOF IMU with gyro, accelerometer, magnetometer</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>RTK-capable GNSS for cm-level accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>100Hz+ update rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>Time synchronization via PPS</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Recommended: Turing Ohkami Navigator
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <Battery className="w-8 h-8 text-yellow-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">Power Supply</h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>12V to 19V DC-DC converter</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>150W+ continuous output</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Ignition-triggered power control</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Backup battery for safe shutdown</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Recommended: M4-ATX or PicoPSU-160-XT
            </div>
          </div>

          {/* Display */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center mb-3">
              <Monitor className="w-8 h-8 text-cyan-400 mr-3" />
              <h4 className="text-xl font-semibold text-white">Display</h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>7-10 inch touchscreen</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>1024x600 minimum resolution</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Sunlight readable (800+ nits)</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>HDMI or DSI interface</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded font-mono text-sm text-green-400">
              Recommended: Waveshare 7inch DSI LCD
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Installation Guide
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Mount the Camera
                </h4>
                <p className="text-gray-300 mb-4">
                  Position the camera behind the windshield at the center,
                  ensuring a clear view of the road ahead.
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
                  <pre>{`# Test camera feed
gst-launch-1.0 v4l2src device=/dev/video0 ! \\
  video/x-raw,width=1920,height=1080,framerate=30/1 ! \\
  xvimagesink`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Connect CAN Interface
                </h4>
                <p className="text-gray-300 mb-4">
                  Connect the CAN interface to your vehicle's OBD-II port or
                  directly to the CAN bus.
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
                  <pre>{`# Configure CAN interface
sudo ip link set can0 type can bitrate 500000
sudo ip link set up can0

# Verify connection
candump can0`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Setup Compute Unit
                </h4>
                <p className="text-gray-300 mb-4">
                  Install the compute unit in a ventilated location and connect
                  all peripherals.
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
                  <pre>{`# Flash JetPack to Jetson
sudo ./sdkmanager --cli install \\
  --logintype devzone \\
  --product Jetson \\
  --target-os Linux \\
  --version 5.1.2 \\
  --flash all`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">
                4
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Install IMU/GNSS
                </h4>
                <p className="text-gray-300 mb-4">
                  Mount the IMU at the vehicle's center of gravity and the GNSS
                  antenna on the roof.
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
                  <pre>{`# Configure GNSS for RTK
str2str -in serial://ttyACM0:115200 \\
  -out ntrips://:PASSWORD@rtk.provider.com:2101/MOUNT \\
  -b 1`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Power Management */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">Power Management</h3>
        <div className="bg-orange-900/20 border border-orange-600 rounded-lg p-6">
          <div className="flex items-start mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-400 mr-3 shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-2">
                Critical Considerations
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Total system power draw: ~60-100W under full load</li>
                <li>
                  • Use a DC-DC converter with proper voltage regulation (12V →
                  19V for Jetson)
                </li>
                <li>• Install a backup battery system for graceful shutdown</li>
                <li>• Add fuses on all power lines for safety</li>
                <li>• Monitor vehicle battery voltage to prevent drainage</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-black/50 rounded-lg p-4 font-mono text-sm text-orange-400">
            <pre>{`# Power monitoring script
#!/bin/bash
VOLTAGE=$(cat /sys/class/power_supply/BAT0/voltage_now)
if [ $VOLTAGE -lt 11500000 ]; then
  echo "Low voltage detected! Initiating shutdown..."
  systemctl poweroff
fi`}</pre>
          </div>
        </div>
      </section>

      {/* Verification Checklist */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">
          Installation Verification
        </h3>
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4">
            Pre-flight Checklist
          </h4>
          <div className="space-y-3">
            {[
              "Camera feed is clear and stable at 30+ FPS",
              "CAN interface receives vehicle messages",
              "Compute unit temperatures are within limits (<80°C)",
              "IMU reports stable orientation data",
              "GNSS achieves RTK fix with <2cm accuracy",
              "All components are securely mounted",
              "Power system provides stable voltage",
              "Network connectivity is established",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="mr-3 w-5 h-5 text-green-500"
                />
                <CheckCircle2 className="w-5 h-5 text-gray-600 group-hover:text-green-400 mr-2" />
                <span className="text-gray-300 group-hover:text-white">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4">Common Issues</h3>
        <div className="space-y-4">
          <details className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 cursor-pointer">
            <summary className="text-lg font-semibold text-white">
              Camera not detected
            </summary>
            <div className="mt-3 text-gray-300 space-y-2">
              <p>Check USB connection and power supply. Verify with:</p>
              <code className="block bg-black/50 p-2 rounded text-sm text-green-400">
                ls -la /dev/video* && v4l2-ctl --list-devices
              </code>
            </div>
          </details>

          <details className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 cursor-pointer">
            <summary className="text-lg font-semibold text-white">
              CAN bus timeout errors
            </summary>
            <div className="mt-3 text-gray-300 space-y-2">
              <p>Verify bitrate matches vehicle configuration:</p>
              <code className="block bg-black/50 p-2 rounded text-sm text-green-400">
                ip -details -statistics link show can0
              </code>
            </div>
          </details>

          <details className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 cursor-pointer">
            <summary className="text-lg font-semibold text-white">
              High CPU temperature
            </summary>
            <div className="mt-3 text-gray-300 space-y-2">
              <p>Improve cooling and check thermal throttling:</p>
              <code className="block bg-black/50 p-2 rounded text-sm text-green-400">
                sudo jetson_clocks --show && tegrastats
              </code>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
};