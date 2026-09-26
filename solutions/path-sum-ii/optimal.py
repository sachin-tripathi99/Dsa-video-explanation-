class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        out, path = [], []

        def dfs(n, remain):
            if not n:
                return
            path.append(n.val)
            remain -= n.val
            if not n.left and not n.right and remain == 0:
                out.append(path[:])             # copy matches only
            dfs(n.left, remain)
            dfs(n.right, remain)
            path.pop()

        dfs(root, targetSum)
        return out
