/**
 * Created by ykabishcher on 29/01/2016.
 */
function initLevel1 () {
    game.stage.backgroundColor = '#992d2d';
    setTimeout(function(){ removeLevel1(); }, 3000);
}

function removeLevel1 () {
    //destroy things
    createLivingRoom();
}
