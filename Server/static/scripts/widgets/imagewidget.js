(function() {
  window.ImageWidget = (function() {
    function ImageWidget($ele, graphData1) {
      this.$ele = $ele;
      this.graphData = graphData1;
      this.update();
    }

    ImageWidget.prototype.render = function(graphData1) {
      var html, ref, ref1, ref2;
      this.graphData = graphData1;
      this.filename = ((ref = this.graphData.data) != null ? (ref1 = ref[0]) != null ? ref1.filename : void 0 : void 0) != null ? 'uploads/' + ((ref2 = this.graphData.data[0]) != null ? ref2.filename : void 0) : 'images/filename.png';
      html = "<img src=\"" + this.filename + "\" class=\"imagewidget-content\"/>";
      this.$widget = $(html);
      return this.$ele.html(html);
    };

    ImageWidget.prototype.remove = function() {
      return this.$widget.remove();
    };

    ImageWidget.prototype.update = function(graphData) {
      return this.render(graphData || this.graphData);
    };

    return ImageWidget;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpZGdldHMvaW1hZ2V3aWRnZXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsRUFBTSxNQUFNLENBQUM7QUFDSSxJQUFBLHFCQUFDLElBQUQsRUFBTyxVQUFQLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxPQUFELElBQ1YsQ0FBQTtBQUFBLE1BRGdCLElBQUMsQ0FBQSxZQUFELFVBQ2hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQURTO0lBQUEsQ0FBYjs7QUFBQSwwQkFJQSxNQUFBLEdBQU8sU0FBQyxVQUFELEdBQUE7QUFDSCxVQUFBLHFCQUFBO0FBQUEsTUFESSxJQUFDLENBQUEsWUFBRCxVQUNKLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQWUseUdBQUgsR0FBd0MsVUFBQSxrREFBOEIsQ0FBRSxrQkFBeEUsR0FBc0YscUJBQWxHLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxhQUFBLEdBQ1MsSUFBQyxDQUFBLFFBRFYsR0FDbUIsb0NBRjFCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBQSxDQUFFLElBQUYsQ0FKWCxDQUFBO2FBS0EsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBWCxFQU5HO0lBQUEsQ0FKUCxDQUFBOztBQUFBLDBCQVlBLE1BQUEsR0FBUyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxFQURLO0lBQUEsQ0FaVCxDQUFBOztBQUFBLDBCQWVBLE1BQUEsR0FBTyxTQUFDLFNBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQSxJQUFhLElBQUMsQ0FBQSxTQUF0QixFQURHO0lBQUEsQ0FmUCxDQUFBOzt1QkFBQTs7TUFESixDQUFBO0FBQUEiLCJmaWxlIjoid2lkZ2V0cy9pbWFnZXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5JbWFnZVdpZGdldFxuICAgIGNvbnN0cnVjdG9yOiAoQCRlbGUsQGdyYXBoRGF0YSktPlxuICAgICAgICBAdXBkYXRlKClcblxuXG4gICAgcmVuZGVyOihAZ3JhcGhEYXRhKS0+XG4gICAgICAgIEBmaWxlbmFtZSA9IGlmIEBncmFwaERhdGEuZGF0YT9bMF0/LmZpbGVuYW1lPyAgdGhlbiAndXBsb2Fkcy8nKyBAZ3JhcGhEYXRhLmRhdGFbMF0/LmZpbGVuYW1lIGVsc2UgJ2ltYWdlcy9maWxlbmFtZS5wbmcnXG4gICAgICAgIGh0bWwgPSBcIlwiXCJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiI3tAZmlsZW5hbWV9XCIgY2xhc3M9XCJpbWFnZXdpZGdldC1jb250ZW50XCIvPlxuICAgICAgICBcIlwiXCJcbiAgICAgICAgQCR3aWRnZXQgPSAkKGh0bWwpXG4gICAgICAgIEAkZWxlLmh0bWwoaHRtbClcblxuICAgIHJlbW92ZSA6IC0+XG4gICAgICAgIEAkd2lkZ2V0LnJlbW92ZSgpXG5cbiAgICB1cGRhdGU6KGdyYXBoRGF0YSktPlxuICAgICAgICBAcmVuZGVyKGdyYXBoRGF0YSB8fCBAZ3JhcGhEYXRhKVxuIl19