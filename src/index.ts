import Phaser from "phaser";
import logoImg from "../assets/logo.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  backgroundColor: "#CCCCCC"
};

new Phaser.Game(config);
