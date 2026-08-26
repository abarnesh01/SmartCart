import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Stage, Float } from '@react-three/drei';
import {
  Headphones3D,
  Watch3D,
  Phone3D,
  Shoe3D,
  Chair3D,
  Controller3D,
} from './ProceduralModels';
import ModelGLTF from './ModelGLTF';
import { RotateCcw, Maximize2, Minimize2, Palette, Sparkles, SunMedium, Play, Pause } from 'lucide-react';

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 bg-slate-900/90 text-white p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold tracking-wider">Rendering 3D Model...</span>
    </div>
  </Html>
);

const Canvas3DViewer = ({ model3DConfig = {}, productName = '3D Product Preview' }) => {
  const controlsRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [customColor, setCustomColor] = useState(model3DConfig?.color || '#3b82f6');
  const [lightIntensity, setLightIntensity] = useState(1.2);

  const modelType = model3DConfig?.type || 'headphones';
  const gltfUrl = model3DConfig?.gltfUrl;
  const accentColor = model3DConfig?.accentColor || '#f43f5e';

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const renderModel = () => {
    if (gltfUrl) {
      return <ModelGLTF url={gltfUrl} scale={model3DConfig?.scale || 1} autoRotate={autoRotate} />;
    }

    switch (modelType) {
      case 'watch':
        return <Watch3D color={customColor} accentColor={accentColor} />;
      case 'phone':
        return <Phone3D color={customColor} accentColor={accentColor} />;
      case 'shoe':
        return <Shoe3D color={customColor} accentColor={accentColor} />;
      case 'chair':
        return <Chair3D color={customColor} accentColor={accentColor} />;
      case 'controller':
        return <Controller3D color={customColor} accentColor={accentColor} />;
      case 'headphones':
      default:
        return <Headphones3D color={customColor} accentColor={accentColor} />;
    }
  };

  const colorPresets = ['#3b82f6', '#ef4444', '#10b981', '#0f172a', '#a855f7', '#f59e0b'];

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[460px]'
      }`}
    >
      {/* Canvas Scene */}
      <Canvas
        camera={{ position: [0, 1, 4.5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.5 * lightIntensity} />
        <directionalLight position={[5, 8, 5]} intensity={1.5 * lightIntensity} castShadow />
        <directionalLight position={[-5, -2, -5]} intensity={0.5 * lightIntensity} color="#38bdf8" />
        <spotLight position={[0, 10, 0]} intensity={0.8 * lightIntensity} angle={0.6} penumbra={1} />

        <Suspense fallback={<Loader />}>
          <Float speed={autoRotate ? 2 : 0} rotationIntensity={0.3} floatIntensity={0.4}>
            {renderModel()}
          </Float>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={10}
          autoRotate={autoRotate}
          autoRotateSpeed={2.5}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Header Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
        <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
        <span className="text-xs font-bold text-slate-200">Interactive 3D View</span>
      </div>

      {/* Toolbar Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60 shadow-xl">
        {/* Color Presets */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5">
            {colorPresets.map((c) => (
              <button
                key={c}
                onClick={() => setCustomColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  customColor === c ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={`Change color to ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              autoRotate
                ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Auto Rotate"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Pause' : 'Rotate'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            title="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas3DViewer;
