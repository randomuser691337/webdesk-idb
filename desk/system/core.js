// WebDesk 0.2.0
// Based on Rebuild 7 (wtf)
(function () {
    const minimumVersions = { Chrome: 100, Firefox: 100, Safari: 15, Edge: 100, "Internet Explorer": 11 };
    const ua = navigator.userAgent;

    const browser =
        /Chrome\/(\d+)/.exec(ua) ? { name: "Chrome", version: +RegExp.$1 } :
            /Firefox\/(\d+)/.exec(ua) ? { name: "Firefox", version: +RegExp.$1 } :
                /Safari\/(\d+)/.exec(ua) && !/Chrome/.test(ua) ? { name: "Safari", version: +RegExp.$1 } :
                    /Edg\/(\d+)/.exec(ua) ? { name: "Edge", version: +RegExp.$1 } :
                        /MSIE (\d+)|rv:(\d+)/.exec(ua) ? { name: "Internet Explorer", version: +(RegExp.$1 || RegExp.$2) } :
                            { name: "Unknown", version: 0 };

    if (minimumVersions[browser.name] && browser.version < minimumVersions[browser.name]) {
        alert(`Your browser (${browser.name} ${browser.version}) is outdated. Update it, or else WebDesk might not work right.`);
    }
})();

let clickCount = 0;
let clickStartTime = null;
const pageStartTime = Date.now();
const circle = document.querySelector('.circle');

const resetClicks = () => {
    clickCount = 0;
    clickStartTime = null;
};

circle.addEventListener('click', () => {
    const currentTime = Date.now();
    if (currentTime - pageStartTime > 20000) return;
    if (clickStartTime === null) {
        clickStartTime = currentTime;
    }

    clickCount++;

    if (clickCount === 5 && currentTime - clickStartTime <= 10000) {
        const menu = tk.c('div', tk.g('background'), 'cm');
        tk.p('Mini recovery mode', undefined, menu);
        tk.cb('b1 b2', 'TextEdit', () => app.textedit.init(), menu);
        tk.cb('b1 b2', 'Settings', () => app.settings.init(), menu);
        tk.cb('b1 b2', 'Files', () => app.files.init(), menu);
        tk.cb('b1', 'Exit (Reboot)', () => wd.reboot(), menu);
        resetClicks();
    }

    if (currentTime - clickStartTime > 10000) {
        resetClicks();
    }
});

console.log(`<!> You've unlocked the REAL developer mode!`);
console.log(`<!> For the love of all that is holy, DO NOT, and I mean DO NOT, PASTE ANY CODE IN HERE.`);
console.log(`<!> If you were told to paste here, you're probably getting scammed.`);

function gen(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function gens(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const array = new Uint32Array(Math.ceil(length / 4));
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i].toString(16).padStart(8, '0');
    }

    return result.slice(0, length);
}

var focused = {
    closebtn: undefined,
    tbn: undefined,
    window: undefined,
    minbtn: undefined,
}

function ughfine(targetElement) {
    const targetZIndex = parseInt(window.getComputedStyle(targetElement).zIndex, 10);
    if (isNaN(targetZIndex)) return null;

    const elements = document.querySelectorAll(`.window`);
    let closestElement = null, closestDifference = Infinity;

    elements.forEach((element) => {
        if (element === targetElement || element.classList.contains('windowanim')) return;
        const elementZIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
        if (isNaN(elementZIndex)) return;
        const difference = Math.abs(targetZIndex - elementZIndex);
        if (difference < closestDifference) {
            closestDifference = difference;
            closestElement = element;
        }
    });

    return closestElement;
}

document.addEventListener('keydown', async function (event) {
    if (event.altKey && event.key.toLowerCase() === 'q' && focused.closebtn !== undefined) {
        event.preventDefault();
        await wm.close(focused.window, focused.tbn);
    }
    if (event.altKey && event.key.toLowerCase() === 'm' && focused.minbtn !== undefined) {
        event.preventDefault();
        await wm.minimize(focused.window, focused.tbn);
    }
    if (event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        app.lockscreen.init();
    }
    if (event.altKey && event.key.toLowerCase() === 'r' && focused.window !== undefined) {
        event.preventDefault();
        ui.center(focused.window);
    }
    if (event.altKey && event.key.toLowerCase() === '/') {
        event.preventDefault();
        const keys = tk.c('div', document.body, 'cm');
        tk.p('Keybinds', 'bold', keys);
        tk.p('<span class="bold">Alt+R</span> Center focused window', undefined, keys);
        tk.p('<span class="bold">Alt+Q</span> Closes focused window', undefined, keys);
        tk.p('<span class="bold">Alt+M</span> Hides focused window', undefined, keys);
        tk.p('<span class="bold">Alt+L</span> Locks/sleeps WebDesk', undefined, keys);
        tk.p('<span class="bold">Alt+/</span> View keybinds', undefined, keys);
        tk.cb('b1', 'Close', () => ui.dest(keys), keys);
    }
});

