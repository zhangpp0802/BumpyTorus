
function initVertexBuffers(gl) {
    makeTorus();
    makeSphere();

    mySize = sphVerts.length+torVerts.length;
    // mySize = torVerts.length;

    var nn = mySize / floatsPerVertex;
    console.log('nn is', nn, 'mySize is', mySize, 'floatsPerVertex is', floatsPerVertex);

    var vertices = new Float32Array(mySize);
    //torus
    torStart = 0;
    for (i = 0,j = 0; j < torVerts.length; i++, j++) {
        vertices[i] = torVerts[j];
    }
    //sphere
    sphereStart = i;
    for (j = 0; j < sphVerts.length; i++, j++) {
        vertices[i] = sphVerts[j];
    }


    // Create a vertex buffer object (VBO)
    var vertexColorbuffer = gl.createBuffer();
    if (!vertexColorbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    // Write vertex information to buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // gl.uniform1i(gl.getUniformLocation(prog, "uTexSamp"), 0);

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
 
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * floatsPerVertex, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return -1;
    }
    // vertexAttribPointer(index, size, type, normalized, stride, offset)
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * floatsPerVertex, FSIZE * 3);
    gl.enableVertexAttribArray(a_Normal);

    // setting bump map shader attribute
    // setting for uv/tc
    // var tcbuffer = gl.createBuffer(); // vert_uv
    // if (!tcbuffer) {
    //     console.log('Failed to create the buffer object');
    //     return -1;
    // }
    
    // gl.bindBuffer(gl.ARRAY_BUFFER, tcbuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    // var attr_tang = gl.getAttribLocation(gl.program, "vert_uv");
    // gl.vertexAttribPointer(attr_tang, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(attr_tang);  

    // setting for tangent
    // var vbo_tang = gl.createBuffer();
    // if (!vbo_tang) {
    //     console.log('Failed to create the buffer object');
    //     return -1;
    // }
    
    // gl.bindBuffer(gl.ARRAY_BUFFER, vbo_tang);
    // gl.bufferData(gl.ARRAY_BUFFER, tangent, gl.STATIC_DRAW);
    // var attr_tang = gl.getAttribLocation(gl.program, "vert_tang");
    // gl.enableVertexAttribArray(attr_tang);
    // gl.bindBuffer(gl.ARRAY_BUFFER, vbo_tang);
    // gl.vertexAttribPointer(attr_tang, 3, gl.FLOAT, false, 0, 0);

    return mySize / floatsPerVertex;	
}