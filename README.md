# Odyssey Parallax

This module integrates with [Odyssey](https://stash.abc-dev.net.au/projects/NEWS/repos/odyssey/browse) to implement parallax sections in Odyssey based stories.

## Normal usage

To use this in a story, include it in the article body:

```
Some text before the parallax portion of the story starts.

#parallax
[HTML fragment containing the parallax config from Keyframer]
...any images that should render in lieu of the parallax when syndicating...
#endparallax

You can then carry on your story after the parallax section.
```

## Header usage

To use a parallax as the header then simply place the HTML fragment inside the `#header` tags:

```
#header
[HTML frament containing the parallax config from Keyframer]
#endheader
```

## Authors

- Nathan Hoad ([nathan@nathanhoad.net](mailto:nathan@nathanhoad.net))
