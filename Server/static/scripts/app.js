(function() {
  window.app = angular.module('myApp', ["mrWidget", "ngFileUpload", "nlSelectbx", "mrFileUpload", "mrTheme"]);

  app.run([
    "$rootScope", "$http", "mySocket", function($rootScope, $http, mySocket) {
      $rootScope.isBuilder = (window.isBuilder != null) && window.isBuilder === true;
      return $rootScope.isDisplay = (window.isDisplay != null) && window.isDisplay === true;
    }
  ]);

  app.controller("GridController", [
    "$scope", "$rootScope", "$http", "$timeout", "$filter", "mySocket", "server", function($scope, $rootScope, $http, $timeout, $filter, mySocket, server) {
      var entry, formattedDates, getThemeName, i, len;
      $scope.model = {};
      $scope.server = server;
      $scope.themes = [];
      for (i = 0, len = themes.length; i < len; i++) {
        entry = themes[i];
        $scope.themes.push(entry.name);
      }
      getThemeName = function(file) {
        var j, len1;
        for (j = 0, len1 = themes.length; j < len1; j++) {
          entry = themes[j];
          if (entry.file === file.toLowerCase()) {
            return entry.name;
          }
        }
        return '';
      };
      $http.get("/api/widgets/app/all_widgets?history=true&limit=10").success(function(gridData, status, headers, config) {
        var gridList, j, len1, ref;
        gridList = [];
        for (j = 0, len1 = gridData.length; j < len1; j++) {
          entry = gridData[j];
          gridList.push(JSON.parse(entry.value));
        }
        $scope.gridListVersions = gridList;
        $scope.gridList = [gridList[0]];
        $scope.model.selectedTheme = getThemeName(gridList[0].theme);
        $scope.model.selectedThemeFile = gridList[0].theme;
        $scope.gridData = gridData;
        $scope.noOfGrids = $scope.gridData.length;
        $scope.formattedDateForGrid = formattedDates($scope.gridData);
        $scope.model.selectedGridDate = (ref = $scope.formattedDateForGrid) != null ? ref[0] : void 0;
        console.log("Data fetched from server. ", gridList);
      }).error(function(data, status, headers, config) {
        alert("Could not fetch widgets. Something went wrong.");
      });
      formattedDates = function(dataList) {
        var date, j, len1, output;
        output = [];
        for (j = 0, len1 = dataList.length; j < len1; j++) {
          entry = dataList[j];
          date = new Date(entry.lastUpdated);
          output.push($filter('date')(date, "MMM d, hh:mm:ss a"));
        }
        return output;
      };
      $scope.$watch('model.selectedGridDate', function(newVal) {
        var selectedGridData, selectedGridList;
        if (newVal != null) {
          $scope.model.activeGridIndex = $scope.formattedDateForGrid.indexOf(newVal);
          selectedGridList = $scope.gridListVersions[$scope.model.activeGridIndex];
          selectedGridData = $scope.gridData[$scope.model.activeGridIndex];
          $scope.gridList = [selectedGridList];
          if ($scope.model.activeGridIndex !== 0) {
            return server.referenceDate = selectedGridData.lastUpdated;
          } else {
            return server.referenceDate = void 0;
          }
        }
      });
      $scope.$watch('model.selectedTheme', function(newVal, oldVal) {
        var activeGrid, j, len1;
        if ((oldVal != null) && newVal !== oldVal) {
          activeGrid = $scope.gridList[0];
          for (j = 0, len1 = themes.length; j < len1; j++) {
            entry = themes[j];
            if (entry.name === newVal) {
              activeGrid.theme = entry.file;
              $scope.model.selectedThemeFile = entry.file;
            }
          }
          return server.postToQueue('app', 'all_widgets', activeGrid);
        }
      });
      $scope.widgetUpdated = function(newId, oldId) {
        var activeGrid;
        activeGrid = $scope.gridList[0];
        activeGrid.gridData[this.$index].id = newId;
        server.postToQueue('app', 'all_widgets', activeGrid);
      };
      $scope.widgetClass = function(widget) {
        var outputClass;
        outputClass = 'widget-' + widget.type;
        if (!widget.id) {
          outputClass += ' is-empty';
        }
        return outputClass;
      };
      return $scope.publish = function() {
        var activeGrid, onPublish;
        $rootScope.showLoader = true;
        activeGrid = $scope.gridList[0];
        if (activeGrid.length) {
          activeGrid.gridData[0].lastUpdated = Math.floor(Date.now() / 1000);
        }
        server.postToQueue('app', 'all_widgets', activeGrid);
        onPublish = function() {
          $timeout(function() {
            return $rootScope.showLoader = false;
          }, 1000);
        };
        return server.publish(onPublish);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,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QUE7ZUFjQSxNQUFNLENBQUMsT0FBUCxDQUFlLFNBQWYsRUFmYTtNQUFBLEVBckYrRjtJQUFBLENBQW5GO0dBQWpDLENBUkEsQ0FBQTtBQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbXCJtcldpZGdldFwiLFwibmdGaWxlVXBsb2FkXCIsXCJubFNlbGVjdGJ4XCIsXCJtckZpbGVVcGxvYWRcIixcIm1yVGhlbWVcIl0pXG5cblxuYXBwLnJ1biBbIFwiJHJvb3RTY29wZVwiICwgXCIkaHR0cFwiICwgXCJteVNvY2tldFwiLCAoICRyb290U2NvcGUgLCAkaHR0cCwgbXlTb2NrZXQpIC0+XG4gICAgJHJvb3RTY29wZS5pc0J1aWxkZXIgPSB3aW5kb3cuaXNCdWlsZGVyPyBhbmQgd2luZG93LmlzQnVpbGRlciBpcyB0cnVlXG4gICAgJHJvb3RTY29wZS5pc0Rpc3BsYXkgPSB3aW5kb3cuaXNEaXNwbGF5PyBhbmQgd2luZG93LmlzRGlzcGxheSBpcyB0cnVlXG5dXG5cbmFwcC5jb250cm9sbGVyIFwiR3JpZENvbnRyb2xsZXJcIiwgWyBcIiRzY29wZVwiLCBcIiRyb290U2NvcGVcIiAsIFwiJGh0dHBcIiAsIFwiJHRpbWVvdXRcIiAsIFwiJGZpbHRlclwiLCBcIm15U29ja2V0XCIsIFwic2VydmVyXCIsICgkc2NvcGUsICRyb290U2NvcGUgLCAkaHR0cCwgJHRpbWVvdXQsICRmaWx0ZXIsIG15U29ja2V0LCBzZXJ2ZXIpIC0+XG5cbiAgICAkc2NvcGUubW9kZWwgPSB7fVxuICAgICRzY29wZS5zZXJ2ZXIgPSBzZXJ2ZXJcbiAgICAkc2NvcGUudGhlbWVzID0gW11cbiAgICBmb3IgZW50cnkgaW4gdGhlbWVzXG4gICAgICAgICRzY29wZS50aGVtZXMucHVzaCBlbnRyeS5uYW1lXG5cbiAgICBnZXRUaGVtZU5hbWUgPSAoZmlsZSktPlxuICAgICAgICBmb3IgZW50cnkgaW4gdGhlbWVzXG4gICAgICAgICAgICBpZiBlbnRyeS5maWxlIGlzIGZpbGUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS5uYW1lXG5cbiAgICAgICAgcmV0dXJuICcnXG5cbiAgICAkaHR0cC5nZXQoXCIvYXBpL3dpZGdldHMvYXBwL2FsbF93aWRnZXRzP2hpc3Rvcnk9dHJ1ZSZsaW1pdD0xMFwiKS5zdWNjZXNzKChncmlkRGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG5cbiAgICAgICAgIyBwYXJzZSB2YWx1ZSBmaWVsZFxuICAgICAgICBncmlkTGlzdCA9IFtdXG4gICAgICAgIGZvciBlbnRyeSBpbiBncmlkRGF0YVxuICAgICAgICAgICAgZ3JpZExpc3QucHVzaCBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKVxuXG4gICAgICAgICRzY29wZS5ncmlkTGlzdFZlcnNpb25zICAgID0gZ3JpZExpc3RcbiAgICAgICAgJHNjb3BlLmdyaWRMaXN0ICAgICAgICAgICAgPSBbZ3JpZExpc3RbMF1dXG4gICAgICAgICRzY29wZS5tb2RlbC5zZWxlY3RlZFRoZW1lID0gZ2V0VGhlbWVOYW1lKGdyaWRMaXN0WzBdLnRoZW1lKVxuICAgICAgICAkc2NvcGUubW9kZWwuc2VsZWN0ZWRUaGVtZUZpbGUgPSBncmlkTGlzdFswXS50aGVtZVxuICAgICAgICAkc2NvcGUuZ3JpZERhdGEgICAgICAgICAgICA9IGdyaWREYXRhXG5cbiAgICAgICAgJHNjb3BlLm5vT2ZHcmlkcyA9ICRzY29wZS5ncmlkRGF0YS5sZW5ndGhcblxuICAgICAgICAjIGZvciBoZWFkZXIgZHJvcGRvd24gLCB0byB0cmF2ZWwgYmFjayBpbiBoaXN0b3J5XG4gICAgICAgICRzY29wZS5mb3JtYXR0ZWREYXRlRm9yR3JpZCA9IGZvcm1hdHRlZERhdGVzKCRzY29wZS5ncmlkRGF0YSlcbiAgICAgICAgJHNjb3BlLm1vZGVsLnNlbGVjdGVkR3JpZERhdGUgPSAkc2NvcGUuZm9ybWF0dGVkRGF0ZUZvckdyaWQ/WzBdXG5cbiAgICAgICAgY29uc29sZS5sb2cgIFwiRGF0YSBmZXRjaGVkIGZyb20gc2VydmVyLiBcIixncmlkTGlzdFxuICAgICAgICByZXR1cm5cblxuICAgICkuZXJyb3IgKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgICBhbGVydCBcIkNvdWxkIG5vdCBmZXRjaCB3aWRnZXRzLiBTb21ldGhpbmcgd2VudCB3cm9uZy5cIlxuICAgICAgICByZXR1cm5cblxuICAgIGZvcm1hdHRlZERhdGVzID0gKGRhdGFMaXN0KS0+XG4gICAgICAgIG91dHB1dCA9IFtdXG4gICAgICAgIGZvciBlbnRyeSBpbiBkYXRhTGlzdFxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGVudHJ5Lmxhc3RVcGRhdGVkKVxuICAgICAgICAgICAgIyBkYXRlLnNldE1pbnV0ZXMgZGF0ZS5nZXRNaW51dGVzKCkgLSBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KClcbiAgICAgICAgICAgIG91dHB1dC5wdXNoICRmaWx0ZXIoJ2RhdGUnKShkYXRlLCBcIk1NTSBkLCBoaDptbTpzcyBhXCIpXG4gICAgICAgIHJldHVybiBvdXRwdXRcblxuICAgICRzY29wZS4kd2F0Y2ggJ21vZGVsLnNlbGVjdGVkR3JpZERhdGUnLChuZXdWYWwpLT5cbiAgICAgICAgaWYgbmV3VmFsP1xuICAgICAgICAgICAgIyAkc2NvcGUubW9kZWwuYWN0aXZlR3JpZEluZGV4ID0gJHNjb3BlLm5vT2ZHcmlkcyAtICRzY29wZS5mb3JtYXR0ZWREYXRlRm9yR3JpZC5pbmRleE9mKG5ld1ZhbCkgLSAxXG4gICAgICAgICAgICAkc2NvcGUubW9kZWwuYWN0aXZlR3JpZEluZGV4ID0gJHNjb3BlLmZvcm1hdHRlZERhdGVGb3JHcmlkLmluZGV4T2YobmV3VmFsKVxuICAgICAgICAgICAgc2VsZWN0ZWRHcmlkTGlzdCA9ICRzY29wZS5ncmlkTGlzdFZlcnNpb25zWyRzY29wZS5tb2RlbC5hY3RpdmVHcmlkSW5kZXhdXG4gICAgICAgICAgICBzZWxlY3RlZEdyaWREYXRhID0gJHNjb3BlLmdyaWREYXRhWyRzY29wZS5tb2RlbC5hY3RpdmVHcmlkSW5kZXhdXG4gICAgICAgICAgICAkc2NvcGUuZ3JpZExpc3QgPSBbc2VsZWN0ZWRHcmlkTGlzdF1cblxuICAgICAgICAgICAgaWYgJHNjb3BlLm1vZGVsLmFjdGl2ZUdyaWRJbmRleCBpc250IDBcbiAgICAgICAgICAgICAgICBzZXJ2ZXIucmVmZXJlbmNlRGF0ZSA9IHNlbGVjdGVkR3JpZERhdGEubGFzdFVwZGF0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXJ2ZXIucmVmZXJlbmNlRGF0ZSA9IHVuZGVmaW5lZFxuXG4gICAgJHNjb3BlLiR3YXRjaCAnbW9kZWwuc2VsZWN0ZWRUaGVtZScsKG5ld1ZhbCxvbGRWYWwpLT5cblxuICAgICAgICBpZiBvbGRWYWw/ICBhbmQgbmV3VmFsIGlzbnQgb2xkVmFsXG4gICAgICAgICAgICBhY3RpdmVHcmlkID0gJHNjb3BlLmdyaWRMaXN0WzBdXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gdGhlbWVzXG4gICAgICAgICAgICAgICAgaWYgZW50cnkubmFtZSBpcyBuZXdWYWxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlR3JpZC50aGVtZSA9IGVudHJ5LmZpbGVcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGVsLnNlbGVjdGVkVGhlbWVGaWxlICA9IGVudHJ5LmZpbGVcbiAgICAgICAgICAgIHNlcnZlci5wb3N0VG9RdWV1ZSgnYXBwJywnYWxsX3dpZGdldHMnLGFjdGl2ZUdyaWQpXG5cblxuICAgICRzY29wZS53aWRnZXRVcGRhdGVkID0gKG5ld0lkLG9sZElkKS0+XG4gICAgICAgIGFjdGl2ZUdyaWQgPSAkc2NvcGUuZ3JpZExpc3RbMF1cbiAgICAgICAgYWN0aXZlR3JpZC5ncmlkRGF0YVtAJGluZGV4XS5pZCA9IG5ld0lkXG4gICAgICAgIHNlcnZlci5wb3N0VG9RdWV1ZSgnYXBwJywnYWxsX3dpZGdldHMnLGFjdGl2ZUdyaWQpXG4gICAgICAgIHJldHVyblxuXG4gICAgJHNjb3BlLndpZGdldENsYXNzID0gKHdpZGdldCktPlxuICAgICAgICBvdXRwdXRDbGFzcyA9ICd3aWRnZXQtJyt3aWRnZXQudHlwZVxuICAgICAgICBpZiBub3Qgd2lkZ2V0LmlkXG4gICAgICAgICAgICBvdXRwdXRDbGFzcyArPSAnIGlzLWVtcHR5J1xuICAgICAgICByZXR1cm4gb3V0cHV0Q2xhc3NcblxuICAgICRzY29wZS5wdWJsaXNoID0gLT5cbiAgICAgICAgJHJvb3RTY29wZS5zaG93TG9hZGVyID0gdHJ1ZVxuXG4gICAgICAgICMgZm9yY2UgdXBkYXRlIGdyaWRcbiAgICAgICAgYWN0aXZlR3JpZCA9ICRzY29wZS5ncmlkTGlzdFswXVxuICAgICAgICBpZiBhY3RpdmVHcmlkLmxlbmd0aFxuICAgICAgICAgICAgYWN0aXZlR3JpZC5ncmlkRGF0YVswXS5sYXN0VXBkYXRlZCA9IChNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSlcbiAgICAgICAgc2VydmVyLnBvc3RUb1F1ZXVlKCdhcHAnLCdhbGxfd2lkZ2V0cycsIGFjdGl2ZUdyaWQpXG5cbiAgICAgICAgb25QdWJsaXNoID0gLT5cbiAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93TG9hZGVyID0gZmFsc2VcbiAgICAgICAgICAgICwxMDAwXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBzZXJ2ZXIucHVibGlzaChvblB1Ymxpc2gpXG5dXG4iXX0=