am4core.ready(function () {
  // retrieve data from server http://127.0.0.1:8000/symptoms (in JSON format)
  fetch("/symptoms")
    .then((res) => res.json())
    .then((data) => {
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("divStackedBarChart", am4charts.XYChart);

      // Add data
      chart.data = data;

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "symptom";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.title.text = "Number of patients";

      // Create series
      function createSeries(field, name, stacked) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "symptom";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = stacked;
        series.columns.template.width = am4core.percent(95);
      }

      createSeries("yes", "Yes", false);
      createSeries("no", "No", true);

      // Add legend
      chart.legend = new am4charts.Legend();
    });
}); // end am4core.ready()
