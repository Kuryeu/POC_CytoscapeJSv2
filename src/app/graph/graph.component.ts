import { Component, ElementRef, OnInit, ViewChild} from "@angular/core";

import {IData} from './idata';
import * as DATA_OBJ from "../data/test.json";

//////////////////////////////////////////////////////CYTOSCAPE IMPORTATIONS//////////////////////////////////////////////////////
// @ts-ignore
import * as cytoscape from "cytoscape";
// @ts-ignore
import cola from "cytoscape-cola";
cytoscape.use(cola);

// @ts-ignore
import fcose from "cytoscape-fcose";
cytoscape.use(fcose);

// @ts-ignore
import avsdf from "cytoscape-avsdf";
cytoscape.use(avsdf);

// @ts-ignore
import cise from 'cytoscape-cise';
cytoscape.use( cise );

// @ts-ignore
import dagre from 'cytoscape-dagre';
cytoscape.use( dagre );

// @ts-ignore
// import elk from 'cytoscape-elk';
// cytoscape.use( elk );

// @ts-ignore
import klay from 'cytoscape-klay';
cytoscape.use( klay );

// @ts-ignore
import spread from 'cytoscape-spread';
cytoscape.use( spread );


// import { UpperCasePipe } from "@angular/common";
// import { Target, TargetBinder } from "@angular/compiler";

const DATA: IData[] = Array.from(DATA_OBJ);

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"],
})


export class GraphComponent implements OnInit {

  constructor() {}

  @ViewChild('cyContainer', { static: true })
    cyContainer!: ElementRef<HTMLElement>;

  cy!: cytoscape.Core;

