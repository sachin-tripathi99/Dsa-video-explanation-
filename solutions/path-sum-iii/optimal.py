from collections import defaultdict

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        seen = defaultdict(int)
        seen[0] = 1                             # empty prefix: paths from the root
        count = 0

        def dfs(n, cur):
            nonlocal count
            if not n:
                return
            cur += n.val
            count += seen[cur - targetSum]      # paths ending at n
            seen[cur] += 1
            dfs(n.left, cur)
            dfs(n.right, cur)
            seen[cur] -= 1                      # leaving this branch

        dfs(root, 0)
        return count
