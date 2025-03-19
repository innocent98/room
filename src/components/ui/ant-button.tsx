import { Button as AntButton, ButtonProps } from 'antd';
import styled from 'styled-components';

// Using styled-components
const StyledButton = styled(AntButton)`
  &.ant-btn-primary {
    background-color: #3949AB;
    border-color: #3949AB;
    
    &:hover {
      background-color: #303F9F;
      border-color: #303F9F;
    }
  }
`;

// Custom Button component
export const AButton = (props: ButtonProps) => {
  return <StyledButton {...props} />;
};