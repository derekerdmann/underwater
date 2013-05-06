/**
 * Extend the camera class to handle first-person movement
 */

FirstPersonCamera = function( fov, aspect, near, far ) {
	THREE.PerspectiveCamera.call( this, fov, aspect, near, far );

  this.keyMapping = {
    // W
    87: new THREE.Vector3( 0, 0, -1 ),
    
    // A
    65: new THREE.Vector3( -1, 0, 0 ),
    
    // S
    83: new THREE.Vector3( 0, 0, 1 ),
    
    // D
    68: new THREE.Vector3( 1, 0, 0 ),

    // Space
    32: new THREE.Vector3( 0, 1, 0 ),
    
    // Shift
    16: new THREE.Vector3( 0, -1, 0 ),
  };

  // Stores the current translation vectors
  this.translation = [];

};

FirstPersonCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );


/* Maps keys pressed to vectors that control how the camera moves */
/* Move the camera when keys are pressed */
FirstPersonCamera.prototype.onKeyDown = function(event) {

  var self = event.data.that;

  if( event.keyCode in self.keyMapping ){
    var vector = self.keyMapping[event.keyCode];
    if( self.translation.indexOf(vector) < 0 ) {
      self.translation.push(vector);
    }
  }

};


/* Remove the mapped vector from the current translation */
FirstPersonCamera.prototype.onKeyUp = function(event) {

  var self = event.data.that;

  if( event.keyCode in self.keyMapping ){
    var vector = self.keyMapping[event.keyCode];
    var i = self.translation.indexOf(vector);
    if( i > -1 ) {
      self.translation.splice( i, 1 );
    }
  }

};


/* Move the camera during each frame of animation */
FirstPersonCamera.prototype.updatePosition = function() {
  var move = new THREE.Vector3();
  for( var i = 0; i < this.translation.length; i++ ){
    move.add( this.translation[i] );
  }
  move.normalize();
  this.translateOnAxis( move, 0.5 );
};


/* Handle mouse events that rotate the camera */
FirstPersonCamera.prototype.onMouseMove = function(event) {
  var self = event.data.that;

  
}


/* Clears all current translations */
FirstPersonCamera.prototype.resetTranslation = function(event) {
  event.data.that.translation = []
};
