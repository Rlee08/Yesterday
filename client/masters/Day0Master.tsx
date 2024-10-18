import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw, TLCameraOptions, useEditor, track} from 'tldraw'
import { getBookmarkPreview } from '../getBookmarkPreview'
import { multiplayerAssetStore } from '../multiplayerAssetStore'
// import { useEffect } from 'react'
// import { CustomRenderer } from './CustomRenderer'
import '/client/index.css'
// import React from 'react'

// Where is our worker located? Configure this in `vite.config.ts`
const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = 'test-room2'

const CAMERA_OPTIONS: TLCameraOptions = {
	isLocked: false,
	wheelBehavior: 'pan',
	zoomSpeed: 1,
	zoomSteps: [1, 2, 4, 8],
	panSpeed: 1,
	constraints: {
		initialZoom: 'default',
		baseZoom: 'default',
		bounds: {
			x: 0,
			y: 0,
			w: 3840,
			h: 2160,
		},
		behavior: { x: 'contain', y: 'contain' },
		padding: { x: 0, y: 0 },
		origin: { x: .5, y: .5},
	},
}

// Add this new overrides object
// const overrides: TLUiOverrides = {
// 	tools: (_editor, tools): TLUiToolsContextType => {
// 	  return {
// 		...tools,
// 		hand: { ...tools.hand, kbd: 'Escape' },
// 	  }
// 	},
//   } 

const BoundsDisplay = track(() => {
const editor = useEditor()
const cameraOptions = editor.getCameraOptions()

if (!cameraOptions.constraints) return null

const {
	constraints: {
		bounds: { x, y, w, h },
	},
} = cameraOptions

// const d = Vec.ToAngle({ x: w, y: h }) * (180 / Math.PI)
// const colB = '#00000002'
// const colA = '#0000001F'

	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: x,
				width: w,
				height: h,
				// border: '1px dashed var(--color-text)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: y,
					left: x,
					width: '100%',
					height: '100%',
					backgroundImage: `url(./day1.jpg)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>
		</div>
	)
})

function Day0Viewer() {
	// Create a store connected to multiplayer.
	const store = useSync({
		// We need to know the websockets URI...
		uri: `${WORKER_URL}/connect/day0-room`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssetStore,
	})
	

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
			store={store}
			onMount={(editor) => {
				editor.registerExternalAssetHandler('url', getBookmarkPreview)
			}}
			components={{
				Canvas: DefaultCanvas,
				OnTheCanvas: BoundsDisplay,
			}}
			cameraOptions={CAMERA_OPTIONS}
			/>
		</div>
	)
}

export default Day0Viewer
