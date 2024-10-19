import { useSync } from '@tldraw/sync'
import { DefaultCanvas, Tldraw, TLCameraOptions, useEditor, track, TLUiOverrides, TLUiToolsContextType, DefaultStylePanel, } from 'tldraw'
import { getBookmarkPreview } from '../getBookmarkPreview'
import { multiplayerAssetStore } from '../multiplayerAssetStore'
import { useEffect } from 'react'
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
					backgroundImage: `url(./day1.jpg)`,
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
		uri: `${WORKER_URL}/connect/day1-room`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssetStore,
	})

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
			store={store}
			onMount={(editor) => {
				editor.registerExternalAssetHandler('url', getBookmarkPreview)

				// Set the default tool to 'hand'
				// editor.setCurrentTool('hand')

				// // Register the before change handler
				// editor.sideEffects.registerBeforeChangeHandler('shape', ( next) => {
				// 	// Check if the shape is selected
				// 	if (editor.getSelectedShapeIds().includes(next.id)) {
				// 		// Set the current tool to 'hand'
				// 		editor.setCurrentTool('hand')
				// 	}
				// 	// Always return the next state to allow the change
				// 	return next
				// })

				// Add a change listener for selection changes
				// editor.sideEffects.registerAfterChangeHandler('select', () => {
				// 	if (editor.getSelectedShapeIds().length > 0) {
				// 		editor.setCurrentTool('hand')
				// 	}
				// })
			}}
			components={{
				Canvas: DefaultCanvas,
				OnTheCanvas: BoundsDisplay,
				ContextMenu: null,
				ActionsMenu: null,
				HelpMenu: null,
				ZoomMenu: null,
				MainMenu: null,
				Minimap: null,
				StylePanel: DefaultStylePanel,
				PageMenu: null,
				NavigationPanel: null,
				Toolbar: null,
				KeyboardShortcutsDialog: null,
				QuickActions: null,
				HelperButtons: null,
				DebugPanel: null,
				DebugMenu: null,
				SharePanel: null,
				MenuPanel: null,
				TopPanel: null,
				CursorChatBubble: null,
			}}
			cameraOptions={CAMERA_OPTIONS}
			// hideUi
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
		  editor.setCurrentTool('select')
		} else {
		  // Otherwise, switch to the clicked tool
		  editor.setCurrentTool(toolId)
		}
	  }

	  useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Escape': {
					editor.setCurrentTool('select')
					break
				}
			}
		}

		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keyup', handleKeyUp)
		}
	})
	

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
