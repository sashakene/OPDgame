let readyToDash:boolean = true;

export function Move(runtime: IRuntime, player: InstanceType.Player, keyboard: IKeyboardObjectType)
{
	if (runtime.keyboard.isKeyDown('KeyW'))
		player.behaviors.Platform.simulateControl('jump');
    if (runtime.keyboard.isKeyDown('KeyA') && !runtime.keyboard.isKeyDown('KeyD')) {
		player.behaviors.Platform.simulateControl('left');
		player.width = -Math.abs(player.width);
	}
    if (runtime.keyboard.isKeyDown('KeyD') && !runtime.keyboard.isKeyDown('KeyA')) { 
		player.behaviors.Platform.simulateControl('right');
		player.width = Math.abs(player.width);
	}
}

export function Anim(runtime: IRuntime, player: InstanceType.Player, keyboard: IKeyboardObjectType)
{
	if(!player.behaviors.Platform.isOnFloor)
		player.setAnimation('jump');

	else if (Math.abs(player.behaviors.Platform.vectorX)>100 && 
        (runtime.keyboard.isKeyDown('KeyA') || runtime.keyboard.isKeyDown('KeyD')))
		player.setAnimation('run');
	else
		player.setAnimation('idle');
}

export function Dash(runtime: IRuntime, player: InstanceType.Player, mouse: IMouseObjectType)
{
    if(player.behaviors.Platform.isOnFloor)
		readyToDash = true;

    if (runtime.mouse.isMouseButtonDown(0) && readyToDash) {
		readyToDash = false;
		player.angle = Math.atan2(mouse.getMouseY()-player.y, mouse.getMouseX()-player.x);
		player.behaviors.Bullet.speed = 1500;
		player.behaviors.Platform.gravity = 0;
		player.behaviors.Platform.isIgnoringInput = true;
		player.behaviors.Bullet.isEnabled = true;
		player.width = Math.abs(player.width)
		player.setAnimation('dash');
		
		setTimeout(() => {
			player.angle = 0;
        	player.behaviors.Platform.gravity = 1500;
        	player.behaviors.Bullet.isEnabled = false;
        	player.behaviors.Platform.isIgnoringInput = false;
			player.setAnimation('jump');
    	}, 200)
    }
}
