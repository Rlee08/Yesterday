import { createContext, useCallback, useState, useContext } from 'react'
import { Editor} from 'tldraw'
// import { useSync } from '@tldraw/sync'
// import 'tldraw/tldraw.css'
// import './index.css'
// import { getBookmarkPreview } from './getBookmarkPreview'
// import { multiplayerAssetStore } from './multiplayerAssetStore'
// import { CustomRenderer } from './CustomRenderer'
import { Day0Viewer, Day1Viewer } from './CustomViewers'
import day1EditorImage from '/public/day1editor.jpg'
import day0QR from '/public/day0viewer.jpg'

// Where is our worker located? Configure this in `vite.config.ts`
// const WORKER_URL = process.env.TLDRAW_WORKER_URL

// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = 'test-room2'

const focusedEditorContext = createContext(
	{} as {
		focusedEditor: Editor | null
		setFocusedEditor(id: Editor | null): void
	}
)

export default function Display() {
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
		<div className="display-backdrop">
			<focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
      {/* <h1>To move around, use two fingers and drag!</h1> */}
				<div className="editors-grid">
					<EditorB />
					<EditorC />
				</div>
			</focusedEditorContext.Provider>
		</div>
	)
}

function EditorB() {
	const { setFocusedEditor } = useContext(focusedEditorContext)

  // Create a store connected to multiplayer.
//   const store = useSync({
//     uri: `${WORKER_URL}/connect/test-room2`,
//     assets: multiplayerAssetStore,
//   })

	return (
		<div className="editor-container">
			<Day0Viewer
					tabIndex={-1}
					onPointerEnter={() => setFocusedEditor((window as any).EDITOR_B)}
					onPointerLeave={() => setFocusedEditor(null)}
					style={{ height: '500px', width: '100%' }}
					// style={{ flex: 1, width: '100%', height: '10%' }}
				/>
			<div className="editor-content">
				<h1>View a message from yesterday!</h1>
				<div className="image-container">
					<img src={day0QR} />
				</div>
			</div>
		</div>
	)
}

function EditorC() {
	const { setFocusedEditor } = useContext(focusedEditorContext)

	return (
		<div className="editor-container">
			<Day1Viewer
					tabIndex={-1}
					onPointerEnter={() => setFocusedEditor((window as any).EDITOR_B)}
					onPointerLeave={() => setFocusedEditor(null)}
					style={{ height: '500px', width: '100%' }}
					// style={{ flex: 1, width: '100%', height: '50%' }}
				/>
			<div className="editor-content">
				<h1>Leave a message for tomorrow!</h1>
				<div className="image-container">
					<img src={day1EditorImage} />
				</div>
			</div>
		</div>
	)
}