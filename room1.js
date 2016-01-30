
window.onload = function() {

        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create }),
            objects = {
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

        function preload () {
            var i, randIndex, allRand = [], reroll;
            game.load.image('background', '/room1.jpg');
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
            var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
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

    };