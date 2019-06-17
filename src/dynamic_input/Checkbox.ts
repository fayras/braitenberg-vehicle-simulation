class Checkbox extends Phaser.GameObjets.DOMElement {
  construcor (attribut: String)
  {
    const div = document.createElement('div');
    div.style =
      'background-color: rgba(255,0,0,0.9); color: black; width: 250px; height: 100px; font: 24px Arial; font-weight: bold';
    const neueZeile = '<br />';
    div.innerHTML = attribut;

    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';

    div.appendChild(inputCheckbox);
    const container = this.add.container(this.cameras.main.displayWidth - 200, 100);
    const element = this.add.dom(0, 0, div);

    container.add([element]);

  }
    
}