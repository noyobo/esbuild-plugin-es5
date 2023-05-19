################################################################################
# This builds Sucrase using esbuild and then uses it to run Sucrase's test suite

github/sucrase:
	mkdir -p github/sucrase
	cd github/sucrase && git init && git remote add origin https://github.com/alangpierce/sucrase.git
	cd github/sucrase && git fetch --depth 1 origin a4a596e5cdd57362f309ae50cc32a235d7817d34 && git checkout FETCH_HEAD

demo/sucrase: | github/sucrase
	mkdir -p demo
	cp -r github/sucrase/ demo/sucrase
	cd demo/sucrase && npm i && npm i @swc/helpers -D
	cd demo/sucrase && find test -name '*.ts' | sed 's/\(.*\)\.ts/import ".\/\1"/g' > all-tests.ts
	echo '{}' > demo/sucrase/tsconfig.json # Sucrase tests fail if tsconfig.json is respected due to useDefineForClassFields

test-sucrase:  demo/sucrase
	cd demo/sucrase && node ../../scripts/build.js all-tests.ts --bundle --platform=node --outfile=out.js && npx mocha out.js
	cd demo/sucrase && node ../../scripts/build.js all-tests.ts --bundle --platform=node --minify --outfile=out.js && npx mocha out.js


################################################################################
# three.js demo

github/three:
	mkdir -p github
	git clone --depth 1 --branch r108 https://github.com/mrdoob/three.js.git github/three

demo/three: | github/three
	mkdir -p demo/three
	cp -r github/three/src demo/three/src

demo-three: demo-three-esbuild demo-three-esbuild-es5

demo-three-esbuild: demo/three
	rm -fr demo/three/esbuild
	time -p npx esbuild --bundle --global-name=THREE --sourcemap --minify demo/three/src/Three.js --outfile=demo/three/esbuild/Three.esbuild.js
	du -h demo/three/esbuild/Three.esbuild.js*
	shasum demo/three/esbuild/Three.esbuild.js*

demo-three-esbuild-es5: demo/three
	rm -fr demo/three/esbuild
	time -p node ./scripts/build.js demo/three/src/Three.js --bundle --global-name=THREE --sourcemap --minify --outfile=demo/three/esbuild/Three.esbuild.js
	du -h demo/three/esbuild/Three.esbuild.js*
	shasum demo/three/esbuild/Three.esbuild.js*