var wd = {
    win: function (winfocus, closebtn, minbtn, tbnbtn) {
        if (winfocus) {
            if (closebtn) {
                focused.closebtn = closebtn;
                focused.window = winfocus;
            }
            if (minbtn) {
                focused.minbtn = minbtn;
            }
            if (tbnbtn) {
                focused.tbn = tbnbtn;
            }
            var $winfocus = $(winfocus);
            // if ($winfocus.length && !$winfocus.hasClass('max') && !$winfocus.hasClass('unmax')) {
            var windows = $('.window');
            var highestZIndex = Math.max.apply(null, windows.map(function () {
                var zIndex = parseInt($(this).css('z-index')) || 0;
                return zIndex;
            }).get());
            $winfocus.css('z-index', highestZIndex + 1);
            $('.window').removeClass('winf');
            $winfocus.addClass('winf');
            if (el.menubarbtn) {
                el.menubarbtn.innerText = winfocus.getAttribute('wdname');
            }
            // }
            return;
        }

        $('.d').not('.dragged').on('mousedown touchstart', function (event) {
            var $window = $(this).closest('.window');
            var offsetX, offsetY;
            var windows = $('.window');
            var highestZIndex = Math.max.apply(null, windows.map(function () {
                var zIndex = parseInt($(this).css('z-index')) || 0;
                return zIndex;
            }).get());
            $window.css('z-index', highestZIndex + 1);
            $('.window').removeClass('winf');
            $window.addClass('winf');

            if (!$window.hasClass('max') && sys.mobui !== true) {
                if (event.type === 'mousedown') {
                    offsetX = event.clientX - $window.offset().left;
                    offsetY = event.clientY - $window.offset().top;
                } else if (event.type === 'touchstart') {
                    var touch = event.originalEvent.touches[0];
                    offsetX = touch.clientX - $window.offset().left;
                    offsetY = touch.clientY - $window.offset().top;
                }

                $(document).on('mousemove touchmove', function (event) {
                    var newX, newY;
                    if (event.type === 'mousemove') {
                        newX = event.clientX - offsetX;
                        newY = event.clientY - offsetY;
                        $window.addClass('dragging');
                    } else if (event.type === 'touchmove') {
                        var touch = event.originalEvent.touches[0];
                        newX = touch.clientX - offsetX;
                        newY = touch.clientY - offsetY;
                        $window.addClass('dragging');
                    }

                    $window.offset({ top: newY, left: newX });
                });

                $(document).on('mouseup touchend', function () {
                    $(document).off('mousemove touchmove');
                    $window.removeClass('dragging');
                });
            }
        });
    },
    desktop: function (name, type, waitopt) {
        ui.dest(tk.g('setuparea'));
        ui.cv('menubarheight', '38px');
        let screenWidth;
        function startmenu() {
            if (el.sm == undefined) {
                if (el.cc) {
                    ui.dest(el.cc, 40);
                    el.cc = undefined;
                } else if (el.am) {
                    ui.dest(el.am, 40);
                    el.am = undefined;
                }
                el.sm = tk.c('div', document.body, 'tbmenu');
                elementWidth = el.sm.getBoundingClientRect().width;
                el.sm.style.left = `${(screenWidth - elementWidth) / 2}px`;
                tk.p(`Hello, ${name}!`, 'h2', el.sm);
                const thing = tk.p(`Your DeskID is `, undefined, el.sm);
                tk.cb('linkbtn', sys.deskid, function () {
                    ui.copy(`${window.location.origin}/?id=${sys.deskid}`);
                    wm.snack('Copied DeskID quicklink. Send it to your friends!');
                }, thing);
                const ok = tk.c('div', el.sm, 'embed nest brick-layout');
                for (let key in app) {
                    if (app.hasOwnProperty(key)) {
                        if (app[key].hasOwnProperty("runs") && app[key].runs === true) {
                            const btn = tk.cb('b3', app[key].name, app[key].init.bind(), ok);
                            btn.addEventListener('click', function () {
                                ui.dest(el.sm, 0);
                                el.sm = undefined;
                            });
                            btn.addEventListener('contextmenu', function (event) {
                                event.preventDefault();
                                const menu = tk.c('div', document.body, 'rightclick');
                                const pos = btn.getBoundingClientRect();
                                const thing = { clientX: pos.left, clientY: pos.top };
                                ui.rightclick(menu, thing, btn, true);
                                tk.cb('b2 b3', 'Container', async function () {
                                    const thing = await new Blob([app[key].init], { type: "text/plain" });;
                                    app.browser.view(`./container.html?code=${thing}`, app[key].name, false);
                                }, menu);
                            });
                            btn.style.textAlign = "left";
                        }
                    }
                }
                wd.reorg(ok);
            } else {
                ui.dest(el.sm, 140);
                el.sm = undefined;
            }
        }
        function controlcenter() {
            if (el.cc == undefined) {
                if (el.sm) {
                    ui.dest(el.sm, 140);
                    el.sm = undefined;
                } else if (el.am) {
                    ui.dest(el.am, 40);
                    el.am = undefined;
                }
                el.cc = tk.c('div', document.body, 'menubardiv');
                const ok = tk.c('div', el.cc, 'embed nest');
                if (sys.guest === false && sys.echodesk === false) {
                    const yeah = tk.cb('b3 b2', 'Deep Sleep', function () {
                        const menu = tk.c('div', document.body, 'cm');
                        tk.p('Deep Sleep', 'bold', menu);
                        tk.p(`Your DeskID will work as normal, and WebDesk will use little resources. Save your work before entering.`, undefined, menu);
                        tk.cb('b1', 'Close', () => ui.dest(menu), menu); tk.cb('b1', 'Enter', async function () {
                            await fs.write('/system/eepysleepy', 'true');
                            await wd.reboot();
                        }, menu);
                    }, ok);
                    yeah.style.marginTop = "2px";
                }
                tk.cb('b3 b2', 'Clear Notifications', function () {
                    ui.hide(tk.g('notif'), 200);
                    setTimeout(function () {
                        tk.g('notif').innerHTML = "";
                        ui.show(tk.g('notif'));
                    }, 200);
                }, ok);
                tk.cb('b3 b2', 'Reboot/Reload', function () {
                    wd.reboot();
                }, ok);
                const addicon = tk.cb('conticon', '', function () {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.style.display = 'none';
                    input.addEventListener('change', function (event) {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();

                            reader.onload = async function (e) {
                                const silly = e.target.result;
                                await fs.write(`/user/files/` + file.name, silly);
                            };

                            reader.readAsDataURL(file);
                        }
                    });

                    input.click();
                    controlcenter();
                }, ok);
                tk.img('/assets/img/icons/plus.svg', 'contimg', addicon, false);
                ui.tooltip(addicon, 'Add file to WebDesk');
                const sleepicon = tk.cb('conticon', '', function () {
                    app.lockscreen.init();
                    controlcenter();
                }, ok);
                ui.tooltip(sleepicon, 'Puts WebDesk to sleep; apps keep running');
                tk.img('/assets/img/icons/moon.svg', 'contimg', sleepicon, false);
                const screenicon = tk.cb('conticon', '', function () {
                    wd.fullscreen();
                }, ok);
                ui.tooltip(screenicon, 'Fullscreen toggle');
                tk.img('/assets/img/icons/fs.svg', 'contimg', screenicon, false);
                const notificon = tk.cb('conticon', '', async function () {
                    if (sys.nvol === 0) {
                        notifimg.src = "/assets/img/icons/notify.svg";
                        sys.nvol = 1.0;
                        ui.play(sys.notifsrc);
                        await fs.del('/user/info/silent');
                    } else {
                        notifimg.src = "/assets/img/icons/silent.svg";
                        sys.nvol = 0.0;
                        await fs.write('/user/info/silent', 'true');
                    }
                    el.contb.classList.toggle('silentbtn');
                }, ok);
                const notifimg = tk.img('/assets/img/icons/notify.svg', 'contimg', notificon, false);
                if (sys.nvol === 0) notifimg.src = "/assets/img/icons/silent.svg";
                ui.tooltip(notificon, 'Silent toggle');
            } else {
                ui.dest(el.cc, 40);
                el.cc = undefined;
            }
        }
        function appmenu() {
            if (el.am == undefined) {
                if (el.sm) {
                    ui.dest(el.sm, 140);
                    el.sm = undefined;
                } else if (el.cc) {
                    ui.dest(el.cc, 40);
                    el.cc = undefined;
                }
                el.am = tk.c('div', document.body, 'menubardiv menubarb');
                el.am.style.left = "7px";
                el.am.style.width = "170px";
                const min = tk.cb('b2', 'Minimize/Hide', async function () {
                    await wm.minimize(focused.window, focused.tbn);
                }, el.am);
                ui.note('Alt+M', min);
                const rec = tk.cb('b2', 'Recenter', async function () {
                    ui.center(focused.window);
                }, el.am);
                ui.note('Alt+R', rec);
                const quit = tk.cb('b2', 'Quit', async function () {
                    await wm.close(focused.window, focused.tbn);
                }, el.am);
                ui.note('Alt+Q', quit);
            } else {
                ui.dest(el.am, 40);
                el.am = undefined;
            }
        }
        function desktopgo() {
            el.taskbar = tk.c('div', document.body, 'taskbar');
            function tbresize() {
                screenWidth = window.innerWidth;
                elementWidth = el.taskbar.offsetWidth;
                el.taskbar.style.left = `${(screenWidth - elementWidth) / 2}px`;
            }
            window.addEventListener('resize', tbresize);
            setInterval(tbresize, 200);
            el.menubar = tk.c('div', document.body, 'menubar menubarb flexthing');
            const left = tk.c('div', el.menubar, 'tnav');
            const right = tk.c('div', el.menubar, 'title nogrowth');
            el.menubarbtn = tk.cb('bold', 'Desktop', () => appmenu(), left);
            el.contb = tk.cb('time', '--:--', () => controlcenter(), right);
            const tasknest = tk.c('div', el.taskbar, 'tasknest');
            const lefttb = tk.c('div', tasknest, 'tnav auto');
            el.startbutton = tk.cb('b1', 'Apps', () => startmenu(), lefttb);
            el.tr = tk.c('div', lefttb);
            if (sys.nvol === 0) el.contb.classList.toggle('silentbtn');
            if (sys.mobui === true) {
                el.taskbar.style.boxShadow = "none";
                el.menubar.style.boxShadow = "none";
            }
            setTimeout(async function () {
                if (window.navigator.standalone === true) {
                    const ok = await fs.read('/system/standalonepx');
                    let px = 0;
                    if (!ok) {
                        wd.tbcal();
                    } else {
                        if (px > 50 || px < 0) {
                            await fs.del('/system/standalone');
                            px = 0;
                            wd.tbcal();
                            return;
                        }
                        px = ok;
                        if (px !== 0) {
                            el.taskbar.style.borderRadius = "var(--rad1)";
                        }
                        el.taskbar.style.bottom = px + "px";
                    }
                }
                el.tbpos = el.taskbar.getBoundingClientRect();
                el.mbpos = el.menubar.getBoundingClientRect();
                ui.cv('menubarheight', el.mbpos.height + "px");
                ui.cv('hawktuah', el.tbpos.height + 12 + "px");
                const uid2 = params.get('id');
                if (type !== "min") {
                    setTimeout(wd.hawktuah, 300);
                    if (!uid2) {
                        el.startbutton.click();
                    }
                }
                if (uid2) {
                    app.webcomm.init(true, uid2);
                    const newURL = window.location.origin;
                    history.pushState(null, '', newURL);
                }
            }, 900);
        }
        if (waitopt === "wait") {
            setTimeout(function () { desktopgo(); }, 340);
        } else {
            desktopgo();
        }
    },
    clock: function () {
        const currentTime = new Date();
        let hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedHours = `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedTime = sys.seconds
            ? `${formattedHours}:${formattedMinutes}:${currentTime.getSeconds().toString().padStart(2, '0')} ${ampm}`
            : `${formattedHours}:${formattedMinutes} ${ampm}`;
        const elements = document.getElementsByClassName("time");
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerText = formattedTime;
        }
    },
    finishsetup: function (name, div1, div2) {
        ui.sw2(div1, div2); ui.masschange('name', name); fs.write('/user/info/name', name); fs.write('/system/info/setuptime', Date.now()); fs.write('/system/info/setupver', abt.ver);
    },
    reboot: function () {
        ui.show(tk.g('death'), 140);
        setTimeout(function () {
            if (window.location.href.includes('echodesk')) {
                window.location.reload();
            } else {
                window.location.href = window.location.origin;
            }
        }, 140);
    },
    dark: function (fucker) {
        ui.cv('ui1', 'rgb(30, 30, 30, 0.5)');
        ui.cv('ui2', '#1a1a1a');
        ui.cv('ui3', '#2a2a2a');
        ui.cv('bc', 'rgb(36, 36, 36, 0.5)');
        ui.cv('font', '#fff');
        ui.cv('inv', '1.0');
        if (fucker !== "nosave") {
            fs.write('/user/info/lightdark', 'dark');
        }
        ui.light = false;
    },
    light: function (fucker) {
        ui.cv('ui1', 'rgb(255, 255, 255, 0.5)');
        ui.cv('ui2', '#ffffff');
        ui.cv('ui3', '#ededed');
        ui.cv('bc', 'rgb(204, 204, 204, 0.5)');
        ui.cv('font', '#000');
        ui.cv('inv', '0');
        if (fucker !== "nosave") {
            fs.write('/user/info/lightdark', 'light');
        }
        ui.light = true;
    },
    clearm: function (fucker) {
        ui.cv('ui1', 'rgb(255, 255, 255, 0.2)');
        ui.cv('ui2', 'rgba(var(--accent), 0.1)');
        ui.cv('ui3', 'rgba(var(--accent) 0.2)');
        ui.cv('bc', 'rgb(255, 255, 255, 0)');
        ui.cv('font', '#000');
        ui.cv('inv', '0');
        if (fucker !== "nosave") {
            fs.write('/user/info/lightdark', 'clear');
        }
        ui.light = true;
    },
    clearm2: function (fucker) {
        wd.clearm();
        ui.cv('font', '#fff');
        if (fucker !== "nosave") {
            fs.write('/user/info/lightdark', 'clear2');
        }
        ui.light = false;
    },
    notifsrc: async function (src, play) {
        sys.notifsrc = src;
        await fs.write('/user/info/notifsrc', src);
        if (play === true) {
            ui.play(src);
            wm.snack('Saved', 1500);
            await fs.del('/user/info/cnotifurl');
        }
    },
    timec: function (id) {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = new Date(id);

            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: timeZone
            };

            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedParts = formatter.formatToParts(date);
            const month = formattedParts.find(part => part.type === 'month').value;
            const day = formattedParts.find(part => part.type === 'day').value;
            const year = formattedParts.find(part => part.type === 'year').value;
            const hour = formattedParts.find(part => part.type === 'hour').value;
            const minute = formattedParts.find(part => part.type === 'minute').value;
            const ampm = formattedParts.find(part => part.type === 'dayPeriod').value;

            return `${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`;
        } catch (error) {
            return "Unknown";
        }
    },
    timed: function (id) {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = new Date(id);

            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: timeZone
            };

            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedParts = formatter.formatToParts(date);

            const month = formattedParts.find(part => part.type === 'month').value;
            const day = formattedParts.find(part => part.type === 'day').value;
            const year = formattedParts.find(part => part.type === 'year').value;

            return `${month} ${day}, ${year}`;
        } catch (error) {
            return "Unknown";
        }
    },
    timecs: function (id) {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = new Date(id);

            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: timeZone
            };

            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedParts = formatter.formatToParts(date);

            const month = formattedParts.find(part => part.type === 'month').value;
            const day = formattedParts.find(part => part.type === 'day').value;
            const year = formattedParts.find(part => part.type === 'year').value;
            const hour = formattedParts.find(part => part.type === 'hour').value;
            const minute = formattedParts.find(part => part.type === 'minute').value;
            const ampm = formattedParts.find(part => part.type === 'dayPeriod').value;

            return `${hour}:${minute}${ampm}`;
        } catch (error) {
            return "Unknown";
        }
    },
    reorg: function (element) {
        const buttons = Array.from(element.querySelectorAll('button'));
        buttons.sort((a, b) => a.textContent.localeCompare(b.textContent));
        element.innerHTML = '';
        let currentLetter = '';

        buttons.forEach(button => {
            const firstLetter = button.textContent.charAt(0).toUpperCase();
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
            }

            element.appendChild(button);
        });
    },
    fakedown: async function (obj) {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                await wd.fakedown(item);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key of Object.keys(obj)) {
                if (key === 'ver') {
                    obj[key] = 1.0;
                } else {
                    await wd.fakedown(obj[key]);
                }
            }
        }
        console.log(JSON.stringify(obj, null, 4));
        await fs.write('/system/apps.json', JSON.stringify(obj, null, 4));
    },
    newid: async function () {
        const sigma = gen(7);
        await fs.write('/system/deskid', sigma);
        return sigma;
    },
    fullscreen: async function () {
        if (document.fullscreenElement) {
            sys.full = false;
            document.exitFullscreen();
        } else {
            sys.full = true;
            document.documentElement.requestFullscreen();
        }
    },
    download: function (file, fileName) {
        let downloadLink = document.createElement('a');
        let url;

        if (typeof file === 'string' && file.startsWith('data:')) {
            url = file;
        } else if (file instanceof File || file instanceof Blob) {
            url = URL.createObjectURL(file);
        } else if (typeof file === 'string') {
            const blob = new Blob([file], { type: 'text/plain' });
            url = URL.createObjectURL(blob);
        } else {
            const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
            url = URL.createObjectURL(blob);
        }

        downloadLink.href = url;
        downloadLink.download = fileName || file.name || 'download';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        if (file instanceof Blob || file instanceof File || url.startsWith('blob:')) {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    },
    smft: function () {
        ui.cv('fz4', '10px');
        ui.cv('fz3', '11px');
        ui.cv('fz2', '12px');
        ui.cv('fz1', '13px');
    },
    meft: function () {
        ui.cv('fz4', '12px');
        ui.cv('fz3', '13px');
        ui.cv('fz2', '14px');
        ui.cv('fz1', '15px');
    },
    bgft: function () {
        ui.cv('fz4', '13px');
        ui.cv('fz3', '14px');
        ui.cv('fz2', '15px');
        ui.cv('fz1', '17px');
    },
    loadapps: async function (inapp, onlineApps, apps) {
        const onlineApp = onlineApps.find(app => app.appid === inapp.appid);
        if (onlineApp === undefined) {
            if (sys.dev === true) {
                const fucker = await fs.read(inapp.exec);
                eval(fucker);
            } else {
                wm.notif(inapp.name + ` isn't recognized`, `This app has been blocked for safety. For options, hit "Open".`, function () {
                    const thing = tk.c('div', document.body, 'cm');
                    tk.p(`This app isn't on the App Market, so it's been blocked.`, undefined, thing);
                    tk.p(`If you didn't add this, consider erasing WebDesk, as it could be a virus. If you don't want to, just remove it.`, undefined, thing);
                    tk.cb('b1 b2', 'Remove ' + inapp.name, async function () {
                        const data = await fs.read('/system/apps.json');
                        const parsed = JSON.parse(data);
                        const updatedApps = parsed.filter(item => item.appid !== inapp.appid);
                        const updatedData = JSON.stringify(updatedApps);
                        await fs.write('/system/apps.json', updatedData);
                        await fs.del(inapp.exec);
                        await wd.reboot();
                    }, thing);
                    tk.cb('b1', 'Close', function () {
                        ui.dest(thing);
                    }, thing);
                });
            }
        } else {
            if (onlineApp.ver === inapp.ver && sys.fucker === false) {
                console.log(`<i> ${inapp.name} is up to date (${inapp.ver} = ${onlineApp.ver})`);
                const fucker = await fs.read(inapp.exec);
                if (fucker) {
                    eval(fucker);
                } else {
                    fs.del('/system/apps.json');
                    fs.delfold('/system/apps');
                    wm.notif('App Issues', 'All apps were uninstalled due to corruption or an update. Your data is safe, you can reinstall them anytime.', () => app.appmark.init(), 'App Market');
                    sys.fucker = true;
                    return;
                }
            } else {
                const remove = apps.filter(item => item.appid !== inapp.appid);
                const removed = JSON.stringify(remove);
                fs.write('/system/apps.json', removed);
                app.appmark.create(onlineApp.path, onlineApp, true);
                console.log(`<!> ${inapp.name} was updated (${inapp.ver} --> ${onlineApp.ver})`);
            }
        }
    },
    perfmon: function () {
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                if (memoryUsage > 0.75) {
                    app.ach.unlock(`Time to make the chimichangas!`, `Quite literally, if your device gets that hot.`);
                    wm.notif(`STOP WHATEVER YOU'RE DOING`, `WebDesk is going to crash due to overuse of resources, or it will start deleting things from memory.`);
                }
            }, 4000);
        }
    },
    seasonal: function () {
        const today = new Date();
        if (today.getMonth() === 9 && today.getDate() === 31) {
            ui.crtheme('#694700');
            wd.dark();
            wm.notif(`Happy Halloween!`, `To those who celebrate it. If you don't like the color, you can use the default.`, function () {
                wd.defaultcolor();
            }, 'Set defaults');
        } else if (today.getMonth() === 11 && today.getDate() === 25) {
            ui.crtheme('#00412A');
            wd.dark();
            wm.notif(`Merry Christmas!`, `To those who celebrate it. If you don't like the color, you can use the default.`, function () {
                wd.defaultcolor();
            }, 'Set defaults');
        } else {
            wd.defaultcolor();
        }
    },
    savecity: async function (city2) {
        if (!city2) {
            const ipinfoResponse = await fetch('https://ipinfo.io/json');
            const ipinfoData = await ipinfoResponse.json();
            const city = ipinfoData.city;
            const region = ipinfoData.region;
            const country = ipinfoData.country;
            const unit = (country === 'US') ? 'Imperial' : 'Metric';

            return {
                location: `${region}, ${country}`,
                unit: unit,
            }
        } else {
            const unit = (city2.endsWith('US') || city2.endsWith('USA') || city2.endsWith('America')) ? 'Imperial' : 'Metric';
            return {
                location: `${city2}`,
                unit: unit,
            }
        }
    },
    defaultcolor: function () {
        ui.crtheme('#4D79FF');
        wd.light();
    },
    wetter: function (setdefault) {
        const main = tk.c('div', document.body, 'cm');
        tk.img('./assets/img/setup/location.svg', 'setupi', main);
        const menu = tk.c('div', main);
        const info = tk.c('div', main, 'hide');
        tk.p('Allow WebDesk to access your state/region for weather processing?', 'bold', menu);
        tk.p('Your data is processed by OpenWeatherMap & IPInfo, and is only visible to you. This can be changed in Settings later.', undefined, menu);
        tk.p('If you deny, your location will be set to Paris, France.', undefined, menu);
        if (setdefault === false) {
            tk.cb('b1', 'Cancel', async function () {
                ui.dest(main);
            }, menu);
        } else {
            tk.cb('b1', 'Deny', async function () {
                await fs.write('/user/info/location.json', [{ city: 'Paris, France', unit: 'Metric', lastupdate: Date.now(), default: true }]);
                ui.dest(main);
            }, menu);
        }
        tk.cb('b1', 'More Info', async function () {
            ui.sw2(menu, info);
        }, menu);
        tk.cb('b1', 'Allow', async function () {
            try {
                const data = await wd.savecity();
                await fs.write('/user/info/location.json', [{ city: data.location, unit: data.unit, lastupdate: Date.now(), default: false }]);
                sys.city = data.location;
                sys.unit = data.unit;
                if (sys.unit === "Metric") {
                    sys.unitsym = "°C";
                } else {
                    sys.unitsym = "°F";
                }
                sys.defaultloc = false;
                sys.loclast = Date.now();
                ui.dest(main);
            } catch (error) {
                const skibidi = tk.c('div', main, 'hide');
                ui.sw2(menu, skibidi);
                tk.p(`An error occured`, 'bold', skibidi);
                tk.p(`This is probably due to extensions like uBlock origin. You probably can't bother disabling them, so enter your city manually.`, undefined, skibidi);
                const inp = tk.c('input', skibidi, 'i1');
                inp.placeholder = "Location e.g. Paris, France";
                if (setdefault === false) {
                    tk.cb('b1', 'Cancel', async function () {
                        ui.dest(main);
                    }, menu);
                } else {
                    tk.cb('b1', 'Deny', async function () {
                        await fs.write('/user/info/location.json', [{ city: 'Paris, France', unit: 'Metric', lastupdate: Date.now(), default: true }]);
                        ui.dest(main);
                    }, menu);
                }
                tk.cb('b1', 'Set City', async function () {
                    const data = await wd.savecity(inp.value);
                    await fs.write('/user/info/location.json', [{ city: data.location, unit: data.unit, lastupdate: Date.now(), default: false }]);
                    sys.city = data.location;
                    sys.unit = data.unit;
                    if (sys.unit === "Metric") {
                        sys.unitsym = "°C";
                    } else {
                        sys.unitsym = "°F";
                    }
                    sys.defaultloc = false;
                    sys.loclast = Date.now();
                    ui.dest(main);
                }, skibidi);
            }
        }, menu);
        tk.p('How this works', 'bold', info);
        tk.p(`IPInfo finds your city via your IP address. After this, your city is fed into OpenWeatherMap for weather details.`, undefined, info);
        tk.p('None of your data is viewable or visible to anyone else but you. ', undefined, info);
        tk.cb('b1 b2', `OpenWeatherMap's website`, async function () {
            window.open('https://openweathermap.org', '_blank');
        }, info);
        tk.cb('b1 b2', `IPInfo's website`, async function () {
            window.open('https://ipinfo.io', '_blank');
        }, info);
        tk.cb('b1', 'Back', async function () {
            ui.sw2(info, menu);
        }, info);
    },
    hawktuah: async function (skibidi) {
        const hawk = await fs.read('/system/info/currentver');
        if (hawk !== abt.ver || skibidi === true) {
            await fs.write('/system/info/currentver', abt.ver);
            const win = tk.mbw('Changelog', '300px', '390px', true);
            const div = tk.c('div', win.main, 'embed nest');
            const response = await fetch('./assets/other/changelog.html');
            const tuah = await response.text();
            div.style.height = "100%";
            div.style.maxHeight = "100%";
            div.innerHTML = tuah;
        }
    },
    chokehold: function () {
        return new Promise(resolve => {
            sys.resume = resolve;
        });
    },
    fontsw: async function (normal, medium, bold, mono) {
        const existingStyle = document.getElementById('dynamic-font');
        if (existingStyle) {
            existingStyle.remove();
        }

        const normalFont = await fs.read(normal);
        const mediumFont = await fs.read(medium);
        const boldFont = await fs.read(bold);
        const monoFont = await fs.read(mono);        
    
        const normalBlob = URL.createObjectURL(new Blob([normalFont], { type: 'font/woff2' }));
        const mediumBlob = URL.createObjectURL(new Blob([mediumFont], { type: 'font/woff2' }));
        const boldBlob = URL.createObjectURL(new Blob([boldFont], { type: 'font/woff2' }));
        const monoBlob = URL.createObjectURL(new Blob([monoFont], { type: 'font/woff2' }));
    
        // Create a new style element with updated font definitions
        const style = document.createElement('style');
        style.id = 'dynamic-font';
        style.innerHTML = `
            @font-face {
                font-family: 'Font';
                src: url(${normalBlob});
            }
            
            @font-face {
                font-family: 'FontB';
                src: url(${boldBlob});
            }
            
            @font-face {
                font-family: 'FontM';
                src: url(${mediumBlob});
            }
            
            @font-face {
                font-family: 'MonoS';
                src: url(${monoBlob});
            }
    
            /* Update the font-family for body or other elements */
            body {
                font-family: 'Font', sans-serif;
            }
        `;
        document.head.appendChild(style);
    },    
    tbcal: async function () {
        let px = 0;
        const ok = await fs.read('/system/standalonepx');
        if (ok) {
            px = ok;
            el.taskbar.style.bottom = px + "px";
        }
        const div = tk.c('div', document.body, 'cm');
        tk.p('Calibrate app bar', 'bold', div);
        tk.p('Some devices have UI elements that cut off the app bar.', undefined, div);
        tk.p('This tool lets you adjust the positioning of the app bar.', undefined, div);
        tk.p('Tap the Increase or Decrease buttons to move the app bar.', undefined, div);
        tk.cb('b1 b2', 'Done', async function () {
            ui.dest(div);
        }, div);
        tk.cb('b1', 'Increase', async function () {
            if (px > 50) return;
            px += 2;
            el.taskbar.style.bottom = px + "px";
            await fs.write('/system/standalonepx', px);
        }, div);
        tk.cb('b1', 'Decrease', async function () {
            if (px < 0) return;
            px -= 2;
            el.taskbar.style.bottom = px + "px";
            await fs.write('/system/standalonepx', px);
        }, div);
    }
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        app.lockscreen.init();
    }
});

let wakelocked = false;
document.addEventListener('mousedown', async function (event) {
    wakelockgo();
});

setTimeout(function () {
    tk.g('background').addEventListener('mousedown', async function (event) {
        if (el.am || el.sm || el.cc) {
            ui.dest(el.am, 40); ui.dest(el.cc, 40);
            setTimeout(function () {
                ui.dest(el.sm, 140);
                el.sm = undefined;
            }, 0);
            el.am = undefined; el.cc = undefined;
        }
    });
}, 100);

async function wakelockgo() {
    if (wakelocked === false) {
        wakelocked = true;
        let wakeLock = null;
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            console.log('<i> WakeLock started');
        } catch (err) {
            wm.notif(`WebDesk wasn't able to wake-lock`, 'Your DeskID might disconnect if WebDesk is left inactive.');
        }
    }
}

wd.clock();
setInterval(wd.clock, 1000);