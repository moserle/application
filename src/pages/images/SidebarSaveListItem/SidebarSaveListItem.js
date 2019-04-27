import * as React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import json2csv from 'json2csv';
import fileDownload from 'js-file-download';
import { fields } from '../../../constants';
import { SaveDialog } from '..';
import { useDialog, useMenu } from '../../../hooks';
import * as API from '../../../classifier';
import * as MaterialUI from '@material-ui/core';

const SidebarSaveListItem = props => {
  const { anchorEl, openedMenu, openMenu, closeMenu } = useMenu();
  const { openedDialog, openDialog, closeDialog } = useDialog();

  const [defaultDialogText, setDefaultDialogText] = React.useState('');
  const [downloadFunction, setDownloadFunction] = React.useState(0);

  const changeDefaultDialogText = event => {
    setDefaultDialogText(event.target.value);
  };

  const clickOnExportLabels = () => {
    let fileName = defaultDialogText;
    if (fileName.length === 0) fileName = 'labels.csv';
    if (fileName.split('.').pop() !== 'csv') fileName = fileName + '.csv';
    const Json2csvParser = json2csv.Parser;
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(Object.values(props.images));
    fileDownload(csv, fileName);
  };

  const clickOnExportProject = () => {
    let fileName = defaultDialogText;
    if (fileName.length === 0) fileName = 'MyProject.cyto';
    if (fileName.split('.').pop() !== 'cyto') fileName = fileName + '.cyto';
    let categories = [...props.categories];
    categories.shift();
    const exportObject = {
      images: props.images,
      categories: categories,
      settings: props.settings
    };
    const json = JSON.stringify(exportObject, null, '\t');
    fileDownload(json, fileName);
  };

  const onSaveAnnotationsAndPredictionsClick = () => {
    closeMenu();

    openDialog();

    setDownloadFunction(clickOnExportLabels);

    setDefaultDialogText('labels.csv');
  };

  const onSaveClassifierClick = () => {
    closeMenu();

    openDialog();

    setDownloadFunction(clickOnExportProject);

    setDefaultDialogText('MyProject.cyto');
  };

  const onSaveWeightsClick = () => {
    closeMenu();

    API.exportWeights();
  };

  const anchorPosition = {
    top: openedMenu ? anchorEl.getBoundingClientRect().bottom - 3 : 0,
    left: openedMenu ? anchorEl.getBoundingClientRect().left + 14 : 0
  };

  return (
    <React.Fragment>
      <MaterialUI.ListItem button onClick={openMenu}>
        <MaterialUI.ListItemIcon>
          <SaveIcon />
        </MaterialUI.ListItemIcon>

        <MaterialUI.ListItemText inset primary="Save" />
      </MaterialUI.ListItem>

      <MaterialUI.Popover
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        onClose={closeMenu}
        open={openedMenu}
      >
        <MaterialUI.Paper>
          <MaterialUI.MenuList dense>
            <MaterialUI.MenuItem onClick={onSaveClassifierClick}>
              <MaterialUI.ListItemText primary="Save classifier" />
            </MaterialUI.MenuItem>

            <MaterialUI.Divider />

            <MaterialUI.MenuItem onClick={onSaveAnnotationsAndPredictionsClick}>
              <MaterialUI.ListItemText primary="Save annotations and predictions" />
            </MaterialUI.MenuItem>

            <MaterialUI.MenuItem onClick={onSaveWeightsClick}>
              <MaterialUI.ListItemText primary="Save weights" />
            </MaterialUI.MenuItem>
          </MaterialUI.MenuList>
        </MaterialUI.Paper>
      </MaterialUI.Popover>

      <SaveDialog
        open={openedDialog}
        download={downloadFunction}
        onClose={closeDialog}
        defaultDialogText={defaultDialogText}
        changeDefaultDialogText={changeDefaultDialogText}
      />
    </React.Fragment>
  );
};

export default SidebarSaveListItem;
