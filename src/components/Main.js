import Globe from './Globe';

var scene;

export function (_scene, systemJSON) {
	scene = _scene;
	this.star = systemJSON.star;
	this.parent = new THREE.Object3D();

	scene.add(this.parent);

	new Globe(_.extend(systemJSON.star, {
		matrice: true,
		matrice_radius: 10000000,
		parent_el: this.parent
	}));

	return this;
}
