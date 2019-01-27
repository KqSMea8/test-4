import React, { Component } from "react";
import intl from "react-intl-universal";

export default class PrivacyItem extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'termsPV',//操作代码
    //   type: 'terms',//tab
    // })
  }

  getContent() {
    return [
      {
        title: this.intl.get('help-privacy-1'),
        content: [
          {
            title: this.intl.get('help-privacy-1-1'),
          },
          {
            title: this.intl.get('help-privacy-1-2'),
          },
          {
            title: this.intl.get('help-privacy-1-3'),
          }
        ]
      },
      {
        title: this.intl.get('help-privacy-2'),
        content: [
          {
            title: this.intl.get('help-privacy-2-1')
          }
          // {
          //   title: this.intl.get('help-privacy-2-3'),
          //   detail: [
          //     this.intl.get('help-privacy-2-3-1'),
          //     this.intl.get('help-privacy-2-3-2')
          //   ]
          // }
        ]
      },
      {
        title: this.intl.get('help-privacy-3'),
        content: [
          {
            title: this.intl.get('help-privacy-3-1'),
          },
          {
            title: this.intl.get('help-privacy-3-2'),
          },
          {
            title: this.intl.get('help-privacy-3-3'),
          },
          {
            title: this.intl.get('help-privacy-3-4'),
          },
          {
            title: this.intl.get('help-privacy-3-5'),
          },
        ]
      },
      {
        title: this.intl.get('help-privacy-4'),
        content: [
          {
            title: this.intl.get('help-privacy-4-1'),
          },
          {
            title: this.intl.get('help-privacy-4-2'),
            detail: [
              this.intl.get('help-privacy-4-2-1'),
              this.intl.get('help-privacy-4-2-2'),
            ]
          },
          {
            title: this.intl.get('help-privacy-4-3'),
          },
          {
            title: this.intl.get('help-privacy-4-4'),
          }
        ]
      },
      {
        title: this.intl.get('help-privacy-5'),
        content: [
          {
            title: this.intl.get('help-privacy-5-1'),
          },
          {
            title: this.intl.get('help-privacy-5-2'),
          },
          {
            title: this.intl.get('help-privacy-5-3')
          },
        ]
      },
      {
        title: this.intl.get('help-privacy-6'),
        content: [
          {
            title: this.intl.get('help-privacy-6-1'),
            detail: [
              this.intl.get('help-privacy-6-1-1'),
              this.intl.get('help-privacy-6-1-2'),
              this.intl.get('help-privacy-6-1-3'),
              this.intl.get('help-privacy-6-1-4'),
              this.intl.get('help-privacy-6-1-5'),
              this.intl.get('help-privacy-6-1-6'),
              this.intl.get('help-privacy-6-1-7'),
              this.intl.get('help-privacy-6-1-8'),
            ]
          },
          {
            title: this.intl.get('help-privacy-6-2'),
          }
        ]
      },
      {
        title: this.intl.get('help-privacy-7'),
        content: [
          {
            title: this.intl.get('help-privacy-7-1'),
            detail: [
              this.intl.get('help-privacy-7-1-1'),
              this.intl.get('help-privacy-7-1-2'),
              this.intl.get('help-privacy-7-1-3'),
              this.intl.get('help-privacy-7-1-4'),
              this.intl.get('help-privacy-7-1-5'),
            ]
          },
          {
            title: this.intl.get('help-privacy-7-2'),
          },
          {
            title: this.intl.get('help-privacy-7-3'),
          }
        ]
      },
      {
        title: this.intl.get('help-privacy-8'),
        content: [
          {
            title: this.intl.get('help-privacy-8-1'),
          }
        ]
      },
      {
        title: this.intl.get('help-privacy-9'),
        content: [
          {
            title: this.intl.get('help-privacy-9-1'),
          },
          {
            title: this.intl.get('help-privacy-9-2'),
          },
          {
            title: this.intl.get('help-privacy-9-3'),
          }
        ]
      }
    ]
  }

  render() {
    const content = this.getContent();
    return <div className="help-terms">
      <h2 className="title">{this.intl.get('help-privacy')}</h2>
      {content.map((v, index) => <div key={index}>
        <h3>{v.title}</h3>
        <ul>
          {v.content.map((v, index) => <li key={index}>
            {v.title}
            {v.detail && <ol>
              {v.detail.map((v, index) => <li key={index}>{v}</li>)}
            </ol>}
          </li>)}
        </ul>
      </div>)}
    </div>;
  }
}
