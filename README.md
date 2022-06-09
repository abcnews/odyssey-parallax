# Odyssey Parallax

This module is a plugin for [Odyssey](https://github.com/abcnews/odyssey) to implement parallax sections in Odyssey based stories.

## Normal usage

To use this in a story, include it in the article body (where `key` is the key given to you from Keyframer):

```
Some text before the parallax portion of the story starts.

#parallaxkey

You can then carry on your story after the parallax section.
```

## Header usage

To use a parallax as the header then simply place the hash marker inside the `#header` tags:

```
#header
#parallaxkey
#endheader
```

## Legacy usage support

Before `#parallaxkey` was supported, we had to embded the config in an HTML Fragment. These old usages have now been ported to the new method, with configs stored alongside their projects. [[Details]](https://github.com/abcnews/odyssey-parallax-legacy-configs)

## Authors

- Nathan Hoad ([hoad.nathan@abc.net.au](mailto:hoad.nathan@abc.net.au))
- Simon Elvery ([simon@elvery.net](mailto:simon@elvery.net))
- Colin Gourlay ([gourlay.colin@abc.net.au](mailto:gourlay.colin@abc.net.au))
