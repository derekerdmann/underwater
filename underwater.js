if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    
    var container;

    var camera, scene, renderer;
    var uniforms, underWaterMaterial;
    var sun;
    

    var titanic;
    
    
    var array;
    var type;
	
	var sub;
	
	var forwardV = new THREE.Vector3(0,0,1);
	var velocity = new THREE.Vector3(0,0,0);
	var thrust = 0.0;
	var rotVelocity = new THREE.Vector3(0,0,0);
	var maxThrust = 5;
	var cameraOffSet = 5;
	//input bools
	var turnLeft = false;
	var turnRight = false;
	var rollLeft = false;
	var rollRight = false;
	var up = false;
	var down = false;
	var forward = false;
	var backward = false;
	var debugTimer = 60;
	var debugCount = 60;
	
    
    init();
    animate();
  
    function init() {
    
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		  
		camera = new FirstPersonCamera(75, window.innerWidth/window.innerHeight, 0.001, 1000);
		camera.useQuaternion = true;

		scene = new THREE.Scene();
		sun = new THREE.DirectionalLight(0xffffff);
		sun.position.set(2,2,2);
		scene.add( sun );
		  
		
		
		sub = new THREE.Mesh( new THREE.SphereGeometry( 1,8,5 ), new THREE.MeshPhongMaterial( { color: 0xffffff } ));
		sub.position.set( 0, 0, 0 );
		sub.rotation.set(-1.57,0,0);
		sub.useQuaternion = true;
		sub.quaternion.setFromEuler(sub.rotation);
		sub.rotationAutoUpdate = true;
		scene.add( sub );
	  
      
      
      uniforms = {

        //tDisplacement: { type: "t", value: texture },
        directionalLightColor: { type: "v3", value: new THREE.Vector3(sun.color.r,sun.color.g,sun.color.b) },
        directionalLightDirection: { type: "v3", value: sun.position },
        cameraPosition: { type: "v3", value: camera.position },

      };
      
      underWaterMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        
      } );
      
      var jsonLoader = new THREE.JSONLoader();
      jsonLoader.load( "titanic.js", function ( geometry) {
        titanic = new THREE.Mesh( geometry, underWaterMaterial );
        titanic.rotation.y = -Math.PI / 2;
        scene.add( titanic );
      });
	  
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( window.innerWidth, window.innerHeight );

      container.appendChild( renderer.domElement );
      window.addEventListener( 'resize', onWindowResize, false );
    }
    
    $(document).keydown(function(evt) {
				
				switch (evt.keyCode) 
				{ 
					case 87://w
						up = true;
						break;
					case 65://a
						turnLeft = true;
						break;
					case 83://s
						down = true;
						break;
					case 68://d
						turnRight = true;
						break;
					case 81://q
						rollLeft = true;
						break;
					case 69://e
						rollRight = true;
						break;
					case 32://space
						forward = true;
						break;
					case 16://ctrl
						backward = true;
						break;
					
					default:
						console.log(evt.keyCode);
						break;
				}
			});
	$(document).keyup(function(evt) {
				
				switch (evt.keyCode) 
				{ 
					case 87://w
						up = false;
						break;
					case 65://a
						turnLeft = false;
						break;
					case 83://s
						down = false;
						break;
					case 68://d
						turnRight = false;
						break;
					case 81://q
						rollLeft = false;
						break;
					case 69://e
						rollRight = false;
						break;
					case 32://space
						forward = false;
						break;
					case 16://ctrl
						backward = false;
						break;
					
					default:
						console.log(evt.keyCode);
						break;
				}
			});
	jQuery(document).ready(function($){
		$(document).bind('mousewheel', function(e){
			console.log(e);
			if(e.originalEvent.wheelDelta/120 > 0) {
				cameraOffSet -= .5;
			}
			else{
				cameraOffSet += .5;
			}
		});
	});

    function onWindowResize( event ) {

		renderer.setSize( window.innerWidth, window.innerHeight );

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

    }
    
    function animate() {
				if(turnLeft){
					rotVelocity.z += .001;
				}
				if(turnRight){
					rotVelocity.z -= .001;
				}
				if(rollLeft){
					rotVelocity.y -= .001;
				}
				if(rollRight){
					rotVelocity.y += .001;
				}
				if(up){
					rotVelocity.x -= .001;
				}
				if(down){
					rotVelocity.x += .001;
				}
				
				if(forward && backward){
					
				}
				else if(backward){
					//if(thrust>0){
						thrust -=.002;
					//}
				}
				else if(forward){
					if(thrust<maxThrust){
						thrust +=.002;
					}
				}
				
				var xq = new THREE.Quaternion();
				xq.setFromAxisAngle(new THREE.Vector3(1,0,0),rotVelocity.x);
				var yq = new THREE.Quaternion();
				yq.setFromAxisAngle(new THREE.Vector3(0,1,0),rotVelocity.y);
				var zq = new THREE.Quaternion();
				zq.setFromAxisAngle(new THREE.Vector3(0,0,1),rotVelocity.z);
				
				sub.quaternion.multiply(xq);
				sub.quaternion.multiply(yq);
				sub.quaternion.multiply(zq);
				
				
				var mat = new THREE.Matrix4();
				mat.extractRotation(sub.matrix);
				
			
				var forwardV = (new THREE.Vector3(0,1,0)).applyMatrix4(mat).normalize();
				
			
				
				
				velocity.add(forwardV.clone().multiplyScalar(thrust));
				
				sub.position.add(velocity);
				
				
				camera.position.subVectors( sub.position , forwardV.clone().multiplyScalar(cameraOffSet));
				camera.position.add(new THREE.Vector3(0,cameraOffSet/5,0));
				
				camera.quaternion = sub.quaternion.clone();
				var cameraOffset = new THREE.Quaternion();
				cameraOffset.setFromEuler(new THREE.Vector3(1.57,0,0));
				camera.quaternion.multiply(cameraOffset);
				
				rotVelocity.multiplyScalar(0.975);
				velocity.multiplyScalar(0.98);
				velocity.multiplyScalar(0.95);
				thrust*=.90;
				
		requestAnimationFrame( animate );
		render();
    }
    function render() {
      renderer.render(scene, camera);
    }
