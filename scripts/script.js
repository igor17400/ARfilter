const Scene = require("Scene");
const TouchGestures = require("TouchGestures");
const Animation = require("Animation");

const sceneRoot = Scene.root;

// @ts-ignore
Promise.all([
    // @ts-ignore
    sceneRoot.findFirst("planeTracker0"),
    // @ts-ignore
    sceneRoot.findFirst("placer"),
]).then(function (objects) {
    const planeTracker = objects[0];
    const placer = objects[1];

    // ------------ Applying Touch gestures -------------
    TouchGestures.onPan().subscribe(function (gesture) {
        planeTracker.trackPoint(gesture.location, gesture.state);
    });

    // ------------ Applying Scaling gestures -------------
    const placerTransform = placer.transform;
    TouchGestures.onPinch().subscribeWithSnapshot(
        {
            lastScaleX: placerTransform.scaleX,
            lastScaleY: placerTransform.scaleY,
            lastScaleZ: placerTransform.scaleZ,
        },
        function (gesture, snapshot) {
            placerTransform.scaleX = gesture.scale.mul(snapshot.lastScaleX);
            placerTransform.scaleY = gesture.scale.mul(snapshot.lastScaleY);
            placerTransform.scaleZ = gesture.scale.mul(snapshot.lastScaleZ);
        }
    );

    // ------------ Applying Rotating gestures -------------
    TouchGestures.onRotate().subscribeWithSnapshot({
        'lastRotationY': placerTransform.rotationY,
    }, function (gesture, snapshot) {
        const correctRotation = gesture.rotation.mul(-1);
        placerTransform.rotationY = correctRotation.add(snapshot.lastRotationY);
    })
});
