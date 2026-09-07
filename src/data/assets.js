import { downloadUrl } from './config'

export const assets = [
  { id: 'Eumm_ENV', name: 'Eumm ENV', type: 'Environment', category: 'Environment', articulated: null, accent: '#d4ff55', tags: ['FBX'], previewExt: 'fbx' },
].map((asset) => ({
  ...asset,
  downloadUrl: downloadUrl(asset.id),
}))
