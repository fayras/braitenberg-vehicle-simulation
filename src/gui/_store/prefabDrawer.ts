import { makeAutoObservable } from 'mobx';

class PrefabDrawerStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}

export const store = new PrefabDrawerStore();
