(function() {
  window.Graph = (function() {
    Graph.prototype.graphData = void 0;

    Graph.prototype.colors = [];

    Graph.prototype.redrawOnResize = false;

    Graph.prototype.phaseCount = 0;

    function Graph($ele, graphData) {
      this.$ele = $ele;
      this.graphData = graphData;
      this.create();
      this.init();
    }

    Graph.prototype.init = function() {
      return this.redraw();
    };

    Graph.prototype.create = function() {
      this.svgEle = d3.select(this.$ele[0]).append('svg');
      this.baseGroup = this.svgEle.append("g");
      this.setDimensions();
    };

    Graph.prototype.setViewBox = function() {
      return this.svgEle.attr('viewBox', "0 0 " + this.netWidth + " " + this.netHeight);
    };

    Graph.prototype.setDimensions = function() {
      var $window, callback, firstTime;
      this.margin = this.margin || {
        left: 40,
        right: 120,
        top: 30,
        bottom: 80
      };
      this.marginOriginal = jQuery.extend(true, {}, this.margin);
      this.widgetPadding = {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15
      };
      firstTime = true;
      this.resetDimension = callback = (function(_this) {
        return function() {
          var ref;
          ref = [_this.$ele.width() + (_this.widgetPadding.left + _this.widgetPadding.right), _this.$ele.height() + (_this.widgetPadding.top + _this.widgetPadding.bottom - 4)], _this.netWidth = ref[0], _this.netHeight = ref[1];
          _this.width = _this.netWidth - _this.margin.left - _this.margin.right;
          _this.height = _this.netHeight - _this.margin.top - _this.margin.bottom;
          _this.widthOriginal = _this.width;
          _this.svgEle.attr('width', _this.netWidth);
          _this.svgEle.attr('height', _this.netHeight);
          if (firstTime || _this.redrawOnResize) {
            firstTime = false;
            _this.setViewBox();
          }
        };
      })(this);
      $window = $(window);
      $window.on('resize', callback);
      $window.trigger('resize');
      $window.on('resize', (function(_this) {
        return function() {
          return _this.resize();
        };
      })(this));
      return this.svgEle.style('margin', -this.widgetPadding.left);
    };

    Graph.prototype.wrapText = function(_this, width) {
      var self, text, textLength;
      self = d3.select(_this);
      textLength = self.node().getComputedTextLength();
      text = self.text();
      while (textLength > width && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + '...');
        textLength = self.node().getComputedTextLength();
      }
    };

    Graph.prototype.drawLegends = function(data, colors) {
      var gridwidth, isOddLength, legendGrp, legendOffsetX, legendOffsetY, legendPerRow, length, maxRows, rowHeight, spacing, textWidth, totalOffset, wrapText;
      legendOffsetY = this.netHeight - this.widgetPadding.top - 8;
      legendOffsetX = this.widgetPadding.left;
      gridwidth = this.netWidth - this.widgetPadding.left - this.widgetPadding.right;
      spacing = 20;
      rowHeight = 15;
      textWidth = 70;
      legendPerRow = Math.max(Math.floor(gridwidth / (spacing + textWidth)), 1);
      isOddLength = data.length % 2 === 1;
      length = data.length;
      wrapText = this.wrapText;
      maxRows = Math.ceil(length / legendPerRow);
      totalOffset = (maxRows - 1) * rowHeight;
      if (legendPerRow === 1) {
        textWidth = this.width - spacing;
      } else if (legendPerRow >= length) {
        if (gridwidth * 0.8 > (textWidth + spacing) * length) {
          legendOffsetX += (gridwidth - (textWidth + spacing) * length) / 2;
        }
      }
      legendGrp = this.baseGroup.append('g').attr("class", "legend").attr('transform', "translate(" + legendOffsetX + "," + legendOffsetY + ")");
      data.forEach((function(_this) {
        return function(entry, index) {
          var legend, offsetX, offsetY, rect, text;
          offsetX = (index % legendPerRow) * (Math.floor(gridwidth / legendPerRow));
          offsetY = -totalOffset + Math.floor(index / legendPerRow) * rowHeight;
          legend = legendGrp.append('g').attr('transform', "translate(" + offsetX + "," + offsetY + ")");
          rect = legend.append('rect').attr('x', 0).attr('y', 0).attr('fill', colors[index]).attr('width', 8).attr('height', 8);
          return text = legend.append('text').attr('x', 11).attr('y', 8).attr('class', 'legend-text').text(function() {
            return entry.toUpperCase();
          }).each(function() {
            return wrapText(this, textWidth);
          });
        };
      })(this));
      return maxRows * rowHeight;
    };

    Graph.prototype.clear = function() {
      var ref;
      return $((ref = this.baseGroup) != null ? ref[0][0] : void 0).html('');
    };

    Graph.prototype.remove = function() {
      return this.svgEle.remove();
    };

    Graph.prototype.redraw = function() {
      var height, width;
      this.clear();
      this.graphGrp = this.baseGroup.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.render();
      if (this.showGuide) {
        width = this.netWidth - 15 - 15;
        height = this.netHeight - 15 - 15;
        return this.baseGroup.append('rect').attr('width', width).attr('height', height).attr("x", 15).attr("y", 15).style('fill', 'rgba(0,0,0,.2)');
      }
    };

    Graph.prototype.update = function(graphData) {
      this.graphData = graphData;
      this.phaseCount = 0;
      this.redraw();
      return typeof this.onUpdate === "function" ? this.onUpdate() : void 0;
    };

    Graph.prototype.resize = function() {
      this.phaseCount = 0;
      this.redraw();
      return typeof this.onResize === "function" ? this.onResize() : void 0;
    };

    Graph.prototype.render = function() {
      return typeof this.onRender === "function" ? this.onRender() : void 0;
    };

    return Graph;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,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Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyB3aW5kb3cuR3JhcGhcbiAgICBncmFwaERhdGEgOiB1bmRlZmluZWRcblxuICAgIGNvbG9ycyA6IFtdXG5cbiAgICByZWRyYXdPblJlc2l6ZSA6IGZhbHNlXG5cbiAgICAjIGdyYXBoIGlzIGRyYXduIGlzIHR3byBwaGFzZXNcbiAgICBwaGFzZUNvdW50IDogMFxuXG4gICAgIyBzaG93R3VpZGUgOiB0cnVlXG5cbiAgICBjb25zdHJ1Y3RvcjogKEAkZWxlLEBncmFwaERhdGEpLT5cbiAgICAgICAgQGNyZWF0ZSgpXG4gICAgICAgIEBpbml0KClcblxuXG5cblxuICAgIGluaXQ6LT5cbiAgICAgICAgQHJlZHJhdygpXG5cblxuICAgIGNyZWF0ZSA6IC0+XG4gICAgICAgICMgY3JlYXRlIHN2ZyBlbGVtZW50IGFuZCBzZXQgZGltZW5zaW9uc1xuICAgICAgICBAc3ZnRWxlID0gZDMuc2VsZWN0KEAkZWxlWzBdKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIEBiYXNlR3JvdXAgPSBAc3ZnRWxlLmFwcGVuZChcImdcIilcbiAgICAgICAgQHNldERpbWVuc2lvbnMoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgc2V0Vmlld0JveDogLT5cbiAgICAgICAgQHN2Z0VsZS5hdHRyKCd2aWV3Qm94JywgXCIwIDAgI3tAbmV0V2lkdGh9ICN7QG5ldEhlaWdodH1cIilcblxuICAgIHNldERpbWVuc2lvbnM6IC0+XG5cbiAgICAgICAgQG1hcmdpbiA9IEBtYXJnaW4gfHwge1xuICAgICAgICAgICAgbGVmdDogNDBcbiAgICAgICAgICAgIHJpZ2h0OjEyMFxuICAgICAgICAgICAgdG9wIDozMFxuICAgICAgICAgICAgYm90dG9tOjgwXG4gICAgICAgIH1cblxuICAgICAgICBAbWFyZ2luT3JpZ2luYWwgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBAbWFyZ2luKVxuXG4gICAgICAgIEB3aWRnZXRQYWRkaW5nID0gIHtcbiAgICAgICAgICAgIGxlZnQgICA6IDE1XG4gICAgICAgICAgICByaWdodCAgOiAxNVxuICAgICAgICAgICAgdG9wICAgIDogMTVcbiAgICAgICAgICAgIGJvdHRvbSA6IDE1XG4gICAgICAgIH1cblxuICAgICAgICBmaXJzdFRpbWUgPSB0cnVlXG5cbiAgICAgICAgQHJlc2V0RGltZW5zaW9uID0gY2FsbGJhY2sgPSA9PlxuXG4gICAgICAgICAgICAjIHN2ZyB3aWR0aCBpcyBzZXQgbW9yZSB0aGFuIHdpZHRoIG9mIHBhcmVudCBlbGVtZW50LCBhcHBsaW5nIG5lZ2F0aXZlIG1hcmdpbiAuIFRIaXMgaXMgZG9uZSBjYXVzZSBzb21lIGxhYmVscyBpcyBkcmF3biBvdXRzaWRlIHRoZSBjYW52YXNcbiAgICAgICAgICAgIFtAbmV0V2lkdGgsIEBuZXRIZWlnaHRdID0gW0AkZWxlLndpZHRoKCkrKEB3aWRnZXRQYWRkaW5nLmxlZnQgKyBAd2lkZ2V0UGFkZGluZy5yaWdodCksQCRlbGUuaGVpZ2h0KCkrKEB3aWRnZXRQYWRkaW5nLnRvcCArIEB3aWRnZXRQYWRkaW5nLmJvdHRvbS00KV1cblxuICAgICAgICAgICAgQHdpZHRoID0gQG5ldFdpZHRoIC0gQG1hcmdpbi5sZWZ0IC0gQG1hcmdpbi5yaWdodFxuICAgICAgICAgICAgQGhlaWdodCA9IEBuZXRIZWlnaHQgLSBAbWFyZ2luLnRvcCAtIEBtYXJnaW4uYm90dG9tXG5cbiAgICAgICAgICAgIEB3aWR0aE9yaWdpbmFsID0gQHdpZHRoXG5cbiAgICAgICAgICAgIEBzdmdFbGUuYXR0cignd2lkdGgnLCBAbmV0V2lkdGgpXG4gICAgICAgICAgICBAc3ZnRWxlLmF0dHIoJ2hlaWdodCcsIEBuZXRIZWlnaHQpXG5cblxuXG4gICAgICAgICAgICBpZiBmaXJzdFRpbWUgb3IgQHJlZHJhd09uUmVzaXplXG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2VcbiAgICAgICAgICAgICAgICBAc2V0Vmlld0JveCgpXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdylcbiAgICAgICAgJHdpbmRvdy5vbigncmVzaXplJyxjYWxsYmFjaylcbiAgICAgICAgJHdpbmRvdy50cmlnZ2VyICdyZXNpemUnXG4gICAgICAgICR3aW5kb3cub24gJ3Jlc2l6ZScsPT5cbiAgICAgICAgICAgIEByZXNpemUoKVxuXG4gICAgICAgICMgZGVib3VuY2UocmVzaXplZCwyNTApKClcbiAgICAgICAgQHN2Z0VsZS5zdHlsZSgnbWFyZ2luJywtQHdpZGdldFBhZGRpbmcubGVmdClcblxuXG4gICAgd3JhcFRleHQgOiAoX3RoaXMsd2lkdGgpLT5cbiAgICAgICAgc2VsZiA9IGQzLnNlbGVjdChfdGhpcylcbiAgICAgICAgdGV4dExlbmd0aCA9IHNlbGYubm9kZSgpLmdldENvbXB1dGVkVGV4dExlbmd0aCgpXG4gICAgICAgIHRleHQgPSBzZWxmLnRleHQoKVxuICAgICAgICB3aGlsZSB0ZXh0TGVuZ3RoID4gd2lkdGggYW5kIHRleHQubGVuZ3RoID4gMFxuICAgICAgICAgICAgdGV4dCA9IHRleHQuc2xpY2UoMCwgLTEpXG4gICAgICAgICAgICBzZWxmLnRleHQgdGV4dCArICcuLi4nXG4gICAgICAgICAgICB0ZXh0TGVuZ3RoID0gc2VsZi5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKClcbiAgICAgICAgcmV0dXJuXG5cblxuICAgIGRyYXdMZWdlbmRzOihkYXRhLGNvbG9ycyktPlxuXG4gICAgICAgIGxlZ2VuZE9mZnNldFkgPSBAbmV0SGVpZ2h0LUB3aWRnZXRQYWRkaW5nLnRvcC04XG4gICAgICAgIGxlZ2VuZE9mZnNldFggPSBAd2lkZ2V0UGFkZGluZy5sZWZ0XG5cbiAgICAgICAgZ3JpZHdpZHRoICAgICA9IEBuZXRXaWR0aCAtIEB3aWRnZXRQYWRkaW5nLmxlZnQgLSBAd2lkZ2V0UGFkZGluZy5yaWdodFxuXG4gICAgICAgIHNwYWNpbmcgICAgICAgPSAyMFxuICAgICAgICByb3dIZWlnaHQgICAgID0gMTVcbiAgICAgICAgdGV4dFdpZHRoICAgICA9IDcwXG4gICAgICAgIGxlZ2VuZFBlclJvdyAgPSBNYXRoLm1heChNYXRoLmZsb29yKGdyaWR3aWR0aC8oc3BhY2luZyt0ZXh0V2lkdGgpKSwxKVxuICAgICAgICBpc09kZExlbmd0aCAgID0gKGRhdGEubGVuZ3RoICUgMiBpcyAxKVxuICAgICAgICBsZW5ndGggICAgICAgID0gZGF0YS5sZW5ndGhcbiAgICAgICAgd3JhcFRleHQgICAgICA9IEB3cmFwVGV4dFxuICAgICAgICBtYXhSb3dzICAgICAgID0gTWF0aC5jZWlsKGxlbmd0aC9sZWdlbmRQZXJSb3cpXG4gICAgICAgIHRvdGFsT2Zmc2V0ICAgPSAobWF4Um93cy0xKSpyb3dIZWlnaHRcblxuXG5cblxuICAgICAgICBpZiBsZWdlbmRQZXJSb3cgaXMgMVxuICAgICAgICAgICAgdGV4dFdpZHRoID0gQHdpZHRoIC0gc3BhY2luZ1xuICAgICAgICBlbHNlIGlmIGxlZ2VuZFBlclJvdyA+PSBsZW5ndGhcbiAgICAgICAgICAgICMgY2VudGVyIGl0XG4gICAgICAgICAgICBpZiBncmlkd2lkdGggKiAwLjggPiAodGV4dFdpZHRoK3NwYWNpbmcpKmxlbmd0aFxuICAgICAgICAgICAgICAgIGxlZ2VuZE9mZnNldFggKz0gKGdyaWR3aWR0aCAtICh0ZXh0V2lkdGgrc3BhY2luZykqbGVuZ3RoKS8yXG5cbiAgICAgICAgbGVnZW5kR3JwID0gQGJhc2VHcm91cC5hcHBlbmQoJ2cnKS5hdHRyKFwiY2xhc3NcIixcImxlZ2VuZFwiKS5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKCN7bGVnZW5kT2Zmc2V0WH0sI3tsZWdlbmRPZmZzZXRZfSlcIilcblxuICAgICAgICBkYXRhLmZvckVhY2ggKGVudHJ5LCBpbmRleCk9PlxuXG4gICAgICAgICAgICBvZmZzZXRYID0gKGluZGV4JWxlZ2VuZFBlclJvdykqKE1hdGguZmxvb3IoZ3JpZHdpZHRoL2xlZ2VuZFBlclJvdykpXG5cbiAgICAgICAgICAgIG9mZnNldFkgPSAtdG90YWxPZmZzZXQgKyBNYXRoLmZsb29yKGluZGV4L2xlZ2VuZFBlclJvdykqcm93SGVpZ2h0XG5cbiAgICAgICAgICAgIGxlZ2VuZCA9IGxlZ2VuZEdycC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLFwidHJhbnNsYXRlKCN7b2Zmc2V0WH0sI3tvZmZzZXRZfSlcIilcblxuICAgICAgICAgICAgcmVjdCA9IGxlZ2VuZC5hcHBlbmQoJ3JlY3QnKS5hdHRyKCd4JywgMCkuYXR0cigneScsIDApXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBjb2xvcnNbaW5kZXhdIClcbiAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLDgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsOClcblxuICAgICAgICAgICAgdGV4dCA9IGxlZ2VuZC5hcHBlbmQoJ3RleHQnKS5hdHRyKCd4JywgMTEpLmF0dHIoJ3knLCA4KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ2xlZ2VuZC10ZXh0JylcbiAgICAgICAgICAgICAgICAudGV4dCgtPlxuICAgICAgICAgICAgICAgICAgICAjIHRoaXMgZm9yIGVsbGlwc2lzXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICApLmVhY2goLT5cbiAgICAgICAgICAgICAgICAgICAgd3JhcFRleHQodGhpcyx0ZXh0V2lkdGgpXG4gICAgICAgICAgICAgICAgKVxuXG5cbiAgICAgICAgcmV0dXJuIG1heFJvd3Mqcm93SGVpZ2h0XG5cbiAgICBjbGVhcjogLT5cbiAgICAgICAgJChAYmFzZUdyb3VwP1swXVswXSkuaHRtbCgnJylcbiAgICAgICAgIyBjb25zb2xlLmxvZyAkKEBiYXNlR3JvdXA/WzBdWzBdKS5odG1sKCksXCJkZFwiXG5cbiAgICByZW1vdmU6LT5cbiAgICAgICAgQHN2Z0VsZS5yZW1vdmUoKVxuXG4gICAgcmVkcmF3IDogLT5cblxuICAgICAgICBAY2xlYXIoKVxuICAgICAgICBAZ3JhcGhHcnAgPSBAYmFzZUdyb3VwLmFwcGVuZChcImdcIikuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitAbWFyZ2luLmxlZnQrXCIsXCIrQG1hcmdpbi50b3ArXCIpXCIpXG4gICAgICAgIEByZW5kZXIoKVxuXG4gICAgICAgIGlmIEBzaG93R3VpZGVcbiAgICAgICAgICAgIHdpZHRoID0gQG5ldFdpZHRoIC0gMTUgLSAxNVxuICAgICAgICAgICAgaGVpZ2h0ID0gQG5ldEhlaWdodCAtIDE1IC0gMTVcbiAgICAgICAgICAgIEBiYXNlR3JvdXAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLHdpZHRoKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLGhlaWdodClcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwxNSlcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwxNSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCdyZ2JhKDAsMCwwLC4yKScpXG5cbiAgICB1cGRhdGUgOiAoQGdyYXBoRGF0YSktPlxuICAgICAgICBAcGhhc2VDb3VudCA9IDBcbiAgICAgICAgQHJlZHJhdygpXG4gICAgICAgIEBvblVwZGF0ZT8oKVxuXG4gICAgcmVzaXplIDogLT5cbiAgICAgICAgQHBoYXNlQ291bnQgPSAwXG4gICAgICAgIEByZWRyYXcoKVxuICAgICAgICBAb25SZXNpemU/KClcblxuICAgIHJlbmRlciA6IC0+XG4gICAgICAgICMgY29uc29sZS5sb2cgXCJSRW5kZXJcIlxuICAgICAgICBAb25SZW5kZXI/KClcbiJdfQ==