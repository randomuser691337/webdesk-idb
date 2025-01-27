var app = {
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
};