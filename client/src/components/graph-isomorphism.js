import React, { Component } from "react";
import MathJax from "react-mathjax";
import Graph from "react-graph-vis";

class GraphIsomorphism extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GraphA_addingVertex: true,
      GraphA_addingEdge: false,
      GraphA_vertexOne: "",
      GraphA_vertexTwo: "",
      GraphA_counter: 0,
      GraphA_labelToID: {},
      GraphA_vertices: [],
      GraphA_edges: [],

      GraphB_addingVertex: true,
      GraphB_addingEdge: false,
      GraphB_vertexOne: "",
      GraphB_vertexTwo: "",
      GraphB_counter: 0,
      GraphB_labelToID: {},
      GraphB_vertices: [],
      GraphB_edges: [],
    };
  }

  GraphA_resetVertices() {
    this.setState({
      GraphA_vertexOne: "",
      GraphA_vertexTwo: "",
    });
  }

  GraphA_addVertex() {
    if (this.state.GraphA_vertexOne === "") {
      alert("Graph A: Please enter a label for the vertex!");
      return;
    }

    if (this.state.GraphA_labelToID[this.state.GraphA_vertexOne] !== undefined) {
      alert("Graph A: Vertex already exists. Please enter a new label.");
      this.GraphA_resetVertices();
      return;
    }

    var updatedMap = Object.assign({}, this.state.GraphA_labelToID);
    updatedMap[this.state.GraphA_vertexOne] = this.state.GraphA_counter;

    var updatedVertices = this.state.GraphA_vertices.slice();
    updatedVertices.push({
      id: this.state.GraphA_counter,
      label: this.state.GraphA_vertexOne,
    });

    this.setState({
      GraphA_counter: this.state.GraphA_counter + 1,
      GraphA_labelToID: updatedMap,
      GraphA_vertices: updatedVertices,
      GraphA_vertexOne: "",
    });
  }

  GraphA_addEdge() {
    if (this.state.GraphA_vertexOne === "" || this.state.GraphA_vertexTwo === "") {
      alert("Graph A: Please enter labels for both vertices!");
      return;
    }

    var idOne = this.state.GraphA_labelToID[this.state.GraphA_vertexOne];
    if (idOne === undefined) {
      alert("Graph A: Vertex one is not in the graph.");
      this.GraphA_resetVertices();
      return;
    }

    var idTwo = this.state.GraphA_labelToID[this.state.GraphA_vertexTwo];
    if (idTwo === undefined) {
      alert("Graph A: Vertex two is not in the graph.");
      this.GraphA_resetVertices();
      return;
    }

    var updatedEdges = this.state.GraphA_edges.slice();
    updatedEdges.push({
      from: idOne,
      to: idTwo,
    });

    this.setState({
      GraphA_edges: updatedEdges,
      GraphA_vertexOne: "",
      GraphA_vertexTwo: "",
    });
  }

  GraphA_displayOps() {
    if (this.state.GraphA_addingVertex && this.state.GraphA_addingEdge) {
      // TODO: reset state
      console.log("Something has horribly gone wrong with Graph A.");
    } else if (this.state.GraphA_addingVertex) {
      return(
        <button onClick={() => this.setState({
          GraphA_addingEdge: true,
          GraphA_addingVertex: false,
          GraphA_vertexOne: "",
          GraphA_vertexTwo: "",
        })}>
          Add edge
        </button>
      );
    } else if (this.state.GraphA_addingEdge) {
      return(
        <button onClick={() => this.setState({
          GraphA_addingVertex: true,
          GraphA_addingEdge: false,
          GraphA_vertexOne: "",
          GraphA_vertexTwo: "",
        })}>
          Add vertex
        </button>
      );
    } else {
      // TODO: reset state
      console.log("Something has horribly gone wrong with Graph A.");
    }
  }

  GraphA_addComponents() {
    if (this.state.GraphA_addingVertex && this.state.GraphA_addingEdge) {
      // TODO: reset everything
      alert("Something has horribly gone wrong with Graph A.");
    } else if (this.state.GraphA_addingVertex) {
      return(
        <div>
          <label>
            Enter a vertex:&nbsp;
            <input
              type="text"
              value={this.state.GraphA_vertexOne}
              onChange={(event) => this.setState({ GraphA_vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.GraphA_addVertex()}>Submit</button>
        </div>
      );
    } else if (this.state.GraphA_addingEdge) {
      return(
        <div>
          <label>
            First vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.GraphA_vertexOne}
              onChange={(event) => this.setState({ GraphA_vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <label>
            Second vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.GraphA_vertexTwo}
              onChange={(event) => this.setState({ GraphA_vertexTwo: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.GraphA_addEdge()}>Submit</button>
        </div>
      );
    } else {
      // TODO: reset everything
      alert("Something has horribly gone wrong with Graph A.");
    }
  }

  // TODO - DELETE THIS DELIMITER -------------------------------------------------

  GraphB_resetVertices() {
    this.setState({
      GraphB_vertexOne: "",
      GraphB_vertexTwo: "",
    });
  }

  GraphB_addVertex() {
    if (this.state.GraphB_vertexOne === "") {
      alert("Graph B: Please enter a label for the vertex!");
      return;
    }

    if (this.state.GraphB_labelToID[this.state.GraphB_vertexOne] !== undefined) {
      alert("Graph B: Vertex already exists. Please enter a new label.");
      this.GraphB_resetVertices();
      return;
    }

    var updatedMap = Object.assign({}, this.state.GraphB_labelToID);
    updatedMap[this.state.GraphB_vertexOne] = this.state.GraphB_counter;

    var updatedVertices = this.state.GraphB_vertices.slice();
    updatedVertices.push({
      id: this.state.GraphB_counter,
      label: this.state.GraphB_vertexOne,
    });

    this.setState({
      GraphB_counter: this.state.GraphB_counter + 1,
      GraphB_labelToID: updatedMap,
      GraphB_vertices: updatedVertices,
      GraphB_vertexOne: "",
    });
  }

  GraphB_addEdge() {
    if (this.state.GraphB_vertexOne === "" || this.state.GraphB_vertexTwo === "") {
      alert("Graph B: Please enter labels for both vertices!");
      return;
    }

    var idOne = this.state.GraphB_labelToID[this.state.GraphB_vertexOne];
    if (idOne === undefined) {
      alert("Graph B: Vertex one is not in the graph.");
      this.GraphB_resetVertices();
      return;
    }

    var idTwo = this.state.GraphB_labelToID[this.state.GraphB_vertexTwo];
    if (idTwo === undefined) {
      alert("Graph B: Vertex two is not in the graph.");
      this.GraphB_resetVertices();
      return;
    }

    var updatedEdges = this.state.GraphB_edges.slice();
    updatedEdges.push({
      from: idOne,
      to: idTwo,
    });

    this.setState({
      GraphB_edges: updatedEdges,
      GraphB_vertexOne: "",
      GraphB_vertexTwo: "",
    });
  }

  GraphB_displayOps() {
    if (this.state.GraphB_addingVertex && this.state.GraphB_addingEdge) {
      // TODO: reset state
      console.log("Something has horribly gone wrong with Graph B.");
    } else if (this.state.GraphB_addingVertex) {
      return(
        <button onClick={() => this.setState({
          GraphB_addingEdge: true,
          GraphB_addingVertex: false,
          GraphB_vertexOne: "",
          GraphB_vertexTwo: "",
        })}>
          Add edge
        </button>
      );
    } else if (this.state.GraphB_addingEdge) {
      return(
        <button onClick={() => this.setState({
          GraphB_addingVertex: true,
          GraphB_addingEdge: false,
          GraphB_vertexOne: "",
          GraphB_vertexTwo: "",
        })}>
          Add vertex
        </button>
      );
    } else {
      // TODO: reset state
      console.log("Something has horribly gone wrong with Graph B.");
    }
  }

  GraphB_addComponents() {
    if (this.state.GraphB_addingVertex && this.state.GraphB_addingEdge) {
      // TODO: reset everything
      alert("Something has horribly gone wrong with Graph B.");
    } else if (this.state.GraphB_addingVertex) {
      return(
        <div>
          <label>
            Enter a vertex:&nbsp;
            <input
              type="text"
              value={this.state.GraphB_vertexOne}
              onChange={(event) => this.setState({ GraphB_vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.GraphB_addVertex()}>Submit</button>
        </div>
      );
    } else if (this.state.GraphB_addingEdge) {
      return(
        <div>
          <label>
            First vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.GraphB_vertexOne}
              onChange={(event) => this.setState({ GraphB_vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <label>
            Second vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.GraphB_vertexTwo}
              onChange={(event) => this.setState({ GraphB_vertexTwo: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.GraphB_addEdge()}>Submit</button>
        </div>
      );
    } else {
      // TODO: reset everything
      alert("Something has horribly gone wrong with Graph B.");
    }
  }

  // TODO - DELETE THIS DELIMITER -------------------------------------------------

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

  getGraph(graphName) {
    if (graphName === "A") {
      return(
        <div>
          <div>
            {this.GraphA_displayOps()}
          </div>
          <br />
          <div>
          {this.GraphA_addComponents()}
          </div>
          <br />
          <div className="graph-vis-container-A">
            <Graph
              graph={{ nodes: this.state.GraphA_vertices, edges: this.state.GraphA_edges }}
              options={() => this.getOptions()}
              events={() => this.getEvents()}
            />
          </div>
        </div>
      );
    }
    if (graphName === "B") {
      return(
        <div>
          <div>
            {this.GraphB_displayOps()}
          </div>
          <br />
          <div>
          {this.GraphB_addComponents()}
          </div>
          <br />
          <div className="graph-vis-container-B">
            <Graph
              graph={{ nodes: this.state.GraphB_vertices, edges: this.state.GraphB_edges }}
              options={() => this.getOptions()}
              events={() => this.getEvents()}
            />
          </div>
        </div>
      );
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
          You can use the following interface to construct two separate graphs.
        </div>
        <br />
        <div className="graphs-a-and-b-container">
          {this.getGraph("A")}
          <br /><br />
          {this.getGraph("B")}
        </div>

        <br />
        <div>
          Note about the above renderer: you might have to zoom in and out and
          move the nodes around to see all of the nodes. You can zoom in and
          out by scrolling within the pane.
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