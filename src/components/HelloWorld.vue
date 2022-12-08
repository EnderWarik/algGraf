<style module>

body {
  font-family: sans-serif;

  margin: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: stretch;
  align-items: stretch;
}


svg {
  width: 100vw;
  height: 100vh;
  flex: 1;
}
g{

}
text{
 z-index: 99;
}
.reccordstep{
display: inline-block;

}
.reccordstepmatrix{
  display: inline-block;
  margin-left: 20px;
}
.table{
flex-direction: column;
}
.error{
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
}
</style>

<template>

  <div > {{errorMessage}}</div>

  <input type="number" v-model="countOfVertices"> <span>countOfVertices</span><br>
  <input type="number" v-model="countOfEdges"> <span>countOfEdges</span><br>
  <button @click = "createGraf">
    Click
  </button>

  <div id="graphDiv">

  </div>



  bypassInBreadth
  {{bypassInBreadth}}
    <table border =1>

      <tr>
        <th>k</th>
        <th>N</th>
        <th>i</th>
        <th>j</th>
        <th>p</th>
        <th>S</th>
      </tr>
      <template v-for="(item,name,key) in recordsStep" >
        <tr>
        <td> {{item[0]}} </td>
          <td>{{item[1]}} </td>
          <td> {{item[2]}} </td>
          <td> {{item[3]}} </td>
          <td>{{item[4]}} </td>
       <td>

          <div v-for="tablerow in item[5]" >

            {{tablerow}}
          </div>


       </td>
        </tr>
      </template>
    </table>


</template>

<script setup lang="ts" >
import OperationsFromMatrix from '../composition/OperationsFromMatrix'
import {ref} from 'vue'
import Viva from 'vivagraphjs'

const errorMessage=ref()
const countOfVertices = ref(3)
const countOfEdges = ref(4)

const render = ref()

const recordsStep = ref()

const bypassInBreadth = ref()
function createGraf() {

  if(!!render.value){
    render.value.dispose()
    render.value = null
  }
  if(countOfEdges.value > countOfVertices.value*countOfVertices .value- countOfVertices.value){
    errorMessage.value = 'Количество ребер не может быть больше чем вершина * вершину - вершина'
    recordsStep.value = ''
    bypassInBreadth.value=''

    return
  }
  else{
    errorMessage.value = ''

  }

  const operationsFromMatrix = new OperationsFromMatrix(countOfVertices.value, countOfEdges.value);

  operationsFromMatrix.createNonOrientedAdjacencyMatrix()
  recordsStep.value = operationsFromMatrix.getRecordStep()

  const matrix = operationsFromMatrix.getAdjacencyMatrix().getValue()



  var graph = Viva.Graph.graph();
  var graphics = Viva.Graph.View.svgGraphics();
  const iterations = operationsFromMatrix.getAdjacencyMatrix().getLength()
  for(let i=0;i<iterations;i++){
    graph.addNode(i,{id:i})
    for(let j=0;j<iterations;j++){
      if(matrix[i][j]===1){
        graph.addLink(i,j)
      }

    }
  }

  var layout = Viva.Graph.Layout.forceDirected(graph, {
    springLength: 200,
    springCoeff: 0.0005,
    dragCoeff: 0.02,
    gravity: -1.2
  });



  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    var ui = Viva.Graph.svg('g'),
        // Create SVG text element with user id as content
        svgText = Viva.Graph.svg('text').attr('z-index', '99').text(node.id),
        img = Viva.Graph.svg('rect')
        .attr('width', 12)
        .attr('height', 12)
            .attr('fill','blue');


    ui.append(img);
     ui.append(svgText);

    return ui;
  }).placeNode(function(nodeUI, pos) {
    // 'g' element doesn't have convenient (x,y) attributes, instead
    // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
    nodeUI.attr('transform',
        'translate(' +
        (pos.x -6 ) + ',' + (pos.y-6  ) +
        ')');
    nodeUI.attr('width', 12)
        .attr('height', 12).attr('z-index',0)
  });
  graphics.getGraphicsRoot(svgRoot => {
    const svg = Viva.Graph.svg;
    const defs = svg('defs');
    const marker = svg('marker')
        .attr('id', 'arrow')
        .attr('markerWidth', 30)
        .attr('markerHeight', 30)
        .attr('refX', 13)
        .attr('refY', 3)
        .attr('orient', 'auto');
    const path = svg('path')
        .attr('d', 'M0,0 L0,6 L9,3 z')
        .attr('fill', '#111');

    marker.appendChild(path);

    defs.appendChild(marker);

    svgRoot.appendChild(defs);
  });
  graphics.link(() => {
    return Viva.Graph.svg('line')
        .attr('stroke', '#111')
        .attr('marker-end', 'url(#arrow)');
  });

  var renderer = Viva.Graph.View.renderer(graph, {
    graphics: graphics,
    layout: layout,

  });

  renderer.run();

  render.value= renderer


  let queue = [0]
  let queueReady = []

  for(let i=0;i<iterations;i++){
    for(let j=0;j<iterations;j++) {
     // console.log('matrix', matrix[queue[0]][j]);
      if (matrix[queue[0]][j] === 1) {
        //console.log('undo', queue);
        if (queueReady.findIndex((elem) => elem === j) ===-1 && queue.findIndex((elem) => elem === j)===-1 ) {
          queue.push(j)
        }

      //  console.log('over', queue);
      }
    }


      const queueItem = queue.shift()
      queueReady.push(queueItem)
     // console.log('step',queue);
     // console.log('queueReady',queueReady);
    if(queue.length===0){
      break
    }

  }
 // console.log('queueReadyResult',queueReady);
  bypassInBreadth.value = queueReady
}

</script>
