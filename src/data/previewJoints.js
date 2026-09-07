import * as THREE from 'three'

// Preview motion derived from the mesh geometry; not simulation joint limits.
const definitions = {
  OBJ_app_01: [
    { mesh: 'OBJ_app_0102', label: 'Left sliding door', type: 'slide', distance: 0.33 },
    { mesh: 'OBJ_app_0103', label: 'Right sliding door', type: 'slide', distance: -0.33 },
  ],
  OBJ_cab_04: [
    { mesh: 'OBJ_cab_0402', label: 'Cabinet door', type: 'hinge', angle: 100 },
  ],
}

export function createPreviewJoints(model, assetId) {
  return (definitions[assetId] || []).flatMap((definition) => {
    const mesh = model.getObjectByName(definition.mesh)
    if (!mesh?.isMesh) return []
    const position = mesh.position.clone()
    const quaternion = mesh.quaternion.clone()
    // The cabinet mesh origin is already on its right-hand hinge.
    const axis = new THREE.Vector3(0, 1, 0)
    return [{
      label: definition.label,
      setOpen(value) {
        const amount = THREE.MathUtils.clamp(Number.isFinite(value) ? value : 0, 0, 1)
        mesh.position.copy(position)
        mesh.quaternion.copy(quaternion)
        if (definition.type === 'slide') {
          mesh.position.x += definition.distance * amount
        } else {
          mesh.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(
            axis, THREE.MathUtils.degToRad(definition.angle) * amount,
          ))
        }
        mesh.updateMatrixWorld(true)
      },
    }]
  })
}
