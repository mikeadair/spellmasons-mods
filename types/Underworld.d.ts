/// <reference types="node" />
import * as Unit from './entity/Unit';
import * as Doodad from './entity/Doodad';
import * as Pickup from './entity/Pickup';
import * as Obstacle from './entity/Obstacle';
import * as Player from './entity/Player';
import * as Upgrade from './Upgrade';
import * as Cards from './cards';
import { BloodParticle } from './graphics/PixiUtils';
import { Faction } from './types/commonTypes';
import type { Vec2 } from "./jmath/Vec";
import { prng, SeedrandomState } from './jmath/rand';
import { LineSegment } from './jmath/lineSegment';
import { Polygon2, Polygon2LineSegment } from './jmath/Polygon2';
import { ForceMove } from './jmath/moveWithCollision';
import { IHostApp } from './network/networkUtil';
import { Limits as Limits, Tile } from './MapOrganicCave';
import type PieClient from '@websocketpie/client';
import { DisplayObject, TilingSprite } from 'pixi.js';
import { HasSpace } from './entity/Type';
import { Overworld } from './Overworld';
import { Emitter } from '@pixi/particle-emitter';
export declare enum turn_phase {
    Stalled = 0,
    PlayerTurns = 1,
    NPC_ALLY = 2,
    NPC_ENEMY = 3
}
export declare const elUpgradePickerContent: HTMLElement | undefined;
export declare const showUpgradesClassName = "showUpgrades";
export default class Underworld {
    seed: string;
    localUnderworldNumber: number;
    overworld: Overworld;
    random: prng;
    pie: PieClient | IHostApp;
    levelIndex: number;
    RNGState?: SeedrandomState;
    turn_phase: turn_phase;
    lastUnitId: number;
    lastPickupId: number;
    turn_number: number;
    limits: Limits;
    players: Player.IPlayer[];
    units: Unit.IUnit[];
    unitsPrediction: Unit.IUnit[];
    pickups: Pickup.IPickup[];
    pickupsPrediction: Pickup.IPickup[];
    doodads: Doodad.IDoodad[];
    doodadsPrediction: Doodad.IDoodad[];
    imageOnlyTiles: Tile[];
    liquidSprites: TilingSprite[];
    walls: LineSegment[];
    liquidBounds: LineSegment[];
    liquidPolygons: Polygon2[];
    pathingPolygons: Polygon2[];
    pathingLineSegments: Polygon2LineSegment[];
    processedMessageCount: number;
    cardDropsDropped: number;
    enemiesKilled: number;
    forceMove: ForceMove[];
    forceMovePrediction: ForceMove[];
    lastThoughtsHash: string;
    playerThoughts: {
        [clientId: string]: {
            target: Vec2;
            cardIds: string[];
            ellipsis: boolean;
        };
    };
    lastLevelCreated: LevelData | undefined;
    allowForceInitGameState: boolean;
    removeEventListeners: undefined | (() => void);
    bloods: BloodParticle[];
    isRestarting: NodeJS.Timer | undefined;
    particleFollowers: {
        displayObject: DisplayObject;
        emitter?: Emitter;
        target: Unit.IUnit;
    }[];
    activeMods: string[];
    constructor(overworld: Overworld, pie: PieClient | IHostApp, seed: string, RNGState?: SeedrandomState | boolean);
    getPotentialTargets(prediction: boolean): HasSpace[];
    reportEnemyKilled(enemyKilledPos: Vec2): void;
    syncPlayerPredictionUnitOnly(): void;
    syncPredictionEntities(): void;
    syncronizeRNG(RNGState: SeedrandomState | boolean): prng;
    fullySimulateForceMovePredictions(): void;
    runForceMove(forceMoveInst: ForceMove, prediction: boolean): boolean;
    queueGameLoop: () => void;
    gameLoopForceMove: () => boolean;
    gameLoopUnit: (u: Unit.IUnit, aliveNPCs: Unit.IUnit[], deltaTime: number) => boolean;
    triggerGameLoopHeadless: () => void;
    _gameLoopHeadless: () => boolean;
    gameLoop: (timestamp: number) => void;
    setPath(unit: Unit.IUnit, target: Vec2): void;
    calculatePath(preExistingPath: Unit.UnitPath | undefined, startPoint: Vec2, target: Vec2): Unit.UnitPath;
    calculatePathNoCache(startPoint: Vec2, target: Vec2): Unit.UnitPath;
    drawResMarkers(): void;
    drawEnemyAttentionMarkers(): void;
    drawPlayerThoughts(): void;
    isMyTurn(): boolean;
    cleanup(): void;
    cacheWalls(obstacles: Obstacle.IObstacle[], emptyTiles: Tile[]): void;
    spawnPickup(index: number, coords: Vec2, prediction?: boolean): void;
    spawnEnemy(id: string, coords: Vec2, isMiniboss: boolean): void;
    testLevelData(): LevelData;
    isInsideLiquid(point: Vec2): boolean;
    assertDemoExit(): void;
    generateRandomLevelData(levelIndex: number): LevelData | undefined;
    pickGroundTileLayers(biome: Biome): string[];
    addGroundTileImages(biome: Biome): void;
    isPointValidSpawn(spawnPoint: Vec2, radius: number, fromSource?: Vec2): boolean;
    findValidSpawn(spawnSource: Vec2, ringLimit: number, radius?: number): Vec2 | undefined;
    findValidSpawns(spawnSource: Vec2, radius: number | undefined, ringLimit: number): Vec2[];
    cleanUpLevel(): void;
    postSetupLevel(): void;
    createLevelSyncronous(levelData: LevelData): void;
    createLevel(levelData: LevelData): Promise<void>;
    generateLevelDataSyncronous(levelIndex: number): LevelData;
    generateLevelData(levelIndex: number): Promise<LevelData>;
    checkPickupCollisions(unit: Unit.IUnit, prediction: boolean): void;
    isCoordOnWallTile(coord: Vec2): boolean;
    getMousePos(): Vec2;
    isGameOver(): boolean;
    updateGameOverModal(): void;
    tryGameOver(): boolean;
    tryEndPlayerTurnPhase(): boolean;
    endFullTurnCycle(): Promise<void>;
    syncTurnMessage(): void;
    initializePlayerTurns(): Promise<void>;
    endMyTurn(): Promise<void>;
    endPlayerTurn(clientId: string): Promise<void>;
    chooseUpgrade(player: Player.IPlayer, upgrade: Upgrade.IUpgrade): void;
    showUpgrades(): void;
    addRerollButton(player: Player.IPlayer): void;
    checkForEndOfLevel(): boolean;
    getRandomCoordsWithinBounds(bounds: Limits, seed?: prng): Vec2;
    tryRestartTurnPhaseLoop(): void;
    broadcastTurnPhase(p: turn_phase): Promise<void>;
    setTurnPhase(p: turn_phase): void;
    initializeTurnPhase(p: turn_phase): Promise<void>;
    executeNPCTurn(faction: Faction): Promise<void>;
    canUnitAttackTarget(u: Unit.IUnit, attackTarget?: Unit.IUnit): boolean;
    getEntitiesWithinDistanceOfTarget(target: Vec2, distance: number, prediction: boolean): HasSpace[];
    getPickupsWithinDistanceOfTarget(target: Vec2, distance: number, prediction: boolean): Pickup.IPickup[];
    getUnitsWithinDistanceOfTarget(target: Vec2, distance: number, prediction: boolean): Unit.IUnit[];
    getUnitsAt(coords: Vec2, prediction?: boolean): Unit.IUnit[];
    getUnitAt(coords: Vec2, prediction?: boolean): Unit.IUnit | undefined;
    getPickupAt(coords: Vec2, prediction?: boolean): Pickup.IPickup | undefined;
    getDoodadAt(coords: Vec2, prediction?: boolean): Doodad.IDoodad | undefined;
    addDoodadToArray(doodad: Doodad.IDoodad, prediction: boolean): void;
    addUnitToArray(unit: Unit.IUnit, prediction: boolean): Unit.IUnit;
    addPickupToArray(pickup: Pickup.IPickup, prediction: boolean): void;
    castCards(args: CastCardsArgs): Promise<Cards.EffectState>;
    checkIfShouldSpawnPortal(): void;
    hasLineOfSight(seer: Vec2, target: Vec2): boolean;
    dev_shuffleUnits(): Unit.IUnit[];
    unitIsIdentical(unit: Unit.IUnit, serialized: Unit.IUnitSerialized): boolean;
    syncUnits(units: Unit.IUnitSerialized[]): void;
    sendPlayerThinking(thoughts: {
        target?: Vec2;
        cardIds: string[];
    }): void;
    syncPlayers(players: Player.IPlayerSerialized[]): void;
    pickupIsIdentical(pickup: Pickup.IPickup, serialized: Pickup.IPickupSerialized): boolean;
    syncPickups(pickups: Pickup.IPickupSerialized[]): void;
    serializeForHash(): any;
    serializeForSaving(): IUnderworldSerialized;
    serializeForSyncronize(): IUnderworldSerializedForSyncronize;
}
declare type IUnderworldSerialized = Omit<typeof Underworld, "pie" | "overworld" | "prototype" | "players" | "units" | "unitsPrediction" | "pickups" | "pickupsPrediction" | "doodads" | "doodadsPrediction" | "random" | "turnInterval" | "liquidSprites" | "particleFollowers" | "walls" | "pathingPolygons"> & {
    players: Player.IPlayerSerialized[];
    units: Unit.IUnitSerialized[];
    pickups: Pickup.IPickupSerialized[];
    doodads: Doodad.IDoodadSerialized[];
};
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
declare type UnderworldNonFunctionProperties = Exclude<NonFunctionPropertyNames<Underworld>, null | undefined>;
export declare type IUnderworldSerializedForSyncronize = Omit<Pick<Underworld, UnderworldNonFunctionProperties>, "pie" | "overworld" | "debugGraphics" | "players" | "units" | "pickups" | "obstacles" | "random" | "gameLoop" | "particleFollowers">;
export declare type Biome = 'water' | 'lava' | 'blood' | 'ghost';
export declare function biomeTextColor(biome?: Biome): number | string;
export interface LevelData {
    levelIndex: number;
    biome: Biome;
    limits: Limits;
    obstacles: Obstacle.IObstacle[];
    liquid: Tile[];
    imageOnlyTiles: Tile[];
    width: number;
    pickups: {
        index: number;
        coord: Vec2;
    }[];
    enemies: {
        id: string;
        coord: Vec2;
        isMiniboss: boolean;
    }[];
}
interface CastCardsArgs {
    casterCardUsage: Player.CardUsage;
    casterUnit: Unit.IUnit;
    casterPositionAtTimeOfCast: Vec2;
    cardIds: string[];
    castLocation: Vec2;
    prediction: boolean;
    outOfRange?: boolean;
    magicColor?: number;
    casterPlayer?: Player.IPlayer;
    initialTargetedUnitId?: number;
    initialTargetedPickupId?: number;
}
export {};
