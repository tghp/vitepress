# vitepress

An opioninated, pre-structured approach to builnding using vite for WordPress projects.

## Pre-determined Structure

Vitepress will:

- Look at the primary them in `src/themes`, it can only handle one, but documentation for how to support multiple will come later.
- Compile each script found using this glob: `src/themes/{theme}/assets/src/js/*.js`. Any scripts in sub-folders will not compile and should be used for organisational purposees. See [@tghp/groundwork.js](https://github.com/tghp/groundwork.js)
- Compile each SCSS stylesheet found using this glob: `src/themes/{theme}/assets/src/sass/*.scss`

## Using vitepress

1. Install vitepress: `npm i -d @tghp/vitepress`

2. Add the following to a file named `vite.config.mts`. Behaviour can be modified by using options defined later.

    ```typescript
    import vitepress from '@tghp/vitepress';
    
    export default vitepress({
        root: __dirname,
    });
    ```

3. Add scripts to your `package.json`:

    ```json
    {
      "scripts": {
        "dev": "vite --mode=watch",
        "build": "vite build"
      }
    }
    ```
   
### Options
| Key    | Value                                                                                            |
|--------|--------------------------------------------------------------------------------------------------|
| react  | Enables React transpiling allowing JSX/TSX.                                                      |
| preact | Used in conjuction with `react: true`, Vite will make necessary changes to allow preact to work. |

## Technology specific
### React
If you are using React, you will need to add the following pass `react` as true to the vitepress options.

#### SVGs
We add support for SVGs via [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) allowing importing of SVGs as follows:

```javascript
import { ReactComponent as Logo } from './logo.svg';
```