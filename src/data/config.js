export const PUBLISH = {
  online: false,
  githubId: 'YOUR_GITHUB_ID',
  githubRepo: 'rogeta',
  hfId: 'YOUR_HF_ID',
  hfRepo: 'rogeta',
}

export const LINKS = {
  github: `https://github.com/${PUBLISH.githubId}/${PUBLISH.githubRepo}`,
  huggingface: `https://huggingface.co/datasets/${PUBLISH.hfId}/${PUBLISH.hfRepo}`,
}

export const HF_RESOLVE = `https://huggingface.co/datasets/${PUBLISH.hfId}/${PUBLISH.hfRepo}/resolve/main`
export const HF_TREE = `https://huggingface.co/datasets/${PUBLISH.hfId}/${PUBLISH.hfRepo}/tree/main`

export const PREVIEW_EXTS = ['glb', 'gltf', 'obj', 'fbx']

export function previewDir() {
  if (PUBLISH.online) return `${HF_RESOLVE}/preview/`
  return `${import.meta.env.BASE_URL}models/`
}

export function previewUrl(id, ext) {
  return `${previewDir()}${id}.${ext}`
}

export function downloadUrl(id) {
  if (PUBLISH.online) return `${HF_TREE}/assets/${id}`
  return null
}

async function fileExists(url) {
  try {
    let res = await fetch(url, { method: 'HEAD' })
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } })
    }
    if (!res.ok && res.status !== 206) return false
    const type = (res.headers.get('content-type') || '').toLowerCase()
    return !type.includes('text/html')
  } catch {
    return false
  }
}

export async function resolvePreview(id, preferredExt) {
  const wanted = preferredExt?.replace(/^\./, '').toLowerCase()
  const order = wanted
    ? [wanted, ...PREVIEW_EXTS.filter((ext) => ext !== wanted)]
    : PREVIEW_EXTS

  for (const ext of order) {
    const url = previewUrl(id, ext)
    if (await fileExists(url)) {
      return { url, ext, dir: previewDir(), missing: false }
    }
  }

  const ext = wanted && PREVIEW_EXTS.includes(wanted) ? wanted : 'glb'
  return { url: previewUrl(id, ext), ext, dir: previewDir(), missing: true }
}
