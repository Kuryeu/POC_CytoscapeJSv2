export interface IData {
  source_id:number,     //all data fields about SOURCE NODES
  source_name:string,
  source_expert_name?:any,
  source_label?:any,
  source_description?:any,
  source_pole?:any,
  source_color:string,
  source_type_name?:string,
  source_type_description?:string,
  source_fip_address1?:any,
  source_fip_address2?:any,
  source_path?:string,

  target_id:number,     //all data fields about TARGET NODES
  target_name:string,
  target_expert_name?:any,
  target_label?:any,
  target_description?:any,
  target_pole?:any,
  target_color:string,
  target_type_name?:string,
  target_type_description?:string,
  target_fip_address1?:any,
  target_fip_address2?:any,
  target_path?:string,

  connection_id:number,   //all data fields about the connection
  connection_type_name?:string,
  connection_type_description?:string,
  connection_label?:any,
  connection_description?:any,
  connection_colour:string,

  cable_name?:any,
  cable_length?:any,
  cable_type?:any,

  circuit_name?:string,
  circuit_type_description?:string,

  valid_from_day?:string,    //metadata?
  valid_from_day_label?:string,
  expiry_day?:string,
  expiry_day_label?:string,

}
