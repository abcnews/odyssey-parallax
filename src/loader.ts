import { selectMounts, getMountValue, isMount } from '@abcnews/mount-utils';
import type { LayerData } from './components/layer';

type Section = {
  key: string;
  mountNode: Element;
  layers: LayerData[];
};

function getSection(mountNode: Element): Promise<Section> {
  if (!isMount(mountNode)) {
    throw new Error('Not a mount node');
  }

  mountNode.classList.add('u-full');

  const key = getMountValue(mountNode, 'parallax');

  // load the layers if need be
  return fetch(`//www.abc.net.au/dat/news/interactives/parallaxative/${key}/config.json`)
    .then(r => r.json())
    .catch(err => {
      console.log('Fetch err:', err);
    })
    .then((layers: LayerData[]) => {
      return { key, mountNode, layers };
    });
}

export function getSections() {
  return selectMounts('parallax').map(el => getSection(el));
}
