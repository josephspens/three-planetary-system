function Globe(globe) {
	this.name = globe.name;
	this.radius = globe.radius / 100;
	this.revolution_time = globe.revolution_time || 0;
	this.rotation_time = globe.rotation_time * 10;
	this.animation_functions = [];
	this.satellitesData = globe.satellites || [];
	this.satellites = [];
	this.axis_one = new THREE.Object3D();
	this.pivot = new THREE.Object3D();
	this.axis_two = new THREE.Object3D();
	// z-axis tilt
	// this.axis_one.rotation.x = (Math.PI / 180) * (globe.rotation || 0);
	if (globe.rotation) {
		this.pivot.rotation.y = (Math.PI / 180) * -50;
	}

	globe.coordinates = (globe.coordinates ? globe.coordinates: [0, 0, 0]);
	this.x = globe.type === 'Moon' ? globe.coordinates[0] * 10000 + globe.parent.radius : globe.coordinates[0] * 10000;
	this.y = globe.coordinates[1];
	this.z = globe.coordinates[2];
	this.axis_two.position.set(this.x, 0, this.z);
	this.matrice_radius = globe.matrice_radius || 1000;

	this.propagation_struct = {
		current_radius: 0,
		circle: null,
		max: 0,
		min: 0,
		speed: 0
	};

	_.extend(this.propagation_struct, globe.propagation);

	this.scene = globe.scene || null;
	this.is_satellite = globe.is_satellite || false;

	// Is the center of the solar system
	if (globe.parent_el && this.is_satellite == false) {
		globe.parent_el.add(this.axis_two);
	}
	// It's a satellite
	else if (globe.parent_el && this.is_satellite) {
		this.axis_one.add(this.pivot);
		this.pivot.add(this.axis_two);
		globe.parent_el.add(this.axis_one);
	}

	this.drawGlobe();
	this.buildSatellites();
	this.fuseAnimationWithObject();
	this.drawRevolutionCircle();

	if (this.propagation_struct.enabled == true) {
		this.animation_functions.push(_.bind(function () { this.propagation(); }, this));
		this.propagation();
	}

	return this;
}

Globe.prototype.buildSatellites = function () {
	this.satellitesData.forEach(function (dt) {
		dt['is_satellite'] = true;
		dt['scene'] = scene;
		dt.parent_el = this.axis_two;
		dt.parent = this;
		new Globe(dt);
	}, this);
}

//
// It's an array of function to be executed for animation
//
Globe.prototype.fuseAnimationWithObject = function () {
	// Self rotation
	this.animation_functions.push(_.bind(function () {
		this.planet.rotation.y += 1 / this.rotation_time;
	}, this));

	// Planet rotation around star
	if (this.pivot) {
		this.animation_functions.push(_.bind(function () {
			this.pivot.rotation.y += 1 / this.revolution_time;
		}, this));
	}

	// Inject functions array
	this.axis_two.animate = _.bind(function () {
		this.animation_functions.forEach(function (dt) { dt(); });
	}, this);
};

Globe.prototype.drawRevolutionCircle = function () {
	var circle = new THREE.Shape();
	circle.moveTo(this.x, 0);
	circle.absarc(0, 0, this.x, 0, Math.PI * 2, false);
	// circle.absellipse(0, 0, this.x, this.x * 2, 0, Math.PI * 2, false);

	var points = circle.createPointsGeometry(100);
	v_circle = new THREE.Line(points, new THREE.LineBasicMaterial({
		color: 0xeeeeee,
		opacity: 0.1,
		linewidth: 2
	}));

	v_circle.rotation.set(Math.PI/2, 0, 0);

	this.axis_one.add(v_circle);
}

Globe.prototype.drawGlobe = function () {
	var geometry = new THREE.SphereGeometry(this.radius, 16, 16);
	var material = new THREE.MeshBasicMaterial({
		color: 0x91FFFE,
		wireframe: true
	});

	this.planet = new THREE.Mesh(geometry, material);
	this.axis_two.add(this.planet);
}

Globe.prototype.projectDraw = function () {
	var geometry2 = new THREE.Geometry();
	geometry2.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry2.vertices.push(new THREE.Vector3(0, -this.y, 0));

	var line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({
		color: 0xeeeeee,
		opacity: 0.3
	}));

	var tmp_sphere = new THREE.Shape();
	tmp_sphere.moveTo(200, 0 );
	tmp_sphere.absarc(0, 0, 200, 0, Math.PI * 2, false);

	var points = tmp_sphere.createPointsGeometry(100);
	var circle = new THREE.Line(points, new THREE.LineBasicMaterial({
		color: 0xeeeeee,
		opacity: 0.2,
		linewidth: 1
	}));

	circle.rotation.set(Math.PI/2, 0, 0);
	circle.position.set(0, -this.y, 0);

	this.axis_two.add(circle);
	this.axis_two.add(line2);
}

Globe.prototype.propagation = function () {
	var prop = this.propagation_struct;

	if (prop.current_radius > prop.max || prop.current_radius == 0) {
		prop.current_radius = prop.min;
	} else {
		prop.current_radius += prop.speed;
	}

	this.axis_two.remove(prop.circle);

	var tmp_sphere = new THREE.Shape();
	tmp_sphere.moveTo(prop.current_radius, 0 );
	// tmp_sphere.absellipse(0, 0, prop.current_radius, prop.current_radius * 2, 0, Math.PI * 2, false);
	tmp_sphere.absarc(0, 0, prop.current_radius, 0, Math.PI*2, false);

	var points = tmp_sphere.createPointsGeometry(100);
	prop.circle = new THREE.Line(points, new THREE.LineBasicMaterial({
		color: 0xeeeeee,
		opacity: 0.8 - (prop.current_radius / (prop.max - prop.min)),
		linewidth: 1
	}));

	prop.circle.rotation.set(Math.PI/2, 0, 0);
	this.axis_two.add(prop.circle);
}
