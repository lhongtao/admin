import React from 'react';
import { Card,Result,Button } from 'antd'

class ErrorFour extends React.Component {
  state = { };
  render() {
    return (
      <div style={{ padding: 24 }}>
        <Card bordered={false}>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">Back Home</Button>}
        />        
        </Card>
      </div>
    );
  }
}

export default ErrorFour;