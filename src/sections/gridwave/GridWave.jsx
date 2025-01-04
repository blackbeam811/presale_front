import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

const GridWaveCanvas = () => {
  const canvasRef = useRef(null); // Ref for the canvas element
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    let camera, scene, renderer, group, geometry, material, plane;
    let noise2D,
      clock = new THREE.Clock(),
      cycle = 0;
    const lights = [];

    const factor = 300;
    const speed = 0.0005; // terrain size
    const scale = 30; // smoothness

    const init = () => {
      // Camera
      camera = new THREE.PerspectiveCamera(
        60,
        windowSize.width / windowSize.height,
        1,
        10000
      );
      camera.position.set(0, 0, 100);

      // Scene
      scene = new THREE.Scene();

      // Hemisphere Light
      lights[0] = new THREE.PointLight(0xff00cc, 1, 0);
      lights[1] = new THREE.PointLight(0x0066ff, 1, 0);
      lights[2] = new THREE.PointLight(0x0000ff, 1, 0);

      lights[0].position.set(0, 200, 0);
      lights[1].position.set(100, 200, 100);
      lights[2].position.set(-100, -200, -100);

      scene.add(lights[0]);
      scene.add(lights[1]);
      scene.add(lights[2]);

      // WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvas, // canvas
        alpha: true,
        antialias: true,
      });
      
      renderer.setSize(windowSize.width, windowSize.height);

      // Group for movement
      group = new THREE.Object3D();
      group.position.set(0, -300, -1000);
      group.rotation.set(29.8, 0, 0);

      // Plane Geometry 
      geometry = new THREE.PlaneGeometry(4000, 2000, 128, 64);
      material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 1,
        blending: THREE.NoBlending,
        side: THREE.FrontSide,
        transparent: false,
        depthTest: false,
        wireframe: true,
      });
      plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);

      noise2D = new createNoise2D();
      moveNoise();

      group.add(plane);
      scene.add(group);

      // Window Resize Event
      window.addEventListener("resize", onWindowResize, false);
    };

    const render = () => {
      requestAnimationFrame(render);

      const delta = clock.getDelta();

      // Set a background color
      renderer.setClearColor(0x000000);

      // Change noise values over time
      moveNoise();

      // Update sprite
      cycle -= delta * 0.5;

      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const moveNoise = () => {
      if (geometry.vertices != undefined) {
        geometry.vertices.forEach((vertex) => {
          const xoff = vertex.x / factor;
          const yoff = vertex.y / factor + cycle;
          const rand = noise2D(xoff, yoff) * scale;
          vertex.z = rand;
        });
      }

      geometry.verticesNeedUpdate = true;
      cycle += speed;
    };

    // Initialize and start rendering
    init();
    render();

    // Cleanup the event listeners on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [windowSize]);

  return (
    <canvas
      ref={canvasRef}
      id="3D-background-three-canvas5"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default GridWaveCanvas;
