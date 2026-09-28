class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        out = []

        def dfs(n, depth):
            if not n:
                return
            if depth == len(out):
                out.append([])                  # first node at this depth
            out[depth].append(n.val)
            dfs(n.left, depth + 1)
            dfs(n.right, depth + 1)

        dfs(root, 0)
        return out
