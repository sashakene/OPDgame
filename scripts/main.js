import * as PlayerScripts from "./player.js";
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
function Tick(runtime) {
    const player = runtime.objects.Player.getFirstInstance();
    const mouse = runtime.mouse;
    const keyboard = runtime.keyboard;
    if (player.x >= 640 && newlevel) {
        newlevel = false;
        level++;
        runtime.goToLayout('level' + level);
        newlevel = true;
    }
    PlayerScripts.Dash(runtime, player, mouse);
    PlayerScripts.Anim(runtime, player, keyboard);
    PlayerScripts.Move(runtime, player, keyboard);
}
