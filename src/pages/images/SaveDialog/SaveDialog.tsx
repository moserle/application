import * as React from 'react';
import * as MaterialUI from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SaveDialog = (props: any) => {
  const {
    open,
    onClose,
    download,
    defaultDialogText,
    changeDefaultDialogText
  } = props;

  const { t: translation } = useTranslation();

  const handleDownload = (props: any) => {
    onClose();
    download();
  };

  return (
    <MaterialUI.Dialog onClose={onClose} open={open}>
      <MaterialUI.DialogContent>
        <MaterialUI.TextField
          autoFocus
          margin="dense"
          id="name"
          label="Filename"
          fullWidth
          onChange={e => {
            changeDefaultDialogText(e);
          }}
          value={defaultDialogText}
        />
      </MaterialUI.DialogContent>

      <MaterialUI.DialogActions>
        <MaterialUI.Button onClick={onClose} color="primary">
          {translation('Cancel')}
        </MaterialUI.Button>

        <MaterialUI.Button
          onClick={() => handleDownload(props)}
          color="primary"
        >
          {translation('Download')}
        </MaterialUI.Button>
      </MaterialUI.DialogActions>
    </MaterialUI.Dialog>
  );
};

export default SaveDialog;
