rm -rf docs2/*
cp -r build/images/ build/scripts/ build/fonts/ build/styles/ build/index.html docs2/
cp CNAME2 docs2/
cd docs2
surge
