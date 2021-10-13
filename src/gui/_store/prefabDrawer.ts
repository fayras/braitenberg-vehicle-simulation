import { makeAutoObservable } from 'mobx';

class PrefabDrawerStore {
  isOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

export const store = new PrefabDrawerStore();
