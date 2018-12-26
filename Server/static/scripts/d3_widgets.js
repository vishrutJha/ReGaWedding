(function() {
  var drawGrid, drawLegends, gutter;

  drawLegends = function(container, data, colors, dimension) {
    var gridwidth, isOddLength, legendGrp, legendOffsetX, legendOffsetY, legendPerRow, length, maxRows, rowHeight, spacing, textWidth, totalOffset;
    legendOffsetY = dimension.chartH;
    legendOffsetX = dimension.margin.left;
    gridwidth = dimension.chartW - dimension.margin.left - dimension.margin.right + 5;
    spacing = 20;
    rowHeight = 15;
    textWidth = 70;
    legendPerRow = Math.max(Math.floor(gridwidth / (spacing + textWidth)), 1);
    isOddLength = data.length % 2 === 1;
    length = data.length;
    maxRows = Math.ceil(length / legendPerRow);
    totalOffset = (maxRows - 1) * rowHeight;
    if (legendPerRow === 1) {
      textWidth = dimension.chartW - spacing;
    } else if (legendPerRow >= length) {
      if (gridwidth * 0.8 > (textWidth + spacing) * length) {
        legendOffsetX += (gridwidth - (textWidth + spacing) * length) / 2;
      }
    }
    legendGrp = container.append('g').attr("class", "legend").attr('transform', "translate(" + legendOffsetX + "," + legendOffsetY + ")");
    data.forEach((function(_this) {
      return function(entry, index) {
        var legend, offsetX, offsetY, rect, text;
        offsetX = (index % legendPerRow) * (Math.floor(gridwidth / legendPerRow));
        offsetY = -totalOffset + Math.floor(index / legendPerRow) * rowHeight;
        legend = legendGrp.append('g').attr('transform', "translate(" + offsetX + "," + offsetY + ")");
        rect = legend.append('rect').attr('x', 0).attr('y', 0).attr('fill', colors[index]).attr('width', 8).attr('height', 8);
        return text = legend.append('text').attr('x', 11).attr('y', 8).attr('class', 'legend-text').text(function() {
          return entry.toUpperCase();
        }).each(function() {});
      };
    })(this));
    return maxRows * rowHeight;
  };

  drawGrid = function(svg, width, height, offsetX, offsetY) {
    if (offsetX == null) {
      offsetX = 5;
    }
    if (offsetY == null) {
      offsetY = 5;
    }
    return svg.append('rect').attr('width', width + (2 * offsetX)).attr('height', height - (2 * offsetY)).attr("x", -offsetX).attr("y", offsetY).style('fill', 'rgba(0,0,0,.2)');
  };

  d3.custom = {};

  gutter = {
    top: 10,
    bottom: 12,
    right: 15,
    left: 15
  };

  d3.custom.columnChart = function() {
    var _colors, dispatch, duration, ease, exports, gap, height, margin, svg, width;
    margin = JSON.parse(JSON.stringify(gutter));
    width = 500;
    height = 500;
    gap = 0;
    ease = 'cubic-in-out';
    svg = void 0;
    _colors = ['#ec008c', '#249eb2', '#b3b3b3', 'rgb(157, 162, 227)', '#e9746d', '#9ac8e2', '#f2d1d9'];
    duration = 500;
    dispatch = d3.dispatch('customHover');
    exports = function(_selection) {
      _selection.each(function(_data_orig) {
        var _data, _labels, barGutter, barValues, barW, bars, chartH, chartW, colors, container, gapSize, graphOffsetLeft, labelYMaxWidth, refText, trimmedLabels, x, x1, xAxis, xAxisHeight, xAxisLabels, y1, yAxis, yAxisWidth;
        margin.top = gutter.top;
        margin.bottom = gutter.bottom;
        margin.right = gutter.right - 15;
        margin.left = gutter.left;
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
        if (!_data_orig) {
          _data_orig = {};
          _data_orig.data = [];
        }
        _data = [];
        _labels = [];
        _data_orig.data.forEach(function(entry, i) {
          var d;
          d = parseInt(entry.d) ? parseInt(entry.d) : 0;
          _data.push(d);
          return _labels.push(entry.label);
        });
        colors = function(i, entry) {
          var ref;
          if (((ref = _data_orig.data[i].color) != null ? ref.value : void 0) != null) {
            return _data_orig.data[i].color.value;
          }
          if (_colors.length < length) {
            i = length % _colors.length;
          }
          return _colors[i];
        };
        if (!svg) {
          d3.select(this).html("");
          svg = d3.select(this).append('svg').classed('chart', true);
          container = svg.append('g').classed('container-group', true);
          container.append('g').classed('x-axis-group graph-axis legend', true);
          container.append('g').classed('y-axis-group graph-axis', true);
          container.append('g').classed('chart-group', true);
          refText = container.select('.x-axis-group.graph-axis').append('g').classed('tick', true).append('text').text('XAXIS');
          xAxisHeight = parseInt(refText.style('font-size'));
          chartH = chartH - xAxisHeight;
          container.select('.x-axis-group.graph-axis').html("");
        }
        y1 = d3.scale.linear().domain([
          0, d3.max(_data, function(d, i) {
            var barW;
            return d;
          }) * 1.4
        ]).range([chartH, 0]);
        yAxis = d3.svg.axis().scale(y1).ticks(6).tickSize(-chartW).orient('left');
        svg.select('.y-axis-group.graph-axis').transition().duration(duration).ease(ease).call(yAxis);
        yAxisWidth = 0;
        svg.select('.y-axis-group.graph-axis').selectAll('.tick').select('text').each(function(d) {
          return yAxisWidth = yAxisWidth < this.getBBox().width ? this.getBBox().width : yAxisWidth;
        }).attr({
          x: yAxisWidth
        });
        yAxisWidth += 5;
        chartW = chartW - yAxisWidth;
        graphOffsetLeft = yAxisWidth - 10;
        svg.select('.y-axis-group.graph-axis').attr({
          transform: 'translate(' + (yAxisWidth - margin.left) + ',0)'
        });
        x = d3.scale.ordinal().domain(_data.map(function(d, i) {
          return _labels[i];
        })).rangeRoundBands([0, chartW], .3);
        x1 = d3.scale.ordinal().domain(_data.map(function(d, i) {
          return i;
        })).rangeRoundBands([0, chartW], .3);
        xAxis = d3.svg.axis().scale(x).orient('bottom');
        barGutter = 0;
        barW = chartW / _data.length - barGutter;
        svg.transition().duration(duration).attr({
          width: width,
          height: height,
          viewBox: "0 0 " + width + " " + height
        });
        svg.select('.x-axis-group.graph-axis').transition().duration(duration).ease(ease).attr({
          transform: 'translate(' + graphOffsetLeft + ',' + chartH + ')'
        }).call(xAxis);
        gapSize = x1.rangeBand() / 100 * gap;
        barW = x1.rangeBand() - gapSize;
        bars = svg.select('.chart-group').selectAll('.graph-bar').data(_data);
        bars.enter().append('rect').classed('graph-bar', true).attr({
          x: chartW - barGutter,
          width: barW,
          y: function(d, i) {
            return y1(d);
          },
          height: function(d, i) {
            return chartH - y1(d);
          }
        }).style({
          fill: function(d, i) {
            return colors(i, d);
          }
        }).on('mouseover', dispatch.customHover);
        bars.transition().duration(duration).ease(ease).attr({
          width: barW,
          x: function(d, i) {
            return x1(i) + gapSize / 2 + barGutter / 2;
          },
          y: function(d, i) {
            return y1(d);
          },
          height: function(d, i) {
            return chartH - y1(d);
          }
        });
        bars.exit().transition().style({
          opacity: 0
        }).remove();
        labelYMaxWidth = 0;
        barValues = svg.select('.chart-group').selectAll('.graph-bar-text').data(_data);
        barValues.enter().append('text').classed('graph-bar-text', true).attr({
          x: function(d, i) {
            return x1(i) + (gapSize + barGutter + barW) / 2;
          },
          y: function(d, i) {
            return y1(d) - 5;
          },
          'text-anchor': 'middle',
          'alignment-baseline': 'after-edge',
          "class": 'graph-horizontal-bar-value'
        }).text(function(d, i) {
          return _data[i] + ' ';
        }).each(function(d) {
          if (labelYMaxWidth < this.getBBox().width) {
            return labelYMaxWidth = this.getBBox().width;
          }
        }).append('tspan').text(function(d, i) {
          var ref;
          if (((ref = _data_orig.data[i]) != null ? ref.subtext : void 0) != null) {
            return '  ' + _data_orig.data[i].subtext + '';
          } else {
            return '';
          }
        }).attr({
          'text-anchor': 'middle',
          'alignment-baseline': 'after-edge',
          'class': 'graph-subvalue'
        });
        barValues.exit().remove();
        trimmedLabels = [];
        xAxisLabels = svg.select('.x-axis-group.graph-axis').selectAll('.tick').data(_labels);
        xAxisLabels.select('text').each(function(d) {
          var label, labelLength;
          labelLength = Math.round(d.length * barW / this.getBBox().width);
          label = d.slice(0, labelLength);
          if (d.length > label.length) {
            label += '...';
          }
          return trimmedLabels.push(label);
        }).text(function(d, i) {
          return trimmedLabels[i];
        });
        svg.select('.container-group').attr({
          transform: 'translate(' + margin.left + ',' + margin.top + ')'
        });
        svg.select('.chart-group').attr({
          transform: 'translate(' + graphOffsetLeft + ',0)'
        });
        duration = 200;
      });
    };
    exports.width = function(_x) {
      if (!arguments.length) {
        return width;
      }
      width = parseInt(_x);
      return this;
    };
    exports.height = function(_x) {
      if (!arguments.length) {
        return height;
      }
      height = parseInt(_x);
      duration = 0;
      return this;
    };
    exports.gap = function(_x) {
      if (!arguments.length) {
        return gap;
      }
      gap = _x;
      return this;
    };
    exports.ease = function(_x) {
      if (!arguments.length) {
        return ease;
      }
      ease = _x;
      return this;
    };
    d3.rebind(exports, dispatch, 'on');
    return exports;
  };

  d3.custom.barChart = function() {
    var _colors, dispatch, duration, ease, exports, height, margin, svg, width;
    width = 500;
    height = 500;
    ease = 'cubic-in-out';
    svg = void 0;
    margin = JSON.parse(JSON.stringify(gutter));
    _colors = ['#ec008c', '#249eb2', '#b3b3b3', 'rgb(157, 162, 227)', '#e9746d', '#9ac8e2', '#f2d1d9'];
    duration = 500;
    dispatch = d3.dispatch('customHover');
    exports = function(_selection) {
      _selection.each(function(_data_orig) {
        var _data, chart, chartH, chartW, colors, container, length, max, total;
        margin.right = gutter.right - 15;
        margin.left = gutter.left - 15;
        margin.top = gutter.top;
        margin.bottom = gutter.bottom - 13;
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
        if (!_data_orig) {
          _data_orig = {};
          _data_orig.data = [];
        }
        _data = _data_orig.data;
        total = 0;
        _data.forEach(function(entry, i) {
          entry.d = parseInt(entry.d) ? parseInt(entry.d) : 0;
          return total = total + entry.d;
        });
        length = _data.length;
        max = d3.max(_data, function(d) {
          return d.d;
        });
        colors = function(i, entry) {
          var ref;
          if ((entry != null ? (ref = entry.color) != null ? ref.value : void 0 : void 0) != null) {
            return entry.color.value;
          }
          if (_colors.length < length) {
            i = length % _colors.length;
          }
          return _colors[i];
        };
        if (!svg) {
          d3.select(this).html("");
          svg = d3.select(this).append('svg').classed('chart', true);
          container = svg.append('g').classed('container-group', true);
          container.append('g').classed('chart-group', true);
        }
        svg.transition().duration(duration).attr({
          width: width,
          height: height + 5
        });
        svg.select('.container-group').attr({
          transform: 'translate(' + margin.left + ',' + margin.top + ')'
        });
        chart = svg.select('.chart-group').attr({
          width: chartW,
          height: chartH + 5
        });
        svg.select(".chart-group").html("");
        console.log('asd');
        _data.forEach(function(entry, i) {
          var barOffsetY, bar_height, bar_width, graphLabel, graphLabelHeight, graphValue, graphValueHeight, labelOffsetTop, label_width, paddinBottom, row, row_height, row_width;
          row = chart.append('g').classed('graph-horizontal-row', true);
          label_width = row_width;
          graphLabel = row.append('g').classed('graph-horizontal-label', true).append('text').text(entry.label);
          graphLabelHeight = graphLabel.node().getBoundingClientRect().height;
          labelOffsetTop = 2;
          paddinBottom = (chartH - graphLabelHeight * length) / length / 2;
          paddinBottom = (paddinBottom + chartH - graphLabelHeight * length) / length / 1.9;
          row_height = (chartH + paddinBottom) / length;
          row_width = chartW;
          row.attr({
            height: row_height,
            width: row_width,
            transform: 'translate(0,' + row_height * i + ')'
          });
          graphLabel.attr({
            x: 0,
            y: labelOffsetTop,
            width: label_width * 0.3,
            height: graphLabelHeight,
            'text-anchor': 'start'
          });
          bar_height = row_height - graphLabelHeight - labelOffsetTop;
          bar_width = row_width * entry.d / max * 0.8;
          if (bar_width === 0) {
            bar_width = 1;
          }
          barOffsetY = (graphLabelHeight + labelOffsetTop) / 2;
          row.append('g').classed('graph-horizontal-bar-wrp', true).append('rect').classed('graph-horizontal-bar', true).attr({
            x: 0,
            width: bar_width,
            y: barOffsetY,
            height: bar_height * 0.5
          }).style({
            fill: colors(i, entry)
          });
          graphValue = row.append('g').classed('graph-horizontal-bar-value', true);
          barOffsetY = barOffsetY + bar_height * 0.25;
          graphValue.append('text').attr({
            x: bar_width + 10,
            y: barOffsetY
          }).style({
            'alignment-baseline': 'before-edge'
          }).text(entry.d);
          if ((entry.subtext != null) && entry.subtext !== '') {
            graphValueHeight = graphValue.node().getBoundingClientRect().height;
            graphValue.append('text').attr({
              x: bar_width + 10,
              y: graphValueHeight * 1.0 + barOffsetY
            }).style({
              'alignment-baseline': 'before-edge'
            }).text(entry.subtext);
          }
          graphValueHeight = graphValue.node().getBoundingClientRect().height;
          graphValue.attr({
            transform: 'translate(0,-' + (graphValueHeight / 2) + ')'
          });
          return row.append('g').classed('graph-horizontal-bar-separator', true).append('line').attr({
            x1: 0,
            y1: graphLabelHeight / 2 + bar_height * 0.7,
            x2: row_width,
            y2: graphLabelHeight / 2 + bar_height * 0.7
          });
        });
      });
    };
    exports.width = function(_x) {
      if (!arguments.length) {
        return width;
      }
      width = parseInt(_x);
      return this;
    };
    exports.height = function(_x) {
      if (!arguments.length) {
        return height;
      }
      height = parseInt(_x);
      duration = 0;
      return this;
    };
    exports.ease = function(_x) {
      if (!arguments.length) {
        return ease;
      }
      ease = _x;
      return this;
    };
    d3.rebind(exports, dispatch, 'on');
    return exports;
  };

  d3.custom.lineChart = function() {
    var _colors, dispatch, duration, ease, exports, height, margin, svg, width;
    margin = JSON.parse(JSON.stringify(gutter));
    width = 500;
    height = 500;
    ease = 'cubic-in-out';
    svg = void 0;
    _colors = ['#249EB2', '#b3b3b3', 'rgb(157, 162, 227)', '#e9746d', '#9ac8e2', '#f2d1d9'];
    duration = 500;
    dispatch = d3.dispatch('customHover');
    exports = function(_selection) {
      _selection.each(function(_data_orig) {
        var dataset;
        var draw;
        draw = function(ele) {
          var _data, chart, chartH, chartW, colors, container, dataset, dimension, graphOffsetLeft, labels, legendGrp, legendHeight, legendWidth, lines, max, xAxis, xAxisTickPadding, xScale, yAxis, yAxisGroup, yAxisWidth, yScale;
          margin.top = gutter.top - 10;
          margin.bottom = gutter.bottom;
          margin.right = gutter.right - 15;
          margin.left = gutter.left - 15;
          chartW = width - margin.left - margin.right;
          chartH = height - margin.top - margin.bottom;
          dimension = {
            chartW: chartW,
            chartH: chartH,
            margin: {
              left: 0,
              right: 5
            }
          };
          if (!_data_orig) {
            _data_orig = {};
            _data_orig.data = [];
            _data_orig.labels = [];
          }
          dataset = _data_orig.data;
          labels = _data_orig.labels;
          colors = function(i) {
            if (_colors.length < length) {
              i = length % _colors.length;
            }
            return _colors[i];
          };
          if (!svg) {
            d3.select(ele).html("");
            svg = d3.select(ele).append('svg').classed('chart Line', true);
            container = svg.append('g').classed('container-group', true);
            container.append('g').classed('x-axis-group graph-axis xaxis', true);
            container.append('g').classed('y-axis-group graph-axis yaxis', true);
            container.append('g').classed('chart-group', true);
            container.append('g').classed('legend-group', true);
          }
          svg.transition().duration(duration).attr({
            width: width + 15,
            height: height
          });
          svg.select('.container-group').attr({
            transform: 'translate(' + margin.left + ',' + margin.top + ')'
          });
          legendGrp = svg.select('g.legend-group');
          drawLegends(legendGrp, labels, _colors, dimension);
          legendWidth = legendGrp.node().getBoundingClientRect().width;
          legendHeight = legendGrp.node().getBoundingClientRect().height;
          chartH = chartH - legendHeight - 10;
          max = [];
          labels.forEach(function(label, i) {
            return max[i] = d3.max(dataset, function(d) {
              return d[label];
            });
          });
          max = d3.max(max);
          yScale = d3.scale.linear().domain([0, max * 1.5]).range([chartH, 0]);
          yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(function(d) {
            return d;
          }).tickSize(0).ticks(5);
          yAxisGroup = svg.select('.y-axis-group.graph-axis').call(yAxis);
          yAxisWidth = yAxisGroup.node().getBoundingClientRect().width;
          graphOffsetLeft = yAxisWidth + 5;
          yAxisGroup.transition().duration(duration).ease(ease).attr({
            transform: 'translate(' + yAxisWidth + ',0)'
          });
          chartW = chartW - graphOffsetLeft;
          xScale = d3.scale.ordinal().rangeRoundBands([0, chartW], 1, 0);
          xScale.domain(dataset.map(function(d) {
            return d.label;
          }));
          console.log('updated');
          xAxisTickPadding = 4;
          xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(-(chartH - xAxisTickPadding)).tickPadding(3 + xAxisTickPadding);
          svg.select('.x-axis-group.graph-axis').transition().duration(duration).ease(ease).attr({
            transform: 'translate(' + graphOffsetLeft + ',' + (chartH - xAxisTickPadding) + ')'
          }).call(xAxis).call(xAxis);
          chart = svg.select('g.chart-group').attr('transform', 'translate(' + graphOffsetLeft + ',0)');
          _data = dataset;
          lines = [];
          labels.forEach(function(label, i) {
            var circle_label;
            lines[i] = d3.svg.line().x(function(d) {
              return 0 + xScale(d.label);
            }).y(function(d) {
              return yScale(d[label]);
            });
            chart.append('svg:path').attr('class', 'graph-line-path').style('stroke', colors(i)).attr('d', lines[i](_data));
            circle_label = 'circle_' + 'label';
            return chart.selectAll(circle_label).data(dataset).enter().append('circle').attr('class', 'graph-line-points').attr('cx', function(d, i) {
              return 0 + xScale(d.label);
            }).attr('cy', function(d) {
              return yScale(d[label]);
            }).attr('r', 4).attr('fill', colors(i));
          });
        };
        draw(this);
      });
    };
    exports.width = function(_x) {
      if (!arguments.length) {
        return width;
      }
      width = parseInt(_x);
      return this;
    };
    exports.height = function(_x) {
      if (!arguments.length) {
        return height;
      }
      height = parseInt(_x);
      duration = 0;
      return this;
    };
    exports.ease = function(_x) {
      if (!arguments.length) {
        return ease;
      }
      ease = _x;
      return this;
    };
    d3.rebind(exports, dispatch, 'on');
    return exports;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,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WixNQUFBLElBQUcsQ0FBQSxTQUFVLENBQUMsTUFBZDtBQUNJLGVBQU8sS0FBUCxDQURKO09BQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxRQUFBLENBQVMsRUFBVCxDQUZSLENBQUE7YUFHQSxLQUpZO0lBQUEsQ0E3TGhCLENBQUE7QUFBQSxJQW1NQSxPQUFPLENBQUMsTUFBUixHQUFpQixTQUFDLEVBQUQsR0FBQTtBQUNiLE1BQUEsSUFBRyxDQUFBLFNBQVUsQ0FBQyxNQUFkO0FBQ0ksZUFBTyxNQUFQLENBREo7T0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTLFFBQUEsQ0FBUyxFQUFULENBRlQsQ0FBQTtBQUFBLE1BR0EsUUFBQSxHQUFXLENBSFgsQ0FBQTthQUlBLEtBTGE7SUFBQSxDQW5NakIsQ0FBQTtBQUFBLElBME1BLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxFQUFELEdBQUE7QUFDWCxNQUFBLElBQUcsQ0FBQSxTQUFVLENBQUMsTUFBZDtBQUNJLGVBQU8sSUFBUCxDQURKO09BQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxFQUZQLENBQUE7YUFHQSxLQUpXO0lBQUEsQ0ExTWYsQ0FBQTtBQUFBLElBZ05BLEVBQUUsQ0FBQyxNQUFILENBQVUsT0FBVixFQUFtQixRQUFuQixFQUE2QixJQUE3QixDQWhOQSxDQUFBO1dBaU5BLFFBbE5rQjtFQUFBLENBbmlCdEIsQ0FBQTtBQUFBIiwiZmlsZSI6ImQzX3dpZGdldHMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcbiMjIGQzIHNwZWNpZmljIGNvZGUgZm9yIGdyYXBoXHJcblxyXG5cclxuIyBUT0RPOiBjYW4gb3B0aW1pemUgdGhlIGNvZGUgYSBsb3QgYnkgcHV0dGluZyB0aGUgcmVwZWF0ZWQgc3R1ZmYgaW4gb25lIHBsYWNlLiBGb3Igbm93IHdpbGwganVzdCBjb3B5K3Bhc3RlXHJcblxyXG5cclxuZHJhd0xlZ2VuZHMgPSAoY29udGFpbmVyLCBkYXRhLCBjb2xvcnMsIGRpbWVuc2lvbiktPlxyXG5cclxuICAgIGxlZ2VuZE9mZnNldFkgPSBkaW1lbnNpb24uY2hhcnRIXHJcbiAgICBsZWdlbmRPZmZzZXRYID0gZGltZW5zaW9uLm1hcmdpbi5sZWZ0XHJcblxyXG4gICAgZ3JpZHdpZHRoICAgICA9IGRpbWVuc2lvbi5jaGFydFcgLSBkaW1lbnNpb24ubWFyZ2luLmxlZnQgLSBkaW1lbnNpb24ubWFyZ2luLnJpZ2h0ICsgNVxyXG5cclxuICAgIHNwYWNpbmcgICAgICAgPSAyMFxyXG4gICAgcm93SGVpZ2h0ICAgICA9IDE1XHJcbiAgICB0ZXh0V2lkdGggICAgID0gNzBcclxuICAgIGxlZ2VuZFBlclJvdyAgPSBNYXRoLm1heChNYXRoLmZsb29yKGdyaWR3aWR0aC8oc3BhY2luZyt0ZXh0V2lkdGgpKSwxKVxyXG4gICAgaXNPZGRMZW5ndGggICA9IChkYXRhLmxlbmd0aCAlIDIgaXMgMSlcclxuICAgIGxlbmd0aCAgICAgICAgPSBkYXRhLmxlbmd0aFxyXG4gICAgIyB3cmFwVGV4dCAgICAgID0gQHdyYXBUZXh0XHJcbiAgICBtYXhSb3dzICAgICAgID0gTWF0aC5jZWlsKGxlbmd0aC9sZWdlbmRQZXJSb3cpXHJcbiAgICB0b3RhbE9mZnNldCAgID0gKG1heFJvd3MtMSkqcm93SGVpZ2h0XHJcblxyXG5cclxuXHJcblxyXG4gICAgaWYgbGVnZW5kUGVyUm93IGlzIDFcclxuICAgICAgICB0ZXh0V2lkdGggPSBkaW1lbnNpb24uY2hhcnRXIC0gc3BhY2luZ1xyXG4gICAgZWxzZSBpZiBsZWdlbmRQZXJSb3cgPj0gbGVuZ3RoXHJcbiAgICAgICAgIyBjZW50ZXIgaXRcclxuICAgICAgICBpZiBncmlkd2lkdGggKiAwLjggPiAodGV4dFdpZHRoK3NwYWNpbmcpKmxlbmd0aFxyXG4gICAgICAgICAgICBsZWdlbmRPZmZzZXRYICs9IChncmlkd2lkdGggLSAodGV4dFdpZHRoK3NwYWNpbmcpKmxlbmd0aCkvMlxyXG5cclxuICAgIGxlZ2VuZEdycCA9IGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5hdHRyKFwiY2xhc3NcIixcImxlZ2VuZFwiKS5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKCN7bGVnZW5kT2Zmc2V0WH0sI3tsZWdlbmRPZmZzZXRZfSlcIilcclxuXHJcbiAgICBkYXRhLmZvckVhY2ggKGVudHJ5LCBpbmRleCk9PlxyXG5cclxuICAgICAgICBvZmZzZXRYID0gKGluZGV4JWxlZ2VuZFBlclJvdykqKE1hdGguZmxvb3IoZ3JpZHdpZHRoL2xlZ2VuZFBlclJvdykpXHJcblxyXG4gICAgICAgIG9mZnNldFkgPSAtdG90YWxPZmZzZXQgKyBNYXRoLmZsb29yKGluZGV4L2xlZ2VuZFBlclJvdykqcm93SGVpZ2h0XHJcblxyXG4gICAgICAgIGxlZ2VuZCA9IGxlZ2VuZEdycC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJyxcInRyYW5zbGF0ZSgje29mZnNldFh9LCN7b2Zmc2V0WX0pXCIpXHJcblxyXG4gICAgICAgIHJlY3QgPSBsZWdlbmQuYXBwZW5kKCdyZWN0JykuYXR0cigneCcsIDApLmF0dHIoJ3knLCAwKVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIGNvbG9yc1tpbmRleF0gKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLDgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLDgpXHJcblxyXG4gICAgICAgIHRleHQgPSBsZWdlbmQuYXBwZW5kKCd0ZXh0JykuYXR0cigneCcsIDExKS5hdHRyKCd5JywgOClcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywnbGVnZW5kLXRleHQnKVxyXG4gICAgICAgICAgICAudGV4dCgtPlxyXG4gICAgICAgICAgICAgICAgIyB0aGlzIGZvciBlbGxpcHNpc1xyXG4gICAgICAgICAgICAgICAgZW50cnkudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgICApLmVhY2goLT5cclxuICAgICAgICAgICAgICAgICMgd3JhcFRleHQodGhpcyx0ZXh0V2lkdGgpXHJcbiAgICAgICAgICAgIClcclxuXHJcblxyXG4gICAgcmV0dXJuIG1heFJvd3Mqcm93SGVpZ2h0XHJcblxyXG5cclxuZHJhd0dyaWQgPSAoc3ZnLCB3aWR0aCwgaGVpZ2h0LCBvZmZzZXRYID0gNSwgb2Zmc2V0WSA9IDUpLT5cclxuICAgIHN2Zy5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsd2lkdGggKyAoMiAqIG9mZnNldFgpKVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLGhlaWdodCAtICgyICogb2Zmc2V0WSkpXHJcbiAgICAgICAgLmF0dHIoXCJ4XCIsLW9mZnNldFgpXHJcbiAgICAgICAgLmF0dHIoXCJ5XCIsb2Zmc2V0WSlcclxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdyZ2JhKDAsMCwwLC4yKScpXHJcblxyXG5cclxuZDMuY3VzdG9tID0ge31cclxuXHJcblxyXG5ndXR0ZXIgPVxyXG4gICAgdG9wICAgICA6IDEwXHJcbiAgICBib3R0b20gIDogMTJcclxuICAgIHJpZ2h0ICAgOiAxNVxyXG4gICAgbGVmdCAgICA6IDE1XHJcblxyXG5cclxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG4jIyBjb2x1bW5DaGFydFxyXG5cclxuZDMuY3VzdG9tLmNvbHVtbkNoYXJ0ID0gLT5cclxuICAgIG1hcmdpbiAgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGd1dHRlcikpXHJcbiAgICB3aWR0aCAgID0gNTAwXHJcbiAgICBoZWlnaHQgID0gNTAwXHJcbiAgICBnYXAgICAgID0gMFxyXG4gICAgZWFzZSAgICA9ICdjdWJpYy1pbi1vdXQnXHJcbiAgICBzdmcgICAgID0gdW5kZWZpbmVkXHJcblxyXG4gICAgX2NvbG9ycyA9IFtcclxuICAgICAgICAnI2VjMDA4YydcclxuICAgICAgICAnIzI0OWViMidcclxuICAgICAgICAnI2IzYjNiMydcclxuICAgICAgICAncmdiKDE1NywgMTYyLCAyMjcpJ1xyXG4gICAgICAgICcjZTk3NDZkJ1xyXG4gICAgICAgICcjOWFjOGUyJ1xyXG4gICAgICAgICcjZjJkMWQ5J1xyXG4gICAgXVxyXG5cclxuICAgIGR1cmF0aW9uID0gNTAwXHJcbiAgICBkaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdjdXN0b21Ib3ZlcicpXHJcblxyXG4gICAgZXhwb3J0cyA9IChfc2VsZWN0aW9uKSAtPlxyXG4gICAgICAgIF9zZWxlY3Rpb24uZWFjaCAoX2RhdGFfb3JpZykgLT5cclxuICAgICAgICAgICAgbWFyZ2luLnRvcCAgICAgID0gZ3V0dGVyLnRvcFxyXG4gICAgICAgICAgICBtYXJnaW4uYm90dG9tICAgPSBndXR0ZXIuYm90dG9tXHJcbiAgICAgICAgICAgIG1hcmdpbi5yaWdodCAgICA9IGd1dHRlci5yaWdodCAtIDE1XHJcbiAgICAgICAgICAgIG1hcmdpbi5sZWZ0ICAgICA9IGd1dHRlci5sZWZ0XHJcbiAgICAgICAgICAgIGNoYXJ0VyA9IHdpZHRoIC0gKG1hcmdpbi5sZWZ0KSAtIChtYXJnaW4ucmlnaHQpXHJcbiAgICAgICAgICAgIGNoYXJ0SCA9IGhlaWdodCAtIChtYXJnaW4udG9wKSAtIChtYXJnaW4uYm90dG9tKVxyXG5cclxuXHJcbiAgICAgICAgICAgICMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XHJcbiAgICAgICAgICAgICMgcHJlcHJvY2VzcyBkYXRhXHJcblxyXG4gICAgICAgICAgICBpZiAhX2RhdGFfb3JpZ1xyXG4gICAgICAgICAgICAgICAgX2RhdGFfb3JpZyA9IHt9XHJcbiAgICAgICAgICAgICAgICBfZGF0YV9vcmlnLmRhdGEgPSBbXVxyXG4gICAgICAgICAgICBfZGF0YSAgID0gW11cclxuICAgICAgICAgICAgX2xhYmVscyA9IFtdXHJcbiAgICAgICAgICAgIF9kYXRhX29yaWcuZGF0YS5mb3JFYWNoIChlbnRyeSxpKSAtPlxyXG4gICAgICAgICAgICAgICAgZCA9IGlmIHBhcnNlSW50KGVudHJ5LmQpIHRoZW4gcGFyc2VJbnQoZW50cnkuZCkgZWxzZSAwXHJcbiAgICAgICAgICAgICAgICBfZGF0YS5wdXNoIGRcclxuICAgICAgICAgICAgICAgIF9sYWJlbHMucHVzaCBlbnRyeS5sYWJlbFxyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbG9ycyA9IChpLCBlbnRyeSktPlxyXG4gICAgICAgICAgICAgICAgaWYgX2RhdGFfb3JpZy5kYXRhW2ldLmNvbG9yPy52YWx1ZT9cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2RhdGFfb3JpZy5kYXRhW2ldLmNvbG9yLnZhbHVlXHJcbiAgICAgICAgICAgICAgICBpZiBfY29sb3JzLmxlbmd0aCA8IGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGggJSBfY29sb3JzLmxlbmd0aFxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBfY29sb3JzW2ldXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpZiAhc3ZnXHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuaHRtbChcIlwiKVxyXG4gICAgICAgICAgICAgICAgc3ZnID0gZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgnc3ZnJykuY2xhc3NlZCgnY2hhcnQnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gc3ZnLmFwcGVuZCgnZycpLmNsYXNzZWQoJ2NvbnRhaW5lci1ncm91cCcsIHRydWUpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKCdnJykuY2xhc3NlZCAneC1heGlzLWdyb3VwIGdyYXBoLWF4aXMgbGVnZW5kJywgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZCgnZycpLmNsYXNzZWQgJ3ktYXhpcy1ncm91cCBncmFwaC1heGlzJywgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZCgnZycpLmNsYXNzZWQgJ2NoYXJ0LWdyb3VwJywgdHJ1ZVxyXG5cclxuICAgICAgICAgICAgICAgICMgZHJhd0dyaWQoc3ZnLHdpZHRoLGhlaWdodCwwLDE1KVxyXG5cclxuICAgICAgICAgICAgICAgIHJlZlRleHQgPSBjb250YWluZXIuc2VsZWN0KCcueC1heGlzLWdyb3VwLmdyYXBoLWF4aXMnKS5hcHBlbmQoJ2cnKS5jbGFzc2VkKCd0aWNrJyx0cnVlKS5hcHBlbmQoJ3RleHQnKS50ZXh0KCdYQVhJUycpXHJcbiAgICAgICAgICAgICAgICB4QXhpc0hlaWdodCA9IHBhcnNlSW50KHJlZlRleHQuc3R5bGUoJ2ZvbnQtc2l6ZScpKVxyXG5cclxuICAgICAgICAgICAgICAgIGNoYXJ0SCA9IGNoYXJ0SCAtIHhBeGlzSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc2VsZWN0KCcueC1heGlzLWdyb3VwLmdyYXBoLWF4aXMnKS5odG1sKFwiXCIpXHJcblxyXG5cclxuICAgICAgICAgICAgIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cclxuICAgICAgICAgICAgIyB5LWF4aXNcclxuICAgICAgICAgICAgeTEgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW1xyXG4gICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgZDMubWF4KF9kYXRhLCAoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICBgdmFyIGJhcldgXHJcbiAgICAgICAgICAgICAgICAgICAgZFxyXG4gICAgICAgICAgICAgICAgKSAqIDEuNFxyXG4gICAgICAgICAgICBdKS5yYW5nZShbXHJcbiAgICAgICAgICAgICAgICBjaGFydEhcclxuICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkxKS50aWNrcyg2KS50aWNrU2l6ZSgtKGNoYXJ0VykpLm9yaWVudCgnbGVmdCcpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdmcuc2VsZWN0KCcueS1heGlzLWdyb3VwLmdyYXBoLWF4aXMnKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLmVhc2UoZWFzZSkuY2FsbCB5QXhpc1xyXG5cclxuICAgICAgICAgICAgeUF4aXNXaWR0aCA9IDBcclxuICAgICAgICAgICAgc3ZnLnNlbGVjdCgnLnktYXhpcy1ncm91cC5ncmFwaC1heGlzJykuc2VsZWN0QWxsKCcudGljaycpLnNlbGVjdCgndGV4dCcpLmVhY2goKGQpLT5cclxuICAgICAgICAgICAgICAgIHlBeGlzV2lkdGggPSBpZiAoeUF4aXNXaWR0aCA8IHRoaXMuZ2V0QkJveCgpLndpZHRoKSB0aGVuIHRoaXMuZ2V0QkJveCgpLndpZHRoIGVsc2UgeUF4aXNXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoeDp5QXhpc1dpZHRoKVxyXG4gICAgICAgICAgICB5QXhpc1dpZHRoICs9IDVcclxuXHJcbiAgICAgICAgICAgIGNoYXJ0VyA9IGNoYXJ0VyAtIHlBeGlzV2lkdGhcclxuICAgICAgICAgICAgZ3JhcGhPZmZzZXRMZWZ0ID0geUF4aXNXaWR0aCAtIDEwXHJcblxyXG4gICAgICAgICAgICBzdmcuc2VsZWN0KCcueS1heGlzLWdyb3VwLmdyYXBoLWF4aXMnKS5hdHRyKHRyYW5zZm9ybTondHJhbnNsYXRlKCcrKHlBeGlzV2lkdGgtbWFyZ2luLmxlZnQpKycsMCknKVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxyXG4gICAgICAgICAgICAjIHgtYXhpc1xyXG5cclxuICAgICAgICAgICAgeCA9IGQzLnNjYWxlLm9yZGluYWwoKS5kb21haW4oX2RhdGEubWFwKChkLCBpKSAtPlxyXG4gICAgICAgICAgICAgICAgX2xhYmVsc1tpXVxyXG4gICAgICAgICAgICApKS5yYW5nZVJvdW5kQmFuZHMoW1xyXG4gICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgY2hhcnRXXHJcbiAgICAgICAgICAgIF0sIC4zKVxyXG5cclxuICAgICAgICAgICAgeDEgPSBkMy5zY2FsZS5vcmRpbmFsKCkuZG9tYWluKF9kYXRhLm1hcCgoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKSkucmFuZ2VSb3VuZEJhbmRzKFtcclxuICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgIGNoYXJ0V1xyXG4gICAgICAgICAgICBdLCAuMylcclxuICAgICAgICAgICAgeEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHgpLm9yaWVudCgnYm90dG9tJylcclxuXHJcbiAgICAgICAgICAgICMgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkxKS50aWNrcyg2KS50aWNrU2l6ZSgtKHdpZHRoIC0gbWFyZ2luLnJpZ2h0IC0gbWFyZ2luLmxlZnQpKS5vcmllbnQoJ2xlZnQnKVxyXG5cclxuICAgICAgICAgICAgYmFyR3V0dGVyID0gMFxyXG4gICAgICAgICAgICBiYXJXID0gY2hhcnRXIC8gX2RhdGEubGVuZ3RoIC0gYmFyR3V0dGVyXHJcblxyXG5cclxuICAgICAgICAgICAgc3ZnLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbikuYXR0clxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgdmlld0JveDogXCIwIDAgXCIgKyAod2lkdGgpICsgXCIgXCIgKyBoZWlnaHRcclxuICAgICAgICAgICAgc3ZnLnNlbGVjdCgnLngtYXhpcy1ncm91cC5ncmFwaC1heGlzJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5lYXNlKGVhc2UpLmF0dHIodHJhbnNmb3JtOiAndHJhbnNsYXRlKCcrZ3JhcGhPZmZzZXRMZWZ0KycsJyArIGNoYXJ0SCArICcpJykuY2FsbCB4QXhpc1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGdhcFNpemUgPSB4MS5yYW5nZUJhbmQoKSAvIDEwMCAqIGdhcFxyXG5cclxuXHJcbiAgICAgICAgICAgICMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XHJcbiAgICAgICAgICAgICMgYmFyc1xyXG5cclxuICAgICAgICAgICAgYmFyVyA9IHgxLnJhbmdlQmFuZCgpIC0gZ2FwU2l6ZVxyXG4gICAgICAgICAgICBiYXJzID0gc3ZnLnNlbGVjdCgnLmNoYXJ0LWdyb3VwJykuc2VsZWN0QWxsKCcuZ3JhcGgtYmFyJykuZGF0YShfZGF0YSlcclxuXHJcblxyXG4gICAgICAgICAgICBiYXJzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuY2xhc3NlZCgnZ3JhcGgtYmFyJywgdHJ1ZSkuYXR0cihcclxuICAgICAgICAgICAgICAgIHg6IGNoYXJ0VyAtIGJhckd1dHRlclxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJhcldcclxuICAgICAgICAgICAgICAgIHk6IChkLCBpKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgIHkxIGRcclxuICAgICAgICAgICAgICAgIGhlaWdodDogKGQsIGkpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRIIC0geTEoZCkpXHJcbiAgICAgICAgICAgIC5zdHlsZShmaWxsOihkLCBpKSAtPlxyXG4gICAgICAgICAgICAgICAgY29sb3JzKGksZCkpXHJcbiAgICAgICAgICAgIC5vbiAnbW91c2VvdmVyJywgZGlzcGF0Y2guY3VzdG9tSG92ZXJcclxuXHJcbiAgICAgICAgICAgIGJhcnMudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5lYXNlKGVhc2UpLmF0dHJcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBiYXJXXHJcbiAgICAgICAgICAgICAgICB4OiAoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICB4MShpKSArIGdhcFNpemUgLyAyICsgYmFyR3V0dGVyIC8gMlxyXG4gICAgICAgICAgICAgICAgeTogKGQsIGkpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgeTEgZFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICBjaGFydEggLSB5MShkKVxyXG5cclxuICAgICAgICAgICAgYmFycy5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKG9wYWNpdHk6IDApLnJlbW92ZSgpXHJcblxyXG5cclxuICAgICAgICAgICAgIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cclxuICAgICAgICAgICAgIyBiYXIgdmFsdWVcclxuXHJcbiAgICAgICAgICAgIGxhYmVsWU1heFdpZHRoID0gMFxyXG5cclxuICAgICAgICAgICAgYmFyVmFsdWVzID0gc3ZnLnNlbGVjdCgnLmNoYXJ0LWdyb3VwJykuc2VsZWN0QWxsKCcuZ3JhcGgtYmFyLXRleHQnKS5kYXRhKF9kYXRhKVxyXG4gICAgICAgICAgICBiYXJWYWx1ZXMuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5jbGFzc2VkKCdncmFwaC1iYXItdGV4dCcsIHRydWUpLmF0dHIoXHJcbiAgICAgICAgICAgICAgICB4OiAoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICB4MShpKSArIChnYXBTaXplICsgYmFyR3V0dGVyICsgYmFyVykgLyAyXHJcbiAgICAgICAgICAgICAgICB5OiAoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICB5MShkKSAtIDVcclxuICAgICAgICAgICAgICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnXHJcbiAgICAgICAgICAgICAgICAnYWxpZ25tZW50LWJhc2VsaW5lJzogJ2FmdGVyLWVkZ2UnXHJcbiAgICAgICAgICAgICAgICBjbGFzczogJ2dyYXBoLWhvcml6b250YWwtYmFyLXZhbHVlJ1xyXG4gICAgICAgICAgICApLnRleHQoKGQsIGkpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgX2RhdGFbaV0gKyAnICdcclxuICAgICAgICAgICAgKS5lYWNoKChkKSAtPlxyXG4gICAgICAgICAgICAgICAgaWYgbGFiZWxZTWF4V2lkdGggPCB0aGlzLmdldEJCb3goKS53aWR0aFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsWU1heFdpZHRoID0gdGhpcy5nZXRCQm94KCkud2lkdGhcclxuICAgICAgICAgICAgKS5hcHBlbmQoJ3RzcGFuJykudGV4dCgoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiAgX2RhdGFfb3JpZy5kYXRhW2ldPy5zdWJ0ZXh0P1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyAgJyArIF9kYXRhX29yaWcuZGF0YVtpXS5zdWJ0ZXh0ICsgJydcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJ1xyXG4gICAgICAgICAgICApLmF0dHIoXHJcbiAgICAgICAgICAgICAgICAndGV4dC1hbmNob3InOiAnbWlkZGxlJ1xyXG4gICAgICAgICAgICAgICAgJ2FsaWdubWVudC1iYXNlbGluZSc6ICdhZnRlci1lZGdlJ1xyXG4gICAgICAgICAgICAgICAgJ2NsYXNzJyA6ICdncmFwaC1zdWJ2YWx1ZSdcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBiYXJWYWx1ZXMuZXhpdCgpLnJlbW92ZSgpXHJcblxyXG5cclxuICAgICAgICAgICAgIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cclxuICAgICAgICAgICAgIyBUbyB0cmltIHRoZSB4QXhpcyBsYWJlbHNcclxuXHJcbiAgICAgICAgICAgIHRyaW1tZWRMYWJlbHMgPSBbXVxyXG4gICAgICAgICAgICB4QXhpc0xhYmVscyA9IHN2Zy5zZWxlY3QoJy54LWF4aXMtZ3JvdXAuZ3JhcGgtYXhpcycpLnNlbGVjdEFsbCgnLnRpY2snKS5kYXRhKF9sYWJlbHMpXHJcbiAgICAgICAgICAgIHhBeGlzTGFiZWxzLnNlbGVjdCgndGV4dCcpLmVhY2goKGQpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxMZW5ndGggPSBNYXRoLnJvdW5kKGQubGVuZ3RoICogYmFyVyAvIHRoaXMuZ2V0QkJveCgpLndpZHRoKVxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsICA9IGQuc2xpY2UoMCxsYWJlbExlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBpZiBkLmxlbmd0aCA+IGxhYmVsLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCArPSAgJy4uLidcclxuICAgICAgICAgICAgICAgICAgICB0cmltbWVkTGFiZWxzLnB1c2ggbGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAjIHRoaXMudGV4dChsYWJlbClcclxuICAgICAgICAgICAgICAgICkudGV4dCgoZCwgaSkgLT5cclxuICAgICAgICAgICAgICAgICAgICB0cmltbWVkTGFiZWxzW2ldXHJcbiAgICAgICAgICAgICAgICApXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICMgbGFiZWxZTWF4V2lkdGggKz0gNVxyXG4gICAgICAgICAgICAjIHdpZHRoUmF0aW8gPSAobGFiZWxZTWF4V2lkdGggKyAyMCArIHdpZHRoKSAvIHdpZHRoXHJcblxyXG4gICAgICAgICAgICAjIHN2Zy5zZWxlY3QoJy5jb250YWluZXItZ3JvdXAnKS5hdHRyIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgnICsgbGFiZWxZTWF4V2lkdGggKyAnLCAwKSdcclxuICAgICAgICAgICAgc3ZnLnNlbGVjdCgnLmNvbnRhaW5lci1ncm91cCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0ciB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyArIChtYXJnaW4ubGVmdCkgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknXHJcbiAgICAgICAgICAgIHN2Zy5zZWxlY3QoJy5jaGFydC1ncm91cCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0ciB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyArIChncmFwaE9mZnNldExlZnQpICsgJywwKSdcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgIyBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5hdHRyXHJcbiAgICAgICAgICAgICMgICAgIHdpZHRoOiB3aWR0aFxyXG4gICAgICAgICAgICAjICAgICBoZWlnaHQ6IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgIyB2aWV3Qm94OiBcIjAgMCBcIiArICh3aWR0aCArIGxhYmVsWU1heFdpZHRoKSArIFwiIFwiICsgaGVpZ2h0XHJcblxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDIwMFxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBleHBvcnRzLndpZHRoID0gKF94KSAtPlxyXG4gICAgICAgIGlmICFhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICAgIHJldHVybiB3aWR0aFxyXG4gICAgICAgIHdpZHRoID0gcGFyc2VJbnQoX3gpXHJcbiAgICAgICAgdGhpc1xyXG5cclxuICAgIGV4cG9ydHMuaGVpZ2h0ID0gKF94KSAtPlxyXG4gICAgICAgIGlmICFhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICAgIHJldHVybiBoZWlnaHRcclxuICAgICAgICBoZWlnaHQgPSBwYXJzZUludChfeClcclxuICAgICAgICBkdXJhdGlvbiA9IDBcclxuICAgICAgICB0aGlzXHJcblxyXG4gICAgZXhwb3J0cy5nYXAgPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIGdhcFxyXG4gICAgICAgIGdhcCA9IF94XHJcbiAgICAgICAgdGhpc1xyXG5cclxuICAgIGV4cG9ydHMuZWFzZSA9IChfeCkgLT5cclxuICAgICAgICBpZiAhYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgICByZXR1cm4gZWFzZVxyXG4gICAgICAgIGVhc2UgPSBfeFxyXG4gICAgICAgIHRoaXNcclxuXHJcbiAgICBkMy5yZWJpbmQgZXhwb3J0cywgZGlzcGF0Y2gsICdvbidcclxuICAgIGV4cG9ydHNcclxuXHJcblxyXG5cclxuXHJcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuIyMgYmFyQ2hhcnRcclxuXHJcbmQzLmN1c3RvbS5iYXJDaGFydCA9IC0+XHJcbiAgICB3aWR0aCAgID0gNTAwXHJcbiAgICBoZWlnaHQgID0gNTAwXHJcbiAgICBlYXNlICAgID0gJ2N1YmljLWluLW91dCdcclxuICAgIHN2ZyAgICAgPSB1bmRlZmluZWRcclxuXHJcbiAgICBtYXJnaW4gID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShndXR0ZXIpKVxyXG4gICAgIyB0b3AgICAgIDogMzBcclxuICAgICMgcmlnaHQgICA6IDE1XHJcbiAgICAjIGJvdHRvbSAgOiAyNVxyXG4gICAgIyBsZWZ0ICAgIDogMFxyXG5cclxuICAgIF9jb2xvcnMgPSBbXHJcbiAgICAgICAgJyNlYzAwOGMnXHJcbiAgICAgICAgJyMyNDllYjInXHJcbiAgICAgICAgJyNiM2IzYjMnXHJcbiAgICAgICAgJ3JnYigxNTcsIDE2MiwgMjI3KSdcclxuICAgICAgICAnI2U5NzQ2ZCdcclxuICAgICAgICAnIzlhYzhlMidcclxuICAgICAgICAnI2YyZDFkOSdcclxuICAgIF1cclxuXHJcbiAgICBkdXJhdGlvbiA9IDUwMFxyXG4gICAgZGlzcGF0Y2ggPSBkMy5kaXNwYXRjaCgnY3VzdG9tSG92ZXInKVxyXG5cclxuICAgIGV4cG9ydHMgPSAoX3NlbGVjdGlvbikgLT5cclxuICAgICAgICBfc2VsZWN0aW9uLmVhY2ggKF9kYXRhX29yaWcpIC0+XHJcbiAgICAgICAgICAgIG1hcmdpbi5yaWdodCAgPSBndXR0ZXIucmlnaHQgLSAxNVxyXG4gICAgICAgICAgICBtYXJnaW4ubGVmdCAgID0gZ3V0dGVyLmxlZnQgLSAxNVxyXG4gICAgICAgICAgICAjIG1hcmdpbi50b3AgID0gaGVpZ2h0ICogMC4xMjVcclxuICAgICAgICAgICAgbWFyZ2luLnRvcCAgICA9IGd1dHRlci50b3AgXHJcbiAgICAgICAgICAgIG1hcmdpbi5ib3R0b20gPSBndXR0ZXIuYm90dG9tIC0gMTNcclxuXHJcbiAgICAgICAgICAgIGNoYXJ0VyA9IHdpZHRoIC0gKG1hcmdpbi5sZWZ0KSAtIChtYXJnaW4ucmlnaHQpXHJcbiAgICAgICAgICAgIGNoYXJ0SCA9IGhlaWdodCAtIChtYXJnaW4udG9wKSAtIChtYXJnaW4uYm90dG9tKVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICFfZGF0YV9vcmlnXHJcbiAgICAgICAgICAgICAgICBfZGF0YV9vcmlnID0ge31cclxuICAgICAgICAgICAgICAgIF9kYXRhX29yaWcuZGF0YSA9IFtdXHJcblxyXG4gICAgICAgICAgICBfZGF0YSAgPSBfZGF0YV9vcmlnLmRhdGFcclxuXHJcblxyXG4gICAgICAgICAgICB0b3RhbCAgPSAwXHJcbiAgICAgICAgICAgIF9kYXRhLmZvckVhY2ggKGVudHJ5LGkpIC0+XHJcbiAgICAgICAgICAgICAgICBlbnRyeS5kID0gaWYgcGFyc2VJbnQoZW50cnkuZCkgdGhlbiBwYXJzZUludChlbnRyeS5kKSBlbHNlIDBcclxuICAgICAgICAgICAgICAgIHRvdGFsICAgPSB0b3RhbCArIGVudHJ5LmRcclxuXHJcblxyXG4gICAgICAgICAgICBsZW5ndGggPSBfZGF0YS5sZW5ndGhcclxuXHJcbiAgICAgICAgICAgIG1heCA9IGQzLm1heChfZGF0YSwgKGQpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgZC5kXHJcbiAgICAgICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICBjb2xvcnMgPSAoaSwgZW50cnkpLT5cclxuICAgICAgICAgICAgICAgIGlmIGVudHJ5Py5jb2xvcj8udmFsdWU/XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmNvbG9yLnZhbHVlXHJcbiAgICAgICAgICAgICAgICBpZiBfY29sb3JzLmxlbmd0aCA8IGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGggJSBfY29sb3JzLmxlbmd0aFxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBfY29sb3JzW2ldXHJcblxyXG4gICAgICAgICAgICBpZiAhc3ZnXHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuaHRtbChcIlwiKVxyXG4gICAgICAgICAgICAgICAgc3ZnID0gZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgnc3ZnJykuY2xhc3NlZCgnY2hhcnQnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gc3ZnLmFwcGVuZCgnZycpLmNsYXNzZWQoJ2NvbnRhaW5lci1ncm91cCcsIHRydWUpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKCdnJykuY2xhc3NlZCAnY2hhcnQtZ3JvdXAnLCB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgIyBkcmF3R3JpZChzdmcsd2lkdGgsaGVpZ2h0LDAsMTUpXHJcblxyXG4gICAgICAgICAgICBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5hdHRyXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcclxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgNVxyXG5cclxuICAgICAgICAgICAgc3ZnLnNlbGVjdCgnLmNvbnRhaW5lci1ncm91cCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0ciB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyArIG1hcmdpbi5sZWZ0ICsgJywnICsgbWFyZ2luLnRvcCArICcpJ1xyXG5cclxuICAgICAgICAgICAgY2hhcnQgPSBzdmcuc2VsZWN0KCcuY2hhcnQtZ3JvdXAnKS5hdHRyXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogY2hhcnRXXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGNoYXJ0SCArIDVcclxuXHJcblxyXG4gICAgICAgICAgICBzdmcuc2VsZWN0KFwiLmNoYXJ0LWdyb3VwXCIpLmh0bWwoXCJcIilcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdhc2QnXHJcblxyXG5cclxuICAgICAgICAgICAgIyBmb3IgZW50cnksaSBpbiBfZGF0YVxyXG4gICAgICAgICAgICBfZGF0YS5mb3JFYWNoIChlbnRyeSxpKSAtPlxyXG4gICAgICAgICAgICAgICAgcm93ID0gY2hhcnQuYXBwZW5kKCdnJykuY2xhc3NlZCgnZ3JhcGgtaG9yaXpvbnRhbC1yb3cnLHRydWUpXHJcblxyXG4gICAgICAgICAgICAgICAgIyBsYWJlbFxyXG4gICAgICAgICAgICAgICAgbGFiZWxfd2lkdGggICAgID0gcm93X3dpZHRoXHJcbiAgICAgICAgICAgICAgICBncmFwaExhYmVsICAgICAgPSByb3cuYXBwZW5kKCdnJykuY2xhc3NlZCggJ2dyYXBoLWhvcml6b250YWwtbGFiZWwnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JykudGV4dChlbnRyeS5sYWJlbClcclxuXHJcbiAgICAgICAgICAgICAgICBncmFwaExhYmVsSGVpZ2h0ID0gZ3JhcGhMYWJlbC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICBsYWJlbE9mZnNldFRvcCAgID0gMlxyXG5cclxuICAgICAgICAgICAgICAgIHBhZGRpbkJvdHRvbSA9IChjaGFydEggLSBncmFwaExhYmVsSGVpZ2h0ICogbGVuZ3RoICkgLyBsZW5ndGggLyAyXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5Cb3R0b20gPSAocGFkZGluQm90dG9tICsgY2hhcnRIIC0gZ3JhcGhMYWJlbEhlaWdodCAqIGxlbmd0aCApIC8gbGVuZ3RoIC8gMS45XHJcblxyXG4gICAgICAgICAgICAgICAgcm93X2hlaWdodCA9IChjaGFydEggKyBwYWRkaW5Cb3R0b20pL2xlbmd0aCBcclxuICAgICAgICAgICAgICAgIHJvd193aWR0aCAgPSAoY2hhcnRXKVxyXG5cclxuICAgICAgICAgICAgICAgIHJvdy5hdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICAgIDogcm93X2hlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICAgICA6IHJvd193aWR0aFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybSA6ICd0cmFuc2xhdGUoMCwnICsgcm93X2hlaWdodCAqIGkgKyAnKSdcclxuXHJcbiAgICAgICAgICAgICAgICBncmFwaExhYmVsLmF0dHJcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBsYWJlbE9mZnNldFRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCAgICAgIDogbGFiZWxfd2lkdGggKiAwLjNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICAgICA6IGdyYXBoTGFiZWxIZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtYW5jaG9yJzogJ3N0YXJ0J1xyXG5cclxuICAgICAgICAgICAgICAgIGJhcl9oZWlnaHQgPSByb3dfaGVpZ2h0IC0gZ3JhcGhMYWJlbEhlaWdodCAtIGxhYmVsT2Zmc2V0VG9wXHJcblxyXG4gICAgICAgICAgICAgICAgIyBiYXJcclxuICAgICAgICAgICAgICAgIGJhcl93aWR0aCA9IHJvd193aWR0aCAgKiBlbnRyeS5kIC8gbWF4ICogMC44XHJcbiAgICAgICAgICAgICAgICBpZiBiYXJfd2lkdGggPT0gMFxyXG4gICAgICAgICAgICAgICAgICAgIGJhcl93aWR0aCA9IDFcclxuXHJcbiAgICAgICAgICAgICAgICBiYXJPZmZzZXRZID0gKGdyYXBoTGFiZWxIZWlnaHQgKyBsYWJlbE9mZnNldFRvcCkgLyAyXHJcbiAgICAgICAgICAgICAgICByb3cuYXBwZW5kKCdnJykuY2xhc3NlZCggJ2dyYXBoLWhvcml6b250YWwtYmFyLXdycCcsIHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpLmNsYXNzZWQoJ2dyYXBoLWhvcml6b250YWwtYmFyJywgdHJ1ZSkuYXR0cihcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCAgICAgIDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCAgOiBiYXJfd2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSAgICAgIDogYmFyT2Zmc2V0WVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiBiYXJfaGVpZ2h0ICogMC41KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShmaWxsOiBjb2xvcnMoaSwgZW50cnkpKVxyXG5cclxuICAgICAgICAgICAgICAgICMgYmFyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBncmFwaFZhbHVlID0gcm93LmFwcGVuZCgnZycpLmNsYXNzZWQoICdncmFwaC1ob3Jpem9udGFsLWJhci12YWx1ZScsIHRydWUpXHJcbiAgICAgICAgICAgICAgICBiYXJPZmZzZXRZID0gYmFyT2Zmc2V0WSArIGJhcl9oZWlnaHQgKiAwLjI1XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JhcGhWYWx1ZS5hcHBlbmQoJ3RleHQnKS5hdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IGJhcl93aWR0aCArIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJhck9mZnNldFlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyB5OiBiYXJfaGVpZ2h0IC8gNCArIGdyYXBoTGFiZWxIZWlnaHQgKyBsYWJlbE9mZnNldFRvcFxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYWxpZ25tZW50LWJhc2VsaW5lJyA6ICdiZWZvcmUtZWRnZSdcclxuICAgICAgICAgICAgICAgICAgICAudGV4dChlbnRyeS5kKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnN1YnRleHQ/IGFuZCBlbnRyeS5zdWJ0ZXh0ICE9ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhWYWx1ZUhlaWdodCA9IGdyYXBoVmFsdWUubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoVmFsdWUuYXBwZW5kKCd0ZXh0JykuYXR0clxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYmFyX3dpZHRoICsgMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGdyYXBoVmFsdWVIZWlnaHQgKiAxLjAgKyBiYXJPZmZzZXRZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHk6IGJhcl9oZWlnaHQgLyA0ICsgZ3JhcGhMYWJlbEhlaWdodCArIGxhYmVsT2Zmc2V0VG9wICsgZ3JhcGhWYWx1ZUhlaWdodC8zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FsaWdubWVudC1iYXNlbGluZScgOiAnYmVmb3JlLWVkZ2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGVudHJ5LnN1YnRleHQpXHJcblxyXG4gICAgICAgICAgICAgICAgZ3JhcGhWYWx1ZUhlaWdodCA9IGdyYXBoVmFsdWUubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgZ3JhcGhWYWx1ZS5hdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsLScgKyAoZ3JhcGhWYWx1ZUhlaWdodC8yKSArICcpJ1xyXG5cclxuICAgICAgICAgICAgICAgICMgZG90dGVkIHNlcGFyYXRvclxyXG4gICAgICAgICAgICAgICAgcm93LmFwcGVuZCgnZycpLmNsYXNzZWQoICdncmFwaC1ob3Jpem9udGFsLWJhci1zZXBhcmF0b3InLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2xpbmUnKS5hdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxOiBncmFwaExhYmVsSGVpZ2h0LzIgKyBiYXJfaGVpZ2h0ICogMC43XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyOiByb3dfd2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTI6IGdyYXBoTGFiZWxIZWlnaHQvMiArIGJhcl9oZWlnaHQgKiAwLjdcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgIGV4cG9ydHMud2lkdGggPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIHdpZHRoXHJcbiAgICAgICAgd2lkdGggPSBwYXJzZUludChfeClcclxuICAgICAgICB0aGlzXHJcblxyXG4gICAgZXhwb3J0cy5oZWlnaHQgPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIGhlaWdodFxyXG4gICAgICAgIGhlaWdodCA9IHBhcnNlSW50KF94KVxyXG4gICAgICAgIGR1cmF0aW9uID0gMFxyXG4gICAgICAgIHRoaXNcclxuXHJcbiAgICBleHBvcnRzLmVhc2UgPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIGVhc2VcclxuICAgICAgICBlYXNlID0gX3hcclxuICAgICAgICB0aGlzXHJcblxyXG4gICAgZDMucmViaW5kIGV4cG9ydHMsIGRpc3BhdGNoLCAnb24nXHJcbiAgICBleHBvcnRzXHJcblxyXG5cclxuXHJcblxyXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcbiMjIGxpbmVDaGFydFxyXG5kMy5jdXN0b20ubGluZUNoYXJ0ID0gLT5cclxuICAgIG1hcmdpbiAgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGd1dHRlcikpXHJcbiAgICAjIHRvcCAgICAgOiAzMFxyXG4gICAgIyByaWdodCAgIDogMTVcclxuICAgICMgYm90dG9tICA6IDI1XHJcbiAgICAjIGxlZnQgICAgOiAwXHJcbiAgICB3aWR0aCAgID0gNTAwXHJcbiAgICBoZWlnaHQgID0gNTAwXHJcbiAgICBlYXNlICAgID0gJ2N1YmljLWluLW91dCdcclxuICAgIHN2ZyAgICAgPSB1bmRlZmluZWRcclxuICAgIF9jb2xvcnMgPSBbXHJcbiAgICAgICAgJyMyNDlFQjInXHJcbiAgICAgICAgJyNiM2IzYjMnXHJcbiAgICAgICAgJ3JnYigxNTcsIDE2MiwgMjI3KSdcclxuICAgICAgICAnI2U5NzQ2ZCdcclxuICAgICAgICAnIzlhYzhlMidcclxuICAgICAgICAnI2YyZDFkOSdcclxuICAgIF1cclxuICAgIGR1cmF0aW9uID0gNTAwXHJcbiAgICBkaXNwYXRjaCA9IGQzLmRpc3BhdGNoKCdjdXN0b21Ib3ZlcicpXHJcblxyXG4gICAgZXhwb3J0cyA9IChfc2VsZWN0aW9uKSAtPlxyXG4gICAgICAgIF9zZWxlY3Rpb24uZWFjaCAoX2RhdGFfb3JpZykgLT5cclxuICAgICAgICAgICAgYHZhciBkYXRhc2V0YFxyXG5cclxuICAgICAgICAgICAgZHJhdyA9IChlbGUpLT5cclxuICAgICAgICAgICAgICAgIG1hcmdpbi50b3AgICAgICA9IGd1dHRlci50b3AgLSAxMFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luLmJvdHRvbSAgID0gZ3V0dGVyLmJvdHRvbVxyXG5cclxuICAgICAgICAgICAgICAgIG1hcmdpbi5yaWdodCAgICA9IGd1dHRlci5yaWdodCAtIDE1XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4ubGVmdCAgICAgPSBndXR0ZXIubGVmdCAtIDE1ICAjIGNhbGN1bGF0ZSBhY3R1YWwgd2lkdGggb2YgeSBheGlzXHJcblxyXG4gICAgICAgICAgICAgICAgY2hhcnRXID0gd2lkdGggIC0gKG1hcmdpbi5sZWZ0KSAtIChtYXJnaW4ucmlnaHQpXHJcbiAgICAgICAgICAgICAgICBjaGFydEggPSBoZWlnaHQgLSAobWFyZ2luLnRvcCkgLSAobWFyZ2luLmJvdHRvbSlcclxuXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb24gPVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0VyA6IGNoYXJ0V1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0SCA6IGNoYXJ0SFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbiA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgIDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA6IDVcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgIyBwcmVwcm9jZXNzIGRhdGEgaWYgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgIGlmICFfZGF0YV9vcmlnXHJcbiAgICAgICAgICAgICAgICAgICAgX2RhdGFfb3JpZyA9IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgX2RhdGFfb3JpZy5kYXRhID0gW11cclxuICAgICAgICAgICAgICAgICAgICBfZGF0YV9vcmlnLmxhYmVscyA9IFtdXHJcblxyXG4gICAgICAgICAgICAgICAgZGF0YXNldCA9IF9kYXRhX29yaWcuZGF0YVxyXG4gICAgICAgICAgICAgICAgbGFiZWxzICA9IF9kYXRhX29yaWcubGFiZWxzXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBjb2xvcnMgPSAoaSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIF9jb2xvcnMubGVuZ3RoIDwgbGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGggJSBfY29sb3JzLmxlbmd0aFxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbG9yc1tpXVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAjIENyZWF0ZSB0aGUgU1ZHICdjYW52YXMnIEFuZCBhcHBlbmQgYWxsIHdyYXBwZXIgZWxlXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgIXN2Z1xyXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdChlbGUpLmh0bWwoXCJcIilcclxuICAgICAgICAgICAgICAgICAgICBzdmcgPSBkMy5zZWxlY3QoZWxlKS5hcHBlbmQoJ3N2ZycpLmNsYXNzZWQoJ2NoYXJ0IExpbmUnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoJ2cnKS5jbGFzc2VkKCdjb250YWluZXItZ3JvdXAnLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5jbGFzc2VkICd4LWF4aXMtZ3JvdXAgZ3JhcGgtYXhpcyB4YXhpcycsIHRydWVcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKCdnJykuY2xhc3NlZCAneS1heGlzLWdyb3VwIGdyYXBoLWF4aXMgeWF4aXMnLCB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZCgnZycpLmNsYXNzZWQgJ2NoYXJ0LWdyb3VwJywgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2cnKS5jbGFzc2VkICdsZWdlbmQtZ3JvdXAnLCB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICMgZHJhd0dyaWQoc3ZnLHdpZHRoLGhlaWdodCwwLDE1KVxyXG5cclxuICAgICAgICAgICAgICAgICMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxyXG4gICAgICAgICAgICAgICAgIyBDb250YWluZXJcclxuXHJcbiAgICAgICAgICAgICAgICBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5hdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoICsgMTUgIyBleHRyYSB3aWR0aCB0byBwcmV2ZW50IGNsaXBwaW5nIHhheGlzIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XHJcblxyXG4gICAgICAgICAgICAgICAgc3ZnLnNlbGVjdCgnLmNvbnRhaW5lci1ncm91cCcpLmF0dHIgdHJhbnNmb3JtOiAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKSdcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgIyB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+XHJcbiAgICAgICAgICAgICAgICAjIExlZ2VuZHNcclxuXHJcbiAgICAgICAgICAgICAgICBsZWdlbmRHcnAgICAgPSBzdmcuc2VsZWN0KCdnLmxlZ2VuZC1ncm91cCcpXHJcbiAgICAgICAgICAgICAgICBkcmF3TGVnZW5kcyhsZWdlbmRHcnAsbGFiZWxzLF9jb2xvcnMsZGltZW5zaW9uKVxyXG5cclxuICAgICAgICAgICAgICAgIGxlZ2VuZFdpZHRoICA9IGxlZ2VuZEdycC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcclxuICAgICAgICAgICAgICAgIGxlZ2VuZEhlaWdodCA9IGxlZ2VuZEdycC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICBjaGFydEggICAgICAgPSBjaGFydEggLSBsZWdlbmRIZWlnaHQgLSAxMFxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAjIH5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5cclxuICAgICAgICAgICAgICAgICMgUGxvdCB5LWF4aXNcclxuXHJcbiAgICAgICAgICAgICAgICBtYXggPSBbXVxyXG4gICAgICAgICAgICAgICAgbGFiZWxzLmZvckVhY2ggKGxhYmVsLGkpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4W2ldID0gZDMubWF4KGRhdGFzZXQsIChkKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkW2xhYmVsXSlcclxuXHJcbiAgICAgICAgICAgICAgICBtYXggPSBkMy5tYXgobWF4KVxyXG5cclxuICAgICAgICAgICAgICAgIHlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgbWF4ICogMS41XSkgIyAxLjUgaXMgYSBhcHByb3hpbWF0ZSB2YWx1ZSwgZDMgd2lsbCBhZ2FpbiByb3VuZCBpdCBvZmZcclxuICAgICAgICAgICAgICAgICAgICAucmFuZ2UoW2NoYXJ0SCwgMF0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHlBeGlzICA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeVNjYWxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vcmllbnQoJ2xlZnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KChkKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkXHJcbiAgICAgICAgICAgICAgICAgICAgKS50aWNrU2l6ZSgwKS50aWNrcyg1KVxyXG5cclxuICAgICAgICAgICAgICAgIHlBeGlzR3JvdXAgPSBzdmcuc2VsZWN0KCcueS1heGlzLWdyb3VwLmdyYXBoLWF4aXMnKS5jYWxsIHlBeGlzXHJcbiAgICAgICAgICAgICAgICB5QXhpc1dpZHRoID0geUF4aXNHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcclxuICAgICAgICAgICAgICAgIGdyYXBoT2Zmc2V0TGVmdCA9IHlBeGlzV2lkdGggKyA1XHJcblxyXG4gICAgICAgICAgICAgICAgeUF4aXNHcm91cC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oZHVyYXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVhc2UoZWFzZSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cih0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyArICggeUF4aXNXaWR0aCApICsgJywwKScpXHJcblxyXG4gICAgICAgICAgICAgICAgY2hhcnRXID0gY2hhcnRXIC0gZ3JhcGhPZmZzZXRMZWZ0XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxyXG4gICAgICAgICAgICAgICAgIyBQbG90IHgtYXhpc1xyXG5cclxuICAgICAgICAgICAgICAgIHhTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZVJvdW5kQmFuZHMoWyAwLCBjaGFydFddLCAxLCAwKVxyXG5cclxuICAgICAgICAgICAgICAgIHhTY2FsZS5kb21haW4gZGF0YXNldC5tYXAoKGQpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgZC5sYWJlbCApXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cgJ3VwZGF0ZWQnXHJcblxyXG4gICAgICAgICAgICAgICAgeEF4aXNUaWNrUGFkZGluZyA9IDRcclxuICAgICAgICAgICAgICAgIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2NhbGUoeFNjYWxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub3JpZW50KCdib3R0b20nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGlja1NpemUoLShjaGFydEggLSB4QXhpc1RpY2tQYWRkaW5nKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRpY2tQYWRkaW5nKDMgKyB4QXhpc1RpY2tQYWRkaW5nKVxyXG5cclxuICAgICAgICAgICAgICAgIHN2Zy5zZWxlY3QoJy54LWF4aXMtZ3JvdXAuZ3JhcGgtYXhpcycpLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihkdXJhdGlvbikuZWFzZShlYXNlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgnICsgZ3JhcGhPZmZzZXRMZWZ0ICsgJywnICsgKGNoYXJ0SC14QXhpc1RpY2tQYWRkaW5nKSArICcpJykuY2FsbCB4QXhpc1xyXG4gICAgICAgICAgICAgICAgICAgICMgLmF0dHIoeDowLHk6Y2hhcnRILTUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhbGwgeEF4aXNcclxuXHJcbiAgICAgICAgICAgICAgICAjIG9mZnNldCA9IHN2Zy5zZWxlY3QoJy54LWF4aXMtZ3JvdXAuZ3JhcGgtYXhpcycpLnNlbGVjdCgnLnRpY2snKS5hdHRyKCd0cmFuc2Zvcm0nKVxyXG4gICAgICAgICAgICAgICAgY2hhcnQgID0gc3ZnLnNlbGVjdCgnZy5jaGFydC1ncm91cCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgZ3JhcGhPZmZzZXRMZWZ0ICsgJywwKScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIC5hdHRyKCd0cmFuc2Zvcm0nLCBvZmZzZXQpXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICMgfn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+flxyXG4gICAgICAgICAgICAgICAgIyBEcmF3IGxpbmUgZ3JhcGhcclxuXHJcbiAgICAgICAgICAgICAgICBfZGF0YSA9IGRhdGFzZXRcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gW11cclxuICAgICAgICAgICAgICAgIGxhYmVscy5mb3JFYWNoIChsYWJlbCxpKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldID0gZDMuc3ZnLmxpbmUoKS54KChkKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCArIHhTY2FsZSBkLmxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkueSgoZCkgLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlTY2FsZSBkW2xhYmVsXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmFwcGVuZCgnc3ZnOnBhdGgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCdncmFwaC1saW5lLXBhdGgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIGNvbG9ycyhpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIgJ2QnLCBsaW5lc1tpXShfZGF0YSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlX2xhYmVsID0gJ2NpcmNsZV8nICsgJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdEFsbChjaXJjbGVfbGFiZWwpLmRhdGEoZGF0YXNldCkuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdncmFwaC1saW5lLXBvaW50cydcclxuICAgICAgICAgICAgICAgICAgICAgICAgKS5hdHRyKCdjeCcsIChkLGkpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwICsgeFNjYWxlIGQubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKS5hdHRyKCdjeScsIChkKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeVNjYWxlIGRbbGFiZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkuYXR0cigncicsIDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdmaWxsJyxjb2xvcnMoaSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGRyYXcodGhpcylcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgIGV4cG9ydHMud2lkdGggPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIHdpZHRoXHJcbiAgICAgICAgd2lkdGggPSBwYXJzZUludChfeClcclxuICAgICAgICB0aGlzXHJcblxyXG4gICAgZXhwb3J0cy5oZWlnaHQgPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIGhlaWdodFxyXG4gICAgICAgIGhlaWdodCA9IHBhcnNlSW50KF94KVxyXG4gICAgICAgIGR1cmF0aW9uID0gMFxyXG4gICAgICAgIHRoaXNcclxuXHJcbiAgICBleHBvcnRzLmVhc2UgPSAoX3gpIC0+XHJcbiAgICAgICAgaWYgIWFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgcmV0dXJuIGVhc2VcclxuICAgICAgICBlYXNlID0gX3hcclxuICAgICAgICB0aGlzXHJcblxyXG4gICAgZDMucmViaW5kIGV4cG9ydHMsIGRpc3BhdGNoLCAnb24nXHJcbiAgICBleHBvcnRzXHJcbiJdfQ==