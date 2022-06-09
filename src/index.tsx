import { whenOdysseyLoaded } from '@abcnews/env-utils';
import React from 'react';
import { render } from 'react-dom';
import App from './components/app';
import { getSections } from './loader';

whenOdysseyLoaded.then(() =>
  getSections().forEach(sectionPromise =>
    sectionPromise.then(({ layers, mountNode }) => render(<App layers={layers} />, mountNode))
  )
);
