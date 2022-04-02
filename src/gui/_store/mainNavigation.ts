import { makeAutoObservable } from 'mobx';

class MainNavigationStore {
  playState = false;

  constructor() {
    makeAutoObservable(this);
  }

  togglePlay(): void {
    this.playState = !this.playState;
  }

  setPlay(state: boolean): void {
    this.playState = state;
  }

  reset(): void {}
}

export const store = new MainNavigationStore();
