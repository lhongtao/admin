import 'braft-editor/dist/index.css'
import React from 'react'
import { Card, Upload, Icon, Divider  } from 'antd'
import './style.less'
import BraftEditor from 'braft-editor'

class EditorPage extends React.Component {
    state = {
      editorState: BraftEditor.createEditorState(null), // 设置编辑器初始内容
      outputHTML: ''
    }
    
      componentWillUnmount () {
        this.isLivinig = false
      }
    
      componentDidMount () {
        this.isLivinig = true
        // 1秒后更改编辑器内容
        setTimeout(this.setEditorContentAsync, 1000)
      }
    
      uploadHandler = (param) => {
        if (!param.file) {
          return false
        }
      
        this.setState({
          editorState: ContentUtils.insertMedias(this.state.editorState, [{
            type: 'IMAGE',
            url: URL.createObjectURL
          }])
        })
      }

      handleChange = (editorState) => {
        this.setState({
          editorState,
          outputHTML: editorState.toHTML()
        })
      }
    
      setEditorContentAsync = () => {
        this.isLivinig && this.setState({
          editorState: BraftEditor.createEditorState('<p>Hello，<b>World!</b><p>')
        })
      }

  render () {

    const { editorState, outputHTML } = this.state
    return (
        <div style={{ padding: 24 }}>
          <Card bordered={false}>
            <h3>富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。本文选择的是Braft-Editor.</h3>
            <Divider>富文本编辑器</Divider>
            <div className="editor-wrapper">
              <BraftEditor 
                value={editorState} 
                onChange={this.handleChange}
              />
            </div>
            <h5>输出内容</h5>
            <div className="output-content">{outputHTML}</div>
          </Card>
        </div>
    )
  }

}

export default EditorPage