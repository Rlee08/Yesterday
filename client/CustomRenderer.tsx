import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { useEditor, useValue } from 'tldraw'

export function CustomRenderer() {
	const editor = useEditor()
	const rCanvas = useRef<HTMLCanvasElement>(null)
	const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

	// Get updated values from the editor
	const camera = useValue('camera', () => editor.getCamera(), [editor])
	const screenBounds = useValue('screenBounds', () => editor.getViewportScreenBounds(), [editor])
	const shapes = useValue('shapes', () => editor.getRenderingShapes(), [editor])
	const devicePixelRatio = useValue('dpr', () => editor.getInstanceState().devicePixelRatio, [editor])

	useEffect(() => {
		const img = new Image()
		img.src = '/testBG.jpeg' // Replace with your image path
		img.onload = () => setBackgroundImage(img)
	}, [])

	useLayoutEffect(() => {
		const canvas = rCanvas.current
		if (!canvas || !backgroundImage) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set canvas size based on device pixel ratio
		const canvasW = screenBounds.w * devicePixelRatio
		const canvasH = screenBounds.h * devicePixelRatio
		canvas.width = canvasW
		canvas.height = canvasH

		// Clear the canvas
		ctx.clearRect(0, 0, canvasW, canvasH)

		// Draw background
		const pattern = ctx.createPattern(backgroundImage, 'repeat')
		if (pattern) {
			ctx.save()
			ctx.scale(camera.z * devicePixelRatio, camera.z * devicePixelRatio)
			ctx.translate(camera.x, camera.y)
			pattern.setTransform(new DOMMatrix().scale(1 / camera.z))
			ctx.fillStyle = pattern
			ctx.fillRect(-camera.x, -camera.y, canvasW / (camera.z * devicePixelRatio), canvasH / (camera.z * devicePixelRatio))
			ctx.restore()
		}

	}, [editor, backgroundImage, camera, screenBounds, shapes, devicePixelRatio])

	return <canvas className="tl-grid" ref={rCanvas} />
}
