import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw, TLCameraOptions, useEditor, track, TLShape, TLUiOverrides, TLUiToolsContextType} from 'tldraw'
import { getBookmarkPreview } from './getBookmarkPreview'
import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { useLayoutEffect } from 'react'
// import { CustomRenderer } from './CustomRenderer'
import './index.css'
// import React from 'react'

// Where is our worker located? Configure this in `vite.config.ts`
const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = 'test-room2'

const CAMERA_OPTIONS: TLCameraOptions = {
	isLocked: false,
	wheelBehavior: 'pan',
	zoomSpeed: 1,
	zoomSteps: [2, 4, 8],
	panSpeed: 1,
	constraints: {
		initialZoom: 'default',
		baseZoom: 'default',
		bounds: {
			x: 0,
			y: 0,
			w: 1920,
			h: 1080,
		},
		behavior: { x: 'contain', y: 'contain' },
		padding: { x: 0, y: 0 },
		origin: { x: .5, y: .5},
	},
}

// Add this new overrides object
const overrides: TLUiOverrides = {
	tools: (_editor, tools): TLUiToolsContextType => {
	  return {
		...tools,
		hand: { ...tools.hand, kbd: 'Escape' },
	  }
	},
  }

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
					backgroundImage: `url(./testBG.jpeg)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>
		</div>
	)
})

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
				editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
					// Type guard function to check if shape has specific properties
					function hasTransformProps(shape: TLShape): shape is TLShape & { props: { w?: number, h?: number } } {
						return 'props' in shape && typeof shape.props === 'object' && shape.props !== null;
					}

					// Check if any transformation properties have changed
					if (
						next.x !== prev.x ||
						next.y !== prev.y ||
						next.rotation !== prev.rotation ||
						(hasTransformProps(prev) && hasTransformProps(next) &&
						((prev.props.w !== undefined && next.props.w !== undefined && prev.props.w !== next.props.w) ||
						(prev.props.h !== undefined && next.props.h !== undefined && prev.props.h !== next.props.h)))
					) {
						// If any of these properties changed, return the previous state
						return prev
					}
					// If no transformation properties changed, allow the change
					return next
				})

				// Set the default tool to 'hand'
				editor.setCurrentTool('hand')
			}}
			components={{
				Canvas: DefaultCanvas,
				OnTheCanvas: BoundsDisplay,
			}}
			cameraOptions={CAMERA_OPTIONS}
			hideUi
			overrides={overrides}
			>
			<CustomUi />
			</Tldraw>
		</div>
	)
}

const CustomUi = track(() => {
	const editor = useEditor()
	const handleToolChange = (toolId: string) => {
		if (editor.getCurrentToolId() === toolId) {
		  // If the clicked tool is already active, switch to the Hand tool
		  editor.setCurrentTool('hand')
		} else {
		  // Otherwise, switch to the clicked tool
		  editor.setCurrentTool(toolId)
		}
	  }

	return (
		<div className="custom-layout">
		  <div className="custom-toolbar">
			<button
			  className="custom-button"
			  data-isactive={editor.getCurrentToolId() === 'draw'}
			  onClick={() => handleToolChange('draw')}
			>
			  <span className="material-icons">edit</span>
			  <span className="button-label">Pencil</span>
			</button>
			<button
			  className="custom-button"
			  data-isactive={editor.getCurrentToolId() === 'text'}
			  onClick={() => handleToolChange('text')}
			>
			  <span className="material-icons">title</span>
			  <span className="button-label">Text</span>
			</button>
		  </div>
		</div>
	  )
	})

export default Day1Editor
