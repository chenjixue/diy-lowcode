import MixedSetter from "@/sketeton/component/setter-ext/mixed-setter";
import {init} from "@/entry/entry.ts"
window.MixedSetter = MixedSetter;
init(document.querySelector('body')!)
