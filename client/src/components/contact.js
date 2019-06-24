import React, { Component } from 'react';

class Contact extends Component {
  render() {
    return (
      <div>
        <div className="section-header">Contact</div>
        <div>
          email: ispashayev@gmail.com
        </div>
        <div>
          github:&nbsp;
          <a
            href="https://github.com/ispashayev"
            target="_blank"
            rel="noopener noreferrer"
          >
            ispashayev
          </a>
        </div>
      </div>
    );
  }
}

export default Contact;