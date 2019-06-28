import isArray from 'lodash';

import React from 'react';

import NotLoaded from 'NotLoaded';
import Loading from './Loading';

export default function renderLoadingIfNotLoaded(value, loadingProps) {
  if (value === NotLoaded) {
    return <Loading {...loadingProps} />;
  }

  return null;
}