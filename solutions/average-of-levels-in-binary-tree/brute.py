class Solution:
    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:
        total, cnt = [], []

        def dfs(n, d):
            if not n:
                return
            if d == len(total):
                total.append(0)
                cnt.append(0)
            total[d] += n.val
            cnt[d] += 1
            dfs(n.left, d + 1)
            dfs(n.right, d + 1)

        dfs(root, 0)
        return [s / c for s, c in zip(total, cnt)]
