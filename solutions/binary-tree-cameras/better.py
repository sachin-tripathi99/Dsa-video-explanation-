class Solution:
    def minCameraCover(self, root: Optional[TreeNode]) -> int:
        INF = float("inf")

        def solve(node):                        # (camera here, covered w/o camera, not covered)
            if not node:
                return INF, 0, 0
            l, r = solve(node.left), solve(node.right)
            cam = 1 + min(l) + min(r)
            covered = min(l[0] + min(r[0], r[1]), r[0] + min(l[0], l[1]))
            not_covered = l[1] + r[1]
            return cam, covered, not_covered

        c = solve(root)
        return min(c[0], c[1])                  # root must be covered
