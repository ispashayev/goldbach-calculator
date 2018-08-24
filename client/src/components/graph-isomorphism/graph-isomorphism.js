import React, { Component } from 'react';
import MathJax from 'react-mathjax';
import Graph from 'react-graph-vis';

import axios from 'axios';

import './graph-isomorphism.css';

class GraphBuilder extends Component {
  constructor(props) {
    /**
     * List of props:
     * 1) graphName - name for the graph
     */
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

  resetVertices() {
    this.setState({
      vertexOne: "",
      vertexTwo: "",
    });
  }

  resetGraph() {
    this.setState({
      addingVertex: true,
      addingEdge: false,
      vertexOne: "",
      vertexTwo: "",
      counter: 0,
      labelToID: {},
      vertices: [],
      edges: [],
    });
  }

  addVertex() {
    if (this.state.vertexOne === "") {
      alert("Graph " + this.props.graphName
            + ": Please enter a label for the vertex!");
      return;
    }

    if (this.state.labelToID[this.state.vertexOne] !== undefined) {
      alert("Graph " + this.props.graphName
            + ": Vertex already exists. Please enter a new label.");
      this.resetVertices();
      return;
    }

    var updatedMap = Object.assign({}, this.state.labelToID);
    updatedMap[this.state.vertexOne] = this.state.counter;

    var updatedVertices = this.state.vertices.slice();
    updatedVertices.push({
      id: this.state.counter,
      label: this.state.vertexOne,
    });

    this.setState({
      counter: this.state.counter + 1,
      labelToID: updatedMap,
      vertices: updatedVertices,
      vertexOne: "",
    });
  }

  addEdge() {
    if (this.state.vertexOne === "" || this.state.vertexTwo === "") {
      alert("Graph " + this.props.graphName
            + ": Please enter labels for both vertices!");
      return;
    }

    var idOne = this.state.labelToID[this.state.vertexOne];
    if (idOne === undefined) {
      alert("Graph " + this.props.graphName
            + ": Vertex one is not in the graph.");
      this.resetVertices();
      return;
    }

    var idTwo = this.state.labelToID[this.state.vertexTwo];
    if (idTwo === undefined) {
      alert("Graph " + this.props.graphName
            + ": Vertex two is not in the graph.");
      this.resetVertices();
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

  displayOps() {
    if (this.state.addingVertex && this.state.addingEdge) {
      alert("Something has horribly gone wrong with Graph "
                  + this.props.graphName);
      this.resetGraph();
    } else if (this.state.addingVertex) {
      return (
        <button onClick={() => this.setState({
          addingEdge: true,
          addingVertex: false,
          vertexOne: "",
          vertexTwo: "",
        })}>
          Add edge
        </button>
      );
    } else if (this.state.addingEdge) {
      return (
        <button onClick={() => this.setState({
          addingVertex: true,
          addingEdge: false,
          vertexOne: "",
          vertexTwo: "",
        })}>
          Add vertex
        </button>
      );
    } else {
      alert("Something has horribly gone wrong with Graph "
                  + this.props.graphName);
      this.resetGraph();
    }
  }

  addComponents() {
    if (this.state.addingVertex && this.state.addingEdge) {
      alert("Something has horribly gone wrong with Graph "
            + this.props.graphName);
      this.resetGraph();
    } else if (this.state.addingVertex) {
      return (
        <div>
          <label>
            Enter a vertex:&nbsp;
            <input
              type="text"
              value={this.state.vertexOne}
              onChange={(event) => this.setState({ vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.addVertex()}>Submit</button>
        </div>
      );
    } else if (this.state.addingEdge) {
      return (
        <div>
          <label>
            First vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.vertexOne}
              onChange={(event) => this.setState({ vertexOne: event.target.value })}
            />
          </label>
          <br /><br />
          <label>
            Second vertex in edge:&nbsp;
            <input
              type="text"
              value={this.state.vertexTwo}
              onChange={(event) => this.setState({ vertexTwo: event.target.value })}
            />
          </label>
          <br /><br />
          <button onClick={() => this.addEdge()}>Submit</button>
        </div>
      );
    } else {
      alert("Something has horribly gone wrong with Graph "
            + this.props.graphName);
      this.resetGraph();
    }
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
    return (
      <div className="graph-isomorphism-graph-builder">
        <h2 className="graph-isomorphism-graph-name">
          Graph {this.props.graphName}
        </h2>
        <div>
          {this.displayOps()}
        </div>
        <br />
        <div>
        {this.addComponents()}
        </div>
        <br />
        <div className="graph-vis-container">
          <Graph
            graph={{ nodes: this.state.vertices, edges: this.state.edges }}
            options={() => this.getOptions()}
            events={() => this.getEvents()}
          />
        </div>
      </div>
    );
  }
}

class GraphIsomorphism extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      isomorphism: "",
    };
  }

  computeIsomorphism() {
    /* Get a comma-separated string of edges of each graph. The vertices pf
       each edge are separated by a space. */
    var graphA_edges = this.graphA.state.edges.map((edge_obj) => {
      var u_id = edge_obj.from;
      var u = this.graphA.state.vertices.filter((x) => {
        if (x.id === u_id)
          return true;
        return false;
      })[0].label;
      var v_id= edge_obj.to;
      var v = this.graphB.state.vertices.filter((x) => {
        if (x.id === v_id)
          return true;
        return false;
      })[0].label;
      return u + ' ' + v;
    });
    var graphB_edges = this.graphB.state.edges.map((edge_obj) => {
      var u_id = edge_obj.from;
      var u = this.graphB.state.vertices.filter((x) => {
        if (x.id === u_id)
          return true;
        return false;
      })[0].label;
      var v_id= edge_obj.to;
      var v = this.graphB.state.vertices.filter((x) => {
        if (x.id === v_id)
          return true;
        return false;
      })[0].label;
      return u + ' ' + v;
    });
    
    /* Send a request to the server to compute an isomorphism. */
    axios
    .post(`/curiosities/graph-isomorphism/compute`, {
      A: graphA_edges,
      B: graphB_edges,
    })
    .then(res => {
      var result = res.data;
      if (result.status == -1) {
        this.setState({
          status: "Unable to compute an isomorphism",
          isomorphism: "",
        });
      } else if (result.status == 0) {
        this.setState({
          status: "Found an isomorphism",
          isomorphism: result.isomorphism,
        });
      } else {
        this.setState({
          status: "I'm sorry our backend seems to be broken",
          isomorphism: "RIP",
        });
      }
    });
  }

  render() {
    return (
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
        <div className="graph-isomorphism-graphs-a-and-b-container">
          <div className="graph-isomorphism-graph-builder-a">
            <GraphBuilder ref={(graphA) => { this.graphA = graphA }} graphName="A" />
          </div>
          <br /><br />
          <div className="graph-isomorphism-graph-builder-b">
            <GraphBuilder ref={(graphB) => { this.graphB = graphB }} graphName="B" />
          </div>
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
        <br />
        <button onClick={() => this.computeIsomorphism()}>Compute Isomorphism</button>
        <br /><br />
        <div>{this.state.status}</div>
        <br />
        <div>{this.state.isomorphism}</div>
        <br />
        <div>
          How does the algorithm work? The specific one implemented here is pretty
          simple: it randomly generates permutations until one that satisfies an
          isomorphism is found (though limited to a certain number of attempts).
          Graph Isomorphism is a very interesting problem from a computational
          complexity standpoint - most theoreticians believe that there exists an
          "efficient" polynomial-time algorithm for solving it, but no one has
          yet been successful in discovering such an algorithm (even though
          there are algorithms for special cases of this problem).
        </div>
      </MathJax.Provider>
    );
  }
}

export default GraphIsomorphism;