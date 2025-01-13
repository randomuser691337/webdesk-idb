app['webcomm'] = {
    runs: true,
    name: 'WebComm',
    init: async function (isid, id) {
        let win;
        if (isid === true) {
            win = tk.mbw('WebComm (Autofilled)', '320px', 'auto', true);
        } else {
            win = tk.mbw('WebComm', '320px', 'auto', true);
        }
        const inp = tk.c('input', win.main, 'i1');
        inp.placeholder = "Enter a DeskID";
        if (isid === true) {
            inp.value = id;
            wm.snack('Autofilled DeskID', 3000);
        }
        const skibidiv = tk.c('div', win.main);
        let extraid = undefined;
        const dropbtn = tk.cb('b1', 'WebDrop', async function () {
            if (inp.value === sys.deskid) {
                wm.snack(`Type a DeskID that isn't yours.`);
                app.ach.unlock('So lonely...', 'So lonely, you tried calling yourself.');
            } else {
                const file = await app.files.pick(undefined, 'Select file to send');
                const menu2 = tk.c('div', document.body, 'cm');
                menu2.innerHTML = `<p class="bold">Sending file</p><p>Depending on the size, this might take a bit</p>`;
                tk.cb('b1', 'Close (No status updates)', () => ui.dest(menu2), menu2);

                const filecont = await fs.read(file);
                await custf(inp.value, file.substring(file.lastIndexOf('/') + 1), filecont).then(async success => {
                    await ptp.getname(inp.value)
                        .then(name => {
                            app.webcomm.add(inp.value, name);
                            menu2.innerHTML = success
                                ? `<p class="bold">WebDrop complete</p><p>The other person can accept or deny</p>`
                                : `<p class="bold">An error occurred</p><p>Make sure the ID is correct</p>`;

                            tk.cb('b1', 'Close', () => ui.dest(menu2), menu2);
                        })
                        .catch(error => {
                            if (extraid) {
                                wm.snack(`First ID failed, trying their second ID...`);
                                inp.value = extraid;
                                dropbtn.click();
                                extraid = undefined;
                            } else {
                                console.log(error);
                                wm.snack(`User isn't online or your Internet isn't working`);
                            }
                        });
                }, menu2);
            }
        }, win.main);
        const callbtn = tk.cb('b1', 'Voice Call', async function () {
            if (inp.value === sys.deskid) {
                wm.snack(`Type a DeskID that isn't yours.`);
                app.ach.unlock('So lonely...', 'So lonely, you tried calling yourself.');
            } else {
                await ptp.getname(inp.value)
                    .then(name => {
                        app.webcall.init(inp.value, name);
                    })
                    .catch(error => {
                        if (extraid) {
                            wm.snack(`First ID failed, trying their second ID...`);
                            inp.value = extraid;
                            callbtn.click();
                            extraid = undefined;
                        } else {
                            console.log(error);
                            wm.snack(`User isn't online or your Internet isn't working`);
                        }
                    });
            }
        }, win.main);
        const chatbtn = tk.cb('b1', 'Message', async function () {
            if (inp.value === sys.deskid) {
                wm.snack(`Type a DeskID that isn't yours.`);
                app.ach.unlock('So lonely...', 'So lonely, you tried messaging yourself.');
            } else {
                await ptp.getname(inp.value)
                    .then(name => {
                        app.webchat.init(inp.value, undefined, name);
                    })
                    .catch(error => {
                        if (extraid) {
                            wm.snack(`First ID failed, trying their second ID...`);
                            inp.value = extraid;
                            chatbtn.click();
                            extraid = undefined;
                        } else {
                            console.log(error);
                            wm.snack(`User isn't online or your Internet isn't working`);
                        }
                    });
            }
        }, win.main);
        async function ok() {
            const data = await fs.read('/user/info/contactlist.json');
            skibidiv.innerHTML = "";
            tk.cb('b3 b2 webcomm dash', 'Manage or edit contacts', () => app.contacts.init(), skibidiv);

            if (data) {
                const parsed = JSON.parse(data);
                const buttons = [];

                for (const entry of parsed) {
                    let btn;
                    if (entry.name === entry.deskid) {
                        btn = tk.cb('b3 b2 webcomm', entry.deskid, function () {
                            inp.value = entry.deskid;
                            if (entry.deskid2) extraid = entry.deskid2;
                        }, skibidiv);
                    } else {
                        btn = tk.cb('b3 b2 webcomm', entry.name + " - " + entry.deskid + " | Loading", function () {
                            inp.value = entry.deskid;
                            if (entry.deskid2) extraid = entry.deskid2;
                        }, skibidiv);
                    }

                    buttons.push({ btn, deskid: entry.deskid, deskid2: entry.deskid2 });
                }

                await Promise.all(
                    buttons.map(async ({ btn, deskid, deskid2 }) => {
                        try {
                            await ptp.getname(deskid);
                            btn.innerText = ui.filter(btn.innerText.slice(0, -9) + " | Online");
                        } catch (error) {
                            if (deskid2 !== undefined) {
                                try {
                                    await ptp.getname(deskid);
                                    btn.innerText = ui.filter(btn.innerText.slice(0, -9) + " | Online");
                                } catch (error) {
                                    btn.innerText = ui.filter(btn.innerText.slice(0, -10) + " | Offline");
                                }
                            } else {
                                btn.innerText = ui.filter(btn.innerText.slice(0, -10) + " | Offline");
                            }
                        }
                    })
                );
            }
        }
        const yeah = setInterval(() => ok(), 20000);
        await ok();
        win.closebtn.addEventListener('mousedown', function () {
            clearInterval(yeah);
        });
    },
    add: async function (deskid, name) {
        try {
            if (!name) {
                name = deskid;
            }
            const data = await fs.read('/user/info/contactlist.json');
            if (data) {
                const newen = { deskid: deskid, name: name, time: Date.now() };
                const jsondata = JSON.parse(data);
                const check = jsondata.some(entry => entry.deskid === newen.deskid);
                if (check !== true) {
                    jsondata.push(newen);
                    fs.write('/user/info/contactlist.json', jsondata);
                }
            } else {
                await fs.write('/user/info/contactlist.json', [{ deskid: deskid, name: name, time: Date.now() }]);
            }
        } catch (error) {
            console.log(`<!> Couldn't add contact: `, error);
            return null;
        }
    }
};