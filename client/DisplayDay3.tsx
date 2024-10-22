import { createContext, useCallback, useState, useContext } from 'react'
import { Editor, Tldraw, TLCameraOptions, TLUiOverrides,TLUiToolsContextType, track, useEditor, DefaultCanvas} from 'tldraw'
import { useSync } from '@tldraw/sync'
// import 'tldraw/tldraw.css'
import './index.css'
import { getBookmarkPreview } from './getBookmarkPreview'
import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { CustomRenderer } from './CustomRenderer'
// import { Day0Viewer, Day1Viewer } from './CustomViewers'
import day1EditorImage from '/public/day1editor.jpg'
import day0QR from '/public/day0viewer.jpg'
import { useEffect } from 'react'

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

const BoundsDisplay0 = track(() => {
const editor = useEditor()
const cameraOptions = editor.getCameraOptions()

if (!cameraOptions.constraints) return null

const {
	constraints: {
		bounds: { x, y, w, h },
	},
} = cameraOptions

	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: x,
				width: w,
				height: h,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: y,
					left: x,
					width: '100%',
					height: '100%',
					backgroundImage: `url(./day2bg.jpg)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>
		</div>
	)
})

const BoundsDisplay1 = track(() => {
	const editor = useEditor()
	const cameraOptions = editor.getCameraOptions()
	
	if (!cameraOptions.constraints) return null
	
	const {
		constraints: {
			bounds: { x, y, w, h },
		},
	} = cameraOptions
	
		return (
			<div
				style={{
					position: 'absolute',
					top: y,
					left: x,
					width: w,
					height: h,
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: y,
						left: x,
						width: '100%',
						height: '100%',
						backgroundImage: `url(./day3insidebg.jpg)`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				></div>
			</div>
		)
	})


const focusedEditorContext = createContext(
	{} as {
		focusedEditor: Editor | null
		setFocusedEditor(id: Editor | null): void
	}
)

export default function DisplayDay3() {
	const [focusedEditor, _setFocusedEditor] = useState<Editor | null>(null)

	const setFocusedEditor = useCallback(
		(editor: Editor | null) => {
			if (focusedEditor !== editor) {
				if (focusedEditor) {
					focusedEditor.blur()
				}
				if (editor) {
					editor.focus()
				}
				_setFocusedEditor(editor)
			}
		},
		[focusedEditor]
	)


	return (
		<section className="display-section" 			
		// Sorry you need to do this yourself
		onPointerDown={() => setFocusedEditor(null)}>

			<focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
			<div className="top-bar"> 
				<h1>Feel free to leave a message using the laptop in front of you, or scan the QR codes below!</h1>
			</div>
			{/* <div className="lower-bar"> 
			</div> */}
			<div className="grid-container">

				<div className="grid-wrapper">
					<div className="hero-split">
						<div className="tldraw-wrapper">
							<LeftViewer/>
						</div>
						<div className="bottom-bar">
								<h1>View a message from yesterday...</h1>
								<div className="image-container" >
									<img src= {day0QR} />
								</div>
						</div>
					</div>
					<div className="line"></div>
					<div className="hero-split">
						<div className="tldraw-wrapper">
						{/* <h1>Focusing: {focusName}</h1> */}
							<RightViewer/>
						</div>
						<div className="bottom-bar">
								<h1>Leave a message for tomorrow!</h1>
								<div className="image-container" >
									<img src= {day1EditorImage} />
								</div>
						</div>
					</div>
					</div>
			</div>
			</focusedEditorContext.Provider>
		</section>
	)
}

function LeftViewer() {
	const { setFocusedEditor } = useContext(focusedEditorContext)

	// Create a store connected to multiplayer.
	const store = useSync({
		// We need to know the websockets URI...
		uri: `${WORKER_URL}/connect/day2-room`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssetStore,
	})


	return (
			<div
				tabIndex={-1}
				onFocus={() => setFocusedEditor((window as any).EDITOR_A)}
				style={{ height:'100%' }}
			>
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
				// 		// editor.setCurrentTool('hand')
				// 	}
				// 	// Always return the next state to allow the change
				// 	return next
				// })

				;(window as any).EDITOR_A = editor
				setFocusedEditor(editor)
			}}
			components={{
				Canvas: DefaultCanvas,
				OnTheCanvas: BoundsDisplay0,
			}}
			cameraOptions={CAMERA_OPTIONS}
			hideUi
			overrides={overrides}
			>
			<LeftUi />
			</Tldraw>
			</div>
	)
}

function RightViewer() {
	const { setFocusedEditor } = useContext(focusedEditorContext)

	// Create a store connected to multiplayer.
	const store = useSync({
		// We need to know the websockets URI...
		uri: `${WORKER_URL}/connect/day3-room`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssetStore,
	})


	return (
			<div
				tabIndex={-1}
				onFocus={() => setFocusedEditor((window as any).EDITOR_A)}
				style={{ height:'100%' }}
			>
			<Tldraw
			store={store}
			onMount={(editor) => {
				editor.registerExternalAssetHandler('url', getBookmarkPreview)
			}}
			components={{
				Canvas: DefaultCanvas,
				OnTheCanvas: BoundsDisplay1,
				// ContextMenu: null,
				// ActionsMenu: null,
				// HelpMenu: null,
				// ZoomMenu: null,
				// MainMenu: null,
				// Minimap: null,
				// StylePanel: DefaultStylePanel,
				// PageMenu: null,
				// NavigationPanel: null,
				// Toolbar: null,
				// KeyboardShortcutsDialog: null,
				// QuickActions: null,
				// HelperButtons: null,
				// DebugPanel: null,
				// DebugMenu: null,
				// SharePanel: null,
				// MenuPanel: null,
				// TopPanel: null,
				// CursorChatBubble: null,
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

function LeftUi() {
	return (
		<div className="custom-layout">
			<div className="tip-bg">
				{/* <h1>View a message from yesterday...</h1> */}
				<h2>From Yesterday<br />Andrew's Common, Brown University</h2>
			</div>
		</div>
	)
}

// function RightUi() {
// 	return (
// 		<div className="custom-layout">
// 			<div className="tip-bg">
// 				<h1>Leave a message for tomorrow!</h1>
// 			</div>
// 		</div>
// 	)
// } 

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
			<div className="tip-bg">
				{/* <h1>Leave a message for tomorrow!</h1> */}
				<h2>For Tomorrow<br />Snowden Hall, JWU</h2>
			</div>
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

