import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,Brush
} from 'recharts';

class RowChart extends React.Component {

    constructor(props)
    {
        super(props);
        this.chart = {data : props.data};
    }

  render() {
    return (
      // <BarChart
      //  // width={800}
      // width={300}
      // height={200}
      //  // height={300}
      //   data={this.chart.data}
      //   stackOffset="sign"
      //  margin={{ top: 5, right: 30, left: 20, bottom: 5,}}
      // >
      //   <CartesianGrid strokeDasharray="3 3" />
      //   <XAxis dataKey="category" />
      //   <YAxis />
      //   <Tooltip />
      //   <Legend/>
      //   <ReferenceLine y={0} stroke="#000" />
      //   <Bar dataKey="like" fill="#8884d8" stackId="stack" />
      //   <Bar dataKey="unlike" fill="#82ca9d" stackId="stack" />
      // </BarChart>

<BarChart
        width={800}
        height={300}
        data={this.chart.data}
        margin={{
        //  top: 5, 
          // right: 30, 
          // left: 20,
          // bottom: 5,
        }}

      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="letter" tickMargin={0} tickLine={false} axisLine={false}/> 
        <YAxis />
        {/* <Tooltip /> */}
        {/* <Legend  /> */}
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="like"
        fill="#8884d8"  barSize={10} 
        />
        <Bar dataKey="unlike" 
        fill="#82ca9d"  barSize={10}
        />
      </BarChart>

    );
  }
}



export default RowChart; 