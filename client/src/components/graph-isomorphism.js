import React, { Component } from "react";
import MathJax from "react-mathjax";
import Graph from "react-graph-vis";

class GraphIsomorphism extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingVertex: true,
      addingEdge: false,
      vertexOne: "",
      vertexTwo: "",
      counter: 0,
      labelToID: {},
      vertices: [],
      edges: [],
    };
  }

  addVertex() {
    if (this.state.vertexOne === "") {
      alert("Please enter a label for the vertex!");
      return;
    }

    if (this.state.labelToID[this.state.vertexOne] !== undefined) {
      alert("Vertex already exists. Please enter a new label.");
      return;
    }

    var updatedMap = Object.assign({}, this.state.labelToID);
    updatedMap[this.state.vertexOne] = this.state.counter;

    var updatedVertices = this.state.vertices.slice();
    updatedVertices.push({
      id: this.state.counter,
      label: this.state.vertexOne,
    })

    this.setState({
      counter: this.state.counter + 1,
      labelToID: updatedMap,
      vertices: updatedVertices,
      vertexOne: "",
    });
  }

  addEdge() {
    if (this.state.vertexOne === "" || this.state.vertexTwo === "") {
      alert("Please enter labels for both vertices!");
      return;
    }

    var idOne = this.state.labelToID[this.state.vertexOne];
    if (idOne === undefined) {
      alert("Vertex one is not in the graph.");
      return;
    }

    var idTwo = this.state.labelToID[this.state.vertexTwo];
    if (idTwo === undefined) {
      alert("Vertex two is not in the graph.");
      return;
    }

    var updatedEdges = this.state.edges.slice();
    updatedEdges.push({
      from: idOne,
      to: idTwo,
    });

    this.setState({
      edges: updatedEdges,
      vertexOne: "",
      vertexTwo: "",
    });
  }

  addGraphComponents() {
    if (this.state.addingVertex && this.state.addingEdge) {
      // TODO: reset state
      alert("Something has horribly gone wrong.");
    }
    else if (this.state.addingVertex) {
      return(
        <div>
          <label>
            Enter a vertex:&nbsp;
            <input type="text" onChange={(event) => this.setState({ vertexOne: event.target.value })} />
          </label>
          <br /><br />
          <button onClick={() => this.addVertex()}>Submit</button>
        </div>
      );
    } else if (this.state.addingEdge) {
      return(
        <div>
          <label>
            First vertex in edge:&nbsp;
            <input type="text" onChange={(event) => this.setState({ vertexOne: event.target.value })} />
          </label>
          <br /><br />
          <label>
            Second vertex in edge:&nbsp;
            <input type="text" onChange={(event) => this.setState({ vertexTwo: event.target.value })} />
          </label>
          <br /><br />
          <button onClick={() => this.addEdge()}>Submit</button>
        </div>
      );
    } else {
      // TODO: reset state
      alert("Something has horribly gone wrong.");
    }
  }

  displayGraphOperations() {
    if (this.state.addingVertex && this.state.addingEdge) {
      // TODO: reset state
      console.log("Something has horribly gone wrong.");
    } else if (this.state.addingVertex) {
      return(
        <button onClick={() => this.setState({addingEdge: true, addingVertex: false})}>
          Add edge
        </button>
      );
    } else if (this.state.addingEdge) {
      return(
        <button onClick={() => this.setState({addingVertex: true, addingEdge: false})}>
          Add vertex
        </button>
      );
    } else {
      // TODO: reset state
      console.log("Something has horribly gone wrong.");
    }
  }

  getGraph() {
    return { nodes: this.state.vertices, edges: this.state.edges };
  }

  getOptions() {
    return {
      edges: {
        arrows: {
          to: {
            enabled: false,
          },
        },
      },
    };
  }

  getEvents() {
    return {
      select: function(event) {
        var { nodes, edges } = event;
      }
    }
  }

  render() {
    return(
      <MathJax.Provider>
        <h1 className="curiosity-title">Graph Isomorphism</h1>
        <div>
          A <b>graph</b> consists of two sets: a set of <b>vertices</b> and a
          set of <b>edges</b> among the vertices. It is commonly denoted
          &nbsp;<MathJax.Node inline formula={"G=(V,E)"} />.
        </div>
        <br />
        <div>
          You can use the following buttons to construct a graph.
        </div>
        <br />
        {this.displayGraphOperations()}
        <br /><br />
        {this.addGraphComponents()}
        <br />
        
        <div className="graph-vis-container">
          <Graph
            graph={{ nodes: this.state.vertices, edges: this.state.edges }}
            options={() => this.getOptions()}
            events={() => this.getEvents()}
          />
        </div>

        <br />
        <div>
          Two graphs
          &nbsp;<MathJax.Node inline formula={"G"} />&nbsp;
          and
          &nbsp;<MathJax.Node inline formula={"H"} />&nbsp;
          are isomorphic if there exists a permutation
          &nbsp;<MathJax.Node inline formula={"p: V_G \\rightarrow V_H"} />&nbsp;
          such that for all edges
          &nbsp;<MathJax.Node inline formula={"\\{v,u\\} \\in E_G, \\{p(v),p(u)\\} \\in E_H"} />.
        </div>
      </MathJax.Provider>
    );
  }
}

export default GraphIsomorphism;