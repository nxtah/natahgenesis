precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  float wave = sin((uv.x + uTime * 0.2) * 6.0)
             + sin((uv.y + uTime * 0.15) * 6.0);

  float intensity = 0.4 + 0.3 * wave;

  vec3 color = vec3(
    0.08,
    0.3 + intensity,
    0.6
  );

  gl_FragColor = vec4(color, 1.0);
}
