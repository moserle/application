import { connect } from 'react-redux';
import { ColorPicker } from '../components';

const mapStateToProps = (state: any, props: any) => {
  return {
    categories: state.categories
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {};
};

const ConnectedColorPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorPicker);

export default ConnectedColorPicker;
