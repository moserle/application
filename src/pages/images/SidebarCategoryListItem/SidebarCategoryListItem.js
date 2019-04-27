import * as React from 'react';
import LabelIcon from '@material-ui/icons/Label';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { DropTarget } from 'react-dnd/lib/index';
import StyledCategory from './StyledCategory';
import styles from './SidebarCategoryListItem.css';
import { makeStyles } from '@material-ui/styles';
import { useMenu } from '../../../hooks';
import { SidebarCategoryListItemMenuList } from '..';
import * as MaterialUI from '@material-ui/core';

const spec = {
  drop(props, monitor, component) {
    const selectedItems = monitor.getItem().selectedItems;

    return {
      categoryIdentifier: props.category.identifier,
      categoryName: props.description,
      color: props.color,
      selectedItems: selectedItems
    };
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const useStyles = makeStyles(styles);

const SidebarCategoryListItem = props => {
  const [animateOnDrop, setAnimateOnDrop] = React.useState(null);

  const { anchorEl, openedMenu, openMenu, closeMenu } = useMenu();

  const classes = useStyles();

  const { categories, category, connectDropTarget, toggleVisibility } = props;

  const onToggleVisibilityClick = () => {
    toggleVisibility(category.identifier);
  };

  const VisibleIcon = props => {
    const { color, visible } = props;

    if (visible) {
      return <LabelIcon style={{ color: color }} />;
    } else {
      return <LabelOutlinedIcon style={{ color: color }} />;
    }
  };

  return (
    <React.Fragment>
      <StyledCategory
        ref={instance => connectDropTarget(instance)}
        color={category.color}
        onDrop={() => setAnimateOnDrop(!animateOnDrop)}
        className={
          animateOnDrop !== null
            ? animateOnDrop
              ? 'onDropPulse'
              : 'onDropPulse2'
            : null
        }
      >
        <MaterialUI.ListItem
          dense
          style={{ cursor: 'pointer' }}
          classes={{
            root: props.isOver ? classes.isOver : null
          }}
        >
          <MaterialUI.ListItemIcon onClick={onToggleVisibilityClick}>
            <VisibleIcon color={category.color} visible={category.visible} />
          </MaterialUI.ListItemIcon>

          <MaterialUI.ListItemText primary={category.description} />

          <MaterialUI.ListItemSecondaryAction>
            <MaterialUI.IconButton onClick={openMenu}>
              <MoreHorizIcon />
            </MaterialUI.IconButton>
          </MaterialUI.ListItemSecondaryAction>
        </MaterialUI.ListItem>
      </StyledCategory>

      <SidebarCategoryListItemMenuList
        anchorEl={anchorEl}
        categories={categories}
        category={category}
        closeMenu={closeMenu}
        openedMenu={openedMenu}
      />
    </React.Fragment>
  );
};

export default DropTarget('SelectedItems', spec, collect)(
  SidebarCategoryListItem
);
