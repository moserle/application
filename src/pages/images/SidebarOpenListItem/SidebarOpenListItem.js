import * as React from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { useDialog, useMenu } from '../../../hooks';
import { OpenExampleClassifierDialog } from '..';
import * as API from '../../../classifier';
import * as MaterialUI from '@material-ui/core';

function openProject(e, props) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const text = reader.result;
    const data = JSON.parse(text);
    props.updateStore(data);
  };

  reader.readAsText(e.target.files[0]);
}

const SidebarOpenListItem = props => {
  const { loadDemoProject } = props;

  const { openedDialog, openDialog, closeDialog } = useDialog();

  const { anchorEl, openedMenu, openMenu, closeMenu } = useMenu();

  const onOpenProjectMenuItemClick = event => {
    openProject(event, props);

    closeMenu();
  };

  const openExampleClassifier = () => {
    openDialog();

    closeMenu();
  };

  const openWeights = event => {
    API.importWeights(event.target.files);

    closeMenu();
  };

  const anchorPosition = {
    top: openedMenu ? anchorEl.getBoundingClientRect().bottom - 3 : 0,
    left: openedMenu ? anchorEl.getBoundingClientRect().left + 14 : 0
  };

  return (
    <React.Fragment>
      <MaterialUI.ListItem button onClick={openMenu}>
        <MaterialUI.ListItemIcon>
          <FolderOpenIcon />
        </MaterialUI.ListItemIcon>

        <MaterialUI.ListItemText primary="Open" />
      </MaterialUI.ListItem>

      <MaterialUI.Popover
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        onClose={closeMenu}
        open={openedMenu}
      >
        <MaterialUI.Paper>
          <MaterialUI.MenuList dense>
            <input
              accept=".cyto"
              id="open-project"
              name="file"
              onChange={onOpenProjectMenuItemClick}
              style={{ display: 'none' }}
              type="file"
            />

            <label htmlFor="open-classifier">
              <MaterialUI.MenuItem>
                <MaterialUI.ListItemText primary="Open classifier" />
              </MaterialUI.MenuItem>
            </label>

            <MaterialUI.Divider />

            <MaterialUI.MenuItem onClick={openExampleClassifier}>
              <MaterialUI.ListItemText primary="Open example classifier" />
            </MaterialUI.MenuItem>

            <input
              accept="*"
              id="open-weights"
              name="file"
              onChange={openWeights}
              style={{ display: 'none' }}
              type="file"
            />

            <label htmlFor="open-weights">
              <MaterialUI.MenuItem>
                <MaterialUI.ListItemText primary="Open weights" />
              </MaterialUI.MenuItem>
            </label>
          </MaterialUI.MenuList>
        </MaterialUI.Paper>
      </MaterialUI.Popover>

      <OpenExampleClassifierDialog
        onClose={closeDialog}
        open={openedDialog}
        loadDemoProject={loadDemoProject}
      />
    </React.Fragment>
  );
};

export default SidebarOpenListItem;
