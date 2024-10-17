import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw, TLCameraOptions, useEditor, track } from 'tldraw'
import { getBookmarkPreview } from './getBookmarkPreview'
import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { useLayoutEffect } from 'react'
import { CustomRenderer } from './CustomRenderer'
import './index.css'
// import React from 'react'

// Where is our worker located? Configure this in `vite.config.ts`
const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = 'test-room2'

const CAMERA_OPTIONS: TLCameraOptions = {
	isLocked: false,  // Allow panning
	wheelBehavior: 'none',  // Disable wheel zooming
	zoomSpeed: 0,  // Disable zooming
	zoomSteps: [0.1, 0.25, 0.5, 1, 2, 4, 8],
	panSpeed: 1,  // Enable panning at normal speed
	// constraints: {
	// //   initialZoom: '100%',
	// //   baseZoom: "100",
	// //   minZoom: 1,
	// //   maxZoom: 1,  // Lock zoom at 100%
	//   bounds: {
	// 	x: 0,
	// 	y: 0,
	// 	w: 1600,
	// 	h: 900,
	//   },  // Allow panning in all directions
	//   behavior: { x: 'free', y: 'free' },  // Allow free panning
	}


function Day1Editor() {
	// Create a store connected to multiplayer.
	const store = useSync({
		// We need to know the websockets URI...
		uri: `${WORKER_URL}/connect/test-room2`,
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
				Background: CustomRenderer,
				Canvas: DefaultCanvas,
			}}
			cameraOptions={CAMERA_OPTIONS}
			hideUi
			>
			<CustomUi />
			</Tldraw>
		</div>
	)
}

const CustomUi = track(() => {
	const editor = useEditor()

	return (
		<div className="custom-layout">
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'draw'}
					onClick={() => editor.setCurrentTool('draw')}
				>
					<span className="material-icons">edit</span>
					<span className="button-label">Pencil</span>
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'text'}
					onClick={() => editor.setCurrentTool('text')}
				>
					<span className="material-icons">title</span>
					<span className="button-label">Text</span>
				</button>
			</div>
		</div>
	)
})

export default Day1Editor
