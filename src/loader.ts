import type { Mount } from '@abcnews/mount-utils';
import { selectMounts, getMountValue, isMount } from '@abcnews/mount-utils';
import type { LayerData } from './components/layer';

type Section = {
  key: string;
  mountNode: Element;
  layers: LayerData[];
};

function conditionallyRemountWithinHeader(mountNode: Mount) {
  // Check if we're inside Header-content
  const headerContentEl: HTMLDivElement | null = mountNode.closest('.Header-content');

  if (!headerContentEl || !headerContentEl.parentElement) {
    return false;
  }

  // Remove Header-media if it exists
  if (headerContentEl.previousElementSibling !== null) {
    headerContentEl.parentElement.removeChild(headerContentEl.previousElementSibling);
  }

  headerContentEl.parentElement.insertBefore(mountNode, headerContentEl);

  return true;
}

function getSection(mountNode: Element): Promise<Section> {
  if (!isMount(mountNode)) {
    throw new Error('Not a mount node');
  }

  // Legacy Odyssey will have already re-mounted #parallax within .Header-media.
  // This conditional re-mounting will apply in Presentation Layer-only Odyssey.
  conditionallyRemountWithinHeader(mountNode);

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
