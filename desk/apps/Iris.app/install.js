app['imgview'] = {
    runs: true,
    name: 'Iris',
    init: async function (contents) {
        const win = tk.mbw('Iris', '400px', 'auto', undefined, undefined, undefined);
        if (contents.includes('data:image')) {
            const container = tk.c('div', win.main);
            container.style.marginBottom = "4px";
            const img = tk.c('img', container, 'embed');
            img.src = contents;
            let cropperinstance = null;
            function cropbtn() {
                const cropButton = tk.cb('b1', 'Crop', function () {
                    if (!cropperinstance) {
                        cropButton.innerText = "Cancel";
                        cropperinstance = new Cropper(img);

                        const preview = tk.cb('b1', 'Preview', async function () {
                            const croppedimg = getCroppedImage();
                            app.imgview.init(croppedimg);
                        }, win.main);

                        const savebutton = tk.cb('b1', 'Save', async function () {
                            const croppedimg = getCroppedImage();
                            const skibidi = await app.files.pick('new', 'Save crop as');
                            await fs.write(skibidi + ".png", croppedimg);
                            wm.snack('Saved as ' + skibidi + ".png");
                            cropperinstance.destroy();
                            cropperinstance = null;
                            cropButton.innerText = "Crop";
                            savebutton.remove();
                            preview.remove();
                        }, win.main);

                        function getCroppedImage() {
                            const croppedCanvas = cropperinstance.getCroppedCanvas();
                            return croppedCanvas.toDataURL('image/png');
                        }
                    } else {
                        cropperinstance.destroy();
                        cropperinstance = null;
                        cropButton.innerText = "Crop";

                        const buttons = win.main.querySelectorAll('button');
                        buttons.forEach(button => {
                            if (button.innerText === "Save" || button.innerText === "Preview") {
                                button.remove();
                            }
                        });
                    }
                }, win.main);
            }

            win.closebtn.addEventListener('click', () => {
                if (cropperinstance) {
                    cropperinstance.destroy();
                    cropperinstance = null;
                }
            });
            cropbtn();
        } else if (contents.includes('data:video')) {
            const img = tk.c('video', win.main, 'embed');
            const src = tk.c('source', img);
            src.src = contents;
            img.controls = true;
        } else if (contents.includes('data:application/x-zip-')) {
            win.win.style.width = "300px";
            const base64Data = contents.split(',')[1];
            const binaryData = atob(base64Data);
            const uint8Array = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(uint8Array);
            tk.p('ZIP file', 'h2', win.main);
            tk.p(`ZIP files are read-only for the time being.`, undefined, win.main);
            let div = tk.c('div', win.main);
            zipContent.forEach((relativePath, zipEntry) => {
                tk.cb('flist', relativePath, async function () {
                    wm.snack('ZIP files are read-only for now.');
                }, div);
            });
        } else if (contents.includes('data:application/pdf')) {
            wm.notif(`WebDesk can't view PDFs`, 'Open PDF in a new tab?', () => window.open(contents, '_blank'), undefined, true);
        }
    }
};