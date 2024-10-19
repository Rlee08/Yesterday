import React from 'react';
import { useSync } from '@tldraw/sync';
import { DefaultCanvas, Tldraw, TLCameraOptions, useEditor, track, TLUiOverrides, TLUiToolsContextType } from 'tldraw';
import { getBookmarkPreview } from './getBookmarkPreview';
import { multiplayerAssetStore } from './multiplayerAssetStore';

const WORKER_URL = process.env.TLDRAW_WORKER_URL;

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
};

const overrides: TLUiOverrides = {
  tools: (_editor, tools): TLUiToolsContextType => ({
    ...tools,
    hand: { ...tools.hand, kbd: 'Escape' },
  }),
};

const BoundsDisplayD0 = track(() => {
  const editor = useEditor();
  const cameraOptions = editor.getCameraOptions();

  if (!cameraOptions.constraints) return null;

  const {
    constraints: {
      bounds: { x, y, w, h },
    },
  } = cameraOptions;

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
          backgroundImage: `url(./day1.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
});


const createDay0 = () => {
  return React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => {
    const store = useSync({
      uri: `${WORKER_URL}/connect/day0-room`,
      assets: multiplayerAssetStore,
    });

    return (
      <div ref={ref} {...props}>
        <Tldraw
          store={store}
          onMount={(editor) => {
            editor.registerExternalAssetHandler('url', getBookmarkPreview);
            editor.setCurrentTool('hand');
            editor.sideEffects.registerBeforeChangeHandler('shape', (next) => {
              if (editor.getSelectedShapeIds().includes(next.id)) {
                editor.setCurrentTool('hand');
              }
              return next;
            });
          }}
          components={{
            Canvas: DefaultCanvas,
            OnTheCanvas: BoundsDisplayD0,
          }}
          cameraOptions={CAMERA_OPTIONS}
          hideUi
          overrides={overrides}
        />
      </div>
    );
  });
};

const createDay1 = () => {
  return React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => {
    const store = useSync({
      uri: `${WORKER_URL}/connect/day1-room`,
      assets: multiplayerAssetStore,
    });

    return (
      <div ref={ref} {...props}>
        <Tldraw
          store={store}
          onMount={(editor) => {
            editor.registerExternalAssetHandler('url', getBookmarkPreview);
            editor.setCurrentTool('hand');
            editor.sideEffects.registerBeforeChangeHandler('shape', (next) => {
              if (editor.getSelectedShapeIds().includes(next.id)) {
                editor.setCurrentTool('hand');
              }
              return next;
            });
          }}
          components={{
            Canvas: DefaultCanvas,
            OnTheCanvas: BoundsDisplayD0,
          }}
          cameraOptions={CAMERA_OPTIONS}
          hideUi
          overrides={overrides}
        />
      </div>
    );
  });
};



export const Day0Viewer = createDay0();
export const Day1Viewer = createDay1();