  ngOnInit(): void {
    
    //////////////////////////////////////////////////////DATA TRANSFORMATION//////////////////////////////////////////////////////
    let allNodes: cytoscape.NodeDefinition[] = [];
    let allEdges: cytoscape.EdgeDefinition[] = [];
   
    // Start with an empty map. Use `any` instead of `LayoutNode` if there isn't any better type yet.
const nodesById: { [id: number]: any } = {}

for (const item of DATA) {
  // Insert source into the map. It it already exists, it will be overridden (by the same information).
  nodesById[item.source_id] = {
    id: item.source_id,
    name:  item.source_name, 
    extended_name: item.source_path, //mouseover event label
    color:item.source_color,
  } 

  allNodes.push({ data: { id: "" + item.source_id} });

    // Insert target into the map.
  nodesById[item.target_id] = {
    id: item.target_id,
    name:  item.target_name,
    extended_name: item.target_path, //mouseover event label
    color:item.target_color,
  }

  nodesById[item.connection_id] = {
  id:item.connection_id,    //for edges there are three differents names as well, I would recommend to leave the name empty because it will make the graph hardly readable in most cases]
  source_id:item.source_id,
  target_id:item.target_id,
  color:item.connection_colour,
  name: "",
  extended_name: item.connection_label?? "",
  full_name: item.connection_type_name ??"" +" " + item.connection_type_description ?? "",
  }
  allNodes.push({ data: { id: "" + item.target_id} });

  allEdges.push({ data: {id: "" + item.connection_id, source: "" + item.source_id, target: ""+ item.target_id },}
  );
  
};
const idarrays= Object.keys(nodesById).map(x => Number(x));
let nodeStyle = idarrays.map(x => ({
  selector: `node[id = '${x}']`,
  css: {
    'background-color': nodesById[x].color,
    label: (nodesById[x].expert_name  ??  nodesById[x].name) + ((nodesById[x].label ? ("(" +nodesById[x].label+ ")") : "") )
  }

}))

//////////////////////////////////////////////////////GRAPH INITIALIZATION//////////////////////////////////////////////////////
    this.cy = cytoscape({   
      container: this.cyContainer.nativeElement,
      elements: [
        ...allNodes,
        ...allEdges,

      ],
      style: 
      [
        ...nodeStyle,
        
      {
        selector: "node",
        style: {
          // "border-width": "5%",
          // "border-color": "#4682B4",
          // width:   "10",  
          // height:   "10",
          // "background-image": "../data/photo.png"

        },
      },
      {
        selector: "edge",
        style: {
          width: "1",
          "line-color": "#657b85",
          "curve-style": "bezier",
          "target-arrow-shape": "vee",
          "target-arrow-color": "#657b85",
          "target-endpoint": "outside-to-node-or-label",
          "line-fill": "linear-gradient",
        },
      },
      {
        selector:"label",
        style:{
          "font-size": "10",
          "text-rotation": "autorotate",
          "color": "black",
        }
      }
        
    ],

      layout: {
        
        name: 'grid',
        // rows: 1
        // cols: 1,
        // padding:100,
      },
    }
    
    );

    //////////////////////////////////////////////////////EVENTS//////////////////////////////////////////////////////

    //////////////////NODE MOUSE EVENTS//////////////////
    this.cy.on('cxttap','node',function(event)    //right click displays the full_name as label
    {
    let node = nodesById[event.target.data("id")];
    event.target.style({'label':node.full_name}).update 
    });

    this.cy.on('click', 'node', function(event)   //click console.logs the node object
    {
    var clickedNode = event.target;
    console.log(nodesById [clickedNode.data("id")]);
    });

    this.cy.on('mouseover','node',function(event)   //mouseover displays the extended_name as label
    {
    let node = nodesById[event.target.data("id")];
    event.target.style({'label':node.extended_name}).update 
    }) ;

    this.cy.on('mouseout', 'node', function(event)    //mouseout displays the name as label
    {
    let node = nodesById[event.target.data("id")];
    event.target.style({'label':node.name}).update 
    });

    //////////////////EDGES MOUSE EVENTS//////////////////
    this.cy.on('cxttap','edge',function(event)    //right click displays the full_name as label
    {
    let edge = nodesById[event.target.data("id")];
    event.target.style({'label':edge.full_name}).update 
    });
    this.cy.on('click', 'edge', function(event)   //click console.logs the source and target nodes objects and the edge object
    {
    var clickedEdge = event.target;
    console.log( "edge object :",nodesById [clickedEdge.data("id")]);
    console.log("source object :", nodesById[nodesById[clickedEdge.data("id")].source_id]);
    console.log("target object :", nodesById[nodesById[clickedEdge.data("id")].target_id]);
    });

    this.cy.on('mouseover','edge',function(event)  //mouseover displays the extended_name as label
    {
    let edge = nodesById[event.target.data("id")];
    event.target.style({'label': edge.extended_name }).update 
    }) ;

    this.cy.on('mouseout', 'edge', function(event)    //mouseout displays the name as label
    {
      let edge = nodesById[event.target.data("id")];
      event.target.style({'label': edge.name}).update 
    });
  };

  //////////////////INPUT BOX EVENTS//////////////////
    // console.log(this.cy.nodes())
  onInput(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toUpperCase();
console.log(this.cy.nodes().edges());

    for (const node of Array.from(this.cy.nodes())) {

      node.css('opacity', node.css().label.includes(searchTerm) ? '1' : '0.3');
      node.css('color', node.css().label.includes(searchTerm) ? '#0011ff': 'black');

      if(searchTerm === ''){   //if search box is empty, then returns to original style
        // node.css('opacity','1');
        node.css('color', 'black');
  }
    }

  }  
  //////////////////SELECT BOX EVENTS//////////////////
  layoutOption: string = 'grid';
  layoutOptionChange(newVal: string) {
    if (newVal ==='gridcol=1'){   //example of a layout with options. Not found a better solution yet than to add them manually
      console.log("cc")
      this.cy.layout({ name : 'grid', cols: 1 }).run();
    }
    else if (newVal == 'gridrow=1'){   //example of a layout with options. Not found a better solution yet than to add them manually
      this.cy.layout({ name : 'grid', rows: 1 }).run();
    }
    else {
      this.cy.layout({ name: "null" }).run(); //somehow resets the layout
      this.cy.layout({ name: newVal }).run();
  }
  }
}

