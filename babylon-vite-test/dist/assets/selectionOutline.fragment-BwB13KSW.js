import{aV as t}from"./index-Bj1nM5Sr.js";const e="selectionOutlinePixelShader",o=`uniform sampler2D maskSampler;uniform sampler2D depthSampler;varying vec2 vUV;uniform vec2 screenSize;uniform vec3 outlineColor;uniform float outlineThickness;uniform float occlusionStrength;uniform float occlusionThreshold;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec2 texelSize=1.0/screenSize;vec2 sampleOffset=texelSize*outlineThickness;vec2 centerMask=texture2D(maskSampler,vUV).rg;vec2 maskX=texture2D(maskSampler,vUV+vec2(sampleOffset.x,0.0)).rg;vec2 maskY=texture2D(maskSampler,vUV+vec2(0.0,sampleOffset.y)).rg;vec2 maskXY=texture2D(maskSampler,vUV+sampleOffset).rg;vec3 gradient=vec3(
centerMask.r-maskX.r,
centerMask.r-maskY.r,
centerMask.r-maskXY.r
);float edgeStrength=length(gradient);float outlineMask=step(0.1,edgeStrength); 
float depthCenter=texture2D(depthSampler,vUV).r;float depthX=texture2D(depthSampler,vUV+vec2(sampleOffset.x,0.0)).r;float depthY=texture2D(depthSampler,vUV+vec2(0.0,sampleOffset.y)).r;float depthXY=texture2D(depthSampler,vUV+sampleOffset).r;float occlusionCenter=step(occlusionThreshold,abs(centerMask.g-depthCenter));float occlusionX=step(occlusionThreshold,abs(maskX.g-depthX));float occlusionY=step(occlusionThreshold,abs(maskY.g-depthY));float occlusionXY=step(occlusionThreshold,abs(maskXY.g-depthXY));float occlusionFactor=min(min(occlusionCenter,occlusionX),min(occlusionY,occlusionXY));float finalOutlineMask=outlineMask*(1.0-occlusionStrength*occlusionFactor);gl_FragColor=vec4(outlineColor,finalOutlineMask);
#define CUSTOM_FRAGMENT_MAIN_END
}
`;t.ShadersStore[e]||(t.ShadersStore[e]=o);const r={name:e,shader:o};export{r as selectionOutlinePixelShader};
