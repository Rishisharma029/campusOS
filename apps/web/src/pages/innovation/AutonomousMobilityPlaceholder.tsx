import React, { useState } from 'react';
import { 
  Navigation, 
  Car, 
  Terminal, 
  RefreshCw, 
  ExternalLink, 
  Wifi, 
  Sliders, 
  Database, 
  FileCode, 
  Radio, 
  ShieldAlert,
  Cpu
} from 'lucide-react';

export const AutonomousMobilityPlaceholder: React.FC = () => {
  const [serviceUrl, setServiceUrl] = useState<string>('http://localhost:5002');
  const [rosBridgeWs, setRosBridgeWs] = useState<string>('ws://localhost:9090');
  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('IDLE');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BRIDGE_CONFIG' | 'TELEMETRY_CONTRACTS' | 'MOUNT_CONTAINER'>('OVERVIEW');
  const [pingLog, setPingLog] = useState<string[]>([]);

  const handleTestConnection = () => {
    setConnectionStatus('CONNECTING');
    setPingLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Testing ROS2 Bridge WebSocket at ${rosBridgeWs}...`,
      `[${new Date().toLocaleTimeString()}] Pinging standalone service endpoint: ${serviceUrl}/health...`,
      ...prev
    ]);

    setTimeout(() => {
      setConnectionStatus('DISCONNECTED');
      setPingLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Standalone service at ${serviceUrl} is not yet active. Ready to launch and connect your standalone project repo.`,
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-3">
            <Navigation size={14} />
            <span>GENOVA INNOVATION • INTEGRATION POINT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Autonomous Mobility System (AMS)
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Autonomous Vehicle Fleet, Teleoperation & Campus Robotics Bridge integration portal.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Bridge Status: Awaiting Standalone Project Connection</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700">
              <Radio size={14} className="text-cyan-400" />
              <span>ROS2 Bridge Port: 9090</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'OVERVIEW', label: 'Architecture Overview' },
          { id: 'BRIDGE_CONFIG', label: 'ROS2 & Service Bridge' },
          { id: 'TELEMETRY_CONTRACTS', label: 'Telemetry & Topics' },
          { id: 'MOUNT_CONTAINER', label: 'Standalone Mount Container' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Architecture Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-surface dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Car size={18} className="text-cyan-500" />
              Standalone Autonomous Mobility Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This module is an official <strong>integration point</strong> for your standalone Autonomous Mobility codebase. It provides the ROS2 bridge WebSocket listener, CAN telemetry handlers, emergency safety interlock, and micro-frontend mount container so your dedicated AV project connects directly without fake simulators.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  1. ROS2 Nav2 Navigation Stack
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Global waypoint routing, costmap inflation, recovery behaviors, and TEB local trajectory planner.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  2. LiDAR SLAM & Sensor Fusion
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  3D PointCloud2 clustering, RTK-GNSS positioning, IMU Kalman filtering, and obstacle bounding boxes.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  3. Drive-by-Wire CAN Bus Interlock
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hardware safety loop, physical emergency e-stop overrides, battery BMS vitals, and motor throttle limits.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  4. Fleet Dispatch & Teleoperation
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time WebRTC teleoperation video stream and automated campus passenger booking routing.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Bridge Status Panel */}
          <div className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Bridge Diagnostic
                </h4>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Standalone Target</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{serviceUrl}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">ROS2 Bridge</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{rosBridgeWs}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Integration Mode</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">Standalone Micro-Frontend Ready</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              className="mt-6 w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <RefreshCw size={14} className={connectionStatus === 'CONNECTING' ? 'animate-spin' : ''} />
              Test Bridge Connection
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: ROS2 & Service Bridge */}
      {activeTab === 'BRIDGE_CONFIG' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders size={18} className="text-cyan-500" />
              Standalone Autonomous Mobility Service Bridge Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure the host endpoints for your standalone AV web UI and rosbridge_server WebSocket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Standalone AV Web UI URL
              </label>
              <input
                type="text"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                placeholder="http://localhost:5002"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: http://localhost:5002</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ROS2 Bridge WebSocket (rosbridge_suite)
              </label>
              <input
                type="text"
                value={rosBridgeWs}
                onChange={(e) => setRosBridgeWs(e.target.value)}
                placeholder="ws://localhost:9090"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Provides direct JSON ROS2 topic subscriptions</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Bridge Console Output</div>
            {pingLog.length === 0 ? (
              <div className="text-slate-500 text-[11px]">Ready to ping. Click "Test Bridge Connection" to verify standalone server and ROS bridge.</div>
            ) : (
              pingLog.map((log, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              className="py-2.5 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <RefreshCw size={14} className={connectionStatus === 'CONNECTING' ? 'animate-spin' : ''} />
              Test Bridge Connection
            </button>
            <button
              onClick={() => alert(`Saved bridge configuration for ${serviceUrl}`)}
              className="py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Telemetry & Topics */}
      {activeTab === 'TELEMETRY_CONTRACTS' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio size={18} className="text-cyan-500" />
            Standard ROS2 Topics & Telemetry Specifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The Genova Shell connects to the following ROS2 topics over the rosbridge WebSocket:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-cyan-500 font-bold">SUB</span> <span className="text-slate-800 dark:text-slate-200">/vehicle/odom</span> (nav_msgs/Odometry)
              <p className="font-sans text-[11px] text-slate-400 mt-1">Vehicle pose (X, Y, Z, orientation) and linear/angular velocity for live campus map overlay.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-cyan-500 font-bold">SUB</span> <span className="text-slate-800 dark:text-slate-200">/vehicle/battery_state</span> (sensor_msgs/BatteryState)
              <p className="font-sans text-[11px] text-slate-400 mt-1">State of charge (SoC %), cell voltages, and thermal safety metrics.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-purple-500 font-bold">PUB</span> <span className="text-slate-800 dark:text-slate-200">/goal_pose</span> (geometry_msgs/PoseStamped)
              <p className="font-sans text-[11px] text-slate-400 mt-1">Direct waypoint dispatch from Genova CampusOS dispatch operator.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-rose-500 font-bold">PUB</span> <span className="text-slate-800 dark:text-slate-200">/emergency_stop</span> (std_msgs/Bool)
              <p className="font-sans text-[11px] text-slate-400 mt-1">Instant hardware interlock e-stop triggered by CampusOS Emergency SOS.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Standalone Mount Container */}
      {activeTab === 'MOUNT_CONTAINER' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Database size={18} className="text-cyan-500" />
                Standalone Application Mount Point
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                When your standalone Autonomous Mobility server is running on {serviceUrl}, this container embeds its full UI.
              </p>
            </div>
            <a
              href={serviceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline font-semibold"
            >
              Open in new tab <ExternalLink size={12} />
            </a>
          </div>

          <div className="w-full h-96 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center">
            <Car size={40} className="text-slate-400 mb-3 animate-pulse" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Standalone Autonomous Mobility UI Mount Zone
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1.5">
              Ready to connect your standalone project. Once your service is running on <code className="font-mono text-cyan-500">{serviceUrl}</code>, toggle mount to view your real RViz/Foxglove dashboards, LiDAR streams, and teleoperation right here.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleTestConnection}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw size={13} /> Ping Standalone Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
