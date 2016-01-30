/**
 * Created by ykabishcher on 29/01/2016.
 */
function initLevel1 () {
    game.stage.backgroundColor = '#992d2d';
    setTimeout(function(){ removeCurrentRoom(); }, 3000);
}


var objects = {
        "r1o1": {
            x: 100,
            y: 100
        },
        "r1o2": {
            x: 200,
            y: 100
        },
        "r1o3": {
            x: 300,
            y: 100
        },
        "r1o4": {
            x: 400,
            y: 100
        },
        "r1o5": {
            x: 500,
            y: 100
        }
    },
    objectNames = Object.keys(objects),
    objectsArr = [],
    numOfFaults = 2;
var background;

function preloadRooms () {
    preload();
}

function initRoom (roomName) {
    if (roomName="kitchen") {
        create();
    }
}

function preload () {
    var i, randIndex, allRand = [], reroll;
    game.load.image('background', 'assets/img/kitchen.png');
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
    //load objects images
    objectNames.forEach(function(objName) {
        game.load.image(objName+"_a", objName+"_a.jpg");
        game.load.image(objName+"_b", objName+"_b.jpg");
    });

    console.log(objects);

}

function create () {
    background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
    background.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.P2JS);

    // create objects
    objectNames.forEach(function(objName) {
        var obj = objects[objName],
            suffix = obj.fault ? "_b" : "_a";
        obj.sprite = game.add.sprite(obj.x, obj.y, objName+suffix);
        game.physics.enable(obj.sprite, Phaser.Physics.P2JS);
        objectsArr.push(obj.sprite);
    });
    // add click listener
    game.input.onDown.add(click, this);
}

function click(pointer) {
    var objectClicked = game.physics.p2.hitTest(pointer.position, objectsArr), objName;
    // if hit
    if(objectClicked.length != 0) {
        objName = objectClicked[0].parent.sprite.key.split("_")[0];
        // fix fault
        if(objects[objName].fault){
            objects[objName].sprite.loadTexture(objName+"_a", 0);
            objects[objName].fault = false;
        }
        // if objective
        if(objects[objName].objective) {
            console.log("success!");
        }
    }
}

function object1ClickAlt() {

}

function resetObject1(){
    object1.loadTexture('object1A', 0);
    object1.events.onInputDown.addOnce(object1Click, this);
    object1Clicked = false;
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
