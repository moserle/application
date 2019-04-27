import { connect } from 'react-redux';
import { Gallery } from '../pages/images';

const mapStateToProps = (state: any, props: any) => {
  return {
    images: state.images
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {};
};

const ConnectedGallery = connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);

export default ConnectedGallery;
