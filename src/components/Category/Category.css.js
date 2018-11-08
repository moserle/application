import { keyframes } from 'styled-components';
import Color from 'color';

const styles = theme => ({
  icon: {
    color: 'rgba(0,0,0,0.50)',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgba(0,0,0,0.87)'
    }
  },
  isOver: {
    background: 'rgba(0, 0, 0, 0.20)'
  }
});

const pulseAnimation = color => {
  return keyframes`
  0% {
    box-shadow: 0px 0px 0px 0px ${Color(color)
      .alpha(0.6)
      .string()};
  }
  10% {
    background-color: ${Color(color)
      .alpha(0.6)
      .string()};
  }
  70% {
    background-color: ${Color(color)
      .alpha(0)
      .string()};
    box-shadow: 0px 0px 30px 30px ${Color(color)
      .alpha(0.0)
      .string()};
  }
  100% {
    box-shadow: 0px 0px 0px 0px ${Color(color)
      .alpha(0.0)
      .string()};
  }
`;
};

const pulseAnimation2 = color => {
  return keyframes`
  0% {
    box-shadow: 0px 0px 0px 0px ${Color(color)
      .alpha(0.6)
      .string()};
  }
  10% {
    background-color: ${Color(color)
      .alpha(0.6)
      .string()};
  }
  70% {
    background-color: ${Color(color)
      .alpha(0)
      .string()};
    box-shadow: 0px 0px 31px 31px ${Color(color)
      .alpha(0.0)
      .string()};
  }
  100% {
    box-shadow: 0px 0px 0px 0px ${Color(color)
      .alpha(0.0)
      .string()};
  }
`;
};

export { pulseAnimation, pulseAnimation2 };
export default styles;
