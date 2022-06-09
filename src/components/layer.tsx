import React, { Component } from 'react';

import styles from './layer.scss';

export enum Orientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait'
}

type TweenProperty = 'x' | 'y' | 'opacity' | 'zoom' | 'rotate';

export type Tween = {
  property: TweenProperty;
  stops: number[];
};

type LayerOrientationData = {
  size: number;
  x: number | string;
  y: number | string;
  cover: boolean;
  tweens: Tween[];
};

export type LayerData = {
  depth: number | string;
  image: string;
  height: number | string;
  width: number | string;
  blendMode:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity';
  landscape: LayerOrientationData;
  portrait: LayerOrientationData;
};

type LayerProps = {
  layer: LayerData;
  layerParent: HTMLElement | null;
  orientation: Orientation;
  timeline: number;
};

const ensureFloat = (value: string | number) => parseFloat(String(value));
const ensureInt = (value: string | number) => parseInt(String(value), 10);

class Layer extends Component<LayerProps> {
  props: LayerProps;
  constructor(props: LayerProps) {
    super(props);
    this.props = props;
    this.getTween = this.getTween.bind(this);
    this.calc = this.calc.bind(this);
  }

  getTween(property: TweenProperty) {
    const { layer, orientation } = this.props;
    return layer[orientation].tweens.filter(t => t.property === property)[0];
  }

  calc(property: TweenProperty, defaultTo: number) {
    const { timeline } = this.props;

    const tween = this.getTween(property);

    if (!tween) return defaultTo;

    const stops = tween.stops;
    const index = Math.ceil((1 - timeline) * (stops.length - 1));

    if (index === 0) {
      return stops[index];
    } else {
      let sizeOfStop = 1 / (stops.length - 1);
      let startOfStop = (index - 1) * sizeOfStop;

      let timelineInStop = (1 - timeline - startOfStop) / sizeOfStop;
      // avoid floating point nonsense
      timelineInStop = Math.round(timelineInStop * 1000) / 1000;

      let minValue = stops[index - 1];
      let maxValue = stops[index];
      let range = maxValue - minValue;

      return minValue + range * timelineInStop;
    }
  }

  render() {
    const { layer, orientation, timeline, layerParent } = this.props;

    if (!layerParent) return <div />;

    let d = ensureInt(layer.depth);

    if (isNaN(d)) d = 1;

    let minY = d * -1;
    let maxY = d * 1;
    let rangeY = Math.abs(maxY - minY);

    const rotate = this.calc('rotate', 0);
    let scale = 1 + d * 0.02;

    if (this.getTween('zoom')) {
      const zoom = d * 0.66 + this.calc('zoom', 1);
      scale = scale * (zoom / 10) - 0.1;
    }

    // if there is an x tween then use that, or just normal x
    let x = -50 + ensureFloat(layer[orientation].x);
    if (this.getTween('x')) {
      x = -50 + this.calc('x', 0);
    }
    // map x to a position within the stage
    x = layerParent.offsetWidth * (x / 100);

    // if there is a y tween use that, or just normal y
    const yParallax = minY + rangeY * timeline;
    let y = -50 + ensureFloat(layer[orientation].y) + yParallax;
    if (this.getTween('y')) {
      y = -50 + this.calc('y', 0) + yParallax;
    }
    // map y to a position within the stage
    y = layerParent.offsetHeight * (y / 100);

    let wrapperStyle = {
      width: layerParent.offsetWidth + 'px',
      height: layerParent.offsetHeight + 'px',
      top: '50%',
      left: '50%',
      transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
      opacity: this.calc('opacity', 1),
      mixBlendMode: layer.blendMode
    };

    let mediaStyle = {
      width: '100%'
    };

    if (layer[orientation].cover) {
      // set images shortest side to be 100%
      const imageRatio = ensureFloat(layer.width) / ensureFloat(layer.height);
      const stageRatio = layerParent.offsetWidth / layerParent.offsetHeight;
      const size = 100;
      if (stageRatio >= imageRatio) {
        // behave like landscape
        mediaStyle.width = size + '%';
      } else if (layerParent) {
        // behave like portrait
        const height = (layerParent.offsetHeight * size) / 100;
        mediaStyle.width = ensureFloat(layer.width) * (height / ensureFloat(layer.height)) + 'px';
      }
    } else {
      const size = layer[orientation].size;
      if (orientation === Orientation.LANDSCAPE) {
        mediaStyle.width = size + '%';
      } else if (layerParent) {
        const height = (layerParent.offsetHeight * size) / 100;
        mediaStyle.width = ensureFloat(layer.width) * (height / ensureFloat(layer.height)) + 'px';
      }
    }

    let src = layer.image;
    let media: JSX.IntrinsicElements['img'] | JSX.IntrinsicElements['video'];
    if (src.indexOf('.mp4') > -1) {
      media = <video src={src} autoPlay loop />;
    } else {
      media = <img src={src} />;
    }

    return (
      <div className={styles.wrapper} style={wrapperStyle} data-component="OdysseyParallax_Layer">
        <div className={styles.media} style={mediaStyle}>
          {media}
        </div>
      </div>
    );
  }
}

export default Layer;
