class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def solve(node):                        # (rob, skip)
            if not node:
                return 0, 0
            lr, ls = solve(node.left)
            rr, rs = solve(node.right)
            return node.val + ls + rs, max(lr, ls) + max(rr, rs)
        return max(solve(root))
