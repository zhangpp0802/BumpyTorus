// img_path = "images/bmap.png";
function initVertexBuffers(gl) {
    makeTorus();
    makeSphere();

    mySize = sphVerts.length+torVerts.length;

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

    // setting for uv/tc
    var vbo_uv = gl.createBuffer(); // vert_uv
    if (!vbo_uv) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_uv);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attr_uv, 2, gl.FLOAT, false, 0, 0);

    // setting for tangent
    var vbo_tang = gl.createBuffer();
    if (!vbo_tang) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_tang);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tangent, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attr_tang, 3, gl.FLOAT, false, 0, 0);

    {
        // tex_norm = load_texture("/images/bmap.png");
        tex_norm = load_texture("https://drive.google.com/file/d/1WAYehTpDXVidBBYx0ovelA7SBy_f1Pvj/view?usp=sharing");
        // tex_norm = load_texture("https://www.mbsoftworks.sk/tutorials/opengl3/25-bump-mapping/stone_wall_normal_map.bmp");
        // console.log(tex_norm);
        // tex_norm = load_texture("https://ibb.co/ZHQJGRV");
        // tex_norm = load_texture("https://www.google.com/url?sa=i&url=https%3A%2F%2Flearnopengl.com%2FAdvanced-Lighting%2FNormal-Mapping&psig=AOvVaw1Y0YQIjgvIBCGhEGWTJccM&ust=1700083805202000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCNCm9Ou3xIIDFQAAAAAdAAAAABAE");
    }

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
    attr_uv = gl.getAttribLocation(gl.program, "vert_uv");
    gl.enableVertexAttribArray(attr_uv);  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_uv);
    gl.vertexAttribPointer(attr_uv, 2, gl.FLOAT, false, 0, 0);

    attr_tang = gl.getAttribLocation(gl.program, "vert_tang");
    gl.enableVertexAttribArray(attr_tang);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_tang);
    gl.vertexAttribPointer(attr_tang, 3, gl.FLOAT, false, 0, 0);

    return mySize / floatsPerVertex;	
}

function load_texture(img_path) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([255, 0, 0, 255])); // red

    var img = new Image();
    img.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    // requestCORSIfNotSameOrigin(img, img_path);
    img.crossOrigin = "Anonymous";
    img.src = img_path;
    return tex;
}

function load_texture2(img_path) {
    var tex = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        var nx = 256;
        var ny = 256;
        var r = 32;
        var rsq = r*r;
        var centers = new Uint8Array([64, 64, 192, 64, 64, 192, 192, 192]);
        // var centers = new Uint8Array([4, 4, 5, 5, 6, 6, 8, 8]);

        var colors = [];

        for (var h = 0,cind = 0; h < nx; h++)
        {
            for (var w = 0; w < ny; w++,cind+=3)
            {
                var inside = false;
                for (var c = 0; c < centers.length; c+=2){
                    var x = (h-centers[c]);
                    var y = (w-centers[c+1]);
                    if (x*x+y*y<rsq){
                        colors.push(x/r, y/r, Math.sqrt(rsq - (x*x + y*y))/ r);
                        inside = true;
                    }
                }
                if (inside == false){
                    colors.push(0.0,0.0,1.0);
                }
            }
        }
        for(var i = 0; i < nx*ny; i++){
            colors[i] = 255.0*0.5*(colors[i] + 1.0);
        }

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, nx, ny, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(colors));
    return tex;
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url, window.location.href)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }

  var IntegerToRGB = function (color)
{
    if (color > 16777215)
    {
        //  The color value has an alpha component
        return {
            a: color >>> 24,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
    else
    {
        return {
            a: 255,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
};