(function () {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var camera, controls, scene, renderer, solarSystem;

	THREEx.Planets.baseURL = '';

	Global = {};

	Global.init = function (data) {
		var container;

		camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 19, 6000000);
		camera.position.set(300000, 60000, 500);
		camera.rotation.set(Math.PI/4, 0, 0);
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = '0';
		container = document.getElementById('container');
		container.appendChild(renderer.domElement);

		window.addEventListener('resize', this.onWindowResize, false);

		addCoordinateAxes(scene, 150);

		controls = new THREE.TrackballControls(camera);
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 0.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		controls.keys = [ 65, 83, 68 ];

		this.animate();
		solarSystem = new THREE.PlanetarySystem(scene, data);
		// $.getJSON('/asteroid', { key: '2004 DG2' }, _.bind(this.addAsteroids, this));
		this.addAsteroids();

		// Add star field
		// var starField = THREEx.Planets.createStarfield();
		// starField.scale.x = 10000;
		// starField.scale.y = 10000;
		// starField.scale.z = 10000;
		// scene.add(starField);
	};

	Global.onWindowResize = function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		if (controls) {
			controls.handleResize();
		}
	};

	Global.animate = function () {
		requestAnimationFrame(Global.animate);

		if (solarSystem) {
			solarSystem.parent.traverse(function (child) {
				if (child.animate) {
					child.animate();
				}
			});
		}

		if (controls) {
			controls.update();

			renderer.render(scene, camera);
		}
	};

	Global.addAsteroids = function (asteroids) {
		// Input might be an array of asteroids or a single asteroid
		// asteroids = _.isArray(asteroids) ? asteroirds : [asteroids];

		// asteroids.forEach(function (asteroid) {
			var circle = new THREE.Shape();
			// var semiMajorAxis = asteroid.semiMajorAxis * 10000;
			circle.moveTo(1.5, 0);
			circle.absarc(0, 0, 1, 0, Math.PI * 2, false);

			var points = circle.createPointsGeometry(100);
			v_circle = new THREE.Line(points, new THREE.LineBasicMaterial({
				color: 0xeeeeee,
				opacity: 0.5,
				linewidth: 5
			}));

			v_circle.rotation.set(Math.PI/2, 0, 0);

			scene.add(v_circle);
		// });
	};

	function addCoordinateAxes(objecto, size) {
		size = (typeof size === 'undefined' ? 50 : size);

		function v(x,y,z) { return new THREE.Vector3(x,y,z); }

		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(
			v(-size, 0, 0), v(size, 0, 0),
			v(0, -size, 0), v(0, size, 0),
			v(0, 0, -size), v(0, 0, size)
		);

		var lineMat = new THREE.LineBasicMaterial({
			color: 0x000000,
			lineWidth: 1
		});
		var line = new THREE.Line(lineGeo, lineMat);
		line.type = THREE.Lines;
		objecto.add(line);
	}

	$.getJSON('demo.json', _.bind(Global.init, Global));
})();
