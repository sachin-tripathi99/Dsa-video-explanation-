class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        sums = []

        def dfs(n, d):
            if not n:
                return
            if d == len(sums):
                sums.append(0)
            sums[d] += n.val
            dfs(n.left, d + 1)
            dfs(n.right, d + 1)

        dfs(root, 0)
        return sums.index(max(sums)) + 1        # first maximum
