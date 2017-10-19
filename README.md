# Odyssey Parallax

This module is a plugin for [Odyssey](https://github.com/abcnews/odyssey) to implement parallax sections in Odyssey based stories.

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

- Nathan Hoad ([hoad.nathan@abc.net.au](mailto:hoad.nathan@abc.net.au))
