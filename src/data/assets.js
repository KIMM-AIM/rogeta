import { downloadUrl } from './config'

export const assets = [
  { id: 'OBJ_app_01', name: 'OBJ app 01', type: 'Object', category: 'Object', articulated: null, accent: '#d4ff55', tags: ['FBX'], previewExt: 'fbx' },
  { id: 'OBJ_cab_04', name: 'OBJ cab 04', type: 'Object', category: 'Object', articulated: null, accent: '#74d4ff', tags: ['FBX'], previewExt: 'fbx' },
].map((asset) => ({
  ...asset,
  downloadUrl: downloadUrl(asset.id),
}))
