
/*
#
 * nlSelectBx
 * @desc : Custom Select box using angularjs
 * @author: Nilaf Talapady
 * @company: Moonraft Innovation Pvt Ltd
 * @version: 0.1
#
 */

(function() {
  var templateDefault;

  templateDefault = "<div class=\"nl-selectbx\" tabindex=\"0\" ng-focus=\"isFocusActive=true\" ng-blur=\"isFocusActive=false\">\n    <!-- Select Input -->\n    <select class =\"nl-selectbx-input\" ng-transclude></select>\n    <div class=\"nl-selectbx-box\" ng-class=\"{'is-empty': !ngModel || ngModel==''}\" ng-click=\"toggleActive()\">{{selectedText}}</div>\n    <ul class=\"nl-selectbx-options\" ng-show=\"(isActive || isFocusActive) && !ngDisabled\">\n        <li ng-repeat=\"option in options\" ng-click=\"optionClicked($index)\">\n            <div ng-bind-html = \"options[$index]\">l </div>\n        </li>\n    </ul>\n</div>";


  /* Directive Declaration */

  angular.module("nlSelectbx", []).directive("nlSelectbx", [
    '$compile', '$timeout', "$parse", '$sce', function($compile, $timeout, $parse, $sce) {
      return {
        scope: {
          ngModel: '=',
          ngDisabled: '='
        },
        template: templateDefault,
        replace: true,
        restrict: 'AE',
        transclude: true,
        require: ['?ngModel'],
        link: function(scope, ele, attrs, ctlr) {

          /* prepare select box for angular */
          var $optionsEle, $select, calculateSelectedText, generateOptions, isClicked, nlSelectbxSourceName, ref;
          $select = ele.find('select');
          $select.attr('ng-options', attrs.nlSelectbxOptions).attr('ng-model', attrs.ngModel);
          ref = attrs.nlSelectbxOptions.split(" "), nlSelectbxSourceName = ref[ref.length - 1];
          scope.ngModel = scope.ngModel || attrs.nlSelectbxDefault;
          $select.removeAttr('ng-transclude');

          /* compile selectbx with parent scope */
          $select = $compile($select)(scope.$parent);

          /* fetch options and generate html */
          $optionsEle = [];
          generateOptions = function() {
            var $option, html, i, j, options, ref1, selectedText;
            options = [];
            selectedText = '';

            /* loop through all option elements to output options */
            $optionsEle = $select.find('option');
            for (i = j = 0, ref1 = $optionsEle.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
              $option = angular.element($optionsEle[i]);
              if ($option.attr('value') === "?") {
                continue;
              }
              html = $option.html();
              html = $sce.trustAsHtml(html);
              options.push(html);
            }
            scope.options = options;
          };

          /* Select box selected text. Loop through options and pick selected=true option */
          calculateSelectedText = function() {
            var selectedText;
            if ((scope.ngModel == null) || scope.ngModel === '') {
              selectedText = $optionsEle.eq(0).text();
            } else {
              selectedText = $select.find('option:selected').text();
            }
            scope.selectedText = selectedText;
          };

          /* Worst performing watch. Any workarounds? */
          scope.$watch((function() {
            return $select.html();
          }), (function() {
            generateOptions();
            calculateSelectedText();
          }), true);
          scope.$watch('ngModel', function(newVal) {
            $timeout(function() {
              return calculateSelectedText();
            });
            return newVal;
          });
          isClicked = false;
          scope.toggleActive = function() {
            isClicked = true;
            return scope.isActive = !scope.isActive;
          };
          scope.optionClicked = function(index) {
            var src;
            scope.isActive = false;
            scope.isFocusActive = false;
            isClicked = true;
            src = $parse(nlSelectbxSourceName)(scope.$parent);
            scope.ngModel = src[index];
            return true;
          };
          angular.element(document).bind("click", function(event) {
            if (isClicked) {
              isClicked = false;
              return;
            }
            if (!scope.isActive) {
              return;
            }
            return scope.$apply(function() {
              return scope.isActive = false;
            });
          });
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,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U0FBQyxLQUFELEdBQUE7QUFFbEIsZ0JBQUEsR0FBQTtBQUFBLFlBQUEsS0FBSyxDQUFDLFFBQU4sR0FBaUIsS0FBakIsQ0FBQTtBQUFBLFlBQ0EsS0FBSyxDQUFDLGFBQU4sR0FBc0IsS0FEdEIsQ0FBQTtBQUFBLFlBR0EsU0FBQSxHQUFZLElBSFosQ0FBQTtBQUFBLFlBSUEsR0FBQSxHQUFNLE1BQUEsQ0FBTyxvQkFBUCxDQUFBLENBQTZCLEtBQUssQ0FBQyxPQUFuQyxDQUpOLENBQUE7QUFBQSxZQUtBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLEdBQUksQ0FBQSxLQUFBLENBTHBCLENBQUE7bUJBT0EsS0FUa0I7VUFBQSxDQXpFdEIsQ0FBQTtBQUFBLFVBb0ZBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsT0FBL0IsRUFBd0MsU0FBQyxLQUFELEdBQUE7QUFDcEMsWUFBQSxJQUFHLFNBQUg7QUFDSSxjQUFBLFNBQUEsR0FBYSxLQUFiLENBQUE7QUFDQSxvQkFBQSxDQUZKO2FBQUE7QUFJQSxZQUFBLElBQVUsQ0FBQSxLQUFTLENBQUMsUUFBcEI7QUFBQSxvQkFBQSxDQUFBO2FBSkE7bUJBTUEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFBLEdBQUE7cUJBQ1QsS0FBSyxDQUFDLFFBQU4sR0FBaUIsTUFEUjtZQUFBLENBQWIsRUFQb0M7VUFBQSxDQUF4QyxDQXBGQSxDQUZFO1FBQUEsQ0FYTjtRQUYyRjtJQUFBLENBQXZDO0dBQXhELENBMUJBLENBQUE7QUFBQSIsImZpbGUiOiJubHNlbGVjdGJ4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4jXG4jIG5sU2VsZWN0QnhcbiMgQGRlc2MgOiBDdXN0b20gU2VsZWN0IGJveCB1c2luZyBhbmd1bGFyanNcbiMgQGF1dGhvcjogTmlsYWYgVGFsYXBhZHlcbiMgQGNvbXBhbnk6IE1vb25yYWZ0IElubm92YXRpb24gUHZ0IEx0ZFxuIyBAdmVyc2lvbjogMC4xXG4jXG4jIyNcblxuXG5cbnRlbXBsYXRlRGVmYXVsdCA9IFwiXCJcIlxuICAgIDxkaXYgY2xhc3M9XCJubC1zZWxlY3RieFwiIHRhYmluZGV4PVwiMFwiIG5nLWZvY3VzPVwiaXNGb2N1c0FjdGl2ZT10cnVlXCIgbmctYmx1cj1cImlzRm9jdXNBY3RpdmU9ZmFsc2VcIj5cbiAgICAgICAgPCEtLSBTZWxlY3QgSW5wdXQgLS0+XG4gICAgICAgIDxzZWxlY3QgY2xhc3MgPVwibmwtc2VsZWN0YngtaW5wdXRcIiBuZy10cmFuc2NsdWRlPjwvc2VsZWN0PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmwtc2VsZWN0YngtYm94XCIgbmctY2xhc3M9XCJ7J2lzLWVtcHR5JzogIW5nTW9kZWwgfHwgbmdNb2RlbD09Jyd9XCIgbmctY2xpY2s9XCJ0b2dnbGVBY3RpdmUoKVwiPnt7c2VsZWN0ZWRUZXh0fX08L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzPVwibmwtc2VsZWN0Yngtb3B0aW9uc1wiIG5nLXNob3c9XCIoaXNBY3RpdmUgfHwgaXNGb2N1c0FjdGl2ZSkgJiYgIW5nRGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJvcHRpb24gaW4gb3B0aW9uc1wiIG5nLWNsaWNrPVwib3B0aW9uQ2xpY2tlZCgkaW5kZXgpXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBuZy1iaW5kLWh0bWwgPSBcIm9wdGlvbnNbJGluZGV4XVwiPmwgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuXG4jIyMgRGlyZWN0aXZlIERlY2xhcmF0aW9uICMjI1xuYW5ndWxhci5tb2R1bGUoXCJubFNlbGVjdGJ4XCIsW10pLmRpcmVjdGl2ZSBcIm5sU2VsZWN0YnhcIiwgWyckY29tcGlsZScsJyR0aW1lb3V0JyxcIiRwYXJzZVwiLCckc2NlJywoJGNvbXBpbGUsJHRpbWVvdXQsJHBhcnNlLCRzY2UpIC0+XG5cbiAgICBzY29wZTpcbiAgICAgICAgbmdNb2RlbDonPSdcbiAgICAgICAgbmdEaXNhYmxlZDonPSdcblxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZURlZmF1bHRcblxuICAgIHJlcGxhY2U6IHRydWVcbiAgICByZXN0cmljdDonQUUnXG4gICAgdHJhbnNjbHVkZTp0cnVlXG4gICAgcmVxdWlyZTogWyc/bmdNb2RlbCddXG5cbiAgICBsaW5rOiAoc2NvcGUsIGVsZSwgYXR0cnMsY3RscikgLT5cblxuICAgICAgICAjIyMgcHJlcGFyZSBzZWxlY3QgYm94IGZvciBhbmd1bGFyICMjI1xuICAgICAgICAkc2VsZWN0ID0gZWxlLmZpbmQoJ3NlbGVjdCcpXG5cbiAgICAgICAgJHNlbGVjdC5hdHRyKCduZy1vcHRpb25zJyxhdHRycy5ubFNlbGVjdGJ4T3B0aW9ucykuYXR0cignbmctbW9kZWwnLGF0dHJzLm5nTW9kZWwpXG5cbiAgICAgICAgWy4uLixubFNlbGVjdGJ4U291cmNlTmFtZV0gPSBhdHRycy5ubFNlbGVjdGJ4T3B0aW9ucy5zcGxpdChcIiBcIilcblxuICAgICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUubmdNb2RlbCB8fCBhdHRycy5ubFNlbGVjdGJ4RGVmYXVsdFxuICAgICAgICAkc2VsZWN0LnJlbW92ZUF0dHIoJ25nLXRyYW5zY2x1ZGUnKVxuXG5cbiAgICAgICAgIyMjIGNvbXBpbGUgc2VsZWN0Ynggd2l0aCBwYXJlbnQgc2NvcGUgIyMjXG4gICAgICAgICRzZWxlY3QgPSAgJGNvbXBpbGUoJHNlbGVjdCkoc2NvcGUuJHBhcmVudClcblxuXG5cbiAgICAgICAgIyMjIGZldGNoIG9wdGlvbnMgYW5kIGdlbmVyYXRlIGh0bWwgIyMjXG4gICAgICAgICRvcHRpb25zRWxlID0gW11cbiAgICAgICAgZ2VuZXJhdGVPcHRpb25zID0gLT5cbiAgICAgICAgICAgIG9wdGlvbnMgPSBbXVxuICAgICAgICAgICAgc2VsZWN0ZWRUZXh0ID0gJydcblxuICAgICAgICAgICAgIyMjIGxvb3AgdGhyb3VnaCBhbGwgb3B0aW9uIGVsZW1lbnRzIHRvIG91dHB1dCBvcHRpb25zICMjI1xuICAgICAgICAgICAgJG9wdGlvbnNFbGUgPSAkc2VsZWN0LmZpbmQoJ29wdGlvbicpXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLiRvcHRpb25zRWxlLmxlbmd0aF1cbiAgICAgICAgICAgICAgICAkb3B0aW9uID0gYW5ndWxhci5lbGVtZW50ICRvcHRpb25zRWxlW2ldXG4gICAgICAgICAgICAgICAgaWYgJG9wdGlvbi5hdHRyKCd2YWx1ZScpIGlzIFwiP1wiXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICBodG1sID0gJG9wdGlvbi5odG1sKClcbiAgICAgICAgICAgICAgICBodG1sID0gJHNjZS50cnVzdEFzSHRtbChodG1sKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaCBodG1sXG5cbiAgICAgICAgICAgIHNjb3BlLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgICAgICAgICByZXR1cm5cblxuXG4gICAgICAgICMjIyBTZWxlY3QgYm94IHNlbGVjdGVkIHRleHQuIExvb3AgdGhyb3VnaCBvcHRpb25zIGFuZCBwaWNrIHNlbGVjdGVkPXRydWUgb3B0aW9uICMjI1xuICAgICAgICBjYWxjdWxhdGVTZWxlY3RlZFRleHQgPSAtPlxuXG4gICAgICAgICAgICBpZiBub3Qgc2NvcGUubmdNb2RlbD8gb3Igc2NvcGUubmdNb2RlbCBpcyAnJ1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGV4dCA9ICRvcHRpb25zRWxlLmVxKDApLnRleHQoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGV4dCA9ICRzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpXG5cbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdGVkVGV4dCA9IHNlbGVjdGVkVGV4dFxuICAgICAgICAgICAgcmV0dXJuXG5cblxuXG4gICAgICAgICMjIyBXb3JzdCBwZXJmb3JtaW5nIHdhdGNoLiBBbnkgd29ya2Fyb3VuZHM/ICMjI1xuICAgICAgICBzY29wZS4kd2F0Y2ggKC0+XG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3QuaHRtbCgpXG4gICAgICAgICAgICApLCgtPlxuXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVPcHRpb25zKClcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVTZWxlY3RlZFRleHQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKSx0cnVlXG5cbiAgICAgICAgc2NvcGUuJHdhdGNoICduZ01vZGVsJywobmV3VmFsKS0+XG4gICAgICAgICAgICAkdGltZW91dCAtPlxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICAgICAgICByZXR1cm4gbmV3VmFsXG5cblxuXG4gICAgICAgIGlzQ2xpY2tlZCAgPSBmYWxzZVxuXG4gICAgICAgIHNjb3BlLnRvZ2dsZUFjdGl2ZSA9IC0+XG4gICAgICAgICAgICBpc0NsaWNrZWQgPSB0cnVlXG4gICAgICAgICAgICBzY29wZS5pc0FjdGl2ZSA9IG5vdCBzY29wZS5pc0FjdGl2ZVxuXG4gICAgICAgIHNjb3BlLm9wdGlvbkNsaWNrZWQgPSAoaW5kZXgpLT5cblxuICAgICAgICAgICAgc2NvcGUuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgc2NvcGUuaXNGb2N1c0FjdGl2ZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlzQ2xpY2tlZCA9IHRydWVcbiAgICAgICAgICAgIHNyYyA9ICRwYXJzZShubFNlbGVjdGJ4U291cmNlTmFtZSkoc2NvcGUuJHBhcmVudClcbiAgICAgICAgICAgIHNjb3BlLm5nTW9kZWwgPSBzcmNbaW5kZXhdXG5cbiAgICAgICAgICAgIHRydWVcblxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmJpbmQgXCJjbGlja1wiLCAoZXZlbnQpIC0+XG4gICAgICAgICAgICBpZiBpc0NsaWNrZWRcbiAgICAgICAgICAgICAgICBpc0NsaWNrZWQgID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgcmV0dXJuIGlmIG5vdCBzY29wZS5pc0FjdGl2ZVxuXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkgLT5cbiAgICAgICAgICAgICAgICBzY29wZS5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuXG5cbl1cbiJdfQ==