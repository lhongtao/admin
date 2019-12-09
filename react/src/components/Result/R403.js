import React from 'react';
import { Card,Result,Button } from 'antd'

class ErrorThird extends React.Component {
  state = { };
  render() {
    return (
      <div style={{ padding: 24 }}>
        <Card bordered={false}>
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">Back Home</Button>}
          /> 
        </Card>
      </div>
    );
  }
}

export default ErrorThird;