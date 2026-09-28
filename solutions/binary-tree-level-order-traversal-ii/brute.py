class Solution:
    def levelOrderBottom(self, root: Optional[TreeNode]) -> List[List[int]]:
        def height(n):
            return 0 if not n else 1 + max(height(n.left), height(n.right))

        def collect(n, depth, target, level):   # a full traversal per level
            if not n:
                return
            if depth == target:
                level.append(n.val)
                return
            collect(n.left, depth + 1, target, level)
            collect(n.right, depth + 1, target, level)

        out = []
        for d in range(height(root) - 1, -1, -1):   # deepest level first
            level = []
            collect(root, 0, d, level)
            out.append(level)
        return out
