import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { TLDrawShape, TLGeoShape, getDefaultColorTheme, useEditor, useValue } from 'tldraw'

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

		// Draw shapes
		ctx.scale(camera.z * devicePixelRatio, camera.z * devicePixelRatio)
		ctx.translate(camera.x, camera.y)

		const theme = getDefaultColorTheme({ isDarkMode: editor.user.getIsDarkMode() })
		const currentPageId = editor.getCurrentPageId()

		for (const { shape, opacity } of shapes) {
			const maskedPageBounds = editor.getShapeMaskedPageBounds(shape)
			if (!maskedPageBounds) continue
			ctx.save()

			if (shape.parentId !== currentPageId) {
				ctx.beginPath()
				ctx.rect(
					maskedPageBounds.minX,
					maskedPageBounds.minY,
					maskedPageBounds.width,
					maskedPageBounds.height
				)
				ctx.clip()
			}

			ctx.beginPath()

			ctx.globalAlpha = opacity

			const transform = editor.getShapePageTransform(shape.id)
			ctx.transform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f)

			if (editor.isShapeOfType<TLDrawShape>(shape, 'draw')) {
				// Draw a freehand shape
				for (const segment of shape.props.segments) {
					ctx.moveTo(segment.points[0].x, segment.points[0].y)
					if (segment.type === 'straight') {
						ctx.lineTo(segment.points[1].x, segment.points[1].y)
					} else {
						for (const point of segment.points.slice(1)) {
							ctx.lineTo(point.x, point.y)
						}
					}
				}
				ctx.strokeStyle = theme[shape.props.color].solid
				ctx.lineWidth = 4 / (camera.z * devicePixelRatio)
				ctx.stroke()
				if (shape.props.fill !== 'none' && shape.props.isClosed) {
					ctx.fillStyle = theme[shape.props.color].semi
					ctx.fill()
				}
			} else if (editor.isShapeOfType<TLGeoShape>(shape, 'geo')) {
				// Draw a geo shape
				const bounds = editor.getShapeGeometry(shape).bounds
				ctx.strokeStyle = theme[shape.props.color].solid
				ctx.lineWidth = 2 / (camera.z * devicePixelRatio)
				ctx.strokeRect(bounds.minX, bounds.minY, bounds.width, bounds.height)
			} else {
				// Draw any other kind of shape
				const bounds = editor.getShapeGeometry(shape).bounds
				ctx.strokeStyle = 'black'
				ctx.lineWidth = 2 / (camera.z * devicePixelRatio)
				ctx.strokeRect(bounds.minX, bounds.minY, bounds.width, bounds.height)
			}
			ctx.restore()
		}

	}, [editor, backgroundImage, camera, screenBounds, shapes, devicePixelRatio])

	return <canvas className="tl-grid" ref={rCanvas} />
}
