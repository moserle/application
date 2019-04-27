import { connect } from 'react-redux';
import { GalleryItemLabel } from '../pages/images';

const mapStateToProps = (state: any, props: any) => {
  return {
    categories: state.categories
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {};
};

const ConnectedItemLabel = connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryItemLabel);

export default ConnectedItemLabel;
