import type { LayoutOptions } from 'elkjs'

export  const elkOptions: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.alignment': 'CENTER',
  'elk.nodePlacement.strategy': 'center',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.core.options.SizeOptions': 'ASYMMETRICAL',
  'elk.edgeRouting': 'SPLINES',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',

  // Spacing for a cleaner layout
  'elk.spacing.nodeNode': '100',
  'elk.layered.spacing.nodeNodeBetweenLayers': '140',
  'elk.spacing.edgeNode': '140',
  'elk.spacing.edgeEdge': '40',
  'elk.spacing.edgeLabel': '60',
}
