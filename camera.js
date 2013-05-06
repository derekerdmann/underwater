/**
 * Extend the camera class to handle first-person movement
 */

FirstPersonCamera = function( fov, aspect, near, far ) {
	THREE.PerspectiveCamera.call( this, fov, aspect, near, far );
};

FirstPersonCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
