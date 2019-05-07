/* global chrome */
import React, { Component } from "react";
import { getDefinition } from "./BackendHelpers";

export default class Definition extends Component {
  state = {
    text: "",
    definition: null
  };

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    this.sendRequest();
  }

  sendRequest() {
    chrome.runtime.sendMessage({ target: "background", type: "definition" });
  }

  async handleMessage(msg) {
    if (msg.target === "app") {
      if (msg.type === "definition") {
        const definition = await getDefinition(msg.body);
        this.setState({ text: msg.body, definition: definition });
      }
    }
  }
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

  render() {
    return (
      <div className="container main-def">
        <h2 className="Montserrat">{this.state.text}</h2>
        {this.state.definition !== null && (
          <div>
            {this.state.definition.pronunciation !== undefined && 
              <h3 className="Montserrat">
                {this.state.definition.pronunciation.all !== null
                  ? this.state.definition.pronunciation.all
                  : this.state.definition.pronunciation}
              </h3>
              
            }
            <h3 className="Montserrat">Definitions</h3>
            {this.isEmpty(this.state.definition.results)===true ? <h4 className="Montserrat">There are no definition suggestions for this text</h4>:<div>

            {this.state.definition.results.map(info => (
              <div>
                <hr />
                <p className="Montserrat">{info.partOfSpeech}</p>
                <p className="Montserrat">{info.definition}</p>
              </div>
            ))}
            
          </div>
}
</div>
        )}
      </div>
        
    );
    
}

}
