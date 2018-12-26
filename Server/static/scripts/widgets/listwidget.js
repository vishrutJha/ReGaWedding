(function() {
  window.ListWidget = (function() {
    function ListWidget($ele, graphData1) {
      this.$ele = $ele;
      this.graphData = graphData1;
      this.render(this.graphData);
    }

    ListWidget.prototype.render = function(graphData1) {
      var data, entry, html, i, len;
      this.graphData = graphData1;
      data = this.graphData.data;
      html = '';
      for (i = 0, len = data.length; i < len; i++) {
        entry = data[i];
        html += "<div class=\"listwidget c-clearfix\">\n    <div class=\"listwidget-left\" style=\"background:" + entry.color.value + "\"></div>\n    <div class=\"listwidget-right\">\n        <div class=\"listwidget-name\">" + entry.title + "</div>\n        <div class=\"listwidget-desc\">" + entry.description + "</div>\n    </div>\n</div>";
      }
      this.$widget = $(html);
      return this.$ele.html(html);
    };

    ListWidget.prototype.remove = function() {
      return this.$widget.remove();
    };

    ListWidget.prototype.update = function(graphData) {
      return this.render(graphData);
    };

    return ListWidget;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpZGdldHMvbGlzdHdpZGdldC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxFQUFNLE1BQU0sQ0FBQztBQUNJLElBQUEsb0JBQUMsSUFBRCxFQUFPLFVBQVAsR0FBQTtBQUNULE1BRFUsSUFBQyxDQUFBLE9BQUQsSUFDVixDQUFBO0FBQUEsTUFEZ0IsSUFBQyxDQUFBLFlBQUQsVUFDaEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsU0FBVCxDQUFBLENBRFM7SUFBQSxDQUFiOztBQUFBLHlCQUlBLE1BQUEsR0FBTyxTQUFDLFVBQUQsR0FBQTtBQUNILFVBQUEseUJBQUE7QUFBQSxNQURJLElBQUMsQ0FBQSxZQUFELFVBQ0osQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUlBLFdBQUEsc0NBQUE7d0JBQUE7QUFFSSxRQUFBLElBQUEsSUFBUSwrRkFBQSxHQUVpRCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBRjdELEdBRW1FLDBGQUZuRSxHQUltQyxLQUFLLENBQUMsS0FKekMsR0FJK0MsaURBSi9DLEdBS21DLEtBQUssQ0FBQyxXQUx6QyxHQUtxRCw0QkFMN0QsQ0FGSjtBQUFBLE9BSkE7QUFBQSxNQWdCQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUEsQ0FBRSxJQUFGLENBaEJYLENBQUE7YUFpQkEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBWCxFQWxCRztJQUFBLENBSlAsQ0FBQTs7QUFBQSx5QkF3QkEsTUFBQSxHQUFTLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLEVBREs7SUFBQSxDQXhCVCxDQUFBOztBQUFBLHlCQTJCQSxNQUFBLEdBQU8sU0FBQyxTQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsTUFBRCxDQUFRLFNBQVIsRUFERztJQUFBLENBM0JQLENBQUE7O3NCQUFBOztNQURKLENBQUE7QUFBQSIsImZpbGUiOiJ3aWRnZXRzL2xpc3R3aWRnZXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuTGlzdFdpZGdldFxuICAgIGNvbnN0cnVjdG9yOiAoQCRlbGUsQGdyYXBoRGF0YSktPlxuICAgICAgICBAcmVuZGVyKEBncmFwaERhdGEpXG5cblxuICAgIHJlbmRlcjooQGdyYXBoRGF0YSktPlxuICAgICAgICBkYXRhID0gQGdyYXBoRGF0YS5kYXRhXG4gICAgICAgIGh0bWwgPSAnJ1xuXG5cbiAgICAgICAgZm9yIGVudHJ5IGluIGRhdGFcblxuICAgICAgICAgICAgaHRtbCArPSBcIlwiXCJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdHdpZGdldCBjLWNsZWFyZml4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0d2lkZ2V0LWxlZnRcIiBzdHlsZT1cImJhY2tncm91bmQ6I3tlbnRyeS5jb2xvci52YWx1ZX1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3R3aWRnZXQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0d2lkZ2V0LW5hbWVcIj4je2VudHJ5LnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3R3aWRnZXQtZGVzY1wiPiN7ZW50cnkuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgQCR3aWRnZXQgPSAkKGh0bWwpXG4gICAgICAgIEAkZWxlLmh0bWwoaHRtbClcblxuICAgIHJlbW92ZSA6IC0+XG4gICAgICAgIEAkd2lkZ2V0LnJlbW92ZSgpXG5cbiAgICB1cGRhdGU6KGdyYXBoRGF0YSktPlxuICAgICAgICBAcmVuZGVyKGdyYXBoRGF0YSlcbiJdfQ==