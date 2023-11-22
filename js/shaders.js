var VSHADER_SOURCE =
    'precision highp float;\n' +
    'precision highp int;\n' +

    'attribute vec4 a_Position;\n' + // avert
    // 'attribute vec4 a_Color;\n' + 
    'attribute vec4 a_Normal;\n' +  // aNorm
    
    // 'attribute vec3 vert_pos;\n' +
    'attribute vec3 vert_tang;\n' + // aTangent
    'attribute vec2 vert_uv;\n' + // aTexCoord

    'uniform mat4 u_ProjMatrix;\n' + // pmat
    'uniform mat4 u_ModelMatrix;\n' +   //vandmMat
    'uniform mat4 u_NormalMatrix;\n' +   //nMat

    //

    //Uniforms
    'uniform vec3 u_eyePosWorld; \n' +

    // torus wrapping
    'uniform int u_u;\n' +
    'uniform int u_v;\n' +

    //switch lightmode
    'uniform int lightMode;\n' +

    //Material uniforms
    'uniform vec3 u_Ks;\n' +  //specular
    'uniform vec3 u_Ke;\n' +  //emissive
    'uniform vec3 u_Ka;\n' +  //ambience
    'uniform vec3 u_Kd; \n' + //diffuse
    'uniform int u_KShiny;\n' + //shinyness

    //Headlight uniforms
    'uniform vec3 u_HeadlightPosition;\n' +
    'uniform vec3 u_HeadLightDirection;\n' +
    'uniform vec3 u_HeadlightDiffuse;\n' +
    'uniform vec3 u_HeadLightAmbient;\n' + 
    'uniform vec3 u_HeadlightSpecular;\n' +

    //Worldlight uniforms
    'uniform vec3 u_LightPosition;\n' +
    'uniform vec3 u_LightDirection;\n' +
    'uniform vec3 u_AmbientLight;\n' +
    'uniform vec3 u_LightDiffuse;\n' +
    'uniform vec3 u_Specular;\n' +

    'varying vec3 v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' + //v
    'varying vec3 v_Kd;\n' +

    'varying vec2 frag_uv;\n' +  // tc
    'varying vec3 ts_light_pos;\n' + //l
    'varying vec3 ts_view_pos;\n' +  //l
    'varying vec3 minus_v;\n' + 
    // 'varying vec3 ts_frag_pos;\n' + // v_position


    'void main() {\n' +

    //phong shading
    'gl_Position = u_ProjMatrix * u_ModelMatrix * a_Position;\n' +
    'v_Position = vec3(u_ModelMatrix * a_Position);\n' +
    'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    'v_Kd = u_Kd;\n' +
    'frag_uv = vert_uv;\n' +

    //bump map
    'vec3 t = vec3(u_NormalMatrix * vec4(vert_tang,1.0));\n' +
    'vec3 n = vec3(u_NormalMatrix * a_Normal);\n' +
    'vec3 b = cross(n,t);\n' +
    'mat3 tbn = mat3(t, b, n);\n' +
    'v_Position = tbn * (-v_Position);\n' +

    //bump map --
    'ts_light_pos = normalize(tbn * u_LightPosition);\n' +
    'ts_view_pos = normalize(tbn * u_HeadlightPosition);\n' + // this vec3 'change' to camera pos


    //gouraud shading
    'if(lightMode == 3 || lightMode == 4){\n' +

        'vec3 normal = normalize(v_Normal); \n' +
        'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position); \n' +
        
        'vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
        'vec3 hLightDirection = normalize(u_HeadlightPosition - v_Position);\n' +

        'float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
        'float nDotHl = max(dot(hLightDirection, normal),0.0);\n' +

        // for world light
        'vec3 emissiveW;\n' +
        'vec3 diffuseW;\n' +
        'vec3 ambientW;\n' +
        'vec3 specularW;\n' +

        // for head light
        'vec3 emissiveH;\n' +
        'vec3 diffuseH;\n' +
        'vec3 ambientH;\n' +
        'vec3 specularH;\n' +

        'float shineF = float(u_KShiny);\n' +

    //gouraud phong
    'if(lightMode==3){\n' +
        'vec3 W = normalize(lightDirection + eyeDirection); \n' +
        'float nDotW = max(dot(W, normal), 0.0); \n' +
        'float e64W = pow(nDotW, shineF); \n' +

        'vec3 H = normalize(hLightDirection + eyeDirection); \n' +
        'float nDotH = max(dot(H, normal), 0.0); \n' +
        'float e64H = pow(nDotH, shineF*0.5); \n' +

        //world light on objects
        'emissiveW = u_Ke;\n' +
        'ambientW = u_AmbientLight * u_Ka;\n' +
        'specularW = u_Specular * u_Ks * e64W;\n' +
        'diffuseW = u_LightDiffuse * v_Kd * nDotL;\n' +
        'v_Color = emissiveW + ambientW + diffuseW + specularW;\n' +

        //head light on objects
        'emissiveH = u_Ke;\n' +
        'ambientH = u_HeadLightAmbient * u_Ka;\n' +
        'specularH = u_HeadlightSpecular * u_Ks * e64H;\n' +
        'diffuseH = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
        'v_Color = v_Color+ emissiveH + ambientH + diffuseH + specularH;\n' +
    '}\n' +

    //Gouraud Blinn
    'if(lightMode==4){\n' +
        'vec3 refW = normalize(2.0*(normal * nDotL) - lightDirection); \n' +
        'float rDotRW = max(dot(refW, eyeDirection), 0.0); \n' +
        'float e64W = pow(rDotRW, shineF); \n' +

        'vec3 refH = normalize(2.0*(normal * nDotHl) - hLightDirection); \n' +
        'float rDotRH = max(dot(refH, eyeDirection), 0.0); \n' +
        'float e64H = pow(rDotRH, shineF); \n' +

        //world light on objects
        'emissiveW = u_Ke;\n' +
        'ambientW = u_AmbientLight * u_Ka;\n' +
        'specularW = u_Specular * u_Ks * e64W;\n' +
        'diffuseW = u_LightDiffuse * v_Kd * nDotL;\n' +
        'v_Color = emissiveW + ambientW + diffuseW + specularW;\n' +

        //head light on objects
        'emissiveH = u_Ke;\n' +
        'ambientH = u_HeadLightAmbient * u_Ka;\n' +
        'specularH = u_HeadlightSpecular * u_Ks * e64H;\n' +
        'diffuseH = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
        'v_Color = v_Color+ emissiveH + ambientH + diffuseH + specularH;\n' +
    '}\n' +
    '}\n' +
    
