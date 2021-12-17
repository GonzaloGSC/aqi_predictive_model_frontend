export const VersionSistema = {
    n_version: "1.0.7",
};

export var menuCont = {
    menu: null
};

export var comprobar = (urlActiva) => {

    let retorno = false;

    for (let i = 0; i < menuCont.menu.length; i++) {

        const element = menuCont.menu[i];

        if (element.children == null) {
            const url = '/pages/' + element.link;
            if (url == urlActiva) {
                retorno = true;
                i = menuCont.menu.length + 1;
            }

        } else {

            for (let x = 0; x < element.children.length; x++) {
                const element1 = element.children[x];

                const url = '/pages/' + element1.link;

                if (url == urlActiva) {

                    retorno = true;

                    x = element.children.length + 1;
                    i = menuCont.menu.length + 1;
                }

            }
        }
    }

    return retorno;
};