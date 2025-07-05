'use client';

import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { CyberScape2 } from './CyberScape2';

/**
 * React integration component for CyberScape 2.0
 * Provides a seamless way to integrate the WebGL/Canvas2D background system
 */

interface CyberScape2IntegrationProps {
  className?: string;
  headerElementId?: string;
  logoElementId?: string;
  navElementId?: string;
  performanceMode?: 'auto' | 'high' | 'balanced' | 'low';
  enableDebug?: boolean;
  onStatsUpdate?: (stats: CyberScape2Stats) => void;
}

interface CyberScape2Stats {
  performance?: { fps?: number; frameTime?: number; renderTime?: number };
  particles?: { active?: number; max?: number; poolSize?: number };
  header?: { logoActive?: boolean; navActiveCount?: number; bloomEnabled?: boolean };
  renderer?: { type?: string; webglSupported?: boolean };
}

interface CyberScape2ComponentMethods {
  triggerSpecialEffect: (x: number, y: number) => void;
  getCurrentStats: () => CyberScape2Stats | null;
  cyberscape: CyberScape2 | null;
}

export function CyberScape2Integration({
  className = '',
  headerElementId = 'header',
  logoElementId = 'logo',
  navElementId = 'nav',
  performanceMode = 'auto',
  enableDebug = false,
  onStatsUpdate,
}: CyberScape2IntegrationProps) {
  // Separate refs for canvas and component methods
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const componentRef = useRef<CyberScape2ComponentMethods>(null);
  const cyberScapeRef = useRef<CyberScape2 | null>(null);
  
  // Component state
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CyberScape2Stats | null>(null);

  // Stabilize the onStatsUpdate callback to prevent re-renders
  const stableOnStatsUpdate = useCallback((newStats: CyberScape2Stats) => {
    setStats(newStats);
    onStatsUpdate?.(newStats);
  }, [onStatsUpdate]);

  /**
   * Initialize CyberScape 2.0
   */
  useEffect(() => {
    console.log('🚀 Initializing CyberScape 2.0...');
    console.log('🔍 useEffect triggered with dependencies:', {
      headerElementId,
      logoElementId, 
      navElementId,
      performanceMode,
      enableDebug,
      onStatsUpdateDefined: !!onStatsUpdate
    });
    
    let isDestroyed = false;
    
    const initializeCyberScape = async () => {
      try {
        if (!canvasRef.current) {
          console.error('❌ Canvas ref not available');
          throw new Error('Canvas ref not available');
        }

        console.log('📋 Canvas element found:', canvasRef.current);

        // Reset state
        setError(null);
        setIsInitialized(false);

        // Get required DOM elements
        console.log('🔍 Looking for DOM elements...');
        const headerElement = document.getElementById(headerElementId);
        const logoElement = document.getElementById(logoElementId);
        const navElement = document.getElementById(navElementId);

        console.log('📋 DOM elements found:', {
          header: !!headerElement,
          logo: !!logoElement, 
          nav: !!navElement
        });

        if (!headerElement) {
          console.error(`❌ Header element '${headerElementId}' not found`);
          throw new Error(`Header element '${headerElementId}' not found`);
        }

        // Create CyberScape 2.0 instance
        console.log('🛠️ Creating CyberScape2 instance...');
        const cyberscape = new CyberScape2({
          canvas: canvasRef.current,
          headerElement,
          logoElement: logoElement as HTMLAnchorElement,
          navElement: navElement as HTMLElement,
          forceFallback: performanceMode === 'low'
        });

        // Store reference
        cyberScapeRef.current = cyberscape;

        // Initialize
        console.log('🚀 Starting CyberScape2 initialization...');
        const initialized = await cyberscape.initialize();

        // Check if component was unmounted during initialization
        if (isDestroyed) {
          console.log('⚠️ Component was destroyed during initialization, cleaning up...');
          cyberscape.destroy();
          return;
        }

        if (initialized) {
          console.log('🎉 CyberScape 2.0 initialized successfully!');
          
          // Create test particles to show it's working
          cyberscape.createTestParticles();
          console.log('✨ Test particles created');
          
          // Get capabilities from renderer
          const rendererCapabilities = cyberscape.getCapabilities();
          setHasWebGL(rendererCapabilities?.type === 'webgl');
          
          setIsInitialized(true);
        } else {
          console.error('❌ Failed to initialize CyberScape 2.0');
          throw new Error('CyberScape 2.0 initialization failed');
        }
      } catch (err) {
        console.error('💥 CyberScape 2.0 initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Run initialization
    initializeCyberScape();

    // Cleanup function
    return () => {
      console.log('🧹 useEffect cleanup triggered');
      console.log('🔍 Cleanup reason: Component unmounting or dependencies changed');
      
      isDestroyed = true;
      
      if (cyberScapeRef.current) {
        console.log('🗑️ Destroying CyberScape2 instance...');
        cyberScapeRef.current.destroy();
        cyberScapeRef.current = null;
      }
      
      // Reset states
      setIsInitialized(false);
      setHasWebGL(false);
      setStats(null);
    };
  }, [headerElementId, logoElementId, navElementId, performanceMode, enableDebug, onStatsUpdate]);

  /**
   * Handle canvas resize
   */
  useEffect(() => {
    if (!cyberScapeRef.current) return;

    const handleResize = () => {
      // Resize is handled internally by CyberScape 2.0
      // via ResizeObserver on the header element
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Trigger special effects from React
   */
  const triggerSpecialEffect = (x: number, y: number) => {
    if (cyberScapeRef.current) {
      cyberScapeRef.current.triggerAnimation(x, y);
    }
  };

  /**
   * Get current system stats
   */
  const getCurrentStats = (): CyberScape2Stats | null => {
    // Mock stats for now - we'll implement proper stats later
    return stats;
  };

  // Expose methods via component ref instead of canvas ref
  React.useImperativeHandle(componentRef, () => ({
    triggerSpecialEffect,
    getCurrentStats,
    cyberscape: cyberScapeRef.current,
  }));

  return (
    <div className={`cyberscape2-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="cyberscape2-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      
      {/* Debug overlay */}
      {enableDebug && (
        <div
          className="cyberscape2-debug"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#00ffff',
            padding: '10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div>🎮 CyberScape 2.0</div>
          <div>Status: {isInitialized ? '✅ Active' : '⏳ Loading'}</div>
          <div>Renderer: {hasWebGL ? '🌟 WebGL' : '🎨 Canvas2D'}</div>
          {error && <div style={{ color: '#ff4444' }}>❌ {error}</div>}
          {stats && (
            <>
              <div>FPS: {stats.performance?.fps?.toFixed(1) || 'N/A'}</div>
              <div>Particles: {stats.particles?.active || 0}</div>
              <div>Header Active: {stats.header?.logoActive ? '🎯' : '💤'}</div>
            </>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {!isInitialized && !error && (
        <div
          className="cyberscape2-loading"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#00ffff',
            fontFamily: 'monospace',
            fontSize: '14px',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          ⚡ Initializing CyberScape 2.0...
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          className="cyberscape2-error"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ff4444',
            fontFamily: 'monospace',
            fontSize: '14px',
            textAlign: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div>❌ CyberScape 2.0 Error</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>{error}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for accessing CyberScape 2.0 functionality
 */
export function useCyberScape2() {
  const triggerSpecialEffect = (x: number, y: number) => {
    // This would need to be connected to a global instance
    console.log('triggerSpecialEffect called', x, y);
  };

  const getStats = (): CyberScape2Stats | null => {
    // This would need to be connected to a global instance
    return null;
  };

  return {
    triggerSpecialEffect,
    getStats,
  };
} 