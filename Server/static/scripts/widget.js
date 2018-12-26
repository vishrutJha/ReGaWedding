
/*
#
 * Widget Loaded Plugin.
 * @desc : load widgets
 * @author: Nilaf Talapady
 * @company: Moonraft Innovation Pvt Ltd
 * @dependency:
 */

(function() {
  var mrWidget,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  mrWidget = angular.module('mrWidget', []);

  mrWidget.directive("mrWidget", [
    "$compile", "$timeout", "$interval", "$http", function($compile, $timeout, $interval, $http) {
      return {
        scope: {
          widgetId: '=',
          widgetType: '=',
          isEditMode: '=mrEditMode',
          widgetOnEdit: '&',
          widgetEvents: '&'
        },
        templateUrl: 'partials/widget.html',
        restrict: 'AE',
        controller: function($scope, $rootScope, mySocket, server) {
          var fetchWidget, interval, postData, widgetChangedEvent;
          $scope.flags = {};
          $scope.flags.isShowDetail = false;
          $scope.closeEditor = function(isSave, data) {
            $scope.flags.showEditor = false;
            if (isSave) {
              delete $scope.widgetData.isNew;
              return postData($scope.widgetData);
            } else {
              if (($scope.widgetData != null) && $scope.widgetData.isNew === true) {
                return $scope.removeWidget(true);
              }
            }
          };
          $scope.isShowEditor = function(isShow) {
            if (isShow != null) {
              $scope.flags.showEditor = isShow;
            }
            return $scope.flags.showEditor;
          };
          $scope.openModal = function() {
            if ($scope.isEditMode === true) {
              return $scope.isShowEditor(true);
            } else {
              return $scope.goToDetail();
            }
          };
          $scope.goToDetail = function() {
            return $scope.flags.isShowDetail = true;
          };
          $scope.removeWidget = function(revert) {
            if (revert == null) {
              revert = false;
            }
            $scope.widgetOnEdit({
              newId: void 0
            });
            $scope.widgetData = {
              "type": $scope.widgetData.type
            };
            if (revert && ($scope.lastWidgetData != null)) {
              return $timeout(function() {
                var revertToWidget;
                revertToWidget = $scope.lastWidgetData;
                $scope.widgetOnEdit({
                  newId: revertToWidget.widgetId
                });
                $scope.widgetData = $scope.lastWidgetData;
                return delete $scope.lastWidgetData;
              });
            }
          };
          postData = function(data) {
            if (data == null) {
              return;
            }
            widgetChangedEvent();
            server.postToQueue($scope.widgetData.id, 'widgetData', data);
          };
          widgetChangedEvent = function(output) {
            if ($scope.widgetData != null) {
              return $scope.widgetOnEdit({
                newId: $scope.widgetData.id,
                oldId: $scope.widgetId
              });
            }
          };
          fetchWidget = function() {
            var dateBeforeParam;
            if ($scope.widgetId != null) {
              dateBeforeParam = server.referenceDate != null ? "datebefore=" + server.referenceDate : '';
              return $http.get("/api/widgets/" + $scope.widgetId + "/widgetData?history=true&" + dateBeforeParam).success(function(data, status, headers, config) {
                var newData;
                newData = JSON.parse(data[0].value);
                if (!angular.equals($scope.widgetData, newData)) {
                  $scope.widgetData = newData;
                }
              }).error(function(data, status, headers, config) {
                console.log("Could not fetch widget " + $scope.widgetId + ". Something went wrong.");
              });
            }
          };
          fetchWidget();
          if (!$scope.isEditMode) {
            interval = $interval(fetchWidget, 15000);
          }
          $scope.$on('$destroy', function() {
            return $interval.cancel(interval);
          });
        },
        link: function(scope, $ele, attrs, ctlr) {
          $ele.addClass('widget');
          $ele.droppable({
            activeClass: 'is-droppable',
            hoverClass: 'is-droppable-hover',
            accept: function(droppedEle) {
              var droppedWidgetData, k, ref, ref1, v;
              droppedWidgetData = $(droppedEle).scope().widget;
              if (Object.prototype.toString.call(droppedWidgetData.supports) === '[object Array]') {
                if (ref = scope.widgetType, indexOf.call(droppedWidgetData.supports, ref) >= 0) {
                  return true;
                }
              } else {
                ref1 = droppedWidgetData.supports;
                for (k in ref1) {
                  v = ref1[k];
                  if (k === scope.widgetType) {
                    return true;
                  }
                }
              }
              return false;
            },
            over: function(event, ui) {
              return true;
            },
            out: function(event, ui) {
              return true;
            },
            drop: function(event, ui) {
              return scope.$apply(function() {
                var droppedWidget, graphName, sampleData, widgetData;
                droppedWidget = $(ui.draggable).scope().widget;
                graphName = droppedWidget.name;
                sampleData = {
                  footnote: {
                    title: "TOP RISKS/ISSUES",
                    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has."
                  }
                };
                scope.lastWidgetData = scope.widgetData;
                widgetData = scope.widgetData = {};
                return $timeout(function() {
                  widgetData.id = graphName + generateRandom();
                  widgetData.data = angular.copy(sampleData);
                  widgetData.data.graphData = droppedWidget.getGrid(scope.widgetType).data;
                  widgetData.data.title = "Widget Title";
                  widgetData.data.graphName = graphName;
                  widgetData.data.graphIcon = droppedWidget.graphIcon;
                  scope.widgetData = widgetData;
                  scope.widgetData.isNew = true;
                  scope.widgetData.widgetType = scope.widgetType;
                  return scope.isShowEditor(true);
                }, 40);
              });
            }
          });
        }
      };
    }
  ]);

  mrWidget.directive("mrWidgetDraggable", [
    "$compile", "$timeout", function($compile, $timeout) {
      return {
        restrict: 'AE',
        link: function(scope, $ele, attrs, ctlr) {
          $ele.draggable({
            revert: "invalid",
            helper: function(e) {
              var $clone, $target, multiplier;
              $target = $(e.currentTarget);
              $clone = $target.clone();
              multiplier = 1;
              $clone.width($target.outerWidth() * multiplier);
              $clone.css('line-height', ($target.height() * multiplier) + 'px');
              $clone.css('transform', "scale(" + (1 / multiplier) + ")");
              $timeout(function() {
                return $clone.addClass('is-dragged');
              }, 50);
              return $clone;
            },
            cursor: "move"
          });
        }
      };
    }
  ]);

  mrWidget.directive("mrBuilderDraggable", [
    "$compile", "$timeout", function($compile, $timeout) {
      return {
        restrict: 'AE',
        link: function(scope, $ele, attrs, ctlr) {
          var $body, $boxSrc, boxWidth, isDraggable, lastOffset, translate;
          $body = $('body');
          $boxSrc = $ele.find('[mr-builder-draggable-source]');
          isDraggable = false;
          lastOffset = {};
          translate = {};
          $boxSrc.on('mousedown', function(event) {
            lastOffset = {
              pageX: event.pageX,
              pageY: event.pageY
            };
            isDraggable = true;
          });
          $body.on('mouseup', function() {
            if (!isDraggable) {
              return;
            }
            isDraggable = false;
            return $ele.css({
              'left': parseInt($ele.css("left"), 0) + translate.x,
              'top': parseInt($ele.css("top"), 0) + translate.y,
              'transform': "none"
            });
          });
          boxWidth = $ele.width();
          $body.on('mousemove', function(event) {
            if (!isDraggable) {
              return;
            }
            translate = {
              x: event.pageX - lastOffset.pageX,
              y: event.pageY - lastOffset.pageY
            };
            $ele.css({
              'transform': "translate(" + translate.x + "px," + translate.y + "px)"
            });
          });
        }
      };
    }
  ]);

  mrWidget.directive("mrGraph", [
    "$compile", "$timeout", "$window", function($compile, $timeout, $window) {
      return {
        scope: {
          mrGraphData: '=mrGraphData',
          mrGraphName: '=mrGraphName'
        },
        restrict: 'AE',
        replace: true,
        template: '<div class="{{className()}} graph"></div>',
        link: function(scope, element, attrs, ctlr) {
          var chart, chartEl, get_chart_instance, graph, isResize, newGraph, oldGraphName, renderGraph, renderNewGraphs, resize, type, window;
          type = scope.mrGraphName;
          graph = void 0;
          oldGraphName = void 0;
          newGraph = void 0;
          chart = void 0;
          chartEl = d3.select(element[0]);
          scope.className = function() {
            return scope.mrGraphName.replace(/ /g, '');
          };
          renderNewGraphs = function(data) {
            var error;
            if (data == null) {
              return;
            }
            if (oldGraphName !== scope.mrGraphName) {
              if (newGraph != null) {
                newGraph.remove();
              }
              element.html('');
              newGraph = void 0;
            }
            try {
              if (newGraph == null) {
                newGraph = (function() {
                  switch (scope.mrGraphName) {
                    case 'Area':
                      return new AreaGraph(element, data);
                    case 'List':
                      return new ListWidget(element, data);
                    case 'Stacked Column':
                      return new StackedBarGraph(element, data);
                    case 'Table':
                      return new TableWidget(element, data);
                    case 'DoughNut':
                      return new PieGraph(element, data, 'DoughNut', false);
                    case 'Pie':
                      return new PieGraph(element, data, 'Pie', true);
                    case 'Image':
                      return new ImageWidget(element, data);
                  }
                })();
              }
              if (newGraph != null) {
                if (typeof newGraph.update === "function") {
                  newGraph.update(data);
                }
              }
            } catch (_error) {
              error = _error;
              console.log("error:", error);
              newGraph = 1;
            }
            oldGraphName = scope.mrGraphName;
          };
          get_chart_instance = function(type) {
            chart = void 0;
            if (type === 'Bar') {
              chart = d3.custom.barChart();
            } else if (type === 'Column') {
              chart = d3.custom.columnChart();
            } else if (type === 'Line') {
              chart = d3.custom.lineChart();
            }
            return chart;
          };
          renderGraph = function(data) {
            var height, ref, width;
            if (data == null) {
              return;
            }
            if ((ref = scope.mrGraphName) === 'Pie' || ref === 'Area' || ref === 'Table' || ref === 'List' || ref === 'DoughNut' || ref === 'Image' || ref === 'Stacked Column' || ref === 'Column1') {
              return;
            }
            width = element.width();
            height = element.parent().height();
            chart = get_chart_instance(scope.mrGraphName);
            if (data == null) {
              return;
            }
            if (chart != null) {
              chartEl.datum(data).call(chart.width(width).height(height));
            }
          };
          scope.$watch('mrGraphData', function(newVal, oldVal) {
            if (newVal != null) {
              $timeout(function() {
                renderNewGraphs(scope.mrGraphData);
                return renderGraph(newVal);
              }, 0);
            }
          });
          resize = function(wwidth, delay) {
            var isResize;
            if (delay == null) {
              delay = 200;
            }
            if (isResize === true) {
              return;
            }
            isResize = true;
            return $timeout(function() {
              renderGraph(scope.mrGraphData);
              return isResize = false;
            }, delay);
          };
          isResize = void 0;
          window = angular.element($window);
          window.on("resize", function() {
            var $this;
            $this = $(this);
            debounce(resize($this.width()));
          });
        }
      };
    }
  ]);

  mrWidget.directive("widgetRemove", [
    "$compile", "$timeout", "$window", "$parse", function($compile, $timeout, $window, $parse) {
      return {
        restrict: 'AE',
        scope: {
          callback: "&widgetRemove"
        },
        link: function(scope, $ele, attrs, ctlr) {
          scope;
          return $ele.on('click', function() {
            var $inner, $overlayBtns, $widget;
            $inner = $ele.closest('.widget--inner');
            $widget = $inner.closest('mr-widget');
            $overlayBtns = $inner.find('.widget-overlay-btn');
            $widget.css('overflow', 'hidden');
            $inner.addClass('is-delete-animation');
            $overlayBtns.off('click');
            return $timeout(function() {
              $widget.css('overflow', '');
              return scope.$apply(function() {
                return scope.callback();
              });
            }, 600);
          });
        }
      };
    }
  ]);

  mrWidget.directive("mrGoDetail", [
    "$compile", "$timeout", "$window", "$parse", function($compile, $timeout, $window, $parse) {
      return {
        restrict: 'AE',
        replace: true,
        link: function(scope, $ele, attrs, ctlr) {
          var isDetailOpen;
          isDetailOpen = void 0;
          $timeout(function() {
            var $body, $clone, $dashInner, $det, $detContent, $tarEle, $widget, $widgetDet, dashOffset, eleHeight, eleWidth, offset, openDetail, scrollOffset;
            $det = $('.det');
            $detContent = $det.find('.det-content');
            $widget = $ele.closest('.widget');
            $widgetDet = $widget.find('.widget-det');
            $dashInner = $('.dash-inner');
            $window = $(window);
            offset = void 0;
            dashOffset = void 0;
            scrollOffset = void 0;
            eleWidth = void 0;
            eleHeight = void 0;
            $clone = void 0;
            $tarEle = void 0;
            $body = $('body');
            openDetail = function(isOpen) {
              var onDetailClosed, widgetDetHtml;
              if (isOpen) {
                isDetailOpen = true;
                widgetDetHtml = $widgetDet.html();
                eleWidth = $widget.outerWidth();
                eleHeight = $widget.outerHeight();
                $tarEle = $('<div class="widget-det-fake"></div>');
                offset = $widget.offset();
                dashOffset = $dashInner.offset();
                scrollOffset = {
                  left: $window.scrollLeft(),
                  top: $window.scrollTop(),
                  width: $window.width(),
                  height: $window.height()
                };
                $clone = $widget.clone();
                $clone.find('.widget--front').attr('widget-id', '');
                $tarEle.css({
                  'position': 'fixed',
                  'left': offset.left,
                  'top': offset.top - scrollOffset.top,
                  'width': eleWidth,
                  'height': eleHeight,
                  'transform-style': 'preserve-3d'
                });
                $clone.css({
                  'width': '100%',
                  'height': '100%',
                  'position': 'absolute',
                  'margin': 0
                });
                $tarEle.append($clone);
                $tarEle.append('<div class="widget-backface"></div>');
                $('.det-fake').append($tarEle);
                $widget.css({
                  'opacity': 0
                });
                $detContent.html(widgetDetHtml);
                $det.css({
                  'display': 'block',
                  'opacity': 0
                });
                return $timeout(function() {
                  $tarEle.velocity({
                    translateZ: '1000px',
                    rotateX: '179deg'
                  }, {
                    duration: 600,
                    easing: 'ease-in-out'
                  }).velocity({
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'
                  }, {
                    duration: 300,
                    delay: 300,
                    easing: 'ease-in-out',
                    queue: false,
                    complete: function() {
                      $det.velocity({
                        opacity: 1
                      }, {
                        easing: 'ease-in-out',
                        duration: 200
                      });
                      return $body.css({
                        'overflow': 'hidden',
                        position: 'fixed'
                      });
                    }
                  });
                  return $dashInner.velocity({
                    translateZ: '-1000px'
                  }, {
                    duration: 600,
                    easing: 'ease-in-out'
                  });
                }, 0);
              } else {
                if (!isDetailOpen) {
                  return;
                }
                onDetailClosed = function() {
                  scope.$apply(function() {
                    $parse(attrs.mrGoDetail).assign(scope, false);
                    return isDetailOpen = false;
                  });
                };
                $body.css({
                  'overflow': '',
                  position: ''
                });
                $det.velocity({
                  opacity: 0
                }, {
                  easing: 'ease-in-out',
                  duration: 200,
                  complete: function() {
                    $det.css({
                      'display': 'none'
                    });
                    return $detContent.html('');
                  }
                });
                $timeout(function() {
                  $tarEle.velocity({
                    'left': offset.left,
                    'top': offset.top - scrollOffset.top,
                    'width': eleWidth,
                    'height': eleHeight
                  }, {
                    duration: 400,
                    easing: 'ease-in-out',
                    queue: false
                  }).velocity({
                    translateZ: '0',
                    rotateX: '0'
                  }, {
                    duration: 600,
                    easing: 'ease-in-out',
                    queue: false,
                    delay: 300,
                    complete: function() {
                      $widget.css({
                        'opacity': 1
                      });
                      $tarEle.remove();
                      return onDetailClosed();
                    }
                  });
                  return $dashInner.velocity({
                    translateZ: '0'
                  }, {
                    duration: 600,
                    easing: 'ease-in-out',
                    delay: 300
                  });
                }, 0);
              }
            };
            scope.$watch(attrs.mrGoDetail, function(newVal) {
              if (newVal == null) {
                return;
              }
              if (isDetailOpen == null) {
                isDetailOpen = newVal;
              }
              if (newVal === isDetailOpen) {
                return;
              }
              return openDetail(newVal);
            });
            $det.find('.det-close').on('click', function() {
              if (isDetailOpen === true) {
                return openDetail(false);
              }
            });
          }, 0);
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,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S0FBWCxFQURKO2VBRCtCO1lBQUEsQ0FBbkMsQ0FwTkEsQ0FGSztVQUFBLENBQVQsRUEwTkMsQ0ExTkQsQ0FGQSxDQUZHO1FBQUEsQ0FKUDtPQUZKLENBSDhFO0lBQUEsQ0FBaEQ7R0FBbEMsQ0FuZEEsQ0FBQTtBQUFBIiwiZmlsZSI6IndpZGdldC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuI1xuIyBXaWRnZXQgTG9hZGVkIFBsdWdpbi5cbiMgQGRlc2MgOiBsb2FkIHdpZGdldHNcbiMgQGF1dGhvcjogTmlsYWYgVGFsYXBhZHlcbiMgQGNvbXBhbnk6IE1vb25yYWZ0IElubm92YXRpb24gUHZ0IEx0ZFxuIyBAZGVwZW5kZW5jeTpcbiMjI1xuXG5cblxubXJXaWRnZXQgPSBhbmd1bGFyLm1vZHVsZSgnbXJXaWRnZXQnLCBbXSlcblxubXJXaWRnZXQuZGlyZWN0aXZlIFwibXJXaWRnZXRcIiwgWyBcIiRjb21waWxlXCIgLCBcIiR0aW1lb3V0XCIgLCAgXCIkaW50ZXJ2YWxcIiAsIFwiJGh0dHBcIiAsICggJGNvbXBpbGUgLCAkdGltZW91dCwgJGludGVydmFsLCAkaHR0cCApIC0+XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIHNjb3BlIDpcbiAgICAgICAgICAgICMgZGF0YSBuZWVkZWQgZm9yIHRoZSB3aWRnZXRcbiAgICAgICAgICAgIHdpZGdldElkICAgICA6ICc9J1xuICAgICAgICAgICAgd2lkZ2V0VHlwZSAgIDogJz0nXG5cbiAgICAgICAgICAgICMgd2hldGhlciB3aWRnZXRzIGFyZSBlZGl0YWJsZVxuICAgICAgICAgICAgaXNFZGl0TW9kZSAgIDogJz1tckVkaXRNb2RlJ1xuICAgICAgICAgICAgd2lkZ2V0T25FZGl0IDogJyYnXG4gICAgICAgICAgICB3aWRnZXRFdmVudHMgOiAnJidcblxuXG4gICAgICAgIHRlbXBsYXRlVXJsIDogJ3BhcnRpYWxzL3dpZGdldC5odG1sJ1xuXG4gICAgICAgIHJlc3RyaWN0OiAnQUUnXG5cbiAgICAgICAgY29udHJvbGxlciA6ICgkc2NvcGUsICRyb290U2NvcGUsIG15U29ja2V0LCBzZXJ2ZXIpLT5cblxuICAgICAgICAgICAgJHNjb3BlLmZsYWdzID0ge31cblxuICAgICAgICAgICAgIyB0aGVyZSBhcmUgdHdvIG1vZGFscywgb25lIGlzIHdpZGdldCBkZXRhaWwgd2hpY2ggaXMgc2hvd24gZm9yIHVzZXIgYW5kIGFub3RoZXIgaXMgYnVpbGRlciBlZGl0b3IgdG8gZWRpdCB3aWRnZXQgZGF0YVxuICAgICAgICAgICAgJHNjb3BlLmZsYWdzLmlzU2hvd0RldGFpbCA9IGZhbHNlXG5cbiAgICAgICAgICAgICMgQnVpbGRlciBlZGl0b3IgaGFuZGxlcnNcbiAgICAgICAgICAgICRzY29wZS5jbG9zZUVkaXRvciA9IChpc1NhdmUsZGF0YSktPlxuICAgICAgICAgICAgICAgICRzY29wZS5mbGFncy5zaG93RWRpdG9yID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZiBpc1NhdmVcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlICRzY29wZS53aWRnZXREYXRhLmlzTmV3XG4gICAgICAgICAgICAgICAgICAgIHBvc3REYXRhKCRzY29wZS53aWRnZXREYXRhKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYgJHNjb3BlLndpZGdldERhdGE/IGFuZCAkc2NvcGUud2lkZ2V0RGF0YS5pc05ldyBpcyB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVtb3ZlV2lkZ2V0KHRydWUpXG5cbiAgICAgICAgICAgICRzY29wZS5pc1Nob3dFZGl0b3IgPSAoaXNTaG93KS0+XG4gICAgICAgICAgICAgICAgaWYgaXNTaG93P1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxhZ3Muc2hvd0VkaXRvciA9IGlzU2hvd1xuICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZmxhZ3Muc2hvd0VkaXRvclxuXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gLT5cbiAgICAgICAgICAgICAgICBpZiAkc2NvcGUuaXNFZGl0TW9kZSBpcyB0cnVlXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pc1Nob3dFZGl0b3IodHJ1ZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb1RvRGV0YWlsKClcblxuICAgICAgICAgICAgJHNjb3BlLmdvVG9EZXRhaWwgPSAtPlxuICAgICAgICAgICAgICAgICRzY29wZS5mbGFncy5pc1Nob3dEZXRhaWwgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAjIG5vdyBzeW5jIHRoZSBhY3Rpb24gd2l0aCB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgICAgIyBteVNvY2tldC5yZW1vdGVBY3Rpb24gYWN0aW9uOlwiZ29Ub0RldGFpbFwiLGlkOiRzY29wZS53aWRnZXRJZFxuXG5cbiAgICAgICAgICAgICRzY29wZS5yZW1vdmVXaWRnZXQgPSAocmV2ZXJ0PWZhbHNlKS0+XG5cbiAgICAgICAgICAgICAgICAjIHJlcGxhY2Ugd2l0aCBlbXB0eSB3aWRnZXRcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lkZ2V0T25FZGl0KHtuZXdJZDp1bmRlZmluZWR9KVxuICAgICAgICAgICAgICAgICRzY29wZS53aWRnZXREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIiA6ICRzY29wZS53aWRnZXREYXRhLnR5cGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgcmV2ZXJ0IGFuZCAkc2NvcGUubGFzdFdpZGdldERhdGE/XG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlcnRUb1dpZGdldCA9ICRzY29wZS5sYXN0V2lkZ2V0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndpZGdldE9uRWRpdCh7bmV3SWQ6cmV2ZXJ0VG9XaWRnZXQud2lkZ2V0SWR9KVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndpZGdldERhdGEgPSAkc2NvcGUubGFzdFdpZGdldERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUubGFzdFdpZGdldERhdGFcblxuXG5cblxuXG4gICAgICAgICAgICBwb3N0RGF0YSA9IChkYXRhKS0+XG5cbiAgICAgICAgICAgICAgICBpZiBub3QgZGF0YT9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICB3aWRnZXRDaGFuZ2VkRXZlbnQoKVxuXG4gICAgICAgICAgICAgICAgc2VydmVyLnBvc3RUb1F1ZXVlKCRzY29wZS53aWRnZXREYXRhLmlkLCd3aWRnZXREYXRhJyxkYXRhKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICB3aWRnZXRDaGFuZ2VkRXZlbnQgPSAob3V0cHV0KS0+XG4gICAgICAgICAgICAgICAgaWYgJHNjb3BlLndpZGdldERhdGE/XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53aWRnZXRPbkVkaXQoe25ld0lkOiRzY29wZS53aWRnZXREYXRhLmlkLG9sZElkOiRzY29wZS53aWRnZXRJZH0pXG5cblxuICAgICAgICAgICAgIyBBVVRPIFNBVkUgZGF0YSAuIHdhdGNoIGZvciBkYXRhIGNoYW5nZXMgaWYgaW4gYnVpbGRlciBtb2RlIGFuZCBwb3N0IC4gZGVib3VuY2UgZnVuY3Rpb24gdG8gZGVib3VuY2UgY2FsbHMuY2hlY2sgaGVscGVyLmNvZmZlZSBmb3IgZGVib3VuY2VcbiAgICAgICAgICAgICMgaWYgJHNjb3BlLmlzRWRpdE1vZGVcbiAgICAgICAgICAgICAgICAjICRzY29wZS4kd2F0Y2ggJ3dpZGdldERhdGEnLGRlYm91bmNlKHBvc3REYXRhLDEwMDApLHRydWVcbiAgICAgICAgICAgICAgICAjICRzY29wZS4kd2F0Y2ggJ3dpZGdldERhdGEuaWQnLHdpZGdldENoYW5nZWRFdmVudCx0cnVlXG5cblxuICAgICAgICAgICAgZmV0Y2hXaWRnZXQgPSAtPlxuICAgICAgICAgICAgICAgIGlmICRzY29wZS53aWRnZXRJZD9cbiAgICAgICAgICAgICAgICAgICAgZGF0ZUJlZm9yZVBhcmFtID0gaWYgc2VydmVyLnJlZmVyZW5jZURhdGU/IHRoZW4gXCJkYXRlYmVmb3JlPSN7c2VydmVyLnJlZmVyZW5jZURhdGV9XCIgZWxzZSAnJ1xuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCIvYXBpL3dpZGdldHMvI3sgJHNjb3BlLndpZGdldElkfS93aWRnZXREYXRhP2hpc3Rvcnk9dHJ1ZSYje2RhdGVCZWZvcmVQYXJhbX1cIikuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEYXRhID0gSlNPTi5wYXJzZShkYXRhWzBdLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IGFuZ3VsYXIuZXF1YWxzKCRzY29wZS53aWRnZXREYXRhLG5ld0RhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndpZGdldERhdGEgPSBuZXdEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgKS5lcnJvciAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAgXCJDb3VsZCBub3QgZmV0Y2ggd2lkZ2V0ICN7JHNjb3BlLndpZGdldElkfS4gU29tZXRoaW5nIHdlbnQgd3JvbmcuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIGZldGNoIG9uY2UgYW5kIGFuZCBpZiBub3QgZWRpdCBtb2RlIHRoZW4gcnVuIGF0IGV2ZXJ5IGludGVydmFsXG4gICAgICAgICAgICBmZXRjaFdpZGdldCgpXG4gICAgICAgICAgICBpZiBub3QgJHNjb3BlLmlzRWRpdE1vZGVcbiAgICAgICAgICAgICAgICAjIGZldGNoIG5ldyBkYXRhIGV2ZXJ5IGZldyBzZWNvbmRzXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSAkaW50ZXJ2YWwgZmV0Y2hXaWRnZXQsMTUwMDBcblxuXG4gICAgICAgICAgICAkc2NvcGUuJG9uICckZGVzdHJveScsLT5cbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgIHJldHVyblxuXG5cblxuICAgICAgICBsaW5rIDogKHNjb3BlLCAkZWxlLCBhdHRycywgY3RscikgLT5cblxuICAgICAgICAgICAgJGVsZS5hZGRDbGFzcygnd2lkZ2V0JylcblxuICAgICAgICAgICAgJGVsZS5kcm9wcGFibGUoXG5cbiAgICAgICAgICAgICAgICBhY3RpdmVDbGFzcyA6ICdpcy1kcm9wcGFibGUnXG4gICAgICAgICAgICAgICAgaG92ZXJDbGFzcyAgOiAnaXMtZHJvcHBhYmxlLWhvdmVyJ1xuICAgICAgICAgICAgICAgICMgdG9sZXJhbmNlIDogJ2ZpdCdcblxuICAgICAgICAgICAgICAgIGFjY2VwdCA6IChkcm9wcGVkRWxlKS0+XG4gICAgICAgICAgICAgICAgICAgICMgY2hlY2sgaXMgc3VwcG9ydGVkP1xuICAgICAgICAgICAgICAgICAgICBkcm9wcGVkV2lkZ2V0RGF0YSAgPSAkKGRyb3BwZWRFbGUpLnNjb3BlKCkud2lkZ2V0XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggZHJvcHBlZFdpZGdldERhdGEuc3VwcG9ydHMgKSBpcyAnW29iamVjdCBBcnJheV0nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHNjb3BlLndpZGdldFR5cGUgaW4gZHJvcHBlZFdpZGdldERhdGEuc3VwcG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3Igayx2IG9mIGRyb3BwZWRXaWRnZXREYXRhLnN1cHBvcnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgayBpcyBzY29wZS53aWRnZXRUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgICAgICBvdmVyIDogKGV2ZW50LHVpKS0+XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICAgICAgICAgIG91dCA6IChldmVudCwgdWkgKS0+XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgICAgICAgICBkcm9wOiAoIGV2ZW50LCB1aSApLT5cblxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoLT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcHBlZFdpZGdldCA9ICQodWkuZHJhZ2dhYmxlKS5zY29wZSgpLndpZGdldFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaE5hbWUgPSBkcm9wcGVkV2lkZ2V0Lm5hbWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2FtcGxlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb290bm90ZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiBcIlRPUCBSSVNLUy9JU1NVRVNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjIDogXCJMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dCBvZiB0aGUgcHJpbnRpbmcgYW5kIHR5cGVzZXR0aW5nIGluZHVzdHJ5LiBMb3JlbSBJcHN1bSBoYXMuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICMgZ2VuZXJhdGUgaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmxhc3RXaWRnZXREYXRhID0gc2NvcGUud2lkZ2V0RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkZ2V0RGF0YSAgID0gc2NvcGUud2lkZ2V0RGF0YSAgPSB7fVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dCAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZGdldERhdGEuaWQgICAgICAgICAgICAgICA9IGdyYXBoTmFtZSArIGdlbmVyYXRlUmFuZG9tKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXREYXRhLmRhdGEgICAgICAgICAgICAgPSBhbmd1bGFyLmNvcHkoc2FtcGxlRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXREYXRhLmRhdGEuZ3JhcGhEYXRhICAgPSBkcm9wcGVkV2lkZ2V0LmdldEdyaWQoc2NvcGUud2lkZ2V0VHlwZSkuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZGdldERhdGEuZGF0YS50aXRsZSAgICAgICA9IFwiV2lkZ2V0IFRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXREYXRhLmRhdGEuZ3JhcGhOYW1lICAgPSBncmFwaE5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXREYXRhLmRhdGEuZ3JhcGhJY29uICAgPSBkcm9wcGVkV2lkZ2V0LmdyYXBoSWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLndpZGdldERhdGEgICAgICAgICAgICA9IHdpZGdldERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS53aWRnZXREYXRhLmlzTmV3ICAgICAgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUud2lkZ2V0RGF0YS53aWRnZXRUeXBlID0gc2NvcGUud2lkZ2V0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmlzU2hvd0VkaXRvcih0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLDQwXG5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgKVxuXG5dXG5cblxuXG5tcldpZGdldC5kaXJlY3RpdmUgXCJtcldpZGdldERyYWdnYWJsZVwiLCBbIFwiJGNvbXBpbGVcIiAsIFwiJHRpbWVvdXRcIiAsICggJGNvbXBpbGUgLCAkdGltZW91dCkgLT5cblxuXG4gICAgcmV0dXJuIChcblxuICAgICAgICByZXN0cmljdDonQUUnXG5cblxuICAgICAgICBsaW5rIDogKHNjb3BlLCAkZWxlLCBhdHRycywgY3RscikgLT5cblxuICAgICAgICAgICAgJGVsZS5kcmFnZ2FibGUoXG4gICAgICAgICAgICAgICAgcmV2ZXJ0OiBcImludmFsaWRcIlxuICAgICAgICAgICAgICAgIGhlbHBlcjogKGUpLT5cbiAgICAgICAgICAgICAgICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICAkY2xvbmUgPSAkdGFyZ2V0LmNsb25lKClcblxuICAgICAgICAgICAgICAgICAgICBtdWx0aXBsaWVyID0gMVxuICAgICAgICAgICAgICAgICAgICAkY2xvbmUud2lkdGgoJHRhcmdldC5vdXRlcldpZHRoKCkqbXVsdGlwbGllcilcbiAgICAgICAgICAgICAgICAgICAgJGNsb25lLmNzcyAnbGluZS1oZWlnaHQnLCgkdGFyZ2V0LmhlaWdodCgpKm11bHRpcGxpZXIpKydweCdcbiAgICAgICAgICAgICAgICAgICAgJGNsb25lLmNzcyAndHJhbnNmb3JtJyxcInNjYWxlKCN7MS9tdWx0aXBsaWVyfSlcIlxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dCAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgJGNsb25lLmFkZENsYXNzKCdpcy1kcmFnZ2VkJylcbiAgICAgICAgICAgICAgICAgICAgLDUwXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkY2xvbmVcbiAgICAgICAgICAgICAgICBjdXJzb3I6IFwibW92ZVwiXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbl1cblxuXG5cbm1yV2lkZ2V0LmRpcmVjdGl2ZSBcIm1yQnVpbGRlckRyYWdnYWJsZVwiLCBbIFwiJGNvbXBpbGVcIiAsIFwiJHRpbWVvdXRcIiAsICggJGNvbXBpbGUgLCAkdGltZW91dCkgLT5cblxuXG4gICAgcmV0dXJuIChcblxuICAgICAgICByZXN0cmljdDonQUUnXG5cblxuICAgICAgICBsaW5rIDogKHNjb3BlLCAkZWxlLCBhdHRycywgY3RscikgLT5cblxuICAgICAgICAgICAgJGJvZHkgICAgICAgPSAkKCdib2R5JylcbiAgICAgICAgICAgICRib3hTcmMgICAgID0gJGVsZS5maW5kKCdbbXItYnVpbGRlci1kcmFnZ2FibGUtc291cmNlXScpXG5cbiAgICAgICAgICAgIGlzRHJhZ2dhYmxlID0gZmFsc2VcbiAgICAgICAgICAgIGxhc3RPZmZzZXQgID0ge31cbiAgICAgICAgICAgIHRyYW5zbGF0ZSAgID0ge31cblxuICAgICAgICAgICAgJGJveFNyYy5vbiAnbW91c2Vkb3duJywgKGV2ZW50KS0+XG5cbiAgICAgICAgICAgICAgICBsYXN0T2Zmc2V0ID0ge1xuICAgICAgICAgICAgICAgICAgICBwYWdlWCA6IGV2ZW50LnBhZ2VYXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VZIDogZXZlbnQucGFnZVlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNEcmFnZ2FibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICRib2R5Lm9uICdtb3VzZXVwJywgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgbm90IGlzRHJhZ2dhYmxlXG4gICAgICAgICAgICAgICAgaXNEcmFnZ2FibGUgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgJGVsZS5jc3NcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnICAgICAgOiBwYXJzZUludCgkZWxlLmNzcyhcImxlZnRcIiksMCkrdHJhbnNsYXRlLngsXG4gICAgICAgICAgICAgICAgICAgICd0b3AnICAgICAgIDogcGFyc2VJbnQoJGVsZS5jc3MoXCJ0b3BcIiksMCkrdHJhbnNsYXRlLnksXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nIDogXCJub25lXCJcblxuICAgICAgICAgICAgYm94V2lkdGggPSAkZWxlLndpZHRoKClcblxuICAgICAgICAgICAgJGJvZHkub24gJ21vdXNlbW92ZScsIChldmVudCktPlxuICAgICAgICAgICAgICAgIHJldHVybiBpZiBub3QgaXNEcmFnZ2FibGVcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHggOiBldmVudC5wYWdlWCAtIGxhc3RPZmZzZXQucGFnZVhcbiAgICAgICAgICAgICAgICAgICAgeSA6IGV2ZW50LnBhZ2VZIC0gbGFzdE9mZnNldC5wYWdlWVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZWxlLmNzcyAndHJhbnNmb3JtJzpcInRyYW5zbGF0ZSgje3RyYW5zbGF0ZS54fXB4LCN7dHJhbnNsYXRlLnl9cHgpXCJcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuXVxuXG5cblxubXJXaWRnZXQuZGlyZWN0aXZlIFwibXJHcmFwaFwiLCBbIFwiJGNvbXBpbGVcIiAsIFwiJHRpbWVvdXRcIiAsXCIkd2luZG93XCIsICggJGNvbXBpbGUgLCAkdGltZW91dCwgJHdpbmRvdykgLT5cblxuXG4gICAgcmV0dXJuIChcblxuICAgICAgICBzY29wZTpcbiAgICAgICAgICAgIG1yR3JhcGhEYXRhOic9bXJHcmFwaERhdGEnXG4gICAgICAgICAgICBtckdyYXBoTmFtZTonPW1yR3JhcGhOYW1lJ1xuICAgICAgICByZXN0cmljdDonQUUnXG4gICAgICAgIHJlcGxhY2U6IHRydWVcblxuICAgICAgICB0ZW1wbGF0ZSA6ICcnJ1xuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInt7Y2xhc3NOYW1lKCl9fSBncmFwaFwiPjwvZGl2PlxuICAgICAgICAnJydcblxuICAgICAgICAjIGNvbXBpbGU6KCRlbGUsIGF0dHJzLCBjdGxyKS0+XG5cblxuICAgICAgICBsaW5rIDogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RscikgLT5cblxuICAgICAgICAgICAgdHlwZSAgICAgICAgID0gc2NvcGUubXJHcmFwaE5hbWVcbiAgICAgICAgICAgIGdyYXBoICAgICAgICA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgb2xkR3JhcGhOYW1lID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBuZXdHcmFwaCAgICAgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGNoYXJ0ICAgICAgICA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgY2hhcnRFbCAgICAgID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pXG5cbiAgICAgICAgICAgIHNjb3BlLmNsYXNzTmFtZSA9IC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLm1yR3JhcGhOYW1lLnJlcGxhY2UoLyAvZywnJylcblxuICAgICAgICAgICAgcmVuZGVyTmV3R3JhcGhzID0gKGRhdGEpLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gaWYgbm90IGRhdGE/XG5cblxuICAgICAgICAgICAgICAgIGlmIG9sZEdyYXBoTmFtZSBpc250IHNjb3BlLm1yR3JhcGhOYW1lXG4gICAgICAgICAgICAgICAgICAgIG5ld0dyYXBoPy5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgIG5ld0dyYXBoID0gdW5kZWZpbmVkXG5cbiAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG5ld0dyYXBoP1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3R3JhcGggPSBzd2l0Y2ggc2NvcGUubXJHcmFwaE5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gJ0FyZWEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEFyZWFHcmFwaChlbGVtZW50LGRhdGEpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gJ0xpc3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExpc3RXaWRnZXQoZWxlbWVudCxkYXRhKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuICdTdGFja2VkIENvbHVtbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tlZEJhckdyYXBoKGVsZW1lbnQsZGF0YSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAnVGFibGUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRhYmxlV2lkZ2V0KGVsZW1lbnQsZGF0YSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAnRG91Z2hOdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBpZUdyYXBoKGVsZW1lbnQsZGF0YSwnRG91Z2hOdXQnLGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuICdQaWUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBpZUdyYXBoKGVsZW1lbnQsZGF0YSwnUGllJyx0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuICdJbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgSW1hZ2VXaWRnZXQoZWxlbWVudCxkYXRhKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdoZW4gJ0NvbHVtbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgICAgIG5ldyBDb2x1bW5HcmFwaChlbGVtZW50LGRhdGEpXG5cbiAgICAgICAgICAgICAgICAgICAgbmV3R3JhcGg/LnVwZGF0ZT8oZGF0YSlcblxuICAgICAgICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiZXJyb3I6XCIsZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgbmV3R3JhcGggPSAxXG5cbiAgICAgICAgICAgICAgICBvbGRHcmFwaE5hbWUgPSBzY29wZS5tckdyYXBoTmFtZVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgIyAnJycnJycnJ1xuXG5cblxuICAgICAgICAgICAgZ2V0X2NoYXJ0X2luc3RhbmNlID0gKHR5cGUpLT5cblxuICAgICAgICAgICAgICAgIGNoYXJ0ID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgaWYgdHlwZSA9PSAnQmFyJ1xuICAgICAgICAgICAgICAgICAgICBjaGFydCA9IGQzLmN1c3RvbS5iYXJDaGFydCgpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiB0eXBlID09ICdDb2x1bW4nXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0ID0gZDMuY3VzdG9tLmNvbHVtbkNoYXJ0KClcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHR5cGUgPT0gJ0xpbmUnXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0ID0gZDMuY3VzdG9tLmxpbmVDaGFydCgpXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhcnRcblxuXG4gICAgICAgICAgICByZW5kZXJHcmFwaCA9IChkYXRhKS0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIG5vdCBkYXRhP1xuXG4gICAgICAgICAgICAgICAgaWYgc2NvcGUubXJHcmFwaE5hbWUgaW4gWydQaWUnLCdBcmVhJywnVGFibGUnLCdMaXN0JywnRG91Z2hOdXQnLCdJbWFnZScsJ1N0YWNrZWQgQ29sdW1uJywgJ0NvbHVtbjEnXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIHdpZHRoICAgPSBlbGVtZW50LndpZHRoKClcbiAgICAgICAgICAgICAgICBoZWlnaHQgID0gZWxlbWVudC5wYXJlbnQoKS5oZWlnaHQoKVxuICAgICAgICAgICAgICAgIGNoYXJ0ICAgPSBnZXRfY2hhcnRfaW5zdGFuY2Uoc2NvcGUubXJHcmFwaE5hbWUpXG5cbiAgICAgICAgICAgICAgICBpZiBub3QgZGF0YT9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBpZiBjaGFydD9cbiAgICAgICAgICAgICAgICAgICAgY2hhcnRFbC5kYXR1bShkYXRhKS5jYWxsIGNoYXJ0LndpZHRoKHdpZHRoKS5oZWlnaHQoaGVpZ2h0KVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICMgY2hhcnQgICA9IGdldF9jaGFydF9pbnN0YW5jZShzY29wZS5tckdyYXBoTmFtZSlcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoICdtckdyYXBoRGF0YScsIChuZXdWYWwsIG9sZFZhbCkgLT5cbiAgICAgICAgICAgICAgICBpZiBuZXdWYWw/XG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJOZXdHcmFwaHMoc2NvcGUubXJHcmFwaERhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJHcmFwaChuZXdWYWwpXG4gICAgICAgICAgICAgICAgICAgICwwXG5cbiAgICAgICAgICAgICAgICByZXR1cm5cblxuXG5cbiAgICAgICAgICAgIHJlc2l6ZSA9ICh3d2lkdGgsIGRlbGF5ID0gMjAwKS0+XG4gICAgICAgICAgICAgICAgaWYgaXNSZXNpemUgPT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBpc1Jlc2l6ZSA9IHRydWVcblxuICAgICAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJHcmFwaChzY29wZS5tckdyYXBoRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzaXplID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgLGRlbGF5XG5cbiAgICAgICAgICAgIGlzUmVzaXplID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB3aW5kb3cgPSBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdylcbiAgICAgICAgICAgICMgcmVzaXplKHdpbmRvdy53aWR0aCgpKVxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyAxLFwiaW5pdFwiLFwicmVuZGVyR3JhcGhcIlxuXG4gICAgICAgICAgICB3aW5kb3cub24gXCJyZXNpemVcIiwgKCktPlxuICAgICAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAgICAgICAgIGRlYm91bmNlKHJlc2l6ZSgkdGhpcy53aWR0aCgpKSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbl1cblxubXJXaWRnZXQuZGlyZWN0aXZlIFwid2lkZ2V0UmVtb3ZlXCIsICBbIFwiJGNvbXBpbGVcIiAsIFwiJHRpbWVvdXRcIiAsXCIkd2luZG93XCIsIFwiJHBhcnNlXCIsICggJGNvbXBpbGUgLCAkdGltZW91dCwgJHdpbmRvdywgJHBhcnNlKSAtPlxuXG5cbiAgICByZXR1cm4gKFxuXG4gICAgICAgIHJlc3RyaWN0OidBRSdcblxuICAgICAgICBzY29wZSA6XG4gICAgICAgICAgICBjYWxsYmFjayA6IFwiJndpZGdldFJlbW92ZVwiXG5cbiAgICAgICAgbGluayA6IChzY29wZSwgJGVsZSwgYXR0cnMsIGN0bHIpIC0+XG4gICAgICAgICAgICBzY29wZVxuXG4gICAgICAgICAgICAkZWxlLm9uICdjbGljaycsLT5cbiAgICAgICAgICAgICAgICAkaW5uZXIgICAgICAgPSAkZWxlLmNsb3Nlc3QoJy53aWRnZXQtLWlubmVyJylcbiAgICAgICAgICAgICAgICAkd2lkZ2V0ICAgICAgPSAkaW5uZXIuY2xvc2VzdCgnbXItd2lkZ2V0JylcbiAgICAgICAgICAgICAgICAkb3ZlcmxheUJ0bnMgPSAkaW5uZXIuZmluZCgnLndpZGdldC1vdmVybGF5LWJ0bicpXG5cbiAgICAgICAgICAgICAgICAkd2lkZ2V0LmNzcyAnb3ZlcmZsb3cnLCdoaWRkZW4nXG4gICAgICAgICAgICAgICAgJGlubmVyLmFkZENsYXNzKCdpcy1kZWxldGUtYW5pbWF0aW9uJylcbiAgICAgICAgICAgICAgICAkb3ZlcmxheUJ0bnMub2ZmICdjbGljaydcblxuXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQgLT5cbiAgICAgICAgICAgICAgICAgICAgJHdpZGdldC5jc3MgJ292ZXJmbG93JywnJ1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbGxiYWNrKClcbiAgICAgICAgICAgICAgICAsNjAwXG5cbiAgICApXG5dXG5tcldpZGdldC5kaXJlY3RpdmUgXCJtckdvRGV0YWlsXCIsICBbIFwiJGNvbXBpbGVcIiAsIFwiJHRpbWVvdXRcIiAsXCIkd2luZG93XCIsIFwiJHBhcnNlXCIsICggJGNvbXBpbGUgLCAkdGltZW91dCwgJHdpbmRvdywgJHBhcnNlKSAtPlxuXG5cbiAgICByZXR1cm4gKFxuXG4gICAgICAgIHJlc3RyaWN0OidBRSdcblxuICAgICAgICByZXBsYWNlOiB0cnVlXG5cbiAgICAgICAgbGluayA6IChzY29wZSwgJGVsZSwgYXR0cnMsIGN0bHIpIC0+XG5cbiAgICAgICAgICAgIGlzRGV0YWlsT3BlbiA9IHVuZGVmaW5lZFxuXG4gICAgICAgICAgICAkdGltZW91dCAtPlxuXG4gICAgICAgICAgICAgICAgJGRldCAgICAgICAgID0gJCgnLmRldCcpXG4gICAgICAgICAgICAgICAgJGRldENvbnRlbnQgID0gJGRldC5maW5kKCcuZGV0LWNvbnRlbnQnKVxuICAgICAgICAgICAgICAgICR3aWRnZXQgICAgICA9ICRlbGUuY2xvc2VzdCgnLndpZGdldCcpXG4gICAgICAgICAgICAgICAgJHdpZGdldERldCAgID0gJHdpZGdldC5maW5kKCcud2lkZ2V0LWRldCcpXG4gICAgICAgICAgICAgICAgJGRhc2hJbm5lciAgID0gJCgnLmRhc2gtaW5uZXInKVxuICAgICAgICAgICAgICAgICR3aW5kb3cgICAgICA9ICQod2luZG93KVxuICAgICAgICAgICAgICAgIG9mZnNldCAgICAgICA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGRhc2hPZmZzZXQgICA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGVsZVdpZHRoICAgICA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGVsZUhlaWdodCAgICA9IHVuZGVmaW5lZFxuXG4gICAgICAgICAgICAgICAgJGNsb25lICAgICAgID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgJHRhckVsZSAgICAgID0gdW5kZWZpbmVkXG5cbiAgICAgICAgICAgICAgICAkYm9keSAgICAgICAgPSAkKCdib2R5JylcblxuICAgICAgICAgICAgICAgIG9wZW5EZXRhaWwgPSAoaXNPcGVuKS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIGlzT3BlblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZXRhaWxPcGVuICA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkZ2V0RGV0SHRtbCA9ICR3aWRnZXREZXQuaHRtbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVXaWR0aCAgICAgID0gJHdpZGdldC5vdXRlcldpZHRoKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZUhlaWdodCAgICAgPSAkd2lkZ2V0Lm91dGVySGVpZ2h0KClcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhckVsZSAgICAgICA9ICQoJzxkaXYgY2xhc3M9XCJ3aWRnZXQtZGV0LWZha2VcIj48L2Rpdj4nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgICAgICAgID0gJHdpZGdldC5vZmZzZXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGFzaE9mZnNldCAgICA9ICRkYXNoSW5uZXIub2Zmc2V0KClcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgIDogJHdpbmRvdy5zY3JvbGxMZWZ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3AgICA6ICR3aW5kb3cuc2Nyb2xsVG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6ICR3aW5kb3cud2lkdGgoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJHdpbmRvdy5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRjbG9uZSAgICAgPSAkd2lkZ2V0LmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgICAgICRjbG9uZS5maW5kKCcud2lkZ2V0LS1mcm9udCcpLmF0dHIoJ3dpZGdldC1pZCcsJycpXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhckVsZS5jc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncG9zaXRpb24nICAgICAgICA6ICdmaXhlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCcgICAgICAgICAgICA6IG9mZnNldC5sZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgICAgICAgOiBvZmZzZXQudG9wIC0gc2Nyb2xsT2Zmc2V0LnRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCcgICAgICAgICAgIDogZWxlV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JyAgICAgICAgICA6IGVsZUhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0tc3R5bGUnIDogJ3ByZXNlcnZlLTNkJ1xuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAkY2xvbmUuY3NzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJyAgIDogJzEwMCUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCcgIDogJzEwMCUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXJnaW4nICA6IDBcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhckVsZS5hcHBlbmQgJGNsb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyRWxlLmFwcGVuZCAnPGRpdiBjbGFzcz1cIndpZGdldC1iYWNrZmFjZVwiPjwvZGl2PidcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmRldC1mYWtlJykuYXBwZW5kICR0YXJFbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aWRnZXQuY3NzICdvcGFjaXR5JzowXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgJGRldENvbnRlbnQuaHRtbCh3aWRnZXREZXRIdG1sKVxuICAgICAgICAgICAgICAgICAgICAgICAgJGRldC5jc3MgJ2Rpc3BsYXknOidibG9jaycsJ29wYWNpdHknOjBcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFyRWxlLnZlbG9jaXR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVaOicxMDAwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGVYIDogJzE3OWRlZydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbiA6IDYwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOidlYXNlLWluLW91dCdcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS52ZWxvY2l0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ICA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCAgIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggOiAnMTAwJSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gOiAzMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5OiAzMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzonZWFzZS1pbi1vdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlIDogLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZGV0LnZlbG9jaXR5IHtvcGFjaXR5OjF9LHtlYXNpbmc6J2Vhc2UtaW4tb3V0JyxkdXJhdGlvbjoyMDB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKCdvdmVyZmxvdyc6J2hpZGRlbicscG9zaXRpb246J2ZpeGVkJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGRhc2hJbm5lci52ZWxvY2l0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWjonLTEwMDBweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbiA6IDYwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOidlYXNlLWluLW91dCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAsMFxuXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpZiBub3QgaXNEZXRhaWxPcGVuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRGV0YWlsQ2xvc2VkID0gLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLm1yR29EZXRhaWwpLmFzc2lnbiBzY29wZSxmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nIG1vZGVsKHNjb3BlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIG1vZGVsLmFzc2lnbiBzY29wZSwgJ0FudG9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nIG1vZGVsKHNjb3BlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgc2NvcGVbYXR0cnMubXJHb0RldGFpbF0gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RldGFpbE9wZW4gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAkYm9keS5jc3MoJ292ZXJmbG93JzonJyxwb3NpdGlvbjonJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgJGRldC52ZWxvY2l0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyAgIDogJ2Vhc2UtaW4tb3V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbiA6IDIwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA6IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZGV0LmNzcyAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZGV0Q29udGVudC5odG1sKCcnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhckVsZS52ZWxvY2l0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCcgICAgICAgICAgICA6IG9mZnNldC5sZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndG9wJyAgICAgICAgICAgICA6IG9mZnNldC50b3AgLSBzY3JvbGxPZmZzZXQudG9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnICAgICAgICAgICA6IGVsZVdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JyAgICAgICAgICA6IGVsZUhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uIDogNDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6J2Vhc2UtaW4tb3V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUgOiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZlbG9jaXR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVaOicwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlWCA6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uIDogNjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6J2Vhc2UtaW4tb3V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheTogMzAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA6IC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdpZGdldC5jc3MgJ29wYWNpdHknOjFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFyRWxlLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25EZXRhaWxDbG9zZWQoKVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRkYXNoSW5uZXIudmVsb2NpdHkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVo6JzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gOiA2MDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzonZWFzZS1pbi1vdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheTogMzAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAsMFxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG5cblxuXG5cblxuXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoIGF0dHJzLm1yR29EZXRhaWwsKG5ld1ZhbCktPlxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpZiBub3QgbmV3VmFsP1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBpc0RldGFpbE9wZW4/XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RldGFpbE9wZW4gPSBuZXdWYWxcblxuICAgICAgICAgICAgICAgICAgICBpZiBuZXdWYWwgaXMgaXNEZXRhaWxPcGVuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgICAgICBvcGVuRGV0YWlsKG5ld1ZhbClcblxuICAgICAgICAgICAgICAgICRkZXQuZmluZCgnLmRldC1jbG9zZScpLm9uICdjbGljaycsLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgaXNEZXRhaWxPcGVuIGlzIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5EZXRhaWwoZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAsMFxuICAgICAgICAgICAgIyBzY29wZS4kb24gJyRkZXN0cm95JywtPlxuICAgICAgICAgICAgIyAgICAgJGRldENvbnRlbnQuaHRtbCgnJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbl1cbiJdfQ==