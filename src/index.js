import $ from 'jquery/dist/jquery';
import Global from './components/Global';

if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
}

var camera, controls, scene, renderer, solarSystem;

THREEx.Planets.baseURL = '';

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
