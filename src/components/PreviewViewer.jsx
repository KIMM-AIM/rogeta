import { useEffect, useRef, useState } from 'react'
import { Box } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { resolvePreview } from '../data/config'

function fitObject(object, camera, controls) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  camera.position.set(maxDim * 1.6, maxDim * 1.1, maxDim * 1.6)
  camera.near = maxDim / 100
  camera.far = maxDim * 100
  camera.updateProjectionMatrix()
  controls.target.set(0, 0, 0)
  controls.minDistance = maxDim * 0.4
  controls.maxDistance = maxDim * 8
  controls.update()
}

function loadModel(url, ext, resourcePath) {
  return new Promise((resolve, reject) => {
    if (ext === 'glb' || ext === 'gltf') {
      new GLTFLoader().load(url, (gltf) => resolve(gltf.scene), undefined, reject)
      return
    }
    if (ext === 'fbx') {
      new FBXLoader().setResourcePath(resourcePath).load(url, (object) => {
        object.traverse((child) => {
          if (!child.isMesh) return
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => {
            // FBX vertex colors can contain labels that tint the surface texture.
            if (material?.map && material.vertexColors) {
              material.vertexColors = false
              material.needsUpdate = true
            }
          })
        })
        resolve(object)
      }, undefined, reject)
      return
    }
    if (ext === 'obj') {
      const objLoader = new OBJLoader()
      const mtlUrl = url.replace(/\.obj$/i, '.mtl')
      new MTLLoader().setResourcePath(resourcePath).load(
        mtlUrl,
        (materials) => {
          materials.preload()
          objLoader.setMaterials(materials)
          objLoader.load(url, resolve, undefined, reject)
        },
        undefined,
        () => objLoader.load(url, resolve, undefined, reject),
      )
      return
    }
    reject(new Error(`Unsupported preview format: ${ext}`))
  })
}

export default function PreviewViewer({ asset, onPreview }) {
  const mountRef = useRef(null)
  const onPreviewRef = useRef(onPreview)
  onPreviewRef.current = onPreview
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let cancelled = false
    let renderer
    let scene
    let camera
    let controls
    let frame
    let model

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x151a17)
    camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    scene.add(new THREE.HemisphereLight(0xe8f0e4, 0x1a221c, 1.15))
    const key = new THREE.DirectionalLight(0xffffff, 1.35)
    key.position.set(4, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9bb89a, 0.45)
    fill.position.set(-6, 2, -4)
    scene.add(fill)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight || 420
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(el)

    const tick = () => {
      frame = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    setStatus('loading')
    onPreviewRef.current?.({ ext: '', status: 'loading' })

    resolvePreview(asset.id, asset.previewExt).then(async (preview) => {
      if (cancelled) return
      if (preview.missing) {
        setStatus('missing')
        onPreviewRef.current?.({ ext: preview.ext, status: 'missing' })
        return
      }
      try {
        model = await loadModel(preview.url, preview.ext, preview.dir)
        if (cancelled) return
        scene.add(model)
        fitObject(model, camera, controls)
        setStatus('ready')
        onPreviewRef.current?.({ ext: preview.ext, status: 'ready' })
      } catch {
        if (cancelled) return
        setStatus('error')
        onPreviewRef.current?.({ ext: preview.ext, status: 'error' })
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      if (model) scene.remove(model)
      scene.traverse((obj) => {
        obj.geometry?.dispose?.()
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
        materials.forEach((material) => material?.dispose?.())
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [asset.id, asset.previewExt])

  return (
    <div className="viewer-stage">
      <div ref={mountRef} className="viewer-canvas" />
      {status !== 'ready' && (
        <div className="placeholder overlay">
          <Box size={52} />
          <b>{status === 'loading' ? 'Loading preview' : '3D preview'}</b>
          <small>
            {status === 'missing' || status === 'error'
              ? status === 'error' ? 'Unable to load this preview.' : 'Preview file is unavailable.'
              : 'Drag to rotate · Scroll to zoom'}
          </small>
        </div>
      )}
    </div>
  )
}
