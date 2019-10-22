import React from 'react';
import { ImageViewerDialog } from '../../image';
import Image from '../../../components/Image/Image';
import { useDialog } from '@piximi/hooks';
import { ConnectedItemLabel } from '../../../containers';
import { useDrag, DndProvider } from 'react-dnd';

export const GalleryItem = (props: any) => {
  const { selectedItems, onmousedown, containerStyle, item } = props;

  const { openedDialog, openDialog, closeDialog } = useDialog();

  const unselectedChannels = item.visualization.visibleChannels;

  const spec = {
    item: {
      selectedItems: selectedItems,
      type: 'image'
    }
  };

  const [, dragSource] = useDrag(spec);

  return (
    <div ref={dragSource}>
      <ConnectedItemLabel image={item} />

      <Image
        key={'img' + item.identifier}
        id={item.identifier}
        openImageViewerDialog={openDialog}
        src={item.data}
        brightness={item.brightness}
        contrast={item.contrast}
        unselectedChannels={unselectedChannels}
        height={containerStyle.height}
        width={0.9 * containerStyle.width}
      />

      <ImageViewerDialog
        onClose={closeDialog}
        open={openedDialog}
        src={item.data}
        imgIdentifier={item.identifier}
        brightness={item.brightness}
      />
    </div>
  );
};
