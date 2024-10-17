import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw, TLCameraOptions } from 'tldraw'
import { getBookmarkPreview } from './getBookmarkPreview'
import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { useLayoutEffect } from 'react'
import { CustomRenderer } from './CustomRenderer'

// Where is our worker located? Configure this in `vite.config.ts`
const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
const roomId = 'test-room2'

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


function CurrentEditor() {
	// Create a store connected to multiplayer.
	const store = useSync({
		// We need to know the websockets URI...
		uri: `${WORKER_URL}/connect/${roomId}`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssetStore,
	})
	

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				// we can pass the connected store into the Tldraw component which will handle
				// loading states & enable multiplayer UX like cursors & a presence menu
				store={store}
				onMount={(editor) => {
					// when the editor is ready, we need to register our bookmark unfurling service
					editor.registerExternalAssetHandler('url', getBookmarkPreview)
				}}
				
				// persistenceKey="example"
				components={{
					// We're replacing the Background component with our custom renderer
					Background: CustomRenderer,
					// Even though we're hiding the shapes, we'll still do a bunch of work
					// in react to figure out which shapes to create. In reality, you might
					// want to set the Canvas component to null and render it all yourself.
					Canvas: DefaultCanvas,
				}}
				cameraOptions={CAMERA_OPTIONS}
			/>
		</div>
	)
}

export default CurrentEditor
