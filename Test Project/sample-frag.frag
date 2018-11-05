#version 400
#extension GL_ARB_separate_shader_objects  : enable
#extension GL_ARB_shading_language_420pack : enable

layout( std140, set = 1, binding = 0 ) uniform lightBuf
{
    float uKa;
    float uKd;
    float uKs;
    vec4  uLightPos;
    vec3  uLightSpecularColor;
    float uShininess;
    vec4  uEyePos;
} Light;


layout( std140, set = 2, binding = 0 ) uniform miscBuf
{
	float uTime;
	int   uMode;
    bool  uLightOn;
} Misc;

// opaque must be outside of a uniform block:
// also, can't specify packing
layout( set = 3, binding = 0 ) uniform sampler2D uSampler;

layout ( location = 0 ) in vec3 vColor;
layout ( location = 1 ) in vec2 vTexCoord;
layout ( location = 2 ) in vec3 vN;
layout ( location = 3 ) in vec3 vL;
layout ( location = 4 ) in vec3 vE;

layout ( location = 0 ) out vec4 fFragColor;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void
main()
{
	vec3 rgb = vColor;
	switch( Misc.uMode )
	{
		case 0:
			rgb = vColor;
			break;

		case 1:
			rgb = texture( uSampler, vTexCoord ).rgb;
			break;

		default:
			rgb = vec3( 1., 1., 0. );
	}
    
    vec2 offsetCoord = vec2( vTexCoord.x - 0.5, vTexCoord.y - 0.5 );
    double angle = 0;
    double distance = 0;
    
    if ( offsetCoord.x != 0 ) {
        angle = atan( offsetCoord.x, offsetCoord.y ) / (2*3.14159);
        distance = sqrt( (offsetCoord.x) * (offsetCoord.x) + (offsetCoord.y) * (offsetCoord.y) ) * 2;
        
        angle += (distance * 2.0) / 3.14159;
        angle = mod( angle, 2*3.14159 );
    }
    
    vec3 hsv = vec3( angle, 1.0, 1.0 );
    rgb = hsv2rgb(hsv);

    if ( Misc.uLightOn ) {
        vec3 normal = normalize(vN);
		vec3 lght  = normalize(vL);
		vec3 eye    = normalize(vE);
        
        float d = max( dot(normal, lght), 0. );
        
        float s = 0.;
        if ( dot(normal, lght) > 0. ) {
            vec3 ref = reflect( -lght, normal );
            s = pow( max( dot(eye, ref), 0. ), Light.uShininess );
        }
        
        vec4 ambient = Light.uKa * vec4(rgb, 1.);
        vec4 diffuse = Light.uKd * d * vec4(rgb, 1.);
        vec4 specular = Light.uKs * s * vec4(Light.uLightSpecularColor, 1.);
        
        fFragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
    } else {
        fFragColor = vec4( rgb, 1. );
    }
}
