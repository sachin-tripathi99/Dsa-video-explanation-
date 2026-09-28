class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        seen = set()

        def dfs(n):
            if not n:
                return False
            if k - n.val in seen:
                return True                     # partner seen earlier
            seen.add(n.val)
            return dfs(n.left) or dfs(n.right)

        return dfs(root)
