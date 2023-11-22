# Bump Map Spinning Torus
## Author: Yiran Zhang, Hairong Yin
* Checkpoint 1: We implemented a spinning torus with random color assign on each vertex and a spinning tretegon with gradient changing color 
in the scene. They both spin with the same initial angle. For user interaction, they can change the spinning speed or choose run and stop for them.
Users can also change the objects' rotation through mouse interaction.
* Checkpoint 2: We added lighting sources, camera, and we fixed the tessallation of our torus. We deleted the tretegon because they have little vertices.
We also deleted the previous mouse interaction due to we added the slider bars for lighting (diffuse, ambient, specular, and position) interaction. However,
the specular light acts weird in this stage.
* Checkpoint 3: We fix the specular lighting from the shader file. Then, we added front-end interaction to add and reduce the slices of torus tessellation, 
and started implementing the bumpy map. You can see the video named bumpTorus of this final result with a strippy uv map as our input.
* Feel Free to download and play with it ~
