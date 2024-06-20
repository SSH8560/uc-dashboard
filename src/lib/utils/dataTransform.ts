type NodeId = string | number;

export function makeFlatTree<T extends { id: NodeId; parent: NodeId | null }>(
  dataList: T[]
) {
  type Node = T & { children: NodeId[] };
  const nodes: { [key: string]: Node } = {};
  const results: Node[] = [];

  // 노드 초기화
  for (const data of dataList) {
    const node: Node = { ...data, children: [] };
    nodes[data.id] = node;
  }

  // 부모-자식 관계 설정
  for (const data of dataList) {
    const currentCategoryNode = nodes[data.id];
    if (data.parent !== null) {
      // null을 명확하게 비교
      console.log(data.parent);
      const parentCategoryNode = nodes[data.parent];
      if (parentCategoryNode) {
        parentCategoryNode.children.push(currentCategoryNode.id);
      }
    }
    results.push(currentCategoryNode);
  }

  return results;
}
