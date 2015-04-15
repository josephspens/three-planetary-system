function System(systemJSON) {
	this.name = systemJSON.name;
	this.radius = systemJSON.radius;
	this.star = systemJSON.star;
	this.parent = new THREE.Object3D();

	systemJSON.scene.add(this.parent);

	new Globe({
		radius: this.star.radius,
		matrice: true,
		rotation_time: this.star.rotation_time,
		matrice_radius: this.radius,
		parent_el: this.parent,
		satellites: this.star.satellites,
		propagation: this.star.propagation
	});

	return this;
}
