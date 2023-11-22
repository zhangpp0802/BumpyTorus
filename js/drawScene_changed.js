function draw() {

    // Clear canvas color AND DEPTH buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //head light
    gl.uniform3f(u_HeadlightPosition, g_EyeX, g_EyeY, g_EyeZ);
    // gl.uniform3f(u_LightPosition, usrPosX, usrPosY, usrPosZ);
    gl.uniform3f(u_HeadlightAmbient, usrAmbiR, usrAmbiG, usrAmbiB);
    gl.uniform3f(u_HeadlightDiffuse, usrDiffR, usrDiffG, usrDiffB);
    gl.uniform3f(u_HeadlightSpecular, usrSpecR, usrSpecG, usrSpecB);
    gl.uniform1i(hlOn, 1);

    //world light
    gl.uniform1i(wLOn, 1);
    gl.uniform3f(u_AmbientLight, usrAmbiR, usrAmbiG, usrAmbiB);
    gl.uniform3f(u_LightDiffuse, usrDiffR, usrDiffG, usrDiffB);
    gl.uniform3f(u_Specular, usrSpecR, usrSpecG, usrSpecB);
    gl.uniform3f(u_LightPosition, usrPosX, usrPosY, usrPosZ);

    gl.viewport(0,						
				0, 		
  				canvas.width, 			
  				canvas.height);		

    var vpAspect = canvas.width /		
								(canvas.height);		

    // For this viewport, set camera's eye point and the viewing volume:
    projMatrix.setPerspective(35.0,vpAspect,1.0,100.0); 

    // but use a different 'view' matrix:
    modelMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 
                        g_AtX, g_AtY, g_AtZ,             
                        0, 0, 1);              

    // Pass the view projection matrix to our shaders:
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniform3f(u_HeadlightPosition, g_EyeX, g_EyeY, g_EyeZ);

    drawMyScene();
}

function drawMyScene() {
    modelMatrix.scale(0.2, 0.2, 0.2);
    // console.log(modelMatrix);
    pushMatrix(modelMatrix);

    //Torus linked above
    modelMatrix.translate(1, 1, 0);
    modelMatrix.scale(4,4,4);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);


    gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
    gl.uniform3f(u_Ka, 1.0, 1.0, 1.0);
    gl.uniform3f(u_Kd, 1.0, 1.0, 1.0);
    gl.uniform3f(u_Ks, 1.0, 1.0, 1.0);
    gl.uniform1i(u_KShiny, 100);
    // gl.uniform3f(u_Ke, 0,0,0);
    // gl.uniform3f(u_Ka, 255/255, 194/255, 12/255);
    // gl.uniform3f(u_Kd, 0.3, 0.3, 0.3);
    // gl.uniform3f(u_Ks,0.5,     0.5,    0.5);
    gl.drawArrays(gl.TRIANGLE_STRIP, torStart / floatsPerVertex, torVerts.length / floatsPerVertex);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    //Sphere at (0,0,0)
    modelMatrix.translate(5.0, 5.0, 0.0);
    modelMatrix.rotate(currentAngle, 1, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
 
    gl.uniform3f(u_Ke, 0,0,0);
    gl.uniform3f(u_Ka, 255/255, 194/255, 12/255);
    gl.uniform3f(u_Kd, 0.3, 0.3, 0.3);
    gl.uniform3f(u_Ks,0.5,     0.5,    0.5);
    gl.drawArrays(gl.TRIANGLE_STRIP, sphereStart / floatsPerVertex, sphVerts.length / floatsPerVertex);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
}