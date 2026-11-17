export type Scene = 'intro'|'world'|'cake'|'art'|'garden'|'forest'|'finale';
export type DetailType = 'cherry'|'strawberry'|'sprinkle'|'flower'|'star'|'chocolate'|'bow'|'butterfly'|'candle'|'mushroom'|'cream';
export interface Detail {id:string;type:DetailType;x:number;y:number;z:number;size:number;rotation:number;seed:number}
export interface Cake {flavor:string;tiers:number;frost:string;frosting:string;coverage:number;details:Detail[];lit:boolean}
export interface Settings {sound:boolean;reduced:boolean;lightweight:boolean;contrast:boolean}
export interface MemoryOverride {text:string;caption:string;customized:boolean}
export interface Save {version:number;scene:Scene;letterOpened:boolean;achievements:string[];cake:Cake;cakeSaved:boolean;artSaved:boolean;artRevision:number;discovered:string[];rescued:number;forestIds:number[];giftOpened:boolean;settings:Settings;memories:Record<string,MemoryOverride>}
export interface Sticker {id:string;type:string;x:number;y:number;size:number;rotation:number}
export interface Artwork {template:string;fills:Record<string,string>;ink:string;stickers:Sticker[];preview:string;updated:number}
