from collections import deque

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        q, best, ans, level = deque([root]), float("-inf"), 1, 1
        while q:
            s = 0
            for _ in range(len(q)):
                n = q.popleft()
                s += n.val
                if n.left:
                    q.append(n.left)
                if n.right:
                    q.append(n.right)
            if s > best:                        # strict: smallest level on ties
                best, ans = s, level
            level += 1
        return ans
