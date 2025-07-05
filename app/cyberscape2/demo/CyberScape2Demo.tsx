'use client';

import React, { useState } from 'react';
import { CyberScape2Integration } from '../CyberScape2Integration';

/**
 * CyberScape 2.0 Demo Page
 * 
 * Interactive demo to test and showcase CyberScape 2.0 features
 * including header particle interactions, performance modes, and debug info.
 */

export function CyberScape2Demo() {
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'balanced' | 'low'>('auto');
  const [enableDebug, setEnableDebug] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [specialEffectCount, setSpecialEffectCount] = useState(0);

  const handleStatsUpdate = (newStats: any) => {
    setStats(newStats);
  };

  const triggerRandomEffect = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * 200; // Within header area
    
    // This would need to be connected to the actual CyberScape instance
    setSpecialEffectCount(prev => prev + 1);
    
    console.log(`✨ Triggered special effect at (${x.toFixed(0)}, ${y.toFixed(0)})`);
  };

  return (
    <div className="cyberscape2-demo">
      {/* Mock Header for Testing */}
      <header
        id="header"
        style={{
          position: 'relative',
          height: '120px',
          background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <a
          id="logo"
          href="#"
          style={{
            color: '#00ffff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontFamily: 'monospace',
          }}
        >
          hyperbliss.tech
        </a>

        {/* Navigation */}
        <nav id="nav">
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>About</a>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Projects</a>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Blog</a>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}>Contact</a>
          </div>
        </nav>

        {/* CyberScape 2.0 Canvas Overlay */}
        <CyberScape2Integration
          className="demo-integration"
          performanceMode={performanceMode}
          enableDebug={enableDebug}
          onStatsUpdate={handleStatsUpdate}
        />
      </header>

      {/* Demo Controls */}
      <div style={{
        padding: '2rem',
        background: '#1a1a2e',
        color: '#ffffff',
        fontFamily: 'monospace',
      }}>
        <h1 style={{ color: '#00ffff', marginBottom: '2rem' }}>
          🚀 CyberScape 2.0 Demo
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Controls */}
          <div>
            <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>⚙️ Controls</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Performance Mode:
              </label>
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                style={{
                  background: '#2a2a4e',
                  color: '#ffffff',
                  border: '1px solid #00ffff',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                <option value="auto">Auto</option>
                <option value="high">High Performance</option>
                <option value="balanced">Balanced</option>
                <option value="low">Low Performance</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={enableDebug}
                  onChange={(e) => setEnableDebug(e.target.checked)}
                />
                Enable Debug Mode
              </label>
            </div>

            <button
              onClick={triggerRandomEffect}
              style={{
                background: '#00ffff',
                color: '#000000',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              ✨ Trigger Random Effect
            </button>

            <div style={{ fontSize: '0.9rem', color: '#888' }}>
              Special effects triggered: {specialEffectCount}
            </div>
          </div>

          {/* Stats Display */}
          <div>
            <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>📊 System Stats</h3>
            
            {stats ? (
              <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                <div><strong>Performance:</strong></div>
                <div>• FPS: {stats.performance?.fps?.toFixed(1) || 'N/A'}</div>
                <div>• Frame Time: {stats.performance?.frameTime?.toFixed(2) || 'N/A'}ms</div>
                <div>• Render Time: {stats.performance?.renderTime?.toFixed(2) || 'N/A'}ms</div>
                
                <div style={{ marginTop: '1rem' }}><strong>Particles:</strong></div>
                <div>• Active: {stats.particles?.active || 0}</div>
                <div>• Max: {stats.particles?.max || 0}</div>
                <div>• Pool Size: {stats.particles?.poolSize || 0}</div>
                
                <div style={{ marginTop: '1rem' }}><strong>Header:</strong></div>
                <div>• Logo Active: {stats.header?.logoActive ? '🎯 Yes' : '💤 No'}</div>
                <div>• Nav Active: {stats.header?.navActiveCount || 0}</div>
                <div>• Bloom: {stats.header?.bloomEnabled ? '🌟 On' : '🌙 Off'}</div>
                
                <div style={{ marginTop: '1rem' }}><strong>Renderer:</strong></div>
                <div>• Type: {stats.renderer?.type || 'Unknown'}</div>
                <div>• WebGL: {stats.renderer?.webglSupported ? '✅ Yes' : '❌ No'}</div>
              </div>
            ) : (
              <div style={{ color: '#888', fontStyle: 'italic' }}>
                Waiting for stats...
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#2a2a4e', borderRadius: '4px' }}>
          <h3 style={{ color: '#ffeb3b', marginBottom: '1rem' }}>🎮 How to Test</h3>
          <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
            <li>Hover over the logo to see interactive particle effects</li>
            <li>Hover over navigation links to see signature particle colors</li>
            <li>Click on header elements to trigger burst effects</li>
            <li>Move your mouse around the header area to see magnetism</li>
            <li>Adjust performance mode to test different rendering quality</li>
            <li>Enable debug mode to see real-time performance metrics</li>
            <li>Try the "Trigger Random Effect" button for manual particle spawning</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 