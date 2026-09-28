class Solution:
    def longestZigZag(self, root: Optional[TreeNode]) -> int:
        best = 0

        def solve(node):                        # (start going left, start going right)
            nonlocal best
            if not node:
                return -1, -1
            l, r = solve(node.left), solve(node.right)
            res = (1 + l[1], 1 + r[0])          # the child must turn next
            best = max(best, *res)
            return res

        solve(root)
        return best
