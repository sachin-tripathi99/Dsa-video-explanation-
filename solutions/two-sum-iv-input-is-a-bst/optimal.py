class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        lo, hi = [], []
        n = root
        while n:
            lo.append(n)                        # smallest on top
            n = n.left
        n = root
        while n:
            hi.append(n)                        # largest on top
            n = n.right
        while lo and hi and lo[-1] is not hi[-1]:
            s = lo[-1].val + hi[-1].val
            if s == k:
                return True
            if s < k:                           # next smallest
                n = lo.pop().right
                while n:
                    lo.append(n)
                    n = n.left
            else:                               # next largest
                n = hi.pop().left
                while n:
                    hi.append(n)
                    n = n.right
        return False