'}\n';

var FSHADER_SOURCE =
    'precision highp float;\n' +
    'precision highp int;\n' +

    'varying vec3  v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' + //v
    'varying vec3 v_Kd;\n' +

    //Uniforms
    'uniform vec3 u_eyePosWorld; \n' +

    //Material uniforms
    'uniform vec3 u_Ks;\n' + 
    'uniform vec3 u_Ke;\n' + 
    'uniform vec3 u_Ka;\n' + 
    'uniform vec3 u_Kd; \n' + 
    'uniform int u_KShiny;\n' +

    //Worldlight uniforms
    'uniform vec3 u_LightPosition;\n' + 
    'uniform vec3 u_LightDirection;\n' +
    'uniform vec3 u_LightDiffuse;\n' +  
    'uniform vec3 u_AmbientLight;\n' +  
    'uniform vec3 u_Specular;\n' +

    //Headlight uniforms
    'uniform vec3 u_HeadLightDirection;\n' +
    'uniform vec3 u_HeadlightPosition;\n' + 
    'uniform vec3 u_HeadlightDiffuse;\n' + 
    'uniform vec3 u_HeadLightAmbient;\n' + 
    'uniform vec3 u_HeadlightSpecular;\n' +

    //switch lightmode
    'uniform int lightMode;\n' +
    'uniform int headlightOn;\n' +
    'uniform int worldLightOn;\n' +

    // torus wrapping
    'uniform int u_u;\n' +
    'uniform int u_v;\n' +

    // bump map
    'uniform sampler2D tex_norm;\n' +

    //bump map
    'varying vec2 frag_uv;\n' + //tc
    'varying vec3 ts_light_pos;\n' + //l
    'varying vec3 ts_view_pos;\n' + //l

    'void main(){ \n' +
    'vec3 v_pos = normalize(v_Position);\n' + //v
    //phong shading
    'if(lightMode==1 || lightMode==2){\n' +
        'vec3 eyeDirection = normalize(u_eyePosWorld.xyz + v_pos); \n' +
        // bump map --
        // 'vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
        // 'vec3 hLightDirection = normalize(u_HeadlightPosition - v_Position);\n' +
        'vec3 lightDirection = normalize(ts_light_pos - v_Position);\n' +
        'vec3 hLightDirection = normalize(ts_view_pos - v_Position);\n' +

        'float default_u = 1.0;\n' + 
        'float default_v = 1.0;\n' +

        'vec2 uv = vec2(float(u_u)*default_u*frag_uv.x, float(u_v)*default_v*frag_uv.y);\n' +
        'vec3 normal = normalize(texture2D(tex_norm, uv).rgb * 2.0 - vec3(1.0));\n' + //N
        // end bump

        'float nDotL = max(dot(normal,lightDirection), 0.0); \n' +
        'float nDotHl = max(dot(normal, hLightDirection),0.0);\n' +

        // for world light
        'vec3 emissiveW;\n' +
        'vec3 diffuseW;\n' +
        'vec3 ambientW;\n' +
        'vec3 specularW;\n' +

        // for head light
        'vec3 emissiveH;\n' +
        'vec3 diffuseH;\n' +
        'vec3 ambientH;\n' +
        'vec3 specularH;\n' +

        'float shineF = float(u_KShiny);\n' +

        'vec4 headFrag;\n' +
        'vec4 worldFrag;\n' +
    
        //Blinn Phong
        'if(lightMode==2){\n' +
            'vec3 W = normalize(lightDirection + eyeDirection); \n' +
            'float nDotW = max(dot(W, normal), 0.0); \n' +
            'float e64W = pow(nDotW, shineF); \n' +

            'vec3 H = normalize(hLightDirection + eyeDirection); \n' +
            'float nDotH = max(dot(H, normal), 0.0); \n' +
            'float e64H = pow(nDotH, shineF*0.5); \n' + // spec

            'vec3 hdiff = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
            'vec3 hspec = u_HeadlightSpecular * u_Ks * e64H;\n' +

            //world light on objects
            'emissiveW = u_Ke;\n' +
            'ambientW = u_AmbientLight * u_Ka;\n' +
            'specularW = u_Specular * u_Ks * e64W;\n' +
            'diffuseW = u_LightDiffuse * v_Kd * nDotL;\n' +
            'worldFrag = vec4((emissiveW + ambientW + diffuseW + specularW), 1.0);\n' +

            //head light on objects
            'emissiveH = u_Ke;\n' +
            'ambientH = u_HeadLightAmbient * u_Ka;\n' +
            'specularH = u_HeadlightSpecular * u_Ks * e64H;\n' +
            'diffuseH = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
            'headFrag = vec4((emissiveH + ambientH + hdiff*diffuseH + hspec*specularH), 1.0);\n' +
            // 'headFrag = vec4((emissiveW + ambientW + diffuseW + specularW), 1.0);\n' +
        '}\n' +

        // phong phong
        'if(lightMode == 1){\n'+
            'vec3 refW = reflect(-lightDirection,normal); \n' +
            'float rDotRW = max(dot(refW, vec3(v_pos)), 0.0); \n' +
            'float e64W = pow(rDotRW, shineF*0.3); \n' +

            'vec3 refH = reflect(hLightDirection,normal); \n' +
            'float rDotRH = max(dot(refH, vec3(v_pos)), 0.0); \n' +
            'float e64H = pow(rDotRH, shineF*0.3); \n' +

            'vec3 hdiff = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
            'vec3 hspec = u_HeadlightSpecular * u_Ks * e64H;\n' +

            //world light on objects
            'emissiveW = u_Ke;\n' +
            'ambientW = u_AmbientLight * u_Ka;\n' +
            'specularW = u_Specular * u_Ks * e64W;\n' +
            'diffuseW = u_LightDiffuse * v_Kd * nDotL;\n' +
            'worldFrag = vec4((emissiveW + ambientW + diffuseW + specularW), 1.0);\n' +

            //head light on objects
            'emissiveH = u_Ke;\n' +
            'ambientH = u_HeadLightAmbient * u_Ka;\n' +
            'specularH = u_HeadlightSpecular * u_Ks * e64H;\n' +
            'diffuseH = u_HeadlightDiffuse * v_Kd * nDotHl;\n' +
            'headFrag = vec4((emissiveH + ambientH + hdiff*diffuseH + hspec*specularH), 1.0);\n' +
        '}\n' +

        'vec4 frag;\n' +
        //headlight and world light determine
        'if(headlightOn == 1 && worldLightOn == 1){\n' +
            'frag = headFrag + worldFrag;\n' +
        '}\n' +
        'else if(headlightOn == 1 && worldLightOn == 0){\n' +
            'frag = headFrag;\n' +
        '}\n' +
        'else{\n' +
            'frag = worldFrag;\n' +
        '}\n' +
        'gl_FragColor = frag;\n' +

    '}\n' +

    // gouraud
    'else{\n'+
        'gl_FragColor = vec4(v_Color, 1.0);\n' +
    '}\n' +
'}\n';
