import React from "react";
import ReactApexChart from "react-apexcharts";

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    const { chartData, chartOptions } = this.state;
    const noDataMessage = <div>Sem dados</div>;
  
    return chartData.length ? (
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type='pie'
        width='100%'
        height='55%'
      />
    ) : noDataMessage;
  }
}

export default PieChart;
