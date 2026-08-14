import '@testing-library/jest-dom';
import React from 'react';
globalThis.React = React;

class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IntersectionObserver;
