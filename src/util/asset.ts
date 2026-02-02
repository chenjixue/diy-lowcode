import { AssetItem } from "@/host/create-simulator.ts";
import { AssetLevel, AssetLevels, AssetType } from "@/types";
import { load } from "./script";
export function isCSSUrl(url: string): boolean {
    return /\.css(\?.*)?$/.test(url);
}
export function assetItem(type: AssetType, content?: string | null, level?: AssetLevel, id?: string): AssetItem | null {
    if (!content) {
        return null;
    }
    return {
        type,
        content,
        level,
        id,
    };
}
function parseAssetList(scripts: any, styles: any, assets: AssetList, level?: AssetLevel) {
    for (const asset of assets) {
        parseAsset(scripts, styles, asset, level);
    }
}
export function isAssetItem(obj: any): obj is AssetItem {
    return obj && obj.type;
}
export function isAssetBundle(obj: any): obj is AssetBundle {
    return obj && obj.type === AssetType.Bundle;
}
function parseAsset(scripts: any, styles: any, asset: Asset | undefined | null, level?: AssetLevel) {
    if (!asset) {
        return;
    }

    if (!isAssetItem(asset)) {
        asset = assetItem(AssetType.JSUrl, asset, level)!;
    }

    let lv = asset.level || level;

    if (!lv || AssetLevel[lv] == null) {
        lv = AssetLevel.App;
    }

    asset.level = lv;
    if (asset.type === AssetType.CSSUrl || asset.type == AssetType.CSSText) {
        styles[lv].push(asset);
    } else {
        scripts[lv].push(asset);
    }
}
export class AssetLoader {
    private stylePoints = new Map<string, StylePoint>();

    async load(asset: Asset) {
        const scripts: any = {};
        AssetLevels.forEach(lv => {
            scripts[lv] = [];
        });
        parseAsset(scripts, [], asset);
        const scriptQueue: AssetItem[] = scripts[AssetLevel.Environment].concat(
            scripts[AssetLevel.Library],
            scripts[AssetLevel.Theme],
            scripts[AssetLevel.Runtime],
            scripts[AssetLevel.App],
        );

        await Promise.all(scriptQueue.map(({ content, type, scriptType }) => this.loadScript(content, type === AssetType.JSUrl, scriptType)));
    }
    private loadScript(content: string | undefined | null, isUrl?: boolean, scriptType?: string) {
        if (!content) {
            return;
        }
        return load(content, scriptType)
    }

}
