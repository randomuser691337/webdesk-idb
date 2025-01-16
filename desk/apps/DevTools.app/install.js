setTimeout(function () {
    if (sys.dev === true) {
        app['devtools'] = {
            runs: true,
            name: 'DevTools',
            init: async function () {
                const win = tk.mbw('DevTools', '300px', 'auto', true, undefined, undefined);
                tk.cb('b1 b2', 'Make & Copy App ID', () => gen(12), win.main);
            }
        }
    }
}, 2000);