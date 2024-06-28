/*
NOTA:
El Select de ngxs (usado en el curso) da error por deprecación.
La documentación oficial deja el siguiente consejo para compensarlo:

class UsersComponent {
  @Select(UsersState.getUsers) users$!: Observable<User[]>;

  // Should become the following
  users$: Observable<User[]> = inject(Store).select(UsersState.getUsers);
}

Ref: https://www.ngxs.io/deprecations/select-decorator-deprecation
*/


import { Component, ViewChild, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from 'src/app/state/auth/auth.actions';
import { AddEditEventsComponent } from './components/add-edit-events/add-edit-events.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // para resetear el formulario de eventos al cambiar de tab
  @ViewChild(AddEditEventsComponent, { static: false }) manage!: AddEditEventsComponent;

  isLoggedIn$: Observable<boolean> = inject(Store).select(state => state.auth.isLoggedIn);

  constructor(
    private store: Store
  ) {}

  ionViewWillEnter() {
    if (this.manage) {
      this.manage.initEvent();
    }
  }

  logout() {
    this.store.dispatch(new Logout());
  }

}
