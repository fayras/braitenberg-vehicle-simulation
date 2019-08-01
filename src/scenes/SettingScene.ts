import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SidebarScene from './SidebarScene';
import Attribute from '../components/Attribute';
import EntityManager from '../EntityManager';
import ConnectionComponent from '../components/ConnectionComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';
import SourceComponent from '../components/SourceComponent';
import ScrollableContainer from '../gui/ScrollableContainer';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  private createComponentSelect(entity: Entity): Phaser.GameObjects.DOMElement[] {
    const row = this.add.dom(0, 0).createFromHTML(`<div class="base-input-container">
      <select style="width: 85%" name="components">
      <option value="${ComponentType.MOTOR}">Motor</option>
      <option value="${ComponentType.SENSOR}">Sensor</option>
      <option value="${ComponentType.SOURCE}">Quelle</option>
      <option value="${ComponentType.SOLID_BODY}">Fester Körper</option>
      <option value="${ComponentType.CONNECTION}">Verbindungsnetzwerk</option>
      </select>
    </div>`);

    const select = row.getChildByName('components');

    const el = this.add
      .dom(0, 0)
      .createFromHTML('<i class="fa fa-plus"></i>')
      .setClassName('deleteButton');

    el.setData('ignoreHeight', true);
    el.addListener('click');
    el.on('click', () => {
      const name = (select as HTMLSelectElement).value;

      switch (name) {
        case ComponentType.MOTOR:
          EntityManager.addComponent(
            entity.id,
            new MotorComponent({
              position: { x: 0, y: 0 },
              maxSpeed: 50,
              defaultSpeed: 5,
            }),
          );
          break;
        case ComponentType.SENSOR:
          EntityManager.addComponent(
            entity.id,
            new SensorComponent({
              position: { x: 0, y: 0 },
              range: 20,
              angle: 0.3,
            }),
          );
          break;
        case ComponentType.SOURCE:
          EntityManager.addComponent(
            entity.id,
            new SourceComponent({
              range: 100,
            }),
          );
          break;
        case ComponentType.SOLID_BODY:
          EntityManager.addComponent(entity.id, new SolidBodyComponent({}));
          break;
        case ComponentType.CONNECTION:
          {
            const inputs = entity.getMultipleComponents(ComponentType.SENSOR).map(com => com.id);
            const outputs = entity.getMultipleComponents(ComponentType.MOTOR).map(com => com.id);
            EntityManager.addComponent(
              entity.id,
              new ConnectionComponent({
                inputIds: inputs,
                outputIds: outputs,
              }),
            );
          }
          break;
        default:
      }
      // alle Componenten der Enittät neu laden
      this.container!.removeAll(true);
      this.container!.height = 0;
      this.onCreate(this.container!, entity);
    });

    return [row, el];
  }

  public onCreate(container: ScrollableContainer, entity: Entity): void {
    const deleteEntity = this.add.dom(0, 0, 'button', '', 'Entität Löschen').setClassName('error base-input-container');
    deleteEntity.addListener('click');
    deleteEntity.on('click', () => {
      EntityManager.destroyEntity(entity.id);
      this.close();
    });

    const addComponent = this.createComponentSelect(entity);

    const seperator = this.add.dom(0, 0, 'hr').setClassName('sidepar-seperator base-input-container');

    const uiElements = entity.getAllComponents().map((component): Phaser.GameObjects.DOMElement[] => {
      const infoTip = component.getInfo()
        ? ` <span class="tooltip-left" data-tooltip="${component.getInfo()}"><i class="fa fa-xs fa-info-circle"></i></span>`
        : '';
      const title = this.add
        .dom(0, 0)
        .createFromHTML(
          `<h3>${component.name} <span class="component-title-info">[ID: ${component.id}]${infoTip}</span></h3>`,
        )
        .setClassName('component-title');

      let deleteButton;
      if (component.isDeletable()) {
        deleteButton = this.add.dom(0, 0, 'div', '', '✖').setClassName('deleteButton');
        deleteButton.setData('ignoreHeight', true);
        deleteButton.addListener('click');
        deleteButton.on('click', () => {
          EntityManager.removeComponent(entity.id, component);
          // alle Componenten der Enittät neu laden
          container.removeAll(true);
          container.reset();
          this.onCreate(container, entity);
        });
      }

      const attributes = Object.keys(component).map(attribute => {
        if (component[attribute] instanceof Attribute) {
          return (component[attribute] as Attribute<any, any>).render(this, entity);
        }

        return undefined;
      });

      return [title, deleteButton, ...attributes];
    });

    this.pack([deleteEntity, ...addComponent, seperator, ...uiElements.flat()]);
  }
}
