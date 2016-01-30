/**
 * Created by ykabishcher on 29/01/2016.
 */

var allObjects = {
    kitchen: {
        kettle: {
            x: 233,
            y: 312
        },
        apple: {
            x: 434,
            y: 403
        },
        pot: {
            x: 606,
            y: 385
        },
        chair: {
            x: 293,
            y: 488
        },
        fridge: {
            x: 507,
            y: 376
        },
        stain: {
            x: 189,
            y: 479
        }
    },
    bath: {
        curtain: {
            x: 280,
            y: 382
        },
        paper: {
            x: 542,
            y: 348
        },
        paste: {
            x: 692,
            y: 414
        }
    }
};
var objects,
    objectNames,
    currentRoomName,
    objectsArr = [],
    numOfFaults = 2,
    background,
    goBackZone;

function preloadRooms () {
    //load objects images
    var roomNames = Object.keys(allObjects), objectNames;
    roomNames.forEach(function(roomName) {
        if(allObjects.hasOwnProperty(roomName)) {
            objectNames = Object.keys(allObjects[roomName]);
            roomObjects = allObjects[roomName];
            //load room background
            game.load.image(roomName+"_background", "assets/img/"+roomName+"/background.jpg");
            //load room objects
            objectNames.forEach(function(objName) {
                if(roomObjects.hasOwnProperty(objName)) {
                    game.load.image(objName+"_t", "assets/img/"+roomName+"/"+objName+"_t.jpg");
                    game.load.image(objName+"_f", "assets/img/"+roomName+"/"+objName+"_f.jpg");
                }
            });
        }
    });
    // load back button
    game.load.image("goBackZone", "assets/img/exit.png");
}

function initRoom (roomName, f) {
    numOfFaults = f;
    currentRoomName = roomName;
    objects = allObjects[roomName];
    objectNames = Object.keys(objects),
    create();
}

function preload () {
    var i, randIndex, allRand = [], reroll;
    game.load.image('background', 'assets/img/kitchen/background.jpg');
    for(i=0; i < numOfFaults; i++) {
        reroll = true;
        while(reroll){
            randIndex = game.rnd.integerInRange(0, objectNames.length-1);
            if(allRand.indexOf(randIndex) === -1) {
                allRand.push(randIndex);
                reroll = false;
            }
        }
        objects[objectNames[randIndex]].fault = true;
        // mark objective on first roll
        if(i === 0) {
            objects[objectNames[randIndex]].objective = true;
        }
    }


    console.log(objects);

}

function create () {
    var i, randIndex, allRand = [], reroll;
    background = game.add.sprite(game.world.centerX, game.world.centerY, currentRoomName+'_background');
    background.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.P2JS);

    // generate randomness
    for(i=0; i < numOfFaults; i++) {
        reroll = true;
        while(reroll){
            randIndex = game.rnd.integerInRange(0, objectNames.length-1);
            if(allRand.indexOf(randIndex) === -1) {
                allRand.push(randIndex);
                reroll = false;
            }
        }
        objects[objectNames[randIndex]].fault = true;
        // mark objective on first roll
        if(i === 0) {
            objects[objectNames[randIndex]].objective = true;
        }
    }

    // create objects
    objectNames.forEach(function(objName) {
        var obj = objects[objName],
            suffix = obj.fault ? "_f" : "_t";
        obj.sprite = game.add.sprite(obj.x, obj.y, objName+suffix);
        game.physics.enable(obj.sprite, Phaser.Physics.P2JS);
        obj.sprite.body.static = true;
        obj.sprite.x = obj.x;
        obj.sprite.y = obj.y;
        //game.physics.p2.createLockConstraint(obj.sprite.body, background);
        objectsArr.push(obj.sprite);
    });

    // add goBack zone
    goBackZone = game.add.sprite(0, 520, "goBackZone");
    goBackZone.events.onInputOver.add(backHover, this);
    goBackZone.events.onInputOut.add(removeBackHover, this);

    // add click listener
    game.input.onDown.add(click, this);
}

function backHover(){
    console.log("out");
}

function removeBackHover(){
    console.log("hover");
}

function click(pointer) {
    var objectClicked = game.physics.p2.hitTest(pointer.position, objectsArr), objName,
        goBackClicked = game.physics.p2.hitTest(pointer.position, goBackZone);
    // if hit
    if(objectClicked.length != 0) {
        objName = objectClicked[0].parent.sprite.key.split("_")[0];
        // fix fault
        if(objects[objName].fault){
            objects[objName].sprite.loadTexture(objName+"_t", 0);
            objects[objName].fault = false;
        }
        // if objective
        if(objects[objName].objective) {
            console.log("success!");
        }
    }

}

function removeCurrentRoom () {
    //destroy things
    background.kill();
    objectsArr.forEach(function(sprite) {
        sprite.kill();
    });

    //init back the living room
    createLivingRoom();
}
