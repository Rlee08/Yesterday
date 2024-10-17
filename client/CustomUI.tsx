import { track,useEditor} from 'tldraw'
import 'tldraw/tldraw.css'
import './custom-ui.css'

const CustomUi = track(() => {
	const editor = useEditor()

	// useEffect(() => {
	// 	const handleKeyUp = (e: KeyboardEvent) => {
	// 		switch (e.key) {
				// case 'Delete':
				// case 'Backspace': {
				// 	editor.deleteShapes(editor.getSelectedShapeIds())
				// 	break
				// }
				// case 'v': {
				// 	editor.setCurrentTool('select')
				// 	break
				// }
				// case 'e': {
				// 	editor.setCurrentTool('eraser')
				// 	break
				// }
				// case 'x':
				// case 'p':
				// case 'b':
				// case 'd': {
				// 	editor.setCurrentTool('draw')
				// 	break
				// }
		// 	}
		// }

		// window.addEventListener('keyup', handleKeyUp)
		// return () => {
		// 	window.removeEventListener('keyup', handleKeyUp)
		// }

	

	// const handleNext = () => {
	// 	// Add your logic for what should happen when "Next" is clicked
	// 	console.log("Next button clicked!")
	// 	window.open("https://docs.google.com/forms/d/e/1FAIpQLSdiGWvx_GsOWbgtnNxXpgVo80tII-Bv5Tz__uPiPHpnJNZSBg/viewform?usp=sf_link")
	// }

	return (
		<div className="custom-layout">
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'draw'}
					onClick={() => editor.setCurrentTool('draw')}
				>
					Pencil
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'text'}
					onClick={() => editor.setCurrentTool('text')}
				>
					Text
				</button>
				{/* <button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'select'}
					onClick={() => editor.setCurrentTool('select')}
				>
					Select
				</button> */}
				{/* <button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'eraser'}
					onClick={() => editor.setCurrentTool('eraser')}
				>
					Eraser
				</button> */}
				{/* {newShapeCreated && (
					<button
						className="custom-button next-button"
						// onClick={handleNext}
					>
						Next
					</button>
				)} */}
			</div>
			{/* <div className="fill-watermark-container">
				<div className="fill-watermark">
				</div>
			</div> */}
		</div>
	)
})