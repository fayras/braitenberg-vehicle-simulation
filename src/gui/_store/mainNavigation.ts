import { makeAutoObservable } from 'mobx';

class MainNavigationStore {
  playState: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  togglePlay() {
    this.playState = !this.playState;
  }

  setPlay(state: boolean) {
    this.playState = state;
  }

  reset() {}
}

export const store = new MainNavigationStore();
