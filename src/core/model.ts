/// <reference path="paths.ts" />

module MakerJs.model {

    /**
     * Moves all of a model's children (models and paths, recursively) in reference to a single common origin. Useful when points between children need to connect to each other.
     * 
     * @param modelToOriginate The model to originate.
     * @param origin Optional offset reference point.
     */
    export function originate(modelToOriginate: IModel, origin?: IPoint) {
        var newOrigin = point.add(modelToOriginate.origin, origin);

        if (modelToOriginate.paths) {
            for (var id in modelToOriginate.paths) {
                path.moveRelative(modelToOriginate.paths[id], newOrigin);
            }
        }

        if (modelToOriginate.models) {
            for (var id in modelToOriginate.models) {
                originate(modelToOriginate.models[id], newOrigin);
            }
        }

        modelToOriginate.origin = point.zero();

        return modelToOriginate;
    }

    /**
     * Create a clone of a model, mirrored on either or both x and y axes.
     * 
     * @param modelToMirror The model to mirror.
     * @param mirrorX Boolean to mirror on the x axis.
     * @param mirrorY Boolean to mirror on the y axis.
     * @returns Mirrored model.
     */
    export function mirror(modelToMirror: IModel, mirrorX: boolean, mirrorY: boolean): IModel {
        var newModel: IModel = {};

        if (modelToMirror.origin) {
            newModel.origin = point.mirror(modelToMirror.origin, mirrorX, mirrorY);
        }

        if (modelToMirror.type) {
            newModel.type = modelToMirror.type;
        }

        if (modelToMirror.units) {
            newModel.units = modelToMirror.units;
        }

        if (modelToMirror.paths) {
            newModel.paths = {};
            for (var id in modelToMirror.paths) {
                newModel.paths[id] = path.mirror(modelToMirror.paths[id], mirrorX, mirrorY);
            }
        }

        if (modelToMirror.models) {
            newModel.models = {};
            for (var id in modelToMirror.models) {
                newModel.models[id] = model.mirror(modelToMirror.models[id], mirrorX, mirrorY);
            }
        }

        return newModel;
    }

    /**
     * Move a model to an absolute position. Note that this is also accomplished by directly setting the origin property. This function exists because the origin property is optional.
     * 
     * @param modelToMove The model to move.
     * @param origin The new position of the model.
     * @returns The original model (for chaining).
     */
    export function move(modelToMove: IModel, origin: IPoint): IModel {
        modelToMove.origin = point.clone(origin);
        return modelToMove;
    }

    /**
     * Rotate a model.
     * 
     * @param modelToRotate The model to rotate.
     * @param angleInDegrees The amount of rotation, in degrees.
     * @param rotationOrigin The center point of rotation.
     * @returns The original model (for chaining).
     */
    export function rotate(modelToRotate: IModel, angleInDegrees: number, rotationOrigin: IPoint): IModel {

        var offsetOrigin = point.subtract(rotationOrigin, modelToRotate.origin);

        if (modelToRotate.paths) {
            for (var id in modelToRotate.paths) {
                path.rotate(modelToRotate.paths[id], angleInDegrees, offsetOrigin);
            }
        }

        if (modelToRotate.models) {
            for (var id in modelToRotate.models) {
                rotate(modelToRotate.models[id], angleInDegrees, offsetOrigin);
            }
        }

        return modelToRotate;
    }

    /**
     * Scale a model.
     * 
     * @param modelToScale The model to scale.
     * @param scaleValue The amount of scaling.
     * @param scaleOrigin Optional boolean to scale the origin point. Typically false for the root model.
     * @returns The original model (for chaining).
     */
    export function scale(modelToScale: IModel, scaleValue: number, scaleOrigin = false): IModel {

        if (scaleOrigin && modelToScale.origin) {
            modelToScale.origin = point.scale(modelToScale.origin, scaleValue);
        }

        if (modelToScale.paths) {
            for (var id in modelToScale.paths) {
                path.scale(modelToScale.paths[id], scaleValue);
            }
        }

        if (modelToScale.models) {
            for (var id in modelToScale.models) {
                scale(modelToScale.models[id], scaleValue, true);
            }
        }

        return modelToScale;
    }

    /**
     * Scale a model to match the unit system of another model.
     * 
     * @param modelToScale The model to scale.
     * @param destinationModel The model of which to match its unit system.
     * @returns The scaled model (for chaining).
     */
    export function scaleUnits(modeltoScale: IModel, destinationModel: IModel): IModel {

        if (modeltoScale.units && destinationModel.units) {
            var ratio = units.conversionScale(modeltoScale.units, destinationModel.units);

            if (ratio != 1) {
                scale(modeltoScale, ratio);
            }
        }

        return modeltoScale;
    }

}
