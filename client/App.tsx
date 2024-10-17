import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw } from 'tldraw'
import { getBookmarkPreview } from './getBookmarkPreview'
import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { useLayoutEffect } from 'react'
import { CustomRenderer } from './CustomRenderer'

// Where is our worker located? Configure this in `vite.config.ts`
const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
const roomId = 'test-room2'

function App() {
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
			/>
		</div>
	)
}

export default App
