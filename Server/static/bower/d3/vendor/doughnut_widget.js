function radialProgress(parent, height, label,type) {
    var _data=null,
        _duration= 1000,
        _selection,
        __width = height,
        __height = height,
        _diameter = height,
        // _margin = {top:0, right:0, bottom:0, left:0},
        _margin = {top:height * 0.08, right:0, bottom:0.2 * height, left:0},
        _label= label,
        _type = type,
        _direction = 1,
        _fontSize=10;


    var _mouseClick;

    var _value= 0,
        _minValue = 0,
        _maxValue = 100;

    var  _currentArc= 0, _currentArc2= 0, _currentValue=0;

    var _arc = d3.svg.arc()
        .startAngle(0 * (Math.PI/180)); //just radians

    var _arc2 = d3.svg.arc()
        .startAngle(0 * (Math.PI/180))
        .endAngle(0); //just radians


    _selection=d3.select(parent);


    function component() {

        _selection.each(function (data) {
            // if(!svg){
            //     svg = d3.select(this).append('svg')
            // };

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            var enter = svg.enter().append("svg").attr("class","radial-svg").append("g");

            measure();

            svg.attr("width", __width)
                .attr("height", __height);


            var background = enter.append("g").attr("class","graph-donut")
                .attr("cursor","pointer")
                .on("click",onMouseClick);


            _arc.endAngle(360 * (Math.PI/180))

            background.append("rect").attr("class","graph-background");
            svg.select(".graph-background")
                .attr("width", _width)
                .attr("height", _height);

            background.append("path").attr("class", "graph-donut-path");
            svg.select(".graph-donut-path")
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc);

            
            var background_text = background.append("text").attr("class", "graph-donut-name");
            background_text = svg.select(".graph-donut-name");
            background_text.attr("transform", "translate(" + _width/2 + "," + (_width + height*0.2) + ")")
                // .attr("font-size", height*0.058)
                .text(_label);

            _arc.endAngle(_currentArc);


            background.append("path")
                .attr("class", "graph-donut-arc");

            var path = svg.select(".graph-donut-arc")
                .attr("width", _width)
                .attr("height", _height);
            var path = svg.select(".graph-donut-arc")
                .data(data);
            path.attr("class","graph-donut-arc")
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc);



            background.append("text").attr("class", "graph-donut-label");
            var label = svg.select(".graph-donut-label").data(data);
            label.attr("class","graph-donut-label")
                .attr("y",_width/2+_fontSize/3)
                .attr("x",_width/2)
                .attr("cursor","pointer")
                .attr("width",_width)
                // .attr("x",(3*_fontSize/2))
                .text(function (d) { return Math.round((_value-_minValue)/(_maxValue-_minValue)*100) + "%" })
                .style("font-size",_fontSize+"px")
                .on("click",onMouseClick);



            var g = svg.select("g")
                .attr("transform", "translate(" + (_margin.bottom + _margin.top)/2 + "," + _margin.top + ")");

            path.exit().transition().duration(500).attr("x",1000).remove();


            layout(svg);

            function layout(svg) {

                var ratio=(_value-_minValue)/(_maxValue-_minValue);
                var endAngle=Math.min(360*ratio,360);
                endAngle=endAngle * Math.PI/180;

                path.datum(endAngle);
                path.transition().duration(_duration)
                    .attrTween("d", arcTween);

                // if (ratio > 1) {
                //     path2.datum(Math.min(360*(ratio-1),360) * Math.PI/180);
                //     path2.transition().delay(_duration).duration(_duration)
                //         .attrTween("d", arcTween2);
                // }

                label.datum(Math.round(ratio*100));
                label.transition().duration(_duration)
                    .tween("text",labelTween);

            }

        });

        function onMouseClick(d) {
            if (typeof _mouseClick == "function") {
                _mouseClick.call();
            }
        }
    }

    function labelTween(a) {
        var i = d3.interpolate(_currentValue, a);
        _currentValue = i(0);

        return function(t) {
            _currentValue = i(t);
            this.textContent = Math.round(i(t)) + "%";
        }
    }

    function arcTween(a) {
        var i = d3.interpolate(_currentArc, a);

        return function(t) {
            _currentArc=i(t);
            return _arc.endAngle(_direction * i(t))();
        };
    }

    function measure() {
        _width=_diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
        _height=_width;
        _fontSize=_width*.2;
        _arc.outerRadius(_width/2);
        if (_type) {
            if (_type == 'Pie') {
                _innerRadiusOffset = 0;
                _direction = -1;
            } else{
                _innerRadiusOffset = 0.65;
                _direction = 1;
            };
        } else{
            _innerRadiusOffset = 0.65;
            _direction = 1;
        };
        _arc.innerRadius(_width/2 * _innerRadiusOffset);
        // _arc2.outerRadius(_width/2 * .85);
        // _arc2.innerRadius(_width/2 * .85 - (_width/2 * .15));
    }


    component.render = function() {
        measure();
        component();
        return component;
    }

    component.value = function (_) {
        if (!arguments.length) return _value;
        _value = [_];
        _selection.datum([_value]);
        return component;
    }


    component.margin = function(_) {
        if (!arguments.length) return _margin;
        _margin = _;
        return component;
    };

    component.diameter = function(_) {
        if (!arguments.length) return _diameter
        _diameter =  _;
        return component;
    };

    component.minValue = function(_) {
        if (!arguments.length) return _minValue;
        _minValue = _;
        return component;
    };

    component.maxValue = function(_) {
        if (!arguments.length) return _maxValue;
        _maxValue = _;
        return component;
    };

    component.label = function(_) {
        if (!arguments.length) return _label;
        _label = _;
        return component;
    };

    component._duration = function(_) {
        if (!arguments.length) return _duration;
        _duration = _;
        return component;
    };

    component.onClick = function (_) {
        if (!arguments.length) return _mouseClick;
        _mouseClick=_;
        return component;
    }

    return component;

}