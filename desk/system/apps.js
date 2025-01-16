var app = {
    wetter: {
        runs: true,
        name: 'Weather',
        init: async function (archive, file) {
            const win = tk.mbw('Weather', 'auto', 'auto', true, undefined, undefined);
            win.win.style.minWidth = "210px;"
            /* const canvas = tk.c('canvas', document.body);
            canvases.snow(canvas);
            canvas.style.width = "100%";
            canvas.style.display = "block";
            win.closebtn.addEventListener('mousedown', function () {
                ui.dest(canvas);
            }); */
            if (sys.mobui === false) {
                win.win.style.maxWidth = "330px";
            }
            win.main.innerHTML = "Loading...";
            async function refresh() {
                try {
                    let response;
                    let info;
                    let unitsym = sys.unitsym;
                    if (archive !== true) {
                        response = await fetch(`https://weather.meower.xyz/json?city=${sys.city}&units=${sys.unit}`);
                        info = await response.json();
                    } else {
                        info = await JSON.parse(file);
                    }
                    win.main.innerHTML = "";
                    const skibidi = tk.c('div', win.main);
                    if (archive !== true) {
                        tk.p(`${sys.city}`, 'med', skibidi);
                        win.name.innerHTML = "";
                        tk.cb('b3', 'Archive data', async function () {
                            const the = await app.files.pick('new', 'Save weather archive file... (JSON)');
                            const silly = info;
                            silly.timestamp = Date.now();
                            await fs.write(the + ".json", silly);
                            wm.snack('Saved weather to ' + the + ".json");
                        }, win.name);
                    } else {
                        if (archive !== true) {
                            tk.p(`${sys.city}`, 'med', skibidi);
                        } else {
                            if (info.sys.country !== "US") {
                                unitsym = "°C";
                            } else {
                                unitsym = "°F";
                            }
                            tk.p(`${info.name}, ${info.sys.country}`, 'med', skibidi);
                        }
                        tk.ps('Archived: ' + wd.timec(info.timestamp), undefined, skibidi);
                    }
                    const userl = tk.c('div', skibidi, 'list flexthing');
                    const tnav = tk.c('div', userl, 'tnav');
                    const title = tk.c('div', userl, 'title');
                    tnav.style.marginLeft = "6px";
                    userl.style.marginBottom = "6px";
                    tnav.innerText = `${Math.ceil(info.main.temp)}${unitsym}, ${info.weather[0].description}`;
                    const img = tk.img('', 'weatheri', title);
                    title.style.maxHeight = "40px";
                    img.src = `https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`;
                    tk.p(`Humidity ${archive = archive === true ? "was" : "is"} ${info.main.humidity}%, and it ${archive = archive === true ? "felt" : "feels"} like ${Math.ceil(info.main.feels_like)}${sys.unitsym}.`, undefined, skibidi);
                    tk.p(`Data from <a href="https://openweathermap.org", target="_blank">OpenWeatherMap.</a>`, 'smtxt', skibidi);
                    tk.cb('b1', 'Settings', () => app.locset.init(), skibidi);
                    tk.cb('b1', 'Refresh', function () {
                        refresh(); wm.snack('Refreshed');
                    }, skibidi);
                    if (sys.dev === true) {
                        tk.cb('b1', 'JSON', async function () {
                            const ok = JSON.stringify(info);
                            app.textedit.init(ok, undefined, true);
                        }, skibidi);
                    }
                } catch (error) {
                    console.log(error);
                    win.main.innerHTML = "<p>Error loading weather.</p>";
                    tk.cb('b1', 'Close', () => wm.close(win.win), win.main);
                    tk.cb('b1', 'Retry', () => refresh(), win.main);
                }
            }

            await refresh();
        }
    },
    echoclient: {
        runs: true,
        name: 'EchoDesk',
        init: async function () {
            const win = tk.mbw('EchoDesk', '300px', 'auto', true, undefined, undefined);
            if (sys.guest === true) {
                tk.p(`Enter the EchoDesk ID and hit either of the "Connect" buttons. <span class="bold">You're in Guest mode, so you can't enter EchoDesk mode.</span>`, undefined, win.main);
            } else {
                tk.p(`If you're connecting: Enter the EchoDesk ID and hit either of the "Connect" buttons.`, undefined, win.main);
                tk.p(`If you're the host: Hit "Enter EchoDesk Mode". Your apps will close, unsaved data will be lost.`, undefined, win.main);
                tk.cb('b1 b2', 'Enter EchoDesk mode', async function () {
                    await fs.write('/system/migval', 'echo');
                    wd.reboot();
                }, win.main);
            }
            tk.p(`Connect to other WebDesk`, undefined, win.main);
            const input = tk.c('input', win.main, 'i1');
            input.placeholder = "Enter EchoDesk ID";
            tk.cb('b1 b2', 'Connect in New Tab', async function () {
                window.open("./echodesk.html?deskid=" + input.value, '_blank');
            }, win.main);
            tk.cb('b1 b2', 'Connect Normally', async function () {
                app.browser.view("./echodesk.html?deskid=" + input.value);
            }, win.main);
        }
    },
    ach: {
        runs: true,
        name: 'Achievements',
        init: async function () {
            async function load() {
                try {
                    const data = await fs.read('/user/info/achieve.json');
                    if (data) {
                        const parsed = JSON.parse(data);
                        let yeah = 0;
                        parsed.forEach((entry) => {
                            const notif = tk.c('div', win.main, 'notif2');
                            tk.p(entry.name, 'bold', notif);
                            tk.p(entry.cont, undefined, notif);
                            tk.p(`Unlocked on ${wd.timec(entry.time)}`, undefined, notif);
                            yeah++
                        });
                        const elements = document.getElementsByClassName("achcount");
                        for (let i = 0; i < elements.length; i++) {
                            elements[i].innerText = yeah;
                        }
                    } else {
                        await fs.write('/user/info/achieve.json', [{ name: "First Achievement", cont: "Unlock a WebDesk achievement", time: Date.now() }]);
                        await load();
                    }
                } catch (error) {
                    console.log('<!> Achievements shat itself: ', error);
                    return null;
                }
            }

            const win = tk.mbw('Achievements', '300px', 'auto', true, undefined, undefined);
            if (sys.mobui === false) {
                win.win.style.maxHeight = "60%";
            }
            tk.p(`WebDesk Achievements`, 'h2', win.main);
            tk.p(`Remember: These are jokes and don't actually do anything`, undefined, win.main);
            tk.p(`Unlocked <span class="bold achcount"></span> achievements`, undefined, win.main);
            await load();
        },
        unlock: async function (name, content) {
            try {
                const data = await fs.read('/user/info/achieve.json');
                if (data) {
                    const newen = { name: name, cont: content, time: Date.now() };
                    const jsondata = JSON.parse(data);
                    const check = jsondata.some(entry => entry.name === newen.name);
                    const check2 = jsondata.some(entry => entry.cont === newen.cont);
                    if (check !== true && check2 !== true) {
                        wm.notif(`Achieved: ` + name, content, () => app.ach.init());
                        jsondata.push(newen);
                        fs.write('/user/info/achieve.json', jsondata);
                    }
                } else {
                    await fs.write('/user/info/achieve.json', [{ name: "First Achievement", cont: "Unlock a WebDesk achievement", time: Date.now() }]);
                    await app.ach.unlock(name, content);
                }
            } catch (error) {
                console.log('<!> Achievements shat itself: ', error);
                return null;
            }
        }
    },
    contacts: {
        runs: false,
        name: 'Contacts',
        init: async function () {
            let ok;
            function reload() {
                ui.dest(win.win, 20);
                ui.dest(win.tbn, 0);
                app.contacts.init();
            }
            async function load() {
                try {
                    const data = await fs.read('/user/info/contactlist.json');
                    if (data) {
                        ok = JSON.parse(data);
                        ok.forEach((entry) => {
                            const notif = tk.c('div', win.main, 'notif2');
                            tk.ps(entry.name, 'bold', notif);
                            if (entry.deskid2) {
                                tk.ps(`DeskID: ${entry.deskid} | DeskID 2: ${entry.deskid2}`, undefined, notif);
                            } else {
                                tk.ps(`DeskID: ${entry.deskid} | DeskID 2: Not set`, undefined, notif);
                            }
                            tk.cb('b4', 'Remove', async function () {
                                const update = ok.filter(item => item.time !== entry.time);
                                const updated = JSON.stringify(update);
                                await fs.write('/user/info/contactlist.json', updated);
                                ui.slidehide(notif);
                                ui.dest(notif);
                                ok = update;
                            }, notif);
                            tk.cb('b4', 'Edit', async function () {
                                const update = ok.find(item => item.time === entry.time);
                                const menu = tk.c('div', document.body, 'cm');
                                tk.p(`Edit Contact`, 'bold', menu);
                                const name = tk.c('input', menu, 'i1');
                                name.placeholder = "User's username";
                                if (update && update.name) name.value = update.name;
                                const deskid = tk.c('input', menu, 'i1');
                                deskid.placeholder = "User's default/main DeskID";
                                if (update && update.deskid) deskid.value = update.deskid;
                                const deskid2 = tk.c('input', menu, 'i1');
                                deskid2.placeholder = "Second ID if first is offline";
                                if (update && update.deskid2) deskid2.value = update.deskid2;
                                tk.cb('b1', 'Close', () => ui.dest(menu), menu);
                                tk.cb('b1', 'Save', async function () {
                                    const updatedData = ok.filter(item => item.time !== entry.time);
                                    const newEntry = {
                                        deskid: deskid.value,
                                        name: name.value,
                                        time: Date.now()
                                    };
                                    if (deskid2.value) newEntry.deskid2 = deskid2.value;
                                    updatedData.push(newEntry);
                                    await fs.write('/user/info/contactlist.json', updatedData);
                                    ui.dest(menu);
                                    reload();
                                }, menu);
                            }, notif);
                        });
                    } else {
                        await fs.write('/user/info/contactlist.json', '[]');
                        await load();
                    }
                } catch (error) {
                    console.log('<!> Contacts shat itself: ', error);
                    return null;
                }
            }

            const win = tk.mbw('Contacts', '300px', 'auto', true, undefined, undefined);
            tk.cb('b1 b2', 'Add Contact', function () {
                const menu = tk.c('div', document.body, 'cm');
                const name = tk.c('input', menu, 'i1');
                name.placeholder = "User's name";
                const deskid = tk.c('input', menu, 'i1');
                deskid.placeholder = "User's default DeskID";
                const deskid2 = tk.c('input', menu, 'i1');
                deskid2.placeholder = "User's second DeskID";
                tk.cb('b1', 'Close', () => ui.dest(menu), menu);
                tk.cb('b1', 'Save', async function () {
                    const newEntry = {
                        deskid: deskid.value,
                        name: name.value,
                        time: Date.now()
                    };
                    const update = ok.find(item => item.deskid === newEntry.deskid);
                    console.log(update);
                    if (update !== undefined) {
                        wm.snack('Already saved that person');
                    } else {
                        if (deskid2.value) newEntry.deskid2 = deskid2.value;
                        ok.push(newEntry);
                        await fs.write('/user/info/contactlist.json', ok);
                        ui.dest(menu);
                        reload();
                    }
                }, menu);
            }, win.main);
            await load();
        },
    },
    placeholder: {
        init: function () { wm.snack('I do nothing.'); } // Placeholder for container
    },
    browser: {
        runs: true,
        name: 'Browser (beta)',
        init: async function (path2) {
            tk.css('./assets/lib/browse.css');
            const win = tk.mbw('Browser', '70vw', '74vh');
            const tabs = tk.c('div', win.main, 'tabbar d');
            const btnnest = tk.c('div', tabs, 'tnav');
            const okiedokie = tk.c('div', tabs, 'browsertitle');
            const searchbtns = tk.c('div', okiedokie, 'tnav');
            btnnest.appendChild(win.winbtns);
            win.closebtn.style.marginLeft = "4px";
            win.winbtns.style.marginBottom = "3px";
            win.title.remove();
            let thing = [];
            let currentTab = tk.c('div', win.main, 'hide');
            let currentBtn = tk.c('div', win.main, 'hide');
            let currentName = tk.c('div', win.main, 'hide');
            win.main.classList = "browsercont";
            const searchInput = tk.c('input', okiedokie, 'i1 b6');
            function addtab(ok) {
                const tab = tk.c('embed', win.main, 'browsertab browserREALtab');
                if (ok) {
                    tab.src = ok;
                } else {
                    tab.src = "https://meower.xyz";
                }
                ui.sw2(currentTab, tab, 100);
                currentTab = tab;
                let lastUrl = "";
                const urls = [];
                thing = [...urls];

                const tabBtn = tk.cb('b4 browserpad', '', function () {
                    ui.sw2(currentTab, tab, 100);
                    currentTab = tab;
                    currentBtn = tabTitle;
                    thing = [...urls];
                }, win.winbtns);
                const tabTitle = tk.c('span', tabBtn);
                if (ok) {
                    tabTitle.innerText = ok;
                } else {
                    tabTitle.innerText = "meower.xyz";
                }
                currentName = tabTitle;
                currentBtn = tabTitle;

                const closeTabBtn = tk.cb('browserclosetab', 'x', function () {
                    ui.dest(tabBtn);
                    ui.dest(currentTab);
                }, tabBtn);
                setInterval(function () {
                    const currentUrl = currentTab.src;
                    if (currentUrl !== lastUrl) {
                        lastUrl = currentUrl;
                        urls.push(currentUrl);
                        thing = [...urls];
                        searchInput.innerText = currentUrl;
                        currentName.innerText = currentUrl;
                    }
                }, 200);
            }

            tk.cb('b4 b6', '+', () => addtab(), searchbtns);
            tk.cb('b4 b6', '⟳', function () {
                currentTab.src = currentTab.src;
            }, searchbtns);
            tk.cb('b4 b6', '<', function () {
                if (thing.length > 1) {
                    const currentIndex = thing.indexOf(currentTab.src);
                    if (currentIndex > 0) {
                        const li = thing[currentIndex - 1];
                        searchInput.value = li;
                        currentTab.src = li;
                        currentName.innerText = li;
                    }
                }
            }, searchbtns);
            tk.cb('b4 b6', '>', function () {
                if (thing.length > 1) {
                    const currentIndex = thing.indexOf(currentTab.src);
                    if (currentIndex < thing.length - 1) {
                        const li = thing[currentIndex + 1];
                        searchInput.value = li;
                        currentTab.src = li;
                        currentName.innerText = li;
                    }
                }
            }, searchbtns);
            searchInput.placeholder = "Enter URL";
            tk.cb('b4 b6', 'Go!', function () {
                if (searchInput.value.includes('https://')) {
                    currentTab.src = searchInput.value;
                } else {
                    currentTab.src = "https://" + searchInput.value;
                }
                currentBtn.innerText = searchInput.value;
                if (searchInput.value.includes('porn') || searchInput.value.includes('e621') || searchInput.value.includes('rule34') || searchInput.value.includes('r34') || searchInput.value.includes('xvideos') || searchInput.value.includes('c.ai') || searchInput.value.includes('webtoon')) {
                    app.ach.unlock('The Gooner', `We won't judge — we promise.`);
                } else if (searchInput.value.includes(window.origin)) {
                    app.ach.unlock('Webception!', `Just know that the other WebDesk will probably end up erased.`);
                }
            }, okiedokie);

            setTimeout(function () {
                if (typeof path2 === "string") {
                    addtab(path2);
                } else {
                    addtab();
                }
            }, 250);
            wd.win();
        },
        view: async function (path2, title, background) {
            tk.css('./assets/lib/browse.css');
            if (title === undefined) {
                title = "Embedder";
            } else {
                title = title;
            }
            const win = tk.mbw(title, '640px', '440px');
            const tab = tk.c('embed', win.main, 'browsertab browserREALtab');
            win.main.classList = "browsercont";
            win.name.innerHTML = "";
            if (background === false) {
                tab.style.background = "rgba(0, 0, 0, 0)";
            }
            tk.cb('b4 b6', '⟳', function () {
                tab.src = tab.src;
            }, win.name);
            setTimeout(function () {
                if (path2) {
                    tab.src = path2;
                } else {
                    tab.src = "https://meower.xyz";
                }
                ui.show(tab, 0);
            }, 250);
            wd.win();
            return tab;
        }
    },
    webcall: {
        runs: false,
        init: async function (deskid, name) {
            const win = tk.mbw('WebCall', '260px', 'auto', true, undefined, undefined);
            const callStatus = tk.p(`Connecting...`, undefined, win.main);
            let oncall = false;
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                remotePeerId = deskid;
                const call = sys.peer.call(remotePeerId, stream);
                callStatus.textContent = 'Waiting for answer...';
                app.webcomm.add(call.peer, name);
                setTimeout(() => {
                    if (!oncall) {
                        callStatus.textContent = `Other person didn't answer`;
                        call.close();
                    }
                }, 24000);

                call.on('stream', (remoteStream) => {
                    oncall = true;
                    ui.dest(win.tbn, 100);
                    ui.dest(win.win, 100);
                    app.webcall.answer(remoteStream, call, name, stream);
                });

                call.on('error', (err) => {
                    callStatus.textContent = 'Call failed: ' + err.message;
                });
            });
            const selfkill = win.closebtn.addEventListener('mousedown', function () {
                call.close();
                stream.getTracks().forEach(track => track.stop());
                selfkill.removeEventListener();
            });
        },
        answer: async function (remoteStream, call, name, fein) {
            const win = tk.mbw('WebCall', '250px', 'auto', true, undefined, undefined);
            const stat = tk.ps(`WebCall - ${name}`, undefined, win.main);
            const audioElement = tk.c('audio', win.main, 'hide');
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true;
            audioElement.controls = true;

            let isMuted = false;
            const remoteAudioTrack = fein.getAudioTracks()[0];

            const muteButton = tk.cb('b1', 'Mute', function () {
                if (remoteAudioTrack) {
                    if (isMuted) {
                        remoteAudioTrack.enabled = true;
                        muteButton.textContent = 'Mute';
                    } else {
                        remoteAudioTrack.enabled = false;
                        muteButton.textContent = 'Unmute';
                    }
                    isMuted = !isMuted;
                }
            }, win.main);

            function crashout() {
                call.close();
                fein.getTracks().forEach(track => track.stop());
                remoteStream.getTracks().forEach(track => track.stop());
                ui.dest(win.tbn, 100);
                ui.dest(win.win, 100);
            }

            audioElement.onended = () => {
                stat.textContent = 'Call ended.';
                crashout();
            };

            remoteStream.oninactive = () => {
                stat.textContent = 'Call ended.';
                crashout();
            };

            tk.cb('b1', 'End', () => crashout(), win.main);

            const selfkill = win.closebtn.addEventListener('mousedown', function () {
                crashout();
                selfkill.removeEventListener();
            });
        }
    },
};