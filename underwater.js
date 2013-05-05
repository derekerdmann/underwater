if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    
    var container;

    var camera, scene, renderer;
    var uniforms, underWaterMaterial;
    var sun;
    
    var anim = true;

    var titanic;
    
    
    var array;
    var type;
    
    init();
    animate();
  
    function init() {
    
      container = document.createElement( 'div' );
      document.body.appendChild( container );
      
      camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 1000);
      camera.position.set( 0, 20, 99 );

      scene = new THREE.Scene();
      sun = new THREE.DirectionalLight(0xffffff);
      sun.position.set(2,2,2);
      scene.add( sun );
      
      
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
      jsonLoader.load( "titanic.js", function ( geometry, materials ) {
        var material = new THREE.MeshFaceMaterial( materials );
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
          //mesh.rotation.x -= .02;
          camera.position.y += .5;
          break;
        case 65://a
          titanic.rotation.y -= .02;
          //camera.position.x -= .05;
          break;
        case 83://s
          //mesh.rotation.x += .02;
          camera.position.y -= .5;
          break;
        case 68://d
          titanic.rotation.y += .02;
          //camera.position.x += .05;
          break;
        case 73://d
          camera.position.z -= .07;
          break;
        case 79://d
          camera.position.z += .07;
          break;
        case 32://space
          anim = !anim;
          break;
        default:
          console.log(evt.keyCode);
          break;
      }
    });
    jQuery(document).ready(function($){
      $(document).on('mousewheel', function(e){
        if(e.originalEvent.wheelDelta/120 > 0) {
          camera.position.z -= .07;
        }
        else{
          camera.position.z += .07;
        }
      });
    });
    
    function onWindowResize( event ) {

      //uniforms.resolution.value.x = window.innerWidth;
      //uniforms.resolution.value.y = window.innerHeight;

      renderer.setSize( window.innerWidth, window.innerHeight );

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

    }
    
    function animate() {
      if(anim){
        
      }
      requestAnimationFrame( animate );
      render();
    }
    function render() {
      renderer.render(scene, camera);
    }
