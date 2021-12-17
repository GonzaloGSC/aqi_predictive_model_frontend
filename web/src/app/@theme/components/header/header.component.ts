import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbMenuItem, NbContextMenuDirective, NB_WINDOW } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../../../sessionservice/session-service';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly: boolean = false;
    user = "Utem";//this.ss.RetornaNombre();
    rol = "admin";//this.ss.RetornaRol();
    userMenu = [{ title: 'Cambiar Contraseña', icon: 'edit-2-outline' }, { title: 'Salir', icon: 'lock-outline' }];
    tag = 'my-context-menu';

    tagnoti = 'my-context-notification';

    currentTheme = 'default';

    constructor(private sidebarService: NbSidebarService,
        @Inject(NB_WINDOW) private window,
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private userService: UserData,
        private layoutService: LayoutService,
        private router: Router,
        // private breakpointService: NbMediaBreakpointsService,
        private ss: SessionService) {

        // this.menuService.onItemClick().pipe(filter(({ tag }) => tag === this.tag || tag === this.tagnoti))
        //     .subscribe(bag => {
        //         if (bag.item.title == 'Salir') {
        //             this.router.navigate(['/login']);
        //         } else if (bag.item.title == 'Cambiar Contraseña') {
        //             this.router.navigate(['/pages/mantenedor/claves']);
        //         }
        //     });
    }

    ngOnInit() {
        this.currentTheme = this.themeService.currentTheme;
        this.menuService.onItemClick()
            .pipe(
                filter(({ tag }) => tag === 'my-context-menu'),
                map(({ item: { title } }) => title),
            )
            .subscribe(title => this.window.alert(`${title} was clicked!`));

        // this.userService.getUsers()
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe((users: any) => this.user = users.nick);

        // const { xl } = this.breakpointService.getBreakpointsMap();
        // this.themeService.onMediaQueryChange()
        //     .pipe(
        //         map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        //         takeUntil(this.destroy$),
        //     )
        //     .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

        // this.themeService.onThemeChange()
        //   .pipe(
        //     map(({ name }) => name),
        //     takeUntil(this.destroy$),
        //   )
        //   .subscribe(themeName => this.currentTheme = themeName);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    //   changeTheme(themeName: string) {
    //     this.themeService.changeTheme(themeName);
    //   }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }

    Salir(){
        this.ss.BorrarSession();
        this.router.navigate(['/login']);
    }

}
