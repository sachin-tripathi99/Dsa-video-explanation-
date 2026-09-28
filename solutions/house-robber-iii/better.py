class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        memo = {}

        def best(node):
            if not node:
                return 0
            if node in memo:
                return memo[node]               # solved before
            take = node.val
            if node.left:
                take += best(node.left.left) + best(node.left.right)
            if node.right:
                take += best(node.right.left) + best(node.right.right)
            memo[node] = max(take, best(node.left) + best(node.right))
            return memo[node]

        return best(root)
