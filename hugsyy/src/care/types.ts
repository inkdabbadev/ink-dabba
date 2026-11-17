export interface TableObject {
  id: string;
  type: string;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  zIndex: number;
  draggable: boolean;
  interactive: boolean;
  interactionState: string;
  collected: boolean;
  completed: boolean;
  metadata: { w: number; h: number };
}
export interface FlowerStem {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}
export interface Topper {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}
export interface IcingPath {
  id: string;
  color: string;
  width: number;
  points: { x: number; y: number }[];
}
export interface CareData {
  giftsRevealed: boolean;
  balloon: { shape: string; color: string; step: number };
  polaroids: { id: string; src: string; caption: string; collected: boolean }[];
  version: number;
  parcel: { ribbon: boolean; tape: boolean; lid: boolean; tissue: boolean };
  objects: TableObject[];
  cake: {
    base: string;
    frost: string;
    icing: string;
    paths: IcingPath[];
    toppers: Topper[];
    lit: boolean;
  };
  bouquet: { wrap: string; ribbon: string; tag: string; flowers: FlowerStem[] };
  prizes: string[];
  visited: string[];
  letterStage: number;
  finalOpened: boolean;
  sound: boolean;
  reduced: boolean;
  readable: boolean;
}
