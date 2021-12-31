uniform highp sampler2D map;
uniform highp float background;
varying highp vec2 vUv;

void main() {

	highp vec2 sampleUV = vUv;
            //float r = 
	//highp float offset = pow(abs(distance(sampleUV,vec2(.5))*.4),2.);
	highp float offset = (.001/pow(distance(sampleUV,vec2(.5)),2.));
	while(sampleUV.x + offset > 1. || sampleUV.y +offset > 1.){
		offset = offset - .001;
	}
	highp vec4 color = texture2D(map, sampleUV, 0.5);

	highp float Rcolor = texture2D(map, sampleUV, 0.0).r;
	highp float Gcolor = texture2D(map, sampleUV + vec2(offset), 0.0).b;
	highp float Bcolor = texture2D(map, sampleUV - vec2(offset), 0.0).g;
	if(color.a < .01){
		color = vec4(vec3(1.-background), 1.);
	}else{
		color=vec4(1.-Rcolor, 1.-Gcolor, 1.-Bcolor, 1.0);
	}



	//gl_FragColor = vec4(Rcolor, Gcolor, Bcolor, 1.0);
	gl_FragColor = vec4(color);

}