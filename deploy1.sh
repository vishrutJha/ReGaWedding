rm -rf docs/*
cp -r build/images/ build/scripts/ build/fonts/ build/styles/ build/index.html docs/
cp CNAME docs/
cd docs
surge
