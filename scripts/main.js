// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
runOnStartup(async (runtime) => {
    // Code to run on the loading screen.
    // Note layouts, objects etc. are not yet available.
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    // Code to run just before 'On start of layout' on
    // the first layout. Loading has finished and initial
    // instances are created and available to use here.
    runtime.addEventListener("tick", () => Tick(runtime));
}

let newlevel = true;
let level = 1;
let readyToDash = true;


function Tick(runtime) {
    const mouse = runtime.mouse;
    const keyboard = runtime.keyboard;
    const player = runtime.objects.Player.getFirstInstance();
    
    if (player.x>=640 && newlevel) {
        newlevel=false;
        level++;
        runtime.goToLayout('level'+level);
        newlevel=true;
    }
    if (player.behaviors.Platform.isOnFloor)
        readyToDash = true;
    if (runtime.mouse.isMouseButtonDown(0) && readyToDash)
        PlayerDash(runtime, player, mouse);
    if (readyToDash) {
        PlayerAnim(runtime, player, keyboard);
        PlayerMove(runtime, player, keyboard);
    }
}
function PlayerMove(runtime, player, keyboard) {
    if (runtime.keyboard.isKeyDown('KeyW'))
        player.behaviors.Platform.simulateControl('jump');
    if (runtime.keyboard.isKeyDown('KeyA') && runtime.keyboard.isKeyDown('KeyD') == false) {
        player.behaviors.Platform.simulateControl('left');
        player.width = -Math.abs(player.width);
    }
    if (runtime.keyboard.isKeyDown('KeyD') && runtime.keyboard.isKeyDown('KeyA') == false) {
        player.behaviors.Platform.simulateControl('right');
        player.width = Math.abs(player.width);
    }
}
function PlayerAnim(runtime, player, keyboard) {
    if (player.behaviors.Platform.isOnFloor == false)
        player.setAnimation('jump');
    else if (runtime.keyboard.isKeyDown('KeyA') || runtime.keyboard.isKeyDown('KeyD'))
        player.setAnimation('run');
    else
        player.setAnimation('idle');
}
function PlayerDash(runtime, player, mouse) {
    readyToDash = false;
    player.angle = Math.atan2(mouse.getMouseY() - player.y, mouse.getMouseX() - player.x);
    player.behaviors.Bullet.speed = 1500;
    player.behaviors.Platform.gravity = 0;
    player.behaviors.Platform.isIgnoringInput = true;
    player.behaviors.Bullet.isEnabled = true;
    player.width = Math.abs(player.width);
    player.setAnimation('dash');
    setTimeout(() => {
        player.angle = 0;
        player.behaviors.Platform.gravity = 1500;
        player.behaviors.Bullet.isEnabled = false;
        player.behaviors.Platform.isIgnoringInput = false;
        player.setAnimation('jump');
    }, 200);
}
export {};
