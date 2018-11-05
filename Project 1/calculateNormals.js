p = [[1,-1,0.5],
    [-1,-1,0.5],
    [0,-1,-1]]

function length(p) {
	return Math.sqrt((p[0] * p[0]) + (p[1] * p[1]) + (p[2] * p[2]));
}

function normalize(p) {
	var vecLength = length(p);
  var normVec = [p[0], p[1], p[2]];
  
  if ( vecLength != 0 ) {
  	normVec[0] /= vecLength;
    normVec[1] /= vecLength;
    normVec[2] /= vecLength;
  }
  
  return normVec;
}

function calcNormal(p) {
  var u = [0, 0, 0];
  var v = [0, 0, 0];
    
  u[0] = p[1][0] - p[0][0];
  u[1] = p[1][1] - p[0][1];
  u[2] = p[1][2] - p[0][2];
    
  v[0] = p[2][0] - p[0][0];
  v[1] = p[2][1] - p[0][1];
  v[2] = p[2][2] - p[0][2];
   
  var normal = [0, 0, 0];
  
  normal[0] = (u[1] * v[2]) - (u[2] * v[1]);
  normal[1] = (u[2] * v[0]) - (u[0] * v[2]);
  normal[2] = (u[0] * v[1]) - (u[1] * v[0]);
    
  return normalize(normal);
}

console.log(calcNormal(p));