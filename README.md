# player.video | Hosted players for the web

This is a collection of open-source players with a webcomponent wrapper to make using any of them easy.

Supported Players:
| Player Name | Tag Attribute |
|--|--|
| [Video.js](https://videojs.com) | `videojs` |
| Hls.js | `hlsjs` |

## Getting Started

Include the JavaScript in your HTML

```html
<script src="https://player.video/embed.js"></script>
```

Now you have a shiny web component you can use anywhere! By default we use Video.js if you don't specify a player.

```html
<video-player controls src="https://example.com/video.mp4"></video-player>
```

```html
<video-player player="hlsjs" src="https://example.co/video.mp4"></video-player>
```

## [Mux](https://mux.com/video) Helpers

We pass through most tag attributes directly to the player, but we also provide a few convenience helpers for those using Mux Video.

```html
<video-player controls mux-playback-id="abcd1234" mux-poster-time="10" />
```

## Development

Copy the structure of an existing project.

### Setup

```
yarn install
```

### Test

```
yarn start
```

## Deploying to Production

Make sure your project is listed in `now.json` at the root of the repo.

Then make a PR. The repo auto deploys.
