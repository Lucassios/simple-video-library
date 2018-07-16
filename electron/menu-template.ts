import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

const template: MenuItemConstructorOptions[] = [
{
    label: 'Application',
    submenu: [
      { role: 'about' },
      { role: 'quit' }
    ]
}, {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
}
];

export default template;
