# 3D AI Professor Model

## Current Implementation
The application uses a fallback 3D professor model created with Three.js primitives.

## To Add a Custom 3D Model:
1. Place your GLTF model file as `professor.glb` in the `/public` directory
2. The model should be optimized for web (< 5MB recommended)
3. Ensure the model is centered and properly scaled

## Recommended Model Specifications:
- Format: GLTF/GLB
- Polygons: < 10,000 triangles
- Textures: 1024x1024 or smaller
- Animations: Basic idle, speaking, gesturing

## Model Sources:
- Ready Player Me (https://readyplayer.me/)
- Mixamo (https://mixamo.com/)
- Sketchfab (https://sketchfab.com/)

## Current Features:
- Animated fallback professor with emotions
- Speech bubbles and status indicators
- Interactive controls
- Responsive to chat and lesson states
