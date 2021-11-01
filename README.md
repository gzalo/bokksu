# bokksu
*(meaning "box" in japanese)*

Interactive system that can be used to display and upload 3d packages. 

[A working demo can be found here](https://packaging.gzalo.com/) (By default it's in Spanish, but there's a language switcher on the top right of the sidebar)

![Screenshot](docs/screenshot0.png)

Used for academic purposes (during the pandemic, students uploaded their work and professors viewed and compared them in 3D):
- [Cátedra Belluccia](http://catedrabelluccia.com.ar/) in [FADU, Universidad de Buenos Aires, Argentina](http://www.fadu.uba.ar/)

Technical details:
- Static frontend developed with [Vue.js](https://vuejs.org/) + [Three.js](https://threejs.org/)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)
- Backend using [Clouflare Workers](https://workers.cloudflare.com/) and Workers KV for storing submissions (both JSON data and the actual files)

2020-2021 by [gzalo (Gonzalo Avila Alterach)](https://gzalo.com) - released under MIT License
