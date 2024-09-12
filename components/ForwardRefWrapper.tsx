import React, { forwardRef, ComponentType } from 'react';

interface ForwardRefWrapperProps {
  component: ComponentType<any>;
  [key: string]: any;
}

const ForwardRefWrapper = forwardRef<any, ForwardRefWrapperProps>(
  ({ component: Component, ...rest }, ref) => {
    return <Component {...rest} ref={ref} />;
  }
);

export default ForwardRefWrapper;
