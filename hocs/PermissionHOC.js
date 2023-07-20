import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { usePermission } from '../hooks/UsePermission';

export function withPermission(Component, policyKey,appConfig) {
 
  const Forwarded = forwardRef((props, ref) => {
    const isGranted =
      policyKey || props.policyKey ? usePermission(policyKey || props.policyKey) : true;
      return isGranted  ? <Component ref={ref} {...props} /> : null;
    //return isGranted || appConfig[props.policyKey] ? <Component ref={ref} {...props} /> : null;
  });

  Forwarded.propTypes = {
    policyKey: PropTypes.string,
  };

  return Forwarded;
}
