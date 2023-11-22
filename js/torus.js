function makeTorus() {
	var rbend = 1.0;										
	var rbar = 0.5;																				
	torVerts = new Float32Array(floatsPerVertex*(2*barSides*barSlices+2)); //j
    gl.uniform1i(u_u, barSlices);
    gl.uniform1i(u_v, barSlices);
    texCoords = new Float32Array(2*(2*barSides*barSlices+2)); //m
    tangent = new Float32Array(3*(2*barSides*barSlices+2)); //n

	var phi=0, theta=0;									
	var thetaStep = 2*Math.PI/barSlices;	
	var phiHalfStep = Math.PI/barSides;	
	for(s=0,j=0,m=0,n=0; s<barSlices + 1; s++) {	
		for(v=0; v< 2*barSides; v++, j+=floatsPerVertex,m+=2,n+=3) {	

			if(v%2==0)	{	
				torVerts[j  ] = (rbend + rbar*Math.cos((v)*phiHalfStep)) * 
																							Math.cos((s)*thetaStep);
				torVerts[j+1] = (rbend + rbar*Math.cos((v)*phiHalfStep)) *
																							Math.sin((s)*thetaStep);
				torVerts[j+2] = -rbar*Math.sin((v)*phiHalfStep);

				torVerts[j+4] = (rbend + rbar*Math.cos((v)*phiHalfStep)) * 
																							Math.cos((s)*thetaStep);
				torVerts[j+3] = (rbend + rbar*Math.cos((v)*phiHalfStep)) *
																							Math.sin((s)*thetaStep);
				torVerts[j+5] = -rbar*Math.sin((v)*phiHalfStep);
				// torVerts[j+3] = 1.0;	

				// update texture coordinate
                texCoords[m  ] = s*thetaStep/(2*Math.PI);

                texCoords[m+1] = v*phiHalfStep/(2*Math.PI);

                // update tangent
                var x = -(rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.sin((s)*thetaStep);
                var y = (rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.cos((s)*thetaStep);
                var z = 0.0;
                var tmp = Math.sqrt(x*x + y*y + z*z);
                tangent[n  ] = x/tmp;
                tangent[n+1] = y/tmp;
                tangent[n+2] = z/tmp;
			}
			else {			
				torVerts[j  ] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * 
																							Math.cos((s+1)*thetaStep);
				torVerts[j+1] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) *
																							Math.sin((s+1)*thetaStep);
				torVerts[j+2] = -rbar*Math.sin((v-1)*phiHalfStep);

				torVerts[j+4] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * 
																							Math.cos((s+1)*thetaStep);
				torVerts[j+3] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) *
																							Math.sin((s+1)*thetaStep);
				torVerts[j+5] = -rbar*Math.sin((v-1)*phiHalfStep);
				// torVerts[j+3] = 1.0;	
				
                // update texture coordinate
                // texCoords[m  ] = s*thetaStep/(2*Math.PI);
                texCoords[m  ] = (s+1)*thetaStep/(2*Math.PI);

                texCoords[m+1] = (v-1)*phiHalfStep/(2*Math.PI);

                // update tangent
                var x = -(rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.sin((s+1)*thetaStep);
                var y = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.cos((s+1)*thetaStep);
                var z = 0.0;
                var tmp = Math.sqrt(x*x + y*y + z*z);
                tangent[n  ] = x/tmp;
                tangent[n+1] = y/tmp;
                tangent[n+2] = z/tmp;
			}
		}
        // console.log(texCoords)
        // console.log(torVerts[10])
		// cos1 = Math.cos((s + 1) * thetaStep);
		// cos2 = Math.cos((v - 1) * phiHalfStep);
        // sin1 = Math.sin((s + 1) * thetaStep);
		// sin2 = Math.sin((v - 1) * phiHalfStep);
		

		// torVerts[j+3] = Math.random();		
		// torVerts[j+4] = Math.random();	
		// torVerts[j+5] = Math.random();
	}
    torVerts[j  ] = rbend + rbar;
    torVerts[j+1] = 0.0;
    torVerts[j+2] = 0.0;
    // torVerts[j+3] = 1.0;		
    torVerts[j+3] = Math.random();		
    torVerts[j+4] = Math.random();	
    torVerts[j+5] = Math.random();		
    j+=floatsPerVertex; 
    torVerts[j  ] = (rbend + rbar) * Math.cos(thetaStep);
    torVerts[j+1] = (rbend + rbar) * Math.sin(thetaStep);
    torVerts[j+2] = 0.0;
    // torVerts[j+3] = 1.0;		
    torVerts[j+3] = Math.random();		
    torVerts[j+4] = Math.random();		
    torVerts[j+5] = Math.random();	
    // console.log(texCoords);
}

function makeSphere() {
    var slices = 41;
    var sliceVerts = 41;	
    var topColr = new Float32Array([0.5, 0.5, 0.5]);	
    var equColr = new Float32Array([.3, .3, .3]);	 
    var botColr = new Float32Array([1, 1, 1]);
    var sliceAngle = Math.PI / slices;
    sphVerts = new Float32Array(((slices * 2 * sliceVerts) - 2) * floatsPerVertex);
    var cos0 = 0.0;			
    var sin0 = 0.0;
    var cos1 = 0.0;
    var sin1 = 0.0;
    var j = 0;			
    var isLast = 0;
    var isFirst = 1;
    for (s = 0; s < slices; s++) {
        if (s == 0) {
            isFirst = 1;	
            cos0 = 1.0; 	
            sin0 = 0.0;
        }
        else {					
            isFirst = 0;
            cos0 = cos1;
            sin0 = sin1;
        }							
        cos1 = Math.cos((s + 1) * sliceAngle);
        sin1 = Math.sin((s + 1) * sliceAngle);
        if (s == slices - 1) isLast = 1;
        for (v = isFirst; v < 2 * sliceVerts - isLast; v++, j += floatsPerVertex) {
            if (v % 2 == 0) {			
                sphVerts[j] = sin0 * Math.cos(Math.PI * (v) / sliceVerts);
                sphVerts[j + 1] = sin0 * Math.sin(Math.PI * (v) / sliceVerts);
                sphVerts[j + 2] = cos0;
				// sphVerts[j + 3] = 1.0;
            }
            else { 	
                sphVerts[j] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);		
                sphVerts[j + 1] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 2] = cos1;			
				// sphVerts[j + 3] = 1.0;	
            }
            if (s == 0) {	

                sphVerts[j + 3] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 4] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 5] = cos1;
            }
            else if (s == slices - 1) {
                sphVerts[j + 3] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 4] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 5] = cos1;
            }
            else {
                sphVerts[j + 3] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 4] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);
                sphVerts[j + 5] = cos1;
            }

        }
    }
}