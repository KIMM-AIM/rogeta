# RoGeTA Website

**다양한 일상 서비스를 위한 로봇 작업 인공지능**  
**RoGeTA: Robotic General Task Artificial Intelligence**

React + Vite + Three.js website for RoGeTA.

## Run locally

Use Node.js 22, then run:

```bash
npm ci
npm run dev
```

## Preview assets

The catalog is defined in `src/data/assets.js`. The viewer supports GLB, GLTF,
OBJ, and FBX. Files are resolved relative to `public/models/` while
`PUBLISH.online` is false. This setting selects the asset host; it does not
control whether the website itself is public.

The included preview is `public/models/OBJ_app_01.fbx`. Its referenced texture
`T_OBJECT_app_01.png` is included alongside the model. Simulation
sources and other local datasets are not included in this repository.

Hugging Face is not connected yet. Keep `online: false` until actual dataset
identifiers and files are available. Never put access tokens in the frontend.

## GitHub Pages

The source repository is `KIMM-AIM/rogeta` and should remain **private**.
The built website is intended to be **public**, including its preview asset.
Private organization repositories require a GitHub plan that supports Pages
(such as GitHub Team or Enterprise Cloud).

1. Open repository **Settings → Pages**.
2. Set **Build and deployment → Source** to **Deploy from a branch**.
3. Select the `gh-pages` branch and `/ (root)`, then save.

Source code lives on `main`. Build locally and publish the contents of `dist`
to `gh-pages`, including a `.nojekyll` file. Rebuild and update that branch
after changing the source. No custom Actions workflow is required.
The expected site URL is https://kimm-aim.github.io/rogeta/ once Pages is enabled
and deployment succeeds. `vite.config.js` retains the relative base `./`.

## Production build

```bash
npm run build
npm run preview
```
