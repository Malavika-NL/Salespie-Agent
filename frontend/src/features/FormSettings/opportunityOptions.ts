export interface OpportunityOptionNode {
  category: string;
  subdivisions?: OpportunityOptionNode[];
}

const cleanValue = (value?: string | null) => (value || '').trim();

const cloneNodes = (nodes: OpportunityOptionNode[] = []): OpportunityOptionNode[] =>
  nodes.map((node) => ({
    category: node.category,
    subdivisions: node.subdivisions ? cloneNodes(node.subdivisions) : undefined,
  }));

const ensureSelectedPath = (
  nodes: OpportunityOptionNode[],
  path: Array<string | null | undefined>
) => {
  let currentNodes = nodes;

  path
    .map(cleanValue)
    .filter(Boolean)
    .forEach((segment) => {
      let node = currentNodes.find((item) => item.category === segment);
      if (!node) {
        node = { category: segment };
        currentNodes.push(node);
      }

      if (!node.subdivisions) {
        node.subdivisions = [];
      }

      currentNodes = node.subdivisions;
    });
};

export const buildOpportunityHierarchy = (
  baseNodes: OpportunityOptionNode[] = [],
  path: Array<string | null | undefined> = []
): OpportunityOptionNode[] => {
  const cloned = cloneNodes(baseNodes);
  ensureSelectedPath(cloned, path);
  return cloned;
};

export const buildOpportunityNames = (
  configuredNames: string[] = [],
  hierarchyNodes: OpportunityOptionNode[] = [],
  currentOpportunity?: string | null
): string[] =>
  Array.from(
    new Set(
      [...configuredNames, ...hierarchyNodes.map((node) => node.category), cleanValue(currentOpportunity)].filter(Boolean)
    )
  );
