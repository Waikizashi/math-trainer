
export const theoryTopics = [
    {
        __html: `
<h3 className="card-title">Introduction to Graph Theory</h3>
                        <div>
                            <section>
                                <h2>Basic Definitions</h2>
                                <p>Graph theory is a branch of mathematics that studies graphs, which are mathematical structures used to model pairwise relations between objects. A graph <em>G</em> consists of a set of vertices <em>V</em>, and a set of edges <em>E</em>, which connect pairs of vertices.</p>
                            </section>
                            <section>
                                <h2>Types of Graphs</h2>
                                <ul>
                                    <li><strong>Undirected graphs</strong> - graphs in which edges have no direction.</li>
                                    <li><strong>Directed graphs (digraphs)</strong> - graphs where each edge has a direction.</li>
                                    <li><strong>Weighted graphs</strong> - graphs in which each edge is assigned a value or weight.</li>
                                </ul>
                            </section>
                            <section>
                                <h2>Applications of Graphs</h2>
                                <p>Graphs are widely used in computer science, social sciences, biology, network technologies, and many other fields. They are used to model communication networks, paths of travel, relations between entities, and much more.</p>
                            </section>
                        </div><div>
                            <h1>Introduction to Graph Theory</h1>
                            <section>
                                <h2>Basic Definitions</h2>
                                <p>Graph theory is a branch of mathematics that studies graphs, which are mathematical structures used to model pairwise relations between objects. A graph <em>G</em> consists of a set of vertices <em>V</em>, and a set of edges <em>E</em>, which connect pairs of vertices.</p>
                            </section>
                            <section>
                                <h2>Types of Graphs</h2>
                                <ul>
                                    <li><strong>Undirected graphs</strong> - graphs in which edges have no direction.</li>
                                    <li><strong>Directed graphs (digraphs)</strong> - graphs where each edge has a direction.</li>
                                    <li><strong>Weighted graphs</strong> - graphs in which each edge is assigned a value or weight.</li>
                                </ul>
                            </section>
                            <section>
                                <h2>Applications of Graphs</h2>
                                <p>Graphs are widely used in computer science, social sciences, biology, network technologies, and many other fields. They are used to model communication networks, paths of travel, relations between entities, and much more.</p>
                            </section>
                        </div>`,
    },
    {
        __html: `<div className="graph-theory">
<h1>4.1 Representations of Graphs</h1>
<p>
  In the previous chapter, we represented graphs with diagrams, such as sketching the graph 
  as in example 3.1. However, when tasked with more complex analysis and operations on graphs, 
  this approach is not efficient. We need a more formal and effective representation method for graphs.
</p>
<h2>4.1.1 Adjacency Matrix</h2>
<p>
  One of the ways to represent graphs is to describe the graph using its adjacency matrix.
</p>
<h3>Definition 4.1.1 — Adjacency Matrix of a Graph</h3>
<p>
  Let G be a graph with a set of vertices V, where the size of V is |V| = n. The adjacency matrix of the graph G
  will be an n x n matrix, where the rows and columns correspond to the vertices of graph G in some arbitrary, 
  but fixed, order. The element a<sub>ij</sub> of the adjacency matrix, at row i and column j, 
  indicates the number of edges connecting vertices i and j in graph G.
</p>
<h3>Example 4.1</h3>
<p>
  Consider graph G, which we see in the diagram to the right. Graph G has 3 vertices, 
  therefore the adjacency matrix of graph G will have dimensions 3 x 3. Let us not specify any particular 
  order of vertices, for example, lexicographical. The rows and columns of the matrix will correspond to the 
  vertices of graph G in any chosen order.
</p>
<table border="1">
  <tr>
    <th></th>
    <th>0</th>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
  </tr>
  <tr>
    <th>0</th>
    <td>0</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
  </tr>
  <tr>
    <th>1</th>
    <td>1</td>
    <td>0</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
  </tr>
  <tr>
    <th>2</th>
    <td>1</td>
    <td>1</td>
    <td>0</td>
    <td>1</td>
    <td>1</td>
  </tr>
  <tr>
    <th>3</th>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
    <td>1</td>
  </tr>
  <tr>
    <th>4</th>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>1</td>
    <td>0</td>
  </tr>
</table>

<p>
  As each loop at vertex i is counted twice, if i = j, then each loop includes vertex i twice.
</p>
</div>`}]